namespace Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;

[Table("SE_Objective",Schema = "ZJM")]
public class SEObjectiveModel
{
    /// <summary>
    /// شناسه
    /// </summary>
    [Key]
    [DisplayName("شناسه")]
    [IgnoreColumn]
    public int Id { get; set; } = 0;

    /// <summary>
    /// شناسه
    /// </summary>
    [Required]
    [DisplayName("شناسه فوکوس اریا")]
    public required int FocusAreaId { get; set; } = 0;

    /// <summary>
    /// شناسه
    /// </summary>
    [Required]
    [DisplayName("کد آبجکتیو")]
    [MaxLength(50, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public required string ObjectiveCode { get; set; }

    /// <summary>
    /// عنوان فارسی آبجکتیو
    /// </summary>
    [Required]
    [MaxLength(250, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    [DisplayName("عنوان فارسی آبجکتیو")]
    public required string ObjectiveTitleFA { get; set; }

    /// <summary>
    /// عنوان انگلیسی آبجکتیو
    /// </summary>
    [Required]
    [MaxLength(250, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    [DisplayName("عنوان انگلیسی آبجکتیو")]
    public required string ObjectiveTitleEN { get; set; }

    /// <summary>
    /// توضیحات آبجکتیو
    /// </summary>
    [Required]
    [MaxLength(500, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    [DisplayName("واحدهای درگیر در آبجکتیو")]
    public required string ObjectiveUnitsEnvolve { get; set; }
}