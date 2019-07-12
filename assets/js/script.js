
$('.close_log_btn').click(function(){
	$('.loginForm').hide();
})

$('.login_btn_open').click(function(){
	$('.loginForm').show();
	$('.regForm').hide();

})




$('.close_reg_btn').click(function(){
	$('.regForm').hide();
})

$('.reg_btn_open').click(function(){
	$('.regForm').show();
	$('.loginForm').hide();
})


$('.regOpen').click(function(){
	$('.regForm').show();
	$('.loginForm').hide();

})




$('#content_input').summernote({
	placeholder: 'Start Here ..',
	height: 480,
	focus : true,
	disableResizeEditor: true,
});

$('#edit_content_input').summernote({
	placeholder: 'Start Here ..',
	height: 480,
	focus : true,
	disableResizeEditor: true,
});


$('#contents').summernote({
	placeholder: 'Start Here ..',
	height: 400,
	focus : true,
});



$('.addmaps_content').click(function(){
	$('.addContent_modal').show();
})

$('.addContent_modal_close').click(function(){
	$('.addContent_modal').hide();
});


$('.editmaps_content').click(function(){
	$('.updateContent_modal').show();
})

$('.updateContent_modal_close').click(function(){
	$('.updateContent_modal').hide();
});


$('#add_web_content').click(function(){

	$(this).css({
		'opacity' : 0.7,
	});

	$(this).html('POSTING ..')
	var dataForm = new FormData();

	var dataTitle = $('.content_title').val();
	var categ_type = $('.categ_form').val();
	var content = $('#contents').val();


	if(dataTitle){
		dataForm.append('title' , dataTitle);
	}

	if(categ_type){
		dataForm.append('type',categ_type);;
	}

	if(content){
		dataForm.append('contents' , content);
	}


	if(dataTitle.length > 0 && categ_type.length > 0 && content.length > 0) {
		$.ajax({
			url : '/contentUpload',
			method : 'post',
			data : dataForm,
			cache : false,
			contentType : false,
			processData : false, 
			success:function(data){
				$('.content_title').val('');
				$('#contents').html('');
				$('.note-editable').html('');
				$('.note-placeholder').hide();
				$('#add_web_content').css({
					'opacity' : 1,
				});

				$('#add_web_content').html('POST ARTICLE')
			}
		})
	} else {
		alert('PLEASE PROVIDE A CONTENT');
		$('#add_web_content').css({
			'opacity' : 0.7,
		});

		$('#add_web_content').html('POST ARTICLE')
	}
});



$('.g-navs-intro').click(function(){
	$('.g-navs').removeClass('g-active');
	$(this).addClass('g-active')
	$('.g-navs-content').hide();
	$('.g-intro').show();
})

$('.g-navs-progress').click(function(){
	$('.g-navs').removeClass('g-active');
	$(this).addClass('g-active')
	$('.g-navs-content').hide();
	$('.g-progress').show();
})

$('.g-navs-rules').click(function(){
	$('.g-navs').removeClass('g-active');
	$(this).addClass('g-active')
	$('.g-navs-content').hide();
	$('.g-rules').show();
})


$('#gameM-1').summernote({
	placeholder: 'Start Here ..',
	height: 300,
	focus : true,
	disableResizeEditor: true,
});

$('#gameM-2').summernote({
	placeholder: 'Start Here ..',
	height: 300,
	focus : true,
	disableResizeEditor: true,
});


$('#gameM-3').summernote({
	placeholder: 'Start Here ..',
		height: 300,
		focus : true,
		disableResizeEditor: true,
	});

