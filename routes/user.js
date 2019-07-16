var express = require('express');
var router = express.Router();
var uuidv4 = require('uuid/v1');
var mongo = require('mongodb');
// var bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended : false});
// 

var {check , validationResult } = require('express-validator');
var url = "mongodb://joemar12:joemar12@ds339927-a0.mlab.com:39927,ds339927-a1.mlab.com:39927/zigbang?replicaSet=rs-ds339927";

router.use(check());


router.post('/register',urlencodedParser, function(req,res){
	var {reg_user_id,reg_password,reg_password2,reg_name,reg_cellphone,reg_email} = req.body;

	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		var dbo = db.db('zigbang');

			credentials = {
				"user_id" : reg_user_id,
				"password" : reg_password,
				"name" : reg_name,
				"cellphone" : reg_cellphone,
				"email" : reg_email,
				"userLevel" : 'normal',
			};

			dbo.collection('user_credentials').insertOne(credentials);
	})

	res.redirect('/'); 

});


router.get('/logout',function(req,res){
	req.session.destroy();
	req.session = null;
	res.redirect('/'); 
	
})




router.post('/login',urlencodedParser, function(req,res){
	sess = req.session;
	var {log_user_id} = req.body;
	MongoClient.connect(url,{useNewUrlParser : true}, function(err,db){
		if (err) throw err;
		var dbo = db.db('zigbang');
		var accounts = {'user_id' : log_user_id};
		dbo.collection("user_credentials").find(accounts).toArray(function(err,result){
			sess.email = result[0].email;
			sess.username = result[0].name;
			sess.userLevel = result[0].userLevel;

			if(result[0].userLevel == 'admin') {

				if(req.useragent.isMobile) {
				    res.render('./mobile_index' , {img_res : image , result : result});
				} else {
					res.redirect('/admin'); 
				}


				
			} else {
				res.redirect('/'); 
			}
		})
	});

	

});



module.exports = router;