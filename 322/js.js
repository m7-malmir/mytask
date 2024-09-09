$("#Result").hide();
$("#Sale_Org_Manager").hide();
$("#Sales_Line").hide();
$("#Branch_Name").hide();
$("#Branch_Manager").hide();
$("#Person_List").hide();


$("#Center").setOnchange(function (newVal, oldVal) {
    if (newVal == "1") {

        $("#Result").show();
        $("#Sale_Org_Manager").show();
        $("#Sales_Line").show();
        $("#Branch_Name").hide();
        $("#Branch_Manager").hide();
        $("#Person_List").hide();
    } else if (newVal == "2") {

        $("#Result").show();
        $("#Sale_Org_Manager").hide();
        $("#Sales_Line").hide();
        $("#Branch_Name").show();
        $("#Branch_Manager").show();
        $("#Person_List").show();
    }
});