using Microsoft.EntityFrameworkCore;

namespace RestSamples.Model
{
    public class Product
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public int Price { get; set; }

        public int BrandId { get; set; }
        public Brand Brand { get; set; }

    }


public class Brand
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required List<Product> Products { get; set; }
}

public class ProductDbContext : DbContext
{
    public DbSet<Product>? Products { get; set; }

    public DbSet<Brand>? Brands { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Server=(local);Database=ShopDb;Trusted_Connection=True;TrustServerCertificate=True");
    }
}


}