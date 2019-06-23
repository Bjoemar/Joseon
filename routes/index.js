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

router.use(useragent.express());




router.get('/', (req, res) => {

        MongoClient.connect(url,function(err,db){
            var dbo = db.db('zigbang');
            dbo.collection("web_content").find().toArray(function(err,result){

                if(req.session != null) {
                  if(req.useragent.isMobile) {
                      res.render('./mobile_index' , {userLevel : req.session.userLevel , result : result });
                  } else {
                     res.render('./index', {userLevel : req.session.userLevel , result : result });
                  }
                  
                    
                } else {
                   if(req.useragent.isMobile) {
                       res.render('./inmobile_indexdex' , {result : result});
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
 		dbo.collection("web_content").find({type : type}).toArray(function(err,result){
             if(result.length > 0) {

                if(req.useragent.isMobile) {
                    res.render('./mobile_layout', {userLevel : req.session.userLevel , result : result , name : '이벤트' , type : result[0].type});
                } else {
                    res.render('./layout', {userLevel : req.session.userLevel , result : result , name : '이벤트' , type : result[0].type});
                }
 			     
             } else {

                if(req.useragent.isMobile) {
                    res.render('./inmobile_indexdex' , {userLevel : req.session.userLevel});
                } else {
                    res.redirect('/' , {userLevel : req.session.userLevel});
                }
               
             }
 			db.close();
 		});
 	});

	
});



router.get('/notice', (req, res) => {
    var type = req.query.type;
  	MongoClient.connect(url,function(err,db){
  		var dbo = db.db('zigbang');
  		dbo.collection("web_content").find({type : type}).toArray(function(err,result){
             if(result.length > 0) {

              if(req.useragent.isMobile) {
                  res.render('./mobile_layout', {userLevel : req.session.userLevel , result : result , name : '공지사항' , type : result[0].type});
              } else {
                  res.render('./layout', {userLevel : req.session.userLevel , result : result , name : '공지사항' , type : result[0].type})
              }
  			   
             } else {
                
                if(req.useragent.isMobile) {
                    res.render('./inmobile_indexdex' , {userLevel : req.session.userLevel});
                } else {
                    res.redirect('/' , {userLevel : req.session.userLevel});
                }
             }
  			db.close();
  		});
  	});	
});



router.get('/game', (req, res) => {
    var type = req.query.type;
  	MongoClient.connect(url,function(err,db){
  		var dbo = db.db('zigbang');
  		dbo.collection("web_content").find({type : type}).toArray(function(err,result){
             if(result.length > 0) {

                  if(req.useragent.isMobile) {
                       res.render('./mobile_layout', {userLevel : req.session.userLevel , result : result , name : '게임방법' , type : result[0].type});
                  } else {
                      res.render('./layout', {userLevel : req.session.userLevel , result : result , name : '게임방법' , type : result[0].type})
                  }
  			  

             } else {
               
                   if(req.useragent.isMobile) {
                       res.render('./inmobile_indexdex' , {userLevel : req.session.userLevel});
                   } else {
                       res.redirect('/' , {userLevel : req.session.userLevel});
                   }
             }
  			db.close();
  		});
  	});	
});





router.get('/admin', (req, res) => {
  	if(req.session.userLevel == 'normal') {


      if(req.useragent.isMobile) {
          res.render('./inmobile_indexdex' , {userLevel : req.session.userLevel});
      } else {
          res.redirect('/' , {userLevel : req.session.userLevel});
      }
	} else {


    if(!req.useragent.isMobile) {
        res.render('./adminpage', {userLevel : req.session.userLevel});
    } 
		
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


          if(req.useragent.isMobile) {
              res.render('./mobile_view' ,{'result' : result , userLevel : req.session.userLevel});
          } else {
              res.render('./view' ,{'result' : result , userLevel : req.session.userLevel});
          }

           
        } else {

            if(req.useragent.isMobile) {
                res.render('./inmobile_indexdex' , {userLevel : req.session.userLevel});
            } else {
                res.redirect('/' , {userLevel : req.session.userLevel});
            }
        
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




router.post('/saveLocation', urlencodedParser, function(req,res){
    var lang = req.body.langtitude;
    var long = req.body.longtitude;
    var name = req.body.placename;

    MongoClient.connect(url,function(err,db){
        if (err) throw err;

        var dbo = db.db('zigbang');

        var myobj = {
            "langtitude" : lang,
            "longtitude" : long,
            "name" : name,
        }

        dbo.collection("location").insertOne(myobj);
    })

    res.redirect('/admin');
});













router.post('/dataUpload' ,urlencodedParser , function(request,response){

  var form = new formidable.IncomingForm();
  form.parse(request , function(err,fields,files){

    var placeName = fields.placeName;

    var authorImage = files.authorImage.path;
    var authorName = fields.authorName;
    var authorNumber = fields.authorNumber;
    var authorKakao = fields.authorKakao;
    var authorTelegram = fields.authorTelegram;
    var authorAddress = fields.authorAddress;
    var authorContents = fields.authorContents;
    var kakaoLink = fields.kakaoLink;
    var telegram_link = fields.telegram_link;
    var oldpath = files.authorImage.path;
    var filename = uuidv4();
    var extension = path.extname(files.authorImage.name);
    var newpath = 'assets/images/' + filename + extension;

    MongoClient.connect(url,function(err,db){
      if(err) throw err;
      var dbo = db.db('zigbang');

      content = {
        "authorName" : authorName,
        "authorNumber" : authorNumber,
        "authorKakao" : authorKakao,
        "authorTelegram" : authorTelegram,
        "authorAddress" : authorAddress,
        "authorContents" : authorContents,
        "authorImage" : newpath,
        "placeName" : placeName,
        "kakaoLink"  : kakaoLink,
        "telegram_link" : telegram_link,
      };

      dbo.collection('location_content').insertOne(content);
    });

    fs.rename(oldpath,newpath,function(err){
      if (err) throw err;
      response.write('FILES UPLOAD AND MOVED');
      response.end();
    });
  })
});




router.get('/m_login',function(req,res){
     res.render('./mobile_login'); 
})

router.get('/m_register',function(req,res){
     res.render('./mobile_register'); 
})




module.exports = router;