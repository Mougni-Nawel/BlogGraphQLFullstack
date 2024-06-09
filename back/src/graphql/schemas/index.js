const typeDefs = `
        type Post {
            id : ID!
            title: String!
            content: String!
            userId: ID!
            image: String!
        }
        type User {
            id : ID!
            username: String!
            email: String!
            password: String!
        }
        type ReturnUser {
            id : ID!
            username: String!
            email: String!
            token: String
            success: Boolean
        }
        type Comment {
            id : ID!
            content: String!
            userId: ID!
            postId: ID!
        }
        type ReturnComment {
            id : ID!
            content: String!
            userId: ID!
            postId: ID!
            username: String!
        }
        type Response {
            success : Boolean!
            message: String!
        }
        type JWT {
            token: String!
        }
        input FiltersInput {
            limit: Int
        }
        type Query {    
            getPosts(filters: FiltersInput): [Post]!
            getPost(id: ID!): Post
            getComments(postId: ID!): [ReturnComment]!
        }
        type Mutation {
            login(username: String!, password: String!): ReturnUser!
            saveUser(username: String!, email: String!, password: String!): ReturnUser!
            saveComment(content: String!, userId: ID!, postId: ID!): Comment!
            savePost(title: String!, content: String!, userId: ID!, image: String!): Post!
            updatePost(id: ID!, title: String, content: String, image: String, userId: Int): Post!
            deletePost(id: ID!): Response!
        }
    `;

module.exports = typeDefs;