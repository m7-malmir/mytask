/* key => value */

$("#Save_Record1").on("click",function(){

    var rowCount = $("#Tech_Specifications").getNumberRows();
    var arr = [];
   for (var i = 1; i <= rowCount; i++) {
    var id = $("#Tech_Specifications-body input[id='form[Tech_Specifications]["+i+"][property_id]']").val();
    var name =  $("#Tech_Specifications-body input[id='form[Tech_Specifications]["+i+"][property_name]']").val();

    	arr.push({
            title: id, 
            link:  name
        });
  
 	  }
var myJsonString = JSON.stringify(arr);

  alert(myJsonString);

});
/** end key value */




