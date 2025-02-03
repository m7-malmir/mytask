var FormManager = {
	//******************************************************************************************************
	readEntity: function(jsonParams, onSuccess, onError)
	{
		BS_MainData.Read(jsonParams
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
	//******************************************************************************************************
	readEntityLoanList: function(jsonParams, onSuccess, onError)
	{
		BS_PersonLoanList.Read(jsonParams
			, function(data)
			{
				var list = [];
				var xmlvar = $.xmlDOM(data);
				
				xmlvar.find("row").each(
					function()
					{
						list.push
						({
							PersonnelNO: $(this).find("col[name='PersonnelNO']").text(),
							Id: $(this).find("col[name='Id']").text(),
							Reason: $(this).find("col[name='LoanReasonTitle']").text(),
							Price: $(this).find("col[name='LoanNeededAmount']").text(),
							date: $(this).find("col[name='CreatedDate']").text()
						});
					}
				);
				if($.isFunction(onSuccess))
				{
					onSuccess(list);
				}
			}, onError
		);
	},
	//******************************************************************************************************
	insertEntity: function(jsonParams, onSuccess, onError)
	{
		BS_MainData.Insert(jsonParams
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
	//******************************************************************************************************
	updateEntity: function(jsonParams, onSuccess, onError)
	{
		BS_MainData.Update(jsonParams
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
	}
	//******************************************************************************************************
};