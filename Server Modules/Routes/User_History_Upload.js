//Dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient,assert = require('assert');

// Routes
router.get('/test', function(req,res,next){
    
    res.send('API working')
});

router.post('/upload_user_history', (req,res,next)=>{


	MongoClient.connect('mongodb+srv://drkkgy:1234567890@cluster0-m00py.mongodb.net/User_History_Upload', (err,db)=> {

    assert.equal(null,err);
    console.log("Sucessfully connected to the mongodb client");
    // sending the information
  db.collection('User_History').insertOne({
  "Allergens":  req.body.Allergens,
  "Resistance": req.body.Resistance,
  "Pregnancy": req.body.Pregnancy,
  "diabetes": req.body.diabetes,
  "highBloodPressure": req.body.highBloodPressure,
  "highCholesterol": req.body.highCholesterol,
  "other": req.body.other,
  "geneticDisease": req.body.geneticDisease
})
.then(function(result) {
  // process result
  res.json({"message": "Data uploaded sucessfully"});
})
    
});



});

//Return router

module.exports = router;