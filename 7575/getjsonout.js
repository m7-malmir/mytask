/* key => value */

$("#Save_Record1").on("click",function(){

    var rowCount = $("#Tech_Specifications").getNumberRows();
    var arr = [];
   for (var i = 1; i <= rowCount; i++) {
    var id = $("#Tech_Specifications-body input[id='form[Tech_Specifications]["+i+"][property_id]']").val();
    var name =  $("#Tech_Specifications-body input[id='form[Tech_Specifications]["+i+"][property_value]']").val();

    	arr.push({
            title: id, 
            link:  name
        });
  
 	  }
var myJsonString = JSON.stringify(arr);

  alert(myJsonString);
  var rowCount = $("#Req_Grid").getNumberRows();

  for (var i = 1; i <= rowCount; i++) {
      if($("#Req_Grid-body textarea[id='form[Req_Grid]["+i+"][Technical_Specifications]']").val().length === 0 ){
      $("#Req_Grid-body textarea[id='form[Req_Grid]["+i+"][Technical_Specifications]']").val(myJsonString);
      $("#Req_Grid").addRow();
      $("#Tech_Specifications").setValue("");

      }  
    }
});
/** end key value */




