namespace Marina.ViewModels.PricingViewModels;

//********************************************************************************************************************
[Serializable]
/// <summary>
/// this view Model Used For Delete & Find
/// </summary>
public class PRReportTradeMarketingDetailKeyViewModel
{
 [Required(ErrorMessage = "شناسه الزامی است")]
 [DisplayName("شناسه")]
 [Description("شناسه یکتا برای رکورد موردنظر می باشد")]
 public required int Id { get; set; }
}
//********************************************************************************************************************
public abstract class PRReportTradeMarketingDetailBaseViewModel
{
 [Required(ErrorMessage = "شناسه گزارش ترید مارکتینگ اجباری است")]
 [DisplayName("شناسه گزارش ترید مارکتینگ")]
 [Description("شناسه گزارش ترید مارکتینگ")]
 public required int ReportTradeMarketingId { get; set; }

 [Required(ErrorMessage = "شناسه کالا اجباری است")]
 [DisplayName("شناسه کالا")]
 [Description("شناسه کالا")]
 public required int GoodsId { get; set; }

 [DisplayName("قیمت مصرف کننده")]
 [Description("قیمت مصرف کننده")]
 public decimal ConsumerPrice { get; set; } =0m;

 [DisplayName("قیمت تولیدکننده")]
 [Description("قیمت تولیدکننده")]
 public decimal ProducerPrice { get; set; } =0m;

 [DisplayName("قیمت پایه")]
 [Description("قیمت پایه")]
 public decimal BasePrice { get; set; } =0m;

 [DisplayName("شناسه برند رقیب")]
 [Description("شناسه برند رقیب")]
 public int CompetitorBrandId { get; set; }

 [DisplayName("قیمت مصرف کننده رقیب")]
 [Description("قیمت مصرف کننده رقیب")]
 public decimal CompetitorConsumerPrice { get; set; } =0m;

 [DisplayName("پروموشن")]
 [Description("پروموشن")]
 public int Promotion { get; set; }

 [DisplayName("پروموشن رقیب")]
 [Description("پروموشن رقیب")]
 public int CompetitorPromotion { get; set; }

 [DisplayName("نخفیفات")]
 [Description("نخفیفات")]
 public int Discount { get; set; }

 [DisplayName("نخفیفات رقیب")]
 [Description("نخفیفات رقیب")]
 public int CompetitorDiscount { get; set; }

 [DisplayName("پیشنهادات ویژه")]
 [Description("پیشنهادات ویژه")]
 public int SpecialOffer { get; set; }

 [DisplayName("پیشنهادات ویژه رقیب")]
 [Description("پیشنهادات ویژه رقیب")]
 public int CompetitorSpecialOffer { get; set; }

 [DisplayName("اف او سی")]
 [Description("اف او سی")]
 public int FOC { get; set; }

 [DisplayName("اف او سی رقیب")]
 [Description("اف او سی رقیب")]
 public int CompetitorFOC { get; set; }

 [DisplayName("شناسه سامت")]
 [Description("شناسه سامت")]
 public int SamtInfoId { get; set; }
}
//********************************************************************************************************************
/// <summary>
/// this view Model Used For Insert
/// </summary>
[Serializable]
public class PRReportTradeMarketingDetailViewModel : PRReportTradeMarketingDetailBaseViewModel
{
}
//********************************************************************************************************************
/// <summary>
/// this view Model Used For Update
/// </summary>
[Serializable]
public class PRReportTradeMarketingDetailFullViewModel : PRReportTradeMarketingDetailBaseViewModel
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
public class PRReportTradeMarketingDetailResultViewModel : PRReportTradeMarketingDetailFullViewModel
{
}
//********************************************************************************************************************
