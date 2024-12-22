var tblContainerId = null;
var carId='';
$(function()
{
    tblContainerId = (function()
    {
        var element = null,
			isDirty = false,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.readEntity,
            insertRows = FormManager.insertEntity,
            updateRows = FormManager.updateEntity,
            deleteRows = FormManager.deleteEntity,
            editFormRegKey = "EditFormRegKey",
            insertFormRegKey = "InsertFormRegKey";

        init();

        function init()
        {
            element = $("#tblSelectCars");
            build();
            bindEvents();
            //load();
        }

        function build()
        {            
            var imgAdd = $("<img/>", {src: "Images/add.gif", title: "افزودن"}).addClass("add").css({cursor: "pointer"});
            element.find("tr.row-template").find("td:first").empty().append(imgAdd);
			
            // if you don't want to use add button inside table uncomment the line below and remove the lines up
            //element.find("tr.row-template").hide();
        }
		 function addRow(rowInfo, rowNumber)
        {
			//alert(JSON.stringify(rowInfo));
            var index = 0,
                tempRow = element.find("tr.row-template").clone();

            tempRow.show().removeClass("row-template").addClass("row-data");
            tempRow.data("rowInfo", rowInfo);
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowNumber);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Id);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.CarName);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Color);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.ModelYear);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.OwnerPersonnelName);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Pelaq);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.SS);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.StatusTitle);
			var CHbox = $("<input type='checkbox'  value='"+rowInfo.Id+"'>").addClass( 'CHbox' );
			tempRow.find("td:eq(" + index++ + ")").append(CHbox);
            
            element.find("tr.row-template").before(tempRow);
        }
        function bindEvents()
        {
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
				  };
                }
            );
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

            element.on("click", "img.add",
                function()
                {
                    showAddDialog();
                }
            );
		
        }

        function addNewRow(rowInfo)
        {
            addRow(rowInfo, element.find("tr.row-data").filter(":visible").length + 1);
			isDirty = true;
        }

        function showAddDialog()
        {
            var params = {}; // change params if needed

            $.showModalForm({registerKey: insertFormRegKey, params: params},
                function(retVal)
                {
                    if(retVal.OK)
                    {
                        // if edit form saves the changes
                        refresh();

                        // if edit form passes new values down to be managed here
                        addNewRow(retVal.Data);
                    }
                }
            );
        }

        function editRow(row)
        {
			var rowInfo = row.data("rowInfo"),
				params = {};
			
            params[rowPrimaryKeyName] = rowInfo[rowPrimaryKeyName]; // change params if needed 

            $.showModalForm({registerKey: editFormRegKey, params: params},
                function(retVal)
                {
                    if(retVal.OK)
                    {
                        // if edit form saves the changes
                        refresh();

                        // if edit form passes new values down to be managed here
                        changeRow(row, retVal.Data);
                    }
                }
            );
        }

        function changeRow(row, newRowInfo)
        {
            var index = 1;

            // change this section so you change info shown in row
            row.find("td:eq(" + index++ + ")").text(newRowInfo.Name);

            row.attr({state: "changed"});
            row.data("rowInfo", newRowInfo);
			isDirty = true;
        }

        function removeRow(row)
        {
            if(row.attr("state") == "new")
			{
			    row.remove();
				rearrangeRows();
			}
			else
			{
	            row.attr({state: "deleted"});
	            row.hide();
	            rearrangeRows();
			}
			isDirty = true;
        }

        function load(list)
        {
			showLoading();
			//alert(JSON.stringify(list));
			for(var i = 0, l = list.length; i < l; i += 1)
            {
                addRow(list[i], i + 1);
            }
        }

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
			if(element.find("tr.row-data[state=new]").length == 0)
			{
				if($.isFunction(callback))
				{
					callback();
				}
			}
			else
			{
				var list = [];
				element.find("tr.row-data[state=new]").each(
					function()
					{
						var tempRowInfo = JSON.parse(JSON.stringify($(this).data("rowInfo")));

						// delete additional info

						list.push(tempRowInfo);
					}
				);

				insertRows(list,
					function()
					{
						if($.isFunction(callback))
						{
							callback();
						}
					},
					function(error)
					{
						alert(error);
					}
				);
			}
        }

        function updateChangedRows(callback)
        {
			if(element.find("tr.row-data[state=changed]").length == 0)
			{
				if($.isFunction(callback))
				{
					callback();
				}
			}
			else
			{
				var list = [];
				element.find("tr.row-data[state=changed]").each(
					function()
					{
						var tempRowInfo = JSON.parse(JSON.stringify($(this).data("rowInfo")));
						tempRowInfo.Where = rowPrimaryKeyName + " = " + tempRowInfo[rowPrimaryKeyName];

						// delete additional info
						delete tempRowInfo[rowPrimaryKeyName];

						list.push(tempRowInfo);
					}
				);
				
				updateRows(list,
					function()
					{
						if($.isFunction(callback))
						{
							callback();
						}
					},
					function(error)
					{
						alert(error);
					}
				);
			}
        }

        function deleteRemovedRows(callback)
        {
			if(element.find("tr.row-data[state=deleted]").length == 0)
			{
				if($.isFunction(callback))
				{
					callback();
				}
			}
			else
			{
				var list = [];
				element.find("tr.row-data[state=deleted]").each(
					function()
					{						
						var tempRowInfo = JSON.parse(JSON.stringify($(this).data("rowInfo")));
						list.push({Where: rowPrimaryKeyName + " = " + tempRowInfo[rowPrimaryKeyName]});						
					}
				);
				
				deleteRows(list,
					function()
					{
						if($.isFunction(callback))
						{
							callback();
						}
					},
					function(error)
					{
						alert(error);
					}
				);
			}
        }

        function rearrangeRows()
        {
            element.find("tr.row-data").filter(":visible").each(
                function(index)
                {
                    $(this).find("td:eq(0)").text(index + 1);
                }
            );
        }

        function refresh(list)
        {
			element.find("tr.row-data").remove();
            load(list);
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
		  $("#tblSelectCars .row-data").each((i, tr) => {
		      var txt=$(tr).text();
			  alert(JSON.stringify(txt)); 
		    if(txt=='true'){
		        $(td).text('فعال');
		    }else if(txt=='false'){
		        $(td).text('غیرفعال');
		    }
		  });
		//var activity=$("#tblSelectCars tr").find("td:nth-child(8))").attr("class");
			
});