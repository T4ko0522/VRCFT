// apps/frontend/server.js
const next    = require('next');
const express = require('express');

const port = 3000;
const app  = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.all('*', (req, res) => handle(req, res));
  server.listen(port, err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`> Next.js ready on http://localhost:${port}`);
  });
});
