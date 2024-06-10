const express = require("express")
const bodyParser = require("body-parser")
const connection = require("./database/database.js")
const CategoriesController= require("./categories/CategoriesController.js")
const ArticlesController = require('./articles/articlesController.js')
const Article = require('./articles/Articles.js')
const Category = require('./categories/category.js') 
const { where } = require("sequelize")

require("dotenv").config()
 
const app = express()

app.set("view engine", "ejs")

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

connection
.authenticate().then(()=>{
    console.log("conexao feita com sucesso ")
})
.catch((erro)=>{
    console.log("errrou databases ", erro)
})


app.use('/', CategoriesController)
app.use("/", ArticlesController)
app.get("/", (req, res)=>{
    Article.findAll({
        order: [
            ["id","DESC"]
        ]
    }).then((article)=>{
        Category.findAll().then(Category=>{
        res.render("index", {artigos: article, category: Category})

        })
    })
   
})
app.get('/:slug', (req, res)=>{
    let slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(Category=>{
                res.render("articles", {article: article, category: Category})
        
                })
            
        }else{
            res.redirect('/')
        }
    }).catch((error)=>{
        console.error('aplicação quebrou ', error)
        res.redirect('/')
    })
})

app.get('/category/:slug', (req, res)=>{
   let {slug} = req.params
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{
            model: Article
        }]
    }).then(category =>{
        if(category != undefined){
            Category.findAll().then(categor=>{
                res.render('index', {artigos: category.articles, category: categor} )
            })
        }else{
            res.redirect('/')
        }
    }).catch(error=>{
        console.error('aplicação quebrou: ', error)
        res.redirect('/')
    })
})

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log("servidor esta rodandndo", PORT)
})