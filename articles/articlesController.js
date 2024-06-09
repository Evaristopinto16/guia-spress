const express =  require("express");
const router = express.Router();
const Category = require('../categories/category');
const Articles = require('./Articles')
const slugify = require("slugify")

//Router get
//view to add articles with categories

router.get('/admin/aricles/new', (req,res)=>{
    Category.findAll().then(Category =>{
    res.render('admin/articles/new', {categories: Category})
        
    }).catch((error)=>{
        console.log('quebrou aplicação: ', error)
    })
})

router.get('/admin/aricles', (req, res)=>{
    Articles.findAll({
        include: [{
            model: Category
        }]
    }).then(articles=>{
        console.log(articles)
        res.render("admin/articles/index", {artigos: articles})
    }).catch(error=>{
        console.error('quebrou aplicação: ', error);
        res.redirect('/admin/aricles')
    })
    
})
//Nethod pos
router.post('/admin/aricles/save', (req, res)=>{
    let date = req.body
    console.log(date)

    if(date != undefined){
        Articles.create({
            title: date.title,
            body: date.body,
            slug: slugify(date.title),
            categoryId: date.category
        }).then(()=>{
            res.redirect('/')
        }).catch((error)=> {
            console.error('aplicação quebrou: ', error)
            res.redirect('/admin/aricles/new')
        })
    }else{
        res.redirect('/admin/aricles/new')
    }
})
module.exports = router