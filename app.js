//carregando modulos

const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
//const mongoose = require('mongoose');

//Configurações
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());

    //Handlebards - Template engine
        app.engine('handlebars', handlebars({extname: 'handlebars', defaultLayout: 'main', layoutsDir: './views/layouts'}));
        app.set('view engine', 'handlebars');

    //Mongoose
        //Em breve...

//Rotas


//Outros
const PORT = 8082;

app.listen(PORT, () => {
    console.log("Servidor rodando...")
});