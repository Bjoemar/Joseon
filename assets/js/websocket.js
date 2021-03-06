// var serverUri = 'http://joseon-joseon.b9ad.pro-us-east-1.openshiftapps.com/';
// var socket = io(serverUri, {'transports': ['websocket', 'polling']});

var socket = io();

var error_id = false;
var error_pass = false;
var error_name = false;
var error_num = false;
// var error_email = false;
var error_count = false;
var codes_verified = false;

var inputArr = [
	 $('input[name=reg_user_id]'),
	  $('input[name=reg_password]'),
	  $('input[name=reg_password2]'),
	  $('input[name=reg_name]'),
	  $('input[name=reg_cellphone]'),
	  // $('input[name=reg_email]')
];

var inputArrLen = inputArr.length;

$('#verifycodes').click(function(){
	

	var user_codes = $('input[name=sms_codes]').val();
	var reg_cellphone = $('input[name=reg_cellphone]').val();
	socket.emit('verifiedNumber',{'number' : reg_cellphone , 'code' : user_codes});

});


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

	if(!error_id && !error_pass &&!error_name &&!error_num &&!error_count) {
		

		if ($('input[name=sms_codes]').val().length == 0) {
			$('input[name=sms_codes]').prev().html('코드를 입력해 주세요');
		} else {
			if (codes_verified == true) {
				$(this).attr('disabled' , true);
				$(this).css('opacity' , '0.7');
				$(this).html('잠시만 기다려 주세요.');
				$('#reg_inner_form').submit();
			} else {

				$('input[name=sms_codes]').prev().html('코드를 입력해 주세요')
			}
		}
	}
});



socket.on('registerAccount',function(data){
	$('#reg_inner_form input').prop('readonly', true);
	codes_verified = true;
	$('#verifycodes').css('background','green');
	$('#verifycodes').html('성공');	$('#verifycodes').attr('disabled' , true);


});

socket.on('registerFailed',function(data){

	$('input[name=sms_codes]').prev().html('정확한 코드를 입력해 주세요');
})


$('#register_verification').click(function(){
	for(i =0; i < inputArrLen; i++) {
		if (inputArr[i].val().length == 0) {
			error_count = true;
			emptyValidate($(inputArr[i]));
		} else { 
			isnotEmpty($(inputArr[i]));
			error_count = false;
		} 
	}

	if(!error_id && !error_pass &&!error_name &&!error_num &&!error_count) {
		$(this).attr('disabled' , 'true');
		$(this).css('opacity' , '0.7');
		$(this).html('실행중');

		var user_codes = $('input[name=sms_codes]').val();
		var reg_cellphone = $('input[name=reg_cellphone]').val();
		socket.emit('VerifyUser',{'number' : reg_cellphone});
	}
});


socket.on('invalid_phone_number',function(data){
	$('#register_verification').prop('disabled' , false);
	$('#register_verification').css('opacity' , '1');
	$('#register_verification').html('코드 받기');
	$('input[name=reg_cellphone]').prev().html('정확한 핸드폰 번호를 입력해 주세요');
});


socket.on('used_phone_number',function(data){
	$('#register_verification').prop('disabled' , false);
	$('#register_verification').css('opacity' , '1');
	$('#register_verification').html('코드 받기');
	$('input[name=reg_cellphone]').prev().html('이미 등록된 번호 입니다');
});



socket.on('number_verified',function(data){
	// $('#register_verification').hide();
	$('#register_verification').css('background','green');
	$('#register_verification').html('성공');
	$('#register_verification').attr('disabled' , true);
});






$('.reg_inputs input').change(function(){
	isnotEmpty($(this));
});

 $('input[name=reg_user_id]').change(function(){
 	var user_id = $(this).val();
 	error_id = true;
 	socket.emit('check_user_id',{'user_id' : user_id});
 })


$('input[name=reg_password2]').change(function(){
	if($(this).val() != $('input[name=reg_password]').val()) {
		$('input[name=reg_password]').prev().html('* Password 가 일치하지 않습니다.').css('color' , 'red');
		$('input[name=reg_password]').css('border' , '1px solid red');
		error_pass = true;
	} else {
		error_pass = false;
		isnotEmpty($('input[name=reg_password]'))
	}
})

function emptyValidate(input){
	$(input).prev().html('* 정보를 입력해 주세요').css('color' , 'red');
	$(input).css('border' , '1px solid red');
	return errorFlag = true;
}

function isnotEmpty(input){
	$(input).prev().html('')
	$(input).css('border' , '1px solid #ccc');
}



socket.on('isUsed',function(data){

	$('input[name=reg_user_id').prev().html('* ID 가 이미 있습니다.').css('color' , 'red');
	$('input[name=reg_user_id').css('border' , '1px solid red');
	
})

socket.on('isUnused',function(data){

	isnotEmpty($('input[name=reg_user_id]'))
	error_id = false;
})







$('#login_credentials').click(function(){
	var user_id = $('input[name=log_user_id]').val();
	var password = $('input[name=log_password]').val();

	var error_user = false;
	var error_pass = false;

	if(user_id.length == 0) {
		$('input[name=log_user_id]').prev().html('* ID를 입력하세요').css('color' , 'red');
		$('input[name=log_user_id]').css('border' , '1px solid red');
		error_user = true;
	} else {
		$('input[name=log_user_id]').prev().html('');
		$('input[name=log_user_id]').css('border' , '1px solid #ccc');
		error_user = false;
	}

	if(password.length == 0) {
		$('input[name=log_password]').prev().html('* Password를 입력하세요').css('color' , 'red');
		$('input[name=log_password]').css('border' , '1px solid red');
		error_pass = true;
	} else {
		$('input[name=log_password]').prev().html('');
		$('input[name=log_password]').css('border' , '1px solid #ccc');
		error_pass = false;
	}

	if(!error_user && !error_pass) {
		$(this).attr('disabled' , true);
		$(this).css('opacity' , '0.7');
		$(this).html('로그인 하는중');
		socket.emit('check_credentials',{'user_id' : user_id , 'password' : password});
	}

});


socket.on('InvalidCredentials',function(){
	$('input[name=log_user_id]').prev().html('* 계정 정보가 일치하지 않습니다.').css('color' , 'red');
	$('input[name=log_user_id]').css('border','1px solid red');
	$('input[name=log_password]').css('border','1px solid red');
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