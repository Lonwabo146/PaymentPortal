using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using PaymentPortal.API.Data;
using PaymentPortal.DTOs;
using PaymentPortal.Models;
using PaymentPortal.Services;
using System.Security.Claims;

namespace PaymentPortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PaymentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Customer submits a payment
        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> SubmitPayment([FromBody] PaymentDto dto)
        {
            if (!ValidationService.IsValidAmount(dto.Amount))
                return BadRequest("Invalid amount.");
            if (!ValidationService.IsValidCurrency(dto.Currency))
                return BadRequest("Invalid currency code.");
            if (!ValidationService.IsValidAccountNumber(dto.RecipientAccount))
                return BadRequest("Invalid recipient account number.");
            if (!ValidationService.IsValidSwiftCode(dto.SwiftCode))
                return BadRequest("Invalid SWIFT code.");

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var payment = new Payments
            {
                CustomerId = userId,
                Amount = dto.Amount,
                Currency = dto.Currency,
                Provider = "SWIFT",
                RecipientAccount = dto.RecipientAccount,
                SwiftCode = dto.SwiftCode,
                Status = "Pending"
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment submitted.", paymentId = payment.Id });
        }
    }
}