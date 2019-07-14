// var socket = io();
$(document).ready(function(){

var container =  document.getElementById('web-maps');



var options = {
	center : new daum.maps.LatLng(37.57004, 127.282234),
	level : 13,
};

// Map API
var map = new daum.maps.Map(container,options);


var callback = function(result, status) {
    if (status === daum.maps.services.Status.OK) {

    }
};

// Making a Click Zoom
daum.maps.event.addListener(map,'click',function(mouseEvent){

	var LatLng = mouseEvent.latLng;

	map.setCenter(LatLng);

	var level = map.getLevel();

	if (level > 10) {

		map.setLevel(10, {
		    animate: {
		        duration: 500
		    }
		});

	} else if (level > 5) {

		map.setLevel(5, {
		    animate: {
		        duration: 500
		    }
		});

	} else if (level > 1) {

		map.setLevel(-1, {
		    animate: {
		        duration: 500
		    }
		});
	}
	
});


var places = new daum.maps.services.Places();

var callback = function(result,status) {
	console.log(result);
	if(status === daum.maps.services.Status.OK) {
		var xpos = result[0].x;
		var ypos = result[0].y;
		map.setCenter(new daum.maps.LatLng(ypos,xpos));
	}
}

	if($('#web-maps').attr('data-loc').length > 0) {
		var place = $('#web-maps').attr('data-loc');

		places.keywordSearch(place,callback);

		map.setLevel(7);

		socket.emit('location_search',{'placeSearch' : place})

	} else {

		socket.emit('loadMapContent');

	}



	$('.back_content').click(function(){
		socket.emit('loadMapContent');
	});

	socket.emit('loadMapData');
	
	var place_arr = [];

	socket.on('mapData',function(data){
		
		var dataLen = data.length;
		for (i = 0; i < dataLen; i++) {
			var pos = new daum.maps.LatLng(data[i]['langtitude'] , data[i]['longtitude']);
			placeObj = {
				'position' : pos,
				'place_id' : data[i]['_id'],
				'name' : data[i]['name'],
			}

			place_arr.push(placeObj);
		}

		return place_arr;
	});


	setTimeout(function(){
		var place_len = place_arr.length;

		var mark_place = [];

		for(i = 0; i < place_len; i++) {

			var marker = new daum.maps.Marker({
			    map: map,
			    position: place_arr[i]['position'],
			});

			marker.setMap(map);

			var markerImage = new daum.maps.MarkerImage('assets/images/bldgIcon.png', new daum.maps.Size(50, 54), new daum.maps.Point(13, 34));
			marker.setImage(markerImage);


			var infowindow = new daum.maps.CustomOverlay({
			    map: map,
			    position: place_arr[i]['position'],
			    content: '<div class="icon_title" style="padding: 5px; width : 40px; position: absolute; bottom:-30px; background: rgba(0,0,0,0.8); border:2px solid white; border-radius: 100px; color: white; text-align: center; font-size: 8px; font-weight: 600;">'+place_arr[i].name+'</div>',
			});
			  
			infowindow.setMap(map, marker);

			var mp = {
				'name' : place_arr[i]['name'],
				'marker' : marker,
			};

			mark_place.push(mp);
		}

		var mp = mark_place.length;

		for (i = 0; i < mp; i++) {

			mark_place[i]['marker']['name'] = mark_place[i]['name'];

			daum.maps.event.addListener(mark_place[i]['marker'], 'click', function() {
				$('.data-res-con').show();
				$('.inner-listing-header label').html(this['name'])
				$('.content_add_place').val(this['name']);
				$('#content_holder1').hide();
				$('#content_holder').show();
				var placeName = this['name'];

				$('.author_image_holder small').html(placeName);
			    socket.emit('placeSearch' , {'placeName' : placeName});
			});

		}


	},4500);


	socket.on('loadContent',function(data){


		if(data.length > 0) {

			$('.web-listing-area').html('<div class="defaultview">'+
				
					'<div class="view_img">'+
						' <button class="btn btn-sm btn-dark mb-2 mt-2">수정</button> &nbsp; <button class="btn btn-sm btn-danger mb-2 mt-2">삭제</button>'+
						'<img src="'+data[0].agent_pic+'">'+
					'</div>'+
					'<div class="view_info">'+
						'<table style="width: 100%;">'+
							'<tr>'+
								'<th><label>업체명 : </label></th>'+
								'<td>'+data[0].company_name+'</td>'+
							'</tr>'+
							'<tr>'+
								'<th><label>연락처 : </label></th>'+
								'<td>'+data[0].company_phone+'</td>'+
							'</tr>'+
							'<tr>'+
								'<th><label>지역 : </label></th>'+
								'<td>'+data[0].company_area+'</td>'+
							'</tr>'+
						'</table>'+
					'</div>'+
					'<div class="clear"></div>'+

					
				'</div>')

		} 
	});


	$('#uploadContent').click(function(){

		$('#uploadContent').css('opacity',0.7);
		$('#uploadContent').html('Uploading ..');

		var form = new FormData();

		var placeName =  $('input[name=placeName]').val();
		var authorImage = $('input[name=author_image]')[0].files[0];
		var authorName = $('input[name=author_name]').val();
		var authorNumber = $('input[name=author_number]').val();
		var authorKakao = $('input[name=author_kakao]').val();
		var authorTelegram = $('input[name=author_telegram]').val();
		var authorAddress = $('input[name=author_address]').val();
		var authorContents = $('#content_input').val();
		var authorKakao_link = $('input[name=author_kakao_link]').val();
		var authorTelegram_link = $('input[name=author_telegram_link]').val();

		if(placeName) {
			form.append('placeName', placeName);
		}

		if(authorImage) {
			form.append('authorImage', authorImage);
		}

		if(authorName) {
			form.append('authorName', authorName);
		}

		if(authorNumber) {
			form.append('authorNumber', authorNumber);
		}

		if(authorKakao) {
			form.append('authorKakao', authorKakao);
		}

		if(authorTelegram) {
			form.append('authorTelegram', authorTelegram);
		}

		if(authorAddress) {
			form.append('authorAddress', authorAddress);
		}

		if(authorContents) {
			form.append('authorContents', authorContents);
		}

		if(authorKakao_link) {
			form.append('kakaoLink', authorKakao_link);
		}

		if(authorTelegram_link) {
			form.append('telegram_link', authorTelegram_link);
		}


		$.ajax({
			url :'/dataUpload',
			method : 'post',
			data: form,
			cache: false,
			contentType: false,
			processData: false,
			success:function(){
				$('#uploadContent').css('opacity',1);
				$('#uploadContent').html('Upload Content');
				$('input[name=placeName]').val('');
				$('input[name=author_image]').val('');
				$('input[name=author_name]').val('');
				$('input[name=author_number]').val('');
				$('input[name=author_kakao]').val('');
				$('input[name=author_telegram]').val('');
				$('input[name=author_address]').val('');
				$('#content_input').val('');
				$('input[name=author_kakao_link]').val('');
				$('input[name=author_telegram_link]').val('');
			}
		});
	});




	socket.on('mapDataContent',function(data){
		var dataLen = data.length;

		for(i = 0; i < dataLen; i++) {


			if ($('.admin_btn')[0]) {
				var buttons = ' <a href="/updateContent?dataId='+data[i]._id+'" class="btn btn-sm btn-dark mb-2 mt-2 content_upd" >Update</a> <button class="btn btn-sm btn-danger mb-2 mt-2 content_del" value="'+data[i]._id+'">delete</button>';
			} else {
				var buttons = '';
			}

			$('.web-listing-area').append('<div class="defaultview">'+
				
					'<div class="view_img">'+buttons+
						'<img src="'+data[i].agent_pic+'">'+
					'</div>'+
					'<div class="view_info">'+
						'<table style="width: 100%;">'+
							'<tr>'+
								'<th><label>업체명 : </label></th>'+
								'<td>'+data[i].company_name+'</td>'+
							'</tr>'+
							'<tr>'+
								'<th><label>연락처 : </label></th>'+
								'<td>'+data[i].company_phone+'</td>'+
							'</tr>'+
							'<tr>'+
								'<th><label>지역 : </label></th>'+
								'<td>'+data[i].company_area+'</td>'+
							'</tr>'+
						'</table>'+
					'</div>'+
					'<div class="clear"></div>'+

				'</div>');
		}

		$('.back_content').hide();
	});

	$(document).on('click','.default_btn',function(){

		var dataId = $(this).val();
		socket.emit('getContent',{'dataId' :  dataId})

	})


	socket.on('loadMapContent',function(data){

		if (data.length > 0) {

			$('#content_holder1').hide();
			$('#content_holder').show();
			$('.editmaps_content').show();
			$('.editmaps_content').val(data[0]._id);
			$('.deletemaps_content').show();
			$('.deletemaps_content').val(data[0]._id);
			$('.author_img').attr('src',data[0].authorImage)
			$('.author_name').html(data[0].authorName);
			$('.author_number').html(data[0].authorNumber)
			$('.author_kakao').html(data[0].authorKakao);
			$('.author_telegram').html(data[0].authorTelegram);
			$('.author_address').html(data[0].authorAddress);
			$('.author_contents').html(data[0].authorContents)
			// alert(data[0].kakaoLink)
			$('.kakao_link').attr('href', data[0].kakaoLink);
			$('.telegram_link').attr('href', data[0].telegram_link);
		} 
		$('.back_content').show();
	})


$(document).ready(function(){
	$(document).on('click','.content_del' ,function(){
		var dataId = $(this).val();
		socket.emit('deleteData', {'dataId' : dataId});
		
	});


})

socket.on('return_delete',function(){
	location.reload();
})














})
