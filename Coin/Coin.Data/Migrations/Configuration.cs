using System.Collections.Generic;
using Coin.Model.Model;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Coin.Data.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Coin.Data.CoinDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Coin.Data.CoinDbContext context)
        {
            CreateUser(context);
            CreateApplicationGroup(context);
            CreateApplicationRole(context);
        }

        private void CreateUser(CoinDbContext context)
        {
            var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new CoinDbContext()));

            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new CoinDbContext()));

            var user = new ApplicationUser()
            {
                UserName = "thuongthanhto@gmail.com",
                Email = "thuongthanhto@gmail.com",
                EmailConfirmed = true,
                BirthDay = DateTime.Now,
                FullName = "Tô Thành Thương"

            };
            if (manager.Users.Count(x => x.UserName == "Online") == 0)
            {
                manager.Create(user, "Admin@123");

                if (!roleManager.Roles.Any())
                {
                    roleManager.Create(new IdentityRole { Name = "Admin" });
                    roleManager.Create(new IdentityRole { Name = "User" });
                }

                var adminUser = manager.FindByEmail("thuongthanhto@gmail.com");

                manager.AddToRoles(adminUser.Id, new string[] { "Admin", "User" });
            }

        }
        private void CreateApplicationGroup(CoinDbContext context)
        {
            if (!context.ApplicationGroups.Any())
            {
                List<ApplicationGroup> listApplicationGroup = new List<ApplicationGroup>()
                {
                    new ApplicationGroup() {Name = "Application group 1"},
                    new ApplicationGroup() {Name = "Application group 2"},
                    new ApplicationGroup() {Name = "Application group 3"}
                };
                context.ApplicationGroups.AddRange(listApplicationGroup);
                context.SaveChanges();
            }
        }

        private void CreateApplicationRole(CoinDbContext context)
        {
            if (!context.ApplicationRoles.Any())
            {
                List<ApplicationRole> listApplicationRole = new List<ApplicationRole>()
                {
                    new ApplicationRole() {Name = "Application Role 1"},
                    new ApplicationRole() {Name = "Application Role 2"},
                    new ApplicationRole() {Name = "Application Role 3"}
                };
                context.ApplicationRoles.AddRange(listApplicationRole);
                context.SaveChanges();
            }
        }
    }
}
