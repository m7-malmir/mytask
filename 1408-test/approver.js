var rowCount25 = $("#Req_Grid").getNumberRows();
for (var i = 1; i <= rowCount25; i++) {  
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][suggest0000000001_label]").attr('type', 'button');
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][suggest0000000001_label]").attr('class', 'pmdynaform-control-button');
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][suggest0000000001_label]").attr('value', 'ویرایش');
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][suggest0000000001_label]").click(function (event) {
    var kala_id=  $(this).parent().parent().parent().parent().parent().find("div:nth-child(3) input").val();
    var kala_name=  $(this).parent().parent().parent().parent().parent().find("div:nth-child(4) input").val();
    var kala_final=kala_id+'_'+kala_name;
      $("#CodeItem1 input[id='form[CodeItem1]'").val(kala_id);
      $("#NameItem1 input[id='form[NameItem1]'").val(kala_name);
      // console.log(kala_final);
      $("#First_Goods select option:selected").remove();
     var selected= $("#First_Goods select option:contains("+kala_final+")").prop("selected");
  
      // delete row before add Items
      var rowCt = $("#Tech_Specifications").getNumberRows();
      for (var w = 0; w <= rowCt; w++) {
        $("#Tech_Specifications").deleteRow();
      }
  
      // add Item
      var assignedRoleId = new Array();
      $("#First_Goods_Property option").each(function () {
        assignedRoleId.push(this.text);
        console.log(assignedRoleId);
      });
    
      var texts = $("#First_Goods_Property option").map(function () {
          return $(this).val();
        }).get();
    

      
    
      var len = assignedRoleId.length;
    
      for (let z = 0; z < assignedRoleId.length + 1; z++) {
        $("#Tech_Specifications").addRow();
        $("#Tech_Specifications").setValue(texts[z - 1], z, 1);
        $("#Tech_Specifications").setText(assignedRoleId[z - 1], z, 2);
      }
        $("#Tech_Specifications").deleteRow();
  });
}

