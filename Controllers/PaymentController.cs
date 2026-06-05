using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        // Employee views all pending payments
        [HttpGet]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetPayments()
        {
            var payments = await _context.Payments
                .Include(p => p.Customer)
                .Where(p => p.Status == "Pending" || p.Status == "Verified")
                .Select(p => new {
                    p.Id,
                    p.Amount,
                    p.Currency,
                    p.Provider,
                    p.RecipientAccount,
                    p.SwiftCode,
                    p.Status,
                    p.CreatedAt,
                    CustomerName = p.Customer!.FullName,
                    CustomerAccount = p.Customer.AccountNumber
                })
                .ToListAsync();

            return Ok(payments);
        }
        // Employee verifies a payment
        [HttpPatch("{id}/verify")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> VerifyPayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return NotFound();
            if (payment.Status != "Pending")
                return BadRequest("Payment is not in pending status.");

            payment.Status = "Verified";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment verified." });
        }

        // Employee submits verified payment to SWIFT
        [HttpPatch("{id}/submit")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> SubmitToSwift(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return NotFound();
            if (payment.Status != "Verified")
                return BadRequest("Payment must be verified before submitting to SWIFT.");

            payment.Status = "Submitted";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment submitted to SWIFT." });
        }
    }
}
