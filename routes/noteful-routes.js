const express= require('express');
const notefulRoute = express.Router();
const bodyParser = express.json();

//get and post folders 
notefulRoute.route('/folders')
.get((req,res,next)=>{
    res.send("get Folders")
})
.post((req,res,next)=>{
res.send("post folders")
})

//get patch and delete folders by id
notefulRoute
.route('/folders/:id')
.get((req,res,next)=>{
    res.send("get Folders by id")
})
.patch((req,res,next)=>{
    res.send("patch folders by id")
})
.delete((req,res,next)=>{
    res.send("delete folders by id")
})



module.exports=notefulRoute;
