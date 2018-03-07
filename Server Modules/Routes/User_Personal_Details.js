//Dependencies
var express = require('express');
var router = express.Router();

// Routes
router.get('/test', function(req,res,next){
    
    res.send('API working')
});

//Return router

module.exports = router;
