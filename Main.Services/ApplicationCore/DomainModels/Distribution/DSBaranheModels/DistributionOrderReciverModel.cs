namespace Marina.Services.ApplicationCore.DomainModels.Distribution.DSBaranheModels;

public class DistributionOrderReciverModel
{
    public string ReceiverName { get; set; }
    public string ReceiverNationalCode { get; set; }
    public string ReceiverMobile { get; set; }
    public string ReceiverPhone { get; set; }
    public string ReceiverAddress { get; set; }
    public string ReceiverPostalCode { get; set; }
    public double ReceiverLocationLat { get; set; }
    public double ReceiverLocationLong { get; set; }
    public int ReceiverRegionId { get; set; }
    public int ReceiverStreetId { get; set; }
    public int ReciverPersonalityId { get; set; }
}
