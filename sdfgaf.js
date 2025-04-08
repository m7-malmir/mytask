FormManager.InsertHamesh(paramsHamesh,
	function(data)
	{
		Office.Inbox.setResponse(dialogArguments.WorkItem, 1, "", // تایید و ارسال رونوشت
			function (data) {
				closeWindow({ OK: true, Result: null });
			}, function (err) { throw Error(err); }
		);
	},
	function(error)
	{
		alert('خطایی در سیستم رخ داده است: '+error);
		myHideLoading();
		return;
	}
);