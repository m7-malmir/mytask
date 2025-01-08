$("#ButtonControl2").click(function(){
	$.showModalForm({registerKey:"FrmGScarManagementPopup", params:{}} 
	    , function(retVal)
	    {
	        if (retVal.Result) {
	            //loadCombo($("#ComboBoxControl4").val());
				//refreshtable	
	        }
	    }
	);
});