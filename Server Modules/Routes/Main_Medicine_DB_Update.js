//Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var router = express.Router();
var MongoClient = require('mongodb').MongoClient,assert = require('assert');

//Connecting to the mongodb and setting it up



// Routes

   //Server link testing page
router.get('/test', (req,res,next)=>{
    
    res.send('API working !!')
});

router.post('/uploading',(req,res,next)=>{

// connecting and sending data to mongo db

MongoClient.connect('mongodb://localhost:27017/Medicine_Database', (err,db)=> {

    assert.equal(null,err);
    console.log("Sucessfully connected to the mongodb client");
    // sending the information
  db.collection('Cardiovascular_System').update(
  { Beta_Blockers: "Propranlol"},
  { $set: { bose: 44 },
     $currentDate: { lastModified: true }},
     {upsert: true}
     )
.then(function(result) {
  // process result
  res.send(result);
})            
    
});



});


//Return router

module.exports = router;