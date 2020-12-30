import { useState } from 'react';
import axios from 'axios';
import BtnRender from './BtnRender';
import Loading from './loading/Loading';
import './productitem.css';

const ProductItem = ({ product, isAdmin, token, callback, setCallback }) => {
  const [loading, setLoading] = useState(false);

  const deleteProduct = async () => {
    console.log(product);
    try {
      setLoading(true);
      const deleteImage = axios.post(
        '/api/destroy',
        { public_id: product.images.public_id },
        { headers: { Authorization: token } }
      );
      const deleteProduct = axios.delete(`/api/products/${product._id}`, {
        headers: { Authorization: token },
      });

      await deleteImage;
      await deleteProduct;
      setLoading(false);
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  if (loading)
    return (
      <div className='product_card'>
        <Loading />
      </div>
    );
  return (
    <div className='product_card'>
      <img src={product.images.url} alt='product' />

      <div className='product_box'>
        <h2 title={product.title}>{product.title}</h2>
        <span>${product.price}</span>
        <p>{product.description}</p>
      </div>

      <BtnRender product={product} deleteProduct={deleteProduct} />
    </div>
  );
};

export default ProductItem;
