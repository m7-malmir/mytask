function loadCombo(MembershipType){
	// if(typeof MembershipType != 'undefined')
	// 	if(MembershipType != null && parseInt(MembershipType) > 0)
	// 		MembershipType = parseInt(MembershipType);
	//showLoading();
	// if(MembershipType == 1)
	// {
		var params = {};
		BS_GetUsers.Read(params,
		function(data)
		{
			//hideLoading();
			xmlData = $.xmlDOM(data);
			var list = [];
			xmlData.find("row").each(function()
				{
					list.push
						({
							id: $(this).find("col[name='ActorId']").text(),
							text: $(this).find("col[name='fullName']").text() + '-' + $(this).find("col[name='RoleName']").text()
						});
				}
			);
			$("#ComboBoxControl2 > option").remove();
			$("#ComboBoxControl2").append($('<option></option>'));
			$("#ComboBoxControl2").select2({
				data: list,
				placeholder: 'انتخاب فرد',
				dir: "rtl"
			});
			
		},
		function(err)
		{
			alert("service titles read error:\n"+err);
			hideLoading();
		});
//	}else{
		// var params = {};
		// BS_GetForignPersons.Read(params,
		// function(data)
		// {
		// 	//hideLoading();
		// 	xmlData = $.xmlDOM(data);
		// 	var list = [];
		// 	xmlData.find("row").each(function()
		// 		{
		// 			list.push
		// 				({
		// 					id: $(this).find("col[name='Id']").text(),
		// 					text: $(this).find("col[name='FirstName']").text() + ' ' +  $(this).find("col[name='LastName']").text() + '-' + $(this).find("col[name='OrganizationPost']").text() + '(' + $(this).find("col[name='Organization']").text() + ')'
		// 				});
		// 		}
		// 	);
		// 	$("#ComboBoxControl1 > option").remove();
		// 	$("#ComboBoxControl1").append($('<option></option>'));
		// 	$("#ComboBoxControl1").select2({
		// 		data: list,
		// 		placeholder: 'انتخاب فرد',
		// 		dir: "rtl"
		// 	});
		// },
		// function(err)
		// {
		// 	alert("service titles read error:\n"+err);
		// 	hideLoading();
		// });
	}
};