import { useContext } from 'react';
import ProductItem from '../../../Utils/ProductItem';
import { GlobalState } from '../../../globalstate';
import Loading from '../../../Utils/loading/Loading';
import { Filter, LoadMore } from '../Products';
import './products.css';

const Products = () => {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [callback, setCallback] = state.productsAPI.callback;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  return (
    <>
      <Filter />
      <div className='products'>
        {products.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              token={token}
              callback={callback}
              setCallback={setCallback}
              setProducts={setProducts}
            />
          );
        })}
      </div>
      <LoadMore />
      {products.length === 0 && <Loading />}
    </>
  );
};

export default Products;
