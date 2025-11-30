namespace Marina.Services.ApplicationCore.DomainModels.Distribution.DSBaranheModels;

public class ReturnValue
{
    public string Token { get; set; }
    public string Expires { get; set; }
    public string AuthType { get; set; }
}

public class ResultData
{
    public bool IsSuccessful { get; set; }
    public string Message { get; set; }
    public string Title { get; set; }
    public ReturnValue ReturnValue { get; set; }
    public bool UnhandledError { get; set; }
}
