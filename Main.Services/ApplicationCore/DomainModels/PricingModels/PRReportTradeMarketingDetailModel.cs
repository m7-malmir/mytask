namespace Marina.Services.ApplicationCore.DomainModels.PricingModels;

[Table("PR_ReportTradeMarketingDetail", Schema = "ZJM")]
public class PRReportTradeMarketingDetailModel
{
    /// <summary>
    /// شناسه
    /// </summary>
    [Key]
    [DisplayName("شناسه")]
    [IgnoreColumn]
    public int Id { get; set; } = 0;

    /// <summary>
    /// شناسه گزارش ترید مارکتینگ
    /// </summary>
    [DisplayName("شناسه گزارش ترید مارکتینگ")]
    public int ReportTradeMarketingId { get; set; }

    /// <summary>
    /// شناسه کالا
    /// </summary>
    [DisplayName("شناسه کالا")]
    public int GoodsId { get; set; }

    /// <summary>
    /// قیمت مصرف کننده
    /// </summary>
    [DisplayName("قیمت مصرف کننده")]
    [Column(TypeName = "decimal(18,0)")]
    public decimal ConsumerPrice { get; set; } = 0m;

    /// <summary>
    /// قیمت تولیدکننده
    /// </summary>
    [DisplayName("قیمت تولیدکننده")]
    [Column(TypeName = "decimal(18,0)")]
    public decimal ProducerPrice { get; set; } = 0m;

    /// <summary>
    /// قیمت پایه
    /// </summary>
    [DisplayName("قیمت پایه")]
    [Column(TypeName = "decimal(18,0)")]
    public decimal BasePrice { get; set; } = 0m;

    /// <summary>
    /// شناسه برند رقیب
    /// </summary>
    [DisplayName("شناسه برند رقیب")]
    public int CompetitorBrandId { get; set; }

    /// <summary>
    /// قیمت مصرف کننده رقیب
    /// </summary>
    [DisplayName("قیمت مصرف کننده رقیب")]
    [Column(TypeName = "decimal(18,0)")]
    public decimal CompetitorConsumerPrice { get; set; } = 0m;

    /// <summary>
    /// پروموشن
    /// </summary>
    [DisplayName("پروموشن")]
    public int Promotion { get; set; }

    /// <summary>
    /// پروموشن رقیب
    /// </summary>
    [DisplayName("پروموشن رقیب")]
    public int CompetitorPromotion { get; set; }

    /// <summary>
    /// نخفیفات
    /// </summary>
    [DisplayName("نخفیفات")]
    public int Discount { get; set; }

    /// <summary>
    /// نخفیفات رقیب
    /// </summary>
    [DisplayName("نخفیفات رقیب")]
    public int CompetitorDiscount { get; set; }

    /// <summary>
    /// پیشنهادات ویژه
    /// </summary>
    [DisplayName("پیشنهادات ویژه")]
    public int SpecialOffer { get; set; }

    /// <summary>
    /// پیشنهادات ویژه رقیب
    /// </summary>
    [DisplayName("پیشنهادات ویژه رقیب")]
    public int CompetitorSpecialOffer { get; set; }

    /// <summary>
    /// اف او سی
    /// </summary>
    [DisplayName("اف او سی")]
    public int FOC { get; set; }

    /// <summary>
    /// اف او سی رقیب
    /// </summary>
    [DisplayName("اف او سی رقیب")]
    public int CompetitorFOC { get; set; }

    /// <summary>
    /// شناسه سامت
    /// </summary>
    [DisplayName("شناسه سامت")]
    public int SamtInfoId { get; set; }
}