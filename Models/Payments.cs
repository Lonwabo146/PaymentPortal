namespace PaymentPortal.Models
{
    public class Payments
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public User? Customer { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Provider { get; set; } = "SWIFT";
        public string RecipientAccount { get; set; } = string.Empty;
        public string SwiftCode { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending, Verified, Submitted
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
