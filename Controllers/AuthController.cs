using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PaymentPortal.API.Data;
using PaymentPortal.DTOs;
using PaymentPortal.Models;
using PaymentPortal.Services;

namespace PaymentPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly AuthService _authService;

        public AuthController(ApplicationDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Whitelist validation on every field
            if (!ValidationService.IsValidFullName(dto.FullName))
                return BadRequest("Invalid full name.");
            if (!ValidationService.IsValidIdNumber(dto.IdNumber))
                return BadRequest("Invalid ID number.");
            if (!ValidationService.IsValidAccountNumber(dto.AccountNumber))
                return BadRequest("Invalid account number.");
            if (!ValidationService.IsValidPassword(dto.Password))
                return BadRequest("Password does not meet requirements.");

            if (await _context.Users.AnyAsync(u => u.AccountNumber == dto.AccountNumber))
                return Conflict("Account number already registered.");

            var user = new User
            {
                FullName = dto.FullName,
                IdNumber = dto.IdNumber,
                AccountNumber = dto.AccountNumber,
                PasswordHash = _authService.HashPassword(dto.Password),
                Role = "Customer"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Allow both customer account numbers and employee account numbers
            bool isValidAccount = ValidationService.IsValidAccountNumber(dto.AccountNumber) ||
                                  ValidationService.IsValidEmployeeAccountNumber(dto.AccountNumber);

            if (!isValidAccount)
                return BadRequest("Invalid account number.");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.AccountNumber == dto.AccountNumber);

            if (user == null || !_authService.VerifyPassword(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials.");

            var token = _authService.GenerateJwtToken(user);
            return Ok(new { token, role = user.Role });
        }
    }
}