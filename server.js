const express = require('express');
const fetch = require('node-fetch'); //ова срањево е за fetch, ми искина нерви
const app = express();

const PORT = 3000;

// Ова го дозволува CORS за сите домени
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  next();
});

// самиот endpoint proxy за ICS
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing `url` query parameter.' });
  }

  try {
    const response = await fetch(targetUrl);

    res.set('Content-Type', response.headers.get('content-type') || 'text/calendar');
    res.set('Content-Disposition', 'inline; filename="calendar.ics"');

    response.body.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ICS file', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`ICS CORS proxy running at http://localhost:${PORT}`);
});
