// Dependencies 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port  = 3000;
// Databse connectivity with MongoDB

mongoose.connect('mongodb://ankit:1234567890@ds012198.mlab.com:12198/medicine_database');

//Express setup

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Setting server to accept cross-origin browser request

app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });

//Routes 

app.get('/', (req,res,nest)=>{
  
  res.send("Welcome to Medicine analyser server !! Created by Ankit");
 
});


app.use('/User_Personal_Details',require('./Routes/User_Personal_Details'));

app.use('/User_History_Upload',require('./Routes/User_History_Upload'));

app.use('/User_Report_Upload',require('./Routes/User_Report_Upload'));

app.use('/ML_Analysis',require('./Routes/ML_Analysis'));

app.use('/Main_Medicine_DB_Update',require('./Routes/Main_Medicine_DB_Update'));

app.use((req,res)=>{
  res.sendStatus(404);
});
//Start the server
app.listen(port);
console.log('Server Started at port = ' + port);
