const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Model usuario
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');


module.exports = function(passport){

    passport.use(new LocalStrategy({usernameField: 'email'}, (email, senha, done) => {
        Usuario.findOne({email: email}).then((usuario, err) => {
            if (err) { return done(err); }

            if(!usuario){
                return done(null, false, {message: "Esse usuário não existe."});
            }


            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                if(batem){
                    return done(null, user);
                }else{
                    return done(null, false, {message: "Senha inválida."});
                }
            });

        });
    }));

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, usuario) => {
            done(err, user);
        });
    });

};