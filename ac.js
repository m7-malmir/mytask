
//#region sum col

var form = "36355590866a8882d660216007070261";
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
