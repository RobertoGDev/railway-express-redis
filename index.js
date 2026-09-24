const express = require('express');
const { createClient } = require('redis');

const app = express();
const port = process.env.PORT || 3000;

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Error:', err));

app.get('/', async (req, res) => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    const visits = await redisClient.incr('contador_visitas');
    res.json({ status: 'OK', visitas: visits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor activo en puerto ${port}`);
});
