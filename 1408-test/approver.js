var rowCount25 = $("#Req_Grid").getNumberRows();
for (var i = 1; i <= rowCount25; i++) {  
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][suggest0000000001_label]").attr('type', 'button');
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][suggest0000000001_label]").attr('class', 'pmdynaform-control-button');
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][suggest0000000001_label]").attr('value', 'ویرایش');
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][suggest0000000001_label]").click(function (event) {
    var org_data=  $(this).parent().parent().parent().parent().parent().find("div:nth-child(5) textarea").val();
    var rowCt = $("#Tech_Specifications").getNumberRows();

    var numbersArray = org_data.split(',');
    numbersArray = numbersArray.filter(function(item) {
        return item !== "\n";
      }).map(function(item) {
        return item.replace(/\n/g,'');
      });
      
      console.log(numbersArray);

    //var JsonObject = JSON.parse(JSON.stringify(org_data));
    //console.log(JsonObject);
    // $.each( JsonObject, function( key, value ) {
    //     console.log( key + ": " + value );
    //     for (let z = 0; z < JsonObject.length + 1; z++) {
    //           $("#Tech_Specifications").addRow();
    // $("#Tech_Specifications").setValue(texts[z - 1], z, 1);
    //           $("#Tech_Specifications").setText(value[z - 1], z, 2);
    //     }
    //         $("#Tech_Specifications").deleteRow();
    // }); 
    });
}

03129962/D-MI
982889


