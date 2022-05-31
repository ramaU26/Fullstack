const express = require("express");
const cors = require("cors");
const cookie_parser = require('cookie-parser');
const expressSession = require ("express-session");
const File = require("session-file-store")(expressSession)
const {config} = require("./config");
const path = require("path")

const db = require("./database");
const controllers = require("./controllers");
const req = require("express/lib/request");

const app = express();

/* ingreso de usario*/


const getName = req => req.session.name ? `${req.session.name},` : '';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookie_parser("secret"));
app.use(expressSession({
    secret: config.SECRET_KEY_SESSION,
    resave: true,
    saveUninitialized: true,
    store : new File({path: "./sessiones", ttl:300, retries:0})
}));



/* get */
app.get("/products", controllers.getProducts);
app.get("/products-cart", controllers.getProductsCart);

/* cookie */
app.get('/get',(req,res, next)=>{
    try{
        res.json({response:{
            signed: [req.signedCookies],
            Nosigned: [req.cookies]
        }})
    } catch (error){
        console.log(error);
    }
})
/* expressSession */
app.get('/',(req, res,next)=>{
    try{
        let{ name }= req.query;
        if(req.session.contador){
            req.session.contador++;
            res.send(`${getName(req)}Tienes ${req.session.contador} visitas `);

        }else{
            if(name) req.session.name = name;
            req.session.contador = 1;
            res.send(`<h1><b>${getName(req)}Welcome<b></h1>`)
        }
    } catch(error) {
        console.log(error);
    }
});





/* post */
app.post("/products-cart",function(req, res){ 
    controllers.addProductsCart
});
/* cookie */
app.get('/post-cookie',(req,res, next)=>{
    try{
       let {key, value, signed, tiempo} = req.query;
       if(!key || !value) return res.json({response: "[ERROR] - Mal completado!"});
       let obj = {};
       if(signed) obj.signed = true
       if(tiempo) obj.maxAge = Number(tiempo) * 1000
       res.cookie(key, value, obj).json({response:true})
    } catch (error){
        console.log(error);
    }
});







/*PUT*/
app.put("/products-cart/:productId", controllers.putProduct);









/*DELETE*/
app.delete("/products-cart/:productId", controllers.deleteProduct);
/* cookie */
app.get('delete/:name',(res,req, next)=>{
    try{
        let { name } = req.params;
        if(!name) return res.json({response: "[ERROR] - Error al completar!"});
        res.clearCookie(name).json({response:true});
    } catch (error){
        console.log(error);
    }
})

/* expressSession */
app.get('/olvidar',(req, res,next)=>{
    try{
        let name =` ${getName(req)}`;
        req.session.destroy(err=>{
            if(err) return res.send("Hubo un error!!");
            res.send(` ${ name } Olvidado`)
        })
    
    } catch(error) {
        console.log(error);
    }
});










/* preuba de ussers*/ 

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set("views", path.join(__dirname, 'views', 'ejs'));
app.set("view engine", "ejs");


let usuarios= [];


let isLogin = (req, res, next)=>{
    try {
        if(req.session.user){
            next();
        }else{
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
    }
}

let isNotLogin = (req, res, next)=>{
    try {
        if(!req.session.user){
            next();
        }else{
            res.redirect("/datos");
        }
    } catch (error) {
        console.log(error);
    }
}

app.get("/registro", isNotLogin, (req,res,next)=>{
    res.render("registro", {});    
});

app.get("/login", isNotLogin, (req,res,next)=>{
    res.render("login", {});
});

app.get("/datos", isLogin, (req,res,next)=>{
    res.render('datos', {usuario: req.session.user} );
});

app.get("/error", isNotLogin, (req,res,next)=>{
    res.render("error",{error:"Estamos en error!"});
});


app.get("/logout", (req,res,next)=>{
    req.session.destroy(err =>{
        if(err) return res.send(JSON.stringify(err));
        res.redirect("/registro");
    })
});


// Métodos post
app.post("/registro", (req,res,next)=>{
    try {
        let { username,  password, telefono} = req.body;
        let usuario = usuarios.find(user => user.username == username);
        if(usuario)return res.json({"Error": "El usuario ya existe!"});
        const user = {
            username, password, telefono
        }
        usuarios.push(user);
        req.session.user = user;
        res.redirect("/datos");
    } catch (error) {
        console.log(error);
    }
});

app.post("/login", (req,res,next)=>{
    try {
        let { username,  password } = req.body;
        let usuario = usuarios.find(user => user.username == username);
        if(!usuario)return res.json({"Error": "El usuario NO existe!"});
        if(usuario.password == password) {
            req.session.user = usuario;
            return res.redirect("/datos");
        }
        return res.json({"Error": "Tus datos no coinciden"});
    } catch (error) {
        console.log(error);
    }
});

app.listen(config.port, ()=>{
    console.log(`Server on http://localhost:${config.port}`);
    db()
})


module.exports = app;
