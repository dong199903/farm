module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1652148901788, function(require, module, exports) {
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./define.js');Object.defineProperty(exports, 'define', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./parent.js');Object.defineProperty(exports, 'parent', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./children.js');Object.defineProperty(exports, 'children', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./store.js');Object.defineProperty(exports, 'store', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./router.js');Object.defineProperty(exports, 'router', { enumerable: true, configurable: true, get: function() { return __TEMP__.default; } });

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./template/index.js');Object.defineProperty(exports, 'html', { enumerable: true, configurable: true, get: function() { return __TEMP__.html; } });Object.defineProperty(exports, 'svg', { enumerable: true, configurable: true, get: function() { return __TEMP__.svg; } });

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var __TEMP__ = require('./utils.js');Object.defineProperty(exports, 'dispatch', { enumerable: true, configurable: true, get: function() { return __TEMP__.dispatch; } });

}, function(modId) {var map = {"./define.js":1652148901789,"./parent.js":1652148901794,"./children.js":1652148901795,"./store.js":1652148901796,"./router.js":1652148901797,"./template/index.js":1652148901798,"./utils.js":1652148901793}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901789, function(require, module, exports) {
var __TEMP__ = require('./global.js');var global = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./cache.js');var cache = __REQUIRE_WILDCARD__(__TEMP__);
var __TEMP__ = require('./utils.js');var deferred = __TEMP__['deferred'];var camelToDash = __TEMP__['camelToDash'];var walkInShadow = __TEMP__['walkInShadow'];

const propsMap = new WeakMap();
const disconnects = new WeakMap();

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var callbacksMap = exports.callbacksMap = new WeakMap();

class HybridsRootElement extends global.HTMLElement {
  constructor() {
    super();

    const props = propsMap.get(this.constructor);

    for (let index = 0; index < props.length; index += 1) {
      const key = props[index];
      if (hasOwnProperty.call(this, key)) {
        const value = this[key];
        delete this[key];
        this[key] = value;
      }
    }

    cache.suspend(this);
  }

  connectedCallback() {
    cache.unsuspend(this);

    const callbacks = callbacksMap.get(this.constructor);
    const list = [];

    for (let index = 0; index < callbacks.length; index += 1) {
      const cb = callbacks[index](this);
      if (cb) list.push(cb);
    }

    disconnects.set(this, list);
  }

  disconnectedCallback() {
    cache.suspend(this);

    const list = disconnects.get(this);
    for (let index = 0; index < list.length; index += 1) {
      list[index]();
    }
  }
}

function render(fn, useShadow) {
  return {
    get: useShadow
      ? (host) => {
          const updateDOM = fn(host);
          const target =
            host.shadowRoot ||
            host.attachShadow({
              mode: "open",
              delegatesFocus: fn.delegatesFocus || false,
            });
          return () => {
            updateDOM(host, target);
            return target;
          };
        }
      : (host) => {
          const updateDOM = fn(host);
          return () => {
            updateDOM(host, host);
            return host;
          };
        },
    observe(host, flush) { flush(); }, // prettier-ignore
  };
}

const transforms = {
  string: String,
  number: Number,
  boolean: Boolean,
  undefined: (v) => v,
};

function property(key, desc) {
  const type = typeof desc.value;
  const transform = transforms[type];

  if (!transform) {
    throw TypeError(
      `Invalid default value for '${key}' property - it must be a string, number, boolean or undefined: ${type}`,
    );
  }

  const defaultValue = desc.value;
  const attrName = camelToDash(key);

  const setAttr = (host, value) => {
    if (
      (!value && value !== 0) ||
      (typeof value === "object" && value.toString() === undefined)
    ) {
      host.removeAttribute(attrName);
    } else {
      host.setAttribute(attrName, type === "boolean" ? "" : value);
    }
    return value;
  };

  return {
    get: (host, value) => {
      if (value === undefined) {
        if (host.hasAttribute(attrName)) {
          value = transform(type === "boolean" || host.getAttribute(attrName));
        } else {
          return defaultValue;
        }
      }
      return value;
    },
    set:
      type !== "undefined"
        ? (host, value) => setAttr(host, transform(value))
        : (host, value) => value,
    connect:
      type !== "undefined"
        ? (host, _, invalidate) => {
            if (!host.hasAttribute(attrName) && host[key] === defaultValue) {
              setAttr(host, defaultValue);
            }

            return desc.connect && desc.connect(host, _, invalidate);
          }
        : desc.connect,
    observe: desc.observe,
  };
}

function compile(hybrids, HybridsElement) {
  if (HybridsElement) {
    if (hybrids === HybridsElement.hybrids) return HybridsElement;
    propsMap.get(HybridsElement).forEach((key) => {
      delete HybridsElement.prototype[key];
    });
  } else {
    HybridsElement = class extends HybridsRootElement {};
  }

  HybridsElement.hybrids = hybrids;

  const callbacks = [];
  const props = Object.keys(hybrids);

  callbacksMap.set(HybridsElement, callbacks);
  propsMap.set(HybridsElement, props);

  props.forEach((key) => {
    if (key === "tag") return;

    let desc = hybrids[key];
    const type = typeof desc;

    if (type === "function") {
      if (key === "render") {
        desc = render(desc, true);
      } else if (key === "content") {
        desc = render(desc);
      } else {
        desc = { get: desc };
      }
    } else if (type !== "object" || desc === null) {
      desc = { value: desc };
    } else if (desc.set) {
      const attrName = camelToDash(key);
      const get = desc.get || ((host, value) => value);
      desc.get = (host, value) => {
        if (value === undefined) {
          value = desc.set(host, host.getAttribute(attrName) || value);
        }
        return get(host, value);
      };
    }

    if (hasOwnProperty.call(desc, "value")) {
      desc = property(key, desc);
    } else if (!desc.get) {
      throw TypeError(
        `Invalid descriptor for '${key}' property - it must contain 'value' or 'get' option`,
      );
    }

    Object.defineProperty(HybridsElement.prototype, key, {
      get: function get() {
        return cache.get(this, key, desc.get);
      },
      set:
        desc.set &&
        function set(newValue) {
          cache.set(this, key, desc.set, newValue);
        },
      enumerable: true,
      configurable: true,
    });

    if (desc.observe) {
      callbacks.unshift((host) =>
        cache.observe(host, key, desc.get, desc.observe),
      );
    }

    if (desc.connect) {
      callbacks.push((host) => {
        function invalidate(options) {
          cache.invalidate(host, key, {
            force: typeof options === "object" && options.force === true,
          });
        }
        return desc.connect(host, key, invalidate);
      });
    }
  });

  return HybridsElement;
}

const updateQueue = new Map();
function update(HybridsElement) {
  if (!updateQueue.size) {
    deferred.then(() => {
      walkInShadow(global.document.body, (node) => {
        if (updateQueue.has(node.constructor)) {
          const prevHybrids = updateQueue.get(node.constructor);
          const hybrids = node.constructor.hybrids;
          node.disconnectedCallback();

          Object.keys(hybrids).forEach((key) => {
            const type = typeof hybrids[key];
            const clearValue =
              type !== "object" &&
              type !== "function" &&
              hybrids[key] !== prevHybrids[key];
            cache.invalidate(node, key, { clearValue });
          });

          node.connectedCallback();
        }
      });
      updateQueue.clear();
    });
  }
  updateQueue.set(HybridsElement, HybridsElement.hybrids);
}

function define(hybrids) {
  if (!hybrids.tag) {
    throw TypeError(
      "Error while defining hybrids: 'tag' property with dashed tag name is required",
    );
  }

  const HybridsElement = global.customElements.get(hybrids.tag);

  if (HybridsElement) {
    if (HybridsElement.hybrids) {
      update(HybridsElement);
      compile(hybrids, HybridsElement);

      return Object.freeze(hybrids);
    }

    throw TypeError(
      `Custom element with '${hybrids.tag}' tag name already defined outside of the hybrids context`,
    );
  }

  global.customElements.define(hybrids.tag, compile(hybrids));
  return Object.freeze(hybrids);
}

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = Object.freeze(
  Object.assign(define, { compile: (hybrids) => compile(hybrids) }),
);

}, function(modId) { var map = {"./global.js":1652148901790,"./cache.js":1652148901791,"./utils.js":1652148901793}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901790, function(require, module, exports) {
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function polyfill(global) {
  global = Object.create(global);

  if (!("requestAnimationFrame" in global)) {
    Object.defineProperty(global, "requestAnimationFrame", {
      value: function requestAnimationFrame(callback) {
        return setTimeout(callback, 0);
      },
    });
  }

  if (!("HTMLElement" in global)) {
    Object.defineProperty(global, "HTMLElement", {
      value: class HTMLElement {
        constructor() {
          throw Error(
            "Current context does not support defining custom elements",
          );
        }
      },
    });
  }

  return global;
};exports.polyfill = polyfill

/* istanbul ignore else */
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = typeof window === "object" ? window : polyfill(globalThis);

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901791, function(require, module, exports) {
var __TEMP__ = require('./global.js');var global = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./emitter.js');var emitter = __REQUIRE_WILDCARD__(__TEMP__);

const entries = new WeakMap();
const suspense = new WeakSet();

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function getEntry(target, key) {
  let targetMap = entries.get(target);
  if (!targetMap) {
    targetMap = new Map();
    entries.set(target, targetMap);
  }

  let entry = targetMap.get(key);

  if (!entry) {
    entry = {
      target,
      key,
      value: undefined,
      lastValue: undefined,
      contexts: new Set(),
      deps: new Set(),
      state: 0,
      depState: 0,
      resolved: false,
    };
    targetMap.set(key, entry);
  }

  return entry;
};exports.getEntry = getEntry

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function getEntries(target) {
  const result = [];
  const targetMap = entries.get(target);
  if (targetMap) {
    targetMap.forEach((entry) => {
      result.push(entry);
    });
  }
  return result;
};exports.getEntries = getEntries

function cleanContexts(entry) {
  entry.contexts.forEach((contextEntry) => {
    if (suspense.has(contextEntry.target)) {
      Object.assign(contextEntry, {
        depState: 0,
        resolved: false,
      });

      entry.contexts.delete(contextEntry);

      cleanContexts(contextEntry);
    }
  });
}

function dispatchDeep(entry) {
  entry.resolved = false;

  if (!suspense.has(entry.target)) {
    emitter.dispatch(entry);
  }

  cleanContexts(entry);
  entry.contexts.forEach(dispatchDeep);
}

let context = null;
const contexts = new Set();
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function get(target, key, getter) {
  const entry = getEntry(target, key);

  if (context && !suspense.has(context.target)) {
    context.deps.add(entry);
    entry.contexts.add(context);
  }

  if (!suspense.has(target)) {
    cleanContexts(entry);

    if (entry.resolved) {
      return entry.value;
    }

    if (entry.depState > entry.state) {
      let depState = entry.state;

      for (const depEntry of entry.deps) {
        // eslint-disable-next-line no-unused-expressions
        depEntry.target[depEntry.key];

        if (!depEntry.resolved) {
          depState = false;
          break;
        }

        depState += depEntry.state;
      }

      if (depState && depState === entry.depState) {
        entry.resolved = true;
        return entry.value;
      }
    }
  }

  const lastContext = context;

  try {
    if (contexts.has(entry)) {
      throw Error(`Circular get invocation is forbidden: '${key}'`);
    }

    entry.deps.forEach((depEntry) => {
      depEntry.contexts.delete(entry);
    });

    entry.deps.clear();
    context = entry;
    contexts.add(entry);

    const nextValue = getter(target, entry.value);

    context = lastContext;

    if (nextValue !== entry.value) {
      entry.value = nextValue;
      entry.state += 1;
    }

    let depState = entry.state;
    entry.deps.forEach((depEntry) => {
      depState += depEntry.state;
    });

    entry.depState = depState;
    entry.resolved = !suspense.has(target);

    contexts.delete(entry);
  } catch (e) {
    context = lastContext;
    contexts.delete(entry);

    entry.resolved = false;

    if (context && !suspense.has(context)) {
      context.deps.delete(entry);
      entry.contexts.delete(context);
    }

    throw e;
  }

  return entry.value;
};exports.get = get

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function set(target, key, setter, value) {
  const entry = getEntry(target, key);
  const newValue = setter(target, value, entry.value);

  if (newValue !== entry.value) {
    entry.value = newValue;
    entry.state += 1;
    entry.depState = 0;

    dispatchDeep(entry);
  }
};exports.set = set

const gcList = new Set();
function deleteEntry(entry) {
  if (!gcList.size) {
    global.requestAnimationFrame(() => {
      gcList.forEach((e) => {
        if (e.contexts.size === 0) {
          e.deps.forEach((depEntry) => {
            depEntry.contexts.delete(e);
          });

          const targetMap = entries.get(e.target);
          targetMap.delete(e.key);
        }
      });
      gcList.clear();
    });
  }

  gcList.add(entry);
}

function invalidateEntry(entry, options) {
  entry.depState = 0;
  dispatchDeep(entry);

  if (options.clearValue) {
    entry.value = undefined;
    entry.lastValue = undefined;
  }

  if (options.deleteEntry) {
    deleteEntry(entry);
  }

  if (options.force) {
    entry.state += 1;
  }
}

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function invalidate(target, key, options = {}) {
  if (contexts.size) {
    throw Error(
      `Invalidating property in chain of get calls is forbidden: '${key}'`,
    );
  }

  const entry = getEntry(target, key);
  invalidateEntry(entry, options);
};exports.invalidate = invalidate

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function invalidateAll(target, options = {}) {
  if (contexts.size) {
    throw Error(
      "Invalidating all properties in chain of get calls is forbidden",
    );
  }

  const targetMap = entries.get(target);
  if (targetMap) {
    targetMap.forEach((entry) => {
      invalidateEntry(entry, options);
    });
  }
};exports.invalidateAll = invalidateAll

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function observe(target, key, getter, fn) {
  const entry = getEntry(target, key);

  return emitter.subscribe(entry, () => {
    const value = get(target, key, getter);

    if (value !== entry.lastValue) {
      fn(target, value, entry.lastValue);
      entry.lastValue = value;
    }
  });
};exports.observe = observe

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function suspend(target) {
  suspense.add(target);
};exports.suspend = suspend

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function unsuspend(target) {
  suspense.delete(target);
};exports.unsuspend = unsuspend

}, function(modId) { var map = {"./global.js":1652148901790,"./emitter.js":1652148901792}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901792, function(require, module, exports) {
var __TEMP__ = require('./global.js');var global = __REQUIRE_DEFAULT__(__TEMP__);

const callbacks = new WeakMap();
const queue = new Set();

function execute() {
  try {
    queue.forEach((target) => {
      try {
        callbacks.get(target)();
        queue.delete(target);
      } catch (e) {
        queue.delete(target);
        throw e;
      }
    });
  } catch (e) {
    if (queue.size) execute();
    throw e;
  }
}

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function dispatch(target) {
  if (callbacks.has(target)) {
    if (!queue.size) {
      global.requestAnimationFrame(execute);
    }
    queue.add(target);
  }
};exports.dispatch = dispatch

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function subscribe(target, cb) {
  callbacks.set(target, cb);
  dispatch(target);

  return function unsubscribe() {
    queue.delete(target);
    callbacks.delete(target);
  };
};exports.subscribe = subscribe

}, function(modId) { var map = {"./global.js":1652148901790}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901793, function(require, module, exports) {
var __TEMP__ = require('./global.js');var global = __REQUIRE_DEFAULT__(__TEMP__);

const camelToDashMap = new Map();
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function camelToDash(str) {
  let result = camelToDashMap.get(str);
  if (result === undefined) {
    result = str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    camelToDashMap.set(str, result);
  }
  return result;
};exports.camelToDash = camelToDash

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function dispatch(host, eventType, options = {}) {
  return host.dispatchEvent(
    new global.CustomEvent(eventType, { bubbles: false, ...options }),
  );
};exports.dispatch = dispatch

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function shadyCSS(fn, fallback) {
  const shady = global.ShadyCSS;

  /* istanbul ignore next */
  if (shady && !shady.nativeShadow) {
    return fn(shady);
  }

  return fallback;
};exports.shadyCSS = shadyCSS

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function stringifyElement(target) {
  return `<${String(target.tagName).toLowerCase()}>`;
};exports.stringifyElement = stringifyElement

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function walkInShadow(target, cb) {
  if (target.nodeType === global.Node.ELEMENT_NODE) {
    cb(target);

    if (target.shadowRoot) {
      walkInShadow(target.shadowRoot, cb);
    }
  }

  const walker = global.document.createTreeWalker(
    target,
    global.NodeFilter.SHOW_ELEMENT,
    null,
    false,
  );

  while (walker.nextNode()) {
    const el = walker.currentNode;
    cb(el);
    if (el.shadowRoot) {
      walkInShadow(el.shadowRoot, cb);
    }
  }
};exports.walkInShadow = walkInShadow

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var deferred = exports.deferred = Promise.resolve();
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var storePointer = exports.storePointer = new WeakMap();
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var probablyDevMode = exports.probablyDevMode = walkInShadow.name === "walkInShadow";

}, function(modId) { var map = {"./global.js":1652148901790}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901794, function(require, module, exports) {
function walk(node, fn) {
  let parentElement = node.parentElement || node.parentNode.host;

  while (parentElement) {
    const hybrids = parentElement.constructor.hybrids;

    if (hybrids && fn(hybrids, node)) {
      return parentElement;
    }

    parentElement =
      parentElement.parentElement ||
      (parentElement.parentNode && parentElement.parentNode.host);
  }

  return parentElement || null;
}

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function parent(hybridsOrFn) {
  const fn =
    typeof hybridsOrFn === "function"
      ? hybridsOrFn
      : (hybrids) => hybrids === hybridsOrFn;
  return {
    get: (host) => walk(host, fn),
    connect(host, key, invalidate) {
      const target = host[key];
      if (target) {
        return invalidate;
      }
      return false;
    },
  };
};exports.default = parent

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901795, function(require, module, exports) {
var __TEMP__ = require('./global.js');var global = __REQUIRE_DEFAULT__(__TEMP__);

function walk(node, fn, options, items = [], host = node) {
  Array.from(node.children).forEach((child) => {
    const hybrids = child.constructor.hybrids;
    if (hybrids && fn(hybrids, host)) {
      items.push(child);
      if (options.deep && options.nested) {
        walk(child, fn, options, items, host);
      }
    } else if (options.deep) {
      walk(child, fn, options, items, host);
    }
  });

  return items;
}

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function children(
  hybridsOrFn,
  options = { deep: false, nested: false },
) {
  const fn =
    typeof hybridsOrFn === "function"
      ? hybridsOrFn
      : (hybrids) => hybrids === hybridsOrFn;

  return {
    get: (host) => walk(host, fn, options),
    connect(host, key, invalidate) {
      const observer = new global.MutationObserver(invalidate);

      observer.observe(host, {
        childList: true,
        subtree: !!options.deep,
      });

      return () => {
        observer.disconnect();
      };
    },
  };
};exports.default = children

}, function(modId) { var map = {"./global.js":1652148901790}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901796, function(require, module, exports) {
/* eslint-disable no-use-before-define */
var __TEMP__ = require('./global.js');var global = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./cache.js');var cache = __REQUIRE_WILDCARD__(__TEMP__);
var __TEMP__ = require('./utils.js');var storePointer = __TEMP__['storePointer'];

const connect = Symbol("store.connect");

const definitions = new WeakMap();
const stales = new WeakMap();
const refs = new WeakSet();

function resolve(config, model, lastModel) {
  if (lastModel) {
    definitions.set(lastModel, null);
    stales.set(lastModel, model);
  }

  definitions.set(model, config);

  if (config.storage.observe) {
    const modelValue = model && config.isInstance(model) ? model : null;

    const lastModelValue =
      lastModel && config.isInstance(lastModel) ? lastModel : null;

    if (modelValue !== lastModelValue) {
      config.storage.observe(modelValue, lastModelValue);
    }
  }

  return model;
}

function shallowEqual(target, compare) {
  return Object.keys(target).every((key) => target[key] === compare[key]);
}

function resolveWithInvalidate(config, model, lastModel) {
  resolve(config, model, lastModel);

  if (
    config.invalidate &&
    (!lastModel ||
      error(model) ||
      !config.isInstance(lastModel) ||
      !shallowEqual(model, lastModel))
  ) {
    config.invalidate();
  }

  return model;
}

function syncCache(config, id, model, invalidate = true) {
  cache.set(config, id, invalidate ? resolveWithInvalidate : resolve, model);
  return model;
}

let currentTimestamp;
function getCurrentTimestamp() {
  if (!currentTimestamp) {
    currentTimestamp = Date.now();
    global.requestAnimationFrame(() => {
      currentTimestamp = undefined;
    });
  }
  return currentTimestamp;
}

const timestamps = new WeakMap();

function getTimestamp(model) {
  let timestamp = timestamps.get(model);

  if (!timestamp) {
    timestamp = getCurrentTimestamp();
    timestamps.set(model, timestamp);
  }

  return timestamp;
}

function setTimestamp(model) {
  timestamps.set(model, getCurrentTimestamp());
  return model;
}

function invalidateTimestamp(model) {
  timestamps.set(model, 1);
  return model;
}

function hashCode(str) {
  return global.btoa(
    Array.from(str).reduce(
      // eslint-disable-next-line no-bitwise
      (s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0,
      0,
    ),
  );
}

const offlinePrefix = "hybrids:store:cache";
const offlineKeys = {};

let clearPromise;
function setupOfflineKey(config, threshold) {
  const key = `${offlinePrefix}:${hashCode(JSON.stringify(config.model))}`;

  offlineKeys[key] = getCurrentTimestamp() + threshold;

  if (!clearPromise) {
    clearPromise = Promise.resolve().then(() => {
      const previousKeys =
        JSON.parse(global.localStorage.getItem(offlinePrefix)) || {};
      const timestamp = getCurrentTimestamp();

      Object.keys(previousKeys).forEach((k) => {
        /* istanbul ignore next */
        if (!offlineKeys[k] && previousKeys[k] < timestamp) {
          global.localStorage.removeItem(k);
          delete previousKeys[k];
        }
      });

      global.localStorage.setItem(
        offlinePrefix,
        JSON.stringify({ ...previousKeys, ...offlineKeys }),
      );
      clearPromise = null;
    });
  }

  return key;
}

const JSON_LIKE_REGEX = /^\{.+\}$/;
function setupStorage(config, options) {
  if (typeof options === "function") options = { get: options };

  const result = {
    cache: true,
    loose: false,
    ...options,
  };

  if (result.observe) {
    const fn = result.observe;
    if (typeof fn !== "function") {
      throw TypeError(
        `Storage 'observe' property must be a function: ${typeof result.observe}`,
      );
    }
    result.observe = (model, lastModel) => {
      try {
        let id = lastModel ? lastModel.id : model.id;
        if (JSON_LIKE_REGEX.test(id)) {
          try {
            id = JSON.parse(id);
            // istanbul ignore next
          } catch (e) {} // eslint-disable-line no-empty
        }

        fn(id, model, lastModel);
      } catch (e) {
        console.error(e);
      }
    };
  }

  if (result.cache === false || result.cache === 0) {
    result.validate = (cachedModel) =>
      !cachedModel || getTimestamp(cachedModel) === getCurrentTimestamp();
  } else if (typeof result.cache === "number") {
    result.validate = (cachedModel) =>
      !cachedModel ||
      getTimestamp(cachedModel) + result.cache > getCurrentTimestamp();
  } else {
    if (result.cache !== true) {
      throw TypeError(
        `Storage 'cache' property must be a boolean or number: ${typeof result.cache}`,
      );
    }
    result.validate = (cachedModel) => getTimestamp(cachedModel) !== 1;
  }

  if (!result.get) {
    result.get = (id) => {
      throw notFoundError(stringifyId(id));
    };
  }

  if (result.offline) {
    const isBool = result.offline === true;
    const threshold = isBool
      ? 1000 * 60 * 60 * 24 * 30 /* 30 days */
      : result.offline;
    const offlineKey = setupOfflineKey(config, threshold);

    try {
      const items = JSON.parse(global.localStorage.getItem(offlineKey)) || {};

      let flush;

      result.offline = Object.freeze({
        key: offlineKey,
        threshold,
        get: isBool
          ? (id) => {
              if (hasOwnProperty.call(items, id)) {
                return JSON.parse(items[id][1]);
              }
              return null;
            }
          : (id) => {
              if (hasOwnProperty.call(items, id)) {
                const item = items[id];
                if (item[0] + threshold < getCurrentTimestamp()) {
                  delete items[id];
                  return null;
                }
                return JSON.parse(item[1]);
              }
              return null;
            },
        set(id, values) {
          if (values) {
            items[id] = [
              getCurrentTimestamp(),
              JSON.stringify(values, function replacer(key, value) {
                if (value === this[""]) return value;

                if (value && typeof value === "object") {
                  const valueConfig = definitions.get(value);
                  if (valueConfig === config && value.id === id) {
                    return String(value);
                  }

                  const offline = valueConfig && valueConfig.storage.offline;
                  if (offline) {
                    if (valueConfig.list) {
                      return value.map((model) => {
                        configs
                          .get(valueConfig.model)
                          .storage.offline.set(model.id, model);
                        return `${model}`;
                      });
                    }

                    valueConfig.storage.offline.set(value.id, value);
                    return `${value}`;
                  }
                }

                return value;
              }),
            ];
          } else {
            delete items[id];
          }

          if (!flush) {
            flush = Promise.resolve().then(() => {
              const timestamp = getCurrentTimestamp();

              Object.keys(items).forEach((key) => {
                if (items[key][0] + threshold < timestamp) {
                  delete items[key];
                }
              });

              global.localStorage.setItem(offlineKey, JSON.stringify(items));
              flush = null;
            });
          }

          return values;
        },
      });
    } catch (e) /* istanbul ignore next */ {
      console.error(e);
      result.offline = false;
    }
  }

  return Object.freeze(result);
}

function memoryStorage(config) {
  return {
    get: config.enumerable ? () => {} : () => config.create({}),
    set: config.enumerable
      ? (id, values) => values
      : (id, values) => (values === null ? { id } : values),
    list:
      config.enumerable &&
      function list(id) {
        if (id) {
          throw TypeError(`Memory-based model definition does not support id`);
        }

        return cache.getEntries(config).reduce((acc, { key, value }) => {
          if (key === config) return acc;
          if (value && !error(value)) acc.push(key);
          return acc;
        }, []);
      },
    loose: true,
  };
}

function bootstrap(Model, nested) {
  if (Array.isArray(Model)) {
    return setupListModel(Model[0], nested);
  }
  return setupModel(Model, nested);
}

function getTypeConstructor(type, key) {
  switch (type) {
    case "string":
      return (v) => (v !== undefined && v !== null ? String(v) : "");
    case "number":
      return Number;
    case "boolean":
      return Boolean;
    default:
      throw TypeError(
        `The value of the '${key}' must be a string, number or boolean: ${type}`,
      );
  }
}

const stateSetter = (_, value, lastValue) => {
  if (value.state === "error") {
    return { state: "error", error: value.value };
  }

  value.error = !!lastValue && lastValue.error;

  return value;
};
function setModelState(model, state, value = model) {
  cache.set(model, "state", stateSetter, { state, value });
  return model;
}

const stateGetter = (
  model,
  v = { state: "ready", value: model, error: false },
) => v;
function getModelState(model) {
  return cache.get(model, "state", stateGetter);
}

// UUID v4 generator thanks to https://gist.github.com/jed/982883
function uuid(temp) {
  return temp
    ? // eslint-disable-next-line no-bitwise, no-mixed-operators
      (temp ^ ((Math.random() * 16) >> (temp / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}

function ref(fn) {
  if (typeof fn !== "function") {
    throw TypeError(`The first argument must be a function: ${typeof fn}`);
  }

  refs.add(fn);
  return fn;
}

const validationMap = new WeakMap();
function resolveKey(Model, key, config) {
  let defaultValue = config.model[key];
  if (refs.has(defaultValue)) defaultValue = defaultValue();
  let type = typeof defaultValue;

  if (defaultValue instanceof String || defaultValue instanceof Number) {
    const check = validationMap.get(defaultValue);
    if (!check) {
      throw TypeError(
        stringifyModel(
          Model,
          `You must use primitive ${typeof defaultValue.valueOf()} value for '${key}' property of the provided model definition`,
        ),
      );
    }

    defaultValue = defaultValue.valueOf();
    type = typeof defaultValue;

    config.checks.set(key, check);
  }

  return { defaultValue, type };
}

function stringifyModel(Model, msg) {
  return `${msg}\n\nModel = ${JSON.stringify(Model, null, 2)}\n`;
}

const resolvedPromise = Promise.resolve();
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var configs = exports.configs = new WeakMap();
function setupModel(Model, nested) {
  if (typeof Model !== "object" || Model === null) {
    throw TypeError(`Model definition must be an object: ${typeof Model}`);
  }

  let config = configs.get(Model);

  if (config && !config.enumerable) {
    if (nested && !config.nested) {
      throw TypeError(
        stringifyModel(
          Model,
          "Provided model definition for nested object already used as a root definition",
        ),
      );
    }

    if (!nested && config.nested) {
      throw TypeError(
        stringifyModel(
          Model,
          "Nested model definition cannot be used outside of the parent definition",
        ),
      );
    }
  }

  if (!config) {
    const storage = Model[connect];
    if (typeof storage === "object") Object.freeze(storage);

    let invalidatePromise;
    const enumerable = hasOwnProperty.call(Model, "id");
    const external = !!storage;

    const checks = new Map();

    const proto = {
      toString() {
        return this.id || undefined;
      },
    };
    const placeholder = Object.create(proto);

    config = {
      model: Model,
      external,
      enumerable,
      nested: !enumerable && !external && nested,
      placeholder: (id) => {
        const model = Object.create(placeholder);
        definitions.set(model, config);

        if (enumerable) model.id = id;

        return Object.freeze(model);
      },
      isInstance: (model) => Object.getPrototypeOf(model) !== placeholder,
      invalidate: () => {
        if (!invalidatePromise) {
          invalidatePromise = resolvedPromise.then(() => {
            cache.invalidate(config, config, { clearValue: true });
            invalidatePromise = null;
          });
        }
      },
      checks,
    };

    configs.set(Model, config);

    config.storage = setupStorage(config, storage || memoryStorage(config));

    const transform = Object.keys(Object.freeze(Model)).map((key) => {
      if (key !== "id") {
        Object.defineProperty(placeholder, key, {
          get() {
            throw Error(
              `Model instance in ${
                getModelState(this).state
              } state - use store.pending(), store.error(), or store.ready() guards`,
            );
          },
          enumerable: true,
        });
      }

      if (key === "id") {
        if (Model[key] !== true) {
          throw TypeError(
            "The 'id' property in the model definition must be set to 'true' or not defined",
          );
        }
        return (model, data, lastModel) => {
          let id;
          if (hasOwnProperty.call(data, "id")) {
            id = stringifyId(data.id);
          } else if (lastModel) {
            id = lastModel.id;
          } else {
            id = uuid();
          }

          Object.defineProperty(model, "id", { value: id, enumerable: true });
        };
      }

      const { defaultValue, type } = resolveKey(Model, key, config);

      switch (type) {
        case "function":
          return (model) => {
            Object.defineProperty(model, key, {
              get() {
                return cache.get(this, key, () => defaultValue(this));
              },
            });
          };
        case "object": {
          if (defaultValue === null) {
            throw TypeError(
              `The value for the '${key}' must be an object instance: ${defaultValue}`,
            );
          }

          const isArray = Array.isArray(defaultValue);

          if (isArray) {
            const nestedType = typeof defaultValue[0];

            if (nestedType !== "object") {
              const Constructor = getTypeConstructor(nestedType, key);
              const defaultArray = Object.freeze(defaultValue.map(Constructor));
              return (model, data, lastModel) => {
                if (hasOwnProperty.call(data, key)) {
                  if (!Array.isArray(data[key])) {
                    throw TypeError(
                      `The value for '${key}' property must be an array: ${typeof data[
                        key
                      ]}`,
                    );
                  }
                  model[key] = Object.freeze(data[key].map(Constructor));
                } else if (lastModel && hasOwnProperty.call(lastModel, key)) {
                  model[key] = lastModel[key];
                } else {
                  model[key] = defaultArray;
                }
              };
            }

            const localConfig = bootstrap(defaultValue, true);

            if (
              localConfig.external &&
              config.storage.offline &&
              localConfig.storage.offline &&
              localConfig.storage.offline.threshold <
                config.storage.offline.threshold
            ) {
              throw Error(
                `External nested model for '${key}' property has lower offline threshold (${localConfig.storage.offline.threshold} ms) than the parent definition (${config.storage.offline.threshold} ms)`,
              );
            }

            if (localConfig.enumerable && defaultValue[1]) {
              const nestedOptions = defaultValue[1];
              if (typeof nestedOptions !== "object") {
                throw TypeError(
                  `Options for '${key}' array property must be an object instance: ${typeof nestedOptions}`,
                );
              }
              if (nestedOptions.loose) {
                config.contexts = config.contexts || new Set();
                config.contexts.add(bootstrap(defaultValue[0]));
              }
            }
            return (model, data, lastModel) => {
              if (hasOwnProperty.call(data, key)) {
                if (!Array.isArray(data[key])) {
                  throw TypeError(
                    `The value for '${key}' property must be an array: ${typeof data[
                      key
                    ]}`,
                  );
                }
                model[key] = localConfig.create(data[key], true);
              } else {
                model[key] =
                  (lastModel && lastModel[key]) ||
                  (!localConfig.enumerable &&
                    localConfig.create(defaultValue)) ||
                  [];
              }
            };
          }

          const nestedConfig = bootstrap(defaultValue, true);
          if (nestedConfig.enumerable || nestedConfig.external) {
            if (
              config.storage.offline &&
              nestedConfig.storage.offline &&
              nestedConfig.storage.offline.threshold <
                config.storage.offline.threshold
            ) {
              throw Error(
                `External nested model for '${key}' property has lower offline threshold (${nestedConfig.storage.offline.threshold} ms) than the parent definition (${config.storage.offline.threshold} ms)`,
              );
            }
            return (model, data, lastModel) => {
              let resultModel;

              if (hasOwnProperty.call(data, key)) {
                const nestedData = data[key];

                if (typeof nestedData !== "object" || nestedData === null) {
                  if (nestedData !== undefined && nestedData !== null) {
                    resultModel = { id: nestedData };
                  }
                } else {
                  const dataConfig = definitions.get(nestedData);
                  if (dataConfig) {
                    if (dataConfig.model !== defaultValue) {
                      throw TypeError(
                        "Model instance must match the definition",
                      );
                    }
                    resultModel = nestedData;
                  } else {
                    const lastNestedModel = cache.getEntry(
                      nestedConfig,
                      data[key].id,
                    ).value;
                    resultModel = nestedConfig.create(
                      nestedData,
                      lastNestedModel &&
                        nestedConfig.isInstance(lastNestedModel)
                        ? lastNestedModel
                        : undefined,
                    );
                    syncCache(nestedConfig, resultModel.id, resultModel);
                  }
                }
              } else {
                resultModel = lastModel && lastModel[key];
              }

              if (resultModel) {
                const id = resultModel.id;
                Object.defineProperty(model, key, {
                  get() {
                    return cache.get(this, key, () => get(defaultValue, id));
                  },
                  enumerable: true,
                });
              } else {
                model[key] = undefined;
              }
            };
          }

          return (model, data, lastModel) => {
            if (hasOwnProperty.call(data, key)) {
              model[key] = nestedConfig.create(
                data[key],
                lastModel && lastModel[key],
              );
            } else {
              model[key] = lastModel ? lastModel[key] : nestedConfig.create({});
            }
          };
        }
        // eslint-disable-next-line no-fallthrough
        default: {
          const Constructor = getTypeConstructor(type, key);
          return (model, data, lastModel) => {
            if (hasOwnProperty.call(data, key)) {
              model[key] = Constructor(data[key]);
            } else if (lastModel && hasOwnProperty.call(lastModel, key)) {
              model[key] = lastModel[key];
            } else {
              model[key] = defaultValue;
            }
          };
        }
      }
    });

    config.create = function create(data, lastModel) {
      if (data === null) return null;

      if (typeof data !== "object") {
        throw TypeError(`Model values must be an object instance: ${data}`);
      }

      const model = transform.reduce((acc, fn) => {
        fn(acc, data, lastModel);
        return acc;
      }, Object.create(proto));

      definitions.set(model, config);
      storePointer.set(model, store);

      return Object.freeze(model);
    };

    Object.freeze(placeholder);
    Object.freeze(config);
  }

  return config;
}

const listPlaceholderPrototype = Object.getOwnPropertyNames(
  Array.prototype,
).reduce((acc, key) => {
  if (key === "length" || key === "constructor") return acc;

  Object.defineProperty(acc, key, {
    get() {
      throw Error(
        `Model list instance in ${
          getModelState(this).state
        } state - use store.pending(), store.error(), or store.ready() guards`,
      );
    },
  });
  return acc;
}, []);

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var lists = exports.lists = new WeakMap();
function setupListModel(Model, nested) {
  let config = lists.get(Model);

  if (config && !config.enumerable) {
    if (!nested && config.nested) {
      throw TypeError(
        stringifyModel(
          Model,
          "Nested model definition cannot be used outside of the parent definition",
        ),
      );
    }
  }

  if (!config) {
    const modelConfig = setupModel(Model);

    const contexts = new Set();
    if (modelConfig.storage.loose) contexts.add(modelConfig);

    if (!nested) {
      if (!modelConfig.enumerable) {
        throw TypeError(
          stringifyModel(
            Model,
            "Provided model definition does not support listing (it must be enumerable - set `id` property to `true`)",
          ),
        );
      }
      if (!modelConfig.storage.list) {
        throw TypeError(
          stringifyModel(
            Model,
            "Provided model definition storage does not support `list` action",
          ),
        );
      }
    }

    nested = !modelConfig.enumerable && !modelConfig.external && nested;

    config = {
      list: true,
      nested,
      model: Model,
      contexts,
      enumerable: modelConfig.enumerable,
      external: modelConfig.external,
      placeholder: () => {
        const model = Object.create(listPlaceholderPrototype);
        definitions.set(model, config);

        return Object.freeze(model);
      },
      isInstance: (model) =>
        Object.getPrototypeOf(model) !== listPlaceholderPrototype,
      create(items, invalidate = false) {
        if (items === null) return null;

        const result = items.reduce((acc, data) => {
          let id = data;
          if (typeof data === "object" && data !== null) {
            id = data.id;
            const dataConfig = definitions.get(data);
            let model = data;
            if (dataConfig) {
              if (dataConfig.model !== Model) {
                throw TypeError("Model instance must match the definition");
              }
            } else {
              const lastModel =
                modelConfig.enumerable &&
                cache.getEntry(modelConfig, data.id).value;
              model = modelConfig.create(
                data,
                lastModel && modelConfig.isInstance(lastModel)
                  ? lastModel
                  : undefined,
              );
              if (modelConfig.enumerable) {
                id = model.id;
                syncCache(modelConfig, id, model, invalidate);
              }
            }
            if (!modelConfig.enumerable) {
              acc.push(model);
            }
          } else if (!modelConfig.enumerable) {
            throw TypeError(`Model instance must be an object: ${typeof data}`);
          }
          if (modelConfig.enumerable) {
            const key = acc.length;
            Object.defineProperty(acc, key, {
              get() {
                return cache.get(this, key, () => get(Model, id));
              },
              enumerable: true,
            });
          }
          return acc;
        }, []);

        Object.defineProperty(result, "id", { value: items.id });

        definitions.set(result, config);
        storePointer.set(result, store);

        return Object.freeze(result);
      },
    };

    config.storage = Object.freeze({
      ...setupStorage(config, {
        cache: modelConfig.storage.cache,
        get: !nested && ((id) => modelConfig.storage.list(id)),
      }),
      offline: modelConfig.storage.offline && {
        threshold: modelConfig.storage.offline.threshold,
        get: (id) => {
          const result = modelConfig.storage.offline.get(
            hashCode(String(stringifyId(id))),
          );
          return result
            ? result.map((item) => modelConfig.storage.offline.get(item))
            : null;
        },
        set: (id, values) => {
          modelConfig.storage.offline.set(
            hashCode(String(stringifyId(id))),
            values.map((item) => {
              modelConfig.storage.offline.set(item.id, item);
              return item.id;
            }),
          );
        },
      },
    });

    lists.set(Model, Object.freeze(config));
  }

  return config;
}

function resolveTimestamp(h, v) {
  return v || getCurrentTimestamp();
}

function stringifyId(id) {
  switch (typeof id) {
    case "object":
      return JSON.stringify(
        Object.keys(id)
          .sort()
          .reduce((acc, key) => {
            if (typeof id[key] === "object" && id[key] !== null) {
              throw TypeError(
                `You must use primitive value for '${key}' key: ${typeof id[
                  key
                ]}`,
              );
            }
            acc[key] = id[key];
            return acc;
          }, {}),
      );
    case "undefined":
      return undefined;
    default:
      return String(id);
  }
}

const notFoundErrors = new WeakSet();
function notFoundError(Model, stringId) {
  const err = Error(
    stringifyModel(
      Model,
      `Model instance ${
        stringId !== undefined ? `with '${stringId}' id ` : ""
      }does not exist`,
    ),
  );

  notFoundErrors.add(err);
  return err;
}

function mapError(model, err, suppressLog) {
  if (suppressLog !== false && !notFoundErrors.has(err)) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return setModelState(model, "error", err);
}

function get(Model, id) {
  const config = bootstrap(Model);
  let stringId;

  if (config.enumerable) {
    stringId = stringifyId(id);

    if (!stringId && !config.list && !draftMap.get(config)) {
      throw TypeError(
        stringifyModel(
          Model,
          `Provided model definition requires non-empty id: "${stringId}"`,
        ),
      );
    }
  } else if (id !== undefined) {
    throw TypeError(
      stringifyModel(Model, "Provided model definition does not support id"),
    );
  }

  const validate = config.storage.validate;
  if (validate) {
    const entry = cache.getEntry(config, stringId);
    if (entry.value && !validate(entry.value)) {
      entry.resolved = false;
      entry.depState = 0;
    }
  }

  const offline = config.storage.offline;

  return cache.get(config, stringId, (h, cachedModel) => {
    if (cachedModel && pending(cachedModel)) return cachedModel;

    let validContexts = true;
    if (config.contexts) {
      config.contexts.forEach((context) => {
        if (
          cache.get(context, context, resolveTimestamp) ===
          getCurrentTimestamp()
        ) {
          validContexts = false;
        }
      });
    }

    if (validContexts && cachedModel && config.storage.validate(cachedModel)) {
      return cachedModel;
    }

    const fallback = () =>
      cachedModel ||
      (offline && config.create(offline.get(stringId))) ||
      config.placeholder(stringId);

    try {
      let result = config.storage.get(id);

      if (typeof result !== "object" || result === null) {
        if (offline) offline.set(stringId, null);
        throw notFoundError(Model, stringId);
      }

      if (result instanceof Promise) {
        result = result
          .then((data) => {
            if (typeof data !== "object" || data === null) {
              if (offline) offline.set(stringId, null);
              throw notFoundError(Model, stringId);
            }

            if (data.id !== stringId) data.id = stringId;
            const model = config.create(data);

            if (offline) offline.set(stringId, model);

            return syncCache(config, stringId, setTimestamp(model));
          })
          .catch((e) => syncCache(config, stringId, mapError(fallback(), e)));

        return setModelState(fallback(), "pending", result);
      }

      if (result.id !== stringId) result.id = stringId;
      const model = config.create(result);

      if (offline) {
        Promise.resolve().then(() => {
          offline.set(stringId, model);
        });
      }

      return resolve(config, setTimestamp(model), cachedModel);
    } catch (e) {
      return setTimestamp(mapError(fallback(), e));
    }
  });
}

const draftMap = new WeakMap();

function getValidationError(errors) {
  const keys = Object.keys(errors);
  const e = Error(
    `Model validation failed (${keys.join(
      ", ",
    )}) - read the details from 'errors' property`,
  );

  e.errors = errors;

  return e;
}

function set(model, values = {}) {
  let config = definitions.get(model);

  if (config === null) {
    model = stales.get(model);
    config = definitions.get(model);
  }

  if (config === null) {
    throw Error(
      "Provided model instance has expired. Haven't you used stale value?",
    );
  }

  const isInstance = !!config;

  if (!config) config = bootstrap(model);

  const isDraft = draftMap.get(config);

  if (config.nested) {
    throw stringifyModel(
      config.model,
      TypeError(
        "Setting provided nested model instance is not supported, use the root model instance",
      ),
    );
  }

  if (config.list) {
    throw TypeError("Listing model definition does not support 'set' method");
  }

  if (!config.storage.set) {
    throw stringifyModel(
      config.model,
      TypeError(
        "Provided model definition storage does not support 'set' method",
      ),
    );
  }

  if (isInstance) {
    const promise = pending(model);
    if (promise) {
      return promise.then((m) => set(m, values));
    }
  }

  let id;
  const setState = (state, value) => {
    if (isInstance) {
      setModelState(model, state, value);
    } else {
      const entry = cache.getEntry(config, id);
      if (entry.value) {
        setModelState(entry.value, state, value);
      }
    }
  };

  try {
    if (
      config.enumerable &&
      !isInstance &&
      (!values || typeof values !== "object")
    ) {
      throw TypeError(`Values must be an object instance: ${values}`);
    }

    if (!isDraft && values && hasOwnProperty.call(values, "id")) {
      throw TypeError(`Values must not contain 'id' property: ${values.id}`);
    }

    const localModel = config.create(values, isInstance ? model : undefined);
    const keys = values ? Object.keys(values) : [];

    const errors = {};
    const lastError = isInstance && isDraft && error(model);

    let hasErrors = false;

    if (localModel) {
      config.checks.forEach((fn, key) => {
        if (keys.indexOf(key) === -1) {
          if (lastError && lastError.errors && lastError.errors[key]) {
            hasErrors = true;
            errors[key] = lastError.errors[key];
          }

          // eslint-disable-next-line eqeqeq
          if (isDraft && localModel[key] == config.model[key]) {
            return;
          }
        }

        let checkResult;
        try {
          checkResult = fn(localModel[key], key, localModel);
        } catch (e) {
          checkResult = e;
        }

        if (checkResult !== true && checkResult !== undefined) {
          hasErrors = true;
          errors[key] = checkResult || true;
        }
      });

      if (hasErrors && !isDraft) {
        throw getValidationError(errors);
      }
    }

    id = localModel ? localModel.id : model.id;

    const result = Promise.resolve(
      config.storage.set(isInstance ? id : undefined, localModel, keys),
    )
      .then((data) => {
        const resultModel =
          data === localModel ? localModel : config.create(data);

        if (isInstance && resultModel && id !== resultModel.id) {
          throw TypeError(
            `Local and storage data must have the same id: '${id}', '${resultModel.id}'`,
          );
        }

        let resultId = resultModel ? resultModel.id : id;

        if (hasErrors && isDraft) {
          setModelState(resultModel, "error", getValidationError(errors));
        }

        if (
          isDraft &&
          isInstance &&
          hasOwnProperty.call(data, "id") &&
          (!localModel || localModel.id !== model.id)
        ) {
          resultId = model.id;
        } else if (config.storage.offline) {
          config.storage.offline.set(resultId, resultModel);
        }

        return syncCache(
          config,
          resultId,
          resultModel ||
            mapError(
              config.placeholder(resultId),
              notFoundError(config.model, id),
              false,
            ),
          true,
        );
      })
      .catch((err) => {
        err = err !== undefined ? err : Error("Undefined error");
        setState("error", err);
        throw err;
      });

    setState("pending", result);

    return result;
  } catch (e) {
    setState("error", e);
    return Promise.reject(e);
  }
}

function sync(model, values) {
  if (typeof values !== "object") {
    throw TypeError(`Values must be an object instance: ${values}`);
  }

  let config = definitions.get(model);

  if (config === null) {
    model = stales.get(model);
    config = definitions.get(model);
  }

  if (config === null) {
    throw Error(
      "Provided model instance has expired. Haven't you used stale value?",
    );
  }

  if (config === undefined) {
    if (!values) {
      throw TypeError("Values must be defined for usage with model definition");
    }
    config = bootstrap(model);
    model = undefined;
  } else if (values && hasOwnProperty.call(values, "id")) {
    throw TypeError(`Values must not contain 'id' property: ${values.id}`);
  }

  if (config.list) {
    throw TypeError("Listing model definition is not supported in sync method");
  }

  const resultModel = config.create(values, model);
  const id = values ? resultModel.id : model.id;

  return syncCache(
    config,
    id,
    resultModel ||
      mapError(config.placeholder(id), notFoundError(config.model, id), false),
  );
}

function clear(model, clearValue = true) {
  if (typeof model !== "object" || model === null) {
    throw TypeError(
      `The first argument must be a model instance or a model definition: ${model}`,
    );
  }

  let config = definitions.get(model);

  if (config === null) {
    throw Error(
      "Provided model instance has expired. Haven't you used stale value from the outer scope?",
    );
  }

  if (config) {
    const offline = clearValue && config.storage.offline;
    if (offline) offline.set(model.id, null);

    invalidateTimestamp(model);
    cache.invalidate(config, model.id, { clearValue, deleteEntry: true });
  } else {
    if (!configs.get(model) && !lists.get(model[0])) {
      throw Error(
        "Model definition must be used before - passed argument is probably not a model definition",
      );
    }
    config = bootstrap(model);
    const offline = clearValue && config.storage.offline;

    cache.getEntries(config).forEach((entry) => {
      if (offline) offline.set(entry.key, null);
      if (entry.value) invalidateTimestamp(entry.value);
    });
    cache.invalidateAll(config, { clearValue, deleteEntry: true });
  }
}

function pending(...models) {
  let isPending = false;
  const result = models.map((model) => {
    try {
      const { state, value } = getModelState(model);
      if (state === "pending") {
        isPending = true;
        return value;
      }
    } catch (e) {} // eslint-disable-line no-empty

    return Promise.resolve(model);
  });

  return isPending && (models.length > 1 ? Promise.all(result) : result[0]);
}

function resolveToLatest(model) {
  model = stales.get(model) || model;

  const promise = pending(model);

  if (!promise) {
    const e = error(model);
    return e ? Promise.reject(e) : Promise.resolve(model);
  }

  return promise.then((m) => resolveToLatest(m));
}

function error(model, property) {
  if (model === null || typeof model !== "object") return false;
  const state = getModelState(model);

  if (property !== undefined) {
    const errors =
      typeof state.error === "object" && state.error && state.error.errors;

    return property === null ? !errors && state.error : errors[property];
  }

  return state.error;
}

function ready(...models) {
  return (
    models.length > 0 &&
    models.every((model) => {
      const config = definitions.get(model);
      return !!(config && config.isInstance(model));
    })
  );
}

function getValuesFromModel(model, values) {
  model = { ...model, ...values };
  delete model.id;
  return model;
}

function submit(draft, values = {}) {
  const config = definitions.get(draft);
  if (!config || !draftMap.has(config)) {
    throw TypeError(`Provided model instance is not a draft: ${draft}`);
  }

  if (pending(draft)) {
    throw Error("Model draft in pending state");
  }

  const modelConfig = draftMap.get(config);
  let result;

  if (cache.getEntry(modelConfig, draft.id).value) {
    const model = get(modelConfig.model, draft.id);
    result = Promise.resolve(pending(model) || model).then((resolvedModel) =>
      set(resolvedModel, getValuesFromModel(draft, values)),
    );
  } else {
    result = set(modelConfig.model, getValuesFromModel(draft, values));
  }

  result = result
    .then((resultModel) => {
      setModelState(draft, "ready");
      return set(draft, resultModel).then(() => resultModel);
    })
    .catch((e) => {
      setModelState(draft, "error", e);
      return Promise.reject(e);
    });

  setModelState(draft, "pending", result);

  return result;
}

function required(value, key) {
  return !!value || `${key} is required`;
}

function valueWithValidation(
  defaultValue,
  validate = required,
  errorMessage = "",
) {
  switch (typeof defaultValue) {
    case "string":
      // eslint-disable-next-line no-new-wrappers
      defaultValue = new String(defaultValue);
      break;
    case "number":
      // eslint-disable-next-line no-new-wrappers
      defaultValue = new Number(defaultValue);
      break;
    default:
      throw TypeError(
        `Default value must be a string or a number: ${typeof defaultValue}`,
      );
  }

  let fn;
  if (validate instanceof RegExp) {
    fn = (value) => validate.test(value) || errorMessage;
  } else if (typeof validate === "function") {
    fn = (...args) => {
      const result = validate(...args);
      return result !== true && result !== undefined
        ? errorMessage || result
        : result;
    };
  } else {
    throw TypeError(
      `The second argument must be a RegExp instance or a function: ${typeof validate}`,
    );
  }

  validationMap.set(defaultValue, fn);
  return defaultValue;
}

function store(Model, options = {}) {
  const config = bootstrap(Model);

  if (options.id !== undefined && typeof options.id !== "function") {
    const id = options.id;
    options.id = (host) => host[id];
  }

  if (options.id && !config.enumerable) {
    throw TypeError(
      "Store factory for singleton model definition does not support 'id' option",
    );
  }

  let draft;
  if (options.draft) {
    if (config.list) {
      throw TypeError(
        "Draft mode is not supported for listing model definition",
      );
    }

    draft = bootstrap({
      ...Model,
      [connect]: {
        get(id) {
          const model = get(config.model, id);
          return pending(model) || model;
        },
        set(id, values) {
          return values === null ? { id } : values;
        },
      },
    });

    draftMap.set(draft, config);
    Model = draft.model;
  }

  if (!options.id && config.enumerable) {
    return {
      get(host, value) {
        const valueConfig = definitions.get(value);
        const id = valueConfig !== undefined ? value.id : value;

        if (draft && (value === undefined || value === null)) {
          const draftModel = draft.create({}, { id: undefined });
          syncCache(draft, undefined, draftModel, false);
          return get(Model, undefined);
        }

        return value ? get(Model, id) : undefined;
      },
      set: (_, v) => v,
      connect: draft
        ? (host, key) => () => {
            const model = host[key];
            if (model && model.id) clear(model, true);
          }
        : undefined,
    };
  }

  return {
    get: (host, value) => {
      const id = (options.id && options.id(host)) || (value && value.id);

      if (draft && !id && (value === undefined || value === null)) {
        const draftModel = draft.create({});
        syncCache(draft, undefined, draftModel, false);
        return get(Model, undefined);
      }

      if (config.enumerable && id === undefined) return undefined;

      const nextValue = get(Model, id);

      if (nextValue !== value && ready(value) && !ready(nextValue)) {
        const tempValue = config.create(value);
        cache.set(tempValue, "state", () => getModelState(nextValue));
        return tempValue;
      }

      return nextValue;
    },
    set: draft && !config.enumerable ? (_, v) => v : undefined,
    connect:
      draft && config.enumerable
        ? (host, key) => () => {
            const model = host[key];
            if (model && model.id) clear(model, true);
          }
        : undefined,
  };
}

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = Object.freeze(
  Object.assign(store, {
    // storage
    connect,

    // actions
    get,
    set,
    sync,
    clear,

    // guards
    pending,
    error,
    ready,

    // helpers
    submit,
    value: valueWithValidation,
    resolve: resolveToLatest,
    ref,
  }),
);

}, function(modId) { var map = {"./global.js":1652148901790,"./cache.js":1652148901791,"./utils.js":1652148901793}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901797, function(require, module, exports) {
var __TEMP__ = require('./global.js');var global = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./define.js');var callbacksMap = __TEMP__['callbacksMap'];
var __TEMP__ = require('./cache.js');var cache = __REQUIRE_WILDCARD__(__TEMP__);
var __TEMP__ = require('./utils.js');var dispatch = __TEMP__['dispatch'];var walkInShadow = __TEMP__['walkInShadow'];

const connect = Symbol("router.connect");
const configs = new WeakMap();

const flushes = new WeakMap();
const stacks = new WeakMap();
const routers = new WeakMap();

let rootRouter = null;
const entryPoints = new Set();

let debug = false;
function setDebug(value = true) {
  debug = !!value;
}

const scrollMap = new WeakMap();
const focusMap = new WeakMap();
function saveLayout(target) {
  const focusEl = global.document.activeElement;
  focusMap.set(target, rootRouter.contains(focusEl) && focusEl);

  const map = new Map();

  const rootEl = global.document.scrollingElement;
  map.set(rootEl, { left: rootEl.scrollLeft, top: rootEl.scrollTop });

  walkInShadow(target, (el) => {
    if (el.scrollLeft || el.scrollTop) {
      map.set(el, { left: el.scrollLeft, top: el.scrollTop });
    }
  });

  scrollMap.set(target, map);
}

function focusElement(target) {
  if (target.tabIndex === -1) {
    const outline = target.style.outline;
    target.tabIndex = 0;
    target.style.outline = "none";
    target.addEventListener(
      "blur",
      () => {
        target.removeAttribute("tabindex");
        target.style.outline = outline;
      },
      { once: true },
    );
  }
  target.focus({ preventScroll: true });
}

function restoreLayout(target) {
  const activeEl = global.document.activeElement;

  focusElement(
    focusMap.get(target) ||
      (rootRouter.contains(activeEl) ? activeEl : rootRouter),
  );

  const map = scrollMap.get(target);
  if (map) {
    const config = configs.get(target);
    const state = global.history.state;
    const entry = state.find((e) => e.id === config.id);
    const clear = entry && entry.params.scrollToTop;

    map.forEach((pos, el) => {
      el.scrollLeft = clear ? 0 : pos.left;
      el.scrollTop = clear ? 0 : pos.top;
    });

    scrollMap.delete(target);
  } else {
    const rootEl = global.document.scrollingElement;
    rootEl.scrollLeft = 0;
    rootEl.scrollTop = 0;
  }
}

function mapUrlParam(value) {
  return value === true ? 1 : value || "";
}

const metaParams = ["scrollToTop"];

function setupBrowserUrl(browserUrl, id) {
  const [pathname, search = ""] = browserUrl.split("?");

  const searchParams = search ? search.split(",") : [];
  const normalizedPathname = pathname.replace(/^\//, "").split("/");
  const pathnameParams = normalizedPathname.reduce((params, name) => {
    if (name.startsWith(":")) {
      const key = name.slice(1);
      if (searchParams.includes(key)) {
        throw Error(`The '${key}' already used in search params`);
      }
      if (params.includes(key)) {
        throw Error(`The '${key}' already used in pathname`);
      }
      params.push(key);
    }
    return params;
  }, []);

  return {
    browserUrl,
    pathnameParams,
    paramsKeys: [...searchParams, ...pathnameParams],
    url(params, strict = false) {
      const temp = normalizedPathname.reduce((acc, part) => {
        if (part.startsWith(":")) {
          const key = part.slice(1);

          if (!hasOwnProperty.call(params, key)) {
            throw Error(`The '${key}' parameter must be defined for <${id}>`);
          }

          part = mapUrlParam(params[key]);
        }

        return `${acc}/${part}`;
      });

      const url = new URL(temp, global.location.origin);

      Object.keys(params).forEach((key) => {
        if (
          pathnameParams.includes(key) ||
          (strict && (metaParams.includes(key) || !searchParams.includes(key)))
        ) {
          return;
        }

        url.searchParams.append(key, mapUrlParam(params[key]));
      });

      return url;
    },
    match(url) {
      const params = {};
      const temp = url.pathname.replace(/^\//, "").split("/");

      if (temp.length !== normalizedPathname.length) return null;

      for (let i = 0; i < temp.length; i += 1) {
        const part = temp[i];
        const normalizedPart = normalizedPathname[i];

        if (normalizedPart.startsWith(":")) {
          const key = normalizedPart.slice(1);
          params[key] = part;
        } else if (part !== normalizedPart) {
          return null;
        }
      }

      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      return params;
    },
  };
}

function hasInStack(config, target) {
  return config.stack.some((temp) => {
    if (temp === target) return true;
    return hasInStack(temp, target);
  });
}

function addEntryPoint(config) {
  if (config.browserUrl) {
    entryPoints.add(config);
  }
  config.stack.forEach(addEntryPoint);
}

function setupViews(views, options, parent = null, nestedParent = null) {
  if (typeof views === "function") views = views();
  views = [].concat(views);

  return views.map((hybrids) => {
    const config = configs.get(hybrids);

    if (config && hasInStack(config, parent)) {
      throw Error(
        `<${config.id}> cannot be in the stack of <${parent.id}>, as it is an ancestor in the stack tree`,
      );
    }

    // eslint-disable-next-line no-use-before-define
    return setupView(hybrids, options, parent, nestedParent);
  });
}

function getNestedRouterOptions(hybrids, config) {
  const nestedRouters = Object.values(hybrids)
    .map((desc) => routers.get(desc))
    .filter((d) => d);

  if (nestedRouters.length) {
    if (nestedRouters.length > 1) {
      throw TypeError(
        `<${config.id}> must contain at most one nested router, found: ${nestedRouters.length}`,
      );
    }

    if (config.dialog) {
      throw TypeError(
        `Nested routers are not supported in dialogs. Remove the router property definition from <${config.id}>`,
      );
    }

    if (config.browserUrl) {
      throw TypeError(
        `A view with nested router must not have the url option. Remove the url option from <${config.id}>`,
      );
    }
  }
  return nestedRouters[0];
}

function getConfigById(id) {
  const Constructor = global.customElements.get(id);
  return configs.get(Constructor);
}

function setupView(hybrids, routerOptions, parent, nestedParent) {
  const id = hybrids.tag;
  let config = getConfigById(id);

  if (config && config.hybrids !== hybrids) {
    config = null;
  }

  if (!config) {
    const Constructor = global.customElements.get(id);

    if (!Constructor || Constructor.hybrids !== hybrids) {
      throw Error(
        `<${id}> view must be defined by 'define()' function before it can be used in router factory`,
      );
    }

    let browserUrl = null;

    const options = {
      dialog: false,
      guard: false,
      multiple: false,
      replace: false,
      ...hybrids[connect],
    };

    const callbacks = callbacksMap.get(Constructor);

    if (!nestedParent) {
      callbacks.push(restoreLayout);
    }

    if (options.dialog) {
      callbacks.push((host) => {
        const goBackOnEscKey = (event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            global.history.go(-1);
          }
        };

        const focusDialog = () => {
          focusElement(host);
        };

        const prevActiveEl = global.document.activeElement;
        const root = rootRouter;

        root.addEventListener("focusin", focusDialog);
        host.addEventListener("focusout", focusDialog);
        host.addEventListener("keydown", goBackOnEscKey);

        focusElement(host);

        return () => {
          root.removeEventListener("focusin", focusDialog);
          host.removeEventListener("focusout", focusDialog);
          host.removeEventListener("keydown", goBackOnEscKey);

          focusElement(prevActiveEl);
        };
      });
    }

    const writableParams = [];
    Object.keys(Constructor.prototype).forEach((key) => {
      const desc = Object.getOwnPropertyDescriptor(Constructor.prototype, key);
      if (desc.set) writableParams.push(key);
    });

    if (options.url) {
      if (options.dialog) {
        throw Error(
          `The 'url' option is not supported for dialogs - remove it from <${id}>`,
        );
      }
      if (typeof options.url !== "string") {
        throw TypeError(
          `The 'url' option in <${id}> must be a string: ${typeof options.url}`,
        );
      }
      browserUrl = setupBrowserUrl(options.url, id);

      browserUrl.paramsKeys.forEach((key) => {
        const desc = Object.getOwnPropertyDescriptor(
          Constructor.prototype,
          key,
        );
        if (!desc || !desc.set) {
          throw Error(
            `'${key}' parameter from the url is not ${
              desc ? "writable" : "defined"
            } in <${id}>`,
          );
        }
      });
    }

    const stateParams = writableParams.filter(
      (k) => !routerOptions.params.includes(k) && !metaParams.includes(k),
    );

    callbacksMap.get(Constructor).unshift((_) =>
      cache.observe(
        _,
        connect,
        (host) =>
          stateParams.reduce((acc, key) => {
            const value = mapUrlParam(host[key]).toString();
            if (value !== undefined && value !== hybrids[key]) {
              acc[key] = String(value);
            }
            return acc;
          }, {}),
        (host, params, lastParams) => {
          if (!lastParams) return;

          const state = global.history.state;
          let entry = state[0];
          while (entry.id !== id && entry.nested) entry = entry.nested;

          params = { ...entry.params, ...params };

          global.history.replaceState(
            [config.getEntry(params), ...state.slice(1)],
            "",
            browserUrl ? config.url(params, true) : "",
          );
        },
      ),
    );

    let guard;
    if (options.guard) {
      guard = () => {
        try {
          return options.guard();
        } catch (e) {
          console.error(e);
          return false;
        }
      };
    }

    config = {
      id,
      hybrids,
      dialog: options.dialog,
      multiple: options.multiple,
      replace: options.replace,
      guard,
      parent,
      nestedParent,
      nestedRoots: undefined,
      parentsWithGuards: undefined,
      stack: [],
      ...(browserUrl || {
        url(params) {
          const url = new URL("", global.location.origin);

          Object.keys(params).forEach((key) => {
            url.searchParams.append(key, mapUrlParam(params[key]));
          });

          return new URL(
            `${routerOptions.url}#@${id}${url.search}`,
            global.location.origin,
          );
        },
        match(url) {
          const params = {};
          url.searchParams.forEach((value, key) => {
            if (writableParams.includes(key) || metaParams.includes(key))
              params[key] = value;
          });

          return params;
        },
      }),
      create() {
        const el = new Constructor();
        configs.set(el, config);

        return el;
      },
      getEntry(params = {}, other) {
        const entryParams = Object.keys(params).reduce((acc, key) => {
          if (writableParams.includes(key)) {
            acc[key] = params[key];
          }

          return acc;
        }, {});

        const entry = { id, params: entryParams, ...other };
        const guardConfig = config.parentsWithGuards.find((c) => !c.guard());

        if (guardConfig) {
          return guardConfig.getEntry(params, { from: entry });
        }

        if (config.guard && config.guard()) {
          return { ...config.stack[0].getEntry(params) };
        }

        if (config.nestedParent) {
          return config.nestedParent.getEntry(params, { nested: entry });
        }

        metaParams.forEach((key) => {
          if (hasOwnProperty.call(params, key)) {
            entry.params[key] = params[key];
          }
        });

        return entry;
      },
    };

    configs.set(hybrids, config);
    configs.set(Constructor, config);

    if (parent && !parent.stack.includes(config)) {
      parent.stack.push(config);
    }

    if (options.stack) {
      if (options.dialog) {
        throw Error(
          `The 'stack' option is not supported for dialogs - remove it from <${id}>`,
        );
      }
      setupViews(options.stack, routerOptions, config, nestedParent);
    }
  } else {
    config.parent = parent;
    config.nestedParent = nestedParent;
  }

  if (!parent) {
    addEntryPoint(config);
  }

  config.parentsWithGuards = [];
  while (parent) {
    if (parent.guard) config.parentsWithGuards.unshift(parent);
    parent = parent.parent;
  }

  const nestedRouterOptions = getNestedRouterOptions(hybrids, config);

  if (nestedRouterOptions) {
    config.nestedRoots = setupViews(
      nestedRouterOptions.views,
      { ...routerOptions, ...nestedRouterOptions },
      config,
      config,
    );

    config.stack = config.stack.concat(config.nestedRoots);
  }

  return config;
}

function getUrl(view, params = {}) {
  const config = configs.get(view);
  return config ? config.url(params) : "";
}

function getAllEntryParams(entry) {
  const params = {};
  while (entry) {
    Object.assign(params, entry.params);
    entry = entry.nested;
  }

  return params;
}

function getBackUrl({ nested = false, scrollToTop = false } = {}) {
  const state = global.history.state;
  if (!state) return "";

  if (state.length > 1) {
    const entry = state[0];
    let i = 1;
    let prevEntry = state[i];
    if (nested) {
      while (prevEntry.nested) {
        prevEntry = prevEntry.nested;
      }
    } else {
      while (entry.id === prevEntry.id && i < state.length - 1) {
        i += 1;
        prevEntry = state[i];
      }
    }

    const params = getAllEntryParams(state[i]);

    if (scrollToTop) {
      params.scrollToTop = true;
    } else {
      delete params.scrollToTop;
    }

    return getConfigById(prevEntry.id).url(params);
  }

  let entry = state[0];

  if (nested) {
    while (entry.nested) {
      entry = entry.nested;
    }
  }

  let config = getConfigById(entry.id).parent;

  if (config) {
    while (config && config.guard) {
      config = config.parent;
    }

    if (config) {
      return config.url(getAllEntryParams(state[0]));
    }
  }

  return "";
}

function getGuardUrl(params = {}) {
  const state = global.history.state;
  if (!state) return "";

  const entry = state[0];

  if (entry.from) {
    const config = getConfigById(entry.from.id);
    return config.url({ ...entry.from.params, ...params });
  }

  const config = getConfigById(entry.id);
  return config.stack[0] ? config.stack[0].url(params) : "";
}

function getCurrentUrl(params) {
  const state = global.history.state;
  if (!state) return "";

  let entry = state[0];
  while (entry.nested) entry = entry.nested;

  const config = getConfigById(entry.id);
  return config.url({ ...entry.params, ...params });
}

function active(views, { stack = false } = {}) {
  const state = global.history.state;
  if (!state) return false;

  views = [].concat(views);

  return views.some((view) => {
    const config = configs.get(view);
    if (!config) {
      throw TypeError(`Provided view is not connected to the router: ${view}`);
    }

    let entry = state[0];
    while (entry) {
      const target = getConfigById(entry.id);
      if (target === config || (stack && hasInStack(config, target))) {
        return true;
      }
      entry = entry.nested;
    }

    return false;
  });
}

function getEntryFromURL(url) {
  let config;

  const [pathname, search] = url.hash.split("?");
  if (pathname && pathname.match(/^#@.+-.+/)) {
    config = getConfigById(pathname.split("@")[1]);
    url = new URL(`?${search}`, global.location.origin);
  }

  if (!config) {
    for (const entryPoint of entryPoints) {
      const params = entryPoint.match(url);
      if (params) return entryPoint.getEntry(params);
    }

    return null;
  }

  return config.getEntry(config.match(url));
}

function handleNavigate(event) {
  if (event.defaultPrevented) return;

  let url;

  if (event.type === "click") {
    if (event.ctrlKey || event.metaKey) return;
    const anchorEl = event
      .composedPath()
      .find((el) => el instanceof global.HTMLAnchorElement);

    if (anchorEl) {
      url = new URL(anchorEl.href, global.location.origin);
    }
  } else {
    url = new URL(event.target.action, global.location.origin);
  }

  if (url && url.origin === global.location.origin) {
    const entry = getEntryFromURL(url);
    if (entry) {
      event.preventDefault();

      dispatch(rootRouter, "navigate", {
        bubbles: true,
        detail: { entry, url },
      });
    }
  }
}

let activePromise;
function resolveEvent(event, promise) {
  event.preventDefault();
  activePromise = promise;

  const path = event.composedPath();
  const pseudoEvent = {
    type: event.type,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    target: event.target,
    defaultPrevented: false,
    preventDefault: () => {},
    composedPath: () => path,
  };

  return promise.then(() => {
    if (promise === activePromise) {
      global.requestAnimationFrame(() => {
        handleNavigate(pseudoEvent);
      });
      activePromise = null;
    }
  });
}

function resolveStack(host, state, options) {
  let stack = stacks.get(host);
  const reducedState = state.reduce((acc, entry, index) => {
    if (
      index === 0 ||
      state[index - 1].id !== entry.id ||
      getConfigById(entry.id).multiple
    ) {
      acc.push(entry);
    }
    return acc;
  }, []);
  const offset = stack.length - reducedState.length;

  stack = reducedState.map((entry, index) => {
    const prevView = stack[index + offset];
    const config = getConfigById(entry.id);
    let nextView;

    if (prevView) {
      const prevConfig = configs.get(prevView);
      if (config.id !== prevConfig.id || (index === 0 && config.replace)) {
        return config.create();
      }
      nextView = prevView;
    } else {
      nextView = config.create();
    }

    if (index === 0) {
      if (nextView === prevView) {
        cache.unsuspend(nextView);

        if (offset === 0 && host === rootRouter && entry.params.scrollToTop) {
          restoreLayout(nextView);
        }
      }
    }

    return nextView;
  });

  stacks.set(host, stack);

  const view = stack[0];
  const flush = flushes.get(view);

  Object.entries(state[0].params).forEach(([key, value]) => {
    if (key in view) view[key] = value;
  });

  options.params.forEach((key) => {
    if (key in view) view[key] = host[key];
  });

  if (flush) flush();
}

function getEntryOffset(entry) {
  const state = global.history.state.reduce((acc, e, index) => {
    let i = 0;

    while (e) {
      acc[i] = acc[i] || [];
      acc[i][index] = e;
      e = e.nested;
      i += 1;
    }

    return acc;
  }, []);

  let offset = 0;
  let i = 0;
  while (entry) {
    const config = getConfigById(entry.id);
    let j = offset;

    for (; j < state[i].length; j += 1) {
      const e = state[i][j];

      if (config.dialog) {
        return e.id !== entry.id ? -1 : offset;
      }

      if (e.id === entry.id) {
        if (config.multiple) {
          if (
            (config.pathnameParams &&
              config.pathnameParams.every(
                (key) => entry.params[key] === e.params[key],
              )) ||
            Object.entries(entry.params).every(
              ([key, value]) => e.params[key] === value,
            )
          ) {
            offset = j;
            break;
          }
        } else {
          offset = j;
          break;
        }
      }

      const c = getConfigById(e.id);
      if (hasInStack(c, config)) {
        if (config.multiple && state[i][0].id === entry.id) {
          offset -= 1;
          break;
        }

        if (j > 0) {
          offset = j - 1;
          break;
        } else {
          return c.guard ? 0 : -1;
        }
      }
    }

    if (j === state[i].length) {
      offset = state[i].length - 1;
    }

    entry = entry.nested;
    i += 1;
  }

  return offset;
}

function connectRootRouter(host, invalidate, options) {
  function restoreScrollRestoration() {
    if (global.history.scrollRestoration === "manual") {
      global.history.scrollRestoration = "auto";
    }
  }

  function flush() {
    resolveStack(host, global.history.state, options);
    invalidate();

    global.requestAnimationFrame(restoreScrollRestoration);
  }

  function navigateBack(offset, entry, nextUrl) {
    const stateLength = global.history.state.length;
    const targetEntry = global.history.state[offset];
    const pushOffset = offset < stateLength - 1 && stateLength > 2 ? 1 : 0;

    if (targetEntry && entry.id === targetEntry.id) {
      entry = { ...targetEntry, ...entry };
    }

    offset = -(offset + pushOffset);

    const replace = (popStateEvent) => {
      if (popStateEvent) {
        global.removeEventListener("popstate", replace);
        global.addEventListener("popstate", flush);
      }

      const state = global.history.state;
      const method = pushOffset ? "pushState" : "replaceState";
      const nextState = [entry, ...state.slice(pushOffset ? 0 : 1)];

      if (pushOffset) {
        global.history.scrollRestoration = "manual";
      }

      global.history[method](nextState, "", nextUrl);

      flush();
    };

    if (offset) {
      global.removeEventListener("popstate", flush);
      global.addEventListener("popstate", replace);

      global.history.go(offset);
    } else {
      replace();
    }
  }

  function navigate(entry) {
    const state = global.history.state;

    let nestedEntry = entry;
    while (nestedEntry.nested) nestedEntry = nestedEntry.nested;
    const nestedConfig = getConfigById(nestedEntry.id);

    const url = nestedConfig.browserUrl
      ? nestedConfig.url(nestedEntry.params, true)
      : options.url;
    const offset = getEntryOffset(entry);

    if (offset > -1) {
      navigateBack(offset, entry, url);
    } else {
      let stack = stacks.get(host);
      saveLayout(stack[0]);

      while (stack && stack[0]) {
        cache.suspend(stack[0]);
        stack = stacks.get(stack[0]);
      }

      global.history.scrollRestoration = "manual";
      global.history.pushState([entry, ...state], "", url);

      flush();
    }
  }

  function executeNavigate(event) {
    navigate(event.detail.entry);
  }

  if (rootRouter) {
    throw Error(
      `An element with root router already connected to the document: <${rootRouter.tagName.toLowerCase()}>`,
    );
  }

  let roots;
  try {
    roots = setupViews(options.views, options);
    rootRouter = host;
    flushes.set(host, flush);
  } catch (e) {
    console.error(
      `Error while connecting router in <${host.tagName.toLowerCase()}>:`,
    );
    throw e;
  }

  const state = global.history.state;

  if (!state) {
    const entry =
      getEntryFromURL(new URL(global.location.href)) || roots[0].getEntry();

    global.history.replaceState([entry], "", options.url);
    flush();
  } else {
    const stack = stacks.get(host);

    let i;
    for (i = state.length - 1; i >= 0; i -= 1) {
      let entry = state[i];
      while (entry) {
        const config = getConfigById(entry.id);
        if (
          !config ||
          (config.dialog && stack.length === 0) ||
          (!roots.includes(config) && !roots.some((c) => hasInStack(c, config)))
        ) {
          break;
        }
        entry = entry.nested;
      }
      if (entry) break;
    }

    if (i > -1) {
      const lastValidEntry = state[i + 1];
      navigateBack(
        state.length - i - 1,
        lastValidEntry || roots[0].getEntry(state[0].params),
        options.url,
      );
    } else {
      let entry = state[0];
      while (entry.nested) entry = entry.nested;

      const nestedConfig = getConfigById(entry.id);
      const resultEntry = nestedConfig.getEntry(entry.params);
      navigate(resultEntry);
    }
  }

  global.addEventListener("popstate", flush);

  host.addEventListener("click", handleNavigate);
  host.addEventListener("submit", handleNavigate);
  host.addEventListener("navigate", executeNavigate);

  return () => {
    global.removeEventListener("popstate", flush);

    host.removeEventListener("click", handleNavigate);
    host.removeEventListener("submit", handleNavigate);
    host.removeEventListener("navigate", executeNavigate);

    entryPoints.clear();
    rootRouter = null;
  };
}

function connectNestedRouter(host, invalidate, options) {
  const config = configs.get(host);

  function getNestedState() {
    return global.history.state
      .map((entry) => {
        while (entry) {
          if (entry.id === config.id) return entry.nested;
          entry = entry.nested;
        }
        return entry;
      })
      .filter((e) => e);
  }

  function flush() {
    resolveStack(host, getNestedState(), options);
    invalidate();
  }

  if (!getNestedState()[0]) {
    const state = global.history.state;
    global.history.replaceState(
      [config.nestedRoots[0].getEntry(state[0].params), ...state.slice(1)],
      "",
    );
  }

  flush();
  flushes.set(host, flush);
}

function router(views, options) {
  options = {
    url: global.location.href.replace(/#.*$/, ""),
    params: [],
    ...options,
    views,
  };

  const desc = {
    get: (host) => {
      const stack = stacks.get(host) || [];
      return stack
        .slice(0, stack.findIndex((el) => !configs.get(el).dialog) + 1)
        .reverse();
    },
    connect: (host, key, invalidate) => {
      options.params.forEach((param) => {
        if (!(param in host)) {
          throw Error(
            `Property '${param}' for global parameters is not defined in <${host.tagName.toLowerCase()}>`,
          );
        }
      });

      if (!stacks.has(host)) stacks.set(host, []);

      if (configs.has(host)) {
        return connectNestedRouter(host, invalidate, options);
      }

      return connectRootRouter(host, invalidate, options);
    },
    observe:
      debug &&
      ((host, value, lastValue) => {
        const index = value.length - 1;
        const view = value[index];

        if (lastValue && view === lastValue[index]) return;

        let config = configs.get(host);
        let entry = global.history.state[0];
        let key = 0;

        while (config) {
          key += 1;
          entry = entry.nested;
          config = config.nestedParent;
        }

        console.groupCollapsed(
          `[${host.tagName.toLowerCase()}]: navigated to <${
            entry.id
          }> ($$${key})`,
        );

        Object.entries(entry.params).forEach(([k, v]) =>
          console.log(`%c${k}:`, "font-weight: bold", v),
        );

        console.groupEnd();

        global[`$$${key}`] = view;
      }),
  };

  routers.set(desc, options);
  return desc;
}

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = Object.freeze(
  Object.assign(router, {
    connect,
    debug: setDebug,
    url: getUrl,
    backUrl: getBackUrl,
    guardUrl: getGuardUrl,
    currentUrl: getCurrentUrl,
    resolve: resolveEvent,
    active,
  }),
);

}, function(modId) { var map = {"./global.js":1652148901790,"./define.js":1652148901789,"./cache.js":1652148901791,"./utils.js":1652148901793}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901798, function(require, module, exports) {
var __TEMP__ = require('./core.js');var compileTemplate = __TEMP__['compileTemplate'];var getPlaceholder = __TEMP__['getPlaceholder'];
var __TEMP__ = require('./helpers.js');var helpers = __REQUIRE_WILDCARD__(__TEMP__);

const PLACEHOLDER = getPlaceholder();
const SVG_PLACEHOLDER = getPlaceholder("svg");
const STYLE_IMPORT_REGEXP = /@import/;

const templatesMap = new Map();
const stylesMap = new WeakMap();

const methods = {
  key(id) {
    this.id = id;
    return this;
  },
  style(...styles) {
    stylesMap.set(
      this,
      (stylesMap.get(this) || []).concat(styles.filter((style) => style)),
    );
    return this;
  },
  css(parts, ...args) {
    stylesMap.set(
      this,
      (stylesMap.get(this) || []).concat(
        parts.reduce(
          (acc, part, index) => `${acc}${part}${args[index] || ""}`,
          "",
        ),
      ),
    );
    return this;
  },
};

function create(parts, args, isSVG) {
  const createTemplate = (host, target = host) => {
    const styles = stylesMap.get(createTemplate);
    let hasAdoptedStyleSheets;
    let id = parts.join(PLACEHOLDER);

    if (styles) {
      const joinedStyles = styles.join(PLACEHOLDER);
      hasAdoptedStyleSheets =
        !!target.adoptedStyleSheets && !STYLE_IMPORT_REGEXP.test(joinedStyles);
      if (!hasAdoptedStyleSheets) id += joinedStyles;
    }

    if (isSVG) id += SVG_PLACEHOLDER;

    let render = templatesMap.get(id);
    if (!render) {
      render = compileTemplate(parts, isSVG, !hasAdoptedStyleSheets && styles);
      templatesMap.set(id, render);
    }

    render(host, target, args, hasAdoptedStyleSheets && styles);
  };

  return Object.assign(createTemplate, methods);
}

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function html(parts, ...args) {
  return create(parts, args);
};exports.html = html

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function svg(parts, ...args) {
  return create(parts, args, true);
};exports.svg = svg

Object.assign(html, helpers);
Object.assign(svg, helpers);

}, function(modId) { var map = {"./core.js":1652148901799,"./helpers.js":1652148901808}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901799, function(require, module, exports) {
var __TEMP__ = require('../global.js');var global = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('../utils.js');var stringifyElement = __TEMP__['stringifyElement'];var shadyCSS = __TEMP__['shadyCSS'];var probablyDevMode = __TEMP__['probablyDevMode'];
var __TEMP__ = require('./utils.js');var dataMap = __TEMP__['dataMap'];var removeTemplate = __TEMP__['removeTemplate'];

var __TEMP__ = require('./resolvers/value.js');var resolveValue = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./resolvers/property.js');var resolveProperty = __REQUIRE_DEFAULT__(__TEMP__);

const TIMESTAMP = Date.now();

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var getPlaceholder = exports.getPlaceholder = (id = 0) => `{{h-${TIMESTAMP}-${id}}}`;

const PLACEHOLDER_REGEXP_TEXT = getPlaceholder("(\\d+)");
const PLACEHOLDER_REGEXP_EQUAL = new RegExp(`^${PLACEHOLDER_REGEXP_TEXT}$`);
const PLACEHOLDER_REGEXP_ALL = new RegExp(PLACEHOLDER_REGEXP_TEXT, "g");

const preparedTemplates = new WeakMap();

/* istanbul ignore next */
function applyShadyCSS(template, tagName) {
  if (!tagName) return template;

  return shadyCSS((shady) => {
    let map = preparedTemplates.get(template);
    if (!map) {
      map = new Map();
      preparedTemplates.set(template, map);
    }

    let clone = map.get(tagName);

    if (!clone) {
      clone = global.document.createElement("template");
      clone.content.appendChild(template.content.cloneNode(true));

      map.set(tagName, clone);

      const styles = clone.content.querySelectorAll("style");

      Array.from(styles).forEach((style) => {
        const count = style.childNodes.length + 1;
        for (let i = 0; i < count; i += 1) {
          style.parentNode.insertBefore(
            global.document.createTextNode(getPlaceholder()),
            style,
          );
        }
      });

      shady.prepareTemplate(clone, tagName.toLowerCase());
    }
    return clone;
  }, template);
}

function createSignature(parts, styles) {
  let signature = parts.reduce((acc, part, index) => {
    if (index === 0) {
      return part;
    }

    if (
      parts
        .slice(index)
        .join("")
        .match(/^\s*<\/\s*(table|tr|thead|tbody|tfoot|colgroup)>/)
    ) {
      return `${acc}<!--${getPlaceholder(index - 1)}-->${part}`;
    }
    return acc + getPlaceholder(index - 1) + part;
  }, "");

  if (styles) {
    signature += `<style>\n${styles.join("\n/*------*/\n")}\n</style>`;
  }

  return signature;
}

function getPropertyName(string) {
  return string
    .replace(/\s*=\s*['"]*$/g, "")
    .split(/\s+/)
    .pop();
}

function replaceComments(fragment) {
  const iterator = global.document.createNodeIterator(
    fragment,
    global.NodeFilter.SHOW_COMMENT,
    null,
    false,
  );
  let node;
  // eslint-disable-next-line no-cond-assign
  while ((node = iterator.nextNode())) {
    if (PLACEHOLDER_REGEXP_EQUAL.test(node.textContent)) {
      node.parentNode.insertBefore(
        global.document.createTextNode(node.textContent),
        node,
      );
      node.parentNode.removeChild(node);
    }
  }
}

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function createInternalWalker(context) {
  let node;

  return {
    get currentNode() {
      return node;
    },
    nextNode() {
      if (node === undefined) {
        node = context.childNodes[0];
      } else if (node.childNodes.length) {
        node = node.childNodes[0];
      } else if (node.nextSibling) {
        node = node.nextSibling;
      } else {
        let parentNode = node.parentNode;
        node = parentNode.nextSibling;

        while (!node && parentNode !== context) {
          parentNode = parentNode.parentNode;
          node = parentNode.nextSibling;
        }
      }

      return !!node;
    },
  };
};exports.createInternalWalker = createInternalWalker

function createExternalWalker(context) {
  return global.document.createTreeWalker(
    context,
    // eslint-disable-next-line no-bitwise
    global.NodeFilter.SHOW_ELEMENT | global.NodeFilter.SHOW_TEXT,
    null,
    false,
  );
}

/* istanbul ignore next */
const createWalker =
  typeof global.ShadyDOM === "object" && global.ShadyDOM.inUse
    ? createInternalWalker
    : createExternalWalker;

const styleSheetsMap = new Map();

function normalizeWhitespace(input, startIndent = 0) {
  input = input.replace(/(^[\n\s\t ]+)|([\n\s\t ]+$)+/g, "");

  let i = input.indexOf("\n");
  if (i > -1) {
    let indent = 0 - startIndent - 2;
    for (i += 1; input[i] === " " && i < input.length; i += 1) {
      indent += 1;
    }
    return input.replace(/\n +/g, (t) =>
      t.substr(0, Math.max(t.length - indent, 1)),
    );
  }

  return input;
}

function beautifyTemplateLog(input, index) {
  const placeholder = getPlaceholder(index);

  const output = normalizeWhitespace(input)
    .split("\n")
    .filter((i) => i)
    .map((line) => {
      const startIndex = line.indexOf(placeholder);

      if (startIndex > -1) {
        return `| ${line}\n--${"-".repeat(startIndex)}${"^".repeat(6)}`;
      }

      return `| ${line}`;
    })
    .join("\n")
    // eslint-disable-next-line no-template-curly-in-string
    .replace(PLACEHOLDER_REGEXP_ALL, "${...}");

  return `${output}`;
}

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function compileTemplate(rawParts, isSVG, styles) {
  const template = global.document.createElement("template");
  const parts = [];

  const signature = createSignature(rawParts, styles);
  template.innerHTML = isSVG ? `<svg>${signature}</svg>` : signature;

  if (isSVG) {
    const svgRoot = template.content.firstChild;
    template.content.removeChild(svgRoot);
    Array.from(svgRoot.childNodes).forEach((node) =>
      template.content.appendChild(node),
    );
  }

  replaceComments(template.content);

  const compileWalker = createWalker(template.content);
  const notDefinedElements = [];
  let compileIndex = 0;

  while (compileWalker.nextNode()) {
    const node = compileWalker.currentNode;

    if (node.nodeType === global.Node.TEXT_NODE) {
      const text = node.textContent;

      if (!text.match(PLACEHOLDER_REGEXP_EQUAL)) {
        const results = text.match(PLACEHOLDER_REGEXP_ALL);
        if (results) {
          let currentNode = node;
          results
            .reduce(
              (acc, placeholder) => {
                const [before, next] = acc.pop().split(placeholder);
                if (before) acc.push(before);
                acc.push(placeholder);
                if (next) acc.push(next);
                return acc;
              },
              [text],
            )
            .forEach((part, index) => {
              if (index === 0) {
                currentNode.textContent = part;
              } else {
                currentNode = currentNode.parentNode.insertBefore(
                  global.document.createTextNode(part),
                  currentNode.nextSibling,
                );
              }
            });
        }
      }

      const equal = node.textContent.match(PLACEHOLDER_REGEXP_EQUAL);
      if (equal) {
        node.textContent = "";
        parts[equal[1]] = [compileIndex, resolveValue];
      }
    } else {
      /* istanbul ignore else */ // eslint-disable-next-line no-lonely-if
      if (node.nodeType === global.Node.ELEMENT_NODE) {
        /* istanbul ignore else */ // eslint-disable-next-line no-lonely-if
        if (probablyDevMode) {
          const tagName = node.tagName.toLowerCase();
          if (
            tagName.match(/.+-.+/) &&
            !global.customElements.get(tagName) &&
            !notDefinedElements.includes(tagName)
          ) {
            notDefinedElements.push(tagName);
          }
        }

        Array.from(node.attributes).forEach((attr) => {
          const value = attr.value.trim();
          /* istanbul ignore next */
          const name = attr.name;
          const equal = value.match(PLACEHOLDER_REGEXP_EQUAL);
          if (equal) {
            const propertyName = getPropertyName(rawParts[equal[1]]);
            parts[equal[1]] = [
              compileIndex,
              resolveProperty(name, propertyName, isSVG),
            ];
            node.removeAttribute(attr.name);
          } else {
            const results = value.match(PLACEHOLDER_REGEXP_ALL);
            if (results) {
              const partialName = `attr__${name}`;

              results.forEach((placeholder, index) => {
                const [, id] = placeholder.match(PLACEHOLDER_REGEXP_EQUAL);
                let isProp = false;
                parts[id] = [
                  compileIndex,
                  (host, target, attrValue) => {
                    const data = dataMap.get(target, {});
                    data[partialName] = (data[partialName] || value).replace(
                      placeholder,
                      attrValue == null ? "" : attrValue,
                    );

                    if (results.length === 1 || index + 1 === results.length) {
                      isProp =
                        isProp ||
                        (!isSVG &&
                          !(target instanceof global.SVGElement) &&
                          name in target);
                      if (isProp) {
                        target[name] = data[partialName];
                      } else {
                        target.setAttribute(name, data[partialName]);
                      }
                      data[partialName] = undefined;
                    }
                  },
                ];
              });

              attr.value = "";
            }
          }
        });
      }
    }

    compileIndex += 1;
  }

  if (probablyDevMode && notDefinedElements.length) {
    console.warn(
      `Not defined ${notDefinedElements
        .map((e) => `<${e}>`)
        .join(", ")} element${
        notDefinedElements.length > 1 ? "s" : ""
      } found in the template:\n${beautifyTemplateLog(signature, -1)}`,
    );
  }

  return function updateTemplateInstance(host, target, args, styleSheets) {
    const data = dataMap.get(target, { type: "function" });

    if (template !== data.template) {
      if (data.template || target.nodeType !== global.Node.TEXT_NODE) {
        removeTemplate(target);
      }

      data.prevArgs = null;

      const fragment = global.document.importNode(
        applyShadyCSS(template, host.tagName).content,
        true,
      );

      const renderWalker = createWalker(fragment);
      const clonedParts = parts.slice(0);

      let renderIndex = 0;
      let currentPart = clonedParts.shift();

      const markers = [];

      data.template = template;
      data.markers = markers;

      while (renderWalker.nextNode()) {
        const node = renderWalker.currentNode;

        while (currentPart && currentPart[0] === renderIndex) {
          markers.push([node, currentPart[1]]);
          currentPart = clonedParts.shift();
        }

        renderIndex += 1;
      }

      if (target.nodeType === global.Node.TEXT_NODE) {
        data.startNode = fragment.childNodes[0];
        data.endNode = fragment.childNodes[fragment.childNodes.length - 1];

        let previousChild = target;

        let child = fragment.childNodes[0];
        while (child) {
          target.parentNode.insertBefore(child, previousChild.nextSibling);
          previousChild = child;
          child = fragment.childNodes[0];
        }
      } else {
        target.appendChild(fragment);
      }
    }

    const adoptedStyleSheets = target.adoptedStyleSheets;
    if (styleSheets) {
      let isEqual = false;

      styleSheets = styleSheets.map((style) => {
        if (style instanceof global.CSSStyleSheet) return style;

        let styleSheet = styleSheetsMap.get(style);
        if (!styleSheet) {
          styleSheet = new global.CSSStyleSheet();
          styleSheet.replaceSync(style);
          styleSheetsMap.set(style, styleSheet);
        }
        return styleSheet;
      });

      if (styleSheets.length === adoptedStyleSheets.length) {
        isEqual = true;
        for (let i = 0; i < styleSheets.length; i += 1) {
          if (styleSheets[i] !== adoptedStyleSheets[i]) {
            isEqual = false;
            break;
          }
        }
      }

      if (!isEqual) target.adoptedStyleSheets = styleSheets;
    } else if (adoptedStyleSheets && adoptedStyleSheets.length) {
      target.adoptedStyleSheets = [];
    }

    const prevArgs = data.prevArgs;
    data.prevArgs = args;

    for (let index = 0; index < data.markers.length; index += 1) {
      if (prevArgs && prevArgs[index] === args[index]) continue; // eslint-disable-line no-continue
      const [node, marker] = data.markers[index];

      try {
        marker(host, node, args[index], prevArgs && prevArgs[index]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          `Following error was thrown when updating a template expression in ${stringifyElement(
            host,
          )}\n${beautifyTemplateLog(signature, index)}`,
        );
        throw error;
      }
    }

    if (target.nodeType !== global.Node.TEXT_NODE) {
      shadyCSS((shady) => {
        if (host.shadowRoot) {
          if (prevArgs) {
            shady.styleSubtree(host);
          } else {
            shady.styleElement(host);
          }
        }
      });
    }
  };
};exports.compileTemplate = compileTemplate

}, function(modId) { var map = {"../global.js":1652148901790,"../utils.js":1652148901793,"./utils.js":1652148901800,"./resolvers/value.js":1652148901801,"./resolvers/property.js":1652148901804}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901800, function(require, module, exports) {
var __TEMP__ = require('../global.js');var global = __REQUIRE_DEFAULT__(__TEMP__);

const map = new WeakMap();
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var dataMap = exports.dataMap = {
  get(key, defaultValue) {
    const value = map.get(key);
    if (value) return value;

    if (defaultValue) {
      map.set(key, defaultValue);
    }

    return defaultValue;
  },
  set(key, value) {
    map.set(key, value);
    return value;
  },
};

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function getTemplateEnd(node) {
  let data;
  // eslint-disable-next-line no-cond-assign
  while (node && (data = dataMap.get(node)) && data.endNode) {
    node = data.endNode;
  }

  return node;
};exports.getTemplateEnd = getTemplateEnd

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function removeTemplate(target) {
  if (target.nodeType !== global.Node.TEXT_NODE) {
    let child = target.childNodes[0];
    while (child) {
      target.removeChild(child);
      child = target.childNodes[0];
    }
  } else {
    const data = dataMap.get(target);

    if (data.startNode) {
      const endNode = getTemplateEnd(data.endNode);

      let node = data.startNode;
      const lastNextSibling = endNode.nextSibling;

      while (node) {
        const nextSibling = node.nextSibling;
        node.parentNode.removeChild(node);
        node = nextSibling !== lastNextSibling && nextSibling;
      }
    }
  }
};exports.removeTemplate = removeTemplate

}, function(modId) { var map = {"../global.js":1652148901790}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901801, function(require, module, exports) {
var __TEMP__ = require('../../global.js');var global = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('../utils.js');var dataMap = __TEMP__['dataMap'];var removeTemplate = __TEMP__['removeTemplate'];
var __TEMP__ = require('./array.js');var resolveArray = __REQUIRE_DEFAULT__(__TEMP__);var arrayMap = __TEMP__['arrayMap'];
var __TEMP__ = require('./node.js');var resolveNode = __REQUIRE_DEFAULT__(__TEMP__);

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function resolveValue(host, target, value, lastValue) {
  let type = typeof value;
  if (Array.isArray(value)) {
    type = "array";
  } else if (value instanceof global.Node) {
    type = "node";
  }

  let data = dataMap.get(target, {});

  if (data.type !== type) {
    removeTemplate(target);
    if (type === "array") arrayMap.delete(target);

    data = dataMap.set(target, { type });

    if (target.textContent !== "") {
      target.textContent = "";
    }
  }

  switch (type) {
    case "function":
      value(host, target);
      break;
    case "array":
      resolveArray(host, target, value, resolveValue);
      break;
    case "node":
      resolveNode(host, target, value, lastValue);
      break;
    default:
      target.textContent = type === "number" || value ? value : "";
  }
};exports.default = resolveValue

}, function(modId) { var map = {"../../global.js":1652148901790,"../utils.js":1652148901800,"./array.js":1652148901802,"./node.js":1652148901803}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901802, function(require, module, exports) {
var __TEMP__ = require('../../global.js');var global = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('../utils.js');var dataMap = __TEMP__['dataMap'];var removeTemplate = __TEMP__['removeTemplate'];var getTemplateEnd = __TEMP__['getTemplateEnd'];

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var arrayMap = exports.arrayMap = new WeakMap();

function movePlaceholder(target, previousSibling) {
  const data = dataMap.get(target);
  const startNode = data.startNode;
  const endNode = getTemplateEnd(data.endNode);

  previousSibling.parentNode.insertBefore(target, previousSibling.nextSibling);

  let prevNode = target;
  let node = startNode;
  while (node) {
    const nextNode = node.nextSibling;
    prevNode.parentNode.insertBefore(node, prevNode.nextSibling);
    prevNode = node;
    node = nextNode !== endNode.nextSibling && nextNode;
  }
}

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function resolveArray(host, target, value, resolveValue) {
  let lastEntries = arrayMap.get(target);
  const entries = value.map((item, index) => ({
    id: hasOwnProperty.call(item, "id") ? item.id : index,
    value: item,
    placeholder: null,
    available: true,
  }));

  arrayMap.set(target, entries);

  if (lastEntries) {
    const ids = new Set();
    entries.forEach((entry) => ids.add(entry.id));

    lastEntries = lastEntries.filter((entry) => {
      if (!ids.has(entry.id)) {
        removeTemplate(entry.placeholder);
        entry.placeholder.parentNode.removeChild(entry.placeholder);
        return false;
      }

      return true;
    });
  }

  let previousSibling = target;
  const lastIndex = value.length - 1;
  const data = dataMap.get(target);

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    let matchedEntry;
    if (lastEntries) {
      for (let i = 0; i < lastEntries.length; i += 1) {
        if (lastEntries[i].available && lastEntries[i].id === entry.id) {
          matchedEntry = lastEntries[i];
          break;
        }
      }
    }

    if (matchedEntry) {
      matchedEntry.available = false;
      entry.placeholder = matchedEntry.placeholder;

      if (entry.placeholder.previousSibling !== previousSibling) {
        movePlaceholder(entry.placeholder, previousSibling);
      }
      if (matchedEntry.value !== entry.value) {
        resolveValue(host, entry.placeholder, entry.value, matchedEntry.value);
      }
    } else {
      entry.placeholder = global.document.createTextNode("");
      previousSibling.parentNode.insertBefore(
        entry.placeholder,
        previousSibling.nextSibling,
      );
      resolveValue(host, entry.placeholder, entry.value);
    }

    previousSibling = getTemplateEnd(
      dataMap.get(entry.placeholder).endNode || entry.placeholder,
    );

    if (index === 0) data.startNode = entry.placeholder;
    if (index === lastIndex) data.endNode = previousSibling;
  }

  if (lastEntries) {
    lastEntries.forEach((entry) => {
      if (entry.available) {
        removeTemplate(entry.placeholder);
        entry.placeholder.parentNode.removeChild(entry.placeholder);
      }
    });
  }
};exports.default = resolveArray

}, function(modId) { var map = {"../../global.js":1652148901790,"../utils.js":1652148901800}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901803, function(require, module, exports) {
var __TEMP__ = require('../utils.js');var dataMap = __TEMP__['dataMap'];

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function resolveNode(host, target, value, lastValue) {
  const data = dataMap.get(target, {});

  if (lastValue) lastValue.parentNode.removeChild(lastValue);

  data.startNode = value;
  data.endNode = value;

  target.parentNode.insertBefore(value, target.nextSibling);
};exports.default = resolveNode

}, function(modId) { var map = {"../utils.js":1652148901800}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901804, function(require, module, exports) {
var __TEMP__ = require('../../global.js');var global = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./event.js');var resolveEventListener = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./class.js');var resolveClassList = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./style.js');var resolveStyleList = __REQUIRE_DEFAULT__(__TEMP__);

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function resolveProperty(attrName, propertyName, isSVG) {
  if (propertyName.substr(0, 2) === "on") {
    const eventType = propertyName.substr(2);
    return resolveEventListener(eventType);
  }

  switch (attrName) {
    case "class":
      return resolveClassList;
    case "style":
      return resolveStyleList;
    default: {
      let isProp = false;
      return (host, target, value) => {
        isProp =
          isProp ||
          (!isSVG &&
            !(target instanceof global.SVGElement) &&
            propertyName in target);
        if (isProp) {
          target[propertyName] = value;
        } else if (value === false || value === undefined || value === null) {
          target.removeAttribute(attrName);
        } else {
          const attrValue = value === true ? "" : String(value);
          target.setAttribute(attrName, attrValue);
        }
      };
    }
  }
};exports.default = resolveProperty

}, function(modId) { var map = {"../../global.js":1652148901790,"./event.js":1652148901805,"./class.js":1652148901806,"./style.js":1652148901807}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901805, function(require, module, exports) {
const targets = new WeakMap();

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function resolveEventListener(eventType) {
  return (host, target, value, lastValue) => {
    if (lastValue) {
      const eventMap = targets.get(target);
      if (eventMap) {
        target.removeEventListener(
          eventType,
          eventMap.get(lastValue),
          lastValue.options !== undefined ? lastValue.options : false,
        );
      }
    }

    if (value) {
      if (typeof value !== "function") {
        throw Error(`Event listener must be a function: ${typeof value}`);
      }

      let eventMap = targets.get(target);
      if (!eventMap) {
        eventMap = new WeakMap();
        targets.set(target, eventMap);
      }

      const callback = value.bind(null, host);
      eventMap.set(value, callback);

      target.addEventListener(
        eventType,
        callback,
        value.options !== undefined ? value.options : false,
      );
    }
  };
};exports.default = resolveEventListener

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901806, function(require, module, exports) {
function normalizeValue(value, set = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((className) => set.add(className));
  } else if (value !== null && typeof value === "object") {
    Object.keys(value).forEach((key) => value[key] && set.add(key));
  } else {
    set.add(value);
  }

  return set;
}

const classMap = new WeakMap();

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function resolveClassList(host, target, value) {
  const previousList = classMap.get(target) || new Set();
  const list = normalizeValue(value);

  classMap.set(target, list);

  list.forEach((className) => {
    target.classList.add(className);
    previousList.delete(className);
  });

  previousList.forEach((className) => {
    target.classList.remove(className);
  });
};exports.default = resolveClassList

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901807, function(require, module, exports) {
var __TEMP__ = require('../../utils.js');var camelToDash = __TEMP__['camelToDash'];var stringifyElement = __TEMP__['stringifyElement'];

const styleMap = new WeakMap();

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function resolveStyle(host, target, value) {
  if (value === null || typeof value !== "object") {
    throw TypeError(
      `Style value must be an object in ${stringifyElement(target)}:`,
      value,
    );
  }

  const previousMap = styleMap.get(target) || new Map();

  const nextMap = Object.keys(value).reduce((map, key) => {
    const dashKey = camelToDash(key);
    const styleValue = value[key];

    if (!styleValue && styleValue !== 0) {
      target.style.removeProperty(dashKey);
    } else {
      target.style.setProperty(dashKey, styleValue);
    }

    map.set(dashKey, styleValue);
    previousMap.delete(dashKey);

    return map;
  }, new Map());

  previousMap.forEach((styleValue, key) => {
    target.style[key] = "";
  });

  styleMap.set(target, nextMap);
};exports.default = resolveStyle

}, function(modId) { var map = {"../../utils.js":1652148901793}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1652148901808, function(require, module, exports) {
var __TEMP__ = require('../global.js');var global = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('../utils.js');var storePointer = __TEMP__['storePointer'];
var __TEMP__ = require('./resolvers/value.js');var resolveTemplateValue = __REQUIRE_DEFAULT__(__TEMP__);

function resolveValue({ target, detail }, setter) {
  let value;

  switch (target.type) {
    case "radio":
    case "checkbox":
      value = target.checked && target.value;
      break;
    case "file":
      value = target.files;
      break;
    default:
      value =
        detail && hasOwnProperty.call(detail, "value")
          ? detail.value
          : target.value;
  }

  setter(value);
}

function getPartialObject(name, value) {
  return name
    .split(".")
    .reverse()
    .reduce((acc, key) => {
      if (!acc) return { [key]: value };
      return { [key]: acc };
    }, null);
}

const stringCache = new Map();
const storeValues = new WeakMap();

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function set(property, valueOrPath) {
  if (!property) {
    throw Error(
      `The first argument must be a property name or an object instance: ${property}`,
    );
  }

  if (typeof property === "object") {
    if (valueOrPath === undefined) {
      throw Error(
        "For model instance property the second argument must be defined",
      );
    }

    const store = storePointer.get(property);

    if (!store) {
      throw Error("Provided object must be a model instance of the store");
    }

    if (valueOrPath === null) {
      return () => {
        store.set(property, null);
      };
    }

    return (host, event) => {
      resolveValue(event, (value) => {
        const values = storeValues.get(property);

        if (!values) {
          global.requestAnimationFrame(() => {
            const result = storeValues.get(property);
            storeValues.delete(property);

            store
              .set(property, result)
              .catch(/* istanbul ignore next */ () => {});
          });
        }

        storeValues.set(property, {
          ...values,
          ...getPartialObject(valueOrPath, value),
        });
      });
    };
  }

  if (arguments.length === 2) {
    return (host) => {
      host[property] = valueOrPath;
    };
  }

  let fn = stringCache.get(property);

  if (!fn) {
    fn = (host, event) => {
      resolveValue(event, (value) => {
        host[property] = value;
      });
    };

    stringCache.set(property, fn);
  }

  return fn;
};exports.set = set

const promiseMap = new WeakMap();
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function resolve(promise, placeholder, delay = 200) {
  return (host, target) => {
    let timeout;

    if (placeholder) {
      timeout = setTimeout(() => {
        timeout = undefined;

        global.requestAnimationFrame(() => {
          placeholder(host, target);
        });
      }, delay);
    }

    promiseMap.set(target, promise);

    promise.then((value) => {
      if (timeout) clearTimeout(timeout);

      if (promiseMap.get(target) === promise) {
        resolveTemplateValue(host, target, value);
        promiseMap.set(target, null);
      }
    });
  };
};exports.resolve = resolve

}, function(modId) { var map = {"../global.js":1652148901790,"../utils.js":1652148901793,"./resolvers/value.js":1652148901801}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1652148901788);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map