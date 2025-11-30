namespace Marina.Services.ApplicationCore.DomainModels.GenralTable;

[Table("GT_MetricUnit", Schema = "ZJM")]
public class GTMetricUnitModel
{
    /// <summary>
    /// شناسه
    /// </summary>
    [Key]
    [DisplayName("شناسه")]
    [IgnoreColumn]
    public int Id { get; set; } = 0;

    /// <summary>
    /// عنوان فارسی واحد سنجش
    /// </summary>
    [Required]
    [MaxLength(150, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    [DisplayName("عنوان فارسی واحد سنجش")]
    public required string MetricUnitTitleFA { get; set; }

    /// <summary>
    /// عنوان انگلیسی واحد سنجش
    /// </summary>
    [Required]
    [MaxLength(150, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    [DisplayName("عنوان انگلیسی واحد سنجش")]
    public required string MetricUnitTitleEN { get; set; }

    /// <summary>
    /// توضیحات واحد سنجش
    /// </summary>
    [MaxLength(150, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    [DisplayName("توضیحات واحد سنجش")]
    public string? Description { get; set; }
}