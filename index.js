const express =require('express');
const app= express();
const mustacheExpress=require('mustache-express');
const bodyParser=require('body-parser');
const pgp= require('pg-promise')();
const bcrypt=require('bcrypt');
const session=require('express-session');
const PORT=8080;
const path=require('path');

//createing partials
const VIEWS_PATH= path.join(__dirname,'/views');
//register session

app.use(session({
    secret: 'firstnodeproject',
    resave: false,
    saveUninitialized: false
}))
//connect DB
const connectString="postgres://postgres:root@localhost:5432/newsdb";   //'postgres://username:password@host:port/database';
const db =pgp(connectString);

//encrypt password

const SALT_ROUND =10;

//configure view engine
app.engine('mustache',mustacheExpress(VIEWS_PATH+'/partials','.mustache'));
app.set('views',VIEWS_PATH);
app.set('view engine','mustache');

app.use(bodyParser.urlencoded({extended: false}));


app.get('/login',(req,res)=>{
    res.render('login');
})

app.post('/login',(req,res)=>{
    let username=req.body.username;
    let password=req.body.password;
    db.oneOrNone('SELECT userid,username,password FROM users WHERE username=$1',[username])
    .then((user)=>{
        if(user){
            bcrypt.compare(password,user.password,function(error,result){
                if(result){
                    //put username and user id in session
                    if(req.session){
                        req.session.user={userId: user.userid, username: user.username};
                    }
                    res.redirect('/users/article');
                }
                else{
                    res.render('login',{ message: "invalid credentials!"})
                }
            })
        }
        else{
            res.render('login',{ message: "user not exist!"})
        }
    })
})

app.get('/users/article',(req,res)=>{
    res.render('articles',{username: req.session.user.username});
})
app.post('/register',(req,res)=>{

    let username=req.body.username;
    let password=req.body.password;

    db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username])
    .then((user)=>{
        if(user) {
            res.render('register',{ message: "user already exist!"})
        }
        else{
            //insert user into the user table
            bcrypt.hash(password,SALT_ROUND,function(error,hash){
                if(error == null){
                    db.none('INSERT INTO users(username,password) VALUES($1,$2)',[username,hash])
                    .then(()=>{
                    res.send("SUCCESS");
                    })
                }
            })
            
        }
    })
})
app.get('/register',(req,res)=>{
    res.render('register');
})

app.get('/users/add-article',(req,res)=>{
    res.render('add-article');
})

app.post('/users/add-article',(req,res)=>{
    let title=req.body.title;
    let description=req.body.description;
    let userId= req.session.user.userId;
    db.none('INSERT INTO articles(title,body,userid) VALUES($1,$2,$3)',[title,description,userId])
    .then(()=>{
        res.send("success!")
    })
})
app.listen(PORT,()=>{
    console.log("server started at "+PORT);
})