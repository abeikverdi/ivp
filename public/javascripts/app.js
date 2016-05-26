$(document).ready(function(){
	$("#check").click(function(){
		$("#loader").removeClass('hidden')
		$("#check").prop('disabled', true)
		Materialize.toast('Analysing...', 2000)
		var data = {}
		data.url =  $('#url').val();
	    $.ajax({
			type: 'POST',
			url: '/',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(data){
				$("#loader").addClass('hidden')
				if(data.isAdult === false){
					Materialize.toast('Website does not contain adult content', 10000)
				} else {
					Materialize.toast('Website contains adult content', 10000, 'red')
				}
		   }
		});
	})
});