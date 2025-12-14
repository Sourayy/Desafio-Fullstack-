using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Supplier
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Document (CPF or CNPJ) is required.")]
        [MaxLength(14, ErrorMessage = "Document can have at most 14 characters.")]
        public string Document { get; set; } = null!; // CPF ou CNPJ

        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "CEP is required.")]
        [MaxLength(8)]
        public string CEP { get; set; } = null!;

        [MaxLength(2)]
        public string? UF { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(100)]
        public string? Neighborhood { get; set; }

        [MaxLength(200)]
        public string? Street { get; set; }
        public string? RG { get; set; }

        public string? BirthDate { get; set; }
    }
}
