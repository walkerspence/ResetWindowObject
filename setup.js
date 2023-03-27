import { JSDOM } from 'jsdom';
/* OLD ATTEMPT */
// beforeEach(() => {
//   // Settings match my jest.config.js JSDOM config
//   const defaultJSDOMSettings = {
//     contentType: 'text/html',
//     pretendToBeVisual: true,
//     referrer: 'https://formswift.com/',
//     url: 'https://formswift.com/',
//     userAgent: 'node.js',
//   };
//   const defaultJSDOM = new JSDOM(
//     '<!DOCTYPE html><html><head></head><body></body></html>',
//     defaultJSDOMSettings
//   );
//   global.window = defaultJSDOM.window;
//   global.document = defaultJSDOM.window.document;

//   /* WORKS (also all variants without global work) */
//   // delete global.window.hello
//   // global.window.hello = undefined

//   /* DOESN'T WORK */
//   // Object.assign(...)
//   // Object.defineProperty(...) (on global)
//   // Iterating through the keys on global.window and deleting any that aren't in defaultJSDOM.window (error)
// })

const originalDocumentAddEventListener = document.addEventListener

let documentEventListeners = {};
let documentKeys = [...Object.keys(document), 'addEventListener']; // for some reason addEventListener isn't in the document keys, even though document.addEventListener exists
let windowKeys = Object.keys(window);

beforeEach(() => {
  documentEventListeners = {}
  jest.spyOn(document, 'addEventListener').mockImplementation((event, cb) => {
    if (!documentEventListeners[event]) {
      documentEventListeners[event] = [];
    }
    documentEventListeners[event].push(cb);
    originalDocumentAddEventListener(event, cb)
  });
})

afterEach(() => {
  Object.keys(documentEventListeners).forEach(eventName => {
    documentEventListeners[eventName].forEach(cb => {
      document.removeEventListener(eventName, cb);
    });
  });
  /*
    I tried doing same as above for window, but somehow the document listener
    still fires when you click the window in Test 2, but not when you click the
    document. This appears to be more of a full reset.
  */
  window._sessionHistory._windowImpl._eventListeners = Object.create(
    null
  );
  Object.keys(document)
    .filter(key => !documentKeys.includes(key))
    .forEach(key => {
      delete document[key];
    });
  Object.keys(window)
    .filter(key => !windowKeys.includes(key))
    .forEach(key => {
      delete window[key];
    });
  jest.restoreAllMocks();
});
