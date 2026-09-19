// Ship readable HTML even if the client JavaScript never loads.
import { createServer } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import React from 'react';
import { renderToString } from 'react-dom/server';
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const html = await readFile('dist/index.html', 'utf8');
  await writeFile('dist/index.html', html.replace('<div id="root"></div>', `<div id="root">${renderToString(React.createElement(App))}</div>`));
  console.log('Prerendered page: content remains readable without JavaScript.');
} finally { await server.close(); }
