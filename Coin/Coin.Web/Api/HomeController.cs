using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Coin.Service;
using Coin.Web.Infrastructure.Core;
using Coin.Web.Models;
using Coin.Web.SignalR;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Newtonsoft.Json;

namespace Coin.Web.Api
{
    [RoutePrefix("api/home")]
    [System.Web.Http.Authorize]
    public class HomeController : ApiControllerBase
    {
        IErrorService _errorService;
        public HomeController(IErrorService errorService) : base(errorService)
        {
            this._errorService = errorService;
        }

        [HttpGet]
        [Route("ping")]
        public string TestMethod()
        {
            return "Hello!";
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("VerifyCaptcha")]
        public IHttpActionResult VerifyCaptcha(string encodedResponse)
        {
            var result = true;

            if (string.IsNullOrEmpty(encodedResponse))
                result = false;

            var secret = "6Lcz8jIUAAAAAOzg_a5akww595GJBUhnqP5Rz7UT";
            if (string.IsNullOrEmpty(secret))
                result = false;

            var client = new System.Net.WebClient();

            var googleReply = client.DownloadString(
                $"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={encodedResponse}");

            result = JsonConvert.DeserializeObject<RecaptchaResponse>(googleReply).Success;

            return Ok(result);
        }

        [Route("getprice")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<HttpResponseMessage> GetPrice(HttpRequestMessage request)
        {
            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync("https://api.coinmarketcap.com/v1/ticker/?limit=200");

            var context = GlobalHost.ConnectionManager.GetHubContext<ChatHub>();
            var content = response.Content.ReadAsAsync<Object>().Result;
            context.Clients.All.addNewMessageToPage(content);

            return response;
        }

        [Route("getpricefirst")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<HttpResponseMessage> GetPriceFist(HttpRequestMessage request)
        {
            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync("https://api.coinmarketcap.com/v1/ticker/?limit=200");

            return response;
        }
    }
}
