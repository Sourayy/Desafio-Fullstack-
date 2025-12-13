namespace Backend.Models
{
    public class CompanySupplier
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; } = null!;

    }
}