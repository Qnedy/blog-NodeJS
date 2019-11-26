const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
require('../models/Postagem');
const Categoria = mongoose.model('categorias');
const Postagem = mongoose.model('postagens');

router.get('/', (req, res) => {
    res.render("admin/index");
});

router.get('/categorias', (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render('admin/categorias', {categorias: categorias});
    }).catch((err) => {
        req.flash('error_msg', "Não foi possível carregar a lista de categorias.");
        res.redirect('/admin');
    });
});

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias');
});

router.post('/categorias/nova', (req, res) => {
    

    var erros = [];

    if(!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null){
        erros.push({texto: "Nome inválido."});
    }

    if(!req.body.slug || typeof req.body.slug === undefined || req.body.slug === null){
        erros.push({texto: "Slug inválido"});
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria muito pequeno."});
    }

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros});
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', "Categoria criada com sucesso!");
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('error_msg', "Categoria não pôde ser criada, tente novamente.");
            res.redirect('/admin');
        });
    }

});

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id:req.params.id}).then((categoria) => {
        res.render('admin/editcategoria', {categoria: categoria});
    }).catch((err) => {
        req.flash('error_msg', "Essa categoria não existe.");
        res.redirect('/admin/categorias');
    });
    
});

router.post('/categorias/edit', (req, res) => {
    Categoria.findOne({_id:req.body.id}).then((categoria) => {
        console.log(categoria);
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;
        console.log(categoria);

        categoria.save().then(() => {
            req.flash('success_msg', "Categoria editada com sucesso.");
            res.redirect('/admin/categorias');

        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao editar a categoria.");
            res.redirect('/admin/categorias');
        });

    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao editar a categoria: " + err);
    });
});

router.post('/categorias/deletar', (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash('success_msg', "Categoria deletada com sucesso.");
        res.redirect('/admin/categorias');
    }).catch((err) => {
        req.flash('error_msg', "Categoria não pôde ser deletada.");
        res.redirect('/admin/categorias');
    });
});


//Rotas de postagem
router.get('/postagens', (req, res) => {

    Postagem.find().populate('categoria').sort({date: 'desc'}).then((postagens) => {
        res.render('admin/postagens', {postagens: postagens});

    }).catch((err) => {
        req.flash('error_msg', "Não foi possível carregar a lista de postagens:" + err);
        res.redirect('/admin');
    });
});

router.get('/postagens/add', (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('admin/addpostagens', {categorias: categorias});

    }).catch((err) => {
        req.flash('erros_msg', "Houve um erro ao carregar o formulário: " + err);
        res.redirect('/admin');
    });
});

router.post('/postagens/nova', (req, res) => {
    var erros = [];

    if(req.body.categoria == 0){
        erros.push({texto: "Categoria inválida, registre uma cateogira."});
    }

    if(erros.length > 0){
        res.render('admin/postagens', {erros: erros});
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        };

        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', "Postagem criada com sucesso.");
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro durante o salvamento da postagem: " + err);
            res.redirect('/admin/postagens');
        });

    }
});

router.get('/postagens/edit/:id', (req, res) => {
    Postagem.findOne({_id: req.params.id}).then((postagem) => {
        Categoria.find().then((categorias) => {
            res.render('admin/editpostagem', {categorias: categorias, postagem: postagem});


        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao carregar o a categoria." + err);
            res.redirect('/admin/postagens');
        });

    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao carregar o formulário de edição.");
        res.redirect('/admin/postagens');
    });
    
});

router.post('/postagens/edit', (req, res) => {
    Postagem.findOne({_id: req.body.id}).then((postagem) => {
        postagem.titulo = req.body.titulo;
        postagem.slug = req.body.slug;
        postagem.descricao = req.body.descricao;
        postagem.conteudo = req.body.conteudo;
        postagem.categoria = req.body.categoria;

        postagem.save().then(() => {
            req.flash('success_msg', "Postagem editada com sucesso.");
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao editar a postage: " + err);
            res.redirect('/admin/postagens');
        });

    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao editar a postage: " + err);
        res.redirect('/admin/postagens');
    });
});

module.exports = router;