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
      $("#Tech_Specifications").enableValidation(3);
    } 
    else if (val_First_Goods === txt_First_Goods) {
      alert("لطفاً نام کالا را بدرستی انتخاب نمایید");
      $("#Tech_Specifications").enableValidation(3);
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
      $("#Tech_Specifications").enableValidation(3);
    } 
    else if ( val_First_Goods != txt_First_Goods && GoodsNumber != 0  ) {
      
        $("#Tech_Specifications").disableValidation(3);
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
         $("#Req_Grid").addRow();
      }
  
  
  
  
  
/*
    $("#Req_Grid").addRow();
*/
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
  
    }
  });
  
  //#endregion