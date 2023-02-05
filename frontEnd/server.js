const express = require('express');
const serveStatic=require('serve-static');

var hostname="localhost";
var port=3000;

var app=express();

app.use(serveStatic(__dirname+"/public")); //excesses the public folder of frontend

app.listen(port,hostname,function(){
    console.log(`Server hosted at http://${hostname}:${port}`);
});

// app.use(function(req,res,next){
//     if(req.method!="GET"){
//         res.type('.html');
//         var msg="<html><body>This server only serves web pages with GET!</body></html>";
//         res.end(msg);
//     }else{
//         next();
//     }
// })