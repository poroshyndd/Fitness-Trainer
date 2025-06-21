const { Op, fn, col } = require('sequelize');
const Training         = require('../models/Training');

exports.createTraining = async (req, res) => {
  try {
    const { type, intensity, duration, trainingDate, tags } = req.body;
    if (!type || !intensity || !duration || !trainingDate) {
      return res.status(400).json({ error: 'Wszystkie pola są obowiązkowe.' });
    }

    const newTraining = {
      type,
      intensity,
      duration,
      trainingDate,
      UserId: req.user.id,
    };

    if (tags) {
      newTraining.tags = Array.isArray(tags)
        ? tags
        : tags.split(',').map(t => t.trim());
    }

    const training = await Training.create(newTraining);
    return res.status(201).json(training);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Nie udało się utworzyć treningu.' });
  }
};

exports.getTrainings = async (req, res) => {
  try {
    const { type, intensity, completed, startDate, endDate, tags } = req.query;
    const where = { UserId: req.user.id };

    if (type)      where.type      = { [Op.iLike]: `%${type}%` };
    if (intensity) where.intensity = intensity;
    if (completed !== undefined) {
      where.completed = completed === 'true';
    }
    if (startDate || endDate) {
      where.trainingDate = {};
      if (startDate) where.trainingDate[Op.gte] = startDate;
      if (endDate)   where.trainingDate[Op.lte] = endDate;
    }
    if (tags) {
      const arr = Array.isArray(tags)
        ? tags
        : tags.split(',').map(t => t.trim());
      where.tags = { [Op.overlap]: arr };
    }

    const list = await Training.findAll({
      where,
      order: [['trainingDate', 'DESC']],
    });
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Nie udało się pobrać treningów.' });
  }
};

exports.updateTraining = async (req, res) => {
  try {
    const [count, rows] = await Training.update(req.body, {
      where: { id: req.params.id, UserId: req.user.id },
      returning: true,
    });

    if (!count) {
      return res.status(404).json({ error: 'Nie znaleziono treningu.' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Nie udało się zaktualizować treningu.' });
  }
};

exports.deleteTraining = async (req, res) => {
  try {
    const count = await Training.destroy({
      where: { id: req.params.id, UserId: req.user.id },
    });

    if (!count) {
      return res.status(404).json({ error: 'Nie znaleziono treningu.' });
    }
    return res.json({ message: 'Trening został usunięty.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Nie udało się usunąć treningu.' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = { UserId: req.user.id };

    if (startDate || endDate) {
      where.trainingDate = {};
      if (startDate) where.trainingDate[Op.gte] = startDate;
      if (endDate)   where.trainingDate[Op.lte] = endDate;
    }

    const count = await Training.count({ where });
    return res.json({ count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Nie udało się pobrać statystyk.' });
  }
};

exports.getDailyStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = { UserId: req.user.id };

    if (startDate || endDate) {
      where.trainingDate = {};
      if (startDate) where.trainingDate[Op.gte] = startDate;
      if (endDate)   where.trainingDate[Op.lte] = endDate;
    }

    const rows = await Training.findAll({
      attributes: [
        [fn('DATE', col('trainingDate')), 'day'],
        [fn('COUNT', col('id')), 'count'],
      ],
      where,
      group: [fn('DATE', col('trainingDate'))],
      order: [[fn('DATE', col('trainingDate')), 'ASC']],
    });

    const result = rows.map(r => ({
      day:   r.getDataValue('day'),
      count: parseInt(r.getDataValue('count'), 10),
    }));

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '' });
  }
};
