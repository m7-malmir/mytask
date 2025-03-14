var tblMain = null;
$(function()
{

    tblMain = (function()
    {
        var element = null,
			isDirty = false,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.readEntityLoanList;
		
        init();

		//ست کردن دیتا در جدول مورد نیاز ما در فرم
        function init()
        {
            element = $("#tblLoanList");
            bindEvents();
        }
        //عملیات پر کردن دیتای هر سطر می باشد
		function addRow(rowInfo, rowNumber) {
	    var index = 0,
	    tempRow = element.find("tr.row-template").clone();
	    tempRow.show().removeClass("row-template").addClass("row-data");
	    // پر کردن اطلاعات سطر
	    tempRow.find("td:eq(" + index++ + ")").empty().text(rowNumber);
	    
	    var CHbox = $("<input type='checkbox' value='" + rowInfo.Id + "' >").addClass('CHbox');
	    tempRow.find("td:eq(" + index++ + ")").append(CHbox);
		
		tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Id);
		tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.PersonnelNO);	
	    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.FullName);
		tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Reason);
	    tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.Price));
			
		var gbd=rowInfo.date;
        jbd = miladi_be_shamsi(parseInt(gbd.split('/')[2]), parseInt(gbd.split('/')[0]), parseInt(gbd.split('/')[1]));
        tempRow.find("td:eq(" + index++ + ")").empty().text(jbd[0] + '/' + jbd[1] + '/' + jbd[2]);	
			
		element.find("tr.row-template").before(tempRow);
        myHideLoading();
}
/****************************************************************************************/
		
        function bindEvents()
        {
			//کد مورد نظر برای اینکه فقط یک ردیف را انتخاب کند
			  element.on("click", ".CHbox",
                function()
                {
                  clicked = $(this);
				  if ($(this).is(':checked')) {
				    $('.CHbox:checked').not($(this)).each(function() {
				      $(this).prop('checked', false);
				      $(this).trigger('change');
				    });
					    var that = $(this),
                        row = that.closest("tr");
						r_info = row.data("rowInfo");
					  	
					  	$("#txtServiceId").val(r_info.OwnerPersonnelName);
					  	carId=r_info.Id;
					  	NewOwnerName=r_info.OwnerPersonnelName;
					  
				  };
                }
            );
        }
/****************************************************************************************/
        function addNewRow(rowInfo)
        {
        }

        function showAddDialog()
        {

        }

        function editRow(row)
        {
			
        }

        function changeRow(row, newRowInfo)
        {
            
        }

        function removeRow(row)
        {
           
        }
/****************************************************************************************/
        function load()
        {
				var searchValue = $("#searchTable").val();
				var params = {}; // شرط لازم برای نمایش وام های فردی که فرم را باز میکند
		
				if(searchValue==''){
					params = $.extend(params, {Where: "CancleStatus = 0"});
				}else{
					params = $.extend(params, {Where: "CancleStatus = 0 AND PersonnelNO LIKE '%"+ searchValue+"%'"});
				}
				showLoading();
	            readRows(params,
	                function(list)
	                {
						if(list.length > 0){
							
							for(var i = 0, l = list.length; i < l; i += 1)
		                    {
		                        addRow(list[i], i + 1);
		                    }
						}
						myHideLoading();
	                },
	                function(error)
	                {
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
            refresh: refresh,
            addRow: addNewRow,
            saveData: saveData,
            showAddDialog: showAddDialog,
			validateData: validateData,
			load: load
        };
    }());
});