//#region conrtol Shaba_Number
const Shaba_Number = document.getElementById("Shaba_Number");



 $('#Shaba_Number').on('paste', function(eve) { 
  setTimeout(function() {
    const that = validateIranianSheba(eve.target.value);

    if (that) {
      $("#Shaba_Number").getControl().css("background-color", "#BEF0CB");
    } else {
      $("#Shaba_Number").getControl().css("background-color", "#FFF");
      alert('شماره شبا معتبر نمی باشد');
    }
  }, 2);
  
 });

$("#Shaba_Number").on({
  keypress:function (event) {
    var x = event.target.value;
    var key = event.which || event.keyCode;
      if (!(key >= 48 && key <= 57)) {
        event.preventDefault();
      }
      if (x.length >= 26) {
        event.preventDefault();
      }
  }

});

Shaba_Number.addEventListener("keydown", function (event) {
  var x = event.target.value;

  if (event.key === "Backspace" || event.key === "Delete") {
    if (x.length <= 2) {
      event.preventDefault();
    }
  }
});

//#endregion

//#region sum col

var form = "697998046665b06ce80a0a3038164392";
var person_cost_grid = "person_cost_grid";
var group_cost_grid = "group_cost_grid";

///grid1:
var g1_requested_total = "g1_requested_total";
var g1_confirmed_total = "g1_confirmed_total";
///grid2:
var g2_food_cost_total = "g2_food_cost_total";
var g2_travel_cost_total = "g2_travel_cost_total";
var g2_call_cost_total = "g2_call_cost_total";
var g2_cost_total = "g2_cost_total";

function TotalColumn(myGrid, myCol, ex) {
  var num = 0;
  var mySum = 0;
  var rowCount = $("#" + myGrid).getNumberRows();

  for (var i = 1; i <= rowCount; i++) {
    num = $("#" + myGrid).getValue(i, myCol);
    num = Number(num.replace(/[\,]+/g, ""));
    mySum += num;

    $("#" + ex).setValue(sepratorNumber(mySum));
  }
}

$("#" + form).click(function () {
  //TotalRow Grid2:

  var rowCount = $("#group_cost_grid").getNumberRows();

  var Col7 = 0;
  var number7 = 0;

  var Col8 = 0;
  var number8 = 0;

  var Col9 = 0;
  var number9 = 0;

  var Col10 = 0;
  var number10 = 0;

  for (let j = 1; j <= rowCount; j++) {
    Col7 = $("#group_cost_grid").getValue(j, "7");
    Col8 = $("#group_cost_grid").getValue(j, "8");
    Col9 = $("#group_cost_grid").getValue(j, "9");
    Col10 = $("#group_cost_grid").getValue(j, "10");

    // convert currency to number
    number7 = Number(Col7.replace(/[\,]+/g, ""));
    number8 = Number(Col8.replace(/[\,]+/g, ""));
    number9 = Number(Col9.replace(/[\,]+/g, ""));
    number10 = Number(Col10.replace(/[\,]+/g, ""));

    var G2_sum = number7 + number8 + number9;
    G2_sum = G2_sum.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    $("#group_cost_grid").setValue(G2_sum, j, "10");

    //Sum grid1

    TotalColumn(person_cost_grid, 5, g1_requested_total);
    TotalColumn(person_cost_grid, 6, g1_confirmed_total);

    //Sum grid2

    TotalColumn(group_cost_grid, 7, g2_food_cost_total);
    TotalColumn(group_cost_grid, 8, g2_travel_cost_total);
    TotalColumn(group_cost_grid, 9, g2_call_cost_total);
    TotalColumn(group_cost_grid, 10, g2_cost_total);
  }
});

//#endregion

//#region scroll grid

var oNewButton1 = $("#person_cost_grid").find("button.pmdynaform-grid-newitem");
$("#person_cost_grid").append(oNewButton1);

var oNewButton2 = $("#group_cost_grid").find("button.pmdynaform-grid-newitem");
$("#group_cost_grid").append(oNewButton2);

$(".pmdynaform-grid-thead").css("display", "flex");
$(".row.pmdynaform-grid-thead").css("margin-right", "0px");

//#endregion

//#region select to - from date in grid

$("#person_cost_grid").click(function() {

  var p = new persianDate();
  var p_row=$('#person_cost_grid').getNumberRows();
  
  for(var h=1; h<=p_row;h++){
  $("#person_cost_grid").getControl(h,1).persianDatepicker({formatDate: "YYYY/0M/0D"});
  $("#person_cost_grid").getControl(h,2).persianDatepicker({formatDate: "YYYY/0M/0D"});

  }});
    
$("#group_cost_grid").click(function() {

    var p = new persianDate();
    var g_row=$('#group_cost_grid').getNumberRows();
    
    for(var k=1; k<=g_row;k++){
    $("#group_cost_grid").getControl(k,1).persianDatepicker({formatDate: "YYYY/0M/0D"});
    $("#group_cost_grid").getControl(k,2).persianDatepicker({formatDate: "YYYY/0M/0D"});

  }}); 

  var colIndex = 0;
  var colIndex2 = 0;
  $("#submit0000000001").on('click',function(){
    var gridId = 'person_cost_grid';
    var gridId2 = 'group_cost_grid';
    colIndex = 0;
    colIndex2 = 0;
    setPersianDate(gridId);
    setPersianDate2(gridId2);
    $("#697998046665b06ce80a0a3038164392").saveForm();
    $("#446075439665c5bd51c88b8071255988").saveForm();
      
      
  });
  
  function setPersianDate(gridId){
    debugger;
  var gridValue = $('#'+gridId).getValue();
  var cols = $("#"+gridId).getInfo().columns;
    
    for(nField in cols){
        colIndex+=1;
      var columnId = cols[nField].id; 
      
        for(j=1;j<=gridValue.length;j++){
      
    
      var dateVal = $("#form\\["+gridId+"\\]\\["+j+"\\]\\["+columnId+"\\]").val();
      
    $('#' + gridId).setValue(dateVal,j,colIndex);
    
    }}}
  
  function setPersianDate2(gridId2){
      debugger;
    var gridValue = $('#'+gridId2).getValue();
    var cols = $("#"+gridId2).getInfo().columns;
      
      for(nField in cols){
          colIndex2+=1;
        var columnId = cols[nField].id; 
        
          for(j=1;j<=gridValue.length;j++){
        
      
        var dateVal = $("#form\\["+gridId2+"\\]\\["+j+"\\]\\["+columnId+"\\]").val();
        
      $('#' + gridId2).setValue(dateVal,j,colIndex2);
      
    }}}  
//#endregion

//#region iso7064Mod97_10

function iso7064Mod97_10(iban) {
  var remainder = iban,
    block;

  while (remainder.length > 2) {
    block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97) + remainder.slice(block.length);
  }

  return parseInt(remainder, 10) % 97;
}

function validateIranianSheba(str) {
  var pattern = /IR[0-9]{24}/;

  if (str.length !== 26) {
    return false;
  }

  if (!pattern.test(str)) {
    return false;
  }

  var newStr = str.substr(4);
  var d1 = str.charCodeAt(0) - 65 + 10;
  var d2 = str.charCodeAt(1) - 65 + 10;
  newStr += d1.toString() + d2.toString() + str.substr(2, 2);

  var remainder = iso7064Mod97_10(newStr);
  if (remainder !== 1) {
    return false;
  }

  return true;
}

$("#button0000000001").click(function () {
  var text1 = "لطفا شماره شبا را بدون فاصله مطابق الگو وارد نمایید\n";
  var text2 = "تعداد کاراکتر مجاز : 24\n";
  var text3 = "الگو: IR9999999999999999999999";

  var rse = validateIranianSheba($("#Shaba_Number").getValue());

  if (rse == true) {
    alert("شماره شبا بدرستی وارد شده است");
  } else {
    alert(text1 + text2 + text3);
  }
});

/////////////////////////////////////

//#endregion

//#region function getNumber,sepratorNumber,removePoint

function getNumber(_val) {
  return Number(_val.replace(/[\,]+/g, ""));
}

function sepratorNumber(_val) {
  return _val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function removePoint(_val) {
  return _val.toString().replace(/\./g, "");
}

//#endregion

//#region items show/hide

$("#Send_File button").text("انتخاب فایل پیوست");
$("#446075439665c5bd51c88b8071255988 #submit0000000001").find("button").prop("disabled", true);

//setOnChange Unit_Name
$("#Sales_Organization").hide();
$("#Sales_Organization").disableValidation();
$("#Cost_Type").hide();
$("#Cost_Type").disableValidation();
$("#phone_cost_pnl").hide();
$("#phone_cost_pnl").disableValidation();

//// group_cost_grid:
$("#group_cost_grid").hide();
$("#group_cost_grid").disableValidation();
$("#g2_food_cost_total").hide();
$("#g2_food_cost_total").disableValidation();
$("#g2_travel_cost_total").hide();
$("#g2_travel_cost_total").disableValidation();
$("#g2_call_cost_total").hide();
$("#g2_call_cost_total").disableValidation();
$("#g2_cost_total").hide();
$("#g2_cost_total").disableValidation();

//// person_cost_grid :
$("#person_cost_grid").hide();
$("#person_cost_grid").disableValidation();
$("#sum_amount_fee_g1").hide();
$("#sum_amount_fee_g1").disableValidation();
$("#sum_confirmed_amount_g1").hide();
$("#sum_confirmed_amount_g1").disableValidation();
$("#Personnel_Code").hide();
$("#Personnel_Code").disableValidation();
$("#Applicant").hide();
$("#Applicant").disableValidation();
$("#Phone").hide();
$("#Phone").disableValidation();
$("#Shaba_Number").hide();
$("#Shaba_Number").disableValidation();
$("#Banks_List").hide();
$("#Banks_List").disableValidation();
$("#button0000000001").hide();
$("#button0000000001").disableValidation();

$("#g1_requested_total").hide();
$("#g1_confirmed_total").hide();

//$("#person_cost_grid option[value='15']").remove();

/////// show /hide person cost :

function ShowPersonCost() {
  $("#person_cost_grid").show();
  $("#g1_requested_total").show();
  $("#g1_confirmed_total").show();
  $("#Personnel_Code").show();
  $("#Personnel_Code").enableValidation();
  $("#Applicant").show();
  $("#Applicant").enableValidation();
  $("#Phone").show();
  $("#Phone").enableValidation();
  $("#Shaba_Number").show();
  $("#Shaba_Number").enableValidation();
  $("#Banks_List").show();
  $("#Banks_List").enableValidation();
  $("#button0000000001").show();
  $("#button0000000001").enableValidation();
  $("#phone_cost_pnl").show();
}

function HidePersonCost() {
  $("#person_cost_grid").hide();
  $("#person_cost_grid").disableValidation();
  $("#g1_requested_total").hide();
  $("#g1_confirmed_total").hide();
  $("#Personnel_Code").hide();
  $("#Personnel_Code").disableValidation();
  $("#Applicant").hide();
  $("#Applicant").disableValidation();
  $("#Phone").hide();
  $("#Phone").disableValidation();
  $("#Shaba_Number").hide();
  $("#Shaba_Number").disableValidation();
  $("#Banks_List").hide();
  $("#Banks_List").disableValidation();
  $("#button0000000001").hide();
  $("#button0000000001").disableValidation();
  $("#phone_cost_pnl").hide();
  $("#phone_cost_pnl").disableValidation();
}

/////// show /hide group cost :

function ShowGroupCost() {
  $("#group_cost_grid").show();
  $("#g2_food_cost_total").show();
  $("#g2_travel_cost_total").show();
  $("#g2_call_cost_total").show();
  $("#g2_cost_total").show();
}

function HideGroupCost() {
  $("#group_cost_grid").hide();
  $("#group_cost_grid").disableValidation();
  $("#g2_food_cost_total").hide();
  $("#g2_travel_cost_total").hide();
  $("#g2_call_cost_total").hide();
  $("#g2_cost_total").hide();
}

$("#Unit_Name").setOnchange(function (newVal, oldVal) {
  if (newVal == "1") {
    $("#Sales_Organization").show();
    $("#Sales_Organization").enableValidation();
    $("#Cost_Type").show();
    $("#Cost_Type").enableValidation();
  } else if (newVal == "8" || newVal == "36") {
    $("#Sales_Organization").hide();
    $("#Sales_Organization").disableValidation();
    $("#Cost_Type").show();
    $("#Cost_Type").enableValidation();
  } else {
    $("#Sales_Organization").hide();
    $("#Sales_Organization").disableValidation();
    $("#Cost_Type").hide();
    $("#Cost_Type").disableValidation();
    $("#Cost_Type").setValue(1);
    HideGroupCost();
    ShowPersonCost();
  }
});

if ($("#Unit_Name").getValue() == 1) {
  $("#Sales_Organization").show();
  $("#Sales_Organization").enableValidation();
  $("#Cost_Type").show();
  $("#Cost_Type").enableValidation();
} else if (
  $("#Unit_Name").getValue() == 8 ||
  $("#Unit_Name").getValue() == 36
) {
  $("#Sales_Organization").hide();
  $("#Sales_Organization").disableValidation();
  $("#Cost_Type").show();
  $("#Cost_Type").enableValidation();
} else {
  $("#Sales_Organization").hide();
  $("#Sales_Organization").disableValidation();
  $("#Cost_Type").hide();
  $("#Cost_Type").disableValidation();
  $("#Cost_Type").setValue(1);
  HideGroupCost();
  ShowPersonCost();
}

$("#Cost_Type").setOnchange(function (newVal, oldVal) {
  if (newVal == "1") {
    ShowPersonCost();
    HideGroupCost();

    for (let i = 1; i <= 5; i++) {
      $("#person_cost_grid").enableValidation(i);
    }

    for (let j = 1; j <= 9; j++) {
      $("#group_cost_grid").disableValidation(j);
    }


  } else if (newVal == "2") {
    HidePersonCost();
    ShowGroupCost();

    for (let a = 1; a <= 5; a++) {
      $("#person_cost_grid").disableValidation(a);
    }

    for (let b = 1; b <= 9; b++) {
      $("#group_cost_grid").enableValidation(b);
    }

  }
});
if ($("#Cost_Type").getValue() == 1) {
    ShowPersonCost();
    HideGroupCost();

    for (let i = 1; i <= 5; i++) {
      $("#person_cost_grid").enableValidation(i);
    }

    for (let j = 1; j <= 9; j++) {
      $("#group_cost_grid").disableValidation(j);
    }
} else {
  HidePersonCost();
  ShowGroupCost();

  for (let a = 1; a <= 5; a++) {
    $("#person_cost_grid").disableValidation(a);
  }

  for (let b = 1; b <= 9; b++) {
    $("#group_cost_grid").enableValidation(b);
  }
}

/////////

//#endregion

//#region phone_cost_pnl: checked
$("#phone_cost_pnl")
  .find(".form-check [type=checkbox]")
  .click(function () {
    if ($(this).is(":checked")) {
      $("#textVar008").setValue(1);
      // var x = $(this).parent().parent().parent().parent().parent().parent().find('#Cost_Grid [type=button]').addClass('hide');
      var x = $("#697998046665b06ce80a0a3038164392")
        .find("#person_cost_grid [type=button]")
        .addClass("hide");
      var y = $("#697998046665b06ce80a0a3038164392")
        .find("#person_cost_grid .remove-row")
        .addClass("hide");
    } else {
      var x = $("#697998046665b06ce80a0a3038164392")
        .find("#person_cost_grid [type=button]")
        .removeClass("hide");
      var y = $("#697998046665b06ce80a0a3038164392")
        .find("#person_cost_grid  .remove-row")
        .removeClass("hide");
      $("#textVar008").setValue(0);
      $("#person_cost_grid").showColumn(4);
    }
  });

//#endregion

//#region new group
var io = "";
var is_val_group = "";

$("#group_cost_grid-body").on("input", function (eve) {
  var x = eve.target.value;
  var rse = validateIranianSheba(x);
  var rowCount = $("#group_cost_grid").getNumberRows();

  for (var i = 1; i <= rowCount; i++) {
    var myarray = $(
      "#group_cost_grid-body input[id='form[group_cost_grid][" +
        i +
        "][g2_shaba_number]']"
    ).val();
    if (myarray.length == 27) {
      $("#446075439665c5bd51c88b8071255988 #submit0000000001")
        .find("button")
        .prop("disabled", true);
    }
    if (myarray.length >= 7) {
      myarray = myarray.slice(5, 7);
      if (myarray == "12") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(29);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "17") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(30);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "19") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(20);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "15") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(16);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "18") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(18);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "16") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(26);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "14") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(28);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "21") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(32);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "20") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(10);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "57") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(7);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "54") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(6);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "55") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(1);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "13") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(14);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "61") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(19);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "51") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(9);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "62") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(5);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "58") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(17);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "56") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(15);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "59") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(18);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "11") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(21);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "53") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(25);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "78") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(12);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else if (myarray == "70") {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val(22);
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#BEF0CB");
      } else {
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).val("");
        $(
          "#group_cost_grid-body select[id='form[group_cost_grid][" +
            i +
            "][g2_banks_list]']"
        ).css("background-color", "#fff");
      }
    } else {
      $(
        "#group_cost_grid-body select[id='form[group_cost_grid][" +
          i +
          "][g2_banks_list]']"
      ).val("");
      $(
        "#group_cost_grid-body select[id='form[group_cost_grid][" +
          i +
          "][g2_banks_list]']"
      ).css("background-color", "#fff");
    }
  }
});

$("#group_cost_grid-body").on("input", function (eve) {
  // var x =  eve.target.value;
  var rowCount = $("#group_cost_grid").getNumberRows();

  for (var i = 1; i <= rowCount; i++) {
    var myarray = $(
      "#group_cost_grid-body input[id='form[group_cost_grid][" +
        i +
        "][g2_shaba_number]']"
    ).val();
    var rse = validateIranianSheba(myarray);

    if (rse) {
      $(
        "#group_cost_grid-body input[id='form[group_cost_grid][" +
          i +
          "][g2_shaba_number]']"
      ).css("background-color", "#BEF0CB");
      $("#446075439665c5bd51c88b8071255988 #submit0000000001")
        .find("button")
        .prop("disabled", false);
      is_val_group = true;
    } else {
      $(
        "#group_cost_grid-body input[id='form[group_cost_grid][" +
          i +
          "][g2_shaba_number]']"
      ).css("background-color", "#fff");
      $("#446075439665c5bd51c88b8071255988 #submit0000000001")
        .find("button")
        .prop("disabled", true);

      is_val_group = false;
    }
  }
});

//#endregion

//#region check person shaba number

//Enter
var io = "";
var is_val_person = "";

var num = document.getElementById("Shaba_Number");
num.addEventListener("input", function (eve) {
  var y = eve.target.value;

  if (y.length >= 7) {
    var x = y.slice(5, 7);

    if (x == "12") {
      $("#Banks_List").setValue(29); /// ملت
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "17") {
      $("#Banks_List").setValue(30); /// ملی
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "60") {
      $("#Banks_List").setValue(23); /// مهر ایران
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "19") {
      $("#Banks_List").setValue(20); /// صادرات
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "15") {
      $("#Banks_List").setValue(16); /// سپه
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "18") {
      $("#Banks_List").setValue(8); /// تجارت
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "16") {
      $("#Banks_List").setValue(26); /// کشاورزی
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "14") {
      $("#Banks_List").setValue(28); /// مسکن
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "21") {
      $("#Banks_List").setValue(32); /// پست بانک
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "20") {
      $("#Banks_List").setValue(10); /// توسعه صادرات
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "57") {
      $("#Banks_List").setValue(7); /// پاسارگاد
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "54") {
      $("#Banks_List").setValue(6); /// پارسیان
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "55") {
      $("#Banks_List").setValue(1); /// اقتصاد نوین
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "13") {
      $("#Banks_List").setValue(14); /// رفاه
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "61") {
      $("#Banks_List").setValue(19); /// شهر
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "51") {
      $("#Banks_List").setValue(9); /// توسعه تعاون
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "62") {
      $("#Banks_List").setValue(5); /// آینده
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "58") {
      $("#Banks_List").setValue(17); /// سرمایه
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "56") {
      $("#Banks_List").setValue(15); /// سامان
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "59") {
      $("#Banks_List").setValue(18); /// سینا
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "11") {
      $("#Banks_List").setValue(21); /// صنعت و معدن
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "53") {
      $("#Banks_List").setValue(25); /// کارآفرین
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "78") {
      $("#Banks_List").setValue(12); /// خاورمیانه
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "70") {
      $("#Banks_List").setValue(22); /// رسالت
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else {
      $("#Banks_List").setValue("");
      $("#Banks_List").getControl().css("background-color", "#FFF");
      $("#Shaba_Number").getControl().css("background-color", "#FFF");
    }
  } else {
    $("#Banks_List").setValue("");
    $("#Banks_List").getControl().css("background-color", "#FFF");
    $("#Shaba_Number").getControl().css("background-color", "#FFF");
  }

  const inputField = document.getElementById("Shaba_Number");
  inputField.addEventListener("input", function (event) {
    var x = event.target.value;
    var rse = validateIranianSheba(x);
    if (rse) {
      $("#Shaba_Number").getControl().css("background-color", "#BEF0CB");
      is_val_person = true;
      $("#446075439665c5bd51c88b8071255988 #submit0000000001")
        .find("button")
        .prop("disabled", false);
    } else {
      $("#Shaba_Number").getControl().css("background-color", "#FFF");
      is_val_person = false;
      $("#446075439665c5bd51c88b8071255988 #submit0000000001")
        .find("button")
        .prop("disabled", true);
    }
    //  console.log(is_val_person);
  });
});

//#endregion

// //#region Code2 Paste

// $("#Shaba_Number").bind("paste", function (e) {
//   var pastedData = e.originalEvent.clipboardData.getData("text");
//   var rse = validateIranianSheba(pastedData);

//   if (rse == true) {
//     $("#Banks_List").getControl().css("background-color", "#40A2E3");
//     $("#Shaba_Number").getControl().css("background-color", "#40A2E3");
//     //  return true;
//   } else {
//     alert(text1 + text2 + text3);
//     //   return false;
//   }
// });

// //#endregion

//#region checbox with hazine tell
$(function () {
  $("#flexCheckDefault").change(function () {
    var setval = this.checked ? "15" : "";
    // $("#person_cost_grid-body select").val(setval);
    $("#person_cost_grid").setValue(setval,1,4);

    if (this.checked) {

      $("#person_cost_grid").disableValidation(4);

      // $("#person_cost_grid-body select").attr("disabled", true);
       // $("#person_cost_grid-body select option:contains('15 - هزینه مکالمه (تلفن همراه)')").attr("selected", true);
      
    } else {
      $("#person_cost_grid").enableValidation(4);

      // $("#person_cost_grid-body select").attr("disabled", false);
       //$("#person_cost_grid-body select option:contains('15 - هزینه مکالمه (تلفن همراه)')").attr("selected", false);
    }



  });
});

//#endregion

//#region set status checkbox
$("#submit0000000001").click(function () {
  var Dial_Cost = $("#person_cost_grid").getValue(1, 4);
  if (Dial_Cost == 15) {
    $("#Dial_Cost").setValue(1);
  } else if (Dial_Cost != 15) {
    $("#Dial_Cost").setValue(0);
  }
});

//#endregion



//#region checbox with hazine tell

$(function () {
  $("#flexCheckDefault").change(function () {
    var setval = this.checked ? "15" : "";
  $("#person_cost_grid-body select").val(setval);
  

    if (this.checked) {
      $("#person_cost_grid-body select").attr("disabled", true);
       // $("#person_cost_grid-body select option:contains('15 - هزینه مکالمه (تلفن همراه)')").attr("selected", true);
      
    } else {
      $("#person_cost_grid-body select").attr("disabled", false);
       //$("#person_cost_grid-body select option:contains('15 - هزینه مکالمه (تلفن همراه)')").attr("selected", false);
    }
    //$("#person_cost_grid-body div:nth-child:not(':first')").remove();
  });
});

$("#person_cost_grid-body select option:contains('15 - هزینه مکالمه (تلفن همراه)')").attr("disabled", "disabled");

//#endregion




