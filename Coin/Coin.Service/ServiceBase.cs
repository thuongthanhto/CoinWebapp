using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Coin.Data.Infrastructure;

namespace Coin.Service
{
    public interface IService<T> where T : class
    {
        IEnumerable<T> GetAll();

        T GetById(int id);

        void Add(T entity);

        void Update(T appRole);

        void Delete(int id);

        void Save();
    }

    public abstract class ServiceBase<T> : IService<T> where T : class
    {
        private readonly IRepository<T> _repository;
        private readonly IUnitOfWork _unitOfWork;

        protected ServiceBase(IRepository<T> repository, IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<T> GetAll()
        {
            return _repository.GetAll();
        }

        public T GetById(int id)
        {
            return _repository.GetSingleById(id);
        }

        public void Add(T entity)
        {
            _repository.Add(entity);
        }

        public void Update(T appRole)
        {
            _repository.Update(appRole);
        }

        public void Delete(int id)
        {
            _repository.Delete(id);
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }
    }
}
