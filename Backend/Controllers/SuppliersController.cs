using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuppliersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SuppliersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> AddSupplier(Supplier supplier)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string document = supplier.Document.Trim();
            bool isCPF = document.Length == 11;

            if (isCPF)
            {
                if (string.IsNullOrEmpty(supplier.RG) || supplier.BirthDate == null)
                {
                    return BadRequest("RG and BirthDate are required for CPF suppliers.");
                }

                bool rgExists = await _context.Suppliers.AnyAsync(s => s.RG == supplier.RG);
                if (rgExists)
                {
                    return Conflict("There is already a supplier registered with this RG.");
                }

                if (!Validator.IsValidCPF(supplier.Document))
                    return BadRequest("Invalid CPF.");

                if (string.IsNullOrEmpty(supplier.RG) || supplier.BirthDate == null)
                    return BadRequest("RG and BirthDate are required for CPF suppliers.");

                if (!Validator.IsValidBirthDate(supplier.BirthDate))
                    return BadRequest("BirthDate must be within the last 100 years and not in the future.");
            }
            else
            {
                if (!Validator.IsValidCNPJ(supplier.Document))
                    return BadRequest("Invalid CNPJ.");

                if (!string.IsNullOrEmpty(supplier.RG) || supplier.BirthDate != null)
                {
                    return BadRequest("RG and BirthDate must not be provided for CNPJ suppliers.");
                }
            }

            bool documentExistsInCompany = await _context.Companies
    .AnyAsync(c => c.CNPJ == supplier.Document);

            if (documentExistsInCompany)
            {
                return Conflict("This CPF/CNPJ is already registered.");
            }

            if (!Validator.IsValidEmail(supplier.Email))
                return BadRequest("Invalid email format.");

            bool emailExists = await _context.Suppliers
    .AnyAsync(s => s.Email.ToLower() == supplier.Email.ToLower());

            if (emailExists)
            {
                return Conflict("This email is already registered.");
            }

            try
            {
                _context.Suppliers.Add(supplier);
                await _context.SaveChangesAsync();

                return Created("Supplier created successfully!", supplier);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException is SqlException sqlEx && sqlEx.Number == 2601)
                {
                    return Conflict("There is already a supplier registered with this CPF/CNPJ.");
                }

                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Supplier>>> GetSuppliers(
            [FromQuery] string? name,
            [FromQuery] string? document)
        {
            var query = _context.Suppliers.AsQueryable();

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(s => s.Name.Contains(name));
            }

            if (!string.IsNullOrEmpty(document))
            {
                query = query.Where(s => s.Document.Contains(document));
            }

            var suppliers = await query
     .Select(s => new SupplierResponseDto
     {
         Id = s.Id,
         Document = s.Document,
         Name = s.Name,
         Email = s.Email,
         CEP = s.CEP,
         RG = s.RG,
         BirthDate = s.BirthDate.HasValue
             ? s.BirthDate.Value.ToString("dd/MM/yyyy")
             : null
     })
     .ToListAsync();

            return Ok(suppliers);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSupplier(int id, Supplier updatedSupplier)
        {
            var currentSupplier = await _context.Suppliers.FindAsync(id);

            if (currentSupplier == null)
                return NotFound("Supplier not found!");

            if (currentSupplier.Document != updatedSupplier.Document)
            {
                bool existsInCompany = await _context.Companies
                    .AnyAsync(c => c.CNPJ == updatedSupplier.Document);

                if (existsInCompany)
                    return Conflict("This CPF/CNPJ is already registered as a company.");

                bool existsInSupplier = await _context.Suppliers
                    .AnyAsync(s => s.Document == updatedSupplier.Document && s.Id != id);

                if (existsInSupplier)
                    return Conflict("This CPF/CNPJ is already registered.");
            }


            if (currentSupplier.Email != updatedSupplier.Email)
            {
                bool emailExists = await _context.Suppliers
                    .AnyAsync(s => s.Email.ToLower() == updatedSupplier.Email.ToLower() && s.Id != id);

                if (emailExists)
                    return Conflict("This email is already registered.");
            }

            string document = updatedSupplier.Document.Trim();
            bool isCPF = document.Length == 11;

            if (isCPF)
            {
                if (!Validator.IsValidCPF(updatedSupplier.Document))
                    return BadRequest("Invalid CPF.");

                if (string.IsNullOrEmpty(updatedSupplier.RG) || updatedSupplier.BirthDate == null)
                    return BadRequest("RG and BirthDate are required for CPF suppliers.");

                if (!Validator.IsValidBirthDate(updatedSupplier.BirthDate))
                    return BadRequest("BirthDate must be within the last 100 years and not in the future.");

                if (currentSupplier.RG != updatedSupplier.RG)
                {
                    bool rgExists = await _context.Suppliers
                        .AnyAsync(s => s.RG == updatedSupplier.RG && s.Id != id);
                    if (rgExists)
                        return Conflict("There is already a supplier registered with this RG.");
                }
            }
            else
            {
                if (!Validator.IsValidCNPJ(updatedSupplier.Document))
                    return BadRequest("Invalid CNPJ.");

                if (!string.IsNullOrEmpty(updatedSupplier.RG) || updatedSupplier.BirthDate != null)
                    return BadRequest("RG and BirthDate must not be provided for CNPJ suppliers.");
            }

            if (!Validator.IsValidEmail(updatedSupplier.Email))
                return BadRequest("Invalid email format.");


            currentSupplier.Document = updatedSupplier.Document;
            currentSupplier.Name = updatedSupplier.Name;
            currentSupplier.Email = updatedSupplier.Email;
            currentSupplier.CEP = updatedSupplier.CEP;
            currentSupplier.RG = updatedSupplier.RG;
            currentSupplier.BirthDate = updatedSupplier.BirthDate;

            await _context.SaveChangesAsync();

            return Ok(currentSupplier);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);

            if (supplier == null)
                return NotFound("Supplier not found!");

            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();

            return Ok("Supplier deleted successfully!");
        }
    }
}