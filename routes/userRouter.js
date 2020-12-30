const router = require('express').Router();
const userControl = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', userControl.register);
router.post('/login', userControl.login);
router.post('/logout', userControl.logout);
router.get('/refresh_token', userControl.refreshToken);
router.get('/info', auth, userControl.getUserInfo);
router.patch('/addcart', auth, userControl.addCart);

module.exports = router;
