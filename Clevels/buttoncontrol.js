$("#ButtonControl4").click(function(){	
	UserService.GetCurrentActor(true,
	function(data){
		hideLoading();
		var xmlActor = $.xmlDOM(data);
		currentActorId = xmlActor.find('actor').attr('pk');
		var params = {Where: "ActorId = " + currentActorId};
		
		BS_GetUserInfo.Read(params,
			function(data)
			{
				var dataXml = null;
				if($.trim(data) != "")
				{
					
					dataXml = $.xmlDOM(data);
					RoleId = dataXml.find("row:first").find(">col[name='RoleId']").text();
					
					var sp_params = {
				        'Role_ID': RoleId				        
				    };
					//alert(JSON.stringify(sp_params));
					SP_FindParentRole.Execute(
				        sp_params,
				        function(data){
				            var $data = $.xmlDOM(data);
				
				            // Extract total rows
				            var totalRows = $data.find("col[name='TotalRows']:first").text();
				
				            // Parse each row and extract values
				            var rows = [];
							
				            $data.find("datatable > row").each(function () {
				                var row = {
					
				                    Result: $(this).find("col[name='res']").text()
				                };
				                rows.push(row);
				            });
						 //alert(JSON.stringify(rows[0].Result));
				         // Stop execution if validation fails
							var CLevelFlag;
				            if (rows[0].Result=="26" || rows[0].Result=="27" || rows[0].Result=="29") {
				                 CLevelFlag=1;
				            }else{
								 CLevelFlag=2;
							}
				           alert(JSON.stringify(CLevels));
				        },
				        function(e){ 
				            alert(e);
				        }
				    );
					
				}
				if($.isFunction(onSuccess))
				{
					onSuccess(dataXml);
				}
			}
		);
	},
	function(err){
		hideLoading();
		$ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
	})

	WorkflowService.RunWorkflow("ZJM.FMS.FMP.FundManagmentProcess",
	    '<Content><Id>'+parent.process_pk+'</Id><CLevelFlag>'+CLevelFlag+'</CLevelFlag></Content>',
	    true,
	    function(data)
	    {
	        $.alert("درخواست شما با موفقیت ارسال شد.","","rtl",function(){
				hideLoading();
	        	parent.closeWindow({OK:true, Result:null});
			});				
	    }
	    ,function(err)
	    {
	        alert('مشکلی در شروع فرآیند به وجود آمده. '+err);
	        hideLoading();
	    }
	);	
});