namespace Marina.ViewModels.PricingViewModels;

//********************************************************************************************************************
[Serializable]
/// <summary>
/// this viewmodel used for Delete & Find
/// </summary>
public class PRCompetitorBrandKeyViewModel
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
public abstract class PRCompetitorBrandBaseViewModel
{
    [Required(ErrorMessage = "نام فارسی برند الزامی است")]
    [MaxLength(350, ErrorMessage = "تعداد کاراکتر مجاز {0} می‌باشد")]
    [DisplayName("نام فارسی برند")]
    [Description("نام فارسی برند رقیب می‌باشد")]
    public required string BrandNameFA { get; set; }

    [Required(ErrorMessage = "نام انگلیسی برند الزامی است")]
    [MaxLength(350, ErrorMessage = "تعداد کاراکتر مجاز {0} می‌باشد")]
    [DisplayName("نام انگلیسی برند")]
    [Description("نام انگلیسی برند رقیب می‌باشد")]
    public required string BrandNameEN { get; set; }
}

//********************************************************************************************************************
/// <summary>
/// this viewmodel used for Insert
/// </summary>
[Serializable]
public class PRCompetitorBrandViewModel : PRCompetitorBrandBaseViewModel
{
}

//********************************************************************************************************************
/// <summary>
/// this viewmodel used for Update
/// </summary>
[Serializable]
public class PRCompetitorBrandFullViewModel : PRCompetitorBrandBaseViewModel
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
public class PRCompetitorBrandResultViewModel : PRCompetitorBrandFullViewModel
{
}
