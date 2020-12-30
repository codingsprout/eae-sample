import { useState, useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../../Utils/loading/Loading';
import { GlobalState } from '../../../globalstate';
import './style.css';

const initialState = {
  product_id: '',
  title: '',
  price: 0,
  description: 'random filler',
  content: 'random filler',
  category: '',
  _id: '',
};

const CreateProduct = () => {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [products] = state.productsAPI.products;
  const [callback, setCallback] = state.productsAPI.callback;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const [product, setProduct] = useState(initialState);
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [onEdit, setOnEdit] = useState(false);

  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      setOnEdit(true);
      products.forEach((product) => {
        if (product._id === params.id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages(false);
    }
  }, [params.id, products]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert('No admin authorization');
      const file = e.target.files[0];

      if (!file) return alert('File does not exist');

      if (file.size > 1024 * 1024) return alert('Size is too large!');

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return alert('File format is incorrect');

      let formData = new FormData();
      formData.append('file', file);
      setLoading(true);

      const res = await axios.post('/api/upload', formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: token,
        },
      });

      setLoading(false);
      setImages(res.data);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      if (!isAdmin) return alert('You are not admin!');
      setLoading(true);

      await axios.post(
        '/api/destroy',
        {
          public_id: images.public_id,
        },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isAdmin) return alert('You are not admin!');

      if (!images) return alert('No images uploaded');

      if (onEdit) {
        await axios.put(
          `/api/products/${product._id}`,
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
      } else {
        await axios.post(
          '/api/products',
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
      }

      setCallback(!callback);
      history.push('/');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const styleUpload = {
    display: images ? 'block' : 'none',
  };

  return (
    <div className='create_product'>
      <div className='upload'>
        <input type='file' name='file' id='file_up' onChange={handleUpload} />
        {loading ? (
          <div id='file_img'>
            <Loading />
          </div>
        ) : (
          <div id='file_img' style={styleUpload}>
            <img src={images ? images.url : ''} alt='' />
            <span onClick={handleDelete}>X</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className='row'>
          <label htmlFor='product_id'>Product ID</label>
          <input
            type='text'
            name='product_id'
            id='product_id'
            required
            value={product.product_id}
            onChange={handleChangeInput}
            disabled={onEdit}
          />
        </div>

        <div className='row'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            name='title'
            id='title'
            required
            value={product.title}
            onChange={handleChangeInput}
          />
        </div>

        <div className='row'>
          <label htmlFor='price'>Price</label>
          <input
            type='number'
            name='price'
            id='price'
            required
            value={product.price}
            onChange={handleChangeInput}
          />
        </div>

        <div className='row'>
          <label htmlFor='description'>Description</label>
          <textarea
            type='text'
            name='description'
            id='description'
            rows='5'
            required
            value={product.description}
            onChange={handleChangeInput}
          />
        </div>

        <div className='row'>
          <label htmlFor='content'>Content</label>
          <textarea
            type='text'
            name='content'
            id='content'
            rows='7'
            required
            value={product.content}
            onChange={handleChangeInput}
          />
        </div>

        <div className='row'>
          <label htmlFor='categories'>Categories: </label>
          <select
            name='category'
            value={product.category}
            onChange={handleChangeInput}
          >
            <option value=''>Please select a category</option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type='submit'>{onEdit ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default CreateProduct;
