$("#ButtonControl4").click(function(){
	if($("#type1").is(':checked') || $("#type2").is(':checked')){
		if($("#RadioButtonControl4").is(':checked') || $("#RadioButtonControl3").is(':checked')){
			if($("#Presentation_For").val()==''){
				$.alert("لطفا شرکت/شخص هدف را وارد نمایید.", "", "rtl",
					function()
					{}
				);
			}else{
				if($("#type1").is(':checked')){
					RequestType = 1;
				}else if($("#type2").is(':checked')){
					RequestType = 2;
				}
				if($("#RadioButtonControl4").is(':checked')){
					WithRole = 1;
				}else if($("#RadioButtonControl3").is(':checked')){
					WithRole = 0;
				}
				alert(JSON.stringify('ok'));
			}
		}else{
			$.alert("لطفا نوع درج سمت را انتخاب نمایید.", "", "rtl",
				function()
				{}
			);
		}
	}else{
		$.alert("لطفا نوع درخواست را انتخاب نمایید.", "", "rtl",
			function()
			{}
		);
	}
});