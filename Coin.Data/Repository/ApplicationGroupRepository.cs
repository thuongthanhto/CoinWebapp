using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Coin.Data.Infrastructure;
using Coin.Model.Model;

namespace Coin.Data.Repository
{
    public interface IApplicationGroupRepository : IRepository<ApplicationGroup>
    {
        new IEnumerable<ApplicationGroup> GetListGroupByUserId(string userId);
        new IEnumerable<ApplicationUser> GetListUserByGroupId(int groupId);
    }
    public class ApplicationGroupRepository : RepositoryBase<ApplicationGroup>, IApplicationGroupRepository
    {
        public ApplicationGroupRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        public new IEnumerable<ApplicationGroup> GetListGroupByUserId(string userId)
        {
            var query = from g in DbContext.ApplicationGroups
                        join ug in DbContext.ApplicationUserGroups on g.Id equals ug.GroupId
                        where ug.UserId == userId
                        select g;

            return query;
        }

        public new IEnumerable<ApplicationUser> GetListUserByGroupId(int groupId)
        {
            var query = from g in DbContext.ApplicationGroups
                        join ug in DbContext.ApplicationUserGroups on g.Id equals ug.GroupId
                        join u in DbContext.Users on ug.UserId equals u.Id
                        where ug.GroupId == groupId
                        select u;

            return query;
        }
    }
}
