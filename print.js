element.on("click", "input#delivered", function() {
    var that = $(this);
    var row = that.closest("tr");
    
    $.qConfirm(that, "آیا از ثبت مطمئن هستید؟", function(btn) {
        if (btn.toUpperCase() === "OK") {
            // در اینجا می‌توانیم وضعیت پرداخت را به روز کنیم
            var LoanPaymentID = row.find('td:nth-child(4)').text().trim();
            var params = {
                'PayStatus': 2
            };
            params = $.extend(params, { Where: "Id = " + LoanPaymentID });

            FormManager.updateEntity(params,
                function(list) {
                    // پس از موفقیت، ردیف را حذف می‌کنیم
                    removeRow(row);
                    refresh();
                },
                function(err) {
                    hideLoading();
                    alert(err);
                }
            );
        }
    }, null);
});















function bindEvents()
{
	element.on("click", "img.delete",
		function()
		{
			var that = $(this),
				row = that.closest("tr");
			
			$.qConfirm(that, "آیا مطمئن هستید؟", function(btn)
				{
					if(btn.toUpperCase() == "OK")
					{
						removeRow(row);
					}
				}, null
			);
		}
	);
	
	element.on("click", "img.edit",
		function()
		{
			editRow($(this).closest("tr"));
		}
	);
}