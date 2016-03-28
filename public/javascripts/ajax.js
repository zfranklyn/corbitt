jQuery(document).ready(function($){

	var BUTTON_add_user = $('#add_user');
	var BUTTON_query = $('query');
	var BUTTON_send_message = $('#send_message')

	var dropzone = $('#dropzone');

	// ADD USER
	BUTTON_add_user[0].addEventListener("click", function(e){
		e.preventDefault()
		console.log("add user")
	})

	dropzone[0].addEventListener('dragenter', function(event){
		$(this).addClass('hovered')
		event.preventDefault()
	})

	dropzone[0].addEventListener('dragover', function(event){
		$(this).addClass('hovered')
		event.preventDefault()
	})	

	dropzone[0].addEventListener('dragleave', function(event){
		$(this).removeClass('hovered')
	})	

	// main drop function
	dropzone[0].addEventListener('drop', function(event){
		event.preventDefault();
		$(this).removeClass('hovered')
		file = event.dataTransfer.files[0];

		console.log("File has been dropped:")
		console.log("Name: " + file.name)
		console.log("Size: " + file.size + " bytes")

		// parsing
		// Papa.parse(file, config)
	})	

	// REMINDERS

	// MESSAGING
	BUTTON_send_message[0].addEventListener("click", function(event){
		event.preventDefault();

		console.log("submitted");
	})

	// DATA DASHBOARD

})