
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
  
  $("#Reference_Process").hide();
  $("#Reference_Process").disableValidation();
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
  $("#submit0000000001").hide();
  
  $("#Definition_Storekeeper").setOnchange(function (newVal, oldVal) {
    if (newVal == "1") {
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
  
    } else if (newVal == "2") {
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
    }
  });
  
  //#endregion
  
  /*
  //#region setOnchange for other goods
  $("#Other_Goods").setOnchange(function (newValue, oldValue) {
  
    // delete row before add Items
    let rowCt = $("#Tech_Specifications").getNumberRows();
  
    for (let w = 0; w <= rowCt; w++) {
      $("#Tech_Specifications").deleteRow();
    }
  
    // add Item
    let assignedRoleId = new Array();
    $("#textVar004 option").each(function () {
      assignedRoleId.push(this.text);
    });
  
    var texts = $("#textVar004 option")
      .map(function () {
        return $(this).val();
      })
      .get();
  
    let len = assignedRoleId.length;
  
    for (let z = 0; z < assignedRoleId.length + 1; z++) {
      //  debugger;
  
      $("#Tech_Specifications").addRow();
      $("#Tech_Specifications").setValue(texts[z - 1], z, 1);
      $("#Tech_Specifications").setText(assignedRoleId[z - 1], z, 2);
    }
  
    $("#Tech_Specifications").deleteRow();
  });
  
  //#endregion
  */
  
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
    $("#GoodsDateRequired").setValue($("#GoodsDateRequired").find("input").val());
    let val_First_Goods = $("#First_Goods").getValue();
    let Goods_Description = $("#Goods_Description").getValue();
    let GoodsNumber_currency = $("#GoodsNumber_currency").getValue().trim();
    let GoodsNumber = getNumber($("#GoodsNumber_currency").getValue());
    // let GOODSGROUPNAME = $("#GOODSGROUPNAME").getValue().trim();
    let GoodsUnit = $("#GoodsUnit").getText();
    let GoodsDateRequired = $("#GoodsDateRequired").getValue();
    let GoodsCurrentBalance = $("#GoodsCurrentBalance").getValue().trim();
    let GoodsConsumption = $("#GoodsConsumption").getValue().trim();
    let txt_First_Goods = $("#NameItem1").getText();
    let code1 = $("#CodeItem1").getValue();
  
    if (
      val_First_Goods == "" ||
      GoodsNumber_currency == "" ||
      GoodsUnit == "" ||
      GoodsDateRequired == "" ||  
      GoodsCurrentBalance_currency == "" ||
      GoodsConsumption_currency == ""
    ) {
      alert("لطفاً تمامی آیتمها تکمیل گردد");
    } else if (val_First_Goods === txt_First_Goods) {
      alert("لطفاً نام کالا را بدرستی انتخاب نمایید");
  
      let assignedRoleId = new Array();
  
      $("#First_Goods_Property option").each(function () {
        assignedRoleId.push(this.text);
      });
  
      let len = assignedRoleId.length;
      for (let rm = 0; rm <= len; rm++) {
        $("#Tech_Specifications").deleteRow();
      }
    } else if (GoodsNumber == 0) {
      alert("تعداد درخواستی نمیتواند صفر باشد");
    } else if (
      val_First_Goods !== txt_First_Goods &&
      GoodsNumber != 0
    ) {
      $("#84213256866f78906a5dfc2078252026").saveForm();
  
      let row = $("#Req_Grid").getNumberRows();
  
      for (let i = row; i <= row; i++) {
        $("#Req_Grid").setText(code1, i, 1);
        $("#Req_Grid").setText(txt_First_Goods, i, 2);
        $("#Req_Grid").setText(Goods_Description, i, 10);
        $("#Req_Grid").setText(GoodsNumber_currency, i, 4);
        $("#Req_Grid").setText(GoodsUnit, i, 5);
        $("#Req_Grid").setText(GoodsDateRequired, i, 6);
        $("#Req_Grid").setText(GoodsCurrentBalance, i, 8);
        $("#Req_Grid").setText(GoodsConsumption, i, 9);
      }
  
      let rowCount = $("#Tech_Specifications").getNumberRows();
      let my_arr = [];
  
      for (let m = 0; m <= rowCount; m++) {
        let property_id = $("#Tech_Specifications").getText(m, 2);
        let property_val = $("#Tech_Specifications").getText(m, 3);
  
        my_arr.push(property_id + ":" + property_val);
        //  my_arr.push(property_name + ': ' + property_val + ';');
        // my_arr.push(property_val);
        // $('#Req_Grid').setValue(property_name + ':' + property_val + ';' ,m,3);
      }
  
      delete my_arr[0];
  
      let Req_Grid_cnt = $("#Req_Grid").getNumberRows();
      let txt = $("#Req_Grid").getValue(Req_Grid_cnt, 3);
      let lst = my_arr.join("\n");
      $("#Req_Grid").setValue(txt + lst, Req_Grid_cnt, 3);
  
    
  for (let n = 1; n <= my_arr.length; n++) {
        debugger;
  
         let txt = $("#Req_Grid").getValue( n, 3);
         debugger;
  
        let lst =  my_arr.join('\n');
        debugger;
  
        $("#Req_Grid").setValue( txt + lst, n, 3);
        debugger;
  
      }
  
  
      $("#Req_Grid").addRow();
      $("#Other_Goods").setValue("");
      $("#Other_Goods").setText("");
  
      $("#GoodsNumber_currency").setValue("");
      $("#GoodsUnit").setValue("");
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
  
  
  //#region click for Save_Record1 old
  /*
  $("#Save_Record1").click(function () {
    $("#GoodsDateRequired").setValue($("#GoodsDateRequired").find("input").val());
    let val_First_Goods = $("#First_Goods").getValue();
    let Goods_Description = $("#Goods_Description").getValue();
    let GoodsNumber_currency = $("#GoodsNumber_currency").getValue().trim();
    let GoodsNumber = getNumber($("#GoodsNumber_currency").getValue());
    // let GOODSGROUPNAME = $("#GOODSGROUPNAME").getValue().trim();
    let GoodsUnit = $("#GoodsUnit").getText();
    let GoodsDateRequired = $("#GoodsDateRequired").getValue();
    let GoodsCurrentBalance = $("#GoodsCurrentBalance").getValue().trim();
    let GoodsConsumption = $("#GoodsConsumption").getValue().trim();
    let txt_First_Goods = $("#First_Goods").getText();
    let code1 = $("#CodeItem1").getValue();
  
    if (
      val_First_Goods == "" ||
      GoodsNumber_currency == "" ||
      GoodsUnit == "" ||
      GoodsDateRequired == "" ||
      GoodsCurrentBalance_currency == "" ||
      GoodsConsumption_currency == ""
    ) {
      alert("لطفاً تمامی آیتمها تکمیل گردد");
    } else if (val_First_Goods === txt_First_Goods) {
      alert("لطفاً نام کالا را بدرستی انتخاب نمایید");
  
      ///// پاک کردن گرید اول
      let assignedRoleId = new Array();
      $("#First_Goods_Property option").each(function () {
        assignedRoleId.push(this.text);
      });
  
      let len = assignedRoleId.length;
      for (let rm = 0; rm <= len; rm++) {
        $("#Tech_Specifications").deleteRow();
      }
    } else if (GoodsNumber == 0) {
      alert("تعداد درخواستی نمیتواند صفر باشد");
    } else if (
      val_First_Goods != txt_First_Goods &&
      GoodsNumber != 0
    ) {
      $("#84213256866f78906a5dfc2078252026").saveForm();
      $("#Req_Grid").setText(code1, 1, 1);
      $("#Req_Grid").setText(txt_First_Goods, 1, 2);
      $("#Req_Grid").setText(GoodsNumber_currency, 1, 4);
      $("#Req_Grid").setText(GoodsUnit, 1, 5);
      $("#Req_Grid").setText(GoodsDateRequired, 1, 6);
  
      let rowCount = $("#Tech_Specifications").getNumberRows();
      let my_arr = [];
      for (let m = 0; m <= rowCount; m++) {
        let property_id = $("#Tech_Specifications").getText(m, 2);
        let property_val = $("#Tech_Specifications").getText(m, 3);
  
        my_arr.push(property_id + ":" + property_val);
  
        //  my_arr.push(property_name + ': ' + property_val + ';');
        // my_arr.push(property_val);
        // $('#Req_Grid').setValue(property_name + ':' + property_val + ';' ,m,3);
      }
  
      delete my_arr[0];
  
      let txt = $("#Req_Grid").getValue(1, 3);
      let lst = my_arr.join("\n");
      $("#Req_Grid").setValue(txt + lst, 1, 3);
  
      $("#Req_Grid").addRow();
      $("#GoodsNumber_currency").setValue("");
      $("#GoodsUnit").setValue("");
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
  
      ////
    }
  });
  */
  //#endregion
  
  
  
  