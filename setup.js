import { JSDOM } from 'jsdom';

beforeEach(() => {
  // Settings match my jest.config.js JSDOM config
  const defaultJSDOMSettings = {
    contentType: 'text/html',
    pretendToBeVisual: true,
    referrer: 'https://formswift.com/',
    url: 'https://formswift.com/',
    userAgent: 'node.js',
  };
  const defaultJSDOM = new JSDOM(
    '<!DOCTYPE html><html><head></head><body></body></html>',
    defaultJSDOMSettings
  );
  global.window = defaultJSDOM.window;
  global.document = defaultJSDOM.window.document;

  /* WORKS (also all variants without global work) */
  // delete global.window.hello
  // global.window.hello = undefined

  /* DOESN'T WORK */
  // Object.assign(...)
  // Object.defineProperty(...) (on global)
  // Iterating through the keys on global.window and deleting any that aren't in defaultJSDOM.window (error)
})