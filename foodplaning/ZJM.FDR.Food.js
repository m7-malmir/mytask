/*******body*************** */
    $("#btnRegister").click(function(){


        if ($("#txtFoodTitle").val() === '') {
            $.alert("نام غذا و وضعیت آن را تعیین نمایید", "", "rtl");
            return;
        }
        
        
        //افزودن غذا به لیست
        var params = {
            'FoodTitle': $("#txtFoodTitle").val(), 
            'FoodStatus': $("#cmbFoodStatus").val()
        };

            var FoodId = $("#hiddenFoodId").val();
            if (FoodId!='') {
                params = $.extend(params, { Where: "FoodId = "+FoodId });
                FormManager.updateEntity(params,
                    function(status, list) { 
                        $.alert("ویرایش غذا با موفقیت انجام شد.","","rtl",function(){
                            $("#txtFoodTitle").val('');
                            $("#hiddenFoodId").val('');
                            $("#cmbFoodStatus").prop('selectedIndex', 0);
                            hideLoading();
                            tblMain.refresh();
                        });		
                    },
                    function(error) { // تابع خطا
                        console.log("خطای برگشتی:", error);
                        $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
                    }
                );
            } else {

            const isDuplicate = mainList.some(item => item.FoodTitle.trim() === params.FoodTitle.trim());

                if (isDuplicate) {
                    alert(JSON.stringify('این غذا قبلا در لیست ثبت شده است.'));
                } else {
                FormManager.insertEntity(params,
                function(status, list) { 
                    $.alert("ثبت غذا با موفقیت انجام شد.","","rtl",function(){
                        hideLoading();
                        tblMain.refresh();
                        $("#txtFoodTitle").val('');
                        $("#hiddenFoodId").val('');
                        $("#cmbFoodStatus").prop('selectedIndex', 0);
                        $form.refresh();
                    });
                    },
                    function(error) { // تابع خطا
                        console.log("خطای برگشتی:", error);
                        $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
                    }
                );
                }
            }
    });
/*******end body****************** */

/*********form manager********************* */
    var FormManager = {
        //*****************************************************************************************************
        readEntityّFoodEdit: function(jsonParams, onSuccess, onError)
        {
            BS_HRFood.Read(jsonParams
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
        },
            //*****************************************************************************************************
        readEntityّFoodMealPlan: function(jsonParams, onSuccess, onError)
        {
        BS_FoodMealPlan.Read(jsonParams
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
        },
        //******************************************************************************************************
        insertEntity: function(jsonParams, onSuccess, onError)
        {
            BS_HRFood.Insert(jsonParams,
                function(data)
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
        deleteEntity: function(jsonParams, onSuccess, onError)
        {
            BS_HRFood.Delete(jsonParams, 
                function(data)
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
                        var methodName = "deleteEntity";
        
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
        updateEntity: function(jsonParams, onSuccess, onError)
        {
            BS_HRFood.Update(jsonParams
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
                        var methodName = "deleteEntity";
        
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
    };
/*********end form manager********************* */

/**********btn register*********************** */
    $("#btnRegister").click(function(){


        if ($("#txtFoodTitle").val() === '') {
            $.alert("نام غذا و وضعیت آن را تعیین نمایید", "", "rtl");
            return;
        }
        
        
        //افزودن غذا به لیست
        var params = {
            'FoodTitle': $("#txtFoodTitle").val(), 
            'FoodStatus': $("#cmbFoodStatus").val()
        };

            var FoodId = $("#hiddenFoodId").val();
            if (FoodId!='') {
                params = $.extend(params, { Where: "FoodId = "+FoodId });
                FormManager.updateEntity(params,
                    function(status, list) { 
                        $.alert("ویرایش غذا با موفقیت انجام شد.","","rtl",function(){
                            $("#txtFoodTitle").val('');
                            $("#hiddenFoodId").val('');
                            $("#cmbFoodStatus").prop('selectedIndex', 0);
                            hideLoading();
                            tblMain.refresh();
                        });		
                    },
                    function(error) { // تابع خطا
                        console.log("خطای برگشتی:", error);
                        $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
                    }
                );
            } else {

            const isDuplicate = mainList.some(item => item.FoodTitle.trim() === params.FoodTitle.trim());

                if (isDuplicate) {
                    alert(JSON.stringify('این غذا قبلا در لیست ثبت شده است.'));
                } else {
                FormManager.insertEntity(params,
                function(status, list) { 
                    $.alert("ثبت غذا با موفقیت انجام شد.","","rtl",function(){
                        hideLoading();
                        tblMain.refresh();
                        $("#txtFoodTitle").val('');
                        $("#hiddenFoodId").val('');
                        $("#cmbFoodStatus").prop('selectedIndex', 0);
                        $form.refresh();
                    });
                    },
                    function(error) { // تابع خطا
                        console.log("خطای برگشتی:", error);
                        $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
                    }
                );
                }
            }
    });
/**********end btn register*********************** */

/*****************js tbl*********************** */
    var tblMain = null;
    var mainList;
    $(function()
    {
        tblMain = (function()
        {
            //خواندن پارامترهای اصلی جدول
            var element = null,
                isDirty = false,
                rowPrimaryKeyName = "Id",
                readRows = FormManager.readEntityّFoodEdit
            //فراخوانی سازنده جدول
            init();
            //******************************************************************************************************
            function init()
            {
                element = $("#tblFood");
                build();
                bindEvents();
                //load();
            }
            //******************************************************************************************************
            function build()
            {       
                //دکمه افزودن     
                /*var imgAdd = $("<img/>", {src: "Images/add.png", title: "افزودن"}).addClass("add").css({cursor: "pointer"});
                element.find("tr.row-template").find("td:first").empty().append(imgAdd);*/
                
                //برای حذف دکمه افزودن این سطر را فعال و سطر باتلا را حذف کنید
                // if you don't want to use add button inside table uncomment the line below and remove the lines up
                //element.find("tr.row-template").hide();
            }
            //******************************************************************************************************
            //این متد در زمان ساخت هر سطر بر روی المان ها اعمال می شود
            function bindEvents()
            {
                element.on("click", ".edit", function() {
                    var row = $(this).closest('tr'); 
                    var FoodId = row.find('td:eq(3)').text().trim();
                    var foodTitle = row.find('td:eq(4)').text().trim(); 
                    var foodStatus = row.find('td:eq(6)').text().trim(); 
                    $("#hiddenFoodId").val(FoodId);
                    $("#txtFoodTitle").val(foodTitle);
                    $("#cmbFoodStatus").val(foodStatus);
        
                    var $cmbFoodStatus = $("#cmbFoodStatus");
                    if ($cmbFoodStatus.find("option[value='" + foodStatus + "']").length) {
                        $cmbFoodStatus.val(foodStatus);
                    }
                    
                });
                element.on("click", ".delete", function() {
                    var row = $(this).closest('tr'); 
                    var id = row.find('td:eq(3)').text().trim(); 
                    
                    var that = $(this); // ذخیره `this` در متغیر `that`
                    
                    $.qConfirm(that, "آیا از حذف مطمئن هستید؟", function(btn) {
                        if (btn.toUpperCase() === "OK") { // بررسی اینکه کاربر روی "OK" کلیک کرده است
                            
                            params =  {};
                            FormManager.readEntityّFoodMealPlan(params,
                                function(list,status) { 
                                    
                                    if (list.some(item => item.FoodId === id)) {
                                    alert(JSON.stringify('این غذا به روز خاصی اختصاص داده شده '));
                                    } else {
                                        params =  { Where: "FoodId = "+id };
                                        FormManager.deleteEntity(params,
                                            function(status, list) { 
                                                $.alert("حذف غذا با موفقیت انجام شد.","","rtl",function(){
                                                    hideLoading();
                                                    tblMain.refresh();
                                                });		
                                            },
                                            function(error) { // تابع خطا
                                                console.log("خطای برگشتی:", error);
                                                $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
                                            }
                                        );
                                    }
                                    
                                },
                                function(error) { // تابع خطا
                                    console.log("1خطای برگشتی:", error);
                                    $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
                                }
                            );
                            

                            
                        }
                    });
                });
                
                

        }
        //******************************************************************************************************
        //عملیات پر کردن دیتای هر سطر می باشد

        function addRow(rowInfo, rowNumber)
        {
            var index = 0,
            tempRow = element.find("tr.row-template").clone();
        
            tempRow.show().removeClass("row-template").addClass("row-data");
            tempRow.data("rowInfo", rowInfo);
            
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowNumber);
            var imgDelete = $("<img/>", {src: "Images/delete.png", title: "حذف"}).addClass("delete").css({cursor: "pointer"});
            tempRow.find("td:eq(" + index++ + ")").append(imgDelete);
            tempRow.attr({state: "saved"});
            
            var imgDelete = $("<img/>", {src: "Images/edit.png", title: "ویرایش"}).addClass("edit").css({cursor: "pointer"});
            tempRow.find("td:eq(" + index++ + ")").append(imgDelete);
            tempRow.attr({state: "new"});
        
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.FoodId);
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.FoodTitle);
            
            if (rowInfo.FoodStatus === "true") {
                foodStatus = 'فعال'; 
            } else {
                foodStatus = 'غیرفعال'; 
            }
            tempRow.find("td:eq(" + index++ + ")").empty().text(foodStatus);
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.FoodStatus);
            
            element.find("tr.row-template").before(tempRow);
            myHideLoading();
        }
            //******************************************************************************************************
            //حذف یک سطر
            function removeRow(row)
            {
                row_info = row.data("rowInfo");
                
                var params={Where: rowPrimaryKeyName + " = " + row_info.Id}
                
                deleteRows(params,
                    function(data)
                    {
                        refresh();
                        hideLoading();
                    },
                    function(error)
                    {
                        hideLoading();
                        alert(error);
                    }
                );
            }
            //******************************************************************************************************
            //برگذاری دیتا برای نمایش که در صورت لزوم می توان یک لیست به آن پاس داد
            function load()
            {
                var params = {"PersonnelNO " : currentPersonnelNO}; // change the params sent to FormManager with needed info
                showLoading();
                //متد readRows در ایتدای همین صفحه از FormManager مقدار دهی شده است.
                // درصورت نیاز به لود از لیست این بخش بازنویسی میگردد
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
                myHideLoading();
                
                params =  {};
                    FormManager.readEntityّFoodEdit(params,
                        function(list,status) { 
                            mainList=list;
                        },
                        function(error) { // تابع خطا
                            console.log("1خطای برگشتی:", error);
                            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
                        }
                    );
            }
            //******************************************************************************************************
            //بروز رسانی دیتای جدول
            function refresh()
            {
                //حذف دیتای موجود
                element.find("tr.row-data").remove();
                
                //بازنشانی دیتای جدول
                load();
            }
            //******************************************************************************************************

            return {
                refresh: refresh,
                load: load,
                readRows: readRows
            };
        }());
    });
/*****************end js tbl*********************** */



