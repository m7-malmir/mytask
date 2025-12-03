namespace Marina.Services.ApplicationCore.DomainModels.PricingModels;

[Table("PR_CompetitorBrand", Schema = "ZJM")]
public class PRCompetitorBrandModel
{

    /// <summary>
    /// شناسه
    /// </summary>
    [Key]
    [DisplayName("شناسه")]
    [IgnoreColumn]
    public int Id { get; set; }

    /// <summary>
    /// نام فارسی برند رقیب
    /// </summary>
    [Required]
    [DisplayName("نام فارسی برند رقیب")]
    [MaxLength(350, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public required string? BrandNameFA { get; set; }

    /// <summary>
    /// نام انگلیسی
    /// </summary>
    [DisplayName("نام انگلیسی")]
    [MaxLength(350, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public string? BrandNameEN { get; set; }
}
