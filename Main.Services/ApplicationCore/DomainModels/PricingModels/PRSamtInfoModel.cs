namespace Marina.Services.ApplicationCore.DomainModels.PricingModels;

/// <summary>
/// مدل مربوط به جدول PR_SamtInfo
/// </summary>
[Table("PR_SamtInfo", Schema = "ZJM")]
public class PRSamtInfoModel
{
    /// <summary>
    /// شناسه
    /// </summary>
    [Key]
    [DisplayName("شناسه")]
    [IgnoreColumn]
    public int Id { get; set; }

    /// <summary>
    /// شماره گروه 
    /// </summary>
    [Required]
    [DisplayName("شماره گروه ")]
    public required int? SamtGroupNo { get; set; }

    /// <summary>
    /// نام گروه سمت
    /// </summary>
    [Required]
    [DisplayName("نام گروه سمت")]
    [MaxLength(500, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public required string? SamtGroupName { get; set; }

    /// <summary>
    /// درصد  
    /// </summary>
    [Required]
    [DisplayName("درصد")]
    public int? SamtGroupPercent { get; set; }

    /// <summary>
    /// تاریخ ایجاد
    /// </summary>
    [Required]
    [DisplayName("تاریخ ایجاد")]
    public required DateTime? CreatedDate { get; set; }

    /// <summary>
    /// شناسه کاربر ایجاد کننده
    /// </summary>
    [Required]
    [DisplayName("شناسه کاربر ایجاد کننده")]
    public int? UserCreator { get; set; }

}
