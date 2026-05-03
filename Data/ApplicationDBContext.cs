using Microsoft.EntityFrameworkCore;



using PaymentPortal.Models;
using System.Reflection.Emit;

namespace PaymentPortal.API.Data

{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
         : base(options)
        { 
        
        }



        public DbSet<User> Users { get; set; }
        public DbSet<Payments> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Prevent duplicate account numbers
            modelBuilder.Entity<User>()
                .HasIndex(u => u.AccountNumber)
                .IsUnique();

            // Prevent duplicate ID numbers
            modelBuilder.Entity<User>()
                .HasIndex(u => u.IdNumber)
                .IsUnique();

            modelBuilder.Entity<Payments>()
                .HasOne(p => p.Customer)
                .WithMany()
                .HasForeignKey(p => p.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Add this — 18 digits total, 2 decimal places (standard for currency)
            modelBuilder.Entity<Payments>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);
        }
    }
}
