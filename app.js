require('dotenv').config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const mongooseEncryp=require("mongoose-encryption");
mongoose.connect("mongodb://0.0.0.0:27017/userDb");

const userSchema=new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(mongooseEncryp,{secret:process.env.SECRET,encryptedFields:["password"]});

const User= new mongoose.model("user",userSchema);

const app=express(); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.get("/",function (req,res) {
    res.render("home");
});

app.get("/login",function (req,res) {
    res.render("login");
});

app.get("/register",function (req,res) {
    res.render("register");
})

app.post("/register",function (req,res) {
    const newUser= new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function (err) {
        if (!err) {
            res.render("secrets");
        } else {
            console.log(err);
        }
    });
});

app.post("/login",function (req,res) {
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username},function (err,results) {
        if (err) {
            console.log(err);
        } else {
            if (results) {
                if (results.password === password) {
                    res.render("secrets");
                } else {
                    console.log("Wrong password");
                };
            };
        };
    });
});


app.listen(3000, function () {
    console.log("Server started on port 3000");
});