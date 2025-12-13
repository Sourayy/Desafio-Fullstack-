using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompanySupplierController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CompanySupplierController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> AddSupplierToCompany(CompanySupplierCreateDto dto)
        {
            var company = await _context.Companies.FindAsync(dto.CompanyId);
            if (company == null)
                return NotFound("Company not found.");

            var supplier = await _context.Suppliers.FindAsync(dto.SupplierId);
            if (supplier == null)
                return NotFound("Supplier not found.");

            bool linkExists = await _context.CompanySuppliers.AnyAsync(cs =>
                cs.CompanyId == dto.CompanyId &&
                cs.SupplierId == dto.SupplierId);

            if (linkExists)
                return Conflict("This supplier is already linked to the company.");

            bool isParana = company.UF?.ToUpper() == "PR";
            bool isCPF = supplier.Document.Length == 11;

            if (isParana && isCPF)
            {
                if (supplier.BirthDate == null)
                    return BadRequest("BirthDate is required for CPF suppliers.");

                int age = DateTime.Today.Year - supplier.BirthDate.Value.Year;
                if (supplier.BirthDate.Value.Date > DateTime.Today.AddYears(-age))
                    age--;

                if (age < 18)
                    return BadRequest("Underage suppliers cannot be linked to companies in Paraná.");
            }

            var companySupplier = new CompanySupplier
            {
                CompanyId = dto.CompanyId,
                SupplierId = dto.SupplierId
            };

            _context.CompanySuppliers.Add(companySupplier);
            await _context.SaveChangesAsync();

            return Ok("Supplier successfully linked to company.");
        }

        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetSuppliersByCompany(int companyId)
        {
            var suppliers = await _context.CompanySuppliers
                .Where(cs => cs.CompanyId == companyId)
                .Include(cs => cs.Supplier)
                .Select(cs => cs.Supplier)
                .ToListAsync();

            return Ok(suppliers);
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveSupplierFromCompany(CompanySupplierCreateDto dto)
        {
            var link = await _context.CompanySuppliers
                .FirstOrDefaultAsync(cs =>
                    cs.CompanyId == dto.CompanyId &&
                    cs.SupplierId == dto.SupplierId);

            if (link == null)
                return NotFound("Relationship not found.");

            _context.CompanySuppliers.Remove(link);
            await _context.SaveChangesAsync();

            return Ok("Supplier removed from company.");
        }
    }
}