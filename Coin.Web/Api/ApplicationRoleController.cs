using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using AutoMapper;
using Coin.Common.Exceptions;
using Coin.Model.Model;
using Coin.Service;
using Coin.Web.Infrastructure.Core;
using Coin.Web.Infrastructure.Extensions;
using Coin.Web.Models;

namespace Coin.Web.Api
{
    [RoutePrefix("api/applicationRole")]
    [Authorize]
    public class ApplicationRoleController : ApiControllerBase
    {
        #region Private Variables

        private readonly IApplicationRoleService _appRoleService;

        #endregion

        #region Constructor

        public ApplicationRoleController(IErrorService errorService, IApplicationRoleService appRoleService) : base(errorService)
        {
            _appRoleService = appRoleService;
        }

        #endregion

        [Route("getall")]
        [HttpGet]
        public HttpResponseMessage GetListPaging(HttpRequestMessage request, string keyword, int page, string sortOrder,
            string sortField, int pageSize = 20)
        {
            return CreateHttpResponse(request, () =>
            {
                int totalRow = 0;
                var model = _appRoleService.GetAll(keyword);
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

                IEnumerable<ApplicationRoleViewModel> responseData = Mapper.Map<IEnumerable<ApplicationRole>, IEnumerable<ApplicationRoleViewModel>>(query.AsEnumerable());
                var paginationSet = new PaginationSet<ApplicationRoleViewModel>()
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
                var model = _appRoleService.GetAll();
                IEnumerable<ApplicationRoleViewModel> modelVm = Mapper.Map<IEnumerable<ApplicationRole>, IEnumerable<ApplicationRoleViewModel>>(model);

                response = request.CreateResponse(HttpStatusCode.OK, modelVm);

                return response;
            });
        }
        [Route("getbyid/{id}")]
        [HttpGet]
        public HttpResponseMessage GetById(HttpRequestMessage request, string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return request.CreateErrorResponse(HttpStatusCode.BadRequest, nameof(id) + " không có giá trị.");
            }
            ApplicationRole appRole = _appRoleService.GetDetail(id);
            if (appRole == null)
            {
                return request.CreateErrorResponse(HttpStatusCode.NoContent, "No group");
            }
            return request.CreateResponse(HttpStatusCode.OK, appRole);
        }

        [HttpPost]
        [Route("add")]
        public HttpResponseMessage Create(HttpRequestMessage request, ApplicationRoleViewModel applicationRoleViewModel)
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
                var newAppRole = new ApplicationRole();
                newAppRole.UpdateApplicationRole(applicationRoleViewModel);
                _appRoleService.Add(newAppRole);
                _appRoleService.Save();
                response = request.CreateResponse(HttpStatusCode.OK, applicationRoleViewModel);
            }

            return response;
        }

        [HttpPut]
        [Route("update")]
        public HttpResponseMessage Update(HttpRequestMessage request, ApplicationRoleViewModel applicationRoleViewModel)
        {
            if (ModelState.IsValid)
            {
                var appRole = _appRoleService.GetDetail(applicationRoleViewModel.Id);
                try
                {
                    appRole.UpdateApplicationRole(applicationRoleViewModel, "update");
                    _appRoleService.Update(appRole);
                    _appRoleService.Save();
                    return request.CreateResponse(HttpStatusCode.OK, appRole);
                }
                catch (NameDuplicatedException dex)
                {
                    return request.CreateErrorResponse(HttpStatusCode.BadRequest, dex.Message);
                }
            }
            else
            {
                return request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        [HttpDelete]
        [Route("delete")]
        public HttpResponseMessage Delete(HttpRequestMessage request, string id)
        {
            _appRoleService.Delete(id);
            _appRoleService.Save();
            return request.CreateResponse(HttpStatusCode.OK, id);
        }

        [Route("deletemulti")]
        [HttpDelete]
        public HttpResponseMessage DeleteMulti(HttpRequestMessage request, string checkedList)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    var listItem = new JavaScriptSerializer().Deserialize<List<string>>(checkedList);
                    foreach (var item in listItem)
                    {
                        _appRoleService.Delete(item);
                    }

                    _appRoleService.Save();

                    response = request.CreateResponse(HttpStatusCode.OK, listItem.Count);
                }

                return response;
            });
        }
    }
}
