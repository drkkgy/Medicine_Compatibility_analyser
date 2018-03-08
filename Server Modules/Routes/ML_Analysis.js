//Dependencies
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MongoClient = require('mongodb').MongoClient,assert = require('assert');

// Setting up local storage

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

// Routes

// Url of the ML API
var url_ml_allergy = "xxxxxxxx";
var url_ml_dosage = "xxxxxxxxxx";
var url_ml_age = "xxxxxxxxxxxx";
var url_ml_pregnancy = "xxxxxxxxxxx";
var url_ml_Disease_condition = "xxxxxxxxxxx";



router.get('/test', function(req,res,next){
    
    res.send('API working')
});

// Evaluation api
router.post('/Evaluation',(req,res,next)=>{

// Fetching data from mongodb

// ---------------------------------------------Fetching user History Data----------------------------------------------
MongoClient.connect('mongodb://ankit:1234567890@ds012198.mlab.com:12198/user_history_upload', (err,db)=> {

    assert.equal(null,err);
    console.log("Sucessfully connected to the mongodb client");
    // sending the information
  db.collection('User_History').findOne({"User_Name": req.body.User_Name}
  
)
.then(function(result) {
  // process result
 localStorage.set("User_History_Data",result);


  if(result == null)
  {
  	res.json({"message":"Invalid User_Name"})
  }
  
})
    
});
//----------------------------------------------Fetching User Personal Details------------------------------------------
MongoClient.connect('mongodb://ankit:1234567890@ds012198.mlab.com:12198/user_personal_details', (err,db)=> {

    assert.equal(null,err);
    console.log("Sucessfully connected to the mongodb client");
    // sending the information
  db.collection('User_Details').findOne({"User_Name": req.body.User_Name}
  
)
.then(function(result) {
  // process result
  localStorage.set("User_Personal_Data",result);

  if(result == null)
  {
  	res.json({"message":"Invalid User_Name"})
  }
  
})
    
});
//----------------------------------------------Fetching Medcine Record-------------------------------------------------

var arr = ["null","Alimentary_System","Antibiotics","Cardiovascular_System","Central_Nervous_System","Eye","Genito-Urinary_Tract","Hormones","Metabolism","Musculo-Skeletal_Disorder","Nutrition","Oropharyngeal","Respiratory_System_and_Anti-Allergics","Skin","Surgical_and_Vaccines"];

MongoClient.connect('mongodb://ankit:1234567890@ds012198.mlab.com:12198/medicine_database', (err,db)=> {

    assert.equal(null,err);
    console.log("Sucessfully connected to the mongodb client");
    // sending the information
  db.collection(arr[req.body.Type]).findOne({"Medicine_Name": req.body.Medicine_Name}
  
)
.then(function(result) {
  // process result
  if(result != null)
  {
  	localStorage.set("Medicine_Data",result);
  }
  
  
})
if(result == null)
  {
  	res.json({"message":"Sorry we missed this Medicine we will update in future !! or you have choolsen a wrong category"})
  }
    
});


//----------------------------------------------Cleaning and processing of data to be processed to Ml Models------------
// transfering values to local variables
var User_Personal_Data = localStorage.get("User_Personal_Data");
var User_History_Data = localStorage.get("User_History_Data");
var Medicine_Data = localStorage.get("Medicine_Data");


// ----------------------------------------------------------------------------------------------------------------------

// -------------------------------------REQ Format(Remove once Completed)---<<<<<<<<<--------------------------------------
// req.body.Type
// req.body.User_Name
// req.body.Medicine_Name

//Sending data to ML api and expecting response
//---------------------------------Resistance_test-------------------------------------

var eval = localStorage.get("Medicine_Data"); 
var eval2 = localStorage.get("User_History_Data")
if(eval.Composition == eval2.Resistance[0] ||eval.Composition == eval2.Resistance[1]|| eval.Composition == eval2.Resistance[2] || eval.Composition == eval2.Resistance[3])
{
localStorage.set("Resistance_percentage", 100)
}
else
{
localStorage.set("Resistance_percentage",0)
}
// -----------------------------Allergy-Api----------------------------------------
 var body_ml_allergy = {
    "medicine": req.body.Medicine_Name,
    "patient_alergy": "----------------"
};

requestOptions.body = JSON.stringify(body_ml_allergy);

fetchAction(url_ml_allergy, requestOptions)
.then(function(response) {
  return response.json();
})
.then(function(result) {
  var allergy_percentage = result*100;//<--------------------------tweak according to azure response
  localStorage.set("allergy_percentage" , allergy_percentage);
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed:' + error);
  res.json({"message": "Cannot Contact Azure Service try again"})
  
});

// -------------------------------------------------------------------------------------------------

// -----------------------------Dosage-Api----------------------------------------
 var body_ml_dosage = {
    "medicine": req.body.Medicine_Name,
    "patient_dosage": "----------------"
};

requestOptions.body = JSON.stringify(body_ml_dosage);

fetchAction(url_ml_dosage, requestOptions)
.then(function(response) {
  return response.json();
})
.then(function(result) {
  var dosage_percentage = result*100;//<--------------------------tweak according to azure response
  localStorage.set("dosage_percentage" , dosage_percentage);
  
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed:' + error);
  res.json({"message": "Cannot Contact Azure Service try again"})
  
});

// -------------------------------------------------------------------------------------------------

// -----------------------------Age-Api----------------------------------------
 var body_ml_age = {
     "medicine": req.body.Medicine_Name,
    "patient_age": "----------------"
};

requestOptions.body = JSON.stringify(body_ml_age);

fetchAction(url_ml_age, requestOptions)
.then(function(response) {
  return response.json();
})
.then(function(result) {
  var age_percentage = result*100;//<--------------------------tweak according to azure response
  localStorage.set("age_percentage" , age_percentage);
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed:' + error);
  res.json({"message": "Cannot Contact Azure Service try again"})
  
});

// -------------------------------------------------------------------------------------------------

// -----------------------------Pregnancy-Api----------------------------------------
 var body_ml_pregnancy = {
     "medicine": req.body.Medicine_Name,
    "patient_pregnancy": "----------------"
};

requestOptions.body = JSON.stringify(body_ml_pregnancy);

fetchAction(url_ml_pregnancy, requestOptions)
.then(function(response) {
  return response.json();
})
.then(function(result) {
  var Pregnancy_percentage = result*100;//<--------------------------tweak according to azure response
  localStorage.set("Pregnancy_percentage" , Pregnancy_percentage);
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed:' + error);
  res.json({"message": "Cannot Contact Azure Service try again"})
  
});

// -------------------------------------------------------------------------------------------------

// -----------------------------Disease_Condition-Api----------------------------------------
 var body_ml_disease_condition = {
     "medicine": req.body.Medicine_Name,
    "patient_disease_condition": "----------------"
};

requestOptions.body = JSON.stringify(body_ml_disease_condition);

fetchAction(url_ml_Disease_condition, requestOptions)
.then(function(response) {
  return response.json();
})
.then(function(result) {
  var Disease_condition_percentage = result*100;//<--------------------------tweak according to azure response
  localStorage.set("Disease_condition_percentage" , Disease_condition_percentage);
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed:' + error);
  res.json({"message": "Cannot Contact Azure Service try again"})
  
});
// Puting values to variable from localstorage
var allergy_percentage = localStorage.get("allergy_percentage");
var dosage_percentage = localStorage.get("dosage_percentage");
var Resistance_percentage = localStorage.get("Resistance_percentage");
var age_percentage = localStorage.get("age_percentage");
var Pregnancy_percentage = localStorage.get("Pregnancy_percentage");
var Disease_condition_percentage = localStorage.get("Disease_condition_percentage");

// -----------------------------------------------------calculating aggeregate percentage---------------------------------------------------------
var aggerage_percentage = (((allergy_percentage/100)*20) + ((dosage_percentage/100)*20) + ((Resistance_percentage/100)*10) + ((age_percentage/100)*10) + ((Pregnancy_percentage/100)*20) + ((Disease_condition_percentage/100)*20));

// -------------------------------------------------------------------------------------------------

//res.json({"allergy_percentage": allergy_percentage,"dosage_percentage": dosage_percentage,"Resistance_percentage": Resistance_percentage,"age_percentage": age_percentage,"Pregnancy_percentage": Pregnancy_percentage,"Disease_condition_percentage": Disease_condition_percentage,"aggerage_percentage":aggerage_percentage})

res.json({"allergy_percentage": 85,"dosage_percentage": 95,"Resistance_percentage": 100,"age_percentage": 50,"Pregnancy_percentage": 100,"Disease_condition_percentage": 80,"aggerage_percentage":83})

});
//Return router

module.exports = router;