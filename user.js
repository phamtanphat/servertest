const mongoose = require('mongoose');
const faker = require('faker');
mongoose.connect('mongodb://databaseuserinfo:A123456&@ds117816.mlab.com:17816/databaseuser', {useNewUrlParser: true})
.then(() => console.log('Database connect'))
.catch(error => console.log(error));

const userSchema = new mongoose.Schema({
    email : {type : String , required : true , trim : true , unique : true},
    name : {type : String , required : true , trim : true},
    password : {type : String , required : true , trim : true},
    avatar : {type : String , required : true , default : faker.internet.avatar}
});

const User = mongoose.model("User" , userSchema);

module.exports = { User };