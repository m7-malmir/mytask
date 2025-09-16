    const data = [
        {
            id: 1,
            title: "صورتجلسه شماره ۱ - جلسه استراتژیک",
            status: "approved",
            history: [
                { name: "علی", action: "رد", comment: "نیاز به اصلاح بند ۵", date: "1404/05/28" },
                { name: "مریم", action: "رد", comment: "متن مبهم است", date: "1404/05/29" },
                { name: "حسین", action: "رد", comment: "اشتباه تایپی", date: "1404/05/30" },

                { name: "علی", action: "تایید", comment: "", date: "1404/06/01" },
                { name: "مریم", action: "تایید", comment: "", date: "1404/06/02" },
                { name: "حسین", action: "تایید", comment: "", date: "1404/06/03" }
            ]
        },
        {
            id: 2,
            title: "صورتجلسه شماره ۲ - جلسه پروژه X",
            status: "pending",
            history: [
                { name: "علی", action: "رد", comment: "نیاز به اصلاح در بند ۲", date: "1404/06/02" },
                { name: "دبیر جلسه", action: "رد", comment: "تصحیح بند ۲", date: "1404/06/03" },
                { name: "مریم", action: "رد", comment: "ارجاع به پیوست ناقص", date: "1404/06/04" },

                { name: "علی", action: "تایید", comment: "", date: "1404/06/05" },
                { name: "دبیر جلسه", action: "تایید", comment: "", date: "1404/06/06" },
                { name: "مریم", action: "تایید", comment: "", date: "1404/06/07" }
            ]
        }
    ];


      ,[MeetingMinuteNo]
      ,[ActorIdCreator]
      ,[CreatedDate]
      ,[MeetingStartDate]
      ,[MeetingStartTime]
      ,[MeetingEndTime]
      ,[ProcessStatus]
      ,[RejectStatus]
      ,[SubjectMeeting]
      ,[MeetingAgenda]
      ,[MeetingRoomId]
      ,[UserPresent]
      ,[UserAbsent]







    meetingMinuteNo=list[0].MeetingMinuteNo;
    actorIdCreator=list[0].ActorIdCreator;
    meetingStartDate=list[0].MeetingStartDate;
    meetingStartTime=list[0].MeetingStartTime;
    meetingEndTime=list[0].MeetingEndTime;
    subjectMeeting=list[0].SubjectMeeting;
    meetingAgenda=list[0].MeetingAgenda;
    meetingRoomId=list[0].MeetingRoomId;
    userPresent=list[0].UserPresent;
    userAbsent=list[0].UserAbsent;

    $("#txtActorIdCreator").val(actorIdCreator);
    $("#txtMeetingDate").val(meetingStartDate);
    // MeetingStartTime=05:50
    //$("#txtMeetingStartTime").val(05);
    //$("#txtMinMeetingStartTime").val(50);
    // meetingEndTime=06:30
    //$("#txtHourMeetingEndTime").val(06);
    //$("#txtminMeetingEndTime").val(30);
    //$("#meetingRoomId").val(meetingRoomId);
    $("#txtSubjectMeeting").val(subjectMeeting);
    $("#txtMeetingAgenda").val(meetingAgenda);
    $("#txtPresentActorId").val(userPresent);
    $("#txtAbsentActorId").val(userAbsent);