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
    public class CompaniesController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public CompaniesController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

       [HttpPost]
public async Task<IActionResult> AddCompany(Company company)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    if (!Validator.IsValidCNPJ(company.CNPJ))
    {
        return BadRequest("Invalid CNPJ.");
    }

    bool documentExistsInSupplier = await _appDbContext.Suppliers
        .AnyAsync(s => s.Document == company.CNPJ);

    if (documentExistsInSupplier)
    {
        return Conflict("This CNPJ is already registered.");
    }

    try
    {
        using var httpClient = new HttpClient();
        var response = await httpClient.GetAsync($"https://viacep.com.br/ws/{company.CEP}/json/");
        
        if (!response.IsSuccessStatusCode)
            return BadRequest("Invalid CEP.");

        var cepData = await response.Content.ReadFromJsonAsync<ViaCepResponse>();

        if (cepData == null || string.IsNullOrEmpty(cepData.cep))
        {
            return BadRequest("CEP not found.");
        }

        company.UF = cepData.uf;
        company.City = cepData.localidade;
        company.Neighborhood = cepData.bairro;
        company.Street = cepData.logradouro;
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Error fetching address from CEP: {ex.Message}");
    }

    try
    {
        _appDbContext.Companies.Add(company);
        await _appDbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCompanies), new { id = company.Id }, company);
    }
    catch (DbUpdateException ex)
    {
        if (ex.InnerException is SqlException sqlEx && sqlEx.Number == 2601)
        {
            return Conflict("There is already a company registered with this CNPJ.");
        }

        return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
    }
}


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompanies(
             [FromQuery] string? name,
             [FromQuery] string? cnpj)
        {
            var query = _appDbContext.Companies.AsQueryable();

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(c => c.FantasyName.Contains(name));
            }

            if (!string.IsNullOrEmpty(cnpj))
            {
                query = query.Where(c => c.CNPJ.Contains(cnpj));
            }

            var companies = await query.ToListAsync();

            return Ok(companies);
        }

        [HttpPut("{id}")]

        public async Task<IActionResult> UpdateCompany(int id, [FromBody] Company updatedCompany)
        {
            var currentCompany = await _appDbContext.Companies.FindAsync(id);

            if (currentCompany == null)
            {
                return NotFound("Company not found!");
            }

            if (currentCompany.CNPJ != updatedCompany.CNPJ)
            {
                if (!Validator.IsValidCNPJ(updatedCompany.CNPJ))
                {
                    return BadRequest("Invalid CNPJ.");
                }

                var cnpjExists = await _appDbContext.Companies
                    .AnyAsync(c => c.CNPJ == updatedCompany.CNPJ && c.Id != id);

                if (cnpjExists)
                {
                    return Conflict("There is already a company registered with this CNPJ.");
                }
            }

            if (currentCompany.CEP != updatedCompany.CEP)
            {
                using var httpClient = new HttpClient();
                var response = await httpClient.GetAsync($"https://viacep.com.br/ws/{updatedCompany.CEP}/json/");
                if (!response.IsSuccessStatusCode)
                    return BadRequest("Invalid CEP.");

                var cepData = await response.Content.ReadFromJsonAsync<ViaCepResponse>();
                if (cepData == null || string.IsNullOrEmpty(cepData.cep))
                    return BadRequest("CEP not found.");

                updatedCompany.UF = cepData.uf;
                updatedCompany.City = cepData.localidade;
                updatedCompany.Neighborhood = cepData.bairro;
                updatedCompany.Street = cepData.logradouro;
            }

            currentCompany.CNPJ = updatedCompany.CNPJ;
            currentCompany.FantasyName = updatedCompany.FantasyName;
            currentCompany.CEP = updatedCompany.CEP;
            currentCompany.UF = updatedCompany.UF;
            currentCompany.City = updatedCompany.City;
            currentCompany.Neighborhood = updatedCompany.Neighborhood;
            currentCompany.Street = updatedCompany.Street;

            await _appDbContext.SaveChangesAsync();

            return StatusCode(201, currentCompany);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            var company = await _appDbContext.Companies.FindAsync(id);

            if (company == null)
            {
                return NotFound("Company not found!");
            }

            _appDbContext.Companies.Remove(company);
            await _appDbContext.SaveChangesAsync();

            return Ok("Company deleted successfully!");
        }
    }
}