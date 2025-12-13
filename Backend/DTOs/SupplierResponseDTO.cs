namespace Backend.DTOs
{
    public class SupplierResponseDto
    {
        public int Id { get; set; }
        public string Document { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string CEP { get; set; } = null!;
        public string? RG { get; set; }
        public string? BirthDate { get; set; }
    }
}
