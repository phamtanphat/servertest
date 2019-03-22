const express = require('express');
const app = express();
const { User } = require('./user');
const {json} = require('body-parser');
const { hash , compare } = require('bcrypt');
const faker = require('faker');
const uuid = require('uuid');

const{verifyPromise,signPromise} = require('./jwt');
app.use(json());

app.get('/user' ,(req,res) =>{
    User.find({})
    .then(user => res.send(user));
});

app.post('/user/signup' , async (req,res) =>{
    try{
        const { name , email , password} = req.body;
        const encrypt = await hash(password,8);
        const user = new User({email , name , password : encrypt});  
        await user.save(); 
        res.send({success : true ,user});
    }catch(error){
        res.status(400).send({success : false , message : error.message});
    }
});

app.post('/user/signin' , async (req,res) =>{
    try{
        const { name , email , password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).send({success :false , message : 'INVALID_USER_INFO'})
        }
        const same = compare(password , user.password);
        if(!same){
            return res.status(400).send({success :false , message : 'INVALID_USER_INFO'})            
        }
        const token = await signPromise({_id : user.id});
        const userInfo = user.toObject();
        userInfo.password = undefined;
        userInfo.token = token;
        res.send({success : true ,user : userInfo});
    }catch(error){
        res.status(400).send({success : false , message : 'INVALID_USER_INFO'});
    }
});
app.post('/user/check' , async (req,res) =>{
    try{
        const { token } = req.body;
        const { _id } = await verifyPromise(token);
        const user = await User.findOne({_id});
        if(!user) {
            return res.status(400).send({success :false , message : 'INVALID_USER_INFO'})
        }
        const newtoken = await signPromise({_id : user.id});
        const userInfo = user.toObject();
        userInfo.password = undefined;
        userInfo.token = newtoken;
        res.send({success : true ,user : userInfo});
    }catch(error){
        res.status(400).send({success : false , message : error.message});
    }
});

app.get('/singer' , (req,res) =>{
    const singers = [];
    for(let i = 0 ; i < 4 ; i++){
        const name = faker.name.firstName();
        const singer = {
            id : uuid(7),
            name,
            avatar : faker.internet.avatar(),
            email : faker.internet.email(name)
        };
        singers.push(singer);    
    }
    res.send({singers});
});
app.listen(process.env.PORT || 3000 , () => console.log()); 

