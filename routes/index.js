var express = require('express');
var router = express.Router();
var session = require('express-session');
var uuidv4 = require('uuid/v4');
var path = require('path');
var fs = require('fs');
var dateTime = require('node-datetime');
var MongoClient = require('mongodb').MongoClient;
var formidable = require('formidable');
var url = "mongodb://joemar12:joemar12@ds339927-a0.mlab.com:39927,ds339927-a1.mlab.com:39927/zigbang?replicaSet=rs-ds339927";
var bodyParser = require('body-parser');
var useragent = require('express-useragent');
var urlencodedParser = bodyParser.urlencoded({extended : false});
var dt = dateTime.create();
var ObjectID = require('mongodb').ObjectID;

router.use(useragent.express());




router.get('/', (req, res) => {

        MongoClient.connect(url,function(err,db){
            var dbo = db.db('zigbang');
            dbo.collection("web_content").find().sort({ _id: -1 }).toArray(function(err,result){

                if(req.session != null) {
                  if(req.useragent.isMobile) {
                      res.render('./mobile_index' , {userLevel : req.session.userLevel , result : result });
                  } else {
                     res.render('./index', {userLevel : req.session.userLevel , result : result });
                  }
                  
                    
                } else {
                   if(req.useragent.isMobile) {
                       res.render('./mobile_index' , {result : result});
                   } else {
                      res.render('./index' , {result : result});
                   }
                   
                }

            });
        });


});



router.get('/maps', (req, res) => {

   if(req.useragent.isMobile) {
       res.render('./mobile_maps', {userLevel : req.session.userLevel});
   } else {
      res.render('./maps', {userLevel : req.session.userLevel});
   }
	
   
});


router.get('/event', (req, res) => {
    var type = req.query.type;
	MongoClient.connect(url,function(err,db){
 		var dbo = db.db('zigbang');
 		dbo.collection("web_content").find({type : type}).sort({ _id: -1 }).toArray(function(err,result){
             if(result.length > 0) {

                if(req.useragent.isMobile) {
                    res.render('./mobile_layout', {userLevel : req.session.userLevel , result : result , name : '이벤트' , type : result[0].type});
                } else {
                    res.render('./layout', {userLevel : req.session.userLevel , result : result , name : '이벤트' , type : result[0].type});
                }
 			     
             } else {

                    res.redirect('/');
               
             }
 			db.close();
 		});
 	});

	
});



router.get('/notice', (req, res) => {
    var type = req.query.type;
  	MongoClient.connect(url,function(err,db){
  		var dbo = db.db('zigbang');
  		dbo.collection("web_content").find({type : type}).sort({ _id: -1 }).toArray(function(err,result){
             if(result.length > 0) {

              if(req.useragent.isMobile) {
                  res.render('./mobile_layout', {userLevel : req.session.userLevel , result : result , name : '공지사항' , type : result[0].type});
              } else {
                  res.render('./layout', {userLevel : req.session.userLevel , result : result , name : '공지사항' , type : result[0].type})
              }
  			   
             } else {
                

                    res.redirect('/');
              
             }
  			db.close();
  		});
  	});	
});



router.get('/game', (req, res) => {
    var type = req.query.type;
  	MongoClient.connect(url,function(err,db){
  		var dbo = db.db('zigbang');
  		dbo.collection("web_content").find({type : type}).sort({ _id: -1 }).toArray(function(err,result){
             if(result.length > 0) {

                  if(req.useragent.isMobile) {
                       res.render('./mobile_layout', {userLevel : req.session.userLevel , result : result , name : '게임방법' , type : result[0].type});
                  } else {
                      res.render('./layout', {userLevel : req.session.userLevel , result : result , name : '게임방법' , type : result[0].type})
                  }
  			  

             } else {
               

                       res.redirect('/');
                   
             }
  			db.close();
  		});
  	});	
});





router.get('/admin', (req, res) => {

  if(req.session.userLevel){
      
          if(req.session.userLevel == 'normal') {


            if(req.useragent.isMobile) {
                res.render('./mobile_index' , {userLevel : req.session.userLevel});
            } else {
                res.redirect('/' , {userLevel : req.session.userLevel});
            }

        } else {
          if(!req.useragent.isMobile) {
              res.render('./adminpage', {userLevel : req.session.userLevel});
          } 
          
        }
  }  else {
      res.send('PAGE NOT FOUND')
  }

});









router.post('/contentUpload' , urlencodedParser , function(request,response){

    var form = new formidable.IncomingForm();
    form.parse(request,function(err,fields,files){
      var title = fields.title;
      var type = fields.type;
      var content = fields.contents;
      var content_id = uuidv4();

      MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var nowDate = dt.format('Y-m-d');
        var dbo = db.db('zigbang');

        var contentObj = {
          "title" : title,
          "type" : type,
          "content" : content,
          "content_id" : content_id,
          "date" : nowDate,
        };
        
        dbo.collection('web_content').insertOne(contentObj);
      });
    });

    response.end();

});




router.get('/view',function(req,res){
  var article_id = req.query.article_uid;
  var type = req.query.type;
  MongoClient.connect(url,{useNewUrlParser : true },function(err,db){
    var dbo = db.db('zigbang');
    var query = {
      'content_id' : article_id,
      'type' : type,
    }
    dbo.collection('web_content').find(query).toArray(function(err,result){

        if(result.length > 0) {

          if(req.session.userLevel) {
              if(req.useragent.isMobile) {
                  res.render('./mobile_view' ,{'result' : result , userLevel : req.session.userLevel});
              } else {
                  res.render('./view' ,{'result' : result , userLevel : req.session.userLevel});
              }

          } else {
              if(req.useragent.isMobile) {
                  res.render('./mobile_view' ,{'result' : result });
              } else {
                  res.render('./view' ,{'result' : result });
              }

          }

          
        } else {
      
                res.redirect('/' , {userLevel : req.session.userLevel});
     
        
        }

    })
  })


})


router.post('/maps', urlencodedParser ,function(req,res) {

    var place_search = req.body.placeSearch;

    if(req.useragent.isMobile) {
         res.render('./mobile_maps', {'place_search' : place_search , userLevel : req.session.userLevel});
    } else {
         res.render('./maps', {'place_search' : place_search , userLevel : req.session.userLevel});
    }

    
    // response.sendFile(path.join(__dirname, 'index.html'));
});




router.post('/saveLocation', urlencodedParser, function(request,response){

    var form = new formidable.IncomingForm();

    form.parse(request , function(err,fields,files){

      var placeName = fields.placename;
      var langtitude = fields.langtitude;
      var longtitude = fields.longtitude;
      var agent_pic = files.agent_pic.path;
      var company_name = fields.company_name;
      var company_phone = fields.company_phone;
      var company_area = fields.company_area;
      var filename = uuidv4();
      var extension = path.extname(files.agent_pic.name);
      var newpath = 'assets/images/' + filename + extension;

      MongoClient.connect(url,function(err,db){
          if (err) throw err;
          var dbo = db.db('zigbang');

          var myobj = {
              "langtitude" : langtitude,
              "longtitude" : longtitude,
              "name" : placeName,
              "agent_pic" : newpath,
              "company_name" : company_name,
              "company_phone" : company_phone,
              "company_area" : company_area,
          }

          dbo.collection("location").insertOne(myobj);
      });

      fs.rename(agent_pic,newpath,function(err){
        if (err) throw err;
        // response.write('FILES UPLOAD AND MOVED');
        // response.end();
      });
    })

    response.redirect('/admin');
});






router.get('/m_login',function(req,res){
     res.render('./mobile_login'); 
})

router.get('/m_register',function(req,res){
     res.render('./mobile_register'); 
})


router.get('/updateContent',function(req,res){
 var dataId = req.query.dataId;;
  MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
    if (err) throw err;
    var dbo = db.db('zigbang');
    dbo.collection('location').find({'_id' : ObjectID(dataId)}).toArray(function(err,result){
      if(err) throw err;
      db.close();
      res.render('./adminpage' , {'data' : result});
    })
  })

  
})



router.post('/modifyData',  urlencodedParser , function(request,response){



  var form = new formidable.IncomingForm();

  form.parse(request , function(err,fields,files){
    var object_id = fields.object_id;
   
    var placeName = fields.placename;
    var langtitude = fields.langtitude;
    var longtitude = fields.longtitude;
    var agent_pic = files.agent_pic.path;
    var company_name = fields.company_name;
    var company_phone = fields.company_phone;
    var company_area = fields.company_area;

    console.log(files.agent_pic.name)

    if (files.agent_pic.name != '') {
        var filename = uuidv4();
        var extension = path.extname(files.agent_pic.name);
        var newpath = 'assets/images/' + filename + extension;
    }
   



    MongoClient.connect(url,function(err,db){
        if (err) throw err;

        var dbo = db.db('zigbang');


        // var myobj = {
        //     "langtitude" : langtitude,
        //     "longtitude" : longtitude,
        //     "name" : placeName,
        //     "agent_pic" : newpath,
        //     "company_name" : company_name,
        //     "company_phone" : company_phone,
        //     "company_area" : company_area,

        // }


        if (files.agent_pic.name != '') {

            dbo.collection('location').find({'_id' : ObjectID(object_id)}).toArray(function(err,result){
              if(err) throw err;
              console.log(result);
              var path = './'+result[0]['agent_pic'];

              try {
                fs.unlinkSync(path)
                //file removed
              } catch(err) {
                console.error(err)
              }

              db.close();
            })

            dbo.collection('location').updateOne({'_id': ObjectID(object_id)},
              {$set:{ "langtitude" : langtitude,
                "longtitude" : longtitude,
                "name" : placeName,
                "agent_pic" : newpath,
                "company_name" : company_name,
                "company_phone" : company_phone,
                "company_area" : company_area,}}
                );




        } else {
            dbo.collection('location').updateOne({'_id': ObjectID(object_id)},
              {$set:{ "langtitude" : langtitude,
                "longtitude" : longtitude,
                "name" : placeName,  
                "company_name" : company_name,
                "company_phone" : company_phone,
                "company_area" : company_area,}}
                );
        }
   
    })
    
    if (files.agent_pic.name != '') { 
       fs.rename(agent_pic,newpath,function(err){
         if (err) throw err;
         response.write('FILES UPLOAD AND MOVED');
         response.end();
       }); 
    }

  })

  response.redirect('/maps');
})


router.get('/gameMethod',function(request,response){
    if (request.query.type == '') {
                MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
                  if (err) throw err;
                  var dbo = db.db('zigbang');

                  dbo.collection('method').find({'cat' : 'game1'}).toArray(function(err,result){

                    if(err) throw err;
                    response.render('./gameMethod' , {'data' : result , 'img' : 'http://www.high1.com/high1/new/images/common/title/h3_casino5_2.gif'});
                    db.close();
                  })
            })
          
    }else if(request.query.type == 'game2'){
            MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
              if (err) throw err;
              var dbo = db.db('zigbang');

              dbo.collection('method').find({'cat' : 'game2' }).toArray(function(err,result){
                if(err) throw err;
                response.render('./gameMethod' , {'data' : result ,  'img' : 'http://www.high1.com/high1/new/images/common/title/h3_casino5_3.gif'});
                db.close();
              })
        })       
    } else if(request.query.type == 'game3'){
            MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
              if (err) throw err;
              var dbo = db.db('zigbang');

              dbo.collection('method').find({'cat' : 'game3'}).toArray(function(err,result){
                if(err) throw err;
                response.render('./gameMethod' , {'data' : result  ,  'img' : 'http://www.high1.com/high1/new/images/common/title/h3_casino5_4.gif'});
                db.close();
              })
        })
    } else if(request.query.type == 'game4'){
            MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
              if (err) throw err;
              var dbo = db.db('zigbang');

              dbo.collection('method').find({'cat' : 'game4' }).toArray(function(err,result){
                if(err) throw err;
                response.render('./gameMethod' , {'data' : result ,  'img' : 'http://www.high1.com/high1/new/images/common/title/h3_casino5_5.gif'});
                db.close();
              })
        })
    } else if(request.query.type == 'game5'){
            MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
              if (err) throw err;
              var dbo = db.db('zigbang');

              dbo.collection('method').find({'cat' : 'game5' }).toArray(function(err,result){
                if(err) throw err;
                response.render('./gameMethod' , {'data' : result ,  'img' : 'http://www.high1.com/high1/new/images/common/title/h3_casino5_6.gif'});
                db.close();
              })
        })
    } else if(request.query.type == 'game6'){
            MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
              if (err) throw err;
              var dbo = db.db('zigbang');

              dbo.collection('method').find({'cat' : 'game6' }).toArray(function(err,result){
                if(err) throw err;
                response.render('./gameMethod' , {'data' : result ,  'img' : 'http://www.high1.com/high1/new/images/common/title/h3_casino5_7.gif'});
                db.close();
              })
        })
    } else if(request.query.type == 'game7'){
            MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
              if (err) throw err;
              var dbo = db.db('zigbang');

              dbo.collection('method').find({'cat' : 'game7' }).toArray(function(err,result){
                if(err) throw err;
                response.render('./gameMethod' , {'data' : result ,  'img' : 'http://www.high1.com/high1/new/images/common/title/h3_casino5_8.gif'});
                db.close();
              })
        })
    } else if(request.query.type == 'game8'){
            MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
              if (err) throw err;
              var dbo = db.db('zigbang');

              dbo.collection('method').find({'cat' : 'game8' }).toArray(function(err,result){
                if(err) throw err;
                response.render('./gameMethod' , {'data' : result ,  'img' : 'http://www.high1.com/high1/new/images/common/title/h3_casino5_9.gif'});
                db.close();
              })
        })
    } else if(request.query.type == 'game9'){
            MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
              if (err) throw err;
              var dbo = db.db('zigbang');

              dbo.collection('method').find({'cat' : 'game9' }).toArray(function(err,result){
                if(err) throw err;
                response.render('./gameMethod' , {'data' : result ,  'img' : 'http://www.high1.com/high1/new/images/common/title/h3_casino5_10.gif'});
                db.close();
              })
        })
    } else if(request.query.type == 'game1'){
            MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
              if (err) throw err;
              var dbo = db.db('zigbang');

              dbo.collection('method').find({'cat' : 'game1' }).toArray(function(err,result){
                if(err) throw err;
                response.render('./gameMethod' , {'data' : result ,  'img' : 'http://www.high1.com/high1/new/images/common/title/h3_casino5_2.gif'});
                db.close();
              })
        })
    } else {
        response.render ('./gameMethod');    
    }


   
});




router.get('/updateContent',function(req,res){
 var dataId = req.query.dataId;;
      MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
        if (err) throw err;
        var dbo = db.db('zigbang');
        dbo.collection('location').find({'_id' : ObjectID(dataId)}).toArray(function(err,result){
          if(err) throw err;
          db.close();
          res.render('./adminpage' , {'data' : result});
        })
      })
  })

  

  router.post('/addGameMethod',function(request,response){

          var form = new formidable.IncomingForm();
          form.parse(request , function(err,fields,files){

            var cat = fields.categ_type;
            var con1 = fields.con1;
            var con2 = fields.con2;
            var con3 = fields.con3;

            MongoClient.connect(url,function(err,db){
                if (err) throw err;

                var dbo = db.db('zigbang');

                var myobj = {
                    "cat" : cat,
                    "con1" : con1,
                    "con2" : con2,
                    "con3" : con3,
                }

                dbo.collection("method").insertOne(myobj);
            })

          })

          response.redirect('/admin');
    })




module.exports = router;