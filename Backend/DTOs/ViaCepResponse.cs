using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTOs
{
    public class ViaCepResponse
    {
        public string cep { get; set; } = null!;
        public string logradouro { get; set; } = null!;
        public string complemento { get; set; } = null!;
        public string bairro { get; set; } = null!;
        public string localidade { get; set; } = null!;
        public string uf { get; set; } = null!;
    }
}