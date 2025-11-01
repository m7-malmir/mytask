using RestSamples.Model;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ProductDbContext>();

var app = builder.Build();

app.MapGet("/GetProductList", (ProductDbContext dbContext) =>
    dbContext.Products.ToList()
);

app.MapGet("/", () => "Hello World!");

app.Run();
