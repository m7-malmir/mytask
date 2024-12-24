$("#RegisterCar").click(function(){
	if(
		$("#CarName").val() == '' || $("#CarModel").val() == '' ||
		$("#CarColor").val() == '' || $("#CarSS").val() == '' ||
		$("#CarNo").val() == '' || $("#Status").val() == ''){
		$.alert("لطفا موارد اجباری را تکمیل نمایید.", "", "rtl",
			function()
			{}
		);
	}else{
		$form.saveData();
	}
});