

$("#Tech_Specifications").disableValidation(3);
//#region set attr select2

$("#CompanyId").getControl().select2({
    placeholder: '----'
  });
  
  $("#Unit_Name").getControl().select2({
    placeholder: '----'
  });
  
  $("#Warehouse_Name").getControl().select2({
    placeholder: '----'
  });
  
  $("#GoodsUnit").getControl().select2({
    placeholder: '----'
  });
  
  
  //#endregion
  
  //#region setting for req_grid
  var oNewButton = $("#Req_Grid").find("button.pmdynaform-grid-newitem");
  $("#Req_Grid").append(oNewButton);
  $("#Req_Grid .pmdynaform-grid-thead").css("display", "flex");
  $("#Req_Grid .pmdynaform-grid-thead").css("margin-right", "0px");
  //#endregion
  
  //#region get number
  
  function getNumber(_val) {
    return Number(_val.replace(/[\,]+/g, ""));
  }
  
  //#endregion
  
  //#region DateTime for form object
  
  var p = new persianDate();
  $("#GoodsDateRequired").getControl().persianDatepicker({
    formatDate: "YYYY/0M/0D",
  });
  
  $("#lead_Time").getControl().persianDatepicker({
    formatDate: "YYYY/0M/0D",
  });
  
  //#endregion
  
  //#region setOnchange for GoodsDateRequired AND Lead_Time
  var formId = $("form").prop("id");
  $("#" + formId).click(function () {
    $("#GoodsDateRequired").setValue($("#GoodsDateRequired").find("input").val());
    $("#lead_Time").setValue($("#lead_Time").find("input").val());
  });
  
  //#endregion
  
  //#region show/hide Items
  
  $("#Req_Grid").hideColumn(8);
  $("#Req_Grid").hideColumn(14);
  $("#Req_Grid").hideColumn(15);
  $("#my_css").hide();
  $("#CodeItem1").hide();
  $("#NameItem1").hide();
  $("#First_Goods_Property").hide();
  
  //#endregion
  
  //#region setOnchange for first goods
  
  $("#First_Goods").setOnchange(function (newValue, oldValue) {
  
    // delete row before add Items
    var rowCt = $("#Tech_Specifications").getNumberRows();
  
    for (var w = 0; w <= rowCt; w++) {
        $("#Tech_Specifications").deleteRow();
    }
  
    // add Item
    var assignedRoleId = new Array();
    $("#First_Goods_Property option").each(function () {
        assignedRoleId.push(this.text);
    });
  
    var texts = $("#First_Goods_Property option").map(function () {
        return $(this).val();
    }).get();
  
    var len = assignedRoleId.length;
  
    for (let z = 0; z < assignedRoleId.length + 1; z++) {
        //  debugger;
        $("#Tech_Specifications").addRow();
        $("#Tech_Specifications").setValue(texts[z - 1], z, 1);
        $("#Tech_Specifications").setText(assignedRoleId[z - 1], z, 2);
    }
    $("#Tech_Specifications").deleteRow();
  });
  
  //#endregion
  
  //#region click for Save_Record1
  
  $("#Save_Record1").click(function () {
  
    // get data
    $("#GoodsDateRequired").setValue($("#GoodsDateRequired").find("input").val());
    $("#lead_Time").setValue($("#lead_Time").find("input").val());
  
    let val_First_Goods = $("#First_Goods").getValue();
    let txt_First_Goods = $("#First_Goods").getText();
    let Goods_Description = $("#Goods_Description").getValue();
    let GoodsNumber_currency = $("#GoodsNumber_currency").getValue().trim();
    let GoodsNumber = getNumber($("#GoodsNumber_currency").getValue());
    let GoodsUnit = $("#GoodsUnit").getText();
    let GoodsUnit_Id = $("#GoodsUnit").getValue();
    let GoodsDateRequired = $("#GoodsDateRequired").getValue();
    let lead_Time = $("#lead_Time").getValue();
    let GoodsCurrentBalance_currency = $("#GoodsCurrentBalance_currency").getValue();
    let Unfilled_Orders_currency = $("#Unfilled_Orders_currency").getValue().trim();
    let Unfilled_Orders = $("#Unfilled_Orders_currency").getValue();
    let GoodsConsumption_currency = $("#GoodsConsumption_currency").getValue().trim();
    let GoodsConsumption = $("#GoodsConsumption_currency").getValue();
    let Consumption_Daily_Average_currency = $("#Consumption_Daily_Average_currency").getValue();
    let code1 = $("#CodeItem1").getValue();
    var rowCount5 = $("#Tech_Specifications").getNumberRows();
    var valid='';
    for (var i = 1; i <= rowCount5; i++) {
        if($("#Tech_Specifications-body input[id='form[Tech_Specifications][" + i + "][property_value]']").val().length === 0){
            valid =true;
        } 

    }
    // check conditions and set Value
    if (val_First_Goods == "" || GoodsNumber_currency == "" || GoodsUnit == "" || GoodsDateRequired == "" || GoodsCurrentBalance_currency == "" || GoodsConsumption_currency == "" || GoodsConsumption == "" || lead_Time == "" || Unfilled_Orders_currency == "" || Consumption_Daily_Average_currency == "" || Goods_Description == "" || GoodsNumber == "") {
        alert("لطفاً تمامی آیتمها تکمیل گردد");
    }
    else if (val_First_Goods === txt_First_Goods) {
        alert("لطفاً نام کالا را بدرستی انتخاب نمایید");
  
        // clear grid property
        let assignedRoleId = new Array();
        $("#First_Goods_Property option").each(function () {
            assignedRoleId.push(this.text);
        });
  
        let len = assignedRoleId.length;
        for (let rm = 0; rm <= len; rm++) {
            $("#Tech_Specifications").deleteRow();
        }
    }
    else if (GoodsNumber == 0) {
        alert("تعداد درخواستی نمیتواند صفر باشد");
    }
    else if (val_First_Goods != txt_First_Goods && GoodsNumber != 0) {
        if(valid==true){
            alert('لطفا مقادیر مشخصات فنی را وارد نمایید');
            $("#Tech_Specifications").enableValidation(3);
            return false;
        }else{
            $("#Tech_Specifications").disableValidation(3);
            $("#" + formId).saveForm();
  
            // give data property and generate json
      
            var rowCount = $("#Tech_Specifications").getNumberRows();
            var arr = [];
            var property = "";
            for (var i = 1; i <= rowCount; i++) {
      
                var prop_id = $("#Tech_Specifications-body input[id='form[Tech_Specifications][" + i + "][property_id]']").val();
                var prop_Val = $("#Tech_Specifications-body input[id='form[Tech_Specifications][" + i + "][property_value]']").val();
                var propery_Name = $("#Tech_Specifications-body input[id='form[Tech_Specifications][" + i + "][property_name]']").val();
                if (prop_Val.length > 0) {
                    property += propery_Name + " : " + prop_Val + "\n";
                }
                arr.push({
                    id: prop_id,
                    value: prop_Val
                });
            }
      
            var myJsonString = JSON.stringify(arr);
      
            // set all data in req_grid
      
            var rowCount = $("#Req_Grid").getNumberRows();
      
            for (var i = 1; i <= rowCount; i++) {
      
                if ($("#Req_Grid-body textarea[id='form[Req_Grid][" + i + "][Technical_Specs_Json]']").val().length === 0 &&
                    $("#Req_Grid-body textarea[id='form[Req_Grid][" + i + "][Technical_Specifications]']").val().length === 0) {
      
                    $("#Req_Grid").setText(property, i, 3);
                    $("#Req_Grid").setText(myJsonString, i, 15);
                    $("#Req_Grid").setText(code1, i, 1);
                    $("#Req_Grid").setText(txt_First_Goods, i, 2);
                    $("#Req_Grid").setText(Goods_Description, i, 13);
                    $("#Req_Grid").setText(GoodsNumber_currency, i, 4);
                    $("#Req_Grid").setText(GoodsUnit, i, 5);
                    $("#Req_Grid").setText(GoodsUnit_Id, i, 14);
                    $("#Req_Grid").setText(lead_Time, i, 6);
                    $("#Req_Grid").setText(GoodsDateRequired, i, 7);
                    $("#Req_Grid").setText(GoodsCurrentBalance_currency, i, 9);
                    $("#Req_Grid").setText(Unfilled_Orders, i, 10);
                    $("#Req_Grid").setText(GoodsConsumption_currency, i, 11);
                    $("#Req_Grid").setText(Consumption_Daily_Average_currency, i, 12);
                }
      
            }
      
            $("#Req_Grid").addRow();
            $("#First_Goods").setValue("");
            $("#First_Goods").setText("");
            $("#Goods_Description").setText("");
            $("#Goods_Description").setValue("");
            $("#GoodsNumber_currency").setValue("");
            $("#GoodsUnit").setValue("");
            $("#GoodsUnit").setText("");
            $("#GoodsUnit").getControl().select2({ placeholder: '----' });
            $("#GoodsDateRequired").setValue("");
            $("#GoodsCurrentBalance_currency").setValue("");
            $("#GoodsConsumption_currency").setValue("");
            $("#Unfilled_Orders").setValue("");
            $("#lead_Time").setValue("");
            $("#Consumption_Daily_Average_currency").setValue("");
      
            ///// پاک کردن گرید اول
      
            let assignedRoleId = new Array();
      
            $("#First_Goods_Property option").each(function () {
                assignedRoleId.push(this.text);
            });
      
            let len = assignedRoleId.length;
      
            for (let rm = 0; rm <= len; rm++) {
                $("#Tech_Specifications").deleteRow();
            }
            var rowCount2 = $("#Req_Grid").getNumberRows();
            var emptycheck='';
            for (var i = 1; i <= rowCount2; i++) { 
                if (
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Goods_Code]']").val().length === 0 &&
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Required_Items]']").val().length === 0  && 
                    $("#Req_Grid-body textarea[id='form[Req_Grid][" + i + "][Technical_Specifications]']").val().length=== 0 &&
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Number]']").val().length=== 0 &&
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Unit]']").val().length=== 0 &&
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Date_Required]']").val().length=== 0 &&
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Confirmed_Number_currency]']").val().length=== 0 &&
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Current_Balance]']").val().length=== 0 &&
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Consumption]']").val().length=== 0 &&
                    $("#Req_Grid-body textarea[id='form[Req_Grid][" + i + "][Goods_Desc]']").val().length=== 0 
                    ) {
                        emptycheck=true;
                    }
               }
           // $("#submit0000000001").find("button").attr("disabled", false);
        }
       
    }
    if (emptycheck==1) {
        $("#Req_Grid-body .pmdynaform-static").find("div").parent().css('display','');
        $("#Req_Grid-body .pmdynaform-static").find("div:last").parent().css('display','none');
    }
  });
  
  //#endregion
  
  //region select business manager per

    $("#CompanyId").setOnchange( function(newVal, oldVal) {
    if ((newVal == "36") || (newVal == "52")|| (newVal == "53")|| (newVal == "54")|| (newVal == "55")){ 
        
        // میهن - وحید رحیمی
        
        $("#Business_Manager_Per").setValue('f2e5827f-d669-4df6-913f-a923d6cb');
        
    }
    else if( (newVal == "41") || (newVal == "45") ||(newVal == "46") ||(newVal == "47")){
        
        // هلدینگ کشاورزی - محمدرضا چگینی
        
        $("#Business_Manager_Per").setValue('fa83a032-bb02-4f6b-bdaf-86096955');    
    }
    
    });

  //#endregion

    $("#65222167966fbfb57d70fb5052165760").click(function()
  {  
  if($('#CompanyId').getValue() =="36"){
  
      // میهن - وحید رحیمی
  $("#Business_Manager_Per").setValue('f2e5827f-d669-4df6-913f-a923d6cb');
  }
  else if($('#CompanyId').getValue() =="52")
  {
      // میهن - وحید رحیمی
  $("#Business_Manager_Per").setValue('f2e5827f-d669-4df6-913f-a923d6cb');
  
  }
  else if($('#CompanyId').getValue() =="53")
  {
      // میهن - وحید رحیمی
  $("#Business_Manager_Per").setValue('f2e5827f-d669-4df6-913f-a923d6cb');
  
  }
   else if($('#CompanyId').getValue() =="54")
  {
      // میهن - وحید رحیمی
  $("#Business_Manager_Per").setValue('f2e5827f-d669-4df6-913f-a923d6cb');
  
  }
   else if($('#CompanyId').getValue() =="55")
  {
      // میهن - وحید رحیمی
  $("#Business_Manager_Per").setValue('f2e5827f-d669-4df6-913f-a923d6cb');
  
  }
   else if($('#CompanyId').getValue() =="41")
  {
    // هلدینگ کشاورزی - محمدرضا چگینی
     $("#Business_Manager_Per").setValue('fa83a032-bb02-4f6b-bdaf-86096955');  
  
  }
  else if($('#CompanyId').getValue() =="45")
  {
    // هلدینگ کشاورزی - محمدرضا چگینی
     $("#Business_Manager_Per").setValue('fa83a032-bb02-4f6b-bdaf-86096955');  
  
  }
     else if($('#CompanyId').getValue() =="46")
  {
    // هلدینگ کشاورزی - محمدرضا چگینی
     $("#Business_Manager_Per").setValue('fa83a032-bb02-4f6b-bdaf-86096955');  
  
  }
     else if($('#CompanyId').getValue() =="47")
  {
  // هلدینگ کشاورزی - محمدرضا چگینی
     $("#Business_Manager_Per").setValue('fa83a032-bb02-4f6b-bdaf-86096955');
  
  
    }});
  
  //#endregion
  
  
  
  
  
  
  
  
  
  
  
  
  