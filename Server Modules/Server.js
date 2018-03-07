// Dependencies 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port  = 3000;
// Databse connectivity with MongoDB

mongoose.connect('mongodb://localhost/Medicine_Database');

//Express setup

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Routes 

app.get('/', (req,res)=>{
  
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
