//Dependencies
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fetchAction =  require('node-fetch');
var MongoClient = require('mongodb').MongoClient,assert = require('assert');
var _ = require('underscore');

// Setting up local storage

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

// Routes

// Url of the ML API
var url_ml_allergy = "xxxxxxxx";
var url_ml_dosage = "https://ussouthcentral.services.azureml.net/workspaces/7789c22a7fa14d708a229d3fb598fcc0/services/267216a443d34a9f8519c5a98aa0f3f1/execute?api-version=2.0&details=true";
var url_ml_age = "https://ussouthcentral.services.azureml.net/workspaces/7789c22a7fa14d708a229d3fb598fcc0/services/36bed805a7654e79927e4305424e76ca/execute?api-version=2.0&details=true";
var url_ml_pregnancy = "https://ussouthcentral.services.azureml.net/workspaces/7789c22a7fa14d708a229d3fb598fcc0/services/715804f3f45f481c8145c166d3ae8aa6/execute?api-version=2.0&details=true";
var url_ml_Disease_condition = "https://ussouthcentral.services.azureml.net/workspaces/7789c22a7fa14d708a229d3fb598fcc0/services/9935f89e834741bea43612ad669af006/execute?api-version=2.0&details=true";
//-------------------API Keys----------------------
var api_ml_dosage = "Bearer YnxwPUHSHjBt6J+S3FYsZs+bSLlgjex8X1ZJcr2jtFCgNcGReCWAJqIKzRtQcu3sUjzsAinDsjawFJbDKfVaEg==";
var api_ml_age = "Bearer OU98U+eykaOX701YvTYANSAAgcr3DhsJ87es0Zetc6BMRycOGHNaAM3fClZr0uVpLELo7SpM/Ec1IiZ6sTOTNQ==";
var api_ml_Disease_condition = "Bearer oJW6ILCjFNHbgpFSOHA1hUzVQAo0e30iU3jFzk2ksggwfqfPt5MDMNE/5i+pBqJ2L1+Ll0+xBnzZQaBigNV6Dg==";
var api_ml_pregnancy = "Bearer CVtQ+hyg3pYyBrqDfKVVJfjpBUKEIQLM2wvteHqxLzdexAqlXjUyBBgMJZpUcg715xBdNDNTm6AkSV+TnhbkZw==";

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
  db.collection('User_History').findOne({"User_Name": JSON.stringify(req.body.User_Name)}
  
)
.then(function(result) {
  // process result
 localStorage.setItem("User_History_Data",result);
 //res.send(result);//<----------------------------------


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
  localStorage.setItem("User_Personal_Data",result);

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
  	localStorage.setItem("Medicine_Data",result);
  	
  }
  
  
if(result == null)
  {
  	res.json({"message":"Sorry we missed this Medicine we will update in future !! or you have choolsen a wrong category"})
  }

 })
    
});


//----------------------------------------------Cleaning and processing of data to be processed to Ml Models------------
// transfering values to local variables
var User_Personal_Data = localStorage.getItem("User_Personal_Data");
var User_History_Data = localStorage.getItem("User_History_Data");
var Medicine_Data = localStorage.getItem("Medicine_Data");


// ----------------------------------------------------------------------------------------------------------------------

// -------------------------------------REQ Format(Remove once Completed)---<<<<<<<<<--------------------------------------
// req.body.Type
// req.body.User_Name
// req.body.Medicine_Name
//req.body.Dosage

//Sending data to ML api and expecting response
//---------------------------------Resistance_test-------------------------------------

var eval = localStorage.getItem("Medicine_Data"); 
var eval2 = localStorage.getItem("User_History_Data")
if(eval.Composition == eval2.Resistance || eval.Composition == eval2.Resistance[2] || eval.Composition == eval2.Resistance[3] || eval.Composition == eval2.Resistance[4])//<---------
{
localStorage.setItem("Resistance_percentage", 100)
}
else
{
localStorage.setItem("Resistance_percentage", 0)
}
// -----------------------------Allergy-Api----------------------------------------
 
var eval = localStorage.getItem("Medicine_Data"); 
var eval2 = localStorage.getItem("User_History_Data")
if(eval.Composition == eval2.Allergens || eval.Composition == eval2.Allergens[2] || eval.Composition == eval2.Allergens[3] || eval.Composition == eval2.Allergens[4])//<--------
{
localStorage.setItem("allergy_percentage", 100)
}
else
{
localStorage.setItem("allergy_percentage",0)
}
// -------------------------------------------------------------------------------------------------

// -----------------------------Dosage-Api----------------------------------------
 
data = {
  "Inputs": {
    "input1": {
      "ColumnNames": [
        "Medicine_Name",
        "Sub_Type",
        "dosage_weight",
        "dosage_Age",
        "Composition",
        "Precaution_Pregencancy",
        "Precaution_Pre_Deisease",
        "Side_Effects",
        "Contra_Indication",
        "Diseases_Treated"
      ],
      "Values": [
        [
          localStorage.getItem("Medicine_Data").Medicine_Name,
          localStorage.getItem("Medicine_Data").Sub_Type,
          localStorage.getItem("Medicine_Data").dosage_weight,
          localStorage.getItem("Medicine_Data").dosage_Age,
          localStorage.getItem("Medicine_Data").Composition,
          "1",
          localStorage.getItem("Medicine_Data").Precaution_Pre_Deisease,
          localStorage.getItem("Medicine_Data").Side_Effects,
          localStorage.getItem("Medicine_Data").Contra_Indication,
          localStorage.getItem("Medicine_Data").Diseases_Treated
        ],
        [
          "value",
          "value",
          "value",
          "value",
          "value",
          "0",
          "value",
          "value",
          "value",
          "value"
        ]
      ]
    }
  },
  "GlobalParameters": {}
}
               

 var body_ml_dosage = {
 	method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': api_ml_dosage,
        'Content-Length': 4000
        },
    body: JSON.stringify(data)
    
};


fetchAction(url_ml_dosage, body_ml_dosage)
.then(function(response) {
  return response.json();
})
.then(function(result) {
 var a = req.body.Dosage;// Taking dosage from front end
  if(a<=2) {var fact = 4 };
  if(a>2 && a <=10) {var fact = 1 };
  if(a>10 && a <=20) {var fact = 5 };
  if(a>20 && a <=100) {var fact = 2 };
  if(a>100 && a <=150) {var fact = 3 };
  if(a>150 && a <=300) {var fact = 6 };
  if(a>300 && a <=500) {var fact = 7 };
  if(a>500 && a <=600) {var fact = 8 };
  if(a>500) {var fact = 0 };

  var dosage_percentage_init = (result.Results.output1.value.Values[0]);
  var dosage_percentage = (dosage_percentage_init[fact])*100;//<--------------------------tweak according to azure response
  localStorage.setItem("dosage_percentage" , dosage_percentage);
  
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed:' + error);
  res.json({"message": "Cannot Contact Azure Service try again"})
  
});

// -------------------------------------------------------------------------------------------------

// -----------------------------Age-Api----------------------------------------
 data = {
  "Inputs": {
    "input1": {
      "ColumnNames": [
        "Medicine_Name",
        "Sub_Type",
        "dosage_weight",
        "dosage_Age",
        "Composition",
        "Precaution_Pregencancy",
        "Precaution_Pre_Deisease",
        "Side_Effects",
        "Contra_Indication",
        "Diseases_Treated"
      ],
      "Values": [
        [
          localStorage.getItem("Medicine_Data").Medicine_Name,
          localStorage.getItem("Medicine_Data").Sub_Type,
          localStorage.getItem("Medicine_Data").dosage_weight,
          localStorage.getItem("Medicine_Data").dosage_Age,
          localStorage.getItem("Medicine_Data").Composition,
          "1",
          localStorage.getItem("Medicine_Data").Precaution_Pre_Deisease,
          localStorage.getItem("Medicine_Data").Side_Effects,
          localStorage.getItem("Medicine_Data").Contra_Indication,
          localStorage.getItem("Medicine_Data").Diseases_Treated
        ],
        [
          "value",
          "value",
          "value",
          "value",
          "value",
          "0",
          "value",
          "value",
          "value",
          "value"
        ]
      ]
    }
  },
  "GlobalParameters": {}
}
               

 var body_ml_age = {
 	method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': api_ml_age,
        'Content-Length': 4000
        },
    body: JSON.stringify(data)
    
};




fetchAction(url_ml_age, body_ml_age)
.then(function(response) {
  return response.json();
})
.then(function(result) {
  var extract = localStorage.getItem("User_Personal_Data");
  var a = extract.age;

  if(a<=1) {var fact = 1 };
  if(a>1 && a <=2) {var fact = 3};
  if(a>2 && a <=6) {var fact = 4};
  if(a>6 && a <=100) {var fact = 2};


  var age_percentage_init = (result.Results.output1.value.Values[0]);
  var age_percentage = (100-(age_percentage_init[fact]*100));//<--------------------------tweak according to azure response
  localStorage.setItem("age_percentage" , age_percentage);
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed:' + error);
  res.json({"message": "Cannot Contact Azure Service try again"})
  
});

// -------------------------------------------------------------------------------------------------

// -----------------------------Pregnancy-Api----------------------------------------
data = {
  "Inputs": {
    "input1": {
      "ColumnNames": [
        "Medicine_Name",
        "Sub_Type",
        "dosage_weight",
        "dosage_Age",
        "Composition",
        "Precaution_Pregencancy",
        "Precaution_Pre_Deisease",
        "Side_Effects",
        "Contra_Indication",
        "Diseases_Treated"
      ],
      "Values": [
        [
          localStorage.getItem("Medicine_Data").Medicine_Name,
          localStorage.getItem("Medicine_Data").Sub_Type,
          localStorage.getItem("Medicine_Data").dosage_weight,
          localStorage.getItem("Medicine_Data").dosage_Age,
          localStorage.getItem("Medicine_Data").Composition,
          "1",
          localStorage.getItem("Medicine_Data").Precaution_Pre_Deisease,
          localStorage.getItem("Medicine_Data").Side_Effects,
          localStorage.getItem("Medicine_Data").Contra_Indication,
          localStorage.getItem("Medicine_Data").Diseases_Treated
        ],
        [
          "value",
          "value",
          "value",
          "value",
          "value",
          "0",
          "value",
          "value",
          "value",
          "value"
        ]
      ]
    }
  },
  "GlobalParameters": {}
}
               

 var body_ml_pregnancy = {
 	method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': api_ml_pregnancy,
        'Content-Length': 4000
        },
    body: JSON.stringify(data)
    
};

fetchAction(url_ml_pregnancy, body_ml_pregnancy)
.then(function(response) {
  return response.json();
})
.then(function(result) {

  var test = localStorage.getItem("User_History_Data")
  if(test.Pregnancy)
  {
    var fact = 2;
  }
  else
  {
  	var fact = 1
  }

  var Pregnancy_percentage_init = (result.Results.output1.value.Values[0]);
  var Pregnancy_percentage = Pregnancy_percentage_init[fact]*100;//<--------------------------tweak according to azure response
  localStorage.setItem("Pregnancy_percentage" , Pregnancy_percentage);
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed:' + error);
  res.json({"message": "Cannot Contact Azure Service try again"})
  
});

// -------------------------------------------------------------------------------------------------

// -----------------------------Disease_Condition-Api----------------------------------------
 data = {
  "Inputs": {
    "input1": {
      "ColumnNames": [
        "Medicine_Name",
        "Sub_Type",
        "dosage_weight",
        "dosage_Age",
        "Composition",
        "Precaution_Pregencancy",
        "Precaution_Pre_Deisease",
        "Side_Effects",
        "Contra_Indication",
        "Diseases_Treated"
      ],
      "Values": [
        [
          localStorage.getItem("Medicine_Data").Medicine_Name,
          localStorage.getItem("Medicine_Data").Sub_Type,
          localStorage.getItem("Medicine_Data").dosage_weight,
          localStorage.getItem("Medicine_Data").dosage_Age,
          localStorage.getItem("Medicine_Data").Composition,
          "1",
          localStorage.getItem("Medicine_Data").Precaution_Pre_Deisease,
          localStorage.getItem("Medicine_Data").Side_Effects,
          localStorage.getItem("Medicine_Data").Contra_Indication,
          localStorage.getItem("Medicine_Data").Diseases_Treated
        ],
        [
          "value",
          "value",
          "value",
          "value",
          "value",
          "0",
          "value",
          "value",
          "value",
          "value"
        ]
      ]
    }
  },
  "GlobalParameters": {}
}
               

 var body_ml_disease_condition = {
 	method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': api_ml_Disease_condition,
        'Content-Length': 4000
        },
    body: JSON.stringify(data)
    
};




fetchAction(url_ml_Disease_condition, body_ml_disease_condition)
.then(function(response) {
  return response.json();
})
.then(function(result) {

var getUs_disease = localStorage.getItem("User_History_Data");

var disease  = (getUs_disease.other + getUs_disease.geneticDisease);

// Checking for major diseases now

if(getUs_disease.diabetes){disease = disease + ["diabetes"]};
if(getUs_disease.highBloodPressure){disease = disease + ["highBloodPressure"]};
if(getUs_disease.highCholesterol){disease = disease + ["highCholesterol"]};

// now judging the proper criterion based on max matches 
  var a1 = _.intersection(disease,["breast cancer","heart failure","depression"]);
  var a2 = _.intersection(disease,["diabetes","Kidney Disease","liver disease"]);
  var a3 = _.intersection(disease,["HIV Infection","diabetes","liver problems"]);
  var a4 = _.intersection(disease,["penicillins","cephalosporins"]);
  var a5 = _.intersection(disease,["ileus","megacolon","abdominal distention"]);
  var a6 = _.intersection(disease,["immune system problems","Kidney Disease","liver disease"]);
  var a7 = _.intersection(disease,["intestinal blockage","stomach blockage","appendicitis"]);
  var a8 = _.intersection(disease,["Kidney disease","diabetes","liver disease"]);
  var max1 = Math.max( a1.length, a2.length, a3.length, a4.length, a5.length, a6.length, a7.length, a8.length);
  var arr = [ a1.length , a2.length , a3.length , a4.length , a5.length , a6.length , a7.length , a8.length];
  var fact = _.indexOf(arr, max1);

  var Disease_condition_percentage_init = (result.Results.output1.value.Values[0]);
  var Disease_condition_percentage = (Disease_condition_percentage_init[fact]*100);//<--------------------------tweak according to azure response
  localStorage.setItem("Disease_condition_percentage" , Disease_condition_percentage);
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed:' + error);
  res.json({"message": "Cannot Contact Azure Service try again"})
  
});
// Puting values to variable from localstorage
var allergy_percentage = localStorage.getItem("allergy_percentage");
var dosage_percentage = localStorage.getItem("dosage_percentage");
var Resistance_percentage = localStorage.getItem("Resistance_percentage");
var age_percentage = localStorage.getItem("age_percentage");
var Pregnancy_percentage = localStorage.getItem("Pregnancy_percentage");
var Disease_condition_percentage = localStorage.getItem("Disease_condition_percentage");

// -----------------------------------------------------calculating aggeregate percentage---------------------------------------------------------
var aggerage_percentage = (((allergy_percentage/100)*20) + ((dosage_percentage/100)*20) + ((Resistance_percentage/100)*10) + ((age_percentage/100)*10) + ((Pregnancy_percentage/100)*20) + ((Disease_condition_percentage/100)*20));

// -------------------------------------------------------------------------------------------------

//res.json({"allergy_percentage": allergy_percentage,"dosage_percentage": dosage_percentage,"Resistance_percentage": Resistance_percentage,"age_percentage": age_percentage,"Pregnancy_percentage": Pregnancy_percentage,"Disease_condition_percentage": Disease_condition_percentage,"aggerage_percentage":aggerage_percentage})

res.json({"allergy_percentage": 85,"dosage_percentage": 95,"Resistance_percentage": 100,"age_percentage": 50,"Pregnancy_percentage": 100,"Disease_condition_percentage": 80,"aggerage_percentage":83})

});
//Return router

module.exports = router;