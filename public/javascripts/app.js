$(document).ready(function(){
	$("#check").click(function(){
		$("#loader").removeClass('hidden')
		$("#check").prop('disabled', true)
		Materialize.toast('Analysing...', 2000)
		$("#score").text("")
		var data = {}
		data.url =  $('#url').val();
	    $.ajax({
			type: 'POST',
			url: '/',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(data){
				$("#check").prop('disabled', false)
				$("#loader").addClass('hidden')
				if(data.isAdult === false){
					Materialize.toast('Website does not contain adult content', 10000)
				} else if(data.isAdult === 'suspicious') {
					$("#score").text(data.score)
					Materialize.toast('Website is SUSPECTED to contain adult content', 10000, 'red')
				} else if(data.isAdult === true) {
					$("#score").text(data.score)
					console.log("Score" + data.score);
					Materialize.toast('Website contains adult content', 10000, 'red')
				} else if(data.isAdult === 'error') {
					$("#score").text(data.score)
					Materialize.toast('Error in processing image', 10000, 'red')
				}
		   }
		});
	})
});