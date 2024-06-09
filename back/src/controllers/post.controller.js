const db = require('../models/');

module.exports = {

    getPosts: async (req, res) => {
        try {
            const posts = await db.Post.findAll({
                limit: req.query.limit ? parseInt(req.query.limit) : 6,
            });
            if (posts.length === 0) { 
                return res.status(404).json({
                    success: false,
                    message: "No posts found"
                });
            }
            return res.status(200).json({
                results: posts,
                success: true
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    getPost: async (req, res) => { 
        try {
            if (isNaN(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: "Bad request. No valid ID provided"
                });
            }
            const post = await db.Post.findByPk(req.params.id);
            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found"
                });
            }
            return res.status(200).json({
                results: post,
                success: true
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
};
