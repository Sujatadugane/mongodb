require("dotenv").config();
const express =require("express");
const jwt =require("jsonwebtoken");
const bcrypt =require("bcrypt");
const bodyParse =require("body-parser");
const cors =require("cors");
var mongoose = require('mongoose');

const app=express();
app.use(express.json());
app.use(bodyParse.json());
app.use(cors());
let dburl = 'mongodb+srv://newproject:sonu2005@cluster0.uv0ls.mongodb.net/'
mongoose.connect(dburl)
  .then(() => console.log('db connected'))
  .catch((err) => console.log('DB connection error:', err));
const users=[];

app.post("/register", async(req, res)=>{


const {username, password}=req.body;

//validate input

if(!username ||! password){

return res.status(400).json({message: "Username and password are required"})
}

try{
    const hashedpassword =await bcrypt.hash(password,10);
    users.push({username,password:hashedpassword});
    res.json({message :"user registered succesfully!"});
}
catch (error) {
     res.status(500).json({message: "Error hashing password", error});
    
    }
     });


    //  login users

app.post("/login", async(req, res)=>{

const {username, password} =req.body;
const user =users.find(u => u.username=== username);

if(!user) return res.status(400).json({message: "User not found!"});

const isValid =await bcrypt.compare(password, user.password);
if (!isValid) return res.status(400).json({message: "User not found!"});

const token =jwt.sign({username}, process.env.JWT_SECRET,{expiresIn: "1h"})
res.json({token});
});


function authenticateToken (req, res, next) {
 const token=req.header("Authorization")?.split("")[1];
    if(!token) return res.status(401).json({message: "Access Denied"});
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
    if(err) return res.status(403).json({message: "Invalid Token"});
    req.user= user;
     next();
     });
     }
    
    // protected router
    
    app.get("/protected", authenticateToken, (req, res)=>{
    res.json({message: "welcome to the protected routel", user:req.user});
    });
    // start server

const PORT =process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));
    