const db = require("../../models");
const cryptPassword = require("../../helpers/cryptPassword");
const ensureUserIsLogged = require("../validators");
const { login } = require("../../controllers/auth.controller");

const resolvers = {
    Query: {
        getPosts: async (parent, args, context, info) => {
            const posts = await db.Post.findAll();
            if (posts.length === 0) {
                const error = new Error("No posts found");
                error.extensions.code = "NOT_FOUND";
                return error;
            }
            return posts;
        },
        getComments: async (parent, {postId}, context, info) => {
          const comments = await db.Comment.findAll({
            where: { postId },
            include: [{ model: db.User, as: 'user' }]
          });


          if (comments.length === 0) {
              const error = new Error("No comments found");
              error.extensions.code = "NOT_FOUND";
              return error;
          }

          const commentsWithUsername = comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            userId: comment.userId,
            postId: comment.postId,
            username: comment.user.username
          }));
      
          return commentsWithUsername;
        },
        getPost: (parent, args, context, info) => {
            const post = db.Post.findByPk(args.id);
            return post;
        }

    },
    Mutation: {
        saveUser: async (parent, args, context, info) => {
          console.log(args, "ARGS");
          const { email, password, username } = args;
          const hashedPassword = await cryptPassword(password);
          if (hashedPassword) {
            const user = await db.User.create({
              username: username,
              email: email,
              password: hashedPassword
            });
            if (user) {
                return {
                  id: user.id,
                  username: user.username,
                  email: user.email,
                  success: true
                };
              
            }
          }
          throw new Error('User creation failed');
        },
        login: async (parent, args, context, info) => {
          return await login(args);
      },
      saveComment: async (parent, args, context, info) => {
        console.log(args, "ARGS");
        const { content, userId, postId } = args;
        const comment = await db.Comment.create({
          content: content,
          userId: userId,
          postId: postId
        });
        if (comment) {
            return {
              id: comment.id,
              content: comment.content,
              userId: comment.userId,
              postId: comment.postId,
              success: true
            };      
        }
        throw new Error('Comment creation failed');
      },
      savePost: async (parent, args, context, info) => {
        console.log(args, "ARGS");
        const { title, content, userId, image } = args;
        const post = await db.Post.create({
          title: title,
          content: content,
          userId: userId,
          image: image
        });
        if (post) {
            return {
              id: post.id,
              content: post.content,
              title: post.title,
              userId: post.userId,
              image: post.image
            };      
        }
        throw new Error('Post creation failed');
      },
      updatePost: async (parent, args, context, info) => {
        const { id, title, content, image, userId } = args;
        try {
          const post = await db.Post.findByPk(id);
  
          if (!post) {
            throw new Error('Post not found', 'POST_NOT_FOUND');
          }
  
          if (userId && post.userId !== userId) {
            throw new Error('Unauthorized', 'UNAUTHORIZED');
          }
  
          const updatedPost = await post.update({
            title: title !== undefined ? title : post.title,
            content: content !== undefined ? content : post.content,
            image: image !== undefined ? image : post.image,
          });
  
          return updatedPost;
        } catch (error) {
          throw new Error(error.message, 'INTERNAL_SERVER_ERROR');
        }
      },
      deletePost: async (parent, args, context, info) => {
        try {
          const post = await db.Post.findByPk(args.id);
  
          if (!post) {
            return {
              success: false,
              message: 'Post not found',
            };
          }
  
          await post.destroy();
          return {
            success: true,
            message: 'Post deleted successfully',
          };
        } catch (error) {
          return {
            success: false,
            message: error.message,
          };
        }
      },
    
    }
}

module.exports = resolvers;