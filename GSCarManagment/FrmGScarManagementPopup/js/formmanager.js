var FormManager = {
	insertEntity: function(jsonParams, onSuccess, onError)
	{
		BS_InsertCar.Insert(jsonParams
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
	readEntity: function(jsonParams, onSuccess, onError)
	{
		BS_InsertCar.Read(jsonParams
			, function(data)
			{
				var dataXml = null;
				if($.trim(data) != "")
				{
					var list = [];
					dataXml = $.xmlDOM(data);	
				}
				if($.isFunction(onSuccess))
				{
					onSuccess(dataXml);
				}
			}, onError
		);
	},
		updateEntity: function(jsonParams, onSuccess, onError)
	{
		BS_InsertCar.Update(jsonParams
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
};