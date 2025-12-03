namespace Marina.ViewModels.PricingViewModels;

//********************************************************************************************************************
[Serializable]
/// <summary>
/// this viewmodel used for Delete & Find
/// </summary>
public class PRPricingKeyViewModel
{
    [Required(ErrorMessage = "شناسه الزامی است")]
    [DisplayName("شناسه")]
    [Description("شناسه یکتا برای رکورد مورد نظر می‌باشد")]
    public required int Id { get; set; }
}

//********************************************************************************************************************
[Serializable]
/// <summary>
/// Base for Insert & Update shared fields
/// </summary>
public abstract class PRPricingBaseViewModel
{
    [Required(ErrorMessage = "شماره قیمت‌گذاری الزامی است")]
    [MaxLength(50, ErrorMessage = "تعداد کاراکتر مجاز {0} می‌باشد")]
    [DisplayName("شماره قیمت‌گذاری")]
    [Description("شماره یکتای قیمت‌گذاری می‌باشد")]
    public required string PricingNo { get; set; }

    [DisplayName("شناسه کاربر ایجاد کننده")]
    [Description("شناسه کاربر ایجاد کننده رکورد")]
    public int? CreatorId { get; set; }

    [DisplayName("تاریخ ایجاد")]
    [Description("تاریخ ایجاد رکورد")]
    public DateTime? CreatedDate { get; set; }

    [DisplayName("وضعیت فرآیند")]
    [Description("وضعیت فرآیند (۰: غیرفعال، ۱: فعال)")]
    public int? ProcessStatus { get; set; }

    [DisplayName("وضعیت رد")]
    [Description("وضعیت رد درخواست (۰ یا ۱)")]
    public int? RejectStatus { get; set; }
}

//********************************************************************************************************************
/// <summary>
/// this viewmodel used for Insert
/// </summary>
[Serializable]
public class PRPricingViewModel : PRPricingBaseViewModel
{
    // Insert نیازی به Id ندارد
}

//********************************************************************************************************************
/// <summary>
/// this viewmodel used for Update
/// </summary>
[Serializable]
public class PRPricingFullViewModel : PRPricingBaseViewModel
{
    [Required(ErrorMessage = "شناسه الزامی است")]
    [DisplayName("شناسه")]
    [Description("شناسه یکتا برای رکورد مورد نظر می‌باشد")]
    public required int Id { get; set; }
}

//********************************************************************************************************************
/// <summary>
/// this viewmodel used for Returning data to clients
/// </summary>
[Serializable]
public class PRPricingResultViewModel : PRPricingFullViewModel
{
    // از FullViewModel ارث‌بری می‌کند
}
