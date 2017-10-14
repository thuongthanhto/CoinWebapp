using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using Quartz;

namespace Coin.Web.Models
{
    public class Jobclass : IJob
    {
        public async void Execute(IJobExecutionContext context)
        {
            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync("http://localhost:47800/api/home/getprice");
        }
    }
}