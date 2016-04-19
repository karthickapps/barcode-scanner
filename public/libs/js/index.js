$(document).ready(function(){
	$("#scan").click(function(e)
	{
		e.preventDefault();
		var scanId = $("#code").val();
		if(scanId && scanId.length){
			$("#scannerForm").css("display", "none");
			$("#loading").css("display", "block");
			$("#code").val("");
			$("#resultWrapper").empty();
			var data = {scanId:scanId};
			$.ajax({
			  	type: "POST",
				url: "/barcode",
				data: data,
				success: function(response) {
					$("#loading").css("display", "none");
					$("#scannerForm").css("display", "block");
					var result = response.message;
					result.forEach(function(code){
						var wrapper = "";
						if(code.exactMatch){
							wrapper = "<li class='col-md-12 col-xs-12' style='background-color:green;margin-top:8px;font-size:15px;color:#fff'><span class='col-md-3 col-xs-3'>"+code.fileName+"</span><span class='col-md-3 col-xs-3'>"+code.barcode+"</span><span class='col-md-3 col-xs-3'>"+code.partialMatch+"</span><span class='col-md-3 col-xs-3'>"+code.exactMatch+"</span>";
						}else{
							wrapper = "<li class='col-md-12 col-xs-12' style='margin-top:8px;font-size:15px;'><span class='col-md-3 col-xs-3'>"+code.fileName+"</span><span class='col-md-3 col-xs-3'>"+code.barcode+"</span><span class='col-md-3 col-xs-3'>"+code.partialMatch+"</span><span class='col-md-3 col-xs-3'>"+code.exactMatch+"</span>";
						}
						
						$("#resultWrapper").append(wrapper);
					});
				},
				error: function(err) {
					$("#loading").css("display", "none");
					$("#scannerForm").css("display", "block");
					console.log("failure");
				},
				dataType: "JSON"
			});
		}
		return;
	})
})