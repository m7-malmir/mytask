namespace Marina.Services.ApplicationCore.DomainModels.HumanResources;

[Table("HR_EventCalendar", Schema = "ZJM")]
public class HREventCalendarModel
{
    /// <summary>
    /// شناسه
    /// </summary>
    [Key]
    [Required]
    [DisplayName("شناسه")]
    public int Id { get; set; }

    /// <summary>
    /// تاریخ شمسی مناسبت
    /// </summary>
    [Required]
    [MaxLength(10,ErrorMessage = "حداکثر کاراکتر مجاز {0} عدد می باشد")]
    [DisplayName("تاریخ شمسی مناسبت")]
    public required string EventShamsiDate { get; set; }

    /// <summary>
    /// عنوان انگلیسی مناسبت
    /// </summary>
    [Required]
    [MaxLength(500, ErrorMessage = "حدکاثر کاراکتر مجاز {0} عدد می باشد")]
    [DisplayName("عنوان انگلیسی مناسبت")]
    public required string EventTitleEN { get; set; }

    /// <summary>
    /// عنوان فارسی مناسبت
    /// </summary>
    [Required]
    [MaxLength(500, ErrorMessage = "حدکاثر کاراکتر مجاز {0} عدد می باشد")]
    [DisplayName("عنوان فارسی مناسبت")]
    public required string EventTitleFA { get; set; }
}
