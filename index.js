const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app= express();
dotenv.config();

const port=process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);

const uri = `mongodb+srv://${username}:${password}@cluster0.uxia9i0.mongodb.net/registrationFormDB?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri)
    .then(() => {
        console.log('MongoDB connected...');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

const registerationSchema = new mongoose.Schema({
    name : String,
    email: String,
    password: String
});

const Registration = mongoose.model("Registration",registerationSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");
})

app.post("/register",async(req,res)=>{
    try{
        const{name, email, password }=req.body;

        const exsistingUser = await Registration.findOne({email : email});
        if(!exsistingUser){
            const registrationData =new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else{
            console.log("User already exsist");
            res.redirect("/error");
        }
    }
    catch (error){
        console.log(error);
        res.redirect("/error");
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
})

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})