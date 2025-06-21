require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');

const User = require('./models/User');
const Training = require('./models/Training');
const authRoutes = require('./routes/auth');
const trainingRoutes = require('./routes/trainings');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trainings', trainingRoutes);

const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');
    await sequelize.sync({ });
    console.log('Models synced (force: true)');

    // Сидим админа
    const [admin] = await User.findOrCreate({
      where: { username: process.env.ADMIN_USER },
      defaults: {
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      }
    });
    console.log(`Admin is "${admin.username}"`);

    app.listen(PORT, () => {
      console.log('Server on port', PORT);
    });
  } catch (err) {
    console.error('Init error:', err);
  }
})();
