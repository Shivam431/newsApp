const express = require('express')
const router = express.Router()


router.post('/delete-article',(req,res) => {

  res.send("under construction!");

})

router.get('/add-article',(req,res) => {
  res.render('add-article')
})

router.post('/add-article',(req,res) => {

  let title = req.body.title
  let description = req.body.description
  let userId = req.session.user.userId

  db.none('INSERT INTO articles(title,body,userid) VALUES($1,$2,$3)',[title,description,userId])
  .then(() => {
    res.send("SUCCESS")
  })

})


router.post('/update-article',(req,res) => {

 res.send("under construction!");
})

router.get('/articles/edit',(req,res) => {

  //let articleId = req.params.articleId;

  res.send("under construction!");

})
/*
router.get('/articles',(req,res) => {
    console.log("user id in artices:"+req.session.user.userId);
  let userId = req.session.user.userId;
  //console.log("user id in artices:"+userId);

  db.any('SELECT title,body FROM articles WHERE userid = $1',[userId])
  .then((articles) => {
    res.render('articles',{articles: articles})
  })
//res.send("success");

})*/

router.get('/articles',async (req,res) => {
// console.log("user id in artices:"+req.session.user.userId);
let userId = req.session.user.userId;
//console.log("user id in artices:"+userId);
let articles = await db.any('SELECT title,body FROM articles WHERE userid = $1',[userId]);
res.render('articles',{articles: articles})
//res.send("success");
})
module.exports = router
