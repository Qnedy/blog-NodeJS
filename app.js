//carregando modulos

const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const admin = require('./routes/admin');
const user = require('./routes/usuario');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/auth')(passport);

require('./models/Postagem');
const Postagem = mongoose.model('postagens');

require('./models/Categoria');
const Categoria = mongoose.model('categorias');



//Configurações

    //Session
        app.use(session({
            secret: "keyofsession",
            resave: true,
            saveUninitialized: true
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(flash());

    //Middlewarr
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            res.locals.error = req.flash('error');
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
app.get('/', (req, res) => {
    Postagem.find().populate('categoria').sort({date: 'desc'}).then((postagens) => {
        res.render('index', {postagens: postagens});

    }).catch((err) => {
        req.flash('error_msg', "Não foi possível carregar a lista de postagens:" + err);
        res.redirect('/admin');
    });
});

app.get('/categorias/list', (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render('categoria/index', {categorias: categorias});
    }).catch((err) => {
        req.flash('error_msg', "Não foi possível carregar a lista de categorias:" + err);
        res.redirect('/');
    });
});

app.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({slug: req.params.slug}).then((categoria) => {
        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens) => {
                res.render('categoria/postagens', {postagens: postagens, categoria: categoria});
            }).catch((err) => {
                req.flash('error_msg', "Houve um erro ao listar as postagens: " + err);
                res.redirect('/');
            });
        }else{
            req.flash('error_msg', "Categoria não encontrada.");
            res.redirect('/');
        }
    }).catch((err) => {
        req.flash('error_msg', "Categoria não encontrada: " + err);
        res.redirect('/');
    });
});

app.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({slug: req.params.slug}).then((postagem) => {
        if(postagem){
            res.render('postagem/index', {postagem: postagem});
        }else{
            req.flash('erros_msg', "Essa postagem não existe.");
            res.redirect('/');
        }
    });
});

app.use('/admin', admin);

app.use('/user', user);

//Outros
const PORT = 8082;

app.listen(PORT, () => {
    console.log("Servidor rodando...")
});