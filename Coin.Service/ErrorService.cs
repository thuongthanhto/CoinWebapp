using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Coin.Data.Infrastructure;
using Coin.Model.Model;

namespace Coin.Service
{
    public interface IErrorService : IService<Error>
    {
        Error Create(Error error);
    }
    public class ErrorService : ServiceBase<Error>, IErrorService
    {
        private readonly IRepository<Error> _repository;
        private readonly IUnitOfWork _unitOfWork;
        public ErrorService(IRepository<Error> repository, IUnitOfWork unitOfWork) : base(repository, unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }
        public Error Create(Error error)
        {
            return _repository.Add(error);
        }
    }
}
