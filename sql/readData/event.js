$("#ButtonControl3").click(function(){
	var params= {rid:$("#TextBoxControl9").val()};
	FormManager.SP_Test(params,function(list){
			
		FirstName = list[0]["FirstName"];
		LastName = list[0]["LastName"];
		RoleName = list[0]["RoleName"];  
				
		$("#TextBoxControl6").val(FirstName);
	    $("#TextBoxControl7").val(LastName);
		$("#TextBoxControl8").val(RoleName);	
	});
});