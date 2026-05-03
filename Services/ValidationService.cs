using System.Text.RegularExpressions;

namespace PaymentPortal.Services
{
    public static class ValidationService
    {
        // Only letters and spaces — no injection characters
        public static bool IsValidFullName(string value) =>
            Regex.IsMatch(value, @"^[a-zA-Z\s]{2,100}$");

        // South African ID: exactly 13 digits
        public static bool IsValidIdNumber(string value) =>
            Regex.IsMatch(value, @"^\d{13}$");

        // Account number: 6–12 digits only
        public static bool IsValidAccountNumber(string value) =>
            Regex.IsMatch(value, @"^\d{6,12}$");

        // Password: min 8 chars, must have uppercase, lowercase, digit, special char
        public static bool IsValidPassword(string value) =>
            Regex.IsMatch(value, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$");

        // SWIFT code: 8 or 11 alphanumeric characters (ISO 9362)
        public static bool IsValidSwiftCode(string value) =>
            Regex.IsMatch(value, @"^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$");

        // Currency: exactly 3 uppercase letters (ISO 4217)
        public static bool IsValidCurrency(string value) =>
            Regex.IsMatch(value, @"^[A-Z]{3}$");

        // Amount: positive number, max 2 decimal places
        public static bool IsValidAmount(decimal value) =>
            value > 0 && decimal.Round(value, 2) == value;
    }
}