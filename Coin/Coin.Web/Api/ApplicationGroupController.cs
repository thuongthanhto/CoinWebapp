using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Script.Serialization;
using AutoMapper;
using Coin.Model.Model;
using Coin.Service;
using Coin.Web.Infrastructure.Core;
using Coin.Web.Infrastructure.Extensions;
using Coin.Web.Models;

namespace Coin.Web.Api
{
    [RoutePrefix("api/applicationGroup")]
    [Authorize]
    public class ApplicationGroupController : ApiControllerBase
    {
        #region Private Variables

        private readonly IApplicationGroupService _appGroupService;
        private readonly IApplicationRoleService _appRoleService;
        private readonly ApplicationUserManager _userManager;

        #endregion

        #region Constructor

        public ApplicationGroupController(IErrorService errorService, IApplicationRoleService appRoleService, ApplicationUserManager userManager,
            IApplicationGroupService appGroupService) : base(errorService)
        {
            _appGroupService = appGroupService;
            _appRoleService = appRoleService;
            _userManager = userManager;
        }

        #endregion

        #region Public Methods

        // Get all data has paging for application group
        [Route("getall")]
        [HttpGet]
        public HttpResponseMessage GetAll(HttpRequestMessage request, string keyword, int page, string sortOrder,
            string sortField, int pageSize = 20)
        {

            return CreateHttpResponse(request, () =>
            {
                int totalRow = 0;
                var model = _appGroupService.GetAll(keyword);
                totalRow = model.Count();
                var query = model.OrderByDescending(x => x.Id).Skip(page * pageSize).Take(pageSize);
                if (sortField == "Id")
                {
                    if (sortOrder == "DESC")
                    {
                        query = model.OrderByDescending(x => x.Id).Skip(page * pageSize).Take(pageSize);
                    }
                    else
                    {
                        query = model.OrderBy(x => x.Id).Skip(page * pageSize).Take(pageSize);
                    }
                }
                else if (sortField == "Name")
                {
                    if (sortOrder == "DESC")
                    {
                        query = model.OrderByDescending(x => x.Name).Skip(page * pageSize).Take(pageSize);
                    }
                    else
                    {
                        query = model.OrderBy(x => x.Name).Skip(page * pageSize).Take(pageSize);
                    }
                }
                else if (sortField == "Description")
                {
                    if (sortOrder == "DESC")
                    {
                        query = model.OrderByDescending(x => x.Description).Skip(page * pageSize).Take(pageSize);
                    }
                    else
                    {
                        query = model.OrderBy(x => x.Description).Skip(page * pageSize).Take(pageSize);
                    }
                }

                IEnumerable<ApplicationGroupViewModel> responseData = Mapper.Map<IEnumerable<ApplicationGroup>, IEnumerable<ApplicationGroupViewModel>>(query.AsEnumerable());
                var paginationSet = new PaginationSet<ApplicationGroupViewModel>()
                {
                    Page = page,
                    TotalCount = totalRow,
                    TotalPages = (int)Math.Ceiling((decimal)totalRow / pageSize),
                    Items = responseData
                };

                var response = request.CreateResponse(HttpStatusCode.OK, paginationSet);

                return response;
            });
        }

        [Route("getall")]
        [HttpGet]
        public HttpResponseMessage GetAll(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var model = _appGroupService.GetAll();
                IEnumerable<ApplicationGroupViewModel> modelViewModel = Mapper.Map<IEnumerable<ApplicationGroup>, IEnumerable<ApplicationGroupViewModel>>(model);

                response = request.CreateResponse(HttpStatusCode.OK, modelViewModel);

                return response;
            });
        }

        [Route("getbyid/{id:int}")]
        [HttpGet]
        public HttpResponseMessage GetById(HttpRequestMessage request, int id)
        {
            return CreateHttpResponse(request, () =>
            {
                var model = _appGroupService.GetById(id);
                var appGroupViewModel = Mapper.Map<ApplicationGroup, ApplicationGroupViewModel>(model);
                var listRole = _appRoleService.GetListRoleByGroupId(appGroupViewModel.Id);
                appGroupViewModel.Roles = Mapper.Map<IEnumerable<ApplicationRole>, IEnumerable<ApplicationRoleViewModel>>(listRole);

                return request.CreateResponse(HttpStatusCode.OK, appGroupViewModel);
            });
        }

        [HttpPost]
        [Route("create")]
        public async Task<HttpResponseMessage> Create(HttpRequestMessage request, ApplicationGroupViewModel appGroupViewModel)
        {
            HttpResponseMessage response = null;

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Keys.SelectMany(k => ModelState[k].Errors)
                    .Select(m => m.ErrorMessage).ToArray();
                response = request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            else
            {
                var newAppGroup = new ApplicationGroup();

                newAppGroup.UpdateApplicationGroup(appGroupViewModel);
                var appGroup = _appGroupService.Add(newAppGroup);
                _appGroupService.Save();

                //save group
                var listRoleGroup = new List<ApplicationRoleGroup>();
                foreach (var role in appGroupViewModel.Roles)
                {
                    listRoleGroup.Add(new ApplicationRoleGroup()
                    {
                        GroupId = appGroup.Id,
                        RoleId = role.Id
                    });
                }
                _appRoleService.AddRolesToGroup(listRoleGroup, appGroup.Id);
                _appRoleService.Save();

                //add role to user
                var listRole = _appRoleService.GetListRoleByGroupId(appGroup.Id);
                var listUserInGroup = _appGroupService.GetListUserByGroupId(appGroup.Id);
                foreach (var user in listUserInGroup)
                {
                    var listRoleName = listRole.Select(x => x.Name).ToArray();
                    foreach (var roleName in listRoleName)
                    {
                        await _userManager.RemoveFromRoleAsync(user.Id, roleName);
                        await _userManager.AddToRoleAsync(user.Id, roleName);
                    }
                }

                response = request.CreateResponse(HttpStatusCode.Created, ModelState);
            }

            return response;
        }

        [HttpPut]
        [Route("update")]
        public async Task<HttpResponseMessage> Update(HttpRequestMessage request, ApplicationGroupViewModel appGroupViewModel)
        {
            HttpResponseMessage response = null;

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Keys.SelectMany(k => ModelState[k].Errors)
                    .Select(m => m.ErrorMessage).ToArray();
                response = request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            else
            {
                var appGroup = _appGroupService.GetById(appGroupViewModel.Id);
                appGroup.UpdateApplicationGroup(appGroupViewModel);
                _appGroupService.Update(appGroup);
                _appGroupService.Save();

                //save group
                var listRoleGroup = new List<ApplicationRoleGroup>();
                foreach (var role in appGroupViewModel.Roles)
                {
                    listRoleGroup.Add(new ApplicationRoleGroup()
                    {
                        GroupId = appGroup.Id,
                        RoleId = role.Id
                    });
                }
                _appRoleService.AddRolesToGroup(listRoleGroup, appGroup.Id);
                _appRoleService.Save();

                //add role to user
                var listRole = _appRoleService.GetListRoleByGroupId(appGroup.Id);
                var listUserInGroup = _appGroupService.GetListUserByGroupId(appGroup.Id);
                foreach (var user in listUserInGroup)
                {
                    var listRoleName = listRole.Select(x => x.Name).ToArray();
                    foreach (var roleName in listRoleName)
                    {
                        await _userManager.RemoveFromRoleAsync(user.Id, roleName);
                        await _userManager.AddToRoleAsync(user.Id, roleName);
                    }
                }
                return request.CreateResponse(HttpStatusCode.OK, ModelState);
            }

            return response;
        }

        [HttpDelete]
        [Route("delete")]
        public HttpResponseMessage Delete(HttpRequestMessage request, int id)
        {
            return CreateHttpResponse(request, () =>
            {
                _appGroupService.Delete(id);
                _appGroupService.Save();

                HttpResponseMessage response = request.CreateResponse(HttpStatusCode.OK, id);
                return response;
            });
        }

        [Route("deletemulti")]
        [HttpDelete]
        public HttpResponseMessage DeleteMulti(HttpRequestMessage request, string checkedList)
        {
            return CreateHttpResponse(request, () =>
            {
                var listAppGroup = new JavaScriptSerializer().Deserialize<List<int>>(checkedList);
                foreach (var appGroup in listAppGroup)
                {
                    _appGroupService.Delete(appGroup);
                }

                _appGroupService.Save();

                var response = request.CreateResponse(HttpStatusCode.OK, listAppGroup.Count);

                return response;
            });
        }

        #endregion
    }
}
