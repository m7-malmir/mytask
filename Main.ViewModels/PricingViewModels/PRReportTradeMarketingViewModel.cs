namespace Marina.ViewModels.PricingViewModels;

//********************************************************************************************************************
[Serializable]
/// <summary>
/// this view Model Used For Delete & Find
/// </summary>
public class PRReportTradeMarketingKeyViewModel
{
 [Required(ErrorMessage = "شناسه الزامی است")]
 [DisplayName("شناسه")]
 [Description("شناسه یکتا برای رکورد موردنظر می باشد")]
 public required int Id { get; set; }
}
//********************************************************************************************************************
public abstract class PRReportTradeMarketingBaseViewModel
{
 [Required(ErrorMessage = "شماره گزارش ترید مارکتینگ اجباری است")]
 [MaxLength(50, ErrorMessage = "تعداد مجاز کارکتر {0}")]
 [DisplayName("شماره گزارش ترید مارکتینگ")]
 [Description("شماره گزارش ترید مارکتینگ")]
 public required string ReportTradeMarketingNo { get; set; }

 [DisplayName("تاریخ ایجاد")]
 [Description("تاریخ ایجاد")]
 public DateTime CreatedDate { get; set; } = DateTime.Now;

 [DisplayName("شناسه کاربر ایجاد کننده")]
 [Description("شناسه کاربر ایجاد کننده")]
 public int UserCreator { get; set; }

 [DisplayName("وضعیت فرآیند")]
 [Description("وضعیت فرآیند")]
 public int ProcessStatus { get; set; } =1;
}
//********************************************************************************************************************
/// <summary>
/// this view Model Used For Insert
/// </summary>
[Serializable]
public class PRReportTradeMarketingViewModel : PRReportTradeMarketingBaseViewModel
{
}
//********************************************************************************************************************
/// <summary>
/// this view Model Used For Update
/// </summary>
[Serializable]
public class PRReportTradeMarketingFullViewModel : PRReportTradeMarketingBaseViewModel
{
 [Required(ErrorMessage = "شناسه الزامی است")]
 [DisplayName("شناسه")]
 [Description("شناسه یکتا برای رکورد موردنظر می باشد")]
 public required int Id { get; set; }
}
//********************************************************************************************************************
/// <summary>
/// this view Model Used For Return Results to Clients
/// </summary>
[Serializable]
public class PRReportTradeMarketingResultViewModel : PRReportTradeMarketingFullViewModel
{
}
//********************************************************************************************************************
