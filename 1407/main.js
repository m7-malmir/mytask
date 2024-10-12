$("#submit0000000001").click(function (event) {
    var rowCount3 = $("#Req_Grid").getNumberRows(); 
    if(rowCount3 >= 1 ){
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
    //#region set attr select2a
    
    $("#CompanyId").getControl().select2({
      placeholder: '----'
    });
    
    
    $("#GoodsUnit").getControl().select2({
      placeholder: '----'
    });
    
    
    $('#Req_Grid').hideColumn(9);
    $('#Req_Grid').hideColumn(10);
    $('#Req_Grid').hideColumn(11);
    //$('#Req_Grid').hideColumn(12);
    //$('#Req_Grid').hideColumn(14);
    //$('#Req_Grid').hideColumn(15);
    $('#NameItem1').hide();
    $('#CodeItem1').hide();
    $('#First_Goods_Property').hide();
    //$('#Technical_Specs_Json').show();
    //#endregion
    
    //#region setting for req_grid
    var oNewButton = $("#Req_Grid").find("button.pmdynaform-grid-newitem");
    $("#Req_Grid").append(oNewButton);
    $("#Req_Grid .pmdynaform-grid-thead").css("display", "flex");
    $("#Req_Grid .pmdynaform-grid-thead").css("margin-right", "0px");
    
    var formId = $("form").prop("id");
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
    
    //#endregion
    
    //#region setOnchange for GoodsDateRequired
    
    $("#66339111366fa7d57c59153033755964").click(function () {
      $("#GoodsDateRequired").setValue($("#GoodsDateRequired").find("input").val());
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
    
      if ( val_First_Goods == "" || GoodsNumber_currency == "" || GoodsUnit == "" || GoodsDateRequired == ""
         || GoodsCurrentBalance_currency == "" || GoodsConsumption_currency == "" || Goods_Description == ""  ) {
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
        
        $("#66339111366fa7d57c59153033755964").saveForm();
        
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
            $("#Req_Grid").setText(myJsonString, i, 15);
            $("#Req_Grid").setText(code1, i, 1);
            $("#Req_Grid").setText(txt_First_Goods, i, 2);
            $("#Req_Grid").setText(Goods_Description, i, 13);
            $("#Req_Grid").setText(GoodsNumber_currency, i, 4);
            $("#Req_Grid").setText(GoodsUnit, i, 5);
            $("#Req_Grid").setText(GoodsUnit_Id, i, 14);
            $("#Req_Grid").setText(GoodsDateRequired, i, 6);
            $("#Req_Grid").setText(GoodsCurrentBalance_currency, i, 7);
            $("#Req_Grid").setText(GoodsConsumption_currency, i, 8); 
        }
    
        };
    
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
    
    //#region check person/post
    
    ////////////////////بررسی شخص پست//////////////////////////
    $("#submit0000000001").click(function () {
    
      var x = 1;
      var y = 1;
      var z = 1;
      var a = 1;
      var b = 1;
      var c = 1;
    
      //////////////////////////////////////
      if ($("#Fin_Res").getValue() == $("#Fin_Res").getText() && $("#Activity_Type").getValue() == 1) {
    
        $("#Fin_Res").css("color", "red");
        x = 0;
    
      } else {
    
        $("#Fin_Res").css("color", " #555151");
        x = 1;
    
      }
      //////////////////////////////////////
      if ($("#Stock_Res_Per").getValue() == $("#Stock_Res_Per").getText()) {
    
        $("#Stock_Res_Per").css("color", "red");
        y = 0;
    
      } else {
    
        $("#Stock_Res_Per").css("color", " #555151");
        y = 1;
    
      }
      //////////////////////////////////////
      if ($("#Unit_Manager_Per").getValue() == $("#Unit_Manager_Per").getText()) {
    
        $("#Unit_Manager_Per").css("color", "red");
        z = 0;
    
      } else {
    
        $("#Unit_Manager_Per").css("color", " #555151");
        z = 1;
    
      }
      //////////////////////////////////////
      if ($("#Seconder_Per").getValue() == $("#Seconder_Per").getText()) {
    
        $("#Seconder_Per").css("color", "red");
        a = 0;
    
      } else {
    
        $("#Seconder_Per").css("color", " #555151");
        a = 1;
    
      }
      //////////////////////////////////////
      if ($("#Branch_Manager_Per").getValue() == $("#Branch_Manager_Per").getText()) {
    
        $("#Branch_Manager_Per").css("color", "red");
        b = 0;
    
      } else {
    
        $("#Branch_Manager_Per").css("color", " #555151");
        b = 1;
    
      }
      //////////////////////////////////////
      if ($("#Branch_Stock_Res_Per").getValue() == $("#Branch_Stock_Res_Per").getText() && $("#Activity_Type").getValue() == 1) {
    
        $("#Branch_Stock_Res_Per").css("color", "red");
        c = 0;
    
      } else {
    
        $("#Branch_Stock_Res_Per").css("color", " #555151");
        c = 1;
    
      }
      /////////////////////////////////////
      if (x == 0 || y == 0 || z == 0 || a == 0 || b == 0 || c == 0) {
        alert('لطفا نام شخص پست را به درستی انتخاب کنید ');
        return false;
      }
    });
    //#endregion
    
    //#region choose a Activity_Type
    
    $("#Expert_Per").hide();
    $("#Expert_Per").disableValidation();
    
    $("#Activity_Type").setOnchange(function (newVal) {
      if (newVal == "2") {
        $("#Expert_Per").show();
        $("#Expert_Per").enableValidation();
      }
      else if (newVal == "1") {
        $("#Expert_Per").hide();
        $("#Expert_Per").disableValidation();
      }
    });
    
    if ($("#Activity_Type").getValue() == 2) {
    
      $("#Expert_Per").show();
      $("#Expert_Per").enableValidation();
    
    } else {
    
      $("#Expert_Per").hide();
      $("#Expert_Per").disableValidation();
    
    }
    
    
    //#endregion
    
    //#region setting for grid
    
    var oNewButton = $("#Req_Grid").find("button.pmdynaform-grid-newitem");
    $("#Req_Grid").append(oNewButton);
    $('#Req_Grid').css('direction', 'rtl')
    $('.pmdynaform-grid-thead').css('display', 'flex');
    $('.row.pmdynaform-grid-thead').css('margin-right', '0px');
    
    //#endregion
    
    //#region click form
    
    $("#" + formId).click(function () {
    
      var rows = $("#Req_Grid").getNumberRows();
    
      if (rows > 10) {
        $("#Req_Grid").deleteRow(11);
        alert("تعداد 10 سطر مجاز می باشد");
      }
    
      for (let i = 1; i <= rows; i++) {
        let requestCount = Number($("#Req_Grid").getValue(i,9));
        let deliverCount = Number($("#Req_Grid").getValue(i,10));
        let purchaseCount = requestCount - deliverCount;
    
        if (purchaseCount < 0) {
          alert("تحویلی بیشتر از درخواست تایید شده میباشد");
          purchaseCount = 0;
          return false;
        }
        else if (purchaseCount > 0) {
        }
    
        $("#Req_Grid").setValue(purchaseCount, i, 11);
    
        var status = 1;
    
        if (deliverCount > 0 && purchaseCount > 0) {
          status = 4;
        } else if (deliverCount > 0 && purchaseCount == 0) {
          status = 1;
        } else if (deliverCount == 0 && purchaseCount > 0) {
          status = 2;
        }
    
        $("#Req_Grid").setValue(status, i, 12);
      }
    
      for (var i = 1; i <= rows; i++) {
        var a = $("#Req_Grid").getValue(i, 12);
    
        if (a == "1") {
          $("#Req_Grid").getControl(i, 12).css("background-color", "#BEF0CB");
        } else if (a == "2") {
          $("#Req_Grid").getControl(i, 12).css("background-color", "#CAEDFF");
        } else if (a == "3") {
          $("#Req_Grid").getControl(i, 12).css("background-color", "#FF4C29");
        } else if (a == "4") {
          $("#Req_Grid").getControl(i, 12).css("background-color", "#FEFFAC");
        }
      }
    });
    
    //#endregion
    
    
    
    
    