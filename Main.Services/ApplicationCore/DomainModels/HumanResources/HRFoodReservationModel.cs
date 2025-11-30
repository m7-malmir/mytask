namespace Marina.Services.ApplicationCore.DomainModels.HumanResources;

/// <summary>
/// رزرو غذا - مدل مربوط به رزرو وعده‌های غذایی پرسنل
/// </summary>
[Table("HR_FoodReservation", Schema = "ZJM")]
public class HRFoodReservationModel
{
    //********************************************************************************************************************
    /// <summary>
    /// شناسه رزرو غذا
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [DisplayName("شناسه رزرو غذا")]
    public int FoodReservationId { get; set; }
    //********************************************************************************************************************
    /// <summary>
    /// شناسه برنامه غذایی
    /// </summary>
    [Required(ErrorMessage = "شناسه برنامه غذایی الزامی است")]
    [DisplayName("شناسه برنامه غذایی")]
    [Description("شناسه برنامه غذایی که برای آن رزرو انجام شده است")]
    public int FoodMealPlanId { get; set; }
    //********************************************************************************************************************
    /// <summary>
    /// شناسه آکتور (در صورت وجود)
    /// </summary>
    [DisplayName("شناسه آکتور")]
    [Description("شناسه فردی که رزرو را انجام داده است")]
    public int? ActorId { get; set; }
    //********************************************************************************************************************
    /// <summary>
    /// شماره پرسنلی
    /// </summary>
    [Required(ErrorMessage = "شماره پرسنلی الزامی است")]
    [StringLength(20, ErrorMessage = "شماره پرسنلی نمی‌تواند بیش از 20 کاراکتر باشد")]
    [DisplayName("شماره پرسنلی")]
    [Description("شماره پرسنلی فردی که رزرو برای او انجام شده است")]
    public string PersonnelNo { get; set; }
    //********************************************************************************************************************
    /// <summary>
    /// تاریخ ایجاد
    /// </summary>
    [Required(ErrorMessage = "تاریخ ایجاد الزامی است")]
    [DisplayName("تاریخ ایجاد")]
    [Description("تاریخ و زمانی که رزرو ثبت شده است")]
    public DateTime CreationDate { get; set; }
    //********************************************************************************************************************
    /// <summary>
    /// زمان تحویل
    /// </summary>
    [DisplayName("زمان تحویل")]
    [Description("تاریخ و زمانی که غذا تحویل داده شده است")]
    public DateTime? DeliveredTime { get; set; }
    //********************************************************************************************************************
}