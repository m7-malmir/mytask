namespace Marina.Services.ApplicationCore.DomainModels.PricingModels;

[Table("PR_ReportInsight", Schema = "ZJM")]
public class PRReportInsightModel
{
    /// <summary>
    /// شناسه
    /// </summary>
    [Key]
    [DisplayName("شناسه")]
    [IgnoreColumn]
    public int Id { get; set; } = 0;

    /// <summary>
    /// تاریخ ایجاد
    /// </summary>
    [DisplayName("تاریخ ایجاد")]
    public DateTime CreatedDate { get; set; } = DateTime.Now;

    /// <summary>
    /// شناسه کاربر ایجاد کننده
    /// </summary>
    [DisplayName("شناسه کاربر ایجاد کننده")]
    public int UserCreator { get; set; }

    /// <summary>
    /// شماره گزارش
    /// </summary>
    [Required]
    [MaxLength(50, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    [DisplayName("شماره گزارش")]
    public required string ReportInsightNo { get; set; }

    /// <summary>
    /// وضعیت فرآیند
    /// </summary>
    [DisplayName("وضعیت فرآیند")]
    public int ProcessStatus { get; set; } = 1;
}