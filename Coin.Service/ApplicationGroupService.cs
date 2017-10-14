using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Coin.Common.Exceptions;
using Coin.Data.Infrastructure;
using Coin.Model.Model;

namespace Coin.Service
{
    public interface IApplicationGroupService : IService<ApplicationGroup>
    {
        IEnumerable<ApplicationGroup> GetAll(string keyword);

        new ApplicationGroup Add(ApplicationGroup appGroup);

        new void Update(ApplicationGroup appGroup);

        bool AddUserToGroups(IEnumerable<ApplicationUserGroup> groups, string userId);

        IEnumerable<ApplicationGroup> GetListGroupByUserId(string userId);

        IEnumerable<ApplicationUser> GetListUserByGroupId(int groupId);

    }
    public class ApplicationGroupService : ServiceBase<ApplicationGroup>, IApplicationGroupService
    {
        private readonly IRepository<ApplicationGroup> _appGroupRepository;
        private readonly IRepository<ApplicationUserGroup> _appUserGroupRepository;
        private readonly IUnitOfWork _unitOfWork;


        public ApplicationGroupService(IRepository<ApplicationGroup> appGroupRepository, IRepository<ApplicationUserGroup> appUserGroupRepository, IUnitOfWork unitOfWork) : base(appGroupRepository, unitOfWork)
        {
            this._appGroupRepository = appGroupRepository;
            this._appUserGroupRepository = appUserGroupRepository;
            this._unitOfWork = unitOfWork;
        }

        public new ApplicationGroup Add(ApplicationGroup appGroup)
        {
            return _appGroupRepository.Add(appGroup);
        }

        public IEnumerable<ApplicationGroup> GetAll(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
                return _appGroupRepository.GetMulti(x => x.Name.Contains(keyword) || x.Description.Contains(keyword));
            return _appGroupRepository.GetAll();
        }

        public new void Update(ApplicationGroup appGroup)
        {
            if (_appGroupRepository.CheckContains(x => x.Name == appGroup.Name && x.Id != appGroup.Id))
                throw new NameDuplicatedException("Tên không được trùng");
            _appGroupRepository.Update(appGroup);
        }

        public bool AddUserToGroups(IEnumerable<ApplicationUserGroup> userGroups, string userId)
        {
            _appUserGroupRepository.DeleteMulti(x => x.UserId == userId);
            foreach (var userGroup in userGroups)
            {
                _appUserGroupRepository.Add(userGroup);
            }
            return true;
        }

        public IEnumerable<ApplicationGroup> GetListGroupByUserId(string userId)
        {
            return _appGroupRepository.GetListGroupByUserId(userId);
        }

        public IEnumerable<ApplicationUser> GetListUserByGroupId(int groupId)
        {
            return _appGroupRepository.GetListUserByGroupId(groupId);
        }
    }
}
