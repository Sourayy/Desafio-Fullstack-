using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Company> Companies { get; set; } = null!;
        public DbSet<Supplier> Suppliers { get; set; } = null!;
        public DbSet<CompanySupplier> CompanySuppliers { get; set; } = null!;
        public object DesafioAccentureDb { get; internal set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CompanySupplier>()
            .HasKey(cs => new { cs.CompanyId, cs.SupplierId });

            modelBuilder.Entity<Supplier>()
            .HasIndex(s => s.Document)
            .IsUnique();

            modelBuilder.Entity<Company>()
            .HasIndex(c => c.CNPJ)
            .IsUnique();


        }
    }
}