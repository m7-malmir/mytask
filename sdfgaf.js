var FormManager = {
	readEntityFood: function(jsonParams, onSuccess, onError)
	{
		BS_EditFood.Read(jsonParams
			, function(data)
			{
				var list = [];
				var xmlvar = $.xmlDOM(data);
				xmlvar.find("row").each(
					function()
					{
						list.push
						({
							FoodId: $(this).find("col[name='FoodId']").text(),
							FoodTitle: $(this).find("col[name='FoodTitle']").text(),
							FoodStatus: $(this).find("col[name='FoodStatus']").text()
						});
					}
				);
				if($.isFunction(onSuccess))
				{
					onSuccess(list);
				}
			}, onError
		);
	}
};




ZJM.FDR.Food