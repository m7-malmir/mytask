namespace Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;

[Table("SE_FocusArea", Schema = "ZJM")]
public class SEFocusAreaModel 
{
    /// <summary>
    /// شناسه
    /// </summary>
    [Key]
    [DisplayName("شناسه استراتژی")]
    [IgnoreColumn]
    public int Id { get; set; }

    /// <summary>
    /// شناسه ویژن
    /// </summary>
    [Required(ErrorMessage = "شناسه ویژن اجباری است")]
    [DisplayName("شناسه ویژن")]
    public required int VisionId { get; set; }

    /// <summary>
    /// کد Focus Area
    /// </summary>
    [Required(ErrorMessage = "کد اجباری است")]
    [MaxLength(50, ErrorMessage = "تعداد کاراکتر مجاز {0} می باشد")]
    [DisplayName("کد Focus Area")]
    public required string FocusAreaCode { get; set; }

    /// <summary>
    /// عنوان فارسی
    /// </summary>
    [Required(ErrorMessage = "عنوان فارسی اجباری است")]
    [MaxLength(350, ErrorMessage = "تعداد کاراکتر مجاز {0} می باشد")]
    [DisplayName("عنوان فارسی")]
    public required string FocusAreaTitleFA { get; set; }

    /// <summary>
    /// عنوان انگلیسی
    /// </summary>
    [Required(ErrorMessage = "عنوان انگلیسی اجباری است")]
    [MaxLength(350, ErrorMessage = "تعداد کاراکتر مجاز {0} می باشد")]
    [DisplayName("عنوان انگلیسی")]
    public required string FocusAreaTitleEN { get; set; }
}