namespace Marina.ViewModels.PlanningViewModels;

//********************************************************************************************************************
/// <summary>
/// این ViewModel برای حذف و جستجو بر اساس شناسه استفاده می‌شود
/// </summary>
public class SEPlanningUnitKpiKeyViewModel
{
    [Required(ErrorMessage = "شناسه الزامی است")]
    [DisplayName("شناسه")]
    [Description("شناسه یکتا برای رکورد شاخص عملکرد واحد برنامه‌ریزی می‌باشد")]
    public required int Id { get; set; }
}
//********************************************************************************************************************
public class SEPlanningUnitKpiBaseViewModel
{
    [Required(ErrorMessage = "شناسه پروژه KPI واحد برنامه‌ریزی الزامی است")]
    [DisplayName("شناسه پروژه KPI واحد برنامه‌ریزی")]
    [Description("شناسه پروژه مرتبط با شاخص عملکرد واحد برنامه‌ریزی")]
    public required int PlanningUnitKpiProjId { get; set; }

    [Required(ErrorMessage = "شاخص عملکرد هدف استراتژیک الزامی است")]
    [DisplayName("شاخص عملکرد هدف استراتژیک")]
    [Description("شناسه KPI مرتبط با هدف استراتژیک")]
    public required int ObjectiveStrategicKPIId { get; set; }

    [Required(ErrorMessage = "دوره پایش الزامی است")]
    [DisplayName("دوره پایش")]
    public required int MonitorPeriod { get; set; }

    [Required(ErrorMessage = "دوره اندازه‌گیری الزامی است")]
    [DisplayName("دوره اندازه‌گیری")]
    public required int MeasurePeriod { get; set; }

    [Required(ErrorMessage = "تاریخ شروع الزامی است")]
    [DisplayName("تاریخ شروع")]
    public required DateTime StartDate { get; set; }

    [Required(ErrorMessage = "تاریخ پایان الزامی است")]
    [DisplayName("تاریخ پایان")]
    public required DateTime EndDate { get; set; }

    [Required(ErrorMessage = "تعیین نیاز به برنامه اقدام الزامی است")]
    [DisplayName("نیاز به برنامه اقدام")]
    [Description("مشخص می‌کند آیا برای این شاخص نیاز به برنامه اقدام وجود دارد یا خیر")]
    public required bool ActionPlanNeeded { get; set; }

    [Required(ErrorMessage = "آستانه شاخص عملکرد الزامی است")]
    [MaxLength(200, ErrorMessage = "حداکثر تعداد کاراکتر مجاز {0} می‌باشد")]
    [DisplayName("آستانه شاخص عملکرد")]
    public required string KPIThreshold { get; set; }

    [Required(ErrorMessage = "مقدار فعلی شاخص عملکرد الزامی است")]
    [MaxLength(200, ErrorMessage = "حداکثر تعداد کاراکتر مجاز {0} می‌باشد")]
    [DisplayName("مقدار فعلی شاخص عملکرد")]
    public required string KPIAmountAsIs { get; set; }

    [Required(ErrorMessage = "هدف بهبود شاخص عملکرد الزامی است")]
    [MaxLength(200, ErrorMessage = "حداکثر تعداد کاراکتر مجاز {0} می‌باشد")]
    [DisplayName("هدف بهبود شاخص عملکرد در دوره")]
    public required string KPIImprovementTargetInPeriod { get; set; }

    [MaxLength(500, ErrorMessage = "حداکثر تعداد کاراکتر مجاز {0} می‌باشد")]
    [DisplayName("توضیحات")]
    public string? Description { get; set; }
}
//********************************************************************************************************************
/// <summary>
/// این ViewModel برای به‌روزرسانی شاخص عملکرد استفاده می‌شود
/// </summary>
public class SEPlanningUnitKpiFullViewModel : SEPlanningUnitKpiBaseViewModel
{
    [Required(ErrorMessage = "شناسه الزامی است")]
    [DisplayName("شناسه")]
    [Description("شناسه یکتا برای رکورد شاخص عملکرد واحد برنامه‌ریزی")]
    public required int Id { get; set; }
}
//********************************************************************************************************************
/// <summary>
/// این ViewModel برای بازگشت نتیجه به کلاینت (لیست یا جزئیات) استفاده می‌شود
/// </summary>
public class SEPlanningUnitKpiResultViewModel : SEPlanningUnitKpiFullViewModel
{
    [DisplayName("کد هدف استراتژیک")]
    public string? ObjectiveId { get; set; }

    [DisplayName("کد هدف استراتژیک")]
    public string? ObjectiveCode { get; set; }

    [DisplayName("عنوان هدف استراتژیک (انگلیسی)")]
    public string? ObjectiveTitleEN { get; set; }

    [DisplayName("عنوان پروژه KPI")]
    public string? StrategicKPIId { get; set; }

    [DisplayName("نام دوره پایش")]
    public string? KPICode { get; set; }

    [DisplayName("نام دوره اندازه‌گیری")]
    public string? StrategicKPINameEN { get; set; }

    [DisplayName("نام دوره اندازه‌گیری")]
    public string? UnitsId { get; set; }

    [DisplayName("نام دوره اندازه‌گیری")]
    public string? UnitsName { get; set; }

    [DisplayName("نام دوره اندازه‌گیری")]
    public string? Threshold { get; set; }

    [DisplayName("نام دوره اندازه‌گیری")]
    public string? UpperControlLimit { get; set; }

    [DisplayName("نام دوره اندازه‌گیری")]
    public string? LowerControlLimit { get; set; }

    [DisplayName("نام دوره اندازه‌گیری")]
    public string? VerificationSource { get; set; }

    [DisplayName("نام دوره اندازه‌گیری")]
    public string? UsedInPlanningId { get; set; }
}
//********************************************************************************************************************

