    console.log(" تست دوآرگومان:");
    SP_UpdatePersonnelCredit.Execute(
        testSQL,
        paramsString,
        function (data) {
            console.log(" دوآرگومان موفق:", data);
        },
        function (error) {
            console.error(" دوآرگومان خطا:", error);
        }
    );



     if (!giftCreditForUserId) {
        console.warn(" منتظر مقدار txtGiftCreditForUserId...");
        return;
    }