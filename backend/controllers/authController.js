const { validationResult } = require('express-validator');
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UniqueConstraintError } = require('sequelize');
const User   = require('../models/User');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(201).json({ token, username: user.username, role: user.role });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      return res
        .status(400)
        .json({ error: 'Użytkownik o takiej nazwie już istnieje.' });
    }
    res.status(500).json({ error: 'Rejestracja nie powiodła się.' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user)
      return res.status(400).json({ error: 'Nieprawidłowe dane logowania.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: 'Nieprawidłowe dane logowania.' });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ token, username: user.username, role: user.role });
  } catch {
    res.status(500).json({ error: 'Błąd logowania.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'username', 'role', 'createdAt']
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Nie udało się pobrać profilu.' });
  }
};

exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(req.userId);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res.status(400).json({ error: 'Stare hasło jest nieprawidłowe.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Hasło zostało pomyślnie zmienione.' });
  } catch {
    res.status(500).json({ error: 'Nie udało się zmienić hasła.' });
  }
};
