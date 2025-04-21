const Missing = new Set();
const Module = require('module');
const orig = Module._resolveFilename;

Module._resolveFilename = function (req, parent, isMain, opts) {
  try {
    return orig(req, parent, isMain, opts);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      Missing.add(req);
      console.error('⚠ Missing:', req);
    }
    throw e;           // 元のエラーはそのまま投げる
  }
};

process.on('exit', () => {
  if (Missing.size) {
    console.log('=== Missing list ===\n' + [...Missing].join('\n'));
  }
});

const next = require('next');
const express = require('express');

const port = 3000;
const app = next({ dev: false, dir: '.' }); // 明示的に "." を指定
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use((req, res) => handle(req, res)); // all('*') より安全

  server.listen(port, err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`> Next.js ready on http://localhost:${port}`);
  });
});
