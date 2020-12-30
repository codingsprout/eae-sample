import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductItem from '../../../Utils/ProductItem';
import { GlobalState } from '../../../globalstate';
import './detail.css';

const ProductDetail = () => {
  const params = useParams();
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const [detailProduct, setDetailProduct] = useState([]);

  useEffect(() => {
    console.log('re render');
    if (params.id) {
      products.forEach((product) => {
        if (product._id === params.id) setDetailProduct(product);
      });
    }
  }, [params.id, products]);

  console.log(detailProduct);

  return (
    <>
      <div className='detail'>
        <img src={detailProduct.images?.url} alt='product detail' />
        <div className='box-detail'>
          <div className='row'>
            <h2>{detailProduct.title}</h2>
          </div>
          <span>$ {detailProduct.price}</span>
          <p>{detailProduct.description}</p>
          <p>{detailProduct.content}</p>
        </div>
      </div>

      <div>
        <h2>Related Products</h2>
        <div className='products'>
          {products.map((product) => {
            return (
              product.category === detailProduct.category && (
                <ProductItem key={product._id} product={product} />
              )
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
