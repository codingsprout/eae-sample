const router = require('express').Router();
const productControl = require('../controllers/productController');

router
  .route('/products')
  .get(productControl.getProducts)
  .post(productControl.createProducts);

router
  .route('/products/:id')
  .delete(productControl.deleteProducts)
  .put(productControl.updateProducts);

module.exports = router;
