namespace Marina.Services.ApplicationCore.DomainModels.AttachedFile;

[Table("AttachedFile", Schema = "Office")]
public class AFAttachedFileModel
{
    /// <summary>
    /// شناسه فایل
    /// </summary>
    [Key]
    [Display(Name = "شناسه فایل")]
    public Guid FileId { get; set; }

    /// <summary>
    /// شناسه جدول سیستم اجرا کننده
    /// </summary>
    [Display(Name = "شناسه جدول سیستم اجرا کننده")]
    public int? DocumentId { get; set; }

    /// <summary>
    /// موضوع فایل
    /// </summary>
    [Display(Name = "موضوع فایل")]
    [Required(ErrorMessage = "وارد کردن {0} الزامیست")]
    [StringLength(150)]
    public required string FileSubject { get; set; }

    /// <summary>
    /// اسم فایل
    /// </summary>
    [Display(Name = "اسم فایل")]
    [Required(ErrorMessage = "وارد کردن {0} الزامیست")]
    [StringLength(250)]
    public required string FileName { get; set; }

    /// <summary>
    /// نوع فایل
    /// </summary>
    [Display(Name = "نوع فایل")]
    [Required(ErrorMessage = "وارد کردن {0} الزامیست")]
    [StringLength(10)]
    public required string FileType { get; set; }

    /// <summary>
    /// محتوای فایل
    /// </summary>
    [Display(Name = "محتوای فایل")]
    [Required(ErrorMessage = "وارد کردن {0} الزامیست")]
    public required byte[] FileContent { get; set; }

    /// <summary>
    /// شناسه سیستم
    /// </summary>
    [Display(Name = "شناسه سیستم")]
    [Required(ErrorMessage = "وارد کردن {0} الزامیست")]
    public int SystemId { get; set; }

    /// <summary>
    /// کد وضعیت فرآیند
    /// </summary>
    [Display(Name = "کد وضعیت فرآیند")]
    [Required(ErrorMessage = "وارد کردن {0} الزامیست")]
    public int ProccessStatus { get; set; }

    /// <summary>
    /// توضیحات
    /// </summary>
    [Display(Name = "توضیحات")]
    [StringLength(250)]
    public string? Description { get; set; }

    /// <summary>
    /// کاربر ایجاد کننده
    /// </summary>
    [Display(Name = "کاربر ایجاد کننده")]
    [Required(ErrorMessage = "وارد کردن {0} الزامیست")]
    public int CreatorUserId { get; set; }
}
