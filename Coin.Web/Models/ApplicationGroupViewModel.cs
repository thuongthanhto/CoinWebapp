using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Coin.Web.Models
{
    public class ApplicationGroupViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { set; get; }

        public IEnumerable<ApplicationRoleViewModel> Roles { set; get; }
    }
}