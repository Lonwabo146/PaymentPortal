namespace PaymentPortal.DTOs
{
    public class RegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string IdNumber { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
