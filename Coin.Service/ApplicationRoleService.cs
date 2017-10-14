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
    public interface IApplicationRoleService : IService<ApplicationRole>
    {
        IEnumerable<ApplicationRole> GetAll(string keyword);
        ApplicationRole GetDetail(string id);

        new ApplicationRole Add(ApplicationRole appRole);

        new void Update(ApplicationRole appRole);

        void Delete(string id);

        //Add roles to a sepcify group
        bool AddRolesToGroup(IEnumerable<ApplicationRoleGroup> roleGroups, int groupId);

        //Get list role by group id
        IEnumerable<ApplicationRole> GetListRoleByGroupId(int groupId);
    }

    public class ApplicationRoleService : ServiceBase<ApplicationRole>, IApplicationRoleService
    {
        private readonly IRepository<ApplicationRole> _appRoleRepository;
        private readonly IRepository<ApplicationRoleGroup> _appRoleGroupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ApplicationRoleService(IRepository<ApplicationRole> appRoleRepository, IRepository<ApplicationRoleGroup> appRoleGroupRepository,
            IUnitOfWork unitOfWork) : base(appRoleRepository, unitOfWork)
        {
            this._appRoleRepository = appRoleRepository;
            this._appRoleGroupRepository = appRoleGroupRepository;
            this._unitOfWork = unitOfWork;
        }

        public new ApplicationRole Add(ApplicationRole appRole)
        {
            return _appRoleRepository.Add(appRole);
        }
        public ApplicationRole GetDetail(string id)
        {
            return _appRoleRepository.GetSingleByCondition(x => x.Id == id);
        }

        public bool AddRolesToGroup(IEnumerable<ApplicationRoleGroup> roleGroups, int groupId)
        {
            _appRoleGroupRepository.DeleteMulti(x => x.GroupId == groupId);
            foreach (var roleGroup in roleGroups)
            {
                _appRoleGroupRepository.Add(roleGroup);
            }
            return true;
        }

        public void Delete(string id)
        {
            _appRoleRepository.DeleteMulti(x => x.Id == id);
        }

        public IEnumerable<ApplicationRole> GetAll(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
                return _appRoleRepository.GetMulti(x => x.Name.Contains(keyword) || x.Description.Contains(keyword));
            return _appRoleRepository.GetAll();
        }

        public new void Update(ApplicationRole appRole)
        {
            if (_appRoleRepository.CheckContains(x => x.Description == appRole.Description && x.Id != appRole.Id))
                throw new NameDuplicatedException("Tên không được trùng");
            _appRoleRepository.Update(appRole);
        }

        public IEnumerable<ApplicationRole> GetListRoleByGroupId(int groupId)
        {
            return _appRoleRepository.GetListRoleByGroupId(groupId);
        }
    }
}
