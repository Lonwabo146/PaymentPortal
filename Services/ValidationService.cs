using System.Text.RegularExpressions;

namespace PaymentPortal.Services
{
    public static class ValidationService
    {
        // Timeout prevents ReDoS attacks — regex runs max 1 second
        private static readonly TimeSpan RegexTimeout = TimeSpan.FromSeconds(1);

        public static bool IsValidFullName(string value)
        {
            try
            {
                return Regex.IsMatch(value, @"^[a-zA-Z\s]{2,100}$",
                    RegexOptions.None, RegexTimeout);
            }
            catch (RegexMatchTimeoutException) { return false; }
        }

        public static bool IsValidIdNumber(string value)
        {
            try
            {
                return Regex.IsMatch(value, @"^\d{13}$",
                    RegexOptions.None, RegexTimeout);
            }
            catch (RegexMatchTimeoutException) { return false; }
        }

        public static bool IsValidAccountNumber(string value)
        {
            try
            {
                return Regex.IsMatch(value, @"^\d{6,12}$",
                    RegexOptions.None, RegexTimeout);
            }
            catch (RegexMatchTimeoutException) { return false; }
        }

        public static bool IsValidEmployeeAccountNumber(string value)
        {
            try
            {
                return Regex.IsMatch(value, @"^EMP\d{3}$",
                    RegexOptions.None, RegexTimeout);
            }
            catch (RegexMatchTimeoutException) { return false; }
        }

        public static bool IsValidPassword(string value)
        {
            try
            {
                return Regex.IsMatch(value,
                    @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$",
                    RegexOptions.None, RegexTimeout);
            }
            catch (RegexMatchTimeoutException) { return false; }
        }

        public static bool IsValidSwiftCode(string value)
        {
            try
            {
                return Regex.IsMatch(value,
                    @"^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$",
                    RegexOptions.None, RegexTimeout);
            }
            catch (RegexMatchTimeoutException) { return false; }
        }

        public static bool IsValidCurrency(string value)
        {
            try
            {
                return Regex.IsMatch(value, @"^[A-Z]{3}$",
                    RegexOptions.None, RegexTimeout);
            }
            catch (RegexMatchTimeoutException) { return false; }
        }

        public static bool IsValidAmount(decimal value) =>
            value > 0 && decimal.Round(value, 2) == value;
    }
}

