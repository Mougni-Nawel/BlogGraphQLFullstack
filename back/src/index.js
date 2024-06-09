const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors');
const Sequelize = require('sequelize');
const config = require('./config/config.js')[process.env.NODE_ENV || 'development'];
const router = require('./routes/index.js');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const db = require("./models");
const typeDefs =require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');
const verifyToken = require('./helpers/verifyToken');
const multer = require('multer');

const initApplication = async() => {
    app.use(cors())
    app.options(process.env.FRONTEND_URL, cors());
    app.use(express.json());

    const sequelize = new Sequelize(config.database, config.username, config.password, {
        port: config.port,
        host: config.host,
        dialect: config.dialect,
        dialectOptions: {
            connectTimeout: 60000
        }
    });

    sequelize.sync()
        .then(() => {
            console.log('database synchronised');
        })
        .catch(err => {
            console.error('database synchronisation error :', err);
        });
    
    await db.sequelize.sync();

    app.get("/", (req, res) => {
        res.send("Welcome to my API");
    })

    app.use("/api", router);

  
    const serverGraphQL = new ApolloServer({
        //à passer : les types (typagesdes entités et des resolvers (controllers))
        // Les resolvers : les fonctions du CRUD
            // Query : GET / READ
        // Mutation : POST / CREATE / PUT / UPDATE / DELETE
        typeDefs,
        resolvers
    })

    await serverGraphQL.start();

    app.use(expressMiddleware(serverGraphQL, {
        path: '/graphql',
        context: ({ req }) => {
            // "Bearer ertyuiop^poiuytfdsdfgyuiop"
            let user = null;
            const token = req.headers.authorization?.split(' ')[1];
            // ["Bearer", "ertyuiop^poiuytfdsdfgyuiop"]
            if (token && typeof token === "string") { 
                user = verifyToken(token);
            }
            return {
                user: user
            }
        }
    }));

    app.listen(process.env.PORT, () => {
        console.log(`server launch on port ${process.env.PORT}`);
    });
}

initApplication();