var tblMain = null;

$(function () {
    tblMain = (function () {
		var element = null,
			isDirty = false,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.readEntityRequestDetail;
        init();
		
		
        function init() {
            element = $("#tblFood");
            bindEvents();
        }

        function bindEvents() {
        }
		function addRow(rowInfo) {
		  var index = 0,
	    tempRow = element.find("tr.row-template").clone();
	    tempRow.show().removeClass("row-template").addClass("row-data");
	    // پر کردن اطلاعات سطر
	    tempRow.find("td:eq(" + index++ + ")").empty().text(rowNumber);
	    if(!$form.isInEditMode()){
		    var CHbox = $("<input type='checkbox' value='" + rowInfo.Id + "' >").addClass('CHbox');
		    tempRow.find("td:eq(" + index++ + ")").append(CHbox);
		}else{
		    var CHbox = $("<input type='checkbox' value='" + rowInfo.Id + "' checked disabled>").addClass('CHbox');
    		tempRow.find("td:eq(" + index++ + ")").append(CHbox);	
		}
			
	    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.FirsName);
	    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.LastName);
	    tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.VIP));
			
		var gbd=rowInfo.date;
        jbd = miladi_be_shamsi(parseInt(gbd.split('/')[2]), parseInt(gbd.split('/')[0]), parseInt(gbd.split('/')[1]));
        tempRow.find("td:eq(" + index++ + ")").empty().text(jbd[0] + '/' + jbd[1] + '/' + jbd[2]);	
			
		element.find("tr.row-template").before(tempRow);
        myHideLoading();
		/*
		    tempRow.find("td:eq(" + index++ + ")").empty().append(imgDelete); // حذف
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.FirsName); // نام
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.LastName); // نام خانوادگی
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.VIP); // VIP
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.Giftpack); // پک هدیه
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.Breakfast); // صبحانه
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.Lunch); // ناهار
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.Dinner); // شام
		
		  */ 
		}

        function updateRowNumbers() {
            element.find("tr.row-data").each(function (index, row) {
                $(row).find("td:eq(0)").text(index + 1);  
            });
        }
	function load()
        {
			var params = {}; // شرط لازم برای نمایش وام‌های فردی که فرم را باز می‌کند
			params = $.extend(params, { Where: "Id = " + pk });
			
			showLoading();
			readRows(params,
			    function(list) {
					alert(JSON.stringify(params));
			        if (list.length > 0) {
			            for (var i = 0, l = list.length; i < l; i += 1) {
			                addRow(list[i], i + 1);
			            }
			        }
			        myHideLoading();
			    },
			    function(error) {
			        myHideLoading();
			        alert(error);
			    }
			);
	
        }
/***********************************************************************************************/
        function saveData(callback)
        {			
			if(!isDirty)
			{
				if($.isFunction(callback))
				{
				    callback();
				}
				return;
			}
            var defObjs = [$.Deferred(), $.Deferred(), $.Deferred()];
			
			showLoading();
			
            insertNewRows(
                function()
                {
                    defObjs[0].resolve();
                }
            );
            updateChangedRows(
                function()
                {
                    defObjs[1].resolve();
                }
            );
            deleteRemovedRows(
                function()
                {
                    defObjs[2].resolve();
                }
            );
            $.when(defObjs[0], defObjs[1], defObjs[2]).done(
                function()
                {
					isDirty = false;
					hideLoading();
                    if($.isFunction(callback))
                    {
                        callback();
                    }
                }
            );
        }

        function insertNewRows(callback)
        {
			
        }

        function updateChangedRows(callback)
        {
        }

        function deleteRemovedRows(callback)
        {
		}

        function rearrangeRows()
        {
           
        }

        function refresh()
        {
			//alert(JSON.stringify('4'));
			element.find("tr.row-data").remove();
            load();
        }

        function validateData()
        {
			// change the validation method if needed
            if(element.find("tr.row-data").length == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        return {
           /* refresh: refresh,
            //addRow: addNewRow,
            saveData: saveData,
            showAddDialog: showAddDialog,
			validateData: validateData,
			load: load*/
        };
    })();
});


$form.getPK(