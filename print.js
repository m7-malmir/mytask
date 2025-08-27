//******************************************************************************************************
$("#btnViewed").click(function(){
			
	// اگه توضیحات خالی باشه یا هیچ کدوم از چک باکس ها تیک نخورده باشه
	if (
	    $("#txtCommitteeDescription").val().trim() === '' ||
	    (
	        !$("input[type=checkbox][id*='chbIsRaisedInCommitteeYes']").is(":checked") &&
	        !$("input[type=checkbox][id*='chbIsRaisedInCommitteeNo']").is(":checked")
	    )
	) {
	    $.alert("لطفا بخش توضیحات تکمیلی را کامل کنید", "", "rtl");
	    return;
	}
	
	// تعیین مقدار بر اساس تیک چک باکس ها
	var isRaisedValue = $("input[type=checkbox][id*='chbIsRaisedInCommitteeYes']").is(":checked") ? 1 : 0;
	
	// حالا ساختن آبجکت list
	var list = {
	    CommitteeDescription: $("#txtCommitteeDescription").val().trim(),
	    IsRaisedInCommittee: isRaisedValue,
	    Where: "Id = '" + pk + "'"
	};
	FormManager.updateIdeaCommittee(
	    list,
	    function(status, res) { 
	        $.alert("نظر دبیر کمیته ثبت و با موفقیت ارسال شد", "", "rtl", function(){
	            showLoading();
				var params = {
					'Context': 'مشاهده شد',
					'DocumentId': DocumentId,
					'CreatorActorId': CurrentUserActorId,
					'InboxId': InboxId
				};
				
				FormManager.InsertHamesh(params,
					function()
					{
						Office.Inbox.setResponse(dialogArguments.WorkItem,1, "",
						    function(data)
						    { 
						        closeWindow({OK:true, Result:null});
						    }, function(err){ throw Error(err); }
						);
					}
				);
	        });
	    },
	    function(error) {
	        console.error("خطای برگشتی:", error);
	        $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
	    }
	);
	
});


//******************************************************************************************************