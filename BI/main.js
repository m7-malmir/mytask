$("#ButtonControl4").click(function(){	
	UserService.GetCurrentActor(true,
	function(data){
		hideLoading();
		var xmlActor = $.xmlDOM(data);
		currentActorId = xmlActor.find('actor').attr('pk');
		var params = {Where: "ActorId = " + currentActorId};
		alert(JSON.stringify(params));
		BS_GetUserInfo.Read(params
			, function(data)
			{
				var dataXml = null;
				if($.trim(data) != "")
				{
					dataXml = $.xmlDOM(data);
					fullName = dataXml.find("row:first").find(">col[name='fullName']").text();
					RoleName = dataXml.find("row:first").find(">col[name='RoleName']").text();
					ServiceLocation = dataXml.find("row:first").find(">col[name='mahalkhedmat']").text();
					UnitsName = dataXml.find("row:first").find(">col[name='UnitsName']").text();
					UserName = dataXml.find("row:first").find(">col[name='Codepersonel']").text();
					RoleId = dataXml.find("row:first").find(">col[name='RoleId']").text();
					HireDate = dataXml.find("row:first").find(">col[name='employmentdate']").text();
					ServiceLocationId = dataXml.find("row:first").find(">col[name='ServiceLocation_ID']").text();
														
					$("#txtFullName").val(fullName).prop('disabled', true);
					$("#txtServiceLoc").val(ServiceLocation).prop('disabled', true);
					$("#txtPersonnel").val(UserName).prop('disabled', true);
					$("#txtUnits").val(UnitsName).prop('disabled', true);
					$("#txtPosition").val(RoleName).prop('disabled', true);
					$("#txtHireDate").val(HireDate).prop('disabled', true);
					
					$("#txtLoanAmount").prop('readOnly', false);
					$("#txtReqDate").prop('disabled', false);
					$("#txtLoanAmount").prop('disabled', false);
					$("#txtDiscription").prop('disabled', false);
					$("#comboReqType").prop('disabled', false);
				}
				if($.isFunction(onSuccess))
				{
					onSuccess(dataXml);
				}
			}
		);
	},
	function(err){
		hideLoading();
		$ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
	})
	
});