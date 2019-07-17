var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
// var bcrypt = require('bcrypt');
var server = http.Server(app);
var ObjectID = require('mongodb').ObjectID;
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var socketIO = require('socket.io')

var io = socketIO(server);

// var io = require('socket.io')(server, {'transports': ['websocket', 'polling']});

var uuidv4 = require('uuid/v4');
var url = "mongodb://joemar12:joemar12@ds339927-a0.mlab.com:39927,ds339927-a1.mlab.com:39927/zigbang?replicaSet=rs-ds339927";
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);



var routes = require('./routes/index.js');
var user = require('./routes/user.js');

// Setting the template of the app 

app.use(session({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
 	store: new MongoStore({url : "mongodb://joemar12:joemar12@ds339927-a0.mlab.com:39927,ds339927-a1.mlab.com:39927/zigbang?replicaSet=rs-ds339927"}),
 	collection: 'mySessions',
  resave: true,
  saveUninitialized: true,
}));


// app.use(session(options))


app.set('view engine', 'ejs');




app.use('/' , routes);

app.use('/user',user);



app.use(express.static('./'));

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'


// server.listen(5000, function() {
//   console.log('Starting server on port 5000');
// });


// server.listen(3000, function() {
//   console.log('Starting server on port 5000');
// });

server.listen(server_port , server_ip_address , function(){
	console.log('Listening on' + server_ip_address + ', port' + server_port);	
})




function checkCredentials(data,input_type,socketID) {
	MongoClient.connect(url,{useNewUrlParser : true}, function(err,db){
		if (err) throw err;
		var dbo = db.db('zigbang');
		if(input_type == 'email') {
			var query =  {email : data.reg_email};
		}else {
			var query =  {user_id : data.user_id};
		}

		
		dbo.collection("user_credentials").find(query).toArray(function(err,result){
			if(err) throw err;
			if (result.length > 0) {
				io.to(socketID).emit('isUsed',{'type' : input_type});
			} else {
				io.to(socketID).emit('isUnused',{'type' : input_type});
			}
			// io.to(socketid).emit('mapDataContent',result);
			db.close();
		})
	})
}

// data coming from the client js
io.on('connection',function(socket){ 	

	socket.on('check_reg_email',function(data){
		socketid = socket.id;
		var	input_type = 'email';

		checkCredentials(data,input_type,socketid)
	})


	socket.on('check_user_id',function(data){
		socketid = socket.id;
		var	input_type = 'user_id';

		checkCredentials(data,input_type,socketid)
	})


	socket.on('check_credentials',function(data){
		socketid = socket.id;
		MongoClient.connect(url,{useNewUrlParser : true}, function(err,db){
			if (err) throw err;
			var dbo = db.db('zigbang');
			var accounts = {'user_id' : data.user_id};
			dbo.collection("user_credentials").find(accounts).toArray(function(err,result){
				if(err) throw err;
				if(result.length > 0) {
					
					    if (data.password == result[0].password) {  
					      io.to(socketid).emit('validCredentials');
					    } else {  
					     	io.to(socketid).emit('InvalidCredentials');
					    }  
				} else {
					io.to(socketid).emit('InvalidCredentials');
				}
				db.close();
			})
		})
	})





	socket.on('loadMapData',function(){
		socketid = socket.id;

		MongoClient.connect(url,{useNewUrlParser : true}, function(err,db){
			if (err) throw err;
			var dbo = db.db('zigbang');
			dbo.collection("location").find().toArray(function(err,result){
				if(err) throw err;
				io.to(socketid).emit('mapData',result);
				db.close();
			})
		})
	}) // End socket for loadMapData

	socket.on('loadMapContent',function(){
		socketid = socket.id;

		MongoClient.connect(url,{useNewUrlParser : true}, function(err,db){
			if (err) throw err;
			var dbo = db.db('zigbang');
			dbo.collection("location").find().toArray(function(err,result){
				if(err) throw err;
				io.to(socketid).emit('mapDataContent',result);
				db.close();
			})
		})
	}) // End socket for loadMapData



	socket.on('placeSearch' ,function(data){
		socketid = socket.id;
		MongoClient.connect(url,{useNewUrlParser : true}, function(err,db){
			if (err) throw err;
			var dbo = db.db('zigbang');

			dbo.collection('location').find({'company_area' : data.placeName}).toArray(function(err,result){
				if(err) throw err;
				io.to(socketid).emit('loadContent',result);
				db.close();
			})
		})
	});

	socket.on('getContent',function(data){
		socketid = socket.id;
		MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
			if (err) throw err;
			var dbo = db.db('zigbang');
			dbo.collection('location_content').find({'_id' : ObjectID(data.dataId)}).toArray(function(err,result){
				if(err) throw err;
				io.to(socketid).emit('loadMapContent',result);
				db.close();
			})
		})
	});


	socket.on('location_search',function(data){
		socketid = socket.id;
		MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
			if (err) throw err;
			var dbo = db.db('zigbang');
	
			dbo.collection('location').find({'company_area' : data.placeSearch}).toArray(function(err,result){
			
				if(err) throw err;
				io.to(socketid).emit('mapDataContent',result);
				db.close();
			})
		})
	});



	socket.on('modifyData',function(data){
		socketid = socket.id;
		MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
			if (err) throw err;
			var dbo = db.db('zigbang');
			dbo.collection('location_content').find({'_id' : ObjectID(data.dataId)}).toArray(function(err,result){
				if(err) throw err;
				io.to(socketid).emit('returnData',result);
				db.close();
			})
		})
	});




	socket.on('deleteData',function(data){
		socketid = socket.id;
		MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
			if (err) throw err;
			var dbo = db.db('zigbang');
			dbo.collection('location').deleteOne({"_id" : ObjectID(data.dataId)})
			socket.emit('return_delete')
		})
	});

	socket.on('image_randomizer',function(data){
		socketid = socket.id;

		MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
			if (err) throw err;
			var dbo = db.db('zigbang');

			var limit = 0;
			dbo.collection('widgetImage').find().toArray(function(err,result){
				if(err) throw err;

				var length = result.length;

				limit = Math.floor(Math.random() * length);  

				io.to(socketid).emit('data_count', limit);
			})			
			db.close();

		})
	})


	socket.on('image_randomizer_count',function(data){
		socketid = socket.id;
		
		MongoClient.connect(url, {useNewUrlParser : true}, function(err,db){
			if (err) throw err;
			var dbo = db.db('zigbang');

			
			dbo.collection('widgetImage').find().skip(data).limit(1).toArray(function(err,result){

				if(err) throw err;
				io.to(socketid).emit('image_return', result);
			});

			// dbo.collection("game").find(query).skip(data.skip).limit(10).sort(mysort).toArray(function(err, result) {
			//    io.to(socketid).emit('getpageload', result);
			//   db.close();
			// });
			
			db.close();

		})
	})

});