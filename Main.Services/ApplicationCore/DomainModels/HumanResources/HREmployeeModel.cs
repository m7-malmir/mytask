namespace Marina.Services.ApplicationCore.DomainModels.HumanResources;

[Table("HR_Employee", Schema = "ZJM")]
public class HREmployeeModel
{
    /// <summary>
    /// شماره پرسنلی
    /// </summary>
    [Key]
    [Required(ErrorMessage = "شماره پرسنلی الزامی است")]
    [MaxLength(100)]
    [DisplayName("شماره پرسنلی")]
    public required string PersonnelNO { get; set; }

    /// <summary>
    /// شناسه شرکت
    /// </summary>
    [Required(ErrorMessage = "شناسه شرکت الزامی است")]
    [DisplayName("شناسه شرکت")]
    public int CompanyId { get; set; }

    /// <summary>
    /// کد ملی
    /// </summary>
    [MaxLength(100)]
    [DisplayName("کد ملی")]
    public string? NationalCode { get; set; }

    /// <summary>
    /// نام
    /// </summary>
    [MaxLength(400)]
    [DisplayName("نام")]
    public string? FirstName { get; set; }

    /// <summary>
    /// نام خانوادگی
    /// </summary>
    [MaxLength(400)]
    [DisplayName("نام خانوادگی")]
    public string? LastName { get; set; }

    /// <summary>
    /// تاریخ تولد (شمسی)
    /// </summary>
    [MaxLength(4000)]
    [DisplayName("تاریخ تولد")]
    public string? Birthday { get; set; }

    /// <summary>
    /// نام شهر
    /// </summary>
    [MaxLength(128)]
    [DisplayName("شهر محل سکونت")]
    public string? CityName { get; set; }

    /// <summary>
    /// شماره موبایل
    /// </summary>
    [MaxLength(50)]
    [DisplayName("موبایل")]
    public string? Mobile { get; set; }

    /// <summary>
    /// آدرس ایمیل
    /// </summary>
    [MaxLength(50)]
    [EmailAddress(ErrorMessage = "ایمیل معتبر نیست")]
    [DisplayName("ایمیل")]
    public string? Email { get; set; }

    /// <summary>
    /// نام به انگلیسی
    /// </summary>
    [MaxLength(50)]
    [DisplayName("نام (انگلیسی)")]
    [Description("نام پرسنل به زبان انگلیسی")]
    public string? FirstName_EN { get; set; }

    /// <summary>
    /// نام خانوادگی به انگلیسی
    /// </summary>
    [MaxLength(50)]
    [DisplayName("نام خانوادگی (انگلیسی)")]
    [Description("نام خانوادگی پرسنل به زبان انگلیسی")]
    public string? LastName_EN { get; set; }

    /// <summary>
    /// تاریخ استخدام (شمسی)
    /// </summary>
    [MaxLength(10)]
    [DisplayName("تاریخ استخدام")]
    [Description("تاریخ شروع به کار پرسنل به صورت شمسی")]
    public string? EmploymentDate { get; set; }

    /// <summary>
    /// شناسه دپارتمان یا مرکز
    /// </summary>
    [MaxLength(3)]
    [DisplayName("شناسه دپارتمان")]
    [Description("شناسه دپارتمان یا مرکز کاری پرسنل")]
    public string? DCId { get; set; }

    /// <summary>
    /// عنوان رتبه شغلی
    /// </summary>
    [MaxLength(100)]
    [DisplayName("عنوان رتبه شغلی")]
    [Description("رتبه یا عنوان شغلی پرسنل در سازمان")]
    public string? RankTitle { get; set; }

    /// <summary>
    /// تاریخ ترک کار (شمسی)
    /// </summary>
    [MaxLength(10)]
    [DisplayName("تاریخ ترک کار")]
    [Description("تاریخ خاتمه همکاری پرسنل به صورت شمسی")]
    public string? LeaveDate { get; set; }

    /// <summary>
    /// جنسیت
    /// </summary>
    [DisplayName("جنسیت")]
    [Description("جنسیت پرسنل (۱: مرد، ۲: زن)")]
    public int? Gender { get; set; }

    /// <summary>
    /// وضعیت تأهل
    /// </summary>
    [DisplayName("وضعیت تأهل")]
    [Description("وضعیت تأهل پرسنل (۱: متأهل، ۲: مجرد)")]
    public int? MaritalStatus { get; set; }

    /// <summary>
    /// تاریخ استخدام (میلادی)
    /// </summary>
    [DisplayName("تاریخ استخدام (میلادی)")]
    [Description("تاریخ شروع به کار پرسنل به صورت میلادی")]
    public DateTime? EmploymentDateMiladi { get; set; }

    /// <summary>
    /// تاریخ تولد (میلادی)
    /// </summary>
    [DisplayName("تاریخ تولد (میلادی)")]
    [Description("تاریخ تولد پرسنل به صورت میلادی")]
    public DateTime? BirthdayMiladi { get; set; }

    /// <summary>
    /// تاریخ ترک کار (میلادی)
    /// </summary>
    [DisplayName("تاریخ ترک کار (میلادی)")]
    [Description("تاریخ خاتمه همکاری پرسنل به صورت میلادی")]
    public DateTime? LeaveDateMiladi { get; set; }
}