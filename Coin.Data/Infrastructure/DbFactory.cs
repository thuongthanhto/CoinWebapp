using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coin.Data.Infrastructure
{
    public interface IDbFactory : IDisposable
    {
        CoinDbContext Init();
    }

    public class DbFactory : Disposable, IDbFactory
    {
        private CoinDbContext _dbContext;

        public CoinDbContext Init()
        {
            return _dbContext ?? (_dbContext = new CoinDbContext());
        }

        protected override void DisposeCore()
        {
            _dbContext?.Dispose();
        }
    }
}
