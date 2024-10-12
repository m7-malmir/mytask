$("#submit0000000002").click(function (event) {
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
                //$("#Req_Grid-body .pmdynaform-static ").find("div:last").parent().remove();
            }
    }
    var rowCount3 = $("#Req_Grid").getNumberRows(); 
    if(rowCount3 == 1 &&  emptycheck==true){
        alert("لطفا تعداد تایید شده را وارد نمایید");
        event.preventDefault();
    }
   else if(rowCount3 >= 1 ){
            var errors='';    
            for (var i = 1; i <= rowCount3-1; i++) {
                if (
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Goods_Code]']").val().length === 0 ||
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Required_Items]']").val().length === 0  || 
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Unit]']").val().length=== 0 ||
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Date_Required]']").val().length=== 0 ||
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Confirmed_Number_currency]']").val().length=== 0 ||
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Current_Balance]']").val().length=== 0 ||
                    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Consumption]']").val().length=== 0 
                    
                    ) {
                        errors=1;
                    }
        
                    }
                    if(errors==1){
                        alert("لطفا تعداد تایید شده را وارد نمایید");
                        event.preventDefault();
                    }
        
        }
            
    });
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
  
  //#region show/hide Reference_Process
  
  $("#Reference_Process").setOnchange(function (newVal, oldVal) {
    var AppNumber1 = $("#Process_NO").getValue();
    var AppNumber = $("#Processid").getValue();
  
    if (newVal == "1") {
      $("#Process_NO").show();
      $("#Process_NO").enableValidation();
      $("#Reference_NO").setValue(AppNumber1);
    } else if (newVal == "2") {
      $("#Process_NO").hide();
      $("#Process_NO").disableValidation();
      $("#Reference_NO").setValue(AppNumber);
    }
  });
  //////////////////////////////////////////////////////////////////////////////
  if ($("#Reference_Process").getValue() == "1") {
    $("#Process_NO").show();
    $("#Process_NO").enableValidation();
  } else if ($("#Reference_Process").getValue() == "2") {
    $("#Process_NO").hide();
    $("#Process_NO").disableValidation();
  }
  /////////////////////////////////////////////////////////////////////////////
  
  //#endregion
  
  //#region DateTime for form object
  
  var p = new persianDate();
  $("#GoodsDateRequired").getControl().persianDatepicker({
    formatDate: "YYYY/0M/0D",
  });
  
  //#endregion
  
  //#region setOnchange for GoodsDateRequired
  
  $("#635284423670666ec88d9a2011871904").click(function () {
    $("#GoodsDateRequired").setValue($("#GoodsDateRequired").find("input").val());
  });
  
  //#endregion
  
  //#region show/hide Items
  
  $("#Tech_Specifications").hideColumn(1);
  $("#Req_Grid").hideColumn(11);
  $("#Req_Grid").hideColumn(12);
  
  $("#Reference_Process").hide();
  $("#Reference_Process").disableValidation();
  $("#Req_Type").hide();
  $("#Req_Type").disableValidation();
  
  $("#Process_NO").hide();
  $("#Process_NO").disableValidation();
  $("#Storekeeper_Per").hide();
  $("#Storekeeper_Per").disableValidation();
  $("#Confirmer_Per").hide();
  $("#Confirmer_Per").disableValidation();
  $("#Approver_Per").hide();
  $("#Approver_Per").disableValidation();
  $("#CompanyId").hide();
  $("#CompanyId").disableValidation();
  $("#Unit_Name").hide();
  $("#Unit_Name").disableValidation();
  $("#Warehouse_Name").hide();
  $("#Warehouse_Name").disableValidation();
  $("#Goods_PNL").hide();
  $("#First_Goods").hide();
  $("#First_Goods").disableValidation();
  $("#Goods_Description").hide();
  $("#Goods_Description").disableValidation();
  $("#GoodsNumber_currency").hide();
  $("#GoodsNumber_currency").disableValidation();
  $("#GoodsUnit").hide();
  $("#GoodsUnit").disableValidation();
  $("#GoodsDateRequired").hide();
  $("#GoodsDateRequired").disableValidation();
  $("#GoodsCurrentBalance_currency").hide();
  $("#GoodsCurrentBalance_currency").disableValidation();
  $("#GoodsConsumption_currency").hide();
  $("#GoodsConsumption_currency").disableValidation();
  $("#my_css").hide();
  $("#Tech_Specifications").hide();
  $("#Tech_Specifications").disableValidation();
  $("#Save_Record1").hide();
  $("#Save_Record1").disableValidation();
  $("#Req_Grid").hide();
  $("#Req_Grid").disableValidation();
  $("#CodeItem1").hide();
  $("#NameItem1").hide();
  $("#First_Goods_Property").hide();
  $("#Req_Desc").hide();
  $("#Req_Desc").disableValidation();
  $("#Req_Name").hide();
  $("#Req_Name").disableValidation();
  $("#Req_Sign_Pic").hide();
  $("#Req_Sign_Pic").disableValidation();
  $("#Hardware_Chief_Per").hide();
  $("#Hardware_Chief_Per").disableValidation();
  
  $("#submit0000000001").hide();
  $("#Req_Date_Time").hide();
  
  $("#Definition_Storekeeper").setOnchange(function (newVal, oldVal) {
    if (newVal == "1") {
      $("#Req_Type").show();
      $("#Req_Type").enableValidation();
      $("#Storekeeper_Per").hide();
      $("#Storekeeper_Per").disableValidation();
      $("#Reference_Process").show();
      $("#Reference_Process").enableValidation();
      $("#Confirmer_Per").show();
      $("#Confirmer_Per").enableValidation();
      $("#Approver_Per").show();
      $("#Approver_Per").enableValidation();
      $("#CompanyId").show();
      $("#CompanyId").enableValidation();
      $("#Unit_Name").show();
      $("#Unit_Name").enableValidation();
      $("#Warehouse_Name").show();
      $("#Warehouse_Name").enableValidation();
      $("#Goods_PNL").show();
      $("#First_Goods").show();
      $("#First_Goods").enableValidation();
      $("#Goods_Description").show();
      $("#Goods_Description").enableValidation();
      $("#GoodsNumber_currency").show();
      $("#GoodsNumber_currency").enableValidation();
      $("#GoodsUnit").show();
      $("#GoodsUnit").enableValidation();
      $("#GoodsDateRequired").show();
      $("#GoodsDateRequired").enableValidation();
      $("#GoodsCurrentBalance_currency").show();
      $("#GoodsCurrentBalance_currency").enableValidation();
      $("#GoodsConsumption_currency").show();
      $("#GoodsConsumption_currency").enableValidation();
      $("#Tech_Specifications").show();
      $("#Tech_Specifications").enableValidation();
      $("#Save_Record1").show();
      $("#Save_Record1").enableValidation();
      $("#Req_Grid").show();
      $("#Req_Grid").enableValidation();
      $("#Req_Desc").show();
      $("#Req_Desc").enableValidation();
      $("#Req_Name").show();
      $("#Req_Name").enableValidation();
      $("#Req_Sign_Pic").show();
      $("#Req_Sign_Pic").enableValidation();
      $("#submit0000000001").show();
      $("#Req_Date_Time").show();
  
    } else if (newVal == "2") {
      $("#Req_Type").show();
      $("#Req_Type").enableValidation();
      $("#Storekeeper_Per").show();
      $("#Storekeeper_Per").enableValidation();
      $("#Reference_Process").show();
      $("#Reference_Process").enableValidation();
      $("#Confirmer_Per").show();
      $("#Confirmer_Per").enableValidation();
      $("#Approver_Per").show();
      $("#Approver_Per").enableValidation();
      $("#CompanyId").show();
      $("#CompanyId").enableValidation();
      $("#Unit_Name").show();
      $("#Unit_Name").enableValidation();
      $("#Warehouse_Name").show();
      $("#Warehouse_Name").enableValidation();
      $("#Goods_PNL").show();
      $("#First_Goods").show();
      $("#First_Goods").enableValidation();
      $("#Goods_Description").show();
      $("#Goods_Description").enableValidation();
      $("#GoodsNumber_currency").show();
      $("#GoodsNumber_currency").enableValidation();
      $("#GoodsUnit").show();
      $("#GoodsUnit").enableValidation();
      $("#GoodsDateRequired").show();
      $("#GoodsDateRequired").enableValidation();
      $("#GoodsCurrentBalance_currency").show();
      $("#GoodsCurrentBalance_currency").enableValidation();
      $("#GoodsConsumption_currency").show();
      $("#GoodsConsumption_currency").enableValidation();
      $("#Tech_Specifications").show();
      $("#Tech_Specifications").enableValidation();
      $("#Save_Record1").show();
      $("#Save_Record1").enableValidation();
      $("#Req_Grid").show();
      $("#Req_Grid").enableValidation();
      $("#Req_Desc").show();
      $("#Req_Desc").enableValidation();
      $("#Req_Name").show();
      $("#Req_Name").enableValidation();
      $("#Req_Sign_Pic").show();
      $("#Req_Sign_Pic").enableValidation();
      $("#submit0000000001").show();
      $("#Req_Date_Time").show();
    }
  });
  
  if ($("#Definition_Storekeeper").getValue() == '1'){
    $("#Req_Type").show();
    $("#Req_Type").enableValidation();
    $("#Storekeeper_Per").hide();
    $("#Storekeeper_Per").disableValidation();
    $("#Reference_Process").show();
    $("#Reference_Process").enableValidation();
    $("#Confirmer_Per").show();
    $("#Confirmer_Per").enableValidation();
    $("#Approver_Per").show();
    $("#Approver_Per").enableValidation();
    $("#CompanyId").show();
    $("#CompanyId").enableValidation();
    $("#Unit_Name").show();
    $("#Unit_Name").enableValidation();
    $("#Warehouse_Name").show();
    $("#Warehouse_Name").enableValidation();
    $("#Goods_PNL").show();
    $("#First_Goods").show();
    $("#First_Goods").enableValidation();
    $("#Goods_Description").show();
    $("#Goods_Description").enableValidation();
    $("#GoodsNumber_currency").show();
    $("#GoodsNumber_currency").enableValidation();
    $("#GoodsUnit").show();
    $("#GoodsUnit").enableValidation();
    $("#GoodsDateRequired").show();
    $("#GoodsDateRequired").enableValidation();
    $("#GoodsCurrentBalance_currency").show();
    $("#GoodsCurrentBalance_currency").enableValidation();
    $("#GoodsConsumption_currency").show();
    $("#GoodsConsumption_currency").enableValidation();
    $("#Tech_Specifications").show();
    $("#Tech_Specifications").enableValidation();
    $("#Save_Record1").show();
    $("#Save_Record1").enableValidation();
    $("#Req_Grid").show();
    $("#Req_Grid").enableValidation();
    $("#Req_Desc").show();
    $("#Req_Desc").enableValidation();
    $("#Req_Name").show();
    $("#Req_Name").enableValidation();
    $("#Req_Sign_Pic").show();
    $("#Req_Sign_Pic").enableValidation();
    $("#submit0000000001").show();
    $("#Req_Date_Time").show();
  
  }
  else if ($("#Definition_Storekeeper").getValue() == '2'){
    $("#Req_Type").show();
    $("#Req_Type").enableValidation();
    $("#Storekeeper_Per").show();
    $("#Storekeeper_Per").enableValidation();
    $("#Reference_Process").show();
    $("#Reference_Process").enableValidation();
    $("#Confirmer_Per").show();
    $("#Confirmer_Per").enableValidation();
    $("#Approver_Per").show();
    $("#Approver_Per").enableValidation();
    $("#CompanyId").show();
    $("#CompanyId").enableValidation();
    $("#Unit_Name").show();
    $("#Unit_Name").enableValidation();
    $("#Warehouse_Name").show();
    $("#Warehouse_Name").enableValidation();
    $("#Goods_PNL").show();
    $("#First_Goods").show();
    $("#First_Goods").enableValidation();
    $("#Goods_Description").show();
    $("#Goods_Description").enableValidation();
    $("#GoodsNumber_currency").show();
    $("#GoodsNumber_currency").enableValidation();
    $("#GoodsUnit").show();
    $("#GoodsUnit").enableValidation();
    $("#GoodsDateRequired").show();
    $("#GoodsDateRequired").enableValidation();
    $("#GoodsCurrentBalance_currency").show();
    $("#GoodsCurrentBalance_currency").enableValidation();
    $("#GoodsConsumption_currency").show();
    $("#GoodsConsumption_currency").enableValidation();
    $("#Tech_Specifications").show();
    $("#Tech_Specifications").enableValidation();
    $("#Save_Record1").show();
    $("#Save_Record1").enableValidation();
    $("#Req_Grid").show();
    $("#Req_Grid").enableValidation();
    $("#Req_Desc").show();
    $("#Req_Desc").enableValidation();
    $("#Req_Name").show();
    $("#Req_Name").enableValidation();
    $("#Req_Sign_Pic").show();
    $("#Req_Sign_Pic").enableValidation();
    $("#submit0000000001").show();
    $("#Req_Date_Time").show();
  }
  $("#Req_Type").setOnchange(function (newValue, oldValue) {
    if ($("#Req_Type").getValue() == '1'){
      
     $("#Hardware_Chief_Per").hide();
     $("#Hardware_Chief_Per").disableValidation(); 
    }
    else if ($("#Req_Type").getValue() == '2'){
      
     $("#Hardware_Chief_Per").show();
     $("#Hardware_Chief_Per").enableValidation(); 
    }
    
  });
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
  
    //console.log(texts);
    //console.log(assignedRoleId);
  
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
    let val_First_Goods = $("#First_Goods").getValue();
    let txt_First_Goods = $("#First_Goods").getText();
    let Goods_Description = $("#Goods_Description").getValue();
    let GoodsNumber_currency = $("#GoodsNumber_currency").getValue().trim();
    let GoodsNumber = getNumber($("#GoodsNumber_currency").getValue());
    let GoodsUnit = $("#GoodsUnit").getText();
    let GoodsUnit_Id = $("#GoodsUnit").getValue();
    let GoodsDateRequired = $("#GoodsDateRequired").getValue();
    let GoodsCurrentBalance_currency = $("#GoodsCurrentBalance_currency").getValue();
    let GoodsConsumption_currency = $("#GoodsConsumption_currency").getValue();
    let code1 = $("#CodeItem1").getValue();
  
    // check conditions and set Value
  
    if ( val_First_Goods == "" || GoodsNumber_currency == "" || GoodsUnit == "" || GoodsDateRequired == "" || GoodsCurrentBalance_currency == "" || GoodsConsumption_currency == ""  ) {
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
    else if ( val_First_Goods != txt_First_Goods && GoodsNumber != 0  ) {
      
      
      // give data property and generate json
  
      var rowCount = $("#Tech_Specifications").getNumberRows();
      var arr = [];
      var property="";
      for (var i = 1; i <= rowCount; i++) {
      
      var prop_id = $("#Tech_Specifications-body input[id='form[Tech_Specifications]["+i+"][property_id]']").val();
      var prop_Val =  $("#Tech_Specifications-body input[id='form[Tech_Specifications]["+i+"][property_value]']").val();
      var propery_Name= $("#Tech_Specifications-body input[id='form[Tech_Specifications]["+i+"][property_name]']").val();
      if(prop_Val.length>0){
      property+=propery_Name+" : "+prop_Val+"\n";
      }
        arr.push({
              id:  prop_id,
              value: prop_Val  
          });
       }
  
      var myJsonString = JSON.stringify(arr);
  
      // set all data in req_grid
   
      var rowCount = $("#Req_Grid").getNumberRows();
    
        for (var i = 1; i <= rowCount; i++) {
        
         if($("#Req_Grid-body textarea[id='form[Req_Grid]["+i+"][Technical_Specs_Json]']").val().length === 0 && $("#Req_Grid-body textarea[id='form[Req_Grid]["+i+"][Technical_Specifications]']").val().length === 0 ){
          $("#Req_Grid").setText(property, i, 3);
          $("#Req_Grid").setText(myJsonString, i, 12);
          $("#Req_Grid").setText(code1, i, 1);
          $("#Req_Grid").setText(txt_First_Goods, i, 2);
          $("#Req_Grid").setText(Goods_Description, i, 10);
          $("#Req_Grid").setText(GoodsNumber_currency, i, 4);
          $("#Req_Grid").setText(GoodsUnit, i, 5);
          $("#Req_Grid").setText(GoodsUnit_Id, i, 11);
          $("#Req_Grid").setText(GoodsDateRequired, i, 6);
          $("#Req_Grid").setText(GoodsCurrentBalance_currency, i, 8);
          $("#Req_Grid").setText(GoodsConsumption_currency, i, 9); 
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
      $("#GoodsUnit").getControl().select2({placeholder: '----'});
      $("#GoodsDateRequired").setValue("");
      $("#GoodsCurrentBalance_currency").setValue("");
      $("#GoodsConsumption_currency").setValue("");
  

      var gridField = $("#Req_Grid"); // استفاده از شناسه گرید 'Req_grid'
          
      // گرفتن تمام ردیف‌های قابل مشاهده در گرید
      var visibleRows = gridField.find('tbody tr').filter(function() {
          return $(this).css('display') !== 'none';
      });
  
      if (visibleRows.length > 0) {
          // مخفی کردن آخرین ردیف قابل مشاهده
          $(visibleRows[visibleRows.length - 1]).hide();
      }
  
      // پاک کردن گرید اول
  
      let assignedRoleId = new Array();
  
      $("#First_Goods_Property option").each(function () {
        assignedRoleId.push(this.text);
      });
  
      let len = assignedRoleId.length;
  
      for (let rm = 0; rm <= len; rm++) {
        $("#Tech_Specifications").deleteRow();
      }
      
        $("#635284423670666ec88d9a2011871904").saveForm();
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
    }



    if (emptycheck==1) {
        $("#Req_Grid-body .pmdynaform-static").find("div").parent().css('display','');
        $("#Req_Grid-body .pmdynaform-static").find("div:last").parent().css('display','none');
    }
   
  });
  
  //#endregion
  
  //#region submit
  
  $("#submit0000000001").click(function (event) {
  
    var req_type = $("#Req_Type").getValue();
    var req_id = $("#Req_ID").getValue();
  
    if (req_type == '2') {
       if(req_id == '3521032a-bb8a-4654-a5db-0de69363' ||  req_id == '33d2a7e2-1a93-41d1-a755-82e6dd7e' ||  req_id == '44631190-0eab-47ee-a364-1cc2095e' ||  req_id == 'a565e8d0-1d3a-4926-9831-e5469b27' ||  req_id == 'ce7cfff9-92f4-46ea-942d-07eab684' ||  req_id == '9ee832d3-c554-4ad9-9134-79f63293' ||  req_id == '0d707a39-c166-4e8a-9511-3a117a96' ||  req_id == '0c7b223f-0bf2-4940-a9e2-13468d1b' ||  req_id == '8f329c5e-222a-4ec2-a4c2-9e15be85'){
        $('#635284423670666ec88d9a2011871904').submit();
      } else {
        event.preventDefault();
        alert('شما مجاز به ثبت درخواست اقلام IT نمی باشید');
      }
    } else if (req_type == '1') {
      $('#635284423670666ec88d9a2011871904').submit();
    }
    



    
  });

  //#endregion
  
  //#region set approval for It
  
  $("#Req_Type").click(()=>{
  
  if ($("#Req_Type").getValue() == 1){
    
    $("#Approver_Per").setValue("");
    // $("#Approver_Per").setText("");
    $("#Approver_Per").getControl().prop('disabled', false);
    $('#Approver_Per input').attr('placeholder','جستجو کنید');
  
    
  }
  else if ($("#Req_Type").getValue() == 2) {
    $("#Approver_Per").setValue("cbe06128-9853-422c-9ad8-2a426717");
    $("#Approver_Per").setText("مجید فرزد معاونت برنامه ریزی و سیستمها");
    $("#Approver_Per").getControl().prop('disabled', true);
  
  }
  
  });
  
  //#endregion
  
  
  //#region set approval 
  
  $("#CompanyId").setOnchange( function(newVal, oldVal) {
    if ((newVal == "36") || (newVal == "52")|| (newVal == "53")|| (newVal == "54")|| (newVal == "55")){ 
      
        // میهن - وحید رحیمی
      
        $("#Business_Manager_Per").setValue('f2e5827f-d669-4df6-913f-a923d6cb');
        
  
  
  $("#CompanyId").setOnchange(function(newVal){
  
    if (newVal == 52){
        $("#Req_Location").show();
      $("#Req_Location").enableValidation();
  
    }
    else if (newVal != 52){
      
          $("#Req_Location").hide();
      $("#Req_Location").disableValidation();
    }});
      
      
    }
    else if( (newVal == "41") || (newVal == "45") ||(newVal == "46") ||(newVal == "47")){
      
       // هلدینگ کشاورزی - محمدرضا چگینی
      
        $("#Business_Manager_Per").setValue('fa83a032-bb02-4f6b-bdaf-86096955');    
    }
  
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
   $("#635284423670666ec88d9a2011871904").click(function()
  {  
    if($('#CompanyId').getValue() =="36"){
  
        // میهن - وحید رحیمی
    $("#Business_Manager_Per").setValue('f2e5827f-d669-4df6-913f-a923d6cb');
          $("#Req_Location").hide();
      $("#Req_Location").disableValidation();
  }
  else if($('#CompanyId').getValue() =="52")
  {
        // میهن - وحید رحیمی
    $("#Business_Manager_Per").setValue('f2e5827f-d669-4df6-913f-a923d6cb');
        $("#Req_Location").show();
      $("#Req_Location").enableValidation();
   
  }
    else if($('#CompanyId').getValue() =="53")
  {
        // میهن - وحید رحیمی
    $("#Business_Manager_Per").setValue('f2e5827f-d669-4df6-913f-a923d6cb');
        $("#Req_Location").hide();
      $("#Req_Location").disableValidation();
   
  }
     else if($('#CompanyId').getValue() =="54")
  {
        // میهن - وحید رحیمی
    $("#Business_Manager_Per").setValue('f2e5827f-d669-4df6-913f-a923d6cb');
        $("#Req_Location").hide();
      $("#Req_Location").disableValidation();
   
  }
     else if($('#CompanyId').getValue() =="55")
  {
        // میهن - وحید رحیمی
    $("#Business_Manager_Per").setValue('f2e5827f-d669-4df6-913f-a923d6cb');
        $("#Req_Location").hide();
      $("#Req_Location").disableValidation();
   
  }
     else if($('#CompanyId').getValue() =="41")
  {
      // هلدینگ کشاورزی - محمدرضا چگینی
       $("#Business_Manager_Per").setValue('fa83a032-bb02-4f6b-bdaf-86096955');  
        $("#Req_Location").hide();
      $("#Req_Location").disableValidation();
   
  }
    else if($('#CompanyId').getValue() =="45")
  {
      // هلدینگ کشاورزی - محمدرضا چگینی
       $("#Business_Manager_Per").setValue('fa83a032-bb02-4f6b-bdaf-86096955');  
        $("#Req_Location").hide();
      $("#Req_Location").disableValidation();
   
  }
       else if($('#CompanyId').getValue() =="46")
  {
      // هلدینگ کشاورزی - محمدرضا چگینی
       $("#Business_Manager_Per").setValue('fa83a032-bb02-4f6b-bdaf-86096955');  
        $("#Req_Location").hide();
      $("#Req_Location").disableValidation();
   
  }
       else if($('#CompanyId').getValue() =="47")
  {
    // هلدینگ کشاورزی - محمدرضا چگینی
       $("#Business_Manager_Per").setValue('fa83a032-bb02-4f6b-bdaf-86096955');
        $("#Req_Location").hide();
      $("#Req_Location").disableValidation();
   
  }});
  //////////
  //#endregion
  
  

   
