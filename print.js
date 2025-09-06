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