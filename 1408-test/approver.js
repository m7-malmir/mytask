



var rowCount25 = $("#Req_Grid").getNumberRows();
for (var i = 1; i <= rowCount25; i++) {  
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][suggest0000000001_label]").attr('type', 'button');
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][suggest0000000001_label]").attr('class', 'pmdynaform-control-button');
     $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][suggest0000000001_label]").click(function (event) {
         //$(this).attr("id");
         var org_data=  $(this).parent().parent().parent().parent().parent().find("div:nth-child(5) textarea").val();
        // alert(org_data);
     });
}

console.log(org_data);




