'use strict';

const Hapi = require('@hapi/hapi');
var mango_connect = require('./db/dbconnect.js')
var routes = require('./routes/logic_routes.js');
var Joi = require('@hapi/joi')
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const basicAuth = require('@hapi/basic')
const Bcrypt = require('bcrypt');

// const mongoose = require('mongoose')
// mongoose.connect("mongodb://localhost:27017/testdb")
// const db = mongoose.connection

// db.on('error',(error)=>{
//     console.log("DB connection failure \n ",error)
// })


// db.once('open',()=>{
//     console.log("DB connection successful")
// })

const users = {
    admin: {
        username: 'admin',
        password: '$2b$10$G9XzrrWlT3UL6xLxuvypG.Z6Vfg7LqZertyh8H2m4YGDH2MkaZavi',
        pwd:"password",
        name: 'admin',
        id: '007',
        role:'admin'
        //accesstocken $2b$10$xBXuCXJ0Lx35XSIYTvWXL.jOrWZer4PVHe9Cg.l4p/n45BivZEl6S
    },
    guest: {
        username: 'guest',
        password: '$2b$10$BsfRnP/xyMdv4mV9t0fthelr.Bvwtoct4L9TWKhX5zJ4u4w.QXRUa',
        pwd:"password",
        name: 'guest',
        id: '007',
        role:'guest'
        //accesstocken $2b$10$koGX9Dbl6hP6chP7BA9OWejxuBFXzJiFwH/OmSGzlD0kKla7k7kTq
    }
};

const validate = async (req, username, password, resp) => {
    if (username === 'help') {
        return { response: users };     // custom response
    }
    const user = users[username];
    if (!user) {
        return { credentials: null, isValid: false };
    }

    /*
    // let hsah = await Bcrypt.hash(users.admin.username+users.admin.pwd,10)
    // console.log("admin",hsah)
    // hsah = await Bcrypt.hash(users.guest.username+users.guest.pwd,10)
    // console.log("guest",hsah)
    // hsah = await Bcrypt.hash(users.admin.username+users.admin.role,10)
    // console.log("admin role",hsah)
    // hsah = await Bcrypt.hash(users.guest.username+users.guest.role,10)
    // console.log("guest role",hsah)

    // let test = await Bcrypt.compare('adminpassword','$2b$10$0FpjtzNP/nh4B.ksp/u3iuugDXeTD3pT.MYDZVD92DXrvrGC5RTV2');
    // console.log(test)
    */

    console.log("authenticating...")
    const isValid = await Bcrypt.compare(username+password, user.password);
    console.log("authenticated... isValid user",isValid)
    let x_access_tocken = req.headers.x_access_tocken
    console.log(x_access_tocken)
    console.log("checking authorization...")
    const isAuthorized = await Bcrypt.compare(user.username+user.role,x_access_tocken);
    console.log("checking authorization completed isAuthorized for the service is ",isAuthorized)
    const credentials = { id: user.id, name: user.name,role:user.role };
    req.isValid = isValid
    req.credentials = credentials
    req.isAuthorized = isAuthorized
    return { isValid, credentials ,isAuthorized};
};


const init = async () => {

    const server = Hapi.server({
        port: 1234,
        host: '0.0.0.0'
    });

    await server.register(basicAuth);
    server.auth.strategy('simple', 'basic', { validate });


    server.route(routes);
    server.validator(Joi)

    const swaggerOptions = {
        info: {
            title: 'Theater ticket API Documentation',
            version: Pack.version,
            'contact': {
                'name': 'Karun',
                'email': 'karunpmenon@gmail.com'
            },
        },
        grouping: 'tags',
        payloadType: 'json'//,
        // tags: ["GET","POST","PUT","DELETE"]
    };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();