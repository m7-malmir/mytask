$("#btnApprove").click(function(){
	
	if(rcommafy($("#txtAgreeToStay").val()) <= 0 ){
		$.alert("مدت زمان تعهد تایید می بایست بزرگتر از صفر باشد", "", "rtl",
			function()
			{}
		);
	}
	
	if(rcommafy($("#txtPunishmentFee").val()) <= 0 || $("#txtPunishmentFee").val()== ''){
		$.alert("مبلغ جریمه تایید می بایست بزرگتر از صفر باشد", "", "rtl",
			function()
			{}
		);
	}
	
	if(rcommafy($("#txtCollateralNo").val()) <= 0 ){
		$.alert("شماره سفته را بصورت صحیح وارد نمائید", "", "rtl",
			function()
			{}
		);
	}
	
	if(rcommafy($("#txtCollateralValue").val()) <= 0 || $("#txtCollateralValue").val()==''){
		$.alert("مبلغ سفته تایید می بایست بزرگتر از صفر باشد", "", "rtl",
			function()
			{}
		);
	}else{
		//----------------------------------------------------------------
		// ثبت تعهدنامه و چاپ
		//----------------------------------------------------------------
		var params = {
	        'AgreeToStay': $("#txtAgreeToStay").val(),
	        'CollateralNo': $("#txtCollateralNo").val(),
			'PunishmentFee': rcommafy($("#txtPunishmentFee").val()),
			'CollateralValue': rcommafy($("#txtCollateralValue").val()),
	    };
		
		params = $.extend(params, {Where : "Id = " + $form.getPK()});
		alert(JSON.stringify(params));
		FormManager.updateEntity(params,
           function(data)
				{
					closeWindow({OK:true, Result:true});
				},
				function(err)
				{
					hideLoading();
					alert(err);
				},
            function(err) {
                hideLoading();
                alert(err);
            }
        );
		//----------------------------------------------------------------
	}	
});