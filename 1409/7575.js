
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
  
  $("#84213256866f78906a5dfc2078252026").click(function () {
    $("#GoodsDateRequired").setValue($("#GoodsDateRequired").find("input").val());
  });
  
  //#endregion
  
  //#region show/hide Items
  
  //$('#Req_Grid').hideColumn(1);
  
  $("#Reference_Process").show();
  $("#Reference_Process").disableValidation();
  $("#Process_NO").show();
  $("#Process_NO").disableValidation();
  $("#Storekeeper_Per").show();
  $("#Storekeeper_Per").disableValidation();
  $("#Confirmer_Per").show();
  $("#Confirmer_Per").disableValidation();
  $("#Approver_Per").show();
  $("#Approver_Per").disableValidation();
  $("#CompanyId").show();
  $("#CompanyId").disableValidation();
  $("#Unit_Name").show();
  $("#Unit_Name").disableValidation();
  $("#Warehouse_Name").show();
  $("#Warehouse_Name").disableValidation();
  $("#Goods_PNL").show();
  $("#First_Goods").show();
  $("#First_Goods").disableValidation();
  $("#Goods_Description").show();
  $("#Goods_Description").disableValidation();
  $("#GoodsNumber_currency").show();
  $("#GoodsNumber_currency").disableValidation();
  $("#GoodsUnit").show();
  $("#GoodsUnit").disableValidation();
  $("#GoodsDateRequired").show();
  $("#GoodsDateRequired").disableValidation();
  $("#GoodsCurrentBalance_currency").show();
  $("#GoodsCurrentBalance_currency").disableValidation();
  $("#GoodsConsumption_currency").show();
  $("#GoodsConsumption_currency").disableValidation();
  $("#my_css").show();
  $("#Tech_Specifications").show();
  $("#Tech_Specifications").disableValidation();
  $("#Save_Record1").show();
  $("#Save_Record1").disableValidation();
  $("#Req_Grid").show();
  $("#Req_Grid").disableValidation();
  
  $("#CodeItem1").show();
  $("#NameItem1").show();
  $("#First_Goods_Property").show();
  
  $("#Req_Desc").show();
  $("#Req_Desc").disableValidation();
  $("#Req_Name").show();
  $("#Req_Name").disableValidation();
  $("#Req_Sign_Pic").show();
  $("#Req_Sign_Pic").disableValidation();
  $("#submit0000000001").show();
  
  
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
      
      $("#84213256866f78906a5dfc2078252026").saveForm();
      
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
  
      ///// پاک کردن گرید اول
  
      let assignedRoleId = new Array();
  
      $("#First_Goods_Property option").each(function () {
        assignedRoleId.push(this.text);
      });
  
      let len = assignedRoleId.length;
  
      for (let rm = 0; rm <= len; rm++) {
        $("#Tech_Specifications").deleteRow();
      }
    }
  });
  
  //#endregion
  
  
  

  
  
  
  