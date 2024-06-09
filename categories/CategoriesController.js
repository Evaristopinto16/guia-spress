const express = require('express')
const router = express.Router()
const Category = require("./category")
const slugify = require("slugify")


//Router Get

//get FindALL Category
router.get('/admin/categories',async (req, res)=>{
    await Category.findAll().then((categories)=>{
 
    res.render('admin/category/index', {categories: categories})
    
   })
 
   
})
router.get('/categories', (req, res)=>{
     res.send("rota de categorias ")
})

router.get('/admin/categories/new', (req, res)=>{

    res.render('admin/category/new')
})

//edit Categories
router.get("/admin/categories/:id", (req, res)=>{
    const id = req.params.id
    if(isNaN(id)){
        res.redirect('/admin/categories');
        
        
    }else{
        Category.findByPk(id).then((Category)=>{
            if(Category != undefined){
                res.render('admin/category/edit', {category: Category})
                 
            }else{
                res.redirect('/admin/categories')
            }
        }).catch((error)=>{
            console.log('quebrou aplicação: ', error)
            res.redirect('/admin/categories')
        })
    }
  
})

//ROUTER POST
//admin add categoria na db
router.post('/admin/category/save', (req, res)=>{
    const title = req.body.title
    
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect('/')
        }).catch((error)=>{
            console.log('quebrou aplicação: ', error)
        })
    }else{
        res.redirect('/admin/categories/new')
    }
})
///Update Categories in Db

router.post("/admin/categories/update", (req, res)=>{
    const {id, title} = req.body
   
    if(title != undefined){
        Category.update({title: title, slug: slugify(title)}, {
            where: {
                id
            }
        }).then(()=>{
            res.redirect('/admin/categories/')
        }).catch((error)=>{
            console.error('aplicação quebrou ', error)
            res.redirect('/admin/categories/')
        })

    }else{
        res.redirect(`/admin/categories/${id}`)
    }
    
})
//deleted categories in db

router.post('/admin/categories/delete', (req, res)=>{
    const id = req.body.id

    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect('/admin/categories')
            })

        }else{
            res.redirect('/admin/categories')
        }

    }else{
        res.redirect('/admin/categories')
    }
   
});
module.exports = router