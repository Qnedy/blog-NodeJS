const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

require('../models/Usuario');

const Usuario = mongoose.model('usuarios');



router.get('/cadastro', (req, res) => {
    res.render('user/cadastro');;
});

router.post('/cadastro/novo', (req, res) => {
    var erros = [];

    if(!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null){
        erros.push({texto: "Nome inválido."});
    };

    if(!req.body.email || req.body.email === undefined || req.body.email === null){
        erros.push({texto: "E-mail inválido."});
    };

    if(!req.body.senha || req.body.senha === undefined || req.body.senha === null){
        erros.push({texto: "Senha inválida."});
    };

    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta."});
    };
    

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas não são iguais."});
    };


    if(erros.length > 0){
        res.render('user/cadastro', {erros: erros});
        
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash('error_msg', "Email já cadastrado.");
                res.redirect('/user/cadastro');
            }else{
                const novoUser = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUser.senha, salt, (erro, hash) => {

                        if(erro){
                            req.flash('error_msg', "Houve um erro durante o salvamento: " + erro);
                            res.redirect('/');
                        }else{
                            novoUser.senha = hash;
                            novoUser.save().then(() => {
                                req.flash('success_msg', "usuário criado com sucesso!");
                                res.redirect('/user/cadastro');
                            }).catch((err) => {
                                req.flash('error_msg', "usuário não pôde ser criado, tente novamente.");
                                res.redirect('/');
                            });
                        }
                        
                    });
                });
            };
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro interno");
            res.redirect('/');
        });
        
    };
    
});

module.exports = router;