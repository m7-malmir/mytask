namespace Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;

[Table("SE_Vision",Schema = "ZJM")]
public class SEVisionModel
{
    /// <summary>
    /// شناسه
    /// </summary>
    [Key]
    [DisplayName("شناسه")]
    [IgnoreColumn]
    public int Id { get; set; } = 0;

    /// <summary>
    /// عنوان فارسی ویژن
    /// </summary>
    [Required]
    [MaxLength(350, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    [DisplayName("عنوان فارسی ویژن")]
    public required string VisionTitleFA { get; set; }

    /// <summary>
    /// عنوان انگلیسی ویژن
    /// </summary>
    [Required]
    [MaxLength(350, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    [DisplayName("عنوان انگلیسی ویژن")]
    public required string VisionTitleEN { get; set; }

    /// <summary>
    /// توضیحات ویژن
    /// </summary>
    [MaxLength(500, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    [DisplayName("توضیحات ویژن")]
    public string? VisionDescription { get; set; }
}