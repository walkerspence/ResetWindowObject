import { JSDOM } from 'jsdom';

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

// Approximates a reset: https://github.com/facebook/jest/issues/1224
const sideEffects = {
  document: {
    addEventListener: {
      fn: document.addEventListener,
      refs: [],
    },
    keys: Object.keys(document),
  },
  window: {
    addEventListener: {
      fn: window.addEventListener,
      refs: [],
    },
    keys: Object.keys(window),
  },
};

/* */
// Lifecycle Hooks
// -----------------------------------------------------------------------------
beforeAll(async () => {
  // Spy addEventListener
  ['document', 'window'].forEach(obj => {
    const fn = sideEffects[obj].addEventListener.fn;
    const refs = sideEffects[obj].addEventListener.refs;

    function addEventListenerSpy(type, listener, options) {
      // Store listener reference so it can be removed during reset
      refs.push({ type, listener, options });
      // Call original window.addEventListener
      fn(type, listener, options);
    }

    // Add to default key array to prevent removal during reset
    sideEffects[obj].keys.push('addEventListener');

    // Replace addEventListener with mock
    global[obj].addEventListener = addEventListenerSpy;
  });
});

// Reset JSDOM. This attempts to remove side effects from tests, however it does
// not reset all changes made to globals like the window and document
// objects. Tests requiring a full JSDOM reset should be stored in separate
// files, which is only way to do a complete JSDOM reset with Jest.
beforeEach(async () => {
  const rootElm = document.documentElement;

  // Remove attributes on root element
  [...rootElm.attributes].forEach(attr => rootElm.removeAttribute(attr.name));

  // Remove elements (faster than setting innerHTML)
  while (rootElm.firstChild) {
    rootElm.removeChild(rootElm.firstChild);
  }

  // Remove global listeners and keys
  ['document', 'window'].forEach(obj => {
    const refs = sideEffects[obj].addEventListener.refs;

    // Listeners
    while (refs.length) {
      const { type, listener, options } = refs.pop();
      global[obj].removeEventListener(type, listener, options);
    }

    // Keys
    Object.keys(global[obj])
      .filter(key => !sideEffects[obj].keys.includes(key))
      .forEach(key => {
        delete global[obj][key];
      });
  });

  // Restore base elements
  rootElm.innerHTML = '<head></head><body></body>';
});
