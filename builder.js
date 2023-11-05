const { build, context } = require('esbuild');
const fs = require('fs-extra');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
console.log(`isDev: ${isDev}`);

const serverParams = {
  port: 3000,
};

const scripts = fs.readdirSync('src')
  .filter((file) => file.endsWith('.tsx') || file.endsWith('.ts'))
  .map((file) => path.join('src', file));

const buildParams = {
  color: true,
  entryPoints: scripts,
  bundle: true,
  outdir: 'dist',
  sourcemap: isDev,
  minify: !isDev,
  logLevel: 'info',
  format: 'iife',
  target: 'es2021',
  loader: {
    '.tsx': 'tsx',
    '.ts': 'tsx',
  },
};

const startServer = (serverParams) => {
  const express = require('express');
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const server = app.listen(serverParams.port, () => {
    console.log(`Server listening on port ${serverParams.port}`);
  });
  app.use(require(path.join(__dirname, 'server.js')));
};

// src/index.htmlからdist/index.htmlを作成
(() => {
  fs.mkdirpSync('dist');
  const hash = require('child_process').execSync('git rev-parse HEAD').toString().trim();
  const source = fs.readFileSync('src/index.html', 'utf8');
  const result = source
    .replace('data-hash', `data-hash="${hash}"`);
  fs.writeFileSync('dist/index.html', result);
})();


// serverを起動
(async () => {
  if (isDev) {
    const ctx = await context(buildParams);
    await ctx.watch();
    startServer(serverParams);
  } else {
    // productionではbuildだけする
    await build(buildParams).catch((e) => {
      console.error(e);
    });
  }
})();
