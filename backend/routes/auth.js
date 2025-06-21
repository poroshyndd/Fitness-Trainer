const router = require('express').Router();
const { body } = require('express-validator');
const authCtrl = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post(
  '/register',
  [
    body('username')
      .isLength({ min: 3 })
      .withMessage('Nick musi mieć co najmniej 3 znaki'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Hasło musi mieć co najmniej 6 znaków.')
  ],
  authCtrl.register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username Jest wymagany '),
    body('password').notEmpty().withMessage('Password Jest wymagany')
  ],
  authCtrl.login
);

// GET /api/auth/me
router.get('/me', verifyToken, authCtrl.getMe);

// PUT /api/auth/password
router.put(
  '/password',
  verifyToken,
  [
    body('oldPassword').notEmpty().withMessage('Stare hasło jest wymagane.'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Nowe hasło musi mieć co najmniej 6 znaków.')
  ],
  authCtrl.changePassword
);

module.exports = router;
