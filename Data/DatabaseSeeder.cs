using PaymentPortal.Models;
using PaymentPortal.Services;

namespace PaymentPortal.API.Data
{
    public static class DatabaseSeeder
    {
        public static void SeedEmployees(ApplicationDbContext context, AuthService authService)
        {
            // Only seed if no employees exist
            if (context.Users.Any(u => u.Role == "Employee"))
                return;

            var employees = new List<User>
            {
                new User
                {
                    FullName = "David Sanders",
                    IdNumber = "7001015009037",
                    AccountNumber = "EMP001",
                    PasswordHash = authService.HashPassword("Employee@123"),
                    Role = "Employee"
                },
                new User
                {
                    FullName = "Elizabetha Khumalo",
                    IdNumber = "9301015009087",
                    AccountNumber = "EMP002",
                    PasswordHash = authService.HashPassword("123@Eliza"),
                    Role = "Employee"
                }
            };

            context.Users.AddRange(employees);
            context.SaveChanges();
        }
    }
}