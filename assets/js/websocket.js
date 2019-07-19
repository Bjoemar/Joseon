// var serverUri = 'http://joseon-joseon.b9ad.pro-us-east-1.openshiftapps.com/';
// var socket = io(serverUri, {'transports': ['websocket', 'polling']});

var socket = io();

var error_id = false;
var error_pass = false;
var error_name = false;
var error_num = false;
var error_email = false;
var error_count = false;

var inputArr = [
	 $('input[name=reg_user_id]'),
	  $('input[name=reg_password]'),
	  $('input[name=reg_password2]'),
	  $('input[name=reg_name]'),
	  $('input[name=reg_cellphone]'),
	  $('input[name=reg_email]')
];

var inputArrLen = inputArr.length;

$('#register_credentials').click(function(){

	for(i =0; i < inputArrLen; i++) {
		if (inputArr[i].val().length == 0) {
			error_count = true;
			emptyValidate($(inputArr[i]));
		} else { 
			isnotEmpty($(inputArr[i]));
			error_count = false;

		} 
	}

	if(!error_id && !error_pass &&!error_name &&!error_num && !error_email &&!error_count) {
		$('#reg_inner_form').submit();
	}


});


$('.reg_inputs input').change(function(){
	isnotEmpty($(this));
});

 $('input[name=reg_user_id]').change(function(){
 	var user_id = $(this).val();
 	error_id = true;
 	socket.emit('check_user_id',{'user_id' : user_id});
 })

 $('input[name=reg_email]').change(function(){
 	error_email = true;
 	var reg_email = $(this).val();
 	if(validate(reg_email)) {
 		isnotEmpty($(this));
 		socket.emit('check_reg_email',{'reg_email' : reg_email});
 	} else {
 		$(this).prev().html('* Please Provide a valid email').css('color' , 'red');
 		$(this).css('border' , '1px solid red');
 	}
 	
 	
 })


$('input[name=reg_password2]').change(function(){
	if($(this).val() != $('input[name=reg_password]').val()) {
		$('input[name=reg_password]').prev().html('* Password not match').css('color' , 'red');
		$('input[name=reg_password]').css('border' , '1px solid red');
		error_pass = true;
	} else {
		error_pass = false;
		isnotEmpty($('input[name=reg_password]'))
	}
})

function emptyValidate(input){
	$(input).prev().html('* This Field is required').css('color' , 'red');
	$(input).css('border' , '1px solid red');
	return errorFlag = true;
}

function isnotEmpty(input){
	$(input).prev().html('')
	$(input).css('border' , '1px solid #ccc');
}



socket.on('isUsed',function(data){
	if(data.type == 'email') {
		$('input[name=reg_email').prev().html('* The email is already taken').css('color' , 'red');
		$('input[name=reg_email').css('border' , '1px solid red');
	} else if(data.type == 'user_id') {
		$('input[name=reg_user_id').prev().html('* The User_id is already taken').css('color' , 'red');
		$('input[name=reg_user_id').css('border' , '1px solid red');
	}
})

socket.on('isUnused',function(data){
	if(data.type == 'email') {
		isnotEmpty($('input[name=reg_email]'))
		error_email = false;
	} else if(data.type == 'user_id') {
		isnotEmpty($('input[name=reg_user_id]'))
		error_id = false;
	}
})







$('#login_credentials').click(function(){
	var user_id = $('input[name=log_user_id]').val();
	var password = $('input[name=log_password]').val();

	var error_user = false;
	var error_pass = false;

	if(user_id.length == 0) {
		$('input[name=log_user_id]').prev().html('* ID is required').css('color' , 'red');
		$('input[name=log_user_id]').css('border' , '1px solid red');
		error_user = true;
	} else {
		$('input[name=log_user_id]').prev().html('');
		$('input[name=log_user_id]').css('border' , '1px solid #ccc');
		error_user = false;
	}

	if(password.length == 0) {
		$('input[name=log_password]').prev().html('* Password is required').css('color' , 'red');
		$('input[name=log_password]').css('border' , '1px solid red');
		error_pass = true;
	} else {
		$('input[name=log_password]').prev().html('');
		$('input[name=log_password]').css('border' , '1px solid #ccc');
		error_pass = false;
	}

	if(!error_user && !error_pass) {
		$(this).attr('disabled' , 'true');
		$(this).css('opacity' , '0.7');
		$(this).html('로그인 하는중');
		socket.emit('check_credentials',{'user_id' : user_id , 'password' : password});
	}

});


socket.on('InvalidCredentials',function(){
	$('input[name=log_user_id]').prev().html('* Account Does not exist').css('color' , 'red');
	$('input[name=log_user_id]').css('border' , '1px solid red');
	$('input[name=log_password]').css('border' , '1px solid red');
	$('#login_credentials').removeAttr('disabled');
	$('#login_credentials').css('opacity' , '1');
	$('#login_credentials').html('로그인');
})

socket.on('validCredentials',function(){
	$('#log_inner_form').submit();
})




setInterval(function(){
	socket.emit('image_randomizer');
},2500);

socket.on('image_return',function(data){
	$('.mobile_view_load_image').html('<img src="'+data[0]['image2']+'" style="width: 100%;">');
	$('.home-image-holder').html('<img src="'+data[0]['image2']+'" style="height: 400px;">');
})

socket.on('data_count',function(count){
	socket.emit('image_randomizer_count',count);
})