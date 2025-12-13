using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTOs
{
    public class CompanySupplierCreateDto
    {
        public int CompanyId { get; set; }
        public int SupplierId { get; set; }
    }
}