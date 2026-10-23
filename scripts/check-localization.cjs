const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');
function bundle(host, language = 'auto') {
  return esbuild.buildSync({
    absWorkingDir: root,
    entryPoints: ['src/shared/locale/index.ts'],
    bundle: true, write: false, platform: 'node', format: 'cjs',
    external: ['vscode'],
    alias: {
      '@': path.join(root, 'src'),
      ...(host ? { '@/shared/locale/runtime': path.join(root, 'src/shared/locale/runtime.extension.ts') } : {}),
    },
    define: {
      __ECHOAPI_LANGUAGE__: JSON.stringify(language),
      'process.env.NODE_ENV': '"production"',
    },
  }).outputFiles[0].text;
}

function load(code, hostLanguage, htmlLanguage = hostLanguage, browserLanguage = 'en') {
  const module = { exports: {} };
  vm.runInNewContext(code, {
    module, exports: module.exports,
    require: id => {
      assert.equal(id, 'vscode');
      return { env: { language: hostLanguage } };
    },
    document: { documentElement: { lang: htmlLanguage } },
    navigator: { language: browserLanguage },
    console, setTimeout, clearTimeout,
  });
  return module.exports.default;
}

async function main() {
  const host = bundle(true);
  const webview = bundle(false);
  for (const [locale, expected] of [
    ['en', 'en'], ['en-US', 'en'], ['zh-CN', 'zh-cn'],
    ['zh-cn', 'zh-cn'], ['zh-Hans', 'zh-cn'], ['zh-SG', 'zh-cn'],
    ['zh-TW', 'en'], ['fr', 'en'],
  ]) {
    for (const code of [host, webview]) {
      const i18n = load(code, locale);
      assert.equal(i18n.isInitialized, true);
      assert.equal(i18n.language, expected);
      assert.equal(i18n.t('root'), i18n.getResource(expected, 'translation', 'root'));
    }
  }
  assert.equal(load(webview, 'en', 'zh-cn', 'en').language, 'zh-cn');
  assert.equal(load(webview, 'en', '', 'zh-CN').language, 'zh-cn');
  assert.equal(load(bundle(true, 'en'), 'zh-cn').language, 'en');
  assert.equal(load(bundle(false, 'zh-cn'), 'en').language, 'zh-cn');

  const manifest = require('../package.json');
  const english = require('../package.nls.json');
  const chinese = require('../package.nls.zh-cn.json');
  for (const [, key] of JSON.stringify(manifest.contributes).matchAll(/%([^%]+)%/g)) {
    assert.ok(english[key], `Missing English manifest translation: ${key}`);
    assert.ok(chinese[key], `Missing Chinese manifest translation: ${key}`);
  }
  console.log('Localization checks passed: editor language, Webview language, fallback, overrides, and manifest translations.');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
