var FormManager = {
	
//******************************************************************************************************
	readMeetingMinuteManagment: function(jsonParams, onSuccess, onError)
	{
	  BS_MeetingMinuteManagment.Read(jsonParams
	       , function(data)
	       {
	           var list = [];
	           var xmlvar = $.xmlDOM(data);
	           xmlvar.find("row").each(
	               function()
	               { 
	                  list.push
	                  ({
						Id: $(this).find("col[name='Id']").text(),
		                MeetingMinuteNo: $(this).find("col[name='MeetingMinuteNo']").text(),
						ActorIdCreator: $(this).find("col[name='ActorIdCreator']").text(),
						MeetingStartDate: $(this).find("col[name='MeetingStartDate']").text(),
						MeetingStartTime: $(this).find("col[name='MeetingStartTime']").text(),
					    MeetingEndTime: $(this).find("col[name='MeetingEndTime']").text(),
					    SubjectMeeting: $(this).find("col[name='SubjectMeeting']").text(),
					    MeetingAgenda: $(this).find("col[name='MeetingAgenda']").text(),
					    MeetingRoomId: $(this).find("col[name='MeetingRoomId']").text(),
						UserPresent: $(this).find("col[name='UserPresent']").text(),
						UserAbsent: $(this).find("col[name='UserAbsent']").text()
	                  });
	               }
	           );
	           if($.isFunction(onSuccess))
	           {
	               onSuccess(list);
	           
	           }
	       }, onError
	   );
	},
	//******************************************************************************************************
    readMeetingRooms: function(jsonParams, onSuccess, onError)
	{
	  BS_MM_MeetingRooms.Read(jsonParams
	       , function(data)
	       {
	           var list = [];
	           var xmlvar = $.xmlDOM(data);
	           xmlvar.find("row").each(
	               function()
	               { 
	                  list.push
	                  ({
						Id: $(this).find("col[name='Id']").text(),
		                Address: $(this).find("col[name='Address']").text(),
						Title: $(this).find("col[name='Title']").text()
	                  });
	               }
	           );
	           if($.isFunction(onSuccess))
	           {
	               onSuccess(list);
	           
	           }
	       }, onError
	   );
	},
	//******************************************************************************************************
	readMeetingMinuteManagmentDetail: function(jsonParams, onSuccess, onError)
	{
	  BS_MM_MeetingMinuteManagmentDetail.Read(jsonParams
	       , function(data)
	       {
	           var list = [];
	           var xmlvar = $.xmlDOM(data);
	           xmlvar.find("row").each(
	               function()
	               { 
	                  list.push
	                  ({
						Id: $(this).find("col[name='Id']").text(),
		                MeetingManagmentId: $(this).find("col[name='MeetingManagmentId']").text(),
						Title: $(this).find("col[name='Title']").text(),
						ActionDeadLineDate: $(this).find("col[name='ActionDeadLineDate']").text(),
						ResponsibleForAction: $(this).find("col[name='ResponsibleForAction']").text()
	                  });
	               }
	           );
	           if($.isFunction(onSuccess))
	           {
	               onSuccess(list);
	           
	           }
	       }, onError
	   );
	},
    /*********************************************************************************************************/
    // ثبت سفارش، کاهش موجودی منطقی انبار، کاهش اعتبار کاربر جاری
    insertMeetingMinuteManagment: function (jsonParams, onSuccess, onError) {
        SP_MeetingMinuteManagmentInsert.Execute(jsonParams,
            function (data) {

				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(data, "text/xml");

				const cols = xmlDoc.getElementsByTagName("col");
				
				const result = {};
				for (let i = 0; i < cols.length; i++) {
				    const name = cols[i].getAttribute("name");
				    const value = cols[i].textContent;
				    result[name] = value;
				}
                if ($.isFunction(onSuccess)) {
                    onSuccess(result);
                }
            },
            function (error) {
                var methodName = "insertMeetingMinuteManagment";

                if ($.isFunction(onError)) {
                    var erroMessage = "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
                    console.error("Error:", erroMessage);
                    console.error("Details:", error);

                    onError({
                        message: erroMessage,
                        details: error
                    });
                } else {
                    console.error(erroMessage + " (no onError callback provided):", error);
                }
            }
        );
    },
	//******************************************************************************************************
	readAttachedFile: function(jsonParams, onSuccess, onError)
	{
	   BS_Office_AttachedFile.Read(jsonParams
	       , function(data)
	       {
	           var list = [];
	           var xmlvar = $.xmlDOM(data);
	           xmlvar.find("row").each(
	               function()
	               { 
	                  list.push
	                  ({
						  
			                FileId:          $(this).find("col[name='FileId']").text(),
							DocumentId:      $(this).find("col[name='DocumentId']").text(),
							FileSubject:     $(this).find("col[name='FileSubject']").text(),
							FileName:        $(this).find("col[name='FileName']").text(),
							FileType:        $(this).find("col[name='FileType']").text(),
							FileContent:     $(this).find("col[name='FileContent']").text(),
							SystemId:        $(this).find("col[name='SystemId']").text(),
							ProccessStatus:  $(this).find("col[name='ProccessStatus']").text(),
							Description:     $(this).find("col[name='Description']").text(),
							CreatedDate:     $(this).find("col[name='CreatedDate']").text(),
							CreatorUserId:   $(this).find("col[name='CreatorUserId']").text(),

	                  });
	               }
	           );
	           if($.isFunction(onSuccess))
	           {
	               onSuccess(list);
	           
	           }
	       }, onError
	   );
	},
	deleteAttachedFile: function(jsonParams, onSuccess, onError)
	{
		BS_Office_AttachedFile.Delete(jsonParams, 
			function(data)
			{
				var dataXml = null;
				if($.trim(data) != "")
				{
					dataXml = $.xmlDOM(data);
				}
				if($.isFunction(onSuccess))
				{
					onSuccess(dataXml);
				}
			},
			function(error) {
					var methodName = "deleteAttachedFile";
	
		            if ($.isFunction(onError)) {
						var erroMessage= "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
						console.error("Error:", erroMessage);
						console.error("Details:", error);
		                
		                onError({
		                    message: erroMessage,
		                    details: error
		                });
		            } else {
		                console.error(erroMessage+ " (no onError callback provided):", error);
		            }
		        }
		);
	},
 /*********************************************************************************************************/
    // ثبت سفارش، کاهش موجودی منطقی انبار، کاهش اعتبار کاربر جاری
    updateMeetingMinuteManagment: function (jsonParams, onSuccess, onError) {
        SP_MeetingMinuteManagmentUpdate.Execute(jsonParams,
            function (data) {

				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(data, "text/xml");

				const cols = xmlDoc.getElementsByTagName("col");
				
				const result = {};
				for (let i = 0; i < cols.length; i++) {
				    const name = cols[i].getAttribute("name");
				    const value = cols[i].textContent;
				    result[name] = value;
				}
                if ($.isFunction(onSuccess)) {
                    onSuccess(result);
                }
            },
            function (error) {
                var methodName = "updateMeetingMinuteManagment";

                if ($.isFunction(onError)) {
                    var erroMessage = "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
                    console.error("Error:", erroMessage);
                    console.error("Details:", error);

                    onError({
                        message: erroMessage,
                        details: error
                    });
                } else {
                    console.error(erroMessage + " (no onError callback provided):", error);
                }
            }
        );
    },
	//******************************************************************************************************
};

