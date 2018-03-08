//Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var router = express.Router();
var MongoClient = require('mongodb').MongoClient,assert = require('assert');
var arr = ["null","Alimentary_System","Antibiotics","Cardiovascular_System","Central_Nervous_System","Eye","Genito-Urinary_Tract","Hormones","Metabolism","Musculo-Skeletal_Disorder","Nutrition","Oropharyngeal","Respiratory_System_and_Anti-Allergics","Skin","Surgical_and_Vaccines"];

//Connecting to the mongodb and setting it up



// Routes

   //Server link testing page
router.get('/test', (req,res,next)=>{
    
    res.send('API working !!')
});

router.post('/uploading',(req,res,next)=>{

// connecting and sending data to mongo db


MongoClient.connect('mongodb://ankit:1234567890@ds012198.mlab.com:12198/medicine_database', (err,db)=> {

    assert.equal(null,err);
    console.log("Sucessfully connected to the mongodb client");
    // sending the information
  db.collection(arr[req.body.Type]).insertOne({
  "Medicine_Name": req.body.Medicine_Name,
  "Sub_Type": req.body.Sub_Type,
  "dosage_weight": req.body.dosage_weight,
  "dosage_Age": req.body.dosage_Age,
  "Composition": req.body.Composition,
  "Precaution_Pregencancy":req.body.Precaution_Pregencancy,
  "Precaution_Pre_Deisease": req.body.Precaution_Pre_Deisease,
  "Side_Effects": req.body.Side_Effects,
  "Contra_Indication": req.body.Contra_Indication,
  "Diseases_Treated": req.body.Diseases_Treated
})
.then(function(result) {
  // process result
  res.json({"message": "Data uploaded sucessfully"});
})


});



});


//Return router

module.exports = router;