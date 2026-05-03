using System.ComponentModel.DataAnnotations;

namespace PaymentPortal.DTOs
{
    public class PaymentDto
    {
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public string Currency { get; set; } = string.Empty;
        [Required]
        public string Provider { get; set; } = "SWIFT";
        [Required]
        public string RecipientAccount { get; set; } = string.Empty;
        [Required]
        public string SwiftCode { get; set; } = string.Empty;
    }
}
