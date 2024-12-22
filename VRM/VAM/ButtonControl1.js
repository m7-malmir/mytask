$("#ButtonControl1").click(function(){
	//carId
	if($("#txtServiceId").val()==''){
				$.alert("لطفا شخص مورد نظر را انتخاب نمایید.", "", "rtl",
					function()
					{}
				);
	}
});