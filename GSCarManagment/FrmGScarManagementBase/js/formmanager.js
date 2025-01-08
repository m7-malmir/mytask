var FormManager = {
	readEntity: function(jsonParams, onSuccess, onError)
	{
		BS_SelectCarData.Read(jsonParams
			, function(data)
			{
				var dataXml = null;
				if($.trim(data) != "")
				{
					dataXml = $.xmlDOM(data);
				}
				if($.isFunction(onSuccess))
				{
					onSuccess(dataXml);
				}
			}, onError
		);
	},
	readUserInfo: function(jsonParams, onSuccess, onError)
	{
		BS_GetUsers.Read(jsonParams
			, function(data)
			{
				var dataXml = null;
				if($.trim(data) != "")
				{
					dataXml = $.xmlDOM(data);
				}
				if($.isFunction(onSuccess))
				{
					onSuccess(dataXml);
				}
			}, onError
		);	
	},
	InsertCar: function(jsonParams, onSuccess, onError)
	{
		SP_InsertCar.Execute(jsonParams
			, function(data)
			{ 
				var list = [];
				var xmlvar = $.xmlDOM(data);
				xmlvar.find("row").each(
					function()
					{
						list.push
						({
							CarId: $(this).find("col[name='CarId']").text(),
							NewOwnerNo: $(this).find("col[name='NewOwnerNo']").text(),
							CreatorPersonelNO: $(this).find("col[name='CreatorPersonelNO']").text(),
							
						});
					}
				);
				if($.isFunction(onSuccess))
				{
					onSuccess(200,list);
				}
			}, onError
		);
	}
};