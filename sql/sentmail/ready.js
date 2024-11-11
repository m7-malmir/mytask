//#region js.ready  

//#endregion

//#region form manager
SP_SendEmail: function(jsonParams, onSuccess, onError)
	{
		alert(JSON.stringify(jsonParams));
		SP_Send_Email.Execute(jsonParams
		    , function(data)
		    {
				//alert(JSON.stringify(list));
				if($.isFunction(onSuccess))
				{
					onSuccess(data);
				}
		    },onError
		);
		
	}
//#endregion