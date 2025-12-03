namespace Marina.Services.ApplicationCore.DomainModels.PricingModels;

/// <summary>
/// مدل مربوط به جدول PR_Pricing
/// </summary>
[Table("PR_Pricing", Schema = "ZJM")]
public class PRPricingModel
{
    /// <summary>
    /// شناسه
    /// </summary>
    [Key]
    [DisplayName("شناسه")]
    [IgnoreColumn]
    public int Id { get; set; }

    /// <summary>
    /// شماره قیمت گذاری
    /// </summary>
    [Required]
    [DisplayName("شماره قیمت گذاری")]
    [MaxLength(50, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public required string? PricingNo { get; set; }

    /// <summary>
    /// شناسه کاربر ایجاد کننده
    /// </summary>
    [Required]
    [DisplayName("شناسه کاربر ایجاد کننده")]
    public required int? CreatorId { get; set; }

    /// <summary>
    /// تاریخ ایجاد
    /// </summary>
    [Required]
    [DisplayName("تاریخ ایجاد")]
    public required DateTime? CreatedDate { get; set; }

    /// <summary>
    /// وضعیت فرآیند (0،1)
    /// </summary>
    [Required]
    [DisplayName("وضعیت فرآیند")]
    public required int? ProcessStatus { get; set; }

    /// <summary>
    /// وضعیت رد (0،1)
    /// </summary>
    [Required]
    [DisplayName("وضعیت رد")]
    public required int? RejectStatus { get; set; }
}
