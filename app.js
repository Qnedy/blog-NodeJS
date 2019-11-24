//carregando modulos

const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const admin = require('./routes/admin');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

//Configurações

    //Session
        app.use(session({
            secret: "keyofsession",
            resave: true,
            saveUninitialized: true
        }));

        app.use(flash());

    //Middlewarr
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            next();
        });

    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());

    //Handlebards - Template engine
        app.engine('handlebars', handlebars({extname: 'handlebars', defaultLayout: 'main', layoutsDir: './views/layouts'}));
        app.set('view engine', 'handlebars');

    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/blogapp').then(() => {
            console.log("Conectado ao mongo.");
        }).catch((err) => {
            console.log("Erro ao se conectar ao mongo: " + err);
        });

    //Public
        app.use(express.static(path.join(__dirname, "public"))); //dizendo pro express q public e a pasta de arquivos estáticos

        //Middleware
        app.use((req, res, next) => {
            console.log("Chamou middleware!");
            next();
        });
//Rotas
app.use('/admin', admin);

//Outros
const PORT = 8082;

app.listen(PORT, () => {
    console.log("Servidor rodando...")
});