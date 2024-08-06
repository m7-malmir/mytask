
  $("#Cost_Type select").change(function(){
    var status = this.value;
    if(status=="1")
        $("#person_cost_grid input").prop("disable",false);
        $("#person_cost_grid textarea").prop("disable",false);
        $("#person_cost_grid select").prop("disable",false);
        $("#group_cost_grid input").prop("disable",true);
        $("#group_cost_grid textarea").prop("disable",true);
        $("#group_cost_grid select").prop("disable",true);
        if(status=="2") 
        $("#group_cost_grid input").prop("disable",false);
        $("#group_cost_grid textarea").prop("disable",false);
        $("#group_cost_grid select").prop("disable",false);
        $("#person_cost_grid input").prop("disable",true);
        $("#person_cost_grid textarea").prop("disable",true);
        $("#person_cost_grid select").prop("disable",true);    
  });


  //ط#Cost_Type select id='form[Cost_Type]' 
  
  //select val1->fardi select val2->grohi

  //bakhshname ---->>> #group_cost_grid

  //fardi ------>>>> #person_cost_grid


