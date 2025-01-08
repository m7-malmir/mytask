function refreshTable(){
	var params = {}; // change the params sent to FormManager with needed info
	FormManager.readEntity(params,
              function(data)
              {
			var list = [];
			data.find("row").each(
				function()
				{
					list.push
					({
						Id: $(this).find("col[name='Id']").text(),
						CarName: $(this).find("col[name='CarName']").text(),
						ModelYear: $(this).find("col[name='ModelYear']").text(),
						OwnerPersonnelName: $(this).find("col[name='OwnerPersonnelName']").text(),
						Color: $(this).find("col[name='Color']").text(),
						SS: $(this).find("col[name='SS']").text(),
						CarNO: $(this).find("col[name='CarNO']").text(),
						StatusTitle: $(this).find("col[name='StatusTitle']").text()
					});
				}
			);
			tblContainerId.refresh(list);
			//setTimeout(function () {alert(JSON.stringify(list))}, 2000);
              },
              function(error)
              {
			hideLoading();
                  alert(error);
              }
          );	
}