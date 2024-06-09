const db = require('../models/');
const bcrypt = require('bcrypt'); 
const generateToken = require("../helpers/generateToken");
const {comparePassword} = require("../helpers/comparePassword");


module.exports = {
  login: async ({ username, password }) => {
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
        throw new Error('No user found');
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
        throw new Error('Incorrect password');
    }

    const token = generateToken({ id: user.id });

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
        success: true
    };
  },

    saveUser: async (req, res) => {

        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };


        try {
        
            await db.User.create(user)

            .then(data => {
                res.send(data);
              })
              .catch(err => {
                res.status(500).send({
                  message:
                    err.message || "Some error occurred while creating the Tutorial."
                });
              });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    },

    updateUser: async (req, res) => {
        const id = req.params.id;

        try {
            if(isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Bad request. No id provided"
                });
            }

            await db.User.update(req.body, {
                where: {id: id}
            })

            .then(num => {
                if (num == 1) {
                  res.send({
                    message: "User was updated successfully."
                  });
                } else {
                  res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                  });
                }
              })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    },

    deleteUser: async (req, res) => {
        const id = req.params.id;

        try {
            if(isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Bad request. No id provided"
                });
            }

            await db.User.destroy({
                where: {id: id}
            })

            .then(num => {
                if (num == 1) {
                  res.send({
                    message: "User was deleted successfully."
                  });
                } else {
                  res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found !`
                  });
                }
              })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    },





}