using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Company
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "CNPJ is required.")]
        [MaxLength(14, ErrorMessage = "CNPJ can only have 14 characters.")]
        public string CNPJ { get; set; } = null!;

        [Required(ErrorMessage = "Fantasy name is required.")]
        [MaxLength(50, ErrorMessage = "Fantasy name can only have 50 characters.")]
        public string FantasyName { get; set; } = null!;

        [Required(ErrorMessage = "CEP is required.")]
        [MaxLength(8, ErrorMessage = "CEP can only have 8 characters.")]

        public string CEP { get; set; } = null!;

        [MaxLength(2)]
        public string? UF { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(100)]
        public string? Neighborhood { get; set; }

        [MaxLength(200)]
        public string? Street { get; set; }
    }
}