namespace Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;

[Table("SE_StrategicKPI", Schema = "ZJM")]
public class SEStrategicKpiModel
{
    /// <summary>
    /// شناسه
    /// </summary>
    [Key]
    [DisplayName("شناسه")]
    [IgnoreColumn]
    public int Id { get; set; }

    /// <summary>
    /// نام انگلیسی kpi
    /// </summary>
    [DisplayName("نام انگلیسی kpi")]
    [MaxLength(350, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public string? StrategicKPINameEN { get; set; }

    /// <summary>
    /// نام فارسی kpi
    /// </summary>
    [DisplayName("نام فارسی kpi")]
    [MaxLength(350, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public string? StrategicKPINameFA { get; set; }

    /// <summary>
    /// کد kpi
    /// </summary>
    [DisplayName("کد kpi")]
    [MaxLength(50, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public string? KPICode { get; set; }

    /// <summary>
    /// نوع نتیجه
    /// </summary>
    [DisplayName("نوع نتیجه")]
    public int? KPIResultType { get; set; }

    /// <summary>
    /// نوع زمان در چشم انداز
    /// </summary>
    [DisplayName("نوع زمان در چشم انداز")]
    public int? KPITimeVisionType { get; set; }

    /// <summary>
    /// شناسه واحد سنجش
    /// </summary>
    [DisplayName("شناسه واحد سنجش")]
    public int? KPIMetricUnitId { get; set; }

    /// <summary>
    /// نوع استفاده
    /// </summary>
    [DisplayName("نوع استفاده")]
    public int? KPIUsageType { get; set; }

    /// <summary>
    /// حد تارگت
    /// </summary>
    [DisplayName("حد تارگت")]
    [MaxLength(50, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public string? Threshold { get; set; }

    /// <summary>
    /// حد بال
    /// </summary>
    [DisplayName("حد بالا")]
    [MaxLength(50, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public string? UpperControlLimit { get; set; }

    /// <summary>
    /// حد پایین
    /// </summary>
    [DisplayName("حد پایین")]
    [MaxLength(50, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public string? LowerControlLimit { get; set; }

    /// <summary>
    /// آیا مدیریتی است
    /// </summary>
    [DisplayName("آیا مدیریتی است")]
    public int? IsManagementKPI { get; set; }

    /// <summary>
    /// منبع اعتبارسنجی
    /// </summary>
    [DisplayName("منبع اعتبارسنجی")]
    [MaxLength(350, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public string? VerificationSource { get; set; }

    /// <summary>
    /// فرمول محاسبه kpi
    /// </summary>
    [DisplayName("فرمول محاسبه kpi")]
    [MaxLength(1000, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public string? KPIFormula { get; set; }
}