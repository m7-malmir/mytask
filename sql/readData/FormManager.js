SP_Test_Read_Data.Execute(jsonParams
    , function(data)
    {
        // TODO: onsuccess body implementation
        var list = [];
        //alert(JSON.stringify(data));
        var xmlvar = $.xmlDOM(data);
        xmlvar.find("row").each(
            function()
            {
                list.push
                ({
                    Id:$(this).find("col[name='Id']").text(),
                    FirstName:$(this).find("col[name='First_Name']").text(),
                    LastName:$(this).find("col[name='Last_Name']").text(),
                    RoleName:$(this).find("col[name='Role_Name']").text()
                });
            }
        );
        //alert(JSON.stringify(list));
        if($.isFunction(onSuccess))
        {
            onSuccess(list);
        }
    },onError
);

