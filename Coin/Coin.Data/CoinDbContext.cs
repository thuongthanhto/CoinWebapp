using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Coin.Model.Model;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Coin.Data
{
    public class CoinDbContext : IdentityDbContext<ApplicationUser>
    {
        public CoinDbContext() : base("CoinConnection")
        {
            //this.Configuration.LazyLoadingEnabled = false;
            //Database.SetInitializer<OnlineShopDbContext>(new DropCreateDatabaseAlways<OnlineShopDbContext>());
        }
     

        public DbSet<ApplicationGroup> ApplicationGroups { set; get; }
        public DbSet<ApplicationRole> ApplicationRoles { set; get; }
        public DbSet<ApplicationRoleGroup> ApplicationRoleGroups { set; get; }
        public DbSet<ApplicationUserGroup> ApplicationUserGroups { set; get; }

        public static CoinDbContext Create()
        {
            return new CoinDbContext();
        }

        protected override void OnModelCreating(DbModelBuilder builder)
        {
            builder.Entity<IdentityUserRole>().HasKey(i => new { i.UserId, i.RoleId }).ToTable("ApplicationUserRoles");
            builder.Entity<IdentityUserLogin>().HasKey(i => i.UserId).ToTable("ApplicationUserLogins");
            builder.Entity<IdentityRole>().ToTable("ApplicationRoles");
            builder.Entity<IdentityUserClaim>().HasKey(i => i.UserId).ToTable("ApplicationUserClaims");
        }
    }
}
