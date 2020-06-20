//jshint esversion:6
require('dotenv').config();
const express =  require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
    email:String,
    password: String
});
const secret = process.env.SECRET; 
userSchema.plugin(encrypt, { secret:secret, encryptedFields: ['password'] });//to encrypt certain field
const User = new mongoose.model("User",userSchema);//the encryption is done before making a new user

app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username},function(err,foundUser){//here the password gets decrypt and then login fields get checked
      if(err){
          console.log(err);
      }
      else{
          if(foundUser){
              if(foundUser.password === password){
                  res.render("secrets");
              }
          }
      }
    })
})
app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
     if(err){
         console.log(err);
     }else{
         res.render("secrets");
     }
    });
})
app.listen(3000,function(){
    console.log("server running on port 3000");
})
