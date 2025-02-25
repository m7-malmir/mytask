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
			},
			function(error) {
				var methodName = "readEntity";

	            if ($.isFunction(onError)) {
					var erroMessage= "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
					console.error("Error:", erroMessage);
					console.error("Details:", error);
	                
	                onError({
	                    message: erroMessage,
	                    details: error
	                });
	            } else {
	                console.error(erroMessage+ " (no onError callback provided):", error);
	            }
	        }
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
							CancleRequestDescription: $(this).find("col[name='CancleRequestDescription']").text(),
							PersonnelNO: $(this).find("col[name='PersonnelNO']").text(),
							FullName: $(this).find("col[name='FullName']").text(),
							Id: $(this).find("col[name='Id']").text(),
							Reason: $(this).find("col[name='LoanReasonTitle']").text(),
							Price: $(this).find("col[name='LoanNeededAmount']").text(),
							FullName: $(this).find("col[name='FullName']").text(),
							date: $(this).find("col[name='CreatedDate']").text()
						});
					}
				);
				if($.isFunction(onSuccess))
				{
					onSuccess(list);
				}
			},
			function(error) {
				var methodName = "readEntityLoanList";

	            if ($.isFunction(onError)) {
					var erroMessage= "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
					console.error("Error:", erroMessage);
					console.error("Details:", error);
	                
	                onError({
	                    message: erroMessage,
	                    details: error
	                });
	            } else {
	                console.error(erroMessage+ " (no onError callback provided):", error);
	            }
	        }
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
			},
			function(error) {
				var methodName = "insertEntity";

	            if ($.isFunction(onError)) {
					var erroMessage= "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
					console.error("Error:", erroMessage);
					console.error("Details:", error);
	                
	                onError({
	                    message: erroMessage,
	                    details: error
	                });
	            } else {
	                console.error(erroMessage+ " (no onError callback provided):", error);
	            }
	        }
		);
	},
	//******************************************************************************************************
	updateEntityLoanRequest: function(jsonParams, onSuccess, onError)
	{
		BS_CancelLoanRequest.Update(jsonParams
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
			},
			function(error) {
				var methodName = "updateEntityLoanRequest";

	            if ($.isFunction(onError)) {
					var erroMessage= "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
					console.error("Error:", erroMessage);
					console.error("Details:", error);
	                
	                onError({
	                    message: erroMessage,
	                    details: error
	                });
	            } else {
	                console.error(erroMessage+ " (no onError callback provided):", error);
	            }
	        }
		);
	},
	//******************************************************************************************************
	InsertHamesh: function(jsonParams, onSuccess, onError)
	{
		SP_HameshInsert.Execute(jsonParams,
			function(data)
			{ 
				var xmlvar = null;
				var xmlvar = $.xmlDOM(data);
				if($.isFunction(onSuccess))
				{
					onSuccess(200);
				}
			},
			function(error) {
				var methodName = "InsertHamesh";

	            if ($.isFunction(onError)) {
					var erroMessage= "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
					console.error("Error:", erroMessage);
					console.error("Details:", error);
	                
	                onError({
	                    message: erroMessage,
	                    details: error
	                });
	            } else {
	                console.error(erroMessage+ " (no onError callback provided):", error);
	            }
	        }
		);
	},
	//******************************************************************************************************
};