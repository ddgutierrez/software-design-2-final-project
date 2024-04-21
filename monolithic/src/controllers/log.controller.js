const Log = require('../models/log.model');

async function createLog(req, res) {
  const { action } = req.body;
  try {
    const newLog = new Log({ action });
    await newLog.save();
    res.status(201).json(newLog);
    console.log('log added');
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getLogs(req, res) {
    const { action, createdAt } = req.query;
  try {
    const logs = await Log.find();
    if (logs === null || logs.length === 0) {
      res.status(404).json({ error: 'Logs not found' });
    } else {
      res.status(200).json(logs);
      console.log('logs displayed');
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { createLog, getLogs };
