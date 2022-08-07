
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line es-x/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var functionBindNative = !fails(function () {
	  // eslint-disable-next-line es-x/no-function-prototype-bind -- safe
	  var test = (function () { /* empty */ }).bind();
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return typeof test != 'function' || test.hasOwnProperty('prototype');
	});

	var FunctionPrototype = Function.prototype;
	var apply = FunctionPrototype.apply;
	var call = FunctionPrototype.call;

	// eslint-disable-next-line es-x/no-reflect -- safe
	var functionApply = typeof Reflect == 'object' && Reflect.apply || (functionBindNative ? call.bind(apply) : function () {
	  return call.apply(apply, arguments);
	});

	var FunctionPrototype$1 = Function.prototype;
	var bind = FunctionPrototype$1.bind;
	var call$1 = FunctionPrototype$1.call;
	var uncurryThis = functionBindNative && bind.bind(call$1, call$1);

	var functionUncurryThis = functionBindNative ? function (fn) {
	  return fn && uncurryThis(fn);
	} : function (fn) {
	  return fn && function () {
	    return call$1.apply(fn, arguments);
	  };
	};

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	var isCallable = function (argument) {
	  return typeof argument == 'function';
	};

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails(function () {
	  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var call$2 = Function.prototype.call;

	var functionCall = functionBindNative ? call$2.bind(call$2) : function () {
	  return call$2.apply(call$2, arguments);
	};

	var $propertyIsEnumerable = {}.propertyIsEnumerable;
	// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = functionUncurryThis({}.toString);
	var stringSlice = functionUncurryThis(''.slice);

	var classofRaw = function (it) {
	  return stringSlice(toString(it), 8, -1);
	};

	var $Object = Object;
	var split = functionUncurryThis(''.split);

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !$Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split(it, '') : $Object(it);
	} : $Object;

	var $TypeError = TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw $TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable(it);
	};

	var path = {};

	var aFunction = function (variable) {
	  return isCallable(variable) ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var Deno = global_1.Deno;
	var versions = process && process.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us
	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version && engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	var engineV8Version = version;

	/* eslint-disable es-x/no-symbol -- required for testing */



	// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- required for testing
	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  var symbol = Symbol();
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && engineV8Version && engineV8Version < 41;
	});

	/* eslint-disable es-x/no-symbol -- required for testing */


	var useSymbolAsUid = nativeSymbol
	  && !Symbol.sham
	  && typeof Symbol.iterator == 'symbol';

	var $Object$1 = Object;

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn('Symbol');
	  return isCallable($Symbol) && objectIsPrototypeOf($Symbol.prototype, $Object$1(it));
	};

	var $String = String;

	var tryToString = function (argument) {
	  try {
	    return $String(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var $TypeError$1 = TypeError;

	// `Assert: IsCallable(argument) is true`
	var aCallable = function (argument) {
	  if (isCallable(argument)) return argument;
	  throw $TypeError$1(tryToString(argument) + ' is not a function');
	};

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod = function (V, P) {
	  var func = V[P];
	  return func == null ? undefined : aCallable(func);
	};

	var $TypeError$2 = TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
	  if (isCallable(fn = input.valueOf) && !isObject(val = functionCall(fn, input))) return val;
	  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
	  throw $TypeError$2("Can't convert object to primitive value");
	};

	// eslint-disable-next-line es-x/no-object-defineproperty -- safe
	var defineProperty = Object.defineProperty;

	var defineGlobalProperty = function (key, value) {
	  try {
	    defineProperty(global_1, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || defineGlobalProperty(SHARED, {});

	var sharedStore = store;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.24.1',
	  mode:  'pure' ,
	  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
	  license: 'https://github.com/zloirock/core-js/blob/v3.24.1/LICENSE',
	  source: 'https://github.com/zloirock/core-js'
	});
	});

	var $Object$2 = Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return $Object$2(requireObjectCoercible(argument));
	};

	var hasOwnProperty = functionUncurryThis({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	// eslint-disable-next-line es-x/no-object-hasown -- safe
	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject(it), key);
	};

	var id = 0;
	var postfix = Math.random();
	var toString$1 = functionUncurryThis(1.0.toString);

	var uid = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$1(++id + postfix, 36);
	};

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var symbolFor = Symbol$1 && Symbol$1['for'];
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!hasOwnProperty_1(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
	    var description = 'Symbol.' + name;
	    if (nativeSymbol && hasOwnProperty_1(Symbol$1, name)) {
	      WellKnownSymbolsStore[name] = Symbol$1[name];
	    } else if (useSymbolAsUid && symbolFor) {
	      WellKnownSymbolsStore[name] = symbolFor(description);
	    } else {
	      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
	    }
	  } return WellKnownSymbolsStore[name];
	};

	var $TypeError$3 = TypeError;
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive = function (input, pref) {
	  if (!isObject(input) || isSymbol(input)) return input;
	  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = functionCall(exoticToPrim, input, pref);
	    if (!isObject(result) || isSymbol(result)) return result;
	    throw $TypeError$3("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thanks to IE8 for its funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPropertyKey(P);
	  if (ie8DomDefine) try {
	    return $getOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (hasOwnProperty_1(O, P)) return createPropertyDescriptor(!functionCall(objectPropertyIsEnumerable.f, O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : isCallable(detection) ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var bind$1 = functionUncurryThis(functionUncurryThis.bind);

	// optional / simple context binding
	var functionBindContext = function (fn, that) {
	  aCallable(fn);
	  return that === undefined ? fn : functionBindNative ? bind$1(fn, that) : function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	// V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334
	var v8PrototypeDefineBug = descriptors && fails(function () {
	  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
	  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
	    value: 42,
	    writable: false
	  }).prototype != 42;
	});

	var $String$1 = String;
	var $TypeError$4 = TypeError;

	// `Assert: Type(argument) is Object`
	var anObject = function (argument) {
	  if (isObject(argument)) return argument;
	  throw $TypeError$4($String$1(argument) + ' is not an object');
	};

	var $TypeError$5 = TypeError;
	// eslint-disable-next-line es-x/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;
	// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE = 'configurable';
	var WRITABLE = 'writable';

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? v8PrototypeDefineBug ? function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	    var current = $getOwnPropertyDescriptor$1(O, P);
	    if (current && current[WRITABLE]) {
	      O[P] = Attributes.value;
	      Attributes = {
	        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	        writable: false
	      };
	    }
	  } return $defineProperty(O, P, Attributes);
	} : $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw $TypeError$5('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	var wrapConstructor = function (NativeConstructor) {
	  var Wrapper = function (a, b, c) {
	    if (this instanceof Wrapper) {
	      switch (arguments.length) {
	        case 0: return new NativeConstructor();
	        case 1: return new NativeConstructor(a);
	        case 2: return new NativeConstructor(a, b);
	      } return new NativeConstructor(a, b, c);
	    } return functionApply(NativeConstructor, this, arguments);
	  };
	  Wrapper.prototype = NativeConstructor.prototype;
	  return Wrapper;
	};

	/*
	  options.target         - name of the target object
	  options.global         - target is the global object
	  options.stat           - export as static methods of target
	  options.proto          - export as prototype methods of target
	  options.real           - real prototype method for the `pure` version
	  options.forced         - export even if the native feature is available
	  options.bind           - bind methods to the target, required for the `pure` version
	  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
	  options.sham           - add a flag to not completely full polyfills
	  options.enumerable     - export as enumerable property
	  options.dontCallGetSet - prevent calling a getter on target
	  options.name           - the .name of the function if it does not match the key
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var PROTO = options.proto;

	  var nativeSource = GLOBAL ? global_1 : STATIC ? global_1[TARGET] : (global_1[TARGET] || {}).prototype;

	  var target = GLOBAL ? path : path[TARGET] || createNonEnumerableProperty(path, TARGET, {})[TARGET];
	  var targetPrototype = target.prototype;

	  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
	  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

	  for (key in source) {
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contains in native
	    USE_NATIVE = !FORCED && nativeSource && hasOwnProperty_1(nativeSource, key);

	    targetProperty = target[key];

	    if (USE_NATIVE) if (options.dontCallGetSet) {
	      descriptor = getOwnPropertyDescriptor$1(nativeSource, key);
	      nativeProperty = descriptor && descriptor.value;
	    } else nativeProperty = nativeSource[key];

	    // export native or implementation
	    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

	    if (USE_NATIVE && typeof targetProperty == typeof sourceProperty) continue;

	    // bind timers to global for call from export context
	    if (options.bind && USE_NATIVE) resultProperty = functionBindContext(sourceProperty, global_1);
	    // wrap global constructors for prevent changs in this version
	    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
	    // make static versions for prototype methods
	    else if (PROTO && isCallable(sourceProperty)) resultProperty = functionUncurryThis(sourceProperty);
	    // default case
	    else resultProperty = sourceProperty;

	    // add a flag to not completely full polyfills
	    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(resultProperty, 'sham', true);
	    }

	    createNonEnumerableProperty(target, key, resultProperty);

	    if (PROTO) {
	      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
	      if (!hasOwnProperty_1(path, VIRTUAL_PROTOTYPE)) {
	        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
	      }
	      // export virtual prototype methods
	      createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE], key, sourceProperty);
	      // export real prototype methods
	      if (options.real && targetPrototype && !targetPrototype[key]) {
	        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
	      }
	    }
	  }
	};

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	var $Object$3 = Object;

	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = $Object$3(it), TO_STRING_TAG$1)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
	};

	var $String$2 = String;

	var toString_1 = function (argument) {
	  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
	  return $String$2(argument);
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `Math.trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	// eslint-disable-next-line es-x/no-math-trunc -- safe
	var mathTrunc = Math.trunc || function trunc(x) {
	  var n = +x;
	  return (n > 0 ? floor : ceil)(n);
	};

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	var toIntegerOrInfinity = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return number !== number || number === 0 ? 0 : mathTrunc(number);
	};

	var max = Math.max;
	var min = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toIntegerOrInfinity(index);
	  return integer < 0 ? max(integer + length, 0) : min(integer, length);
	};

	var min$1 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min$1(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	var lengthOfArrayLike = function (obj) {
	  return toLength(obj.length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = lengthOfArrayLike(O);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var hiddenKeys = {};

	var indexOf = arrayIncludes.indexOf;


	var push = functionUncurryThis([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !hasOwnProperty_1(hiddenKeys, key) && hasOwnProperty_1(O, key) && push(result, key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (hasOwnProperty_1(O, key = names[i++])) {
	    ~indexOf(result, key) || push(result, key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es-x/no-object-keys -- safe
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es-x/no-object-defineproperties -- safe
	var f$3 = descriptors && !v8PrototypeDefineBug ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var props = toIndexedObject(Properties);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], props[key]);
	  return O;
	};

	var objectDefineProperties = {
		f: f$3
	};

	var html = getBuiltIn('document', 'documentElement');

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	/* global ActiveXObject -- old IE, WSH */








	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = typeof document != 'undefined'
	    ? document.domain && activeXDocument
	      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	      : NullProtoObjectViaIFrame()
	    : NullProtoObjectViaActiveX(activeXDocument); // WSH
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	// eslint-disable-next-line es-x/no-object-create -- safe
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties.f(result, Properties);
	};

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es-x/no-object-getownpropertynames -- safe
	var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$4
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPropertyKey(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var $Array = Array;
	var max$1 = Math.max;

	var arraySliceSimple = function (O, start, end) {
	  var length = lengthOfArrayLike(O);
	  var k = toAbsoluteIndex(start, length);
	  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	  var result = $Array(max$1(fin - k, 0));
	  for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
	  result.length = n;
	  return result;
	};

	/* eslint-disable es-x/no-object-getownpropertynames -- safe */


	var $getOwnPropertyNames = objectGetOwnPropertyNames.f;


	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return $getOwnPropertyNames(it);
	  } catch (error) {
	    return arraySliceSimple(windowNames);
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$5 = function getOwnPropertyNames(it) {
	  return windowNames && classofRaw(it) == 'Window'
	    ? getWindowNames(it)
	    : $getOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$5
	};

	// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- safe
	var f$6 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$6
	};

	var defineBuiltIn = function (target, key, value, options) {
	  if (options && options.enumerable) target[key] = value;
	  else createNonEnumerableProperty(target, key, value);
	  return target;
	};

	var f$7 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$7
	};

	var defineProperty$1 = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!hasOwnProperty_1(Symbol, NAME)) defineProperty$1(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  });
	};

	var symbolDefineToPrimitive = function () {
	  var Symbol = getBuiltIn('Symbol');
	  var SymbolPrototype = Symbol && Symbol.prototype;
	  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
	  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

	  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
	    // `Symbol.prototype[@@toPrimitive]` method
	    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	    // eslint-disable-next-line no-unused-vars -- required for .length
	    defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function (hint) {
	      return functionCall(valueOf, this);
	    }, { arity: 1 });
	  }
	};

	// `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	var defineProperty$2 = objectDefineProperty.f;





	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC, SET_METHOD) {
	  if (it) {
	    var target = STATIC ? it : it.prototype;
	    if (!hasOwnProperty_1(target, TO_STRING_TAG$2)) {
	      defineProperty$2(target, TO_STRING_TAG$2, { configurable: true, value: TAG });
	    }
	    if (SET_METHOD && !toStringTagSupport) {
	      createNonEnumerableProperty(target, 'toString', objectToString);
	    }
	  }
	};

	var functionToString = functionUncurryThis(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable(sharedStore.inspectSource)) {
	  sharedStore.inspectSource = function (it) {
	    return functionToString(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;

	var nativeWeakMap = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$1 = global_1.TypeError;
	var WeakMap$1 = global_1.WeakMap;
	var set, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError$1('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap || sharedStore.state) {
	  var store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
	  var wmget = functionUncurryThis(store$1.get);
	  var wmhas = functionUncurryThis(store$1.has);
	  var wmset = functionUncurryThis(store$1.set);
	  set = function (it, metadata) {
	    if (wmhas(store$1, it)) throw new TypeError$1(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    wmset(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget(store$1, it) || {};
	  };
	  has = function (it) {
	    return wmhas(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    if (hasOwnProperty_1(it, STATE)) throw new TypeError$1(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return hasOwnProperty_1(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es-x/no-array-isarray -- safe
	var isArray = Array.isArray || function isArray(argument) {
	  return classofRaw(argument) == 'Array';
	};

	var noop = function () { /* empty */ };
	var empty = [];
	var construct = getBuiltIn('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec = functionUncurryThis(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

	var isConstructorModern = function isConstructor(argument) {
	  if (!isCallable(argument)) return false;
	  try {
	    construct(noop, empty, argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function isConstructor(argument) {
	  if (!isCallable(argument)) return false;
	  switch (classof(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction': return false;
	  }
	  try {
	    // we can't check .prototype since constructors produced by .bind haven't it
	    // `Function#toString` throws on some built-it function in some legacy engines
	    // (for example, `DOMQuad` and similar in FF41-)
	    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
	  } catch (error) {
	    return true;
	  }
	};

	isConstructorLegacy.sham = true;

	// `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor
	var isConstructor = !construct || fails(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call)
	    || !isConstructorModern(Object)
	    || !isConstructorModern(function () { called = true; })
	    || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var SPECIES = wellKnownSymbol('species');
	var $Array$1 = Array;

	// a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesConstructor = function (originalArray) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (isConstructor(C) && (C === $Array$1 || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? $Array$1 : C;
	};

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
	};

	var push$1 = functionUncurryThis([].push);

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var IS_FILTER_REJECT = TYPE == 7;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that);
	    var length = lengthOfArrayLike(self);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push$1(target, value);      // filter
	        } else switch (TYPE) {
	          case 4: return false;             // every
	          case 7: push$1(target, value);      // filterReject
	        }
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.es/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6),
	  // `Array.prototype.filterReject` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterReject: createMethod$1(7)
	};

	var $forEach = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';

	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(SYMBOL);

	var ObjectPrototype = Object[PROTOTYPE$1];
	var $Symbol = global_1.Symbol;
	var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE$1];
	var TypeError$2 = global_1.TypeError;
	var QObject = global_1.QObject;
	var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty = objectDefineProperty.f;
	var nativeGetOwnPropertyNames = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable = objectPropertyIsEnumerable.f;
	var push$2 = functionUncurryThis([].push);

	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var WellKnownSymbolsStore$1 = shared('wks');

	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty({}, 'a', {
	    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
	  nativeDefineProperty(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
	    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate(SymbolPrototype);
	  setInternalState(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var $defineProperty$1 = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype) $defineProperty$1(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPropertyKey(P);
	  anObject(Attributes);
	  if (hasOwnProperty_1(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!hasOwnProperty_1(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (hasOwnProperty_1(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!descriptors || functionCall($propertyIsEnumerable$1, properties, key)) $defineProperty$1(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable$1 = function propertyIsEnumerable(V) {
	  var P = toPropertyKey(V);
	  var enumerable = functionCall(nativePropertyIsEnumerable, this, P);
	  if (this === ObjectPrototype && hasOwnProperty_1(AllSymbols, P) && !hasOwnProperty_1(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !hasOwnProperty_1(this, P) || !hasOwnProperty_1(AllSymbols, P) || hasOwnProperty_1(this, HIDDEN) && this[HIDDEN][P]
	    ? enumerable : true;
	};

	var $getOwnPropertyDescriptor$2 = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPropertyKey(P);
	  if (it === ObjectPrototype && hasOwnProperty_1(AllSymbols, key) && !hasOwnProperty_1(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
	  if (descriptor && hasOwnProperty_1(AllSymbols, key) && !(hasOwnProperty_1(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames$1 = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!hasOwnProperty_1(AllSymbols, key) && !hasOwnProperty_1(hiddenKeys, key)) push$2(result, key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function (O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
	  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (hasOwnProperty_1(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwnProperty_1(ObjectPrototype, key))) {
	      push$2(result, AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.es/ecma262/#sec-symbol-constructor
	if (!nativeSymbol) {
	  $Symbol = function Symbol() {
	    if (objectIsPrototypeOf(SymbolPrototype, this)) throw TypeError$2('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : toString_1(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype) functionCall(setter, ObjectPrototypeSymbols, value);
	      if (hasOwnProperty_1(this, HIDDEN) && hasOwnProperty_1(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };

	  SymbolPrototype = $Symbol[PROTOTYPE$1];

	  defineBuiltIn(SymbolPrototype, 'toString', function toString() {
	    return getInternalState(this).tag;
	  });

	  defineBuiltIn($Symbol, 'withoutSetter', function (description) {
	    return wrap(uid(description), description);
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable$1;
	  objectDefineProperty.f = $defineProperty$1;
	  objectDefineProperties.f = $defineProperties;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor$2;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames$1;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  wellKnownSymbolWrapped.f = function (name) {
	    return wrap(wellKnownSymbol(name), name);
	  };

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty(SymbolPrototype, 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState(this).description;
	      }
	    });
	  }
	}

	_export({ global: true, constructor: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
	  Symbol: $Symbol
	});

	$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
	  defineWellKnownSymbol(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
	  // `Object.create` method
	  // https://tc39.es/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.es/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty$1,
	  // `Object.defineProperties` method
	  // https://tc39.es/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor$2
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames$1
	});

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	symbolDefineToPrimitive();

	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys[HIDDEN] = true;

	/* eslint-disable es-x/no-symbol -- safe */
	var nativeSymbolRegistry = nativeSymbol && !!Symbol['for'] && !!Symbol.keyFor;

	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');

	// `Symbol.for` method
	// https://tc39.es/ecma262/#sec-symbol.for
	_export({ target: 'Symbol', stat: true, forced: !nativeSymbolRegistry }, {
	  'for': function (key) {
	    var string = toString_1(key);
	    if (hasOwnProperty_1(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = getBuiltIn('Symbol')(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  }
	});

	var SymbolToStringRegistry$1 = shared('symbol-to-string-registry');

	// `Symbol.keyFor` method
	// https://tc39.es/ecma262/#sec-symbol.keyfor
	_export({ target: 'Symbol', stat: true, forced: !nativeSymbolRegistry }, {
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(tryToString(sym) + ' is not a symbol');
	    if (hasOwnProperty_1(SymbolToStringRegistry$1, sym)) return SymbolToStringRegistry$1[sym];
	  }
	});

	var arraySlice = functionUncurryThis([].slice);

	var $stringify = getBuiltIn('JSON', 'stringify');
	var exec$1 = functionUncurryThis(/./.exec);
	var charAt = functionUncurryThis(''.charAt);
	var charCodeAt = functionUncurryThis(''.charCodeAt);
	var replace = functionUncurryThis(''.replace);
	var numberToString = functionUncurryThis(1.0.toString);

	var tester = /[\uD800-\uDFFF]/g;
	var low = /^[\uD800-\uDBFF]$/;
	var hi = /^[\uDC00-\uDFFF]$/;

	var WRONG_SYMBOLS_CONVERSION = !nativeSymbol || fails(function () {
	  var symbol = getBuiltIn('Symbol')();
	  // MS Edge converts symbol values to JSON as {}
	  return $stringify([symbol]) != '[null]'
	    // WebKit converts symbol values to JSON as null
	    || $stringify({ a: symbol }) != '{}'
	    // V8 throws on boxed symbols
	    || $stringify(Object(symbol)) != '{}';
	});

	// https://github.com/tc39/proposal-well-formed-stringify
	var ILL_FORMED_UNICODE = fails(function () {
	  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
	    || $stringify('\uDEAD') !== '"\\udead"';
	});

	var stringifyWithSymbolsFix = function (it, replacer) {
	  var args = arraySlice(arguments);
	  var $replacer = replacer;
	  if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	  if (!isArray(replacer)) replacer = function (key, value) {
	    if (isCallable($replacer)) value = functionCall($replacer, this, key, value);
	    if (!isSymbol(value)) return value;
	  };
	  args[1] = replacer;
	  return functionApply($stringify, null, args);
	};

	var fixIllFormed = function (match, offset, string) {
	  var prev = charAt(string, offset - 1);
	  var next = charAt(string, offset + 1);
	  if ((exec$1(low, match) && !exec$1(hi, next)) || (exec$1(hi, match) && !exec$1(low, prev))) {
	    return '\\u' + numberToString(charCodeAt(match, 0), 16);
	  } return match;
	};

	if ($stringify) {
	  // `JSON.stringify` method
	  // https://tc39.es/ecma262/#sec-json.stringify
	  _export({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
	    // eslint-disable-next-line no-unused-vars -- required for `.length`
	    stringify: function stringify(it, replacer, space) {
	      var args = arraySlice(arguments);
	      var result = functionApply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
	      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
	    }
	  });
	}

	// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	var FORCED = !nativeSymbol || fails(function () { objectGetOwnPropertySymbols.f(1); });

	// `Object.getOwnPropertySymbols` method
	// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
	_export({ target: 'Object', stat: true, forced: FORCED }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    var $getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
	  }
	});

	var _for = path.Symbol['for'];

	var _for$1 = _for;

	var _for$2 = _for$1;

	var symbolFor$1 = _for$2;
	var REACT_ELEMENT_TYPE = symbolFor$1('react.element');
	var REACT_MEMO_TYPE = symbolFor$1('react.memo');

	var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
	/**
	 *  保留属性，以下属性不会加入到props中,比如<div key="1" ref={null} foo={1}></div>
	 *  构建出来的jsx对象就是这样的 {key: "1", ref: null, props: {foo: 1}}
	 */

	var RESERVED_PROPS = {
	  key: true,
	  ref: true
	};
	/**
	 * jsx转换为javascript时调用的函数比如`<div><div>`就会被转换为React.createElement('div', null)
	 * @param type 该组件的类型，如果时div,p这种浏览器标签就为字符串，如果时Function组件那么就为一个函数
	 * @param config 初始props,包含key和ref经过该函数后会将key和ref抽出
	 * @param children 该组件的children
	 * @returns 返回一个JSX对象
	 */

	function createElement(type, config) {
	  var props = {};
	  var key = null;

	  for (var propName in config) {
	    if (hasOwnProperty$1.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
	      props[propName] = config[propName];
	    }
	  }

	  if (type !== null && type !== void 0 && type.defaultProps) {
	    var defaultProps = type.defaultProps;

	    for (var _propName in defaultProps) {
	      if (props[_propName] === undefined) {
	        props[_propName] = defaultProps[_propName];
	      }
	    }
	  }

	  if ((config === null || config === void 0 ? void 0 : config.key) !== undefined) {
	    key = '' + (config === null || config === void 0 ? void 0 : config.key);
	  }

	  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    children[_key - 2] = arguments[_key];
	  }

	  if (children.length === 1) {
	    props.children = children[0];
	  } else if (children.length > 1) {
	    props.children = children;
	  }

	  var element = {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    props: props
	  };
	  return element;
	}

	/**
	 * 用来保存当前的Dispatcher比如，初次渲染时保存的dispatcher就为HooksDispatcherOnMount
	 * 组件更新时就为HooksDispatcherOnUpdate，
	 * 具体逻辑可以查看react-reconciler/ReactFiberHooks下的renderWithHooks函数
	 */
	var ReactCurrentDispatcher = {
	  current: null
	};

	var ReactSharedInternals = {
	  ReactCurrentDispatcher: ReactCurrentDispatcher
	};

	/**
	 * 取得此时因该使用的Dispatcher,比如首次mount时的dispatcher就为
	 * 就为HooksDispatcherOnMount
	 * 组件更新时就为HooksDispatcherOnUpdate，
	 * 具体逻辑可以查看react-reconciler/ReactFiberHooks下的renderWithHooks函数
	 * @returns 
	 */
	var resolveDispatcher = function resolveDispatcher() {
	  var dispatcher = ReactCurrentDispatcher.current;
	  return dispatcher;
	};
	/**
	 * 更具当前的dispatcher调用对应的useState
	 * @param initialState 初始状态
	 * @returns 
	 */


	var useState = function useState(initialState) {
	  var dispatcher = resolveDispatcher();
	  return dispatcher.useState(initialState);
	};
	var useEffect = function useEffect(create, deps) {
	  var dispatcher = resolveDispatcher();
	  return dispatcher.useEffect(create, deps);
	};

	var React = {
	  createElement: createElement
	};

	var classCallCheck = createCommonjsModule(function (module) {
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _classCallCheck = unwrapExports(classCallCheck);

	var defineProperty$3 = objectDefineProperty.f;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	// eslint-disable-next-line es-x/no-object-defineproperty -- safe
	_export({ target: 'Object', stat: true, forced: Object.defineProperty !== defineProperty$3, sham: !descriptors }, {
	  defineProperty: defineProperty$3
	});

	var defineProperty_1 = createCommonjsModule(function (module) {
	var Object = path.Object;

	var defineProperty = module.exports = function defineProperty(it, key, desc) {
	  return Object.defineProperty(it, key, desc);
	};

	if (Object.defineProperty.sham) defineProperty.sham = true;
	});

	var defineProperty$4 = defineProperty_1;

	var defineProperty$5 = defineProperty$4;

	var defineProperty$6 = defineProperty$5;

	var defineProperty$7 = defineProperty$6;

	var defineProperty$8 = defineProperty$7;

	var createClass = createCommonjsModule(function (module) {
	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;

	    defineProperty$8(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);

	  defineProperty$8(Constructor, "prototype", {
	    writable: false
	  });

	  return Constructor;
	}

	module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _createClass = unwrapExports(createClass);

	var defineProperty$9 = createCommonjsModule(function (module) {
	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    defineProperty$8(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _defineProperty = unwrapExports(defineProperty$9);

	var $TypeError$6 = TypeError;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

	var doesNotExceedSafeInteger = function (it) {
	  if (it > MAX_SAFE_INTEGER) throw $TypeError$6('Maximum allowed index exceeded');
	  return it;
	};

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, arity: 1, forced: FORCED$1 }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  concat: function concat(arg) {
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = lengthOfArrayLike(E);
	        doesNotExceedSafeInteger(n + len);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        doesNotExceedSafeInteger(n + 1);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	// `Symbol.asyncIterator` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.asynciterator
	defineWellKnownSymbol('asyncIterator');

	// `Symbol.hasInstance` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.hasinstance
	defineWellKnownSymbol('hasInstance');

	// `Symbol.isConcatSpreadable` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.isconcatspreadable
	defineWellKnownSymbol('isConcatSpreadable');

	// `Symbol.iterator` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol('iterator');

	// `Symbol.match` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.match
	defineWellKnownSymbol('match');

	// `Symbol.matchAll` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.matchall
	defineWellKnownSymbol('matchAll');

	// `Symbol.replace` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.replace
	defineWellKnownSymbol('replace');

	// `Symbol.search` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.search
	defineWellKnownSymbol('search');

	// `Symbol.species` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.species
	defineWellKnownSymbol('species');

	// `Symbol.split` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.split
	defineWellKnownSymbol('split');

	// `Symbol.toPrimitive` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.toprimitive
	defineWellKnownSymbol('toPrimitive');

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	symbolDefineToPrimitive();

	// `Symbol.toStringTag` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.tostringtag
	defineWellKnownSymbol('toStringTag');

	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag(getBuiltIn('Symbol'), 'Symbol');

	// `Symbol.unscopables` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.unscopables
	defineWellKnownSymbol('unscopables');

	// JSON[@@toStringTag] property
	// https://tc39.es/ecma262/#sec-json-@@tostringtag
	setToStringTag(global_1.JSON, 'JSON', true);

	var symbol = path.Symbol;

	var iterators = {};

	var FunctionPrototype$2 = Function.prototype;
	// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
	var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;

	var EXISTS$1 = hasOwnProperty_1(FunctionPrototype$2, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS$1 && (function something() { /* empty */ }).name === 'something';
	var CONFIGURABLE$1 = EXISTS$1 && (!descriptors || (descriptors && getDescriptor(FunctionPrototype$2, 'name').configurable));

	var functionName = {
	  EXISTS: EXISTS$1,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE$1
	};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  // eslint-disable-next-line es-x/no-object-getprototypeof -- required for testing
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var $Object$4 = Object;
	var ObjectPrototype$1 = $Object$4.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	// eslint-disable-next-line es-x/no-object-getprototypeof -- safe
	var objectGetPrototypeOf = correctPrototypeGetter ? $Object$4.getPrototypeOf : function (O) {
	  var object = toObject(O);
	  if (hasOwnProperty_1(object, IE_PROTO$1)) return object[IE_PROTO$1];
	  var constructor = object.constructor;
	  if (isCallable(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  } return object instanceof $Object$4 ? ObjectPrototype$1 : null;
	};

	var ITERATOR = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	/* eslint-disable es-x/no-array-prototype-keys -- safe */
	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype[ITERATOR].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
	else IteratorPrototype = objectCreate(IteratorPrototype);

	// `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
	if (!isCallable(IteratorPrototype[ITERATOR])) {
	  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
	  iterators[TO_STRING_TAG] = returnThis;
	  return IteratorConstructor;
	};

	var $String$3 = String;
	var $TypeError$7 = TypeError;

	var aPossiblePrototype = function (argument) {
	  if (typeof argument == 'object' || isCallable(argument)) return argument;
	  throw $TypeError$7("Can't set " + $String$3(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */




	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es-x/no-object-setprototypeof -- safe
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
	    setter = functionUncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
	    setter(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var PROPER_FUNCTION_NAME = functionName.PROPER;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$1 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$1 = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$1]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
	      iterators[TO_STRING_TAG] = returnThis$1;
	    }
	  }

	  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
	  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    {
	      INCORRECT_VALUES_NAME = true;
	      defaultIterator = function values() { return functionCall(nativeIterator, this); };
	    }
	  }

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
	  }

	  // define iterator
	  if (( FORCED) && IterablePrototype[ITERATOR$1] !== defaultIterator) {
	    defineBuiltIn(IterablePrototype, ITERATOR$1, defaultIterator, { name: DEFAULT });
	  }
	  iterators[NAME] = defaultIterator;

	  return methods;
	};

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$1 = internalState.set;
	var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.es/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.es/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.es/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.es/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState$1(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$1(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return { value: undefined, done: true };
	  }
	  if (kind == 'keys') return { value: index, done: false };
	  if (kind == 'values') return { value: target[index], done: false };
	  return { value: [index, target[index]], done: false };
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.es/ecma262/#sec-createmappedargumentsobject
	var values = iterators.Arguments = iterators.Array;

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  if (CollectionPrototype && classof(CollectionPrototype) !== TO_STRING_TAG$3) {
	    createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$3, COLLECTION_NAME);
	  }
	  iterators[COLLECTION_NAME] = iterators.Array;
	}

	var symbol$1 = symbol;

	var symbol$2 = symbol$1;

	// `Symbol.asyncDispose` well-known symbol
	// https://github.com/tc39/proposal-using-statement
	defineWellKnownSymbol('asyncDispose');

	// `Symbol.dispose` well-known symbol
	// https://github.com/tc39/proposal-using-statement
	defineWellKnownSymbol('dispose');

	// `Symbol.matcher` well-known symbol
	// https://github.com/tc39/proposal-pattern-matching
	defineWellKnownSymbol('matcher');

	// `Symbol.metadataKey` well-known symbol
	// https://github.com/tc39/proposal-decorator-metadata
	defineWellKnownSymbol('metadataKey');

	// `Symbol.observable` well-known symbol
	// https://github.com/tc39/proposal-observable
	defineWellKnownSymbol('observable');

	// TODO: Remove from `core-js@4`


	// `Symbol.metadata` well-known symbol
	// https://github.com/tc39/proposal-decorators
	defineWellKnownSymbol('metadata');

	// TODO: remove from `core-js@4`


	// `Symbol.patternMatch` well-known symbol
	// https://github.com/tc39/proposal-pattern-matching
	defineWellKnownSymbol('patternMatch');

	// TODO: remove from `core-js@4`


	defineWellKnownSymbol('replaceAll');

	// TODO: Remove from `core-js@4`




	var symbol$3 = symbol$2;

	var symbol$4 = symbol$3;

	var symbol$5 = symbol$4;

	var charAt$1 = functionUncurryThis(''.charAt);
	var charCodeAt$1 = functionUncurryThis(''.charCodeAt);
	var stringSlice$1 = functionUncurryThis(''.slice);

	var createMethod$2 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString_1(requireObjectCoercible($this));
	    var position = toIntegerOrInfinity(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = charCodeAt$1(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = charCodeAt$1(S, position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING
	          ? charAt$1(S, position)
	          : first
	        : CONVERT_TO_STRING
	          ? stringSlice$1(S, position, position + 2)
	          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$2(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$2(true)
	};

	var charAt$2 = stringMultibyte.charAt;




	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$2 = internalState.set;
	var getInternalState$2 = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState$2(this, {
	    type: STRING_ITERATOR,
	    string: toString_1(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$2(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt$2(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	var iterator = wellKnownSymbolWrapped.f('iterator');

	var iterator$1 = iterator;

	var iterator$2 = iterator$1;

	var iterator$3 = iterator$2;

	var iterator$4 = iterator$3;

	var iterator$5 = iterator$4;

	var _typeof_1 = createCommonjsModule(function (module) {
	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  return (module.exports = _typeof = "function" == typeof symbol$5 && "symbol" == typeof iterator$5 ? function (obj) {
	    return typeof obj;
	  } : function (obj) {
	    return obj && "function" == typeof symbol$5 && obj.constructor === symbol$5 && obj !== symbol$5.prototype ? "symbol" : typeof obj;
	  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
	}

	module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _typeof = unwrapExports(_typeof_1);

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.hasIndices) result += 'd';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.unicodeSets) result += 'v';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var RegExpPrototype = RegExp.prototype;

	var regexpGetFlags = function (R) {
	  var flags = R.flags;
	  return flags === undefined && !('flags' in RegExpPrototype) && !hasOwnProperty_1(R, 'flags') && objectIsPrototypeOf(RegExpPrototype, R)
	    ? functionCall(regexpFlags, R) : flags;
	};

	var flags = regexpGetFlags;

	var RegExpPrototype$1 = RegExp.prototype;

	var flags_1 = function (it) {
	  return (it === RegExpPrototype$1 || objectIsPrototypeOf(RegExpPrototype$1, it)) ? flags(it) : it.flags;
	};

	var flags$1 = flags_1;

	var flags$2 = flags$1;

	/**
	 * 通过React.render调用时创建的FiberRoot为该值
	 */
	var LegacyRoot = 0;
	/**
	 * 通过React.createRoot调用时创建的FiberRoot为该值
	 */

	var ConcurrentRoot = 2;

	var FunctionComponent = 0;
	/**
	 * FiberRoot.current
	 */

	var HostRoot = 3; // Root of a host tree. Could be nested inside another node.

	/**
	 * 文字节点
	 */

	var HostText = 6;
	/**
	 * 在每经过reconcile之前class和function都是该类组件
	 */

	var IndeterminateComponent = 2; // Before we know whether it is function or class
	/**
	 * div span之类的组件
	 */

	var HostComponent = 5;
	var MemoComponent = 14;
	var SimpleMemoComponent = 15;

	var NoMode =
	/*            */
	0; // TODO: Remove BlockingMode and ConcurrentMode by reading from the root tag instead

	var BlockingMode =
	/*      */
	1;
	var ConcurrentMode =
	/*    */
	2;

	var NoFlags =
	/*                      */
	0;
	var Placement =
	/*                    */
	2;
	var Update =
	/*                       */
	4;
	var PlacementAndUpdate =
	/*           */
	Placement | Update;
	var ChildDeletion =
	/*                */
	16;
	var ContentReset =
	/*                 */
	32;
	var Passive =
	/*                      */
	1024;
	var MutationMask = Placement | Update | ChildDeletion | ContentReset;
	var LayoutMask = Update;
	var BeforeMutationMask = Update;
	var PassiveMask = Passive | ChildDeletion; // Static tags describe aspects of a fiber that are not specific to a render,
	// e.g. a fiber uses a passive effect (even if there are no updates on this particular render).
	// This enables us to defer more work in the unmount case,
	// since we can defer traversing the tree during layout to look for Passive effects,
	// and instead rely on the static flag as a signal that there may be cleanup work.

	var RefStatic =
	/*                    */
	262144;
	var LayoutStatic =
	/*                 */
	524288;
	var PassiveStatic =
	/*                */
	1048576; // Union of tags that don't get reset on clones.
	// This allows certain concepts to persist without recalculting them,
	// e.g. whether a subtree contains passive effects or portals.

	var StaticMask = LayoutStatic | PassiveStatic | RefStatic;

	var floor$1 = Math.floor;
	var log = Math.log;
	var LOG2E = Math.LOG2E;

	// `Math.clz32` method
	// https://tc39.es/ecma262/#sec-math.clz32
	_export({ target: 'Math', stat: true }, {
	  clz32: function clz32(x) {
	    var n = x >>> 0;
	    return n ? 31 - floor$1(log(n + 0.5) * LOG2E) : 32;
	  }
	});

	var clz32 = path.Math.clz32;

	var clz32$1 = clz32;

	var clz32$2 = clz32$1;

	var TotalLanes = 31;
	var NoLanes =
	/*                         */
	0;
	var NoLane =
	/*                          */
	0;
	var SyncLane =
	/*                        */
	1;
	var InputContinuousLane =
	/*            */
	4;
	var DefaultLane =
	/*                    */
	16;
	var IdleLane =
	/*                       */
	536870912;
	var NonIdleLanes =
	/*                                 */
	268435455;
	var NoTimestamp = -1;
	var clz32$3 = clz32$2;

	var pickArbitraryLaneIndex = function pickArbitraryLaneIndex(lanes) {
	  return 31 - clz32$3(lanes);
	};
	/**
	 * 根据任务的优先级为其计算一个过期时间
	 * @param lane 优先级
	 * @param currentTime 当前的时间
	 * @returns
	 */


	var computeExpirationTime = function computeExpirationTime(lane, currentTime) {
	  switch (lane) {
	    case SyncLane:
	      return currentTime + 250;

	    case DefaultLane:
	      return currentTime + 5000;

	    default:
	      {
	        throw new Error('Not Implement');
	      }
	  }
	};
	/**
	 * 将已经过期的任务标记出来
	 * @param root FiberRoot
	 * @param currentTime 当前的时间
	 */


	var markStarvedLanesAsExpired = function markStarvedLanesAsExpired(root, currentTime) {
	  var pendingLanes = root.pendingLanes;
	  var expirationTimes = root.expirationTimes;
	  var lanes = pendingLanes;

	  while (lanes > 0) {
	    var index = pickArbitraryLaneIndex(lanes);
	    var lane = 1 << index;
	    var expirationTime = expirationTimes[index];

	    if (expirationTime === NoTimestamp) {
	      /**
	       * 还没有相关的时间戳，帮他计算一个
	       */
	      expirationTimes[index] = computeExpirationTime(lane, currentTime);
	    } else if (expirationTime <= currentTime) {
	      //已经过期将其加入到expiredLanes中
	      root.expiredLanes |= lane;
	    } //从lanes中移除该lane，下一轮循环就能开始检测下一个lane了


	    lanes &= ~lane;
	  }
	};
	/**
	 * 返回现在被占用的lanes中最高优先级的lane
	 * 也就是获得一个数中以最低位1所形成的数字，原理可以去查看负数的表示
	 * 比如输入 0b111 就返回 0b001
	 * 0b101 -> 0b001
	 * 0b100 -> 0b100
	 * 0b1000001000 -> 0b0000001000
	 * 0b1111111110 -> 0b0000000010
	 * @param lanes
	 * @returns
	 */

	var getHighestPriorityLane = function getHighestPriorityLane(lanes) {
	  return lanes & -lanes;
	};
	/**
	 * 返回现有的lanes中最高优先级的lane
	 * @param lanes
	 * @returns
	 */

	var getHighestPriorityLanes = function getHighestPriorityLanes(lanes) {
	  switch (getHighestPriorityLane(lanes)) {
	    case SyncLane:
	      return SyncLane;

	    case DefaultLane:
	      return DefaultLane;

	    default:
	      {
	        throw new Error('Not Implement');
	      }
	  }
	};
	/**
	 * 根据当前root的pendingLanes和workInProgressLanes返回这次更新的lanes
	 * @param root
	 * @param wipLanes
	 * @returns
	 */


	var getNextLanes = function getNextLanes(root, wipLanes) {
	  var pendingLanes = root.pendingLanes; //提前退出，如果没有待进行的工作

	  if (pendingLanes === NoLanes) return NoLanes;
	  var nextLanes = NoLanes;
	  var nonIdlePendingLanes = pendingLanes & NonIdleLanes; //存在lanes被占用，找出哪个最高优先级的

	  if (nonIdlePendingLanes !== NoLanes) {
	    //返回现被占用的lanes中最高优先级的lane
	    nextLanes = getHighestPriorityLanes(nonIdlePendingLanes);
	  } else {
	    throw new Error('Not Implement');
	  }

	  if (nextLanes === NoLanes) {
	    return NoLanes;
	  }
	  /**
	   * 如果已经处于render阶段，切换lanes会导致丢失进度
	   * 我们只应该在新的lane拥有更高的优先级的时候这样做
	   */


	  if (wipLanes !== NoLanes && wipLanes !== nextLanes) {
	    var nextLane = getHighestPriorityLane(nextLanes);
	    var wipLane = getHighestPriorityLane(wipLanes); //如果该次任务的优先级低于现存任务的优先级则workInProgressLanes不变

	    if (nextLane >= wipLane) {
	      return wipLanes;
	    }
	  }

	  return nextLanes;
	};
	var includesSomeLane = function includesSomeLane(a, b) {
	  return (a & b) !== NoLanes;
	};
	var mergeLanes = function mergeLanes(a, b) {
	  return a | b;
	};
	/**
	 * 返回该lane所在bit位在bitset中index
	 * 比如
	 * 0b001 就会返回0
	 * 0b010 就会返回1
	 * 0b100 就会返回2
	 *
	 * @param lane
	 * @returns
	 */

	var laneToIndex = function laneToIndex(lane) {
	  return pickArbitraryLaneIndex(lane);
	};
	/**
	 * 把该次更新的lane并到root的pendingLanes中，以及记录该更新对应lane的发生的时间，
	 * 方便以后可以判断该更新是否已经过期需要立即执行该更新
	 * @param root FiberRoot
	 * @param updateLane 该更新对应的lane
	 * @param eventTime 该更新发生的时间
	 */


	var markRootUpdated = function markRootUpdated(root, updateLane, eventTime) {
	  //root上包含的更新他们所对应的lanes
	  root.pendingLanes |= updateLane; //一个三十一位的数组，分别对应着31位lane

	  var eventTimes = root.eventTimes;
	  var index = laneToIndex(updateLane);
	  eventTimes[index] = eventTime;
	};
	var createLaneMap = function createLaneMap(initial) {
	  var laneMap = [];

	  for (var i = 0; i < TotalLanes; ++i) {
	    laneMap.push(initial);
	  }

	  return laneMap;
	};
	/**
	 * subset bitset是否是 set bitset的子集
	 * @param set
	 * @param subset
	 * @returns
	 */

	var isSubsetOfLanes = function isSubsetOfLanes(set, subset) {
	  return (set & subset) === subset;
	};
	var includesNonIdleWork = function includesNonIdleWork(lanes) {
	  return (lanes & NonIdleLanes) !== NonIdleLanes;
	};
	/**
	 * 是否开启时间切片,React中默认开启了同步模式(enableSyncDefaultUpdates)，所以不会
	 * 开启时间切片，我们这为了学习的目的把他关闭
	 * @param root
	 * @param lanes
	 * @returns
	 */

	var shouldTimeSlice = function shouldTimeSlice(root, lanes) {
	  if ((lanes & root.expiredLanes) !== NoLanes) {
	    //至少有一个lane已经过期了，为了防止更多的lane过期
	    //因该尽快完成渲染，而不把控制权交给浏览器
	    return false;
	  }

	  {
	    return true;
	  }
	};
	/**
	 * 进行本轮更新的收尾工作，将完成工作的lane time重置，并将他们
	 * 从pendingLanes，expiredLanes去除
	 * @param root
	 * @param remainingLanes 剩余要进行工作的lanes
	 */

	var markRootFinished = function markRootFinished(root, remainingLanes) {
	  var noLongerPendingLanes = root.pendingLanes & ~remainingLanes;
	  root.pendingLanes = remainingLanes;
	  root.expiredLanes &= remainingLanes;
	  var eventTimes = root.eventTimes;
	  var expirationTimes = root.expirationTimes;
	  var lanes = noLongerPendingLanes;

	  while (lanes > 0) {
	    var index = pickArbitraryLaneIndex(lanes);
	    var lane = 1 << index;
	    eventTimes[index] = NoTimestamp;
	    expirationTimes[index] = NoTimestamp;
	    lanes &= ~lane;
	  }
	};
	var removeLanes = function removeLanes(set, subset) {
	  return set & ~subset;
	};

	/**
	 * 属性含义可查看react-reconciler\ReactInternalTypes.ts
	 * 下的Fiber Type
	 */

	var FiberNode = /*#__PURE__*/_createClass(function FiberNode(tag, pendingProps, key, mode) {
	  _classCallCheck(this, FiberNode);

	  this.tag = tag;
	  this.pendingProps = pendingProps;
	  this.key = key;
	  this.mode = mode;

	  _defineProperty(this, "stateNode", null);

	  _defineProperty(this, "updateQueue", null);

	  _defineProperty(this, "return", null);

	  _defineProperty(this, "alternate", null);

	  _defineProperty(this, "memoizedState", null);

	  _defineProperty(this, "child", null);

	  _defineProperty(this, "sibling", null);

	  _defineProperty(this, "type", null);

	  _defineProperty(this, "memoizedProps", null);

	  _defineProperty(this, "flags", 0);

	  _defineProperty(this, "subtreeFlags", 0);

	  _defineProperty(this, "deletions", null);

	  _defineProperty(this, "index", 0);

	  _defineProperty(this, "lanes", NoLanes);

	  _defineProperty(this, "childLanes", NoLanes);

	  _defineProperty(this, "elementType", null);
	});
	/**
	 *
	 * @param tag 标志着该fiber树是以什么模式创建的
	 * @returns 返回一个以HostRoot为tag的fiber节点(表示一颗fiber树的根节点)
	 */


	var createHostRootFiber = function createHostRootFiber(tag) {
	  var mode;

	  if (tag === ConcurrentRoot) {
	    mode = ConcurrentMode | BlockingMode;
	  } else {
	    mode = NoMode;
	  }

	  return new FiberNode(HostRoot, null, null, mode);
	};
	/**
	 * 创建一个fiber节点
	 * @param tag
	 * @param pendingProps
	 * @param key
	 * @param mode
	 * @returns
	 */

	var createFiber = function createFiber(tag, pendingProps, key, mode) {
	  return new FiberNode(tag, pendingProps, key, mode);
	};
	/**
	 *
	 * @param current 更具当前界面上的current fiber节点创建一个新的fiber节点去进行工作
	 * @param pendingProps 该fiber节点新的props
	 */

	var createWorkInProgress = function createWorkInProgress(current, pendingProps) {
	  var workInProgress = current.alternate;

	  if (workInProgress === null) {
	    //我们在这里使用了双缓存技巧，因为知道只需要两个版本的树
	    //我们可以把当前树中没有用到的节点拿出来复用，并且这些节点是只有需要时才创建的
	    //去避免去为那些永远不会更新的节点创建额外的对象,
	    //如果需要的话这也让我们可以再利用内存

	    /**
	     * 考虑下面的App组件，帮你理解上面的话
	     * const TriggerUpdate = () => {
	     *   const [count, setCount] = useState(0)
	     *
	     *   return (
	     *     <div>
	     *       {count}
	     *       <button
	     *         onClick={() => {
	     *           setCount(count + 1)
	     *         }}
	     *       >
	     *         increment
	     *       </button>
	     *     </div>
	     *   )
	     * }
	     *
	     * const App = () => {
	     *  return (
	     *    <div id="container">
	     *      <div style={{
	     *         background: 'red',
	     *        }}
	     *        id="static"
	     *      >
	     *        Static Node
	     *        <div>Static Node</div>
	     *      </div>
	     *      <TriggerUpdate />
	     *    </div>
	     *  )
	     *}
	     * 下面会使用jquery选择器的方式指明我们说的时哪个fiber节点
	     * 比如$('#container')就表示哪个id为container的div所对应的fiber
	     * 虽然App中的TriggerUpdate会触发更新但是他冒泡的lanes
	     * 并不会影响到并不在他冒泡路径上和他同级的
	     * $('#static')节点所以他的lanes和childLanes一直都是NoLanes，
	     * 因为也知道他的父级节点$('#container') div也没有更新，
	     * 所以在创建$('#static') div节点时复用前一次的props，
	     * 当接下来进行$('#static')的beginWork时，由于前后props没变且不包含lanes
	     * 会执行他的bailoutOnAlreadyFinishedWork逻辑
	     * 即使此次更新中$('#static')对应的jsx对象的style属性是全新的对象，
	     * 在执行bailout逻辑中发现他的childLanes为NoLanes所以直接返回，不在复制他的child
	     * 进行render工作了，所以$('#static')节点的子节点只有在首次mount时会被创建一次，
	     * 对于这些静态节点，在整个过程中，两颗fiber树始终指向相同的对象
	     */
	    workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode);
	    workInProgress.elementType = current.elementType;
	    workInProgress.type = current.type;
	    workInProgress.stateNode = current.stateNode;
	    workInProgress.alternate = current;
	    current.alternate = workInProgress;
	  } else {
	    workInProgress.pendingProps = pendingProps;
	    workInProgress.type = current.type;
	    workInProgress.flags = NoFlags;
	    workInProgress.subtreeFlags = NoFlags;
	    workInProgress.deletions = null;
	  }

	  workInProgress.lanes = current.lanes;
	  workInProgress.updateQueue = current.updateQueue;
	  workInProgress.childLanes = current.childLanes;
	  workInProgress.flags = flags$2(current);
	  workInProgress.child = current.child;
	  workInProgress.memoizedProps = current.memoizedProps;
	  workInProgress.memoizedState = current.memoizedState;
	  return workInProgress;
	};
	/**
	 * 根据JSX对象的type和props创建一个fiber节点
	 * @param type 可以为string比如div,p可以为函数，比如函数组件
	 * 可以为类比如类组件可以为Symbol比如React.Fragment
	 * @param key
	 * @param pendingProps
	 * @param mode fiber树的模式比如Concurrent,Legacy
	 * @param lanes
	 * @returns
	 */

	var createFiberFromTypeAndProps = function createFiberFromTypeAndProps(type, key, pendingProps, mode, lanes) {
	  var fiberTag = IndeterminateComponent;
	  var resolvedType = type;

	  if (typeof type === 'function') ; else if (typeof type === 'string') {
	    fiberTag = HostComponent;
	  } else {
	    getTag: switch (type) {
	      default:
	        {
	          if (_typeof(type) === 'object' && type !== null) {
	            switch (type.$$typeof) {
	              case REACT_MEMO_TYPE:
	                {
	                  fiberTag = MemoComponent;
	                  break getTag;
	                }

	              default:
	                {
	                  throw new Error('Not Implement');
	                }
	            }
	          } else {
	            throw new Error('Not Implement');
	          }
	        }
	    }
	  }

	  var fiber = createFiber(fiberTag, pendingProps, key, mode);
	  fiber.type = resolvedType;
	  fiber.lanes = lanes;
	  fiber.elementType = type;
	  return fiber;
	};
	var createFiberFromElement = function createFiberFromElement(element, mode, lanes) {
	  var type = element.type;
	  var key = element.key;
	  var pendingProps = element.props;
	  var fiber = createFiberFromTypeAndProps(type, key, pendingProps, mode, lanes);
	  return fiber;
	};
	/**
	 * 创建一个HostText类型的Fiber节点
	 * @param content 会作为pendingProps
	 * @param mode
	 * @returns
	 */

	var createFiberFromText = function createFiberFromText(content, mode, lanes) {
	  var fiber = createFiber(HostText, content, null, mode);
	  fiber.lanes = lanes;
	  return fiber;
	};
	var isSimpleFunctionComponent = function isSimpleFunctionComponent(type) {
	  return typeof type === 'function' && type.defaultProps === undefined;
	};

	// eslint-disable-next-line es-x/no-object-assign -- safe
	var $assign = Object.assign;
	// eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
	var defineProperty$a = Object.defineProperty;
	var concat = functionUncurryThis([].concat);

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	var objectAssign = !$assign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && $assign({ b: 1 }, $assign(defineProperty$a({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$a(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line es-x/no-symbol -- safe
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || functionCall(propertyIsEnumerable, S, key)) T[key] = S[key];
	    }
	  } return T;
	} : $assign;

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	// eslint-disable-next-line es-x/no-object-assign -- required for testing
	_export({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	var assign = path.Object.assign;

	var assign$1 = assign;

	var assign$2 = assign$1;

	/**
	 * 当首次mount时HostRoot会用到，Class Component也会用到该类型的updateQueue
	 * Function Component使用的时另外的逻辑
	 */
	var UpdateState = 0;

	/**
	 *初始化fiber节点的updateQueue
	 *
	 * @param fiber 要初始化updateQueue的fiber
	 */
	var initializeUpdateQueue = function initializeUpdateQueue(fiber) {
	  var queue = {
	    baseState: fiber.memoizedState,
	    shared: {
	      pending: null
	    },
	    lastBaseUpdate: null,
	    firstBaseUpdate: null
	  };
	  fiber.updateQueue = queue;
	};
	/**
	 *
	 * @returns 创建一个全新的update
	 */

	var createUpdate = function createUpdate() {
	  var update = {
	    payload: null,
	    next: null,
	    tag: UpdateState
	  };
	  return update;
	};
	/**
	 * 将一个update添加fiber节点上
	 *
	 * @param fiber 要添加update的fiber节点
	 * @param update 该update会被添加到fiber节点的updateQueue上
	 */

	var enqueueUpdate = function enqueueUpdate(fiber, update) {
	  var updateQueue = fiber.updateQueue;
	  if (!updateQueue) return;
	  var sharedQueue = updateQueue.shared;
	  var pending = sharedQueue.pending;

	  if (pending === null) {
	    //第一个创建的update，创建一个循环链表
	    update.next = update;
	  } else {
	    //sharedQueue.pending 始终为最后一个创建的update
	    //sharedQueue.pending.next指向第一个创建的update,遍历update都是从此开始
	    //按顺序1,2,3插入update则构成的链表为
	    //______________
	    //|             ↓
	    //3  <-  2  <-  1
	    //update3的next指向最早创建的update1
	    update.next = pending.next; //update2的next指向当前创建的update3

	    pending.next = update;
	  }

	  sharedQueue.pending = update;
	};
	/**
	 * 从current fiber上克隆一个updateQueue
	 * @param current
	 * @param workInProgress
	 */

	var cloneUpdateQueue = function cloneUpdateQueue(current, workInProgress) {
	  var queue = workInProgress.updateQueue;
	  var currentQueue = current.updateQueue;

	  if (queue === currentQueue) {
	    var clone = {
	      shared: currentQueue.shared,
	      firstBaseUpdate: currentQueue.firstBaseUpdate,
	      lastBaseUpdate: currentQueue.lastBaseUpdate,
	      baseState: currentQueue.baseState
	    };
	    workInProgress.updateQueue = clone;
	  }
	};
	var processUpdateQueue = function processUpdateQueue(workInProgress, props, instance) {
	  var queue = workInProgress.updateQueue;
	  var firstBaseUpdate = queue.firstBaseUpdate;
	  var lastBaseUpdate = queue.lastBaseUpdate; //检测shared.pending是否存在进行中的update将他们转移到baseQueue

	  var pendingQueue = queue.shared.pending;

	  if (pendingQueue !== null) {
	    queue.shared.pending = null;
	    var lastPendingUpdate = pendingQueue;
	    var firstPendingUpdate = lastPendingUpdate.next; //断开最后一个update和第一个update之间的连接

	    lastPendingUpdate.next = null; //将shared.pending上的update接到baseUpdate链表上

	    if (lastBaseUpdate === null) {
	      firstBaseUpdate = firstPendingUpdate;
	    } else {
	      lastBaseUpdate.next = firstPendingUpdate;
	    }

	    lastBaseUpdate = lastPendingUpdate; //如果current存在则进行相同的工作

	    var current = workInProgress.alternate;

	    if (current !== null) {
	      var currentQueue = current.updateQueue;
	      var currentLastBaseUpdate = currentQueue.lastBaseUpdate;

	      if (currentLastBaseUpdate !== lastBaseUpdate) {
	        if (currentLastBaseUpdate === null) {
	          currentQueue.firstBaseUpdate = firstPendingUpdate;
	        } else {
	          currentLastBaseUpdate.next = firstPendingUpdate;
	        }

	        currentQueue.lastBaseUpdate = lastPendingUpdate;
	      }
	    }
	  }

	  if (firstBaseUpdate !== null) {
	    var newState = queue.baseState;
	    var newBaseState = null;
	    var newFirstBaseUpdate = null;
	    var newLastBaseUpdate = null;
	    var update = firstBaseUpdate;

	    do {
	      //暂时假设，所有更新都是一样的优先级，每次都从所有update计算状态
	      newState = getStateFromUpdate(workInProgress, queue, update, newState, props, instance);
	      update = update.next; //当前更新以全部遍历完，但是有可能payload为函数在计算state的过程中又在
	      //updateQueue.shared.pending上添加了新的更新，继续迭代直到没有新更新产生为止

	      if (update === null) {
	        pendingQueue = queue.shared.pending; //没产生新的更新

	        if (pendingQueue === null) break;else {
	          //产生了新的更新
	          var _lastPendingUpdate = pendingQueue;
	          var _firstPendingUpdate = _lastPendingUpdate.next;
	          _lastPendingUpdate.next = null;
	          update = _firstPendingUpdate;
	          queue.lastBaseUpdate = _lastPendingUpdate;
	          queue.shared.pending = null;
	        }
	      }
	    } while (true); //暂时没有会被跳过的update始终不成立


	    if (newLastBaseUpdate === null) {
	      newBaseState = newState;
	    }

	    queue.baseState = newBaseState;
	    queue.firstBaseUpdate = newFirstBaseUpdate;
	    queue.lastBaseUpdate = newLastBaseUpdate;
	    workInProgress.memoizedState = newState;
	  }
	};
	var getStateFromUpdate = function getStateFromUpdate(_workInProgress, _queue, update, prevState, nextProps, instance) {
	  switch (update.tag) {
	    case UpdateState:
	      {
	        var payload = update.payload;
	        var partialState;

	        if (typeof payload === 'function') {
	          partialState = payload.call(instance, prevState, nextProps);
	        } else {
	          partialState = payload;
	        }

	        if (partialState === null || partialState === undefined) {
	          //如果是null或者undefined就说明什么都不用更新，什么也不干
	          return prevState;
	        }

	        return assign$2({}, prevState, partialState);
	      }
	  }
	};

	var FiberRootNode = /*#__PURE__*/_createClass(function FiberRootNode(containerInfo, tag) {
	  _classCallCheck(this, FiberRootNode);

	  this.containerInfo = containerInfo;
	  this.tag = tag;

	  _defineProperty(this, "callbackNode", null);

	  _defineProperty(this, "pendingLanes", NoLanes);

	  _defineProperty(this, "expiredLanes", NoLanes);

	  _defineProperty(this, "finishedWork", null);

	  _defineProperty(this, "current", null);

	  _defineProperty(this, "eventTimes", createLaneMap(NoLanes));

	  _defineProperty(this, "expirationTimes", createLaneMap(NoTimestamp));

	  _defineProperty(this, "callbackPriority", NoLane);
	});
	/**
	 *
	 * @param containerInfo 当前创建fiber树所在的dom节点由createRoot方法传入
	 * @param tag 决定fiber树是以什么模式创建的(concurrent,blocking)
	 * @returns 返回FiberRoot（整个应用的根节点，其中current保存有当前页面所对应的fiber树）
	 */


	var createFiberRoot = function createFiberRoot(containerInfo, tag) {
	  var root = new FiberRootNode(containerInfo, tag);
	  var uninitializedFiber = createHostRootFiber(tag);
	  root.current = uninitializedFiber;
	  uninitializedFiber.stateNode = root;
	  initializeUpdateQueue(uninitializedFiber);
	  return root;
	};

	var $Function = Function;
	var concat$1 = functionUncurryThis([].concat);
	var join = functionUncurryThis([].join);
	var factories = {};

	var construct$1 = function (C, argsLength, args) {
	  if (!hasOwnProperty_1(factories, argsLength)) {
	    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
	    factories[argsLength] = $Function('C,a', 'return new C(' + join(list, ',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.es/ecma262/#sec-function.prototype.bind
	var functionBind = functionBindNative ? $Function.bind : function bind(that /* , ...args */) {
	  var F = aCallable(this);
	  var Prototype = F.prototype;
	  var partArgs = arraySlice(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = concat$1(partArgs, arraySlice(arguments));
	    return this instanceof boundFunction ? construct$1(F, args.length, args) : F.apply(that, args);
	  };
	  if (isObject(Prototype)) boundFunction.prototype = Prototype;
	  return boundFunction;
	};

	// TODO: Remove from `core-js@4`



	// `Function.prototype.bind` method
	// https://tc39.es/ecma262/#sec-function.prototype.bind
	_export({ target: 'Function', proto: true, forced: Function.bind !== functionBind }, {
	  bind: functionBind
	});

	var entryVirtual = function (CONSTRUCTOR) {
	  return path[CONSTRUCTOR + 'Prototype'];
	};

	var bind$2 = entryVirtual('Function').bind;

	var FunctionPrototype$3 = Function.prototype;

	var bind$3 = function (it) {
	  var own = it.bind;
	  return it === FunctionPrototype$3 || (objectIsPrototypeOf(FunctionPrototype$3, it) && own === FunctionPrototype$3.bind) ? bind$2 : own;
	};

	var bind$4 = bind$3;

	var bind$5 = bind$4;

	var $TypeError$8 = TypeError;

	var validateArgumentsLength = function (passed, required) {
	  if (passed < required) throw $TypeError$8('Not enough arguments');
	  return passed;
	};

	var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(engineUserAgent);

	var engineIsNode = classofRaw(global_1.process) == 'process';

	var set$1 = global_1.setImmediate;
	var clear = global_1.clearImmediate;
	var process$1 = global_1.process;
	var Dispatch = global_1.Dispatch;
	var Function$1 = global_1.Function;
	var MessageChannel$1 = global_1.MessageChannel;
	var String$1 = global_1.String;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var location, defer, channel, port;

	try {
	  // Deno throws a ReferenceError on `location` access without `--location` flag
	  location = global_1.location;
	} catch (error) { /* empty */ }

	var run = function (id) {
	  if (hasOwnProperty_1(queue, id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global_1.postMessage(String$1(id), location.protocol + '//' + location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set$1 || !clear) {
	  set$1 = function setImmediate(handler) {
	    validateArgumentsLength(arguments.length, 1);
	    var fn = isCallable(handler) ? handler : Function$1(handler);
	    var args = arraySlice(arguments, 1);
	    queue[++counter] = function () {
	      functionApply(fn, undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (engineIsNode) {
	    defer = function (id) {
	      process$1.nextTick(runner(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  // except iOS - https://github.com/zloirock/core-js/issues/624
	  } else if (MessageChannel$1 && !engineIsIos) {
	    channel = new MessageChannel$1();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = functionBindContext(port.postMessage, port);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (
	    global_1.addEventListener &&
	    isCallable(global_1.postMessage) &&
	    !global_1.importScripts &&
	    location && location.protocol !== 'file:' &&
	    !fails(post)
	  ) {
	    defer = post;
	    global_1.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
	    defer = function (id) {
	      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task = {
	  set: set$1,
	  clear: clear
	};

	var engineIsIosPebble = /ipad|iphone|ipod/i.test(engineUserAgent) && global_1.Pebble !== undefined;

	var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(engineUserAgent);

	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
	var macrotask = task.set;





	var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
	var document$2 = global_1.document;
	var process$2 = global_1.process;
	var Promise = global_1.Promise;
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$2(global_1, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

	var flush, head, last, notify, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (engineIsNode && (parent = process$2.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head) notify();
	        else last = undefined;
	        throw error;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
	  if (!engineIsIos && !engineIsNode && !engineIsWebosWebkit && MutationObserver && document$2) {
	    toggle = true;
	    node = document$2.createTextNode('');
	    new MutationObserver(flush).observe(node, { characterData: true });
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (!engineIsIosPebble && Promise && Promise.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise.resolve(undefined);
	    // workaround of WebKit ~ iOS Safari 10.1 bug
	    promise.constructor = Promise;
	    then = functionBindContext(promise.then, promise);
	    notify = function () {
	      then(flush);
	    };
	  // Node.js without promises
	  } else if (engineIsNode) {
	    notify = function () {
	      process$2.nextTick(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessage
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    // strange IE + webpack dev server bug - use .bind(global)
	    macrotask = functionBindContext(macrotask, global_1);
	    notify = function () {
	      macrotask(flush);
	    };
	  }
	}

	var microtask = queueMicrotask || function (fn) {
	  var task = { fn: fn, next: undefined };
	  if (last) last.next = task;
	  if (!head) {
	    head = task;
	    notify();
	  } last = task;
	};

	var process$3 = global_1.process;

	// `queueMicrotask` method
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
	_export({ global: true, enumerable: true, dontCallGetSet: true }, {
	  queueMicrotask: function queueMicrotask(fn) {
	    validateArgumentsLength(arguments.length, 1);
	    aCallable(fn);
	    var domain = engineIsNode && process$3.domain;
	    microtask(domain ? domain.bind(fn) : fn);
	  }
	});

	var queueMicrotask$1 = path.queueMicrotask;

	var queueMicrotask$2 = queueMicrotask$1;

	var queueMicrotask$3 = queueMicrotask$2;

	var DiscreteEventPriority = SyncLane;
	var DefaultEventPriority = DefaultLane;
	var ContinuousEventPriority = InputContinuousLane;
	var IdleEventPriority = IdleLane;
	var currentUpdatePriority = NoLane;
	/**
	 * 当前更新的优先级比如一个click事件产生的更新就为DiscreteEventPriority
	 * @returns 当前更新的优先级
	 */

	var getCurrentUpdatePriority = function getCurrentUpdatePriority() {
	  return currentUpdatePriority;
	};
	/**
	 * 设置当前更新的优先级，比如点击事件产生后，就会调用该方法将其设置为DiscreteEventPriority
	 * @param newPriority 当前更新的优先级
	 */

	var setCurrentUpdatePriority = function setCurrentUpdatePriority(newPriority) {
	  currentUpdatePriority = newPriority;
	};
	/**
	 * 判断a的优先级是否比b大
	 * @param a a优先级
	 * @param b b优先级
	 * @returns
	 */

	var isHigherEventPriority = function isHigherEventPriority(a, b) {
	  return a !== 0 && a < b;
	};
	/**
	 * 将lanes转换为与其优先级相符的事件优先级
	 * @param lanes 要转换的lanes
	 * @returns 对应的事件优先级
	 */


	var lanesToEventPriority = function lanesToEventPriority(lanes) {
	  var lane = getHighestPriorityLane(lanes); //lane的优先级不小于DiscreteEventPriority，直接返回DiscreteEventPriority

	  if (!isHigherEventPriority(DiscreteEventPriority, lane)) return DiscreteEventPriority; //和上面同理

	  if (!isHigherEventPriority(ContinuousEventPriority, lane)) {
	    return ContinuousEventPriority;
	  } //有lane被占用，但是优先级没有上面的两个高，返回DefaultEventPriority


	  if (includesNonIdleWork(lane)) return DefaultEventPriority;
	  return IdleEventPriority;
	};

	// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it


	var arrayBufferNonExtensible = fails(function () {
	  if (typeof ArrayBuffer == 'function') {
	    var buffer = new ArrayBuffer(8);
	    // eslint-disable-next-line es-x/no-object-isextensible, es-x/no-object-defineproperty -- safe
	    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
	  }
	});

	// eslint-disable-next-line es-x/no-object-isextensible -- safe
	var $isExtensible = Object.isExtensible;
	var FAILS_ON_PRIMITIVES = fails(function () { $isExtensible(1); });

	// `Object.isExtensible` method
	// https://tc39.es/ecma262/#sec-object.isextensible
	var objectIsExtensible = (FAILS_ON_PRIMITIVES || arrayBufferNonExtensible) ? function isExtensible(it) {
	  if (!isObject(it)) return false;
	  if (arrayBufferNonExtensible && classofRaw(it) == 'ArrayBuffer') return false;
	  return $isExtensible ? $isExtensible(it) : true;
	} : $isExtensible;

	var freezing = !fails(function () {
	  // eslint-disable-next-line es-x/no-object-isextensible, es-x/no-object-preventextensions -- required for testing
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var internalMetadata = createCommonjsModule(function (module) {
	var defineProperty = objectDefineProperty.f;






	var REQUIRED = false;
	var METADATA = uid('meta');
	var id = 0;

	var setMetadata = function (it) {
	  defineProperty(it, METADATA, { value: {
	    objectID: 'O' + id++, // object ID
	    weakData: {}          // weak collections IDs
	  } });
	};

	var fastKey = function (it, create) {
	  // return a primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!hasOwnProperty_1(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!objectIsExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMetadata(it);
	  // return object ID
	  } return it[METADATA].objectID;
	};

	var getWeakData = function (it, create) {
	  if (!hasOwnProperty_1(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!objectIsExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMetadata(it);
	  // return the store of weak collections IDs
	  } return it[METADATA].weakData;
	};

	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (freezing && REQUIRED && objectIsExtensible(it) && !hasOwnProperty_1(it, METADATA)) setMetadata(it);
	  return it;
	};

	var enable = function () {
	  meta.enable = function () { /* empty */ };
	  REQUIRED = true;
	  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	  var splice = functionUncurryThis([].splice);
	  var test = {};
	  test[METADATA] = 1;

	  // prevent exposing of metadata key
	  if (getOwnPropertyNames(test).length) {
	    objectGetOwnPropertyNames.f = function (it) {
	      var result = getOwnPropertyNames(it);
	      for (var i = 0, length = result.length; i < length; i++) {
	        if (result[i] === METADATA) {
	          splice(result, i, 1);
	          break;
	        }
	      } return result;
	    };

	    _export({ target: 'Object', stat: true, forced: true }, {
	      getOwnPropertyNames: objectGetOwnPropertyNamesExternal.f
	    });
	  }
	};

	var meta = module.exports = {
	  enable: enable,
	  fastKey: fastKey,
	  getWeakData: getWeakData,
	  onFreeze: onFreeze
	};

	hiddenKeys[METADATA] = true;
	});
	var internalMetadata_1 = internalMetadata.enable;
	var internalMetadata_2 = internalMetadata.fastKey;
	var internalMetadata_3 = internalMetadata.getWeakData;
	var internalMetadata_4 = internalMetadata.onFreeze;

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var ArrayPrototype = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR$2] === it);
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return getMethod(it, ITERATOR$3)
	    || getMethod(it, '@@iterator')
	    || iterators[classof(it)];
	};

	var $TypeError$9 = TypeError;

	var getIterator = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
	  if (aCallable(iteratorMethod)) return anObject(functionCall(iteratorMethod, argument));
	  throw $TypeError$9(tryToString(argument) + ' is not iterable');
	};

	var iteratorClose = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject(iterator);
	  try {
	    innerResult = getMethod(iterator, 'return');
	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }
	    innerResult = functionCall(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }
	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject(innerResult);
	  return value;
	};

	var $TypeError$a = TypeError;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var ResultPrototype = Result.prototype;

	var iterate = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_RECORD = !!(options && options.IS_RECORD);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = functionBindContext(unboundFunction, that);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) iteratorClose(iterator, 'normal', condition);
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    } return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_RECORD) {
	    iterator = iterable.iterator;
	  } else if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (!iterFn) throw $TypeError$a(tryToString(iterable) + ' is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && objectIsPrototypeOf(ResultPrototype, result)) return result;
	      } return new Result(false);
	    }
	    iterator = getIterator(iterable, iterFn);
	  }

	  next = IS_RECORD ? iterable.next : iterator.next;
	  while (!(step = functionCall(next, iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose(iterator, 'throw', error);
	    }
	    if (typeof result == 'object' && result && objectIsPrototypeOf(ResultPrototype, result)) return result;
	  } return new Result(false);
	};

	var $TypeError$b = TypeError;

	var anInstance = function (it, Prototype) {
	  if (objectIsPrototypeOf(Prototype, it)) return it;
	  throw $TypeError$b('Incorrect invocation');
	};

	var defineProperty$b = objectDefineProperty.f;
	var forEach = arrayIteration.forEach;



	var setInternalState$3 = internalState.set;
	var internalStateGetterFor = internalState.getterFor;

	var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
	  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
	  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var exported = {};
	  var Constructor;

	  if (!descriptors || !isCallable(NativeConstructor)
	    || !(IS_WEAK || NativePrototype.forEach && !fails(function () { new NativeConstructor().entries().next(); }))
	  ) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    internalMetadata.enable();
	  } else {
	    Constructor = wrapper(function (target, iterable) {
	      setInternalState$3(anInstance(target, Prototype), {
	        type: CONSTRUCTOR_NAME,
	        collection: new NativeConstructor()
	      });
	      if (iterable != undefined) iterate(iterable, target[ADDER], { that: target, AS_ENTRIES: IS_MAP });
	    });

	    var Prototype = Constructor.prototype;

	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    forEach(['add', 'clear', 'delete', 'forEach', 'get', 'has', 'set', 'keys', 'values', 'entries'], function (KEY) {
	      var IS_ADDER = KEY == 'add' || KEY == 'set';
	      if (KEY in NativePrototype && !(IS_WEAK && KEY == 'clear')) {
	        createNonEnumerableProperty(Prototype, KEY, function (a, b) {
	          var collection = getInternalState(this).collection;
	          if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
	          var result = collection[KEY](a === 0 ? 0 : a, b);
	          return IS_ADDER ? this : result;
	        });
	      }
	    });

	    IS_WEAK || defineProperty$b(Prototype, 'size', {
	      configurable: true,
	      get: function () {
	        return getInternalState(this).collection.size;
	      }
	    });
	  }

	  setToStringTag(Constructor, CONSTRUCTOR_NAME, false, true);

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  _export({ global: true, forced: true }, exported);

	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

	  return Constructor;
	};

	var defineBuiltIns = function (target, src, options) {
	  for (var key in src) {
	    if (options && options.unsafe && target[key]) target[key] = src[key];
	    else defineBuiltIn(target, key, src[key], options);
	  } return target;
	};

	var SPECIES$2 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$2]) {
	    defineProperty(Constructor, SPECIES$2, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var defineProperty$c = objectDefineProperty.f;








	var fastKey = internalMetadata.fastKey;


	var setInternalState$4 = internalState.set;
	var internalStateGetterFor$1 = internalState.getterFor;

	var collectionStrong = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var Constructor = wrapper(function (that, iterable) {
	      anInstance(that, Prototype);
	      setInternalState$4(that, {
	        type: CONSTRUCTOR_NAME,
	        index: objectCreate(null),
	        first: undefined,
	        last: undefined,
	        size: 0
	      });
	      if (!descriptors) that.size = 0;
	      if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
	    });

	    var Prototype = Constructor.prototype;

	    var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var entry = getEntry(that, key);
	      var previous, index;
	      // change existing entry
	      if (entry) {
	        entry.value = value;
	      // create new entry
	      } else {
	        state.last = entry = {
	          index: index = fastKey(key, true),
	          key: key,
	          value: value,
	          previous: previous = state.last,
	          next: undefined,
	          removed: false
	        };
	        if (!state.first) state.first = entry;
	        if (previous) previous.next = entry;
	        if (descriptors) state.size++;
	        else that.size++;
	        // add to index
	        if (index !== 'F') state.index[index] = entry;
	      } return that;
	    };

	    var getEntry = function (that, key) {
	      var state = getInternalState(that);
	      // fast case
	      var index = fastKey(key);
	      var entry;
	      if (index !== 'F') return state.index[index];
	      // frozen object case
	      for (entry = state.first; entry; entry = entry.next) {
	        if (entry.key == key) return entry;
	      }
	    };

	    defineBuiltIns(Prototype, {
	      // `{ Map, Set }.prototype.clear()` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.clear
	      // https://tc39.es/ecma262/#sec-set.prototype.clear
	      clear: function clear() {
	        var that = this;
	        var state = getInternalState(that);
	        var data = state.index;
	        var entry = state.first;
	        while (entry) {
	          entry.removed = true;
	          if (entry.previous) entry.previous = entry.previous.next = undefined;
	          delete data[entry.index];
	          entry = entry.next;
	        }
	        state.first = state.last = undefined;
	        if (descriptors) state.size = 0;
	        else that.size = 0;
	      },
	      // `{ Map, Set }.prototype.delete(key)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.delete
	      // https://tc39.es/ecma262/#sec-set.prototype.delete
	      'delete': function (key) {
	        var that = this;
	        var state = getInternalState(that);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.next;
	          var prev = entry.previous;
	          delete state.index[entry.index];
	          entry.removed = true;
	          if (prev) prev.next = next;
	          if (next) next.previous = prev;
	          if (state.first == entry) state.first = next;
	          if (state.last == entry) state.last = prev;
	          if (descriptors) state.size--;
	          else that.size--;
	        } return !!entry;
	      },
	      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.foreach
	      // https://tc39.es/ecma262/#sec-set.prototype.foreach
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        var state = getInternalState(this);
	        var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	        var entry;
	        while (entry = entry ? entry.next : state.first) {
	          boundFunction(entry.value, entry.key, this);
	          // revert to the last existing entry
	          while (entry && entry.removed) entry = entry.previous;
	        }
	      },
	      // `{ Map, Set}.prototype.has(key)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.has
	      // https://tc39.es/ecma262/#sec-set.prototype.has
	      has: function has(key) {
	        return !!getEntry(this, key);
	      }
	    });

	    defineBuiltIns(Prototype, IS_MAP ? {
	      // `Map.prototype.get(key)` method
	      // https://tc39.es/ecma262/#sec-map.prototype.get
	      get: function get(key) {
	        var entry = getEntry(this, key);
	        return entry && entry.value;
	      },
	      // `Map.prototype.set(key, value)` method
	      // https://tc39.es/ecma262/#sec-map.prototype.set
	      set: function set(key, value) {
	        return define(this, key === 0 ? 0 : key, value);
	      }
	    } : {
	      // `Set.prototype.add(value)` method
	      // https://tc39.es/ecma262/#sec-set.prototype.add
	      add: function add(value) {
	        return define(this, value = value === 0 ? 0 : value, value);
	      }
	    });
	    if (descriptors) defineProperty$c(Prototype, 'size', {
	      get: function () {
	        return getInternalState(this).size;
	      }
	    });
	    return Constructor;
	  },
	  setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
	    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
	    var getInternalCollectionState = internalStateGetterFor$1(CONSTRUCTOR_NAME);
	    var getInternalIteratorState = internalStateGetterFor$1(ITERATOR_NAME);
	    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
	    // https://tc39.es/ecma262/#sec-map.prototype.entries
	    // https://tc39.es/ecma262/#sec-map.prototype.keys
	    // https://tc39.es/ecma262/#sec-map.prototype.values
	    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
	    // https://tc39.es/ecma262/#sec-set.prototype.entries
	    // https://tc39.es/ecma262/#sec-set.prototype.keys
	    // https://tc39.es/ecma262/#sec-set.prototype.values
	    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
	    defineIterator(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
	      setInternalState$4(this, {
	        type: ITERATOR_NAME,
	        target: iterated,
	        state: getInternalCollectionState(iterated),
	        kind: kind,
	        last: undefined
	      });
	    }, function () {
	      var state = getInternalIteratorState(this);
	      var kind = state.kind;
	      var entry = state.last;
	      // revert to the last existing entry
	      while (entry && entry.removed) entry = entry.previous;
	      // get next entry
	      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
	        // or finish the iteration
	        state.target = undefined;
	        return { value: undefined, done: true };
	      }
	      // return step by kind
	      if (kind == 'keys') return { value: entry.key, done: false };
	      if (kind == 'values') return { value: entry.value, done: false };
	      return { value: [entry.key, entry.value], done: false };
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // `{ Map, Set }.prototype[@@species]` accessors
	    // https://tc39.es/ecma262/#sec-get-map-@@species
	    // https://tc39.es/ecma262/#sec-get-set-@@species
	    setSpecies(CONSTRUCTOR_NAME);
	  }
	};

	// `Set` constructor
	// https://tc39.es/ecma262/#sec-set-objects
	collection('Set', function (init) {
	  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var set$2 = path.Set;

	var set$3 = set$2;

	var set$4 = set$3;

	var allNativeEvents = new set$4();
	/**
	 * Mapping from registration name to event name
	 */

	var registrationNameDependencies = {};
	var registerDirectEvent = function registerDirectEvent(registrationName, dependencies) {
	  if (registrationNameDependencies[registrationName]) {
	    console.error('EventRegistry: More than one plugin attempted to publish the same ' + 'registration name, `%s`.', registrationName);
	  }

	  registrationNameDependencies[registrationName] = dependencies;

	  for (var i = 0; i < dependencies.length; ++i) {
	    allNativeEvents.add(dependencies[i]);
	  }
	};
	var registerTwoPhaseEvent = function registerTwoPhaseEvent(registrationName, dependencies) {
	  registerDirectEvent(registrationName, dependencies);
	  registerDirectEvent(registrationName + 'Capture', dependencies);
	};

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

	var SPECIES$3 = wellKnownSymbol('species');
	var $Array$2 = Array;
	var max$2 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = lengthOfArrayLike(O);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (isConstructor(Constructor) && (Constructor === $Array$2 || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$3];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === $Array$2 || Constructor === undefined) {
	        return arraySlice(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? $Array$2 : Constructor)(max$2(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var slice = entryVirtual('Array').slice;

	var ArrayPrototype$1 = Array.prototype;

	var slice$1 = function (it) {
	  var own = it.slice;
	  return it === ArrayPrototype$1 || (objectIsPrototypeOf(ArrayPrototype$1, it) && own === ArrayPrototype$1.slice) ? slice : own;
	};

	var slice$2 = slice$1;

	var slice$3 = slice$2;

	var _context;

	var randomKey = slice$3(_context = Math.random().toString(36)).call(_context, 2);

	var internalPropsKey = '__reactProps$' + randomKey;
	var internalInstanceKey = '__reactFiber$' + randomKey;
	var getFiberCurrentPropsFromNode = function getFiberCurrentPropsFromNode(node) {
	  return node[internalPropsKey];
	};
	var getClosestInstanceFromNode = function getClosestInstanceFromNode(targetNode) {
	  var targetInst = targetNode[internalInstanceKey];
	  return targetInst !== null && targetInst !== void 0 ? targetInst : null;
	};
	var precacheFiberNode = function precacheFiberNode(hostInst, node) {
	  node[internalInstanceKey] = hostInst;
	};
	/**
	 * 将jsx的props挂载到对应的dom节点上，待会该dom触发事件时
	 * ReactDOM就能从event.target中获取到事件的handlers
	 * @param node 要挂再属性的dom节点
	 * @param props 要挂载的属性比如 {onClick: () => {}}
	 */

	var updateFiberProps = function updateFiberProps(node, props) {
	  node[internalPropsKey] = props;
	};

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call -- required for testing
	    method.call(null, argument || function () { return 1; }, 1);
	  });
	};

	var $forEach$1 = arrayIteration.forEach;


	var STRICT_METHOD = arrayMethodIsStrict('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	var arrayForEach = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	// eslint-disable-next-line es-x/no-array-prototype-foreach -- safe
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	// eslint-disable-next-line es-x/no-array-prototype-foreach -- safe
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	var forEach$1 = entryVirtual('Array').forEach;

	var forEach$2 = forEach$1;

	var ArrayPrototype$2 = Array.prototype;

	var DOMIterables = {
	  DOMTokenList: true,
	  NodeList: true
	};

	var forEach$3 = function (it) {
	  var own = it.forEach;
	  return it === ArrayPrototype$2 || (objectIsPrototypeOf(ArrayPrototype$2, it) && own === ArrayPrototype$2.forEach)
	    || hasOwnProperty_1(DOMIterables, classof(it)) ? forEach$2 : own;
	};

	var forEach$4 = forEach$3;

	var addEventCaptureListenerWithPassiveFlag = function addEventCaptureListenerWithPassiveFlag(target, eventType, listener, passive) {
	  target.addEventListener(eventType, listener, {
	    capture: true,
	    passive: passive
	  });
	  return listener;
	};
	var addEventCaptureListener = function addEventCaptureListener(target, eventType, listener) {
	  target.addEventListener(eventType, listener, true);
	  return listener;
	};
	var addEventBubbleListenerWithPassiveFlag = function addEventBubbleListenerWithPassiveFlag(target, eventType, listener, passive) {
	  target.addEventListener(eventType, listener, {
	    passive: passive
	  });
	  return listener;
	};
	var addEventBubbleListener = function addEventBubbleListener(target, eventType, listener) {
	  target.addEventListener(eventType, listener, false);
	  return listener;
	};

	var IS_EVENT_HANDLE_NON_MANAGED_NODE = 1;
	var IS_NON_DELEGATED = 1 << 1;
	var IS_CAPTURE_PHASE = 1 << 2;
	var SHOULD_NOT_PROCESS_POLYFILL_EVENT_PLUGINS = IS_EVENT_HANDLE_NON_MANAGED_NODE | IS_NON_DELEGATED | IS_CAPTURE_PHASE;

	/**
	 * HTML nodeType values that represent the type of the node
	 */
	var TEXT_NODE = 3;
	var COMMENT_NODE = 8;

	var getEventTarget = function getEventTarget(nativeEvent) {
	  var target = nativeEvent.target || window;
	  return target.nodeType === TEXT_NODE ? target.parentNode : target;
	};

	var isInteractive = function isInteractive(tag) {
	  return tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea';
	};

	var shouldPreventMouseEvent = function shouldPreventMouseEvent(name, type, props) {
	  switch (name) {
	    case 'onClick':
	    case 'onClickCapture':
	    case 'onDoubleClick':
	    case 'onDoubleClickCapture':
	    case 'onMouseDown':
	    case 'onMouseDownCapture':
	    case 'onMouseMove':
	    case 'onMouseMoveCapture':
	    case 'onMouseUp':
	    case 'onMouseUpCapture':
	    case 'onMouseEnter':
	      return !!(props.disabled && isInteractive(type));

	    default:
	      return false;
	  }
	};

	var getListener = function getListener(instance, registrationName) {
	  var stateNode = instance.stateNode;
	  if (stateNode === null) return null;
	  var props = getFiberCurrentPropsFromNode(stateNode);
	  if (props === null) return null;
	  var listener = props[registrationName];
	  if (shouldPreventMouseEvent(registrationName, instance.type, props)) return null;
	  return listener !== null && listener !== void 0 ? listener : null;
	};

	// `Map` constructor
	// https://tc39.es/ecma262/#sec-map-objects
	collection('Map', function (init) {
	  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var map = path.Map;

	var map$1 = map;

	var map$2 = map$1;

	var simpleEventPluginEvents = ['abort', 'auxClick', 'cancel', 'canPlay', 'canPlayThrough', 'click', 'close', 'contextMenu', 'copy', 'cut', 'drag', 'dragEnd', 'dragEnter', 'dragExit', 'dragLeave', 'dragOver', 'dragStart', 'drop', 'durationChange', 'emptied', 'encrypted', 'ended', 'error', 'gotPointerCapture', 'input', 'invalid', 'keyDown', 'keyPress', 'keyUp', 'load', 'loadedData', 'loadedMetadata', 'loadStart', 'lostPointerCapture', 'mouseDown', 'mouseMove', 'mouseOut', 'mouseOver', 'mouseUp', 'paste', 'pause', 'play', 'playing', 'pointerCancel', 'pointerDown', 'pointerMove', 'pointerOut', 'pointerOver', 'pointerUp', 'progress', 'rateChange', 'reset', 'seeked', 'seeking', 'stalled', 'submit', 'suspend', 'timeUpdate', 'touchCancel', 'touchEnd', 'touchStart', 'volumeChange', 'scroll', 'toggle', 'touchMove', 'waiting', 'wheel'];
	var topLevelEventsToReactNames = new map$2();

	var registerSimpleEvent = function registerSimpleEvent(domEventName, reactName) {
	  topLevelEventsToReactNames.set(domEventName, reactName);
	  registerTwoPhaseEvent(reactName, [domEventName]);
	};

	var registerSimpleEvents = function registerSimpleEvents() {
	  for (var i = 0; i < simpleEventPluginEvents.length; ++i) {
	    var eventName = simpleEventPluginEvents[i];
	    var domEventName = eventName.toLowerCase();

	    var capitalizedEvent = eventName[0].toUpperCase() + slice$3(eventName).call(eventName, 1);

	    registerSimpleEvent(domEventName, 'on' + capitalizedEvent);
	  }

	  registerSimpleEvent('focusin', 'onFocus');
	  registerSimpleEvent('focusout', 'onBlur');
	};

	var createSyntheticEvent = function createSyntheticEvent() {
	  var SyntheticBaseEvent = /*#__PURE__*/_createClass(function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
	    _classCallCheck(this, SyntheticBaseEvent);

	    _defineProperty(this, "_reactName", null);

	    _defineProperty(this, "_targetInst", void 0);

	    _defineProperty(this, "type", void 0);

	    _defineProperty(this, "nativeEvent", void 0);

	    _defineProperty(this, "target", void 0);

	    this._reactName = reactName;
	    this._targetInst = targetInst;
	    this.type = reactEventType;
	    this.nativeEvent = nativeEvent;
	    this.target = nativeEventTarget;
	  });

	  return SyntheticBaseEvent;
	};
	var SyntheticEvent = createSyntheticEvent();
	var SyntheticMouseEvent = createSyntheticEvent();
	var SyntheticKeyboardEvent = createSyntheticEvent();

	var extractEvents = function extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
	  var _topLevelEventsToReac;

	  var SyntheticEventCtor = SyntheticEvent;

	  switch (domEventName) {
	    case 'keydown':
	    case 'keyup':
	      SyntheticEventCtor = SyntheticKeyboardEvent;
	      break;

	    case 'click':
	      SyntheticEventCtor = SyntheticMouseEvent;
	  }

	  var reactName = (_topLevelEventsToReac = topLevelEventsToReactNames.get(domEventName)) !== null && _topLevelEventsToReac !== void 0 ? _topLevelEventsToReac : null;
	  var inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
	  var accumulateTargetOnly = !inCapturePhase && domEventName === 'scroll';
	  var listeners = accumulateSinglePhaseListeners(targetInst, reactName, inCapturePhase, accumulateTargetOnly);

	  if (listeners.length) {
	    var event = new SyntheticEventCtor(reactName, '', null, nativeEvent, nativeEventTarget);
	    dispatchQueue.push({
	      event: event,
	      listeners: listeners
	    });
	  }
	};

	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;


	var FAILS_ON_PRIMITIVES$1 = fails(function () { nativeGetOwnPropertyDescriptor$1(1); });
	var FORCED$2 = !descriptors || FAILS_ON_PRIMITIVES$1;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	_export({ target: 'Object', stat: true, forced: FORCED$2, sham: !descriptors }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
	    return nativeGetOwnPropertyDescriptor$1(toIndexedObject(it), key);
	  }
	});

	var getOwnPropertyDescriptor_1 = createCommonjsModule(function (module) {
	var Object = path.Object;

	var getOwnPropertyDescriptor = module.exports = function getOwnPropertyDescriptor(it, key) {
	  return Object.getOwnPropertyDescriptor(it, key);
	};

	if (Object.getOwnPropertyDescriptor.sham) getOwnPropertyDescriptor.sham = true;
	});

	var getOwnPropertyDescriptor$3 = getOwnPropertyDescriptor_1;

	var getOwnPropertyDescriptor$4 = getOwnPropertyDescriptor$3;

	var defineProperty$d = defineProperty$4;

	var getTracker = function getTracker(node) {
	  return node._valueTracker;
	};

	var isCheckable = function isCheckable(elem) {
	  var type = elem.type;
	  var nodeName = elem.nodeName;
	  return nodeName && nodeName.toLowerCase() === 'input' && (type === 'checkbox' || type === 'radio');
	};

	var detachTracker = function detachTracker(node) {
	  node._valueTracker = undefined;
	};

	var trackValueOnNode = function trackValueOnNode(node) {
	  var valueField = isCheckable(node) ? 'checked' : 'value';

	  var descriptor = getOwnPropertyDescriptor$4(node.constructor.prototype, valueField);

	  var currentValue = '' + node[valueField];
	  if (!descriptor) return;
	  var _get = descriptor.get,
	      _set = descriptor.set;

	  defineProperty$d(node, valueField, {
	    configurable: true,
	    get: function get() {
	      return _get === null || _get === void 0 ? void 0 : _get.call(this);
	    },
	    set: function set(value) {
	      currentValue = '' + value;
	      _set === null || _set === void 0 ? void 0 : _set.call(this, value);
	    }
	  });

	  var tracker = {
	    getValue: function getValue() {
	      return currentValue;
	    },
	    setValue: function setValue(value) {
	      currentValue = '' + value;
	    },
	    stopTracking: function stopTracking() {
	      detachTracker(node);
	      delete node[valueField];
	    }
	  };
	  return tracker;
	};

	var track = function track(node) {
	  if (getTracker(node)) return;
	  node._valueTracker = trackValueOnNode(node);
	};

	var getValueFromNode = function getValueFromNode(node) {
	  var value = '';

	  if (!node) {
	    return value;
	  }

	  if (isCheckable(node)) value = node.checked ? 'true' : 'false';else {
	    value = node.value;
	  }
	  return value;
	};

	var updateValueIfChanged = function updateValueIfChanged(node) {
	  if (!node) return false;
	  var tracker = getTracker(node); //如果到这个时刻还没有tracker,如果此时不更新，那么以后也不太可能会正常更新了

	  if (!tracker) return true;
	  var lastValue = tracker.getValue();
	  var nextValue = getValueFromNode(node);

	  if (nextValue !== lastValue) {
	    tracker.setValue(nextValue);
	    return true;
	  }

	  return false;
	};

	var registerEvents = function registerEvents() {
	  registerTwoPhaseEvent('onChange', ['change', 'click', 'focusin', 'focusout', 'input', 'keydown', 'keyup', 'selectionchange']);
	};

	var shouldUseChangeEvent = function shouldUseChangeEvent(elem) {
	  var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
	  return nodeName === 'select' || nodeName === 'input' && elem.type === 'file';
	};

	var isTextInputElement = function isTextInputElement(elem) {
	  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();

	  if (nodeName === 'input' || nodeName === 'textarea') {
	    return true;
	  }

	  return false;
	};

	var getInstIfValueChanged = function getInstIfValueChanged(targetInst) {
	  var targetNode = targetInst.stateNode;

	  if (updateValueIfChanged(targetNode)) {
	    return targetInst;
	  }
	};

	var getTargetInstForInputOrChangeEvent = function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
	  if (domEventName === 'input' || domEventName === 'change') {
	    return getInstIfValueChanged(targetInst);
	  }
	};

	var createAndAccumulateChangeEvent = function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
	  var listeners = accumulateTwoPhaseListeners(inst, 'onChange');

	  if (listeners.length > 0) {
	    var event = new SyntheticEvent('onChange', 'change', null, nativeEvent, target);
	    dispatchQueue.push({
	      event: event,
	      listeners: listeners
	    });
	  }
	};

	var shouldUseClickEvent = function shouldUseClickEvent(elem) {
	  var nodeName = elem.nodeName;
	  return nodeName && nodeName.toLowerCase() === 'input' && (elem.type === 'checkbox' || elem.type === 'radio');
	};

	var extractEvents$1 = function extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
	  var targetNode = targetInst ? targetInst.stateNode : window;
	  var getTargetInstFunc;

	  if (shouldUseChangeEvent(targetNode)) {
	    throw new Error('Not Implement');
	  } else if (isTextInputElement(targetNode)) {
	    getTargetInstFunc = getTargetInstForInputOrChangeEvent;
	  } else if (shouldUseClickEvent(targetNode)) {
	    throw new Error('Not Implement');
	  }

	  if (getTargetInstFunc) {
	    var inst = getTargetInstFunc(domEventName, targetInst);

	    if (inst) {
	      createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, nativeEventTarget);
	      return;
	    }
	  }
	};

	var _context$1;

	var listeningMarker = '_reactListening' + slice$3(_context$1 = Math.random().toString(36)).call(_context$1, 2);

	registerSimpleEvents();
	registerEvents();
	/**
	 * 我们不因该在container代理这些事件，而是因该把他们添加到真正的目标dom上
	 * 主要是因为这些事件的冒泡不具有一致性
	 */

	var nonDelegatedEvents = new set$4(['cancel', 'close', 'invalid', 'load', 'scroll', 'toggle']);

	var addTrappedEventListener = function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
	  var listener = createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags);
	  var isPassiveListener = undefined;

	  if (domEventName === 'wheel' || domEventName === 'touchmove' || domEventName === 'touchstart') {
	    isPassiveListener = true;
	  }

	  var unsubscribeListener;

	  if (isCapturePhaseListener) {
	    if (isPassiveListener !== undefined) {
	      unsubscribeListener = addEventCaptureListenerWithPassiveFlag(targetContainer, domEventName, listener, isPassiveListener);
	    } else {
	      unsubscribeListener = addEventCaptureListener(targetContainer, domEventName, listener);
	    }
	  } else {
	    if (isPassiveListener !== undefined) {
	      unsubscribeListener = addEventBubbleListenerWithPassiveFlag(targetContainer, domEventName, listener, isPassiveListener);
	    } else {
	      unsubscribeListener = addEventBubbleListener(targetContainer, domEventName, listener);
	    }
	  }
	};
	/**
	 * 在EventTarget注册一个事件
	 * @param domEventName 事件名称
	 * @param isCapturePhaseListener 是否为捕获阶段的事件 
	 * @param target container
	 */


	var listenToNativeEvent = function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
	  var eventSystemFlags = 0;

	  if (isCapturePhaseListener) {
	    eventSystemFlags |= IS_CAPTURE_PHASE;
	  }

	  addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
	};
	/**
	 * 将所有支持的事件在container上全都注册上
	 * @param rootContainerElement container
	 */


	var listenToAllSupportedEvents = function listenToAllSupportedEvents(rootContainerElement) {
	  if (!rootContainerElement[listeningMarker]) {
	    forEach$4(allNativeEvents).call(allNativeEvents, function (domEventName) {
	      /**
	       * 单独处理selectionchange因为他不会冒泡，而且需要设置在document上
	       */
	      if (domEventName !== 'selectionchange') {
	        if (!nonDelegatedEvents.has(domEventName)) {
	          listenToNativeEvent(domEventName, false, rootContainerElement);
	        }

	        listenToNativeEvent(domEventName, true, rootContainerElement);
	      }
	    });
	  }
	};

	var extractEvents$2 = function extractEvents$2(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
	  extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags);
	  var shouldProcessPolyfillPlugins = (eventSystemFlags & SHOULD_NOT_PROCESS_POLYFILL_EVENT_PLUGINS) === 0;

	  if (shouldProcessPolyfillPlugins) {
	    extractEvents$1(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
	  }
	};

	var createDispatchListener = function createDispatchListener(instance, listener, currentTarget) {
	  return {
	    instance: instance,
	    listener: listener,
	    currentTarget: currentTarget
	  };
	};

	var accumulateTwoPhaseListeners = function accumulateTwoPhaseListeners(targetFiber, reactName) {
	  var captureName = reactName + 'Capture';
	  var listeners = [];
	  var instance = targetFiber;

	  while (instance !== null) {
	    var _instance = instance,
	        stateNode = _instance.stateNode,
	        tag = _instance.tag;

	    if (tag === HostComponent && stateNode !== null) {
	      var currentTarget = stateNode;
	      var captureListener = getListener(instance, captureName);

	      if (captureListener !== null) {
	        listeners.unshift(createDispatchListener(instance, captureListener, currentTarget));
	      }

	      var bubbleListener = getListener(instance, reactName);

	      if (bubbleListener !== null) {
	        listeners.push(createDispatchListener(instance, bubbleListener, currentTarget));
	      }
	    }

	    instance = instance["return"];
	  }

	  return listeners;
	};
	var accumulateSinglePhaseListeners = function accumulateSinglePhaseListeners(targetFiber, reactName, inCapturePhase, accumulateTargetOnly) {
	  var captureName = reactName !== null ? reactName + 'Capture' : null;
	  var reactEventName = inCapturePhase ? captureName : reactName;
	  var listeners = [];
	  var instance = targetFiber;
	  var lastHostComponent = null;

	  while (instance !== null) {
	    var _instance2 = instance,
	        tag = _instance2.tag,
	        stateNode = _instance2.stateNode;

	    if (tag === HostComponent && stateNode !== null) {
	      lastHostComponent = stateNode;

	      if (reactEventName !== null) {
	        var listener = getListener(instance, reactEventName);

	        if (listener !== null) {
	          listeners.push(createDispatchListener(instance, listener, lastHostComponent));
	        }
	      }
	    }

	    if (accumulateTargetOnly) break;
	    instance = instance["return"];
	  }

	  return listeners;
	};

	var executeDispatch = function executeDispatch(event, listener, currentTarget) {
	  listener(event);
	};

	var processDispatchQueueItemsInOrder = function processDispatchQueueItemsInOrder(event, dispatchListeners, inCapturePhase) {
	  if (inCapturePhase) {
	    for (var i = dispatchListeners.length - 1; i >= 0; --i) {
	      var _dispatchListeners$i = dispatchListeners[i],
	          instance = _dispatchListeners$i.instance,
	          currentTarget = _dispatchListeners$i.currentTarget,
	          listener = _dispatchListeners$i.listener; //todo isPropagationStopped

	      executeDispatch(event, listener);
	    }
	  } else {
	    for (var _i = 0; _i < dispatchListeners.length; ++_i) {
	      var _dispatchListeners$_i = dispatchListeners[_i],
	          _instance3 = _dispatchListeners$_i.instance,
	          _currentTarget = _dispatchListeners$_i.currentTarget,
	          _listener = _dispatchListeners$_i.listener; //todo isPropagationStopped

	      executeDispatch(event, _listener);
	    }
	  }
	};

	var processDispatchQueue = function processDispatchQueue(dispatchQueue, eventSystemFlags) {
	  var inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;

	  for (var i = 0; i < dispatchQueue.length; ++i) {
	    var _dispatchQueue$i = dispatchQueue[i],
	        event = _dispatchQueue$i.event,
	        listeners = _dispatchQueue$i.listeners;
	    processDispatchQueueItemsInOrder(event, listeners, inCapturePhase);
	  }
	};

	var dispatchEventsForPlugins = function dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
	  var nativeEventTarget = getEventTarget(nativeEvent);
	  var dispatchQueue = [];
	  extractEvents$2(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags);
	  processDispatchQueue(dispatchQueue, eventSystemFlags);
	};

	var dispatchEventForPluginEventSystem = function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
	  var ancestorInst = targetInst;
	  batchedEventUpdates(function () {
	    return dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, ancestorInst, targetContainer);
	  }, null);
	};

	var dispatchDiscreteEvent = function dispatchDiscreteEvent(domEventName, eventSymtemFlags, container, nativeEvent) {
	  discreteUpdates(dispatchEvent, domEventName, eventSymtemFlags, container, nativeEvent);
	};

	var attemptToDispatchEvent = function attemptToDispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
	  var nativeEventTarget = getEventTarget(nativeEvent);
	  var targetInst = getClosestInstanceFromNode(nativeEventTarget);
	  dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer);
	  return null;
	};

	var dispatchEvent = function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
	  attemptToDispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent);
	};

	var dispatchContinuousEvent = function dispatchContinuousEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
	  var previousPriority = getCurrentUpdatePriority();

	  try {
	    setCurrentUpdatePriority(ContinuousEventPriority);
	    dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent);
	  } finally {
	    setCurrentUpdatePriority(previousPriority);
	  }
	};

	var createEventListenerWrapperWithPriority = function createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSymtemFlags) {
	  var eventPriority = getEventPriority(domEventName);
	  var listenerWrapper;

	  switch (eventPriority) {
	    case DiscreteEventPriority:
	      listenerWrapper = dispatchDiscreteEvent;
	      break;

	    case DefaultEventPriority:
	      listenerWrapper = dispatchEvent;
	      break;

	    case ContinuousEventPriority:
	      listenerWrapper = dispatchContinuousEvent;
	      break;

	    default:
	      throw new Error('Not Implement');
	  }

	  return bind$5(listenerWrapper).call(listenerWrapper, null, domEventName, eventSymtemFlags, targetContainer);
	};
	var getEventPriority = function getEventPriority(domEventName) {
	  switch (domEventName) {
	    case 'cancel':
	    case 'click':
	    case 'close':
	    case 'contextmenu':
	    case 'copy':
	    case 'cut':
	    case 'auxclick':
	    case 'dblclick':
	    case 'dragend':
	    case 'dragstart':
	    case 'drop':
	    case 'focusin':
	    case 'focusout':
	    case 'input':
	    case 'invalid':
	    case 'keydown':
	    case 'keypress':
	    case 'keyup':
	    case 'mousedown':
	    case 'mouseup':
	    case 'paste':
	    case 'pause':
	    case 'play':
	    case 'pointercancel':
	    case 'pointerdown':
	    case 'pointerup':
	    case 'ratechange':
	    case 'reset':
	    case 'seeked':
	    case 'submit':
	    case 'touchcancel':
	    case 'touchend':
	    case 'touchstart':
	    case 'volumechange': // Used by polyfills:
	    // eslint-disable-next-line no-fallthrough

	    case 'change':
	    case 'selectionchange':
	    case 'textInput':
	    case 'compositionstart':
	    case 'compositionend':
	    case 'compositionupdate': // Only enableCreateEventHandleAPI:
	    // eslint-disable-next-line no-fallthrough

	    case 'beforeblur':
	    case 'afterblur': // Not used by React but could be by user code:
	    // eslint-disable-next-line no-fallthrough

	    case 'beforeinput':
	    case 'blur':
	    case 'fullscreenchange':
	    case 'focus':
	    case 'hashchange':
	    case 'popstate':
	    case 'select':
	    case 'selectstart':
	      return DiscreteEventPriority;

	    case 'drag':
	    case 'dragenter':
	    case 'dragexit':
	    case 'dragleave':
	    case 'dragover':
	    case 'mousemove':
	    case 'mouseout':
	    case 'mouseover':
	    case 'pointermove':
	    case 'pointerout':
	    case 'pointerover':
	    case 'scroll':
	    case 'toggle':
	    case 'touchmove':
	    case 'wheel': // Not used by React but could be by user code:
	    // eslint-disable-next-line no-fallthrough

	    case 'mouseenter':
	    case 'mouseleave':
	    case 'pointerenter':
	    case 'pointerleave':
	      return ContinuousEventPriority;

	    case 'message':
	      throw new Error('Not Implement');

	    default:
	      return DefaultEventPriority;
	  }
	};

	var setTextContent = function setTextContent(node, text) {
	  if (text) {
	    var firstChild = node.firstChild;

	    if (firstChild && firstChild === node.lastChild && firstChild.nodeType === TEXT_NODE) {
	      firstChild.nodeValue = text;
	      return;
	    }
	  }

	  node.textContent = text;
	};

	var getHostProps = function getHostProps(element, props) {
	  var node = element;
	  var checked = props.checked;

	  var hostProps = assign$2({}, props, {
	    defaultChecked: undefined,
	    defaultValue: undefined,
	    value: undefined,
	    checked: checked != null ? checked : node._wrapperState.initialChecked
	  });

	  return hostProps;
	};
	function getToStringValue(value) {
	  switch (_typeof(value)) {
	    case 'boolean':
	    case 'number':
	    case 'object':
	    case 'string':
	    case 'undefined':
	      return value;

	    default:
	      // function, symbol are assigned as empty strings
	      return '';
	  }
	}

	function isControlled(props) {
	  var usesChecked = props.type === 'checkbox' || props.type === 'radio';
	  return usesChecked ? props.checked != null : props.value != null;
	}

	var initWrapperState = function initWrapperState(element, props) {
	  var node = element;
	  var defaultValue = props.defaultValue == null ? '' : props.defaultValue;
	  node._wrapperState = {
	    initialChecked: props.checked != null ? props.checked : props.defaultChecked,
	    initialValue: getToStringValue(props.value != null ? props.value : defaultValue),
	    controlled: isControlled(props)
	  };
	};
	var postMountWrapper = function postMountWrapper(element, props) {
	  var node = element;

	  if (props.hasOwnProperty('value') || props.hasOwnProperty('defaultValue')) {
	    var initialValue = node._wrapperState.initialValue + '';

	    if (initialValue !== node.value) {
	      node.value = initialValue;
	    }

	    node.defaultValue = initialValue;
	    node.defaultChecked = !!node._wrapperState.initialChecked;
	  }
	};
	var updateChecked = function updateChecked(element, props) {
	  var node = element;
	  var checked = props.checked;

	  if (checked != null) {
	    node.setAttribute('checked', checked + '');
	  }
	};
	var updateWrapper = function updateWrapper(element, props) {
	  var node = element;
	  updateChecked(element, props);
	  var value = getToStringValue(props.value);

	  if (value != null) {
	    node.value = value + '';
	  }

	  if (props.hasOwnProperty('value')) {
	    node.defaultValue = value + '';
	  } else if (props.hasOwnProperty('defaultValue')) {
	    node.defaultValue = props.defaultValue + '';
	  }
	};

	// a string of all valid unicode whitespaces
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
	  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var replace$1 = functionUncurryThis(''.replace);
	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$3 = function (TYPE) {
	  return function ($this) {
	    var string = toString_1(requireObjectCoercible($this));
	    if (TYPE & 1) string = replace$1(string, ltrim, '');
	    if (TYPE & 2) string = replace$1(string, rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$3(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimend
	  end: createMethod$3(2),
	  // `String.prototype.trim` method
	  // https://tc39.es/ecma262/#sec-string.prototype.trim
	  trim: createMethod$3(3)
	};

	var PROPER_FUNCTION_NAME$1 = functionName.PROPER;



	var non = '\u200B\u0085\u180E';

	// check that a method works with the correct list
	// of whitespaces and has a correct name
	var stringTrimForced = function (METHOD_NAME) {
	  return fails(function () {
	    return !!whitespaces[METHOD_NAME]()
	      || non[METHOD_NAME]() !== non
	      || (PROPER_FUNCTION_NAME$1 && whitespaces[METHOD_NAME].name !== METHOD_NAME);
	  });
	};

	var $trim = stringTrim.trim;


	// `String.prototype.trim` method
	// https://tc39.es/ecma262/#sec-string.prototype.trim
	_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var trim = entryVirtual('String').trim;

	var StringPrototype = String.prototype;

	var trim$1 = function (it) {
	  var own = it.trim;
	  return typeof it == 'string' || it === StringPrototype
	    || (objectIsPrototypeOf(StringPrototype, it) && own === StringPrototype.trim) ? trim : own;
	};

	var trim$2 = trim$1;

	var trim$3 = trim$2;

	/* eslint-disable es-x/no-array-prototype-indexof -- required for testing */


	var $IndexOf = arrayIncludes.indexOf;


	var un$IndexOf = functionUncurryThis([].indexOf);

	var NEGATIVE_ZERO = !!un$IndexOf && 1 / un$IndexOf([1], 1, -0) < 0;
	var STRICT_METHOD$1 = arrayMethodIsStrict('indexOf');

	// `Array.prototype.indexOf` method
	// https://tc39.es/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$1 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? un$IndexOf(this, searchElement, fromIndex) || 0
	      : $IndexOf(this, searchElement, fromIndex);
	  }
	});

	var indexOf$1 = entryVirtual('Array').indexOf;

	var ArrayPrototype$3 = Array.prototype;

	var indexOf$2 = function (it) {
	  var own = it.indexOf;
	  return it === ArrayPrototype$3 || (objectIsPrototypeOf(ArrayPrototype$3, it) && own === ArrayPrototype$3.indexOf) ? indexOf$1 : own;
	};

	var indexOf$3 = indexOf$2;

	var indexOf$4 = indexOf$3;

	/**
	 * 不需要加单位的css属性
	 */
	var isUnitlessNumber = {
	  animationIterationCount: true,
	  aspectRatio: true,
	  borderImageOutset: true,
	  borderImageSlice: true,
	  borderImageWidth: true,
	  boxFlex: true,
	  boxFlexGroup: true,
	  boxOrdinalGroup: true,
	  columnCount: true,
	  columns: true,
	  flex: true,
	  flexGrow: true,
	  flexPositive: true,
	  flexShrink: true,
	  flexNegative: true,
	  flexOrder: true,
	  gridArea: true,
	  gridRow: true,
	  gridRowEnd: true,
	  gridRowSpan: true,
	  gridRowStart: true,
	  gridColumn: true,
	  gridColumnEnd: true,
	  gridColumnSpan: true,
	  gridColumnStart: true,
	  fontWeight: true,
	  lineClamp: true,
	  lineHeight: true,
	  opacity: true,
	  order: true,
	  orphans: true,
	  tabSize: true,
	  widows: true,
	  zIndex: true,
	  zoom: true,
	  // SVG-related properties
	  fillOpacity: true,
	  floodOpacity: true,
	  stopOpacity: true,
	  strokeDasharray: true,
	  strokeDashoffset: true,
	  strokeMiterlimit: true,
	  strokeOpacity: true,
	  strokeWidth: true
	};
	/**
	 * 根据CSS属性名称和CSS值为他加上合适的单位
	 * @param name CSS属性名
	 * @param value CSS值
	 * @param isCustomProperty 是否时自定义属性比如 `--bg-color`这种
	 * @returns 返回加上单位后的CSS值
	 */

	var dangerousStyleValue = function dangerousStyleValue(name, value, isCustomProperty) {
	  var _context;

	  var isEmpty = value === null || typeof value === 'boolean' || value === '';
	  if (isEmpty) return '';

	  if (!isCustomProperty && typeof value === 'number' && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) {
	    return value + 'px';
	  }

	  return trim$3(_context = '' + value).call(_context);
	};
	/**
	 * 根据style属性里面的对象，为dom节点设置样式
	 */


	var setValueForStyles = function setValueForStyles(node, styles) {
	  var style = node.style;

	  for (var styleName in styles) {
	    if (!styles.hasOwnProperty(styleName)) continue;
	    var isCustomProperty = indexOf$4(styleName).call(styleName, '--') === 0;
	    var styleValue = dangerousStyleValue(styleName, styles[styleName], isCustomProperty);

	    if (styleName === 'float') {
	      styleName = 'cssFloat';
	    }

	    style[styleName] = styleValue;
	  }
	};

	var reservedProps = new set$4(['children', 'dangerouslySetInnerHTML', // TODO: This prevents the assignment of defaultValue to regular
	// elements (not just inputs). Now that ReactDOMInput assigns to the
	// defaultValue property -- do we need this?
	'defaultValue', 'defaultChecked', 'innerHTML', 'suppressContentEditableWarning', 'suppressHydrationWarning', 'style']);
	var attributeNameMap = new map$2([['acceptCharset', 'accept-charset'], ['className', 'class'], ['htmlFor', 'for'], ['httpEquiv', 'http-equiv']]);

	var shouldIgnoreAttribute = function shouldIgnoreAttribute(name) {
	  if (reservedProps.has(name)) return true;

	  if (name.length > 2 && (name[0] === 'o' || name[0] === 'O') && (name[1] === 'n' || name[1] === 'N')) {
	    return true;
	  }

	  return false;
	};
	/**
	 * 为dom元素设置属性，比如将className，data-*设置为dom属性
	 * @param node 要设置属性的dom
	 * @param name 属性的名称
	 * @param value 属性的值
	 */


	var setValueForProperty = function setValueForProperty(node, name, value) {
	  var _attributeNameMap$get;

	  if (shouldIgnoreAttribute(name)) return;
	  var attributeName = (_attributeNameMap$get = attributeNameMap.get(name)) !== null && _attributeNameMap$get !== void 0 ? _attributeNameMap$get : name;

	  if (value === null) {
	    node.removeAttribute(attributeName);
	  } else {
	    node.setAttribute(attributeName, value + '');
	  }
	};

	var STYLE = 'style';
	var CHILDREN = 'children';

	var setInitialDOMProperties = function setInitialDOMProperties(tag, domElement, nextProps) {
	  for (var propKey in nextProps) {
	    if (!nextProps.hasOwnProperty(propKey)) continue;
	    var nextProp = nextProps[propKey];

	    if (propKey === STYLE) {
	      setValueForStyles(domElement, nextProp);
	    } else if (propKey === CHILDREN) {
	      if (typeof nextProp === 'string') {
	        var canSetTextContent = tag !== 'textarea' || nextProp !== '';

	        if (canSetTextContent) {
	          setTextContent(domElement, nextProp);
	        }
	      } else if (typeof nextProp === 'number') {
	        setTextContent(domElement, nextProp + '');
	      }
	    } else if (nextProp != null) {
	      setValueForProperty(domElement, propKey, nextProp); //todo
	    }
	  }
	};
	/**
	 * 初始化dom属性
	 * @param domElement dom元素
	 * @param tag dom的tag对应React.createElement的第一个参数
	 * @param rawProps 对应了React.createElement的第二个参数（包含children）
	 */


	var setInitialProperties = function setInitialProperties(domElement, tag, rawProps) {
	  var props = rawProps;

	  switch (tag) {
	    case 'input':
	      initWrapperState(domElement, rawProps);
	      props = getHostProps(domElement, rawProps);
	      break;
	  }

	  setInitialDOMProperties(tag, domElement, props);

	  switch (tag) {
	    case 'input':
	      track(domElement);
	      postMountWrapper(domElement, rawProps);
	      break;

	    case 'textarea':
	    case 'option':
	    case 'select':
	      throw new Error('Not Implement');
	  }
	};

	var updateDOMProperties = function updateDOMProperties(domElement, updatePayload) {
	  for (var i = 0; i < updatePayload.length; i += 2) {
	    var propKey = updatePayload[i];
	    var propValue = updatePayload[i + 1];

	    if (propKey === STYLE) {
	      setValueForStyles(domElement, propValue);
	    } else if (propKey === CHILDREN) {
	      setTextContent(domElement, propValue);
	    } else {
	      throw new Error('Not Implement');
	    }
	  }
	};

	var updateProperties = function updateProperties(domElement, updatePayload, tag, lastRawProps, nextRawProps) {
	  if (tag === 'input' && nextRawProps.type === 'radio' && nextRawProps.name != null) {
	    throw new Error('Not Implement');
	  }

	  updateDOMProperties(domElement, updatePayload);

	  switch (tag) {
	    case 'input':
	      updateWrapper(domElement, nextRawProps);
	      break;

	    case 'textarea':
	    case 'select':
	      throw new Error('Not Implement');
	  }
	};

	var STYLE$1 = 'style';
	var CHILDREN$1 = 'children';

	/**
	 * 判断该节点是否可以直接将children当作直接文本节点处理
	 * 比如节点的类型为textarea时，或者children的类型为string或者number
	 * @param type 
	 * @param props 
	 * @returns 
	 */
	var shouldSetTextContent = function shouldSetTextContent(type, props) {
	  return type === 'textarea' || type === 'option' || type === 'noscript' || typeof props.children === 'string' || typeof props.children === 'number' || _typeof(props.dangerouslySetInnerHTML) === 'object' && props.dangerouslySetInnerHTML !== null && props.dangerouslySetInnerHTML.__html !== null;
	};
	var createInstance = function createInstance(type, props, internalInstanceHandle) {
	  var domElement = document.createElement(type); //todo
	  //updateFiberProps(domElement, props)

	  precacheFiberNode(internalInstanceHandle, domElement);
	  updateFiberProps(domElement, props);
	  return domElement;
	};
	var appendInitialChild = function appendInitialChild(parentInstance, child) {
	  parentInstance.appendChild(child);
	};
	var insertBefore = function insertBefore(parentInstance, child, beforeChild) {
	  parentInstance.insertBefore(child, beforeChild);
	};
	var appendChild = function appendChild(parentInstance, child) {
	  parentInstance.appendChild(child);
	};
	var COMMENT_NODE$1 = 8;
	/**
	 * 和appendChild一样，只是多了个判断是否是注释节点
	 * @param container React.render第二个参数
	 * @param child 要添加的dom
	 * @param beforeChild
	 */

	var insertInContainerBefore = function insertInContainerBefore(container, child, beforeChild) {
	  if (container.nodeType === COMMENT_NODE$1) {
	    var _container$parentNode;

	    (_container$parentNode = container.parentNode) === null || _container$parentNode === void 0 ? void 0 : _container$parentNode.insertBefore(child, beforeChild);
	  } else {
	    container.insertBefore(child, beforeChild);
	  }
	};
	var appendChildToContainer = function appendChildToContainer(container, child) {
	  var parentNode;

	  if (container.nodeType === COMMENT_NODE$1) {
	    var _parentNode;

	    parentNode = container.parentNode;
	    (_parentNode = parentNode) === null || _parentNode === void 0 ? void 0 : _parentNode.insertBefore(child, container);
	  } else {
	    parentNode = container;
	    parentNode.appendChild(child);
	  }
	};
	/**
	 * 在首次mount时，为HostComponent初始化属性
	 * @param domElement 要初始化的dom
	 * @param type
	 * @param props 新的props
	 * @returns
	 */

	var finalizeInitialChildren = function finalizeInitialChildren(domElement, type, props) {
	  setInitialProperties(domElement, type, props); //shouldAutoFocusHostComponent

	  return false;
	};
	var createTextInstance = function createTextInstance(text) {
	  var instance = document.createTextNode(text);
	  return instance;
	};
	var scheduleMicrotask = queueMicrotask$3;

	var diffProperties = function diffProperties(domElement, tag, lastRawProps, nextRawProps) {
	  var updatePayload = [];
	  var lastProps;
	  var nextProps;

	  switch (tag) {
	    case 'input':
	      lastProps = getHostProps(domElement, lastRawProps);
	      nextProps = getHostProps(domElement, nextRawProps);
	      updatePayload = [];
	      break;

	    case 'option':
	    case 'select':
	    case 'textarea':
	      throw new Error('Not Implement');

	    default:
	      {
	        lastProps = lastRawProps;
	        nextProps = nextRawProps;
	      }
	  }

	  var propKey;
	  var styleName;
	  var styleUpdates = null;

	  for (propKey in lastProps) {
	    //该循环只处理被删除的prop
	    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) && lastProps[propKey] == null) {
	      continue;
	    }

	    var nextProp = nextProps[propKey];

	    if (propKey === STYLE$1) {
	      throw new Error('Not Implement');
	    } else if (propKey === CHILDREN$1) ; else {
	      (updatePayload = updatePayload || []).push(propKey, null);
	    }
	  }

	  for (propKey in nextProps) {
	    //该循环会处理增加和被修改的属性
	    var _nextProp = nextProps[propKey];
	    var lastProp = lastProps !== null ? lastProps[propKey] : undefined;

	    if (!nextProps.hasOwnProperty(propKey) || _nextProp === lastProp || _nextProp === null && lastProp === null) {
	      continue;
	    }

	    if (propKey === STYLE$1) {
	      if (lastProp) {
	        for (styleName in lastProp) {
	          //处理删除的style
	          if (lastProp.hasOwnProperty(styleName) && (!_nextProp || !_nextProp.hasOwnProperty(styleName))) {
	            if (!styleUpdates) {
	              styleUpdates = {};
	            }

	            styleUpdates[styleName] = '';
	          }
	        } //处理新增或者更新的style


	        for (styleName in _nextProp) {
	          if (_nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== _nextProp[styleName]) {
	            if (!styleUpdates) {
	              styleUpdates = {};
	            }

	            styleUpdates[styleName] = _nextProp[styleName];
	          }
	        }
	      } else {
	        if (!styleUpdates) {
	          if (!updatePayload) {
	            updatePayload = [];
	          }

	          updatePayload.push(propKey, styleUpdates);
	        }

	        styleUpdates = _nextProp;
	      }
	    } else if (registrationNameDependencies.hasOwnProperty(propKey)) {
	      if (!updatePayload) updatePayload = [];
	    } else if (propKey === CHILDREN$1) {
	      //这里是直接文本节点能正常更新的关键，因为他们没有对应的fiber节点
	      //所以不能靠打上Update标签这种形式去更新他自身的文本，他只能在
	      //父节点的updateQueue(也就是这的updatePayload)中加上 children属性
	      //待会该节点会更具updateQueue中children的新内容重新设置文本
	      if (typeof _nextProp === 'string' || typeof _nextProp === 'number') {
	        (updatePayload = updatePayload || []).push(propKey, '' + _nextProp);
	      }
	    } else {
	      (updatePayload = updatePayload || []).push(propKey, _nextProp);
	    }
	  }

	  if (styleUpdates) {
	    (updatePayload = updatePayload || []).push(STYLE$1, styleUpdates);
	  }

	  return updatePayload;
	};
	/**
	 * 会返回类似这样的一个数组 ['style', {background: 'red'}, 'children', 'newText']
	 * 2n存储属性名，2n+1存储新的属性值
	 * 该数组里面的属性都是dom真正拥有的属性，
	 * 如果是类似于onClick这种react事件不会在数组中添加相关的属性，只会返回一个空数组
	 * 待会更新的时候会判断到updateQueue不为null所以会进行该节点的更新流程
	 * onClick的handler会通过updateFiberProps得到更新
	 * @param domElement 
	 * @param type 
	 * @param oldProps 
	 * @param newProps 
	 * @returns 
	 */


	var prepareUpdate = function prepareUpdate(domElement, type, oldProps, newProps) {
	  return diffProperties(domElement, type, oldProps, newProps);
	};
	var commitTextUpdate = function commitTextUpdate(textInstance, oldText, newText) {
	  textInstance.nodeValue = newText;
	};
	var commitUpdate = function commitUpdate(domElement, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
	  /**
	   * 更新fiber属性，ReactDOM事件系统能正常工作的关键
	   * 比如如下代码
	   * const Foo = () => {
	   *   const [count, setCount] = useState(0)
	   *
	   *   return <div onClick={() => {
	   *              setCount(count + 1)
	   *           }}>{count}</div>
	   * }
	   * 如果不更新props的话，ReactDOM中事件机制执行时
	   * 从dom对应fiber提取到的onClick事件的handler将永远是首次mount时
	   * 的handler，这意味着他闭包中捕获到的count值永远都是0,所以不管你点击多少次div
	   * 他都等价于setCount(0 + 1),所以会导致不能正常更新
	   * 而调用了下面的updateFiberProps就不一样了，每次更新后handler里面闭包捕获到的count
	   * 都是最新值所以能正常更新
	   */
	  updateFiberProps(domElement, newProps);
	  updateProperties(domElement, updatePayload, type, oldProps, newProps);
	};
	/**
	 * 更具当前的事件返回对应的优先级
	 * @returns
	 */

	var getCurrentEventPriority = function getCurrentEventPriority() {
	  var currentEvent = window.event;

	  if (currentEvent === undefined) {
	    return DefaultEventPriority;
	  }

	  return getEventPriority(currentEvent.type);
	};
	var removeChild = function removeChild(parentInstance, child) {
	  parentInstance.removeChild(child);
	};
	var resetTextContent = function resetTextContent(domElement) {
	  setTextContent(domElement, '');
	};

	// `Array.isArray` method
	// https://tc39.es/ecma262/#sec-array.isarray
	_export({ target: 'Array', stat: true }, {
	  isArray: isArray
	});

	var isArray$1 = path.Array.isArray;

	var isArray$2 = isArray$1;

	var isArray$3 = isArray$2;

	var isArray$4 = isArray$3;
	/**
	 * diff函数的创建函数
	 * @param shouldTrackSideEffects 是否应该追踪副作用，在首次mount只需要对HostRoot的子节点执行一次Placement操作就行
	 * 不需要其他的操做，所以在创建mount的diff函数时设置为false,在update时需要进行增删改所以需要追踪副作用，所以创建
	 * 更新时的diff函数设置为true
	 * @returns
	 */

	var ChildReconciler = function ChildReconciler(shouldTrackSideEffects) {
	  var placeSingleChild = function placeSingleChild(newFiber) {
	    if (shouldTrackSideEffects && newFiber.alternate === null) {
	      //该逻辑只有首次mount时HostRoot用到了，因为HostRoot的workInProgress，还是current都是始终存在的
	      //所以会走在diff其子节点时，会走reconcileChildFibers路线，所以shouldTrackSideEffects会被设置为true
	      //且因为是首次mount所以HostRoot的子节点的current节点为空，所以会进入到改逻辑
	      //所以它会被打上Placement标签待会会被插入dom树中
	      //注意首次mount时只有HostRoot的直接子节点才会进入这个逻辑，其他层级的节点会因为current为空直接进入mountChildFibers
	      //逻辑
	      newFiber.flags |= Placement;
	    }

	    return newFiber;
	  };
	  /**
	   *
	   * @param returnFiber diff单个节点，只有type和key都相同的情况下才会复用节点
	   * 否则就重新创建
	   * @param currentFirstChild
	   * @param element
	   * @param lanes
	   * @returns
	   */


	  var reconcileSingleElement = function reconcileSingleElement(returnFiber, currentFirstChild, element, lanes) {
	    var key = element.key;
	    var child = currentFirstChild;

	    while (child !== null) {
	      if (child.key === key) {
	        if (child.elementType === element.type) {
	          deleteRemainingChildren(returnFiber, child.sibling);
	          var existing = useFiber(child, element.props);
	          existing["return"] = returnFiber;
	          return existing;
	        } //key相同但是type变了，直接停止遍历，把后面的节点都删了
	        //直接新建一个


	        deleteRemainingChildren(returnFiber, child);
	        break;
	      } else {
	        //key不相同把该节点删除
	        deleteChild(returnFiber, child);
	      } //该节点不能复用看看下个节点能不能复用


	      child = child.sibling;
	    } //一个都不能复用，直接重新创建一个


	    var created = createFiberFromElement(element, returnFiber.mode, lanes);
	    created["return"] = returnFiber;
	    return created;
	  };
	  /**
	   * 删除currentFirstChild，以及他后面的所有节点
	   * @param returnFiber
	   * @param currentFirstChild 要删除的节点的起始节点
	   * @returns
	   */


	  var deleteRemainingChildren = function deleteRemainingChildren(returnFiber, currentFirstChild) {
	    //当初次mount的时候shouldTrackSideEffects为false
	    if (!shouldTrackSideEffects) {
	      return null;
	    }

	    var childToDelete = currentFirstChild;

	    while (childToDelete !== null) {
	      deleteChild(returnFiber, childToDelete);
	      childToDelete = childToDelete.sibling;
	    }

	    return null;
	  };
	  /**
	   * 更新一个fiber，如果前后他们的type没有变的话会复用该节点
	   * 如果type改变了会创建一个全新节点
	   * @param returnFiber
	   * @param current
	   * @param element
	   * @param lanes
	   * @returns
	   */


	  var updateElement = function updateElement(returnFiber, current, element, lanes) {
	    if (current !== null) {
	      if (current.elementType === element.type) {
	        var existing = useFiber(current, element.props);
	        existing["return"] = returnFiber;
	        return existing;
	      }
	    }

	    var created = createFiberFromElement(element, returnFiber.mode, lanes);
	    created["return"] = returnFiber;
	    return created;
	  };

	  var useFiber = function useFiber(fiber, pendingProps) {
	    var clone = createWorkInProgress(fiber, pendingProps);
	    clone.index = 0;
	    clone.sibling = null;
	    return clone;
	  };
	  /**
	   * 更新文本节点
	   * @param returnFiber
	   * @param current
	   * @param textContent
	   * @param lanes
	   * @returns
	   */


	  var updateTextNode = function updateTextNode(returnFiber, current, textContent, lanes) {
	    if (current === null || current.tag !== HostText) {
	      var created = createFiberFromText(textContent, returnFiber.mode, lanes);
	      created["return"] = returnFiber;
	      return created;
	    } else {
	      var existing = useFiber(current, textContent);
	      existing["return"] = returnFiber;
	      return existing;
	    }
	  };
	  /**
	   * 判断该对应位置的fiber是否可以复用
	   * 只有type相同且key也相同的情况下才会复用
	   * diff函数会根据该函数的返回值进行相关的操做
	   * 如果key不相同直接返回null代表可能节点的位置发生了变更，
	   * 简单的循环是行不通的所以待会会进入updateFromMap逻辑，
	   * 如果是key相同但是type变了就选择不复用，而是选择重新创建一个元素返回
	   * 就会将以前同key的元素标记为删除
	   * @param returnFiber
	   * @param oldFiber 对应位置的fiber节点
	   * @param newChild 对应位置的jsx对象
	   * @param lanes
	   * @returns
	   */


	  var updateSlot = function updateSlot(returnFiber, oldFiber, newChild, lanes) {
	    var key = oldFiber ? oldFiber.key : null;

	    if (typeof newChild === 'number' || typeof newChild === 'string') {
	      if (key !== null) {
	        throw new Error('Not Implement');
	      }

	      return updateTextNode(returnFiber, oldFiber, '' + newChild, lanes);
	    }

	    if (_typeof(newChild) === 'object' && newChild !== null) {
	      switch (newChild.$$typeof) {
	        case REACT_ELEMENT_TYPE:
	          {
	            if (newChild.key === key) {
	              return updateElement(returnFiber, oldFiber, newChild, lanes);
	            } else return null;
	          }
	      }

	      throw new Error('Not Implement');
	    }

	    if (newChild == null) return null;
	    throw new Error('Invalid Object type');
	  };
	  /**
	   *
	   * @param newFiber 当前要摆放的节点
	   * @param lastPlacedIndex 当前节点的前一个节点，在更新前所处的index
	   * 如果是首次mount则 lastPlacedIndex没有意义，该值主要用来判断该节点在这次更新后
	   * 是不是原来在他后面的节点，现在跑到他前面了如果是他就是需要重新插入dom树的
	   * 那么怎么判断他后面的节点是不是跑到他前面了呢，考虑以下情况
	   * 更新前: 1 -> 2 -> 3 -> 4
	   * 更新后: 1 -> 3 -> 2 -> 4
	   * 在处理该次更新时，当遍历到2时，此时lastPlacedIndex为2，而2的oldIndex为1
	   * 所以可以判断到newFiber.oldIndex小于lastPlacedIndex，也就意味着他前面的元素之前是在他后面的
	   * 但是现在跑到他前面了，所以newFiber也就是2是需要重新插入dom树的
	   * 在commit阶段时，对2相应的dom进行重新插入时，
	   * 会寻找他后面第一个不需要进行插入操作的dom元素作为insertBefore
	   * 的第二个参数，所以2对应的dom会被插入到4前面
	   * @param newIndex 当前要摆放的节点,在此次更新中的index
	   * @returns lastPlacedIndex的新值，结合上面的逻辑自行理解
	   */


	  var placeChild = function placeChild(newFiber, lastPlacedIndex, newIndex) {
	    newFiber.index = newIndex;
	    if (!shouldTrackSideEffects) return lastPlacedIndex;
	    var current = newFiber.alternate;

	    if (current !== null) {
	      var oldIndex = current.index; //更新前有以下数组元素1->2
	      //更新后他们的位置交换变为2 -> 1
	      //这时1元素的oldIndex(0)会小于lastPlacedIndex(和前一轮2元素的index相同也就是1)
	      //这是意味着1元素的位置需要改变了，所以将他打上Placement标签，待会会将它重新插入dom树

	      if (oldIndex < lastPlacedIndex) {
	        newFiber.flags |= Placement;
	        return lastPlacedIndex;
	      } else {
	        return oldIndex;
	      }
	    } else {
	      newFiber.flags |= Placement;
	      return lastPlacedIndex;
	    }
	  };

	  var createChild = function createChild(returnFiber, newChild, lanes) {
	    if (typeof newChild === 'string' || typeof newChild === 'number') {
	      var created = createFiberFromText('' + newChild, returnFiber.mode, lanes);
	      created["return"] = returnFiber;
	      return created;
	    }

	    if (_typeof(newChild) === 'object' && newChild !== null) {
	      switch (newChild.$$typeof) {
	        case REACT_ELEMENT_TYPE:
	          {
	            var _created = createFiberFromElement(newChild, returnFiber.mode, lanes);

	            _created["return"] = returnFiber;
	            return _created;
	          }
	      }
	    }

	    if (newChild == null) return null;
	    throw new Error('Not Implement');
	  };
	  /**
	   * 要删除一个节点时，会将它加入到在父节点的deletions数组中
	   * 并且将其父节点打上ChildDeletion标签
	   * @param returnFiber 要删除节点的父节点
	   * @param childToDelete 要删除的节点
	   * @returns
	   */


	  var deleteChild = function deleteChild(returnFiber, childToDelete) {
	    if (!shouldTrackSideEffects) {
	      return;
	    }

	    var deletions = returnFiber.deletions;

	    if (deletions === null) {
	      returnFiber.deletions = [childToDelete];
	      returnFiber.flags |= ChildDeletion;
	    } else {
	      deletions.push(childToDelete);
	    }
	  };
	  /**
	   * 创建一个map,将节点和key关联起来
	   * 待会就能以O(1)的时间复杂度直接获得key对应的fiber节点
	   * @param returnFiber
	   * @param currentFirstChild
	   * @returns
	   */


	  var mapRemainingChildren = function mapRemainingChildren(returnFiber, currentFirstChild) {
	    var existingChildren = new map$2();
	    var existingChild = currentFirstChild;

	    while (existingChild !== null) {
	      if (existingChild.key !== null) {
	        existingChildren.set(existingChild.key, existingChild);
	      } else {
	        /**
	         * 如果没有显示的设置key，就是用他的index当作key，当然大部分情况下
	         * 这种做法并不能正确的复用他之前的节点，比如以下情况，假设更新前后都没有
	         * 显式的设置key
	         * 更新前: a -> b -> c
	         * 更新后: a -> c
	         * 在这次更新中将b节点删除，此时构建出来的map就为
	         * {
	         *   0 -> a,
	         *   1 -> b,
	         *   2 -> c
	         * }
	         * 而在处理c是实际获得的复用节点为map.get(1)等于b节点
	         * 也就是说本来不用做任何更改的c节点还需要还需要将复用的b节点
	         * 的属性更新至和c一致，这就是为什么说显示的设置唯一的key会
	         * 提高复用节点正确率的原因，当然上述情况如果更新前后都没有
	         * 设置key的话压根不会走进updateFromMap逻辑，在这里这是为了
	         * 方便描述原因
	         */
	        existingChildren.set(existingChild.index, existingChild);
	      }

	      existingChild = existingChild.sibling;
	    }

	    return existingChildren;
	  };
	  /**
	   * 尝试从map中找出新节点能复用的老节点
	   * @param existingChildren Map<Key, Fiber>
	   * @param returnFiber
	   * @param newIdx 如果该新节点没有显式的设置key将会使用他此时的index
	   * 在map中查找复用节点
	   * @param newChild 新的JSX对象
	   * @param lanes
	   * @returns
	   */


	  var updateFromMap = function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
	    if (typeof newChild === 'string' || typeof newChild === 'number') {
	      var matchedFiber = existingChildren.get(newIdx) || null;
	      return updateTextNode(returnFiber, matchedFiber, '' + newChild, lanes);
	    }

	    if (_typeof(newChild) === 'object' && newChild !== null) {
	      switch (newChild.$$typeof) {
	        case REACT_ELEMENT_TYPE:
	          {
	            var _existingChildren$get;

	            var _matchedFiber = (_existingChildren$get = existingChildren.get(newChild.key === null ? newIdx : newChild.key)) !== null && _existingChildren$get !== void 0 ? _existingChildren$get : null;

	            return updateElement(returnFiber, _matchedFiber, newChild, lanes);
	          }
	      }

	      throw new Error('Not Implement');
	    }

	    return null;
	  };

	  var reconcileChildrenArray = function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
	    var resultingFirstChild = null;
	    var previousNewFiber = null;
	    var oldFiber = currentFirstChild;
	    var lastPlacedIndex = 0;
	    var newIdx = 0;
	    var nextOldFiber = null;

	    for (; oldFiber !== null && newIdx < newChildren.length; ++newIdx) {
	      if (oldFiber.index > newIdx) {
	        throw new Error('Not Implement');
	      } else {
	        nextOldFiber = oldFiber.sibling;
	      }

	      var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);

	      if (newFiber === null) {
	        //没有复用该节点，比如下面的情况，同一位置节点前后的key不一致
	        //直接break,开始进行下面的updateFromMap流程

	        /**
	         * {type: 'li', key: 1 }   --->   {type: 'li', key: 2 }
	         *                           删除第一个后
	         * {type: 'li', key: 2 }
	         */
	        if (oldFiber === null) {
	          oldFiber = nextOldFiber;
	        }

	        break;
	      }

	      if (shouldTrackSideEffects) {
	        //只有在update的流程才需要进入该逻辑
	        //因为mount时唯一需要进行的操做就是placeChild
	        if (oldFiber && newFiber.alternate === null) {
	          /**
	           * 两个位置的元素是匹配的，但是并没有复用现存的fiber,
	           * 所以我们需要把现存的child删掉,新创建的fiber,alternate指向null
	           * 如果使用useFiber复用了节点，则newFiber的alternate会指向current
	           * fiber节点，比如[<div></div>]
	           */
	          deleteChild(returnFiber, oldFiber);
	        }
	      } //根据新元素的位置判断他是否需要重新插入dom


	      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

	      if (!previousNewFiber) {
	        //记录下第一个fiber待会将他返回作为接下来workInProgress
	        resultingFirstChild = newFiber;
	      } else {
	        //不是第一个fiber，将他接到前一个节点的后面
	        previousNewFiber.sibling = newFiber;
	      }

	      previousNewFiber = newFiber;
	      oldFiber = nextOldFiber;
	    }

	    if (newIdx === newChildren.length) {
	      //已近到达了new children的末尾，我们可以删除剩余的现存节点
	      deleteRemainingChildren(returnFiber, oldFiber);
	      return resultingFirstChild;
	    }

	    if (oldFiber === null) {
	      /**
	       * 如果没有现存的节点了，我们可以用这种更快的方法，因为剩下的节点都是待插入的
	       */
	      for (; newIdx < newChildren.length; ++newIdx) {
	        var _newFiber = createChild(returnFiber, newChildren[newIdx], lanes);

	        if (_newFiber === null) continue;
	        lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);

	        if (previousNewFiber === null) {
	          resultingFirstChild = _newFiber;
	        } else {
	          previousNewFiber.sibling = _newFiber;
	        }

	        previousNewFiber = _newFiber;
	      }

	      return resultingFirstChild;
	    } //这些剩余节点都是不能通过简单循环就能获得复用节点的
	    //开始updateFromMap逻辑


	    var existingChildren = mapRemainingChildren(returnFiber, oldFiber);

	    for (; newIdx < newChildren.length; ++newIdx) {
	      //从map中尝试为newChildren[i]找到一个合适的复用节点
	      var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], lanes);

	      if (_newFiber2 !== null) {
	        if (shouldTrackSideEffects) {
	          if (_newFiber2.alternate !== null) {
	            //该节点是可以复用的,我们可以把它从existingChildren删除
	            //待会剩下的就是那些要删除的不可复用节点
	            //考虑以下情况

	            /**
	             * 更新前: [<div key="1">1<div>, <div key="2">2</div>, <div key="3">3</div>]
	             * 更新后: [<div key="3">3</div>, <div key="1">1<div>]
	             * 在这次更新中子元素的位置发生了变化，而且2还被删除了
	             * 由于第一个newChild进行工作时就会发现，同一位置前后元素
	             * 一个key是1一个是3，所以并没有成功复用节点就会直接break进入这里的updateFromMap逻辑
	             * 所以会更具current fiber节点构建出以下map
	             * {
	             *   1 -> <div key="1">1</div>,
	             *   2 -> <div key="2">2</div>,
	             *   3 -> <div key="3">3</div>,
	             * }
	             * 由于3节点和1节点都成功被复用,所以都会被从map中删除
	             * 所以此时map中还剩下一个2节点，此时就能知道这个2节点
	             * 就是没有被复用的废弃节点待会需要将这些废弃节点标记删除
	             * 这里也就是将2节点标记删除
	             */
	            existingChildren["delete"](_newFiber2.key === null ? newIdx : _newFiber2.key);
	          }
	        }

	        lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);

	        if (previousNewFiber === null) {
	          resultingFirstChild = _newFiber2;
	        } else {
	          previousNewFiber.sibling = _newFiber2;
	        }

	        previousNewFiber = _newFiber2;
	      }
	    }

	    if (shouldTrackSideEffects) {
	      //删除没有被复用的废弃节点，只有在update流程中才需要这样做
	      forEach$4(existingChildren).call(existingChildren, function (child) {
	        return deleteChild(returnFiber, child);
	      });
	    }

	    return resultingFirstChild;
	  };
	  /**
	   * diff函数的入口，更具不同子元素类型，进入不同的分支
	   * @param returnFiber
	   * @param currentFirstChild
	   * @param newChild
	   * @param lanes
	   * @returns
	   */


	  var reconcileChildFibers = function reconcileChildFibers(returnFiber, currentFirstChild, newChild, lanes) {
	    var isObject = _typeof(newChild) === 'object' && newChild !== null;

	    if (isObject) {
	      switch (newChild.$$typeof) {
	        case REACT_ELEMENT_TYPE:
	          {
	            return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes));
	          }
	      }
	    }

	    if (isArray$4(newChild)) {
	      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
	    }

	    if (typeof newChild === 'string' || typeof newChild === 'number') {
	      throw new Error('Not Implement');
	    } //newChild为空删除现有fiber节点


	    return deleteRemainingChildren(returnFiber, currentFirstChild);
	  };

	  return reconcileChildFibers;
	};
	/**
	 * 在一个节点没有更新，但子组件有工作的情况下
	 * 会调用该函数克隆该节点的子节点，注意该函数在调用
	 * createWorkInProgress传入的第二个参数props是current props,
	 * 所以当进行子节点的beginWork阶段时他的oldProps，newProps是相等的
	 * 如果在发现子节点不存在lanes的话子节点也会进入bailoutOnAlreadyFinishedWork逻辑
	 * 不过还是不能全部靠这种优化来减少render的工作量，这种优化有雪崩效应，一旦一个fiber节点有更新
	 * 那他所在的子树全都得走一遍render流程，所以必要时还是得用上memo这种手动优化手段，对每个props的
	 * 属性进行浅比较,再决定是否真的收到更新
	 * @param current
	 * @param workInProgress
	 * @returns
	 */


	var cloneChildFibers = function cloneChildFibers(current, workInProgress) {
	  if (workInProgress.child === null) return; //能走到这里说明，此时此刻workInProgress和current的child时严格相等的
	  //所以从workInProgress里读取的child也是currentChild

	  var currentChild = workInProgress.child;
	  var newChild = createWorkInProgress(currentChild, currentChild.pendingProps);
	  workInProgress.child = newChild;
	  newChild["return"] = workInProgress;
	  /**
	   * 只复制一层，也就是只复制子节点，其他的不管
	   */

	  while (currentChild.sibling !== null) {
	    currentChild = currentChild.sibling;
	    newChild = newChild.sibling = createWorkInProgress(currentChild, currentChild.pendingProps);
	    newChild["return"] = workInProgress;
	  }

	  newChild.sibling = null;
	};
	var mountChildFibers = ChildReconciler(false);
	var reconcileChildFibers = ChildReconciler(true);

	// `SameValue` abstract operation
	// https://tc39.es/ecma262/#sec-samevalue
	// eslint-disable-next-line es-x/no-object-is -- safe
	var sameValue = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

	// `Object.is` method
	// https://tc39.es/ecma262/#sec-object.is
	_export({ target: 'Object', stat: true }, {
	  is: sameValue
	});

	var is = path.Object.is;

	var is$1 = is;

	var is$2 = is$1;

	var NoFlags$1 =
	/*   */
	0; // 表示了是否因该触发改effect

	var HasEffect =
	/* */
	1; //表示了effect触发是所处的阶段

	var Layout =
	/*    */
	2;
	var Passive$1 =
	/*   */
	4;

	var interleavedQueues = null;
	/**
	 * 向InterleavedQueues加入一个包含interleaved update的queue
	 * @param queue 要加入的queue
	 */

	var pushInterleavedQueue = function pushInterleavedQueue(queue) {
	  if (interleavedQueues === null) {
	    interleavedQueues = [queue];
	  } else {
	    interleavedQueues.push(queue);
	  }
	};
	/**
	 * 将interleaved queue中的update转移到pending queue中
	 * 该队列形成的条件可以看react-reconciler\ReactFiberHooks.ts下的
	 * dispatchAction
	 */

	var enqueueInterleavedUpdates = function enqueueInterleavedUpdates() {
	  //将interleaved的updates转移到main queue,每一个queue都有一个interleaved和一个pending
	  //字段他们分别指向一个循环链表中的最后一个节点，我们需要将interleaved链表加到pending链表的最后
	  if (interleavedQueues !== null) {
	    for (var i = 0; i < interleavedQueues.length; ++i) {
	      var queue = interleavedQueues[i];
	      var lastInterleavedUpdate = queue.interleaved;

	      if (lastInterleavedUpdate !== null) {
	        queue.interleaved = null;
	        var firstInterleavedUpdate = lastInterleavedUpdate.next;
	        var lastPendingUpdate = queue.pending;

	        if (lastPendingUpdate !== null) {
	          var firstPendingUpdate = lastPendingUpdate.next;
	          lastPendingUpdate.next = firstInterleavedUpdate;
	          lastInterleavedUpdate.next = firstPendingUpdate;
	        }

	        queue.pending = lastInterleavedUpdate;
	      }
	    }

	    interleavedQueues = null;
	  }
	};

	var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
	var workInProgressHook = null;
	var currentlyRenderingFiber;
	var currentHook = null;
	var renderLanes = NoLanes;
	/**
	 * 所有Hook函数(useState, useEffect, useLayoutEffect)在Mount时都会调用的函数，用来创建一个Hook，并且把他
	 * 和前面的Hook连接起来
	 * @returns 返回当前创建的新Hook
	 */

	var mountWorkInProgressHook = function mountWorkInProgressHook() {
	  var hook = {
	    next: null,
	    memoizedState: null,
	    baseState: null,
	    queue: null,
	    baseQueue: null
	  };

	  if (workInProgressHook === null) {
	    /**
	     * 这是第一个被创建的Hook把他放到Function组件fiber的memoizedState中
	     */
	    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
	  } else {
	    /**
	     * 不是第一个Hook，把他放到前面Hook的next中
	     */
	    workInProgressHook = workInProgressHook.next = hook;
	  }

	  return workInProgressHook;
	};

	var dispatchAction = function dispatchAction(fiber, queue, action) {
	  var alternate = fiber.alternate; //获取此次更新的优先级

	  var lane = requestUpdateLane(fiber); //此次更新触发的事件

	  var eventTime = requestEventTime();
	  var update = {
	    action: action,
	    next: null,
	    lane: lane
	  };

	  if ( //由于fiber是使用bind绑定的首次mount时创建的fiber节点
	  //而在每次更新都会导致current和workInProgress做一次轮换
	  //所以现在也不知道fiber是在workInProgress树中还是在current树中
	  //而currentlyRenderingFiber是处于workInProgress树中的
	  //所以必须比较同时比较一下fiber和他的alternate
	  //比较就能知道是不是render阶段产生的更新
	  fiber === currentlyRenderingFiber || alternate !== null && alternate === currentlyRenderingFiber) {
	    /**
	     * render阶段产生的更新(也就是在调用Function组件的过程中产生的更新)，暂未实现
	     * 比如以下组件在调用时就会产生这样的更新,因为在render过程，中在执行Foo组件前
	     * 会将currentlyRenderingFiber置为Foo对应的fiber节点,如果时普通的浏览器事件中
	     * 调用的dispatchAction就不会经过这个流程currentlyRenderingFiber就会是null
	     * 这样的更新如果一直产生react就会一直重复调用
	     * 该组件，直到他不在产生这种更新为止，所以setCount如果不写在任何逻辑语句里会导致无限循环
	     * function Foo() {
	     *   const [count, setCount] = useState(0)
	     *
	     *   setCount(1)
	     *
	     *   return null
	     * }
	     * 注意在effect中的产生的更新不属于这种更新，等到effect的create函数执行时，render阶段早结束了
	     */
	    //todo
	    throw new Error('Not Implement');
	  } else {
	    //在Concurrent Mode中，如果在一个时间切片后，有更新中途加入，会被加入到
	    //interleaved queue中，等到下一次进行新一轮render阶段时
	    //注意是新一轮render，不是下一个时间切片
	    //会调用prepareFreshStack方法清除之前产生的副作用，在此方法中会将interleaved queue加入到
	    //pending queue中，目前这两个分支的逻辑是等价的删除isInterleavedUpdate分支并不
	    //影响代码运行
	    if (isInterleavedUpdate(fiber)) {
	      var interleaved = queue.interleaved;

	      if (interleaved === null) {
	        update.next = update;
	        pushInterleavedQueue(queue);
	      } else {
	        update.next = interleaved.next;
	      }

	      queue.interleaved = update;
	    } else {
	      var pending = queue.pending;

	      if (pending === null) {
	        update.next = update;
	      } else {
	        update.next = pending.next;
	        pending.next = update;
	      }

	      queue.pending = update;
	    }

	    if (fiber.lanes === NoLanes && (alternate === null || alternate.lanes === NoLanes)) {
	      //提前bailout的路径,如果这次更新的action和前一次的state是
	      //一致的直接退出
	      //在我们的实现中此处的lastRenderedReducer永远为basicReducer
	      var lastRenderedReducer = queue.lastRenderedReducer;

	      if (lastRenderedReducer !== null) {
	        try {
	          var currentState = queue.lastRenderedState;
	          var eagerState = lastRenderedReducer(currentState, action);

	          if (is$2(eagerState, currentState)) {
	            return;
	          }
	        } catch (error) {// 捕获改异常，他待会还会再render阶段抛出
	        }
	      }
	    }

	    scheduleUpdateOnFiber(fiber, lane, eventTime);
	  }
	};

	var basicStateReducer = function basicStateReducer(state, action) {
	  return typeof action === 'function' ? action(state) : action;
	};

	var mountState = function mountState(initialState) {
	  var hook = mountWorkInProgressHook();

	  if (typeof initialState === 'function') {
	    initialState = initialState();
	  }

	  hook.memoizedState = hook.baseState = initialState;
	  var queue = hook.queue = {
	    pending: null,
	    lastRenderedReducer: basicStateReducer,
	    lastRenderedState: initialState,
	    dispatch: null,
	    interleaved: null
	  };

	  var dispatch = queue.dispatch = bind$5(dispatchAction).call(dispatchAction, null, currentlyRenderingFiber, queue);

	  return [hook.memoizedState, dispatch];
	};
	/**
	 * 从current hook中复制获得workInProgressHook
	 * 每复制一个就将current hook向前移动至下一个hook
	 * @returns
	 */


	var updateWorkInProgressHook = function updateWorkInProgressHook() {
	  var nextCurrentHook;

	  if (currentHook === null) {
	    //第一次调用该函数currentHook还为空，从current的memoizedState中
	    //得到第一个hook
	    var current = currentlyRenderingFiber.alternate;

	    if (current !== null) {
	      nextCurrentHook = current.memoizedState;
	    } else {
	      throw new Error('Not Implement');
	    }
	  } else {
	    //不是第一个hook
	    nextCurrentHook = currentHook.next;
	  }

	  var nextWorkInProgressHook = null; //下面的if else是未使用到的代码nextWorkInProgressHook会一直保持null
	  //保留他的原因是为了能在触发special case的时候能获得报错时的调用栈
	  //信息，不仅在这里，整个代码里的所有手动抛出的Not Implement错误都是因为
	  //这个原因,这样使问题调试，和新功能的添加都变得非常容易

	  if (workInProgressHook === null) {
	    nextWorkInProgressHook = currentlyRenderingFiber.memoizedState;
	  } else {
	    nextWorkInProgressHook = workInProgressHook.next;
	  }

	  if (nextWorkInProgressHook !== null) {
	    throw new Error('Not Implement');
	  } else {
	    currentHook = nextCurrentHook;
	    var newHook = {
	      memoizedState: currentHook.memoizedState,
	      baseState: currentHook.baseState,
	      queue: currentHook.queue,
	      next: null,
	      baseQueue: currentHook.baseQueue
	    };

	    if (workInProgressHook === null) {
	      currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
	    } else {
	      workInProgressHook = workInProgressHook.next = newHook;
	    }
	  }

	  return workInProgressHook;
	};

	var updateReducer = function updateReducer(reducer, initialArg, init) {
	  var hook = updateWorkInProgressHook();
	  var queue = hook.queue;
	  queue.lastRenderedReducer = reducer;
	  var current = currentHook;
	  var baseQueue = current.baseQueue;
	  var pendingQueue = queue.pending;

	  if (pendingQueue !== null) {
	    if (baseQueue !== null) {
	      /** 假设此时的baseQueue为下面的链表,则baseFirst为1
	       *  ————
	       * |    |
	       * |    ↓
	       * 2 <- 1
	       */
	      var baseFirst = baseQueue.next;
	      /** 假设此时的pendingQueue为下面的链表,则pendingFirst为3
	       *  ————
	       * |    |
	       * |    ↓
	       * 4 <- 3
	       */

	      var pendingFirst = pendingQueue.next; //2.next = 3

	      baseQueue.next = pendingFirst; //4.next = 1

	      pendingQueue.next = baseFirst;
	      /** baseQueue结果
	       *  ——————————————
	       * |              |
	       * |              ↓
	       * 2 <- 1 <- 4 <- 3
	       */
	    }

	    current.baseQueue = baseQueue = pendingQueue;
	    /** 此时的baseQueue结果
	     *  ——————————————
	     * |              |
	     * |              ↓
	     * 4 <- 3 <- 2 <- 1
	     */

	    queue.pending = null;
	  }

	  if (baseQueue !== null) {
	    var first = baseQueue.next;
	    var newState = current.baseState;
	    var newBaseState = null;
	    var newBaseQueueFirst = null;
	    var newBaseQueueLast = null;
	    var update = first;

	    do {
	      var updateLane = update.lane;

	      if (!isSubsetOfLanes(renderLanes, updateLane)) {
	        /**
	         * 没有足够的优先级，跳过这个update,如果这个是第一个跳过的更新，那么
	         * 为了保证打乱更新顺序后，状态更新的正确性
	         * 会从第一个跳过的update开始把他们全部接在baseQueue上
	         * 比如以下例子，在pendingQueue中有三个更新，且假设此时的state为0
	         * {                  {                                {
	         *   lane: 16, ---->      lane: 1,               ---->    lane: 16,
	         *   action: 1            action: (v) => v + 2            action: (v) => v + 1
	         * }                  }                                }
	         *
	         *  如果按照正常的逻辑 state的变化为 0 --`set(1)`--> 1 --`incr(2)`--> 3 --`incr(1)`--> 4
	         *  所以state的最终值应该是4
	         *  如果我们尝试把他们更具优先级分成两波更新，lane为1的先更新，lane为16的后更新
	         *  那么state的变化应该是
	         *     第一波更新 0 --`incr(2)`--> 2
	         *     第二波更新 2 --`set(1)`--> 1 --`incr(1)`--> 2
	         *  可以看到根据优先级分批更新倒是实现了，但是最终的状态和期待的对不上了
	         *  但是如果我们在跳过某个更新时从他这里开始把他接到到baseQueue上，然后第二轮
	         *  低优先级的更新开始更新时再从baseQueue开始就能保证分批更新时状态的正确性
	         *  比如上面的pendingQueue在以renderLanes为1渲染时就会形成以下baseQueue
	         * {                  {                                {
	         *   lane: 16, ---->      lane: 1               ---->     lane: 16
	         *   action: 1            action: (v) => v + 2            action: (v) => v + 1
	         * }                  }                                }
	         *
	         * 此时baseState为第一个跳过update时的state也就是0
	         * 所以第二轮以renderLanes为16渲染低优先级update时获得的state最终结果就会是正确的
	         */
	        var clone = {
	          lane: updateLane,
	          action: update.action,
	          next: null
	        };

	        if (newBaseQueueFirst === null) {
	          newBaseQueueFirst = newBaseQueueLast = clone;
	          newBaseState = newState;
	        } else {
	          newBaseQueueLast = newBaseQueueLast.next = clone;
	        }
	        /**
	         * 在beginWork开始时currentlyRenderingFiber.lanes会被置为lanes
	         *该更新被跳过，在fiber上留下他的Lane待会completeWork的时候会将它冒泡到HostRoot,
	         * 以能在下一轮更新时重新被执行
	         */


	        currentlyRenderingFiber.lanes = mergeLanes(currentlyRenderingFiber.lanes, updateLane);
	      } else {
	        //改更新拥有足够的优先级
	        if (newBaseQueueLast !== null) {
	          /**
	           * 前面已经有被跳过的更新，则将他也接到baseQueue上
	           */
	          var _clone = {
	            lane: NoLane,
	            action: update.action,
	            next: null
	          };
	          newBaseQueueLast.next = _clone;
	          newBaseQueueLast = _clone;
	        }

	        var action = update.action;
	        newState = reducer(newState, action);
	      }

	      update = update.next;
	    } while (update !== null && update !== first);

	    if (newBaseQueueLast === null) {
	      newBaseState = newState;
	    } else {
	      newBaseQueueLast.next = newBaseQueueFirst;
	    }

	    if (!is$2(newState, hook.memoizedState)) {
	      /**
	       * 非常重要的逻辑判断，他决定了是否能执行bailoutHooks逻辑
	       * 如果执行了bailoutHooks逻辑就会将这个hook造成的副作用(flags,lanes)从fiber树
	       * 清除，最终到commit阶段如果发现没有副作用，就什么都不用干
	       */
	      markWorkInProgressReceivedUpdate();
	    }

	    hook.memoizedState = newState;
	    hook.baseState = newBaseState;
	    hook.baseQueue = newBaseQueueLast;
	    queue.lastRenderedState = newState;
	  }

	  var lastInterleaved = queue.interleaved;

	  if (lastInterleaved !== null) {
	    throw new Error('Not Implement');
	  }

	  var dispatch = queue.dispatch;
	  return [hook.memoizedState, dispatch];
	};

	var updateState = function updateState(initialState) {
	  return updateReducer(basicStateReducer);
	};

	var renderWithHooks = function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
	  renderLanes = nextRenderLanes;
	  currentlyRenderingFiber = workInProgress; //Function组件每次update是都会将新的effect挂载在上面，如果
	  //不清除那么老的effect会一直存在并被调用

	  workInProgress.updateQueue = null;
	  workInProgress.memoizedState = null;
	  workInProgress.lanes = NoLanes;
	  ReactCurrentDispatcher$1.current = current === null || current.memoizedState === null ? HooksDispatcherOnMount : HooksDispatcherOnUpdate; //调用函数组件，获取JSX对象

	  var children = Component(props, secondArg);
	  renderLanes = NoLanes;
	  currentlyRenderingFiber = null;
	  /**
	   * 完成该Function组建后将currentHook,workInProgressHook置为null,否则会导致下次更新
	   * 时的workInProgress的memoizedState为null导致后续的更新异常
	   */

	  currentHook = null;
	  workInProgressHook = null;
	  return children;
	};

	var areHookInputsEqual = function areHookInputsEqual(nextDeps, prevDeps) {
	  if (prevDeps === null) {
	    throw new Error('Not Implement');
	  }

	  for (var _i = 0; _i < prevDeps.length && _i < nextDeps.length; ++_i) {
	    if (is$2(nextDeps[_i], prevDeps[_i])) continue;
	    return false;
	  }

	  return true;
	};

	var updateEffectImpl = function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
	  var hook = updateWorkInProgressHook();
	  var nextDeps = deps === undefined ? null : deps;
	  var destroy = undefined;

	  if (currentHook !== null) {
	    var prevEffect = currentHook.memoizedState;
	    destroy = prevEffect.destroy;

	    if (nextDeps !== null) {
	      var prevDeps = prevEffect.deps;

	      if (areHookInputsEqual(nextDeps, prevDeps)) {
	        /**
	         * 判断该effect的依赖数组是否发生了变化，如果没有变化
	         * 就直接用复制之前effect的参数然后返回
	         */
	        hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps);
	        return;
	      }
	    }
	  } //依赖数组发生变化，为fiber节点打上标记


	  currentlyRenderingFiber.flags |= fiberFlags;
	  hook.memoizedState = pushEffect(HasEffect | hookFlags, create, destroy, nextDeps);
	};

	var updateEffect = function updateEffect(create, deps) {
	  return updateEffectImpl(Passive, Passive$1, create, deps);
	};
	/**
	 * 将一个effect接到该fiber组件的updateQueue中
	 * @param tag 该effect的类型，commitHookEffectListUnmount
	 * 函数用它来筛选不同类型的effect详细信息可以查看
	 * react-reconciler\ReactFiberCommitWork.ts下的commitHookEffectListUnmount函数
	 * @param create useEffect的第一个参数
	 * @param destroy
	 * @param deps useEffect的第二个参数
	 * @returns
	 */


	var pushEffect = function pushEffect(tag, create, destroy, deps) {
	  var effect = {
	    tag: tag,
	    create: create,
	    destroy: destroy,
	    deps: deps,
	    next: null
	  };
	  var componentUpdateQueue = currentlyRenderingFiber.updateQueue;

	  if (componentUpdateQueue === null) {
	    //如果函数组件的updateQueue为空，就先初始化他
	    componentUpdateQueue = {
	      lastEffect: null
	    };
	    currentlyRenderingFiber.updateQueue = componentUpdateQueue;
	    componentUpdateQueue.lastEffect = effect.next = effect;
	  } else {
	    var lastEffect = componentUpdateQueue.lastEffect;

	    if (lastEffect === null) {
	      componentUpdateQueue.lastEffect = effect.next = effect;
	    } else {
	      var firstEffect = lastEffect.next;
	      lastEffect.next = effect;
	      effect.next = firstEffect;
	      componentUpdateQueue.lastEffect = effect;
	    }
	  }

	  return effect;
	};

	var mountEffectImpl = function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
	  var hook = mountWorkInProgressHook();
	  var nextDeps = deps === undefined ? null : deps;
	  currentlyRenderingFiber.flags |= fiberFlags;
	  hook.memoizedState = pushEffect(HasEffect | hookFlags, create, undefined, nextDeps);
	};

	var mountEffect = function mountEffect(create, deps) {
	  return mountEffectImpl(Passive, Passive$1, create, deps);
	};

	var mountLayoutEffect = function mountLayoutEffect(create, deps) {
	  var fiberFlags = Update;
	  return mountEffectImpl(fiberFlags, Layout, create, deps);
	};

	var updateLayoutEffect = function updateLayoutEffect(create, deps) {
	  return updateEffectImpl(Update, Layout, create, deps);
	};
	/**
	 * Mount流程中使用的Dispatcher
	 */


	var HooksDispatcherOnMount = {
	  useState: mountState,
	  useEffect: mountEffect,
	  useLayoutEffect: mountLayoutEffect
	};
	/**
	 * Update流程中使用的Dispatcher
	 */

	var HooksDispatcherOnUpdate = {
	  useState: updateState,
	  useEffect: updateEffect,
	  useLayoutEffect: updateLayoutEffect
	};
	/**
	 * 用来清除一个fiber节点上的副作用标记，只有在一个
	 * 节点出现在render流程中，并且lanes不为空，但该节点的确没有
	 * 存在的工作，会调用该函数清除他的副作用，以结束更新流程
	 * 考虑下面的代码
	 * function Foo() {
	 *   const [state, setState] = useState(0)
	 *
	 *   setTimeout(() => {
	 *     setState(1)
	 *   })
	 *
	 *   return state
	 * }
	 * 这样无限dispatchAction的代码最后能终止,就多亏了
	 * 了这个函数,那么什么情况下会调用这个函数呢,只有该组件
	 * 所有state都没有都没有变更，且他的父组件也没有什么更新的情况下
	 * 才回调用这个函数，详细逻辑可以查看didReceiveUpdate这个变量的
	 * 相关逻辑
	 * @param current
	 * @param workInProgress
	 * @param lanes
	 */

	var bailoutHooks = function bailoutHooks(current, workInProgress, lanes) {
	  workInProgress.updateQueue = current.updateQueue;
	  workInProgress.flags &= ~(Passive | Update);
	  /**
	   * 在进入beginWork是workInProgress上的pending lanes会被清除，
	   * 但是current上的lanes会一直存在，而只清除workInProgress上的lanes
	   * 是远远不够的他会只要两颗fiber树中其中的一个节点lanes还不为NoLanes
	   * 都会导致不会进入提前的 bailout路径，最终不停的调用scheduleUpdateOnFiber
	   * 使得上面的那种Foo函数无限更新
	   */

	  current.lanes = removeLanes(current.lanes, lanes);
	};

	var FAILS_ON_PRIMITIVES$2 = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	var keys$1 = path.Object.keys;

	var keys$2 = keys$1;

	var keys$3 = keys$2;

	var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
	var is$3 = is$2;
	var shallowEqual = function shallowEqual(objA, objB) {
	  if (is$3(objA, objB)) return true;
	  if (_typeof(objA) !== 'object' || objA === null || _typeof(objB) !== 'object' || objB === null) return false;

	  var keysA = keys$3(objA);

	  var keysB = keys$3(objB);

	  if (keysA.length !== keysB.length) return false;

	  for (var i = 0; i < keysA.length; ++i) {
	    if (!hasOwnProperty$2.call(objB, keysA[i]) || !is$3(objA[keysA[i]], objB[keysA[i]])) {
	      return false;
	    }
	  }

	  return true;
	};

	var didReceiveUpdate = false;

	var updateFunctionComponent = function updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes) {
	  var nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, null, renderLanes);

	  if (current !== null && !didReceiveUpdate) {
	    bailoutHooks(current, workInProgress, renderLanes);
	    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
	  }

	  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
	  return workInProgress.child;
	};
	/**
	 * 优化路径，该fiber节点没有要进行的工作，看看他的子树有没有工作要做，如果
	 * 有就返回子节点继续子节点的render过程，如果没有就直接返回null,此时以workInProgress
	 * 为根的fiber子树的render过程就直接完成了
	 * @param current
	 * @param workInProgress
	 * @param renderLanes 此次render的优先级
	 * @returns
	 */


	var bailoutOnAlreadyFinishedWork = function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
	  //检查该节点的children是否存在待进行的工作
	  if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
	    /**
	     * children也没有待进行的工作，我们可以直接跳过他们的render工作
	     */
	    return null;
	  } //该节点没有工作，但是他的子节点有，从current Fiber树中克隆他的子节点，然后继续


	  cloneChildFibers(current, workInProgress);
	  return workInProgress.child;
	};
	/**
	 * 更新HostRoot节点，此函数只会在首次渲染时使用
	 * 其他情况下HostRoot走的都是bailout逻辑
	 * @param current
	 * @param workInProgress
	 * @returns
	 */


	var updateHostRoot = function updateHostRoot(current, workInProgress, renderLanes) {
	  cloneUpdateQueue(current, workInProgress); //当第一次mount时payload为 {element: jsx对象}

	  var prevState = workInProgress.memoizedState;
	  var prevChildren = prevState !== null ? prevState.element : null; //HostRoot的pendingProps为null

	  var nextProps = workInProgress.pendingProps;
	  processUpdateQueue(workInProgress, nextProps, null);
	  var nextState = workInProgress.memoizedState;
	  var nextChildren = nextState.element;

	  if (nextChildren === prevChildren) {
	    //todo 前后jsx对象没有变
	    return null;
	  }

	  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
	  return workInProgress.child;
	};

	var reconcileChildren = function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
	  if (current === null) {
	    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
	  } else {
	    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
	  }
	};
	/**
	 * 因为函数组件的fiber在创建时会被赋值为IndeterminateComponent
	 * 所以首次渲染时Function组件会走这个逻辑
	 * 详细逻辑可以看 react-reconciler\ReactFiber.ts下的
	 * createFiberFromTypeAndProps函数
	 * @param current
	 * @param workInProgress
	 * @param Component 函数组件
	 * @param renderLanes
	 * @returns
	 */


	var mountIndeterminateComponent = function mountIndeterminateComponent(current, workInProgress, Component, renderLanes) {
	  var props = workInProgress.pendingProps; //value为该Function Component返回的JSX对象

	  var value = renderWithHooks(current, workInProgress, Component, props, null, renderLanes);
	  workInProgress.tag = FunctionComponent;
	  reconcileChildren(null, workInProgress, value, renderLanes);
	  return workInProgress.child;
	};

	var updateHostComponent = function updateHostComponent(current, workInProgress, renderLanes) {
	  var type = workInProgress.type;
	  var nextProps = workInProgress.pendingProps;
	  var prevProps = current !== null ? current.memoizedProps : null;
	  var nextChildren = nextProps.children; //子节点是否可以直接设置成字符串而不用继续reconcile

	  var isDirectTextChild = shouldSetTextContent(type, nextProps);

	  if (isDirectTextChild) {
	    /**
	     * 我们把子节点为文本这种情况特别处理，这是一种非常常见的情况
	     * 在这不会为该文本创建实际的fiber节点而是只把他放到props.children
	     * 待会更新props时会直接setTextContent把他设置到dom上，以避免还要创建
	     * 一个fiber节点，并遍历他
	     * 注意只有<div>sdfsd dsfsd</div>，或者 <div>{1}</div>这种才算时
	     * 直接文本子节点<div>{1}{2}</div>这种children类型是数组其中1，和2都会
	     * 创建一个fiber节点与之对应，更多例子可以上[https://babeljs.io/repl/]
	     * 自行把玩
	     */
	    nextChildren = null;
	  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
	    /**
	     * 此次更新时，当前需要被替换的节点一个单纯的文本节点，他没有对应的fiber节点
	     * 所以不能靠reconcile过程把他删除，所以我们在这直接把他的父节点打上ContentReset
	     * 标签待会commit阶段的时候它会被`textContent = ''`删除，这样他就能正常的被新内容替换，否则他将不会被清除一直存在在
	     * 他的父节点上
	     */
	    workInProgress.flags |= ContentReset;
	  }

	  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
	  return workInProgress.child;
	};

	var updateSimpleMemoComponent = function updateSimpleMemoComponent(current, workInProgress, Component, nextProps, updateLanes, renderLanes) {
	  if (current !== null) {
	    var prevProps = current.memoizedProps;

	    if (shallowEqual(prevProps, nextProps)) {
	      didReceiveUpdate = false;

	      if (!includesSomeLane(renderLanes, updateLanes)) {
	        //在beginWork中workInProgress pending中的lanes会被置为
	        //NoLanes，进入该逻辑表明，这轮render以workInProgress为根的子树没有工作要做
	        //但是可能他下一轮render可能有工作要做，
	        //为了保证它pending中的工作能在下一轮render中，能被正常的执行
	        //需要在这里将他current节点里的lanes赋值给workInProgress，以确保他待会
	        //他pending中的lanes会在completeWork中被冒泡到root上

	        /**
	         * 考虑以下代码
	         * let hasDispatched = false
	         * const Foo = memo(() => {
	         *   const [list, setList] = useState<number[]>([])
	         *
	         *   setTimeout(() => {
	         *     if (hasDispatched) return
	         *
	         *     hasDispatched = true
	         *     setList(Array.from({ length: 1e4 }, (_, i) => i))
	         *   }, 1000)
	         *
	         *   return (
	         *     <div>
	         *       {list.map((v) => (
	         *         <div>{v}</div>
	         *       ))}
	         *     </div>
	         *   )
	         * })
	         *
	         * const App = () => {
	         *   const [count, setCount] = useState(0)
	         *
	         *   useEffect(() => {
	         *     setTimeout(() => {
	         *       const dispatcher = document.getElementById('dispatcher')
	         *       dispatcher?.click()
	         *     }, 1030)
	         *   }, [])
	         *   return (
	         *     <div>
	         *       <button
	         *         id="dispatcher"
	         *         onClick={() => {
	         *           setCount(1)
	         *         }}
	         *       >
	         *         {count}
	         *       </button>
	         *       <Foo />
	         *     </div>
	         *   )
	         * }
	         * 当进行Foo组件的渲染时，它会被App组件内产生的更高的优先级的更新打断，
	         * 所以会先开始以renderLanes为1开始一轮更新，而此时Foo组件的UpdateLanes为
	         * 16,如果没有memo组件的情况下他不会提前bailout,而会继续render过程
	         * 在执行updateReducer时处理他updateQueue上因优先级不足而被跳过的update而被打上相应的lanes
	         * 而现在他被包在memo里面所以他会进入这里的逻辑，
	         * 而我们在这里提前进行bailout就得手动设置他workInProgress上的lanes
	         * 如果我们运行上面的代码，并且没有下面这行的代码的话，Foo组件内产生的更新就会好像消失了一样
	         */
	        workInProgress.lanes = current.lanes;
	        return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
	      }
	    }
	  }

	  return updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes);
	};

	var updateMemoComponent = function updateMemoComponent(current, workInProgress, Component, nextProps, updateLanes, renderLanes) {
	  if (current === null) {
	    var type = Component.type;

	    if (isSimpleFunctionComponent(type) && Component.compare === null && Component.defaultProps === undefined) {
	      var resolvedType = type;
	      workInProgress.tag = SimpleMemoComponent;
	      workInProgress.type = resolvedType;
	      return updateSimpleMemoComponent(current, workInProgress, resolvedType, nextProps, updateLanes, renderLanes);
	    }

	    var child = createFiberFromTypeAndProps(Component.type, null, nextProps, workInProgress.mode, renderLanes);
	    child["return"] = workInProgress;
	    workInProgress.child = child;
	    return child;
	  }

	  var currentChild = current.child;

	  if (!includesSomeLane(updateLanes, renderLanes)) {
	    var prevProps = currentChild.memoizedProps;
	    var compare = Component.compare;
	    compare = compare !== null ? compare : shallowEqual;

	    if (compare(prevProps, nextProps)) {
	      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
	    }
	  }

	  var newChild = createWorkInProgress(currentChild, nextProps);
	  newChild["return"] = workInProgress;
	  workInProgress.child = newChild;
	  return newChild;
	};
	/**
	 * 传入当前Fiber节点，创建子Fiber节点
	 * @param current 当前节点
	 * @param workInProgress workInProgress节点
	 * @returns 下一个要进行beginWork的节点
	 */


	var beginWork = function beginWork(current, workInProgress, renderLanes) {
	  var updateLanes = workInProgress.lanes; //当页面第一次渲染时current fiber树除了HostRoot(也就是FiberRoot.current)节点其他都还未创建,
	  //workInPgress树中的HostRoot(FiberRoot.current.alternate)也在prepareFreshStack函数中被创建

	  if (current !== null) {
	    var oldProps = current.memoizedProps;
	    var newProps = workInProgress.pendingProps;

	    if (oldProps !== newProps) {
	      //如果props改变了标记这个fiber需要进行工作
	      didReceiveUpdate = true;
	    } else if (!includesSomeLane(renderLanes, updateLanes)) {
	      didReceiveUpdate = false; //这个fiber没有要进行的工作，执行其bailout逻辑，而不用继续
	      //begin他的阶段

	      switch (workInProgress.tag) {
	        case HostRoot:
	          break;

	        case HostComponent:
	          break;

	        case HostText:
	          break;

	        case FunctionComponent:
	          break;

	        case SimpleMemoComponent:
	          break;

	        default:
	          {
	            throw new Error('Not Implement');
	          }
	      }

	      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
	    }
	  } else {
	    //current不存在
	    didReceiveUpdate = false;
	  } //在进入begin流程前，先清除workInProgress pending中的lanes，否则会导致HostRoot不能进入bailout逻辑，
	  //导致后续的更新不会触发，还会导致root上的pendingLanes一直不为空
	  //会让performConcurrentWorkOnRoot一直被schedule下去


	  workInProgress.lanes = NoLanes;

	  switch (workInProgress.tag) {
	    case IndeterminateComponent:
	      {
	        //在mount时FunctionComponent是按indeterminate处理的
	        return mountIndeterminateComponent(current, workInProgress, workInProgress.type, renderLanes);
	      }

	    case FunctionComponent:
	      {
	        var Component = workInProgress.type;
	        var unresolvedProps = workInProgress.pendingProps;
	        var resolvedProps = unresolvedProps;
	        return updateFunctionComponent(current, workInProgress, Component, resolvedProps, renderLanes);
	      }

	    case HostRoot:
	      {
	        //HostRoot类型current,workInProgress一定会同时存在
	        return updateHostRoot(current, workInProgress, renderLanes);
	      }

	    case HostComponent:
	      return updateHostComponent(current, workInProgress, renderLanes);

	    case HostText:
	      return null;

	    case MemoComponent:
	      {
	        var type = workInProgress.type;
	        var _unresolvedProps = workInProgress.pendingProps;
	        return updateMemoComponent(current, workInProgress, type, _unresolvedProps, updateLanes, renderLanes);
	      }

	    case SimpleMemoComponent:
	      {
	        return updateSimpleMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, updateLanes, renderLanes);
	      }
	  }

	  throw new Error('Not Implement');
	};
	var markWorkInProgressReceivedUpdate = function markWorkInProgressReceivedUpdate() {
	  didReceiveUpdate = true;
	};

	var nextEffect = null;

	var ensureCorrectReturnPointer = function ensureCorrectReturnPointer(fiber, expectedReturnFiber) {
	  fiber["return"] = expectedReturnFiber;
	};

	var commitBeforeMutationEffects_begin = function commitBeforeMutationEffects_begin() {
	  while (nextEffect !== null) {
	    var fiber = nextEffect;
	    var child = fiber.child; //如果子树由beforeMutation标记

	    if ((fiber.subtreeFlags & BeforeMutationMask) !== NoFlags && child !== null) {
	      ensureCorrectReturnPointer(child, fiber);
	      nextEffect = child;
	    } else {
	      commitBeforeMutationEffects_complete();
	    }
	  }
	};

	var commitBeforeMutationEffects_complete = function commitBeforeMutationEffects_complete() {
	  while (nextEffect !== null) {
	    var fiber = nextEffect;
	    commitBeforeMutationEffectsOnFiber(fiber);
	    var sibling = fiber.sibling;

	    if (sibling !== null) {
	      nextEffect = sibling;
	      return;
	    }

	    nextEffect = fiber["return"];
	  }
	};

	var commitPassiveUnmountEffects = function commitPassiveUnmountEffects(firstChild) {
	  nextEffect = firstChild;
	  commitPassiveUnmountEffects_begin();
	};

	var commitPassiveUnmountInsideDeletedTreeOnFiber = function commitPassiveUnmountInsideDeletedTreeOnFiber(current, nearestMountedAncestor) {
	  switch (current.tag) {
	    case FunctionComponent:
	      commitHookEffectListUnmount(Passive$1, current);
	      break;
	  }
	};

	var detachFiberAfterEffects = function detachFiberAfterEffects(fiber) {
	  var alternate = fiber.alternate;

	  if (alternate !== null) {
	    fiber.alternate = null;
	    detachFiberAfterEffects(alternate);
	  }

	  fiber.child = null;
	  fiber.deletions = null;
	  fiber.memoizedProps = null;
	  fiber.memoizedState = null;
	  fiber.pendingProps = null;
	  fiber.sibling = null;
	  fiber.stateNode = null;
	  fiber.updateQueue = null;
	};

	var commitPassiveUnmountEffectsInsideOfDeletedTree_complete = function commitPassiveUnmountEffectsInsideOfDeletedTree_complete(deletedSubtreeRoot) {
	  while (nextEffect !== null) {
	    var fiber = nextEffect;
	    var sibling = fiber.sibling;
	    var returnFiber = fiber["return"];

	    if (fiber === deletedSubtreeRoot) {
	      detachFiberAfterEffects(fiber);
	      nextEffect = null;
	      return;
	    }

	    if (sibling !== null) {
	      ensureCorrectReturnPointer(sibling, returnFiber);
	      nextEffect = sibling;
	      return;
	    }

	    nextEffect = returnFiber;
	  }
	};

	var commitPassiveUnmountEffectsInsideOfDeletedTree_begin = function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor) {
	  while (nextEffect !== null) {
	    var fiber = nextEffect;
	    commitPassiveUnmountInsideDeletedTreeOnFiber(fiber);
	    var child = fiber.child;

	    if (child !== null) {
	      ensureCorrectReturnPointer(child, fiber);
	      nextEffect = child;
	    } else {
	      commitPassiveUnmountEffectsInsideOfDeletedTree_complete(deletedSubtreeRoot);
	    }
	  }
	};

	var commitPassiveUnmountEffects_begin = function commitPassiveUnmountEffects_begin() {
	  while (nextEffect !== null) {
	    var fiber = nextEffect;
	    var child = fiber.child;

	    if ((flags$2(nextEffect) & ChildDeletion) !== NoFlags) {
	      var deletions = fiber.deletions;

	      if (deletions !== null) {
	        for (var i = 0; i < deletions.length; ++i) {
	          var fiberToDelete = deletions[i];
	          nextEffect = fiberToDelete;
	          commitPassiveUnmountEffectsInsideOfDeletedTree_begin(fiberToDelete);
	        }

	        var previousFiber = fiber.alternate;

	        if (previousFiber !== null) {
	          var detachedChild = previousFiber.child;

	          if (detachedChild !== null) {
	            previousFiber.child = null;

	            do {
	              var detachedSibling = detachedChild.sibling;
	              detachedChild.sibling = null;
	              detachedChild = detachedSibling;
	            } while (detachedChild !== null);
	          }
	        }

	        nextEffect = fiber;
	      }

	      if ((fiber.subtreeFlags & PassiveMask) !== NoFlags && child !== null) {
	        ensureCorrectReturnPointer(child, fiber);
	        nextEffect = child;
	      } else {
	        commitPassiveUnmountEffects_complete();
	      }
	    }

	    if ((fiber.subtreeFlags & PassiveMask) !== NoFlags && child !== null) {
	      ensureCorrectReturnPointer(child, fiber);
	      nextEffect = child;
	    } else {
	      commitPassiveUnmountEffects_complete();
	    }
	  }
	};

	var commitPassiveUnmountEffects_complete = function commitPassiveUnmountEffects_complete() {
	  while (nextEffect !== null) {
	    var fiber = nextEffect;

	    if ((flags$2(fiber) & Passive) !== NoFlags) {
	      commitPassiveUnmountOnFiber(fiber);
	    }

	    var sibling = fiber.sibling;

	    if (sibling !== null) {
	      ensureCorrectReturnPointer(sibling, fiber["return"]);
	      nextEffect = sibling;
	      return;
	    }

	    nextEffect = fiber["return"];
	  }
	};

	var commitHookEffectListUnmount = function commitHookEffectListUnmount(flags, finishedWork) {
	  var updateQueue = finishedWork.updateQueue;
	  var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

	  if (lastEffect !== null) {
	    var firstEffect = lastEffect.next;
	    var effect = firstEffect;

	    do {
	      if ((effect.tag & flags) === flags) {
	        var destroy = effect.destroy;
	        effect.destroy = undefined;

	        if (destroy !== undefined) {
	          destroy();
	        }
	      }

	      effect = effect.next;
	    } while (effect !== firstEffect);
	  }
	};

	var commitPassiveUnmountOnFiber = function commitPassiveUnmountOnFiber(finishedWork) {
	  switch (finishedWork.tag) {
	    case FunctionComponent:
	    case SimpleMemoComponent:
	      {
	        commitHookEffectListUnmount(HasEffect | Passive$1, finishedWork);
	        break;
	      }

	    default:
	      {
	        throw new Error('Not Implement');
	      }
	  }
	};

	var commitHookEffectListMount = function commitHookEffectListMount(tag, finishedWork) {
	  var updateQueue = finishedWork.updateQueue;
	  var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

	  if (lastEffect !== null) {
	    var firstEffect = lastEffect.next;
	    var effect = firstEffect;

	    do {
	      if ((effect.tag & tag) === tag) {
	        var create = effect.create;
	        effect.destroy = create();
	      }

	      effect = effect.next;
	    } while (effect !== firstEffect);
	  }
	};

	var commitPassiveMountOnFiber = function commitPassiveMountOnFiber(finishedRoot, finishedWork) {
	  switch (finishedWork.tag) {
	    case FunctionComponent:
	    case SimpleMemoComponent:
	      {
	        commitHookEffectListMount(Passive$1 | HasEffect, finishedWork);
	        break;
	      }

	    default:
	      {
	        throw new Error('Not Implement');
	      }
	  }
	};

	var commitPassiveMountEffects_complete = function commitPassiveMountEffects_complete(subtreeRoot, root) {
	  while (nextEffect !== null) {
	    var fiber = nextEffect;

	    if ((flags$2(fiber) & Passive) !== NoFlags) {
	      commitPassiveMountOnFiber(root, fiber);
	    }

	    if (fiber === subtreeRoot) {
	      nextEffect = null;
	      return;
	    }

	    var sibling = fiber.sibling;

	    if (sibling !== null) {
	      ensureCorrectReturnPointer(sibling, fiber["return"]);
	      nextEffect = sibling;
	      return;
	    }

	    nextEffect = fiber["return"];
	  }
	};

	var commitPassiveMountEffects_begin = function commitPassiveMountEffects_begin(subtreeRoot, root) {
	  while (nextEffect !== null) {
	    var fiber = nextEffect;
	    var firstChild = fiber.child;

	    if ((fiber.subtreeFlags & PassiveMask) !== NoFlags && firstChild !== null) {
	      ensureCorrectReturnPointer(firstChild, fiber);
	      nextEffect = firstChild;
	    } else {
	      commitPassiveMountEffects_complete(subtreeRoot, root);
	    }
	  }
	};

	var commitPassiveMountEffects = function commitPassiveMountEffects(root, finishedWork) {
	  nextEffect = finishedWork;
	  commitPassiveMountEffects_begin(finishedWork, root);
	};

	var commitBeforeMutationEffectsOnFiber = function commitBeforeMutationEffectsOnFiber(finishedWork) {
	  var current = finishedWork.alternate;

	  var flags = flags$2(finishedWork); //todo Snapshot

	};
	/**
	 * BeforeMutation阶段入口
	 * 在我们的实现中，并没有在这个阶段干什么事情可以忽略
	 * @param root
	 * @param firstChild finishedWork
	 */


	var commitBeforeMutationEffects = function commitBeforeMutationEffects(root, firstChild) {
	  nextEffect = firstChild;
	  commitBeforeMutationEffects_begin();
	};
	/**
	 * Mutation阶段入口
	 * @param root
	 * @param firstChild finishedWork
	 */

	var commitMutationEffects = function commitMutationEffects(root, firstChild) {
	  nextEffect = firstChild;
	  commitMutationEffects_begin(root);
	};
	/**
	 * 在该节点被删除前，调用它的副作用清除函数
	 * (也就是useEffect,useLayoutEffect第一个函数参数的返回值)，如果有的话
	 * @param finishedRoot
	 * @param current
	 * @param nearestMountedAncestor
	 * @returns
	 */

	var commitUnmount = function commitUnmount(finishedRoot, current, nearestMountedAncestor) {
	  switch (current.tag) {
	    case FunctionComponent:
	      {
	        var updateQueue = current.updateQueue;

	        if (updateQueue !== null) {
	          var lastEffect = updateQueue.lastEffect;

	          if (lastEffect !== null) {
	            var firstEffect = lastEffect.next;
	            var effect = firstEffect;

	            do {
	              var destroy = effect.destroy,
	                  tag = effect.tag;

	              if (destroy !== undefined) {
	                if ((tag & Layout) !== NoFlags$1) {
	                  destroy();
	                }
	              }
	            } while (effect !== firstEffect);
	          }
	        }

	        return;
	      }

	    case HostComponent:
	      {
	        //todo safelyDetachRef
	        return;
	      }

	    case HostText:
	      {
	        break;
	      }

	    default:
	      throw new Error('Not Implement');
	  }
	};
	/**
	 * 把以root为根节点的子fiber树unmount
	 * @param finishedRoot
	 * @param root
	 * @param nearestMountedAncestor
	 * @returns
	 */


	var commitNestedUnmounts = function commitNestedUnmounts(finishedRoot, root, nearestMountedAncestor) {
	  var node = root; //下面的代码相当于dfs的迭代版本

	  while (true) {
	    commitUnmount(finishedRoot, node); //如果该节点有子节点有子节点则一直往下走

	    if (node.child !== null) {
	      node.child["return"] = node;
	      node = node.child;
	      continue;
	    }

	    if (node === root) return; //该层已经全部处理完，是时候返回上一层了

	    while (node.sibling === null) {
	      if (node["return"] === null || node["return"] === root) {
	        return;
	      }

	      node = node["return"];
	    }

	    node.sibling["return"] = node["return"];
	    node = node.sibling;
	  }
	};
	/**
	 * 以current为根的子fiber树即将被删除，将他里面的包含的host component
	 * 从dom树中删除
	 * @param finishedRoot HostRoot
	 * @param current 要删除的子树的根节点
	 * @param nearestMountedAncestor
	 * @returns
	 */


	var unmountHostComponents = function unmountHostComponents(finishedRoot, current, nearestMountedAncestor) {
	  var _parent2;

	  var node = current;
	  var currentParentIsValid = false;
	  var currentParent;
	  var currentParentIsContainer;

	  while (true) {
	    if (!currentParentIsValid) {
	      /**
	       * 这里的逻辑只会在第一轮循环时进来一次
	       * 在这里找到该待删除的子树的最近的上层dom节点
	       * 考虑以下例子
	       * function ChildToDelete() {
	       *    return <div>ChildToDelete</div>
	       * }
	       *
	       * function Wrapper({children}) {
	       *    return children
	       * }
	       *
	       * function Foo() {
	       *   const [isShow, setIsShow] = useState(true)
	       *
	       *   return <div id="container">
	       *        <Wrapper>
	       *          {isShow ? <ChildToDelete /> : null}
	       *        </Wrapper>
	       *        <button onClick={() => setIsShow(!isShow)}>toggle</button>
	       *    </div>
	       * }
	       * 当点击toggle按钮时ChildToDelete函数组件会被删除,此时会沿着ChildToDelete
	       * 对应的fiber节点向上查找一个HostComponent类型的节点,不难看出要找的就是那个
	       * id为container的div节点而不是Wrapper，因为Wrapper只在React中存在
	       * 实际上ChildTODelete子树里面的dom节点是挂载在$('#container')上的
	       *
	       */
	      var parent = node["return"];

	      findParent: while (true) {
	        var _parent;

	        var parentStateNode = (_parent = parent) === null || _parent === void 0 ? void 0 : _parent.stateNode;

	        switch ((_parent2 = parent) === null || _parent2 === void 0 ? void 0 : _parent2.tag) {
	          case HostComponent:
	            //向上查找的过程中遇到一个HostComponet，就直接返回
	            currentParent = parentStateNode;
	            currentParentIsContainer = false;
	            break findParent;

	          case HostRoot:
	            //如果已经达到HostRoot，表明了要删除的子树中的dom是直接挂在
	            //container上的，那什么是container呢？
	            //container就是 ReactDOM.render的第二个参数
	            //比如ReactDOM.render(<div></div>, element)
	            //在这里他就是element这个dom元素
	            currentParent = parentStateNode.containerInfo;
	            currentParentIsContainer = true;
	            break findParent;
	        }

	        parent = parent["return"];
	      }

	      currentParentIsValid = true;
	    } //如果要删除的的子树的根节点直接是一个HostComponent,从dom树中删除他对应
	    //的元素


	    if (node.tag === HostComponent || node.tag === HostText) {
	      commitNestedUnmounts(finishedRoot, node);

	      if (currentParentIsContainer) {
	        throw new Error('Not Implement');
	      } else {
	        removeChild(currentParent, node.stateNode);
	      }
	    } else {
	      //该节点不是HostComponent
	      //继续访问他的子节点，因为可能还会找到更多的host components
	      commitUnmount(finishedRoot, node);

	      if (node.child !== null) {
	        node.child["return"] = node;
	        node = node.child;
	        continue;
	      }
	    }

	    if (node === current) return;

	    while (node.sibling === null) {
	      if (node["return"] === null || node["return"] === current) return;
	      node = node["return"];
	    }

	    node.sibling["return"] = node["return"];
	    node = node.sibling;
	  }
	};

	var detachFiberMutation = function detachFiberMutation(fiber) {
	  //剪短return指针将结点从树中断开
	  var alternate = fiber.alternate;

	  if (alternate !== null) {
	    alternate["return"] = null;
	  }

	  fiber["return"] = null;
	};

	var commitDeletion = function commitDeletion(finishedRoot, current, nearestMountedAncestor) {
	  unmountHostComponents(finishedRoot, current);
	  detachFiberMutation(current);
	};

	var isHostParent = function isHostParent(fiber) {
	  return fiber.tag === HostComponent || fiber.tag === HostRoot;
	};

	var getHostParentFiber = function getHostParentFiber(fiber) {
	  var parent = fiber["return"];

	  while (parent !== null) {
	    if (isHostParent(parent)) {
	      return parent;
	    }

	    parent = parent["return"];
	  }

	  throw new Error('Expected to find a host parent');
	};
	/**
	 * 找到一个fiber节点右边首个不需要插入的dom节点
	 * @param fiber 从该节点开始往右边找
	 * @returns 找到的dom节点
	 */


	var getHostSibling = function getHostSibling(fiber) {
	  var node = fiber;

	  siblings: while (true) {
	    while (node.sibling === null) {
	      if (node["return"] === null || isHostParent(node["return"])) return null;
	      node = node["return"];
	    }

	    node.sibling["return"] = node["return"];
	    node = node.sibling;

	    while (node.tag !== HostComponent) {
	      if (flags$2(node) & Placement) {
	        continue siblings;
	      }

	      if (node.child === null) {
	        continue siblings;
	      } else {
	        node.child["return"] = node;
	        node = node.child;
	      }
	    }

	    if (!(flags$2(node) & Placement)) {
	      return node.stateNode;
	    }
	  }
	};

	var insertOrAppendPlacementNode = function insertOrAppendPlacementNode(node, before, parent) {
	  var tag = node.tag;
	  var isHost = tag === HostComponent || tag === HostText;

	  if (isHost) {
	    var stateNode = isHost ? node.stateNode : node.stateNode.instance;

	    if (before) {
	      insertBefore(parent, stateNode, before);
	    } else {
	      appendChild(parent, stateNode);
	    }
	  } else {
	    var child = node.child;

	    if (child !== null) {
	      insertOrAppendPlacementNode(child, before, parent);
	      var sibling = child.sibling;

	      while (sibling !== null) {
	        insertOrAppendPlacementNode(sibling, before, parent);
	        sibling = sibling.sibling;
	      }
	    }
	  }
	};

	var insertOrAppendPlacementNodeIntoContainer = function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
	  var tag = node.tag;
	  var isHost = tag === HostComponent || tag === HostText;

	  if (isHost) {
	    var stateNode = node.stateNode;

	    if (before) {
	      insertInContainerBefore(parent, stateNode, before);
	    } else {
	      appendChildToContainer(parent, stateNode);
	    }
	  } else {
	    var child = node.child;

	    if (child !== null) {
	      insertOrAppendPlacementNodeIntoContainer(child, before, parent);
	      var sibling = child.sibling;

	      while (sibling !== null) {
	        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
	        sibling = sibling.sibling;
	      }
	    }
	  }
	};

	var commitPlacement = function commitPlacement(finishedWork) {
	  var parentFiber = getHostParentFiber(finishedWork);
	  var parent;
	  var isContainer;
	  var parentStateNode = parentFiber.stateNode;

	  switch (parentFiber.tag) {
	    case HostComponent:
	      parent = parentStateNode;
	      isContainer = false;
	      break;

	    case HostRoot:
	      parent = parentStateNode.containerInfo;
	      isContainer = true;
	      break;

	    default:
	      {
	        throw new Error('Invalid host parent fiber');
	      }
	  }

	  if (flags$2(parentFiber) & ContentReset) {
	    resetTextContent(parent);
	    parentFiber.flags &= ~ContentReset;
	  }

	  var before = getHostSibling(finishedWork);

	  if (isContainer) {
	    insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
	  } else {
	    insertOrAppendPlacementNode(finishedWork, before, parent);
	  }
	};

	var commitLayoutEffectOnFiber = function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork, committedLanes) {
	  if ((flags$2(finishedWork) & Update) !== NoFlags) {
	    switch (finishedWork.tag) {
	      /**
	       * 当Function组件中包含LayoutEffect是，它会被打上Update标签
	       * 然后会在这里同步执行LayoutEffect的create函数
	       */
	      case FunctionComponent:
	        {
	          commitHookEffectListMount(Layout | HasEffect, finishedWork);
	          break;
	        }

	      case HostComponent:
	        {
	          //todo
	          // const instance: Element = finishedWork.stateNode
	          // if (current !== null && finishedWork.flags & Update) {
	          //   const type = finishedWork.type
	          //   const props = finishedWork.memoizedProps
	          //   commitMount(instance, type, props, finishedWork)
	          // }
	          break;
	        }

	      case HostText:
	        {
	          // 没有和Text相关的生命周期
	          break;
	        }

	      default:
	        throw new Error('Not Implement');
	    }
	  }
	};

	var commitLayoutMountEffects_complete = function commitLayoutMountEffects_complete(subtreeRoot, root, committedLanes) {
	  while (nextEffect !== null) {
	    var fiber = nextEffect;

	    if ((flags$2(fiber) & LayoutMask) !== NoFlags) {
	      var current = fiber.alternate;
	      commitLayoutEffectOnFiber(root, current, fiber);
	    }

	    if (fiber === subtreeRoot) {
	      nextEffect = null;
	      return;
	    }

	    var sibling = fiber.sibling;

	    if (sibling !== null) {
	      ensureCorrectReturnPointer(sibling, fiber["return"]);
	      nextEffect = sibling;
	      return;
	    }

	    nextEffect = fiber["return"];
	  }
	};

	var commitLayoutEffects_begin = function commitLayoutEffects_begin(subtreeRoot, root, committedLanes) {
	  while (nextEffect !== null) {
	    var fiber = nextEffect;
	    var firstChild = fiber.child;

	    if ((fiber.subtreeFlags & LayoutMask) !== NoFlags && firstChild !== null) {
	      ensureCorrectReturnPointer(firstChild, fiber);
	      nextEffect = firstChild;
	    } else {
	      commitLayoutMountEffects_complete(subtreeRoot, root);
	    }
	  }
	};

	var commitLayoutEffects = function commitLayoutEffects(finishedWork, root) {
	  nextEffect = finishedWork; //todo

	  commitLayoutEffects_begin(finishedWork, root);
	};
	/**
	 * 各种节点的更新工作的入口，在这里会将各种节点的更新
	 * 跳入到更细粒度的更新函数中
	 * @param current
	 * @param finishedWork
	 * @returns
	 */

	var commitWork = function commitWork(current, finishedWork) {
	  switch (finishedWork.tag) {
	    case FunctionComponent:
	      //LayoutEffect的销毁函数在Mutation阶段被调用
	      commitHookEffectListUnmount(Layout | HasEffect, finishedWork);
	      return;

	    case HostComponent:
	      {
	        var instance = finishedWork.stateNode;

	        if (instance) {
	          var newProps = finishedWork.memoizedProps;
	          var oldProps = current !== null ? current.memoizedProps : newProps;
	          var type = finishedWork.type;
	          var updatePayload = finishedWork.updateQueue;
	          finishedWork.updateQueue = null;

	          if (updatePayload !== null) {
	            commitUpdate(instance, updatePayload, type, oldProps, newProps);
	          }
	        }
	      }

	    case HostText:
	      {
	        var textInstance = finishedWork.stateNode;
	        var newText = finishedWork.memoizedProps;
	        var oldText = current !== null ? current.memoizedProps : newText;
	        commitTextUpdate(textInstance, oldText, newText);
	        return;
	      }

	    default:
	      {
	        throw new Error('Not Implement');
	      }
	  }
	};

	var commitMutationEffectsOnFiber = function commitMutationEffectsOnFiber(finishedWork, root) {
	  var flags = flags$2(finishedWork);

	  if (flags & ContentReset) {
	    //todo
	    throw new Error('Not Implement');
	  }

	  var primaryFlags = flags & (Placement | Update);

	  switch (primaryFlags) {
	    case Placement:
	      {
	        commitPlacement(finishedWork);
	        finishedWork.flags &= ~Placement;
	        break;
	      }

	    case 0:
	      {
	        break;
	      }

	    case PlacementAndUpdate:
	      {
	        commitPlacement(finishedWork);
	        finishedWork.flags &= ~Placement;
	        var current = finishedWork.alternate;
	        commitWork(current, finishedWork);
	        break;
	      }

	    case Update:
	      {
	        var _current = finishedWork.alternate;
	        commitWork(_current, finishedWork);
	        break;
	      }

	    default:
	      {
	        throw new Error('Not Implement');
	      }
	  }
	};

	var commitMutationEffects_complete = function commitMutationEffects_complete(root) {
	  while (nextEffect !== null) {
	    var fiber = nextEffect;
	    commitMutationEffectsOnFiber(fiber);
	    var sibling = fiber.sibling;

	    if (sibling !== null) {
	      ensureCorrectReturnPointer(sibling, fiber["return"]);
	      nextEffect = sibling;
	      return;
	    }

	    nextEffect = fiber["return"];
	  }
	};

	var commitMutationEffects_begin = function commitMutationEffects_begin(root) {
	  while (nextEffect !== null) {
	    var fiber = nextEffect;
	    var deletions = fiber.deletions;

	    if (deletions !== null) {
	      for (var i = 0; i < deletions.length; ++i) {
	        var childToDelete = deletions[i];
	        commitDeletion(root, childToDelete);
	      }
	    }

	    var child = fiber.child;

	    if ((fiber.subtreeFlags & MutationMask) !== NoFlags && child !== null) {
	      ensureCorrectReturnPointer(child, fiber);
	      nextEffect = child;
	    } else {
	      commitMutationEffects_complete();
	    }
	  }
	};

	/**
	 * 将以workInProgress为根的fiber子树,其中包含的所有dom节点，其中最顶层dom
	 * 节点加到parent dom节点的子节点中
	 * @param parent
	 * @param workInProgress
	 * @returns
	 */

	var appendAllChildren = function appendAllChildren(parent, workInProgress) {
	  var node = workInProgress.child;

	  while (node !== null) {
	    if (node.tag === HostComponent || node.tag === HostText) {
	      appendInitialChild(parent, node.stateNode);
	    } else if (node.child !== null) {
	      //如果该子节点不是一个HostComponent则继续向下找
	      node.child["return"] = node;
	      node = node.child;
	      continue;
	    }

	    if (node === workInProgress) {
	      return;
	    }

	    while (node.sibling === null) {
	      var _node$return, _node;

	      //该层级所有以node为父节点的子树中离parent最近的dom已经完成追加，是时候返回到上层了

	      /**
	       * 比如下面的例子
	       *          FunctionComp A
	       * FunctionCompB     FunctionCompC    FunctionCompD
	       *                       domE
	       * 如果进入循环时此时node为domE，一轮循环后当node被赋值为FunctionCompC后就会跳出这个循环
	       * 然后继续进行FunctionCompD的工作
	       *
	       */
	      if (node["return"] === null || node["return"] === workInProgress) return;
	      node = (_node$return = (_node = node) === null || _node === void 0 ? void 0 : _node["return"]) !== null && _node$return !== void 0 ? _node$return : null;
	    } //以该node为父节点的子树中离parent最近的dom已经完成追加，尝试对同级中其他fiber节点执行相同操作


	    node.sibling["return"] = node["return"];
	    node = node.sibling;
	  }
	};
	/**
	 * 将该节点的子节点上的lanes,和flags全部冒泡到他的childLanes和subtreeFlags中
	 * 只用冒泡一级就行，因为我们对每层的节点都会进行该操作
	 * @param completedWork 其子节点需要冒泡的节点
	 * @returns
	 */


	var bubbleProperties = function bubbleProperties(completedWork) {
	  //didBailout用来判断completedWork是否为静态节点，如果一个节点为静态节点
	  //那么该节点会经过bailoutOnAlreadyFinishedWork并且他的childLanes为NoLanes
	  //此时两棵fiber树中他子节点对于的fiber节点是严格相等的
	  //详细逻辑可以查看react-reconciler\ReactFiber.ts下的
	  //createWorkInProgress函数
	  var didBailout = completedWork.alternate !== null && completedWork.alternate.child === completedWork.child;
	  var subtreeFlags = NoFlags;
	  var newChildLanes = NoLanes; //在这会根据是否didBailout选择是否只保留该节点
	  //subtreeFlags,flags中的StaticMask我们的实现中并没有
	  //使用到StaticMask所以只保留StaticMask相当于把subtreeFlags,flags
	  //清除

	  if (!didBailout) {
	    var child = completedWork.child;

	    while (child !== null) {
	      newChildLanes = mergeLanes(newChildLanes, mergeLanes(child.lanes, child.childLanes));
	      subtreeFlags |= child.subtreeFlags;
	      subtreeFlags |= flags$2(child);
	      child["return"] = completedWork;
	      child = child.sibling;
	    }

	    completedWork.subtreeFlags |= subtreeFlags;
	  } else {
	    var _child = completedWork.child;

	    while (_child !== null) {
	      newChildLanes = mergeLanes(newChildLanes, mergeLanes(_child.lanes, _child.childLanes));
	      subtreeFlags |= _child.subtreeFlags & StaticMask;
	      subtreeFlags |= flags$2(_child) & StaticMask;
	      _child["return"] = completedWork;
	      _child = _child.sibling;
	    }

	    completedWork.subtreeFlags |= subtreeFlags;
	  }

	  completedWork.childLanes = newChildLanes;
	  return didBailout;
	};
	/**
	 * 为一个fiber节点打上更新标记，待会commit阶段会根据flags的类型
	 * 进行相应的操做
	 * @param workInProgress
	 */


	var markUpdate = function markUpdate(workInProgress) {
	  workInProgress.flags |= Update;
	};
	/**
	 * 判断该文本节点更新前后的文本有没有发生改变，
	 * 如果改变了就把他打上更新标记
	 * @param current
	 * @param workInProgress
	 * @param oldText
	 * @param newText
	 */


	var updateHostText = function updateHostText(current, workInProgress, oldText, newText) {
	  if (oldText !== newText) {
	    markUpdate(workInProgress);
	  }
	};

	var updateHostComponent$1 = function updateHostComponent(current, workInProgress, type, newProps) {
	  var oldProps = current.memoizedProps;

	  if (oldProps === newProps) {
	    //更新前后的props没有变化该host component不需要进行工作
	    return;
	  }

	  var instance = workInProgress.stateNode; //前后的属性不一样，找出那些属性需要进行更新

	  var updatePayload = prepareUpdate(instance, type, oldProps, newProps);
	  workInProgress.updateQueue = updatePayload;

	  if (updatePayload) {
	    markUpdate(workInProgress);
	  }
	};

	var completeWork = function completeWork(current, workInProgress) {
	  var newProps = workInProgress.pendingProps;

	  switch (workInProgress.tag) {
	    case IndeterminateComponent:
	    case FunctionComponent:
	    case SimpleMemoComponent:
	    case MemoComponent:
	      bubbleProperties(workInProgress);
	      return null;

	    case HostRoot:
	      {
	        //todo
	        //   const fiberRoot = workInProgress.stateNode
	        bubbleProperties(workInProgress);
	        return null;
	      }

	    case HostComponent:
	      {
	        var type = workInProgress.type;

	        if (current !== null && workInProgress.stateNode != null) {
	          updateHostComponent$1(current, workInProgress, type, newProps);
	        } else {
	          var instance = createInstance(type, newProps, workInProgress); //由于是深度优先遍历，当workInProgress进行归阶段时，
	          //其所有子节点都已完成了递和归阶段，也就是意味着其子树的所有dom节点已经创建
	          //所以只需要把子树中离instance最近的dom节点追加到instance上即可

	          appendAllChildren(instance, workInProgress);
	          workInProgress.stateNode = instance;

	          if (finalizeInitialChildren(instance, type, newProps)) ;
	        }

	        bubbleProperties(workInProgress);
	        return null;
	      }

	    case HostText:
	      {
	        var newText = newProps;

	        if (current && workInProgress.stateNode !== null) {
	          /**
	           * 如果我们复用了改节点，那么意味着我们需要一个side-effect去做这个更新
	           */
	          //此时current的memoizedProps和pendingProps字段都存储着更新前的文本
	          //workInProgress的memoizedProps和pendingProps字段都存储着更新后的文本
	          var oldText = current.memoizedProps;
	          updateHostText(current, workInProgress, oldText, newText);
	        } else {
	          workInProgress.stateNode = createTextInstance(newText);
	        }

	        bubbleProperties(workInProgress);
	        return null;
	      }
	  }

	  throw new Error('Not implement');
	};

	var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check
	var Function$2 = global_1.Function;

	var wrap$1 = function (scheduler) {
	  return MSIE ? function (handler, timeout /* , ...arguments */) {
	    var boundArgs = validateArgumentsLength(arguments.length, 1) > 2;
	    var fn = isCallable(handler) ? handler : Function$2(handler);
	    var args = boundArgs ? arraySlice(arguments, 2) : undefined;
	    return scheduler(boundArgs ? function () {
	      functionApply(fn, this, args);
	    } : fn, timeout);
	  } : scheduler;
	};

	// ie9- setTimeout & setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
	var schedulersFix = {
	  // `setTimeout` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	  setTimeout: wrap$1(global_1.setTimeout),
	  // `setInterval` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	  setInterval: wrap$1(global_1.setInterval)
	};

	var setInterval = schedulersFix.setInterval;

	// ie9- setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	_export({ global: true, bind: true, forced: global_1.setInterval !== setInterval }, {
	  setInterval: setInterval
	});

	var setTimeout$1 = schedulersFix.setTimeout;

	// ie9- setTimeout additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	_export({ global: true, bind: true, forced: global_1.setTimeout !== setTimeout$1 }, {
	  setTimeout: setTimeout$1
	});

	var setTimeout$2 = path.setTimeout;

	var setTimeout$3 = setTimeout$2;

	var ImmediatePriority = 1;
	var NormalPriority = 3;

	/**
	 * 最小优先队列实现，具体原理可以自行了解
	 */
	var compare = function compare(a, b) {
	  var diff = a.sortIndex - b.sortIndex;
	  return diff !== 0 ? diff : a.id - b.id;
	};

	var siftUp = function siftUp(heap, node, i) {
	  var index = i;

	  while (index > 0) {
	    var parentIndex = index - 1 >>> 1;
	    var parent = heap[parentIndex];

	    if (compare(parent, node) > 0) {
	      heap[parentIndex] = node;
	      heap[index] = parent;
	      index = parentIndex;
	    } else return;
	  }
	};

	var push$3 = function push(heap, node) {
	  var index = heap.length;
	  heap.push(node);
	  siftUp(heap, node, index);
	};
	var peek = function peek(heap) {
	  return heap.length === 0 ? null : heap[0];
	};

	var siftDown = function siftDown(heap, node, i) {
	  var index = i;
	  var length = heap.length;
	  var halfLength = length >>> 1;

	  while (index < halfLength) {
	    var leftIndex = (index + 1) * 2 - 1;
	    var left = heap[leftIndex];
	    var rightIndex = leftIndex + 1;
	    var right = heap[rightIndex];

	    if (compare(left, node) < 0) {
	      if (rightIndex < length && compare(right, left) < 0) {
	        heap[index] = right;
	        heap[rightIndex] = node;
	        index = rightIndex;
	      } else {
	        heap[index] = left;
	        heap[leftIndex] = node;
	        index = leftIndex;
	      }
	    } else if (rightIndex < length && compare(right, node) < 0) {
	      heap[index] = right;
	      heap[rightIndex] = node;
	      index = rightIndex;
	    } else return;
	  }
	};

	var pop = function pop(heap) {
	  if (heap.length === 0) return null;
	  var first = heap[0];
	  var last = heap.pop();

	  if (last !== first) {
	    heap[0] = last;
	    siftDown(heap, last, 0);
	  }

	  return first;
	};

	var getCurrentTime = function getCurrentTime() {
	  return performance.now();
	};
	/**
	 * NORMAL级别任务过期时间的计算标准，比如现在时间为0，
	 * 有一个Normal级别的任务被调度了，那么他的过期时间就为
	 * `当前时间 +NORMAL_PRIORITY_TIMEOUT`
	 * 等于5000
	 */


	var NORMAL_PRIORITY_TIMEOUT = 5000;
	/**
	 * IMMEDIATE级别任务过期时间计算标准，和上面同理
	 */

	var IMMEDIATE_PRIORITY_TIMEOUT = -1;
	var taskIdCounter = 1;
	/**
	 * 延时任务队列，我们的代码中没有用到
	 */

	var timerQueue = [];
	/**
	 * 存放任务的最小有限队列
	 */

	var taskQueue = [];
	var isHostCallbackScheduled = false;
	var isHostTimeoutScheduled = false;
	var currentPriorityLevel = NormalPriority;
	var currentTask = null;
	var scheduledHostCallback = null; //当在执行工作的时候设置为true，防止二次进入

	var isPerformingWork = false;
	var isMessageLoopRunning = false;
	var dealine = 0;
	var yieldInterval = 5;
	var taskTimeoutID = -1;

	var performWorkUntilDeadline = function performWorkUntilDeadline() {
	  if (scheduledHostCallback !== null) {
	    var currentTime = getCurrentTime();
	    dealine = currentTime + yieldInterval;
	    var hasTimeRemaining = true;
	    var hasMoreWork = true;

	    try {
	      /**
	       * 在我们的代码中scheduledHostCallback一直都是flushWork
	       * 下面这行代码执行了flushWork
	       */
	      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
	    } finally {
	      if (hasMoreWork) {
	        /**
	         * 如果任务队列还不为空，就注册一个宏任务待会回来继续执行任务
	         * 时间分片实现的关键
	         */
	        schedulePerformWorkUntilDeadline();
	      } else {
	        isMessageLoopRunning = false;
	        scheduledHostCallback = null;
	      }
	    }
	  } else {
	    isMessageLoopRunning = false;
	  } //在将控制权交给浏览器后他将有机会去渲染，所以我们可以重置这个变量
	};
	/**
	 * 使用postMessage注册一个宏任务
	 * @param callback
	 */


	var requestHostCallback = function requestHostCallback(callback) {
	  scheduledHostCallback = callback;

	  if (!isMessageLoopRunning) {
	    isMessageLoopRunning = true;
	    schedulePerformWorkUntilDeadline();
	  }
	};

	var schedulePerformWorkUntilDeadline;
	{
	  var channel$1 = new MessageChannel();
	  var port$1 = channel$1.port2;
	  channel$1.port1.onmessage = performWorkUntilDeadline;

	  schedulePerformWorkUntilDeadline = function schedulePerformWorkUntilDeadline() {
	    port$1.postMessage(null);
	  };
	}
	/**
	 * 将那些延期到时的任务从timerQueue移动到taskQueue
	 * @param currentTime 当前的时间
	 */

	var advanceTimers = function advanceTimers(currentTime) {
	  var timer = peek(timerQueue);

	  while (timer !== null) {
	    if (timer.callback === null) {
	      //该任务被取消
	      pop(timerQueue);
	    } else if (timer.startTime <= currentTime) {
	      pop(timerQueue);
	      timer.sortIndex = timer.expirationTime;
	      push$3(taskQueue, timer);
	    } else {
	      // 剩余的任务都还没有到时
	      return;
	    }

	    timer = peek(timerQueue);
	  }
	};
	/**
	 * 是否将控制权交还给浏览器
	 * 为了更好的知道归还时机
	 * facebook甚至还和Chrome团队联合实现了一个
	 * isInputPending[https://web.dev/isinputpending/]
	 * 这个api默认是关闭的所以在这里我没有添加进来
	 * 更详细的实现可以去看官方仓库
	 * 现在的逻辑是一个切片的时间是5ms超过这个时间就把render工作
	 * 暂停，然后在下一个切片中继续工作
	 * @returns
	 */


	var shouldYieldToHost = function shouldYieldToHost() {
	  return getCurrentTime() >= dealine;
	};

	var requestHostTimeout = function requestHostTimeout(callback, ms) {
	  taskTimeoutID = setTimeout$3(function () {
	    callback(getCurrentTime());
	  }, ms);
	};

	var handleTimeout = function handleTimeout(currentTime) {
	  isHostTimeoutScheduled = false;
	  advanceTimers(currentTime);

	  if (!isHostCallbackScheduled) {
	    if (peek(taskQueue) !== null) {
	      isHostCallbackScheduled = true;
	      requestHostCallback(flushWork);
	    } else {
	      var firstTimer = peek(timerQueue);

	      if (firstTimer !== null) {
	        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
	      }
	    }
	  }
	};

	var workLoop = function workLoop(hasTimeRemaining, initialTime) {
	  var currentTime = initialTime;
	  advanceTimers(currentTime);
	  currentTask = peek(taskQueue);

	  while (currentTask !== null) {
	    if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost())) {
	      //如果当前的任务还没有过期而且已经期限了直接break
	      break;
	    }

	    var callback = currentTask.callback;

	    if (typeof callback === 'function') {
	      currentTask.callback = null;
	      currentPriorityLevel = currentTask.priorityLevel;
	      var didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
	      var continuationCallback = callback(didUserCallbackTimeout);
	      currentTime = getCurrentTime();

	      if (typeof continuationCallback === 'function') {
	        currentTask.callback = continuationCallback;
	      } else {
	        if (currentTask === peek(taskQueue)) {
	          pop(taskQueue);
	        }
	      }

	      advanceTimers(currentTime);
	    } else {
	      pop(taskQueue);
	    }

	    currentTask = peek(taskQueue);
	  }

	  if (currentTask !== null) {
	    return true;
	  } else {
	    var firstTimer = peek(timerQueue);

	    if (firstTimer !== null) {
	      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
	    }

	    return false;
	  }
	};

	var flushWork = function flushWork(hasTimeRemaining, initialTime) {
	  //将该变量设置为false,让以后的host callback能被规划
	  isHostCallbackScheduled = false;

	  if (isHostTimeoutScheduled) {
	    throw new Error('Not Implement');
	  }

	  isPerformingWork = true;
	  var previousPriorityLevel = currentPriorityLevel;

	  try {
	    return workLoop(hasTimeRemaining, initialTime);
	  } finally {
	    currentTask = null;
	    currentPriorityLevel = previousPriorityLevel;
	    isPerformingWork = false;
	  }
	};
	/**
	 * 调度一个任务，根据其优先级为其设置一个过期时间,
	 * 然后将他放入一个以过期时间为排序标准的最小优先队列
	 * 比如调度了一个Normal和一个Sync级别的任务，且当前时间为0
	 * 所以Normal级别的任务的过期时间为5000，而Sync级别的为-1
	 * 所以Sync级别的过期时间被Normal级别的小，会被先出队执行
	 * @param priorityLevel 该任务的优先级,决定了该任务的过期时间
	 * @param callback 要调度的任务最常见的就是performConcurrentWorkOnRoot
	 * @param options
	 * @returns 返回该任务节点，持有该任务节点的模块可在其执行前将其取消
	 */


	var unstable_scheduleCallback = function unstable_scheduleCallback(priorityLevel, callback, options) {
	  var currentTime = getCurrentTime();
	  var startTime;

	  if (_typeof(options) === 'object' && options !== null) {
	    var delay = options.delay;

	    if (typeof delay === 'number' && delay > 0) {
	      startTime = currentTime + delay;
	    } else {
	      startTime = currentTime;
	    }
	  } else {
	    startTime = currentTime;
	  }

	  var timeout;

	  switch (priorityLevel) {
	    case ImmediatePriority:
	      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
	      break;

	    case NormalPriority:
	      timeout = NORMAL_PRIORITY_TIMEOUT;
	      break;

	    default:
	      throw new Error('Not Implement');
	  }

	  var expirationTime = startTime + timeout;
	  var newTask = {
	    id: taskIdCounter++,
	    callback: callback,
	    priorityLevel: priorityLevel,
	    startTime: startTime,
	    expirationTime: expirationTime,
	    sortIndex: -1
	  };

	  if (startTime > currentTime) {
	    //这是个延时任务
	    // newTask.sortIndex = startTime
	    // push(timerQueue, newTask)
	    throw new Error('Not Implement');
	  } else {
	    newTask.sortIndex = expirationTime; //入队

	    push$3(taskQueue, newTask); //用postMessage注册一个宏任务，在该宏任务中执行任务队列中的任务
	    //并设置相关变量防止二次注册

	    if (!isHostCallbackScheduled && !isPerformingWork) {
	      isHostCallbackScheduled = true;
	      requestHostCallback(flushWork);
	    }
	  }

	  return newTask;
	};
	/**
	 * 取消一个优先队列中的任务
	 * @param task 要取消的任务
	 */


	var unstable_cancelCallback = function unstable_cancelCallback(task) {
	  /**
	   * 要删除一个优先队列中的随机元素，需要O(N)的时间复杂度很不划算
	   * 不如直接把他的callback直接赋值为null然后在pop出来的时候在判断一下
	   * 是否因该忽略他就行
	   */
	  task.callback = null;
	};

	var now = getCurrentTime;
	var scheduleCallback = unstable_scheduleCallback;
	var NormalPriority$1 = NormalPriority;
	var ImmediatePriority$1 = ImmediatePriority;
	var shouldYield = shouldYieldToHost;
	var cancelCallback = unstable_cancelCallback;

	var syncQueue = null;
	var includesLegacySyncCallbacks = false;
	var isFlushingSyncQueue = false;
	var scheduleSyncCallback = function scheduleSyncCallback(callback) {
	  if (syncQueue === null) {
	    syncQueue = [callback];
	  } else {
	    syncQueue.push(callback);
	  }
	};
	var scheduleLegacySyncCallback = function scheduleLegacySyncCallback(callback) {
	  includesLegacySyncCallbacks = true;
	  scheduleSyncCallback(callback);
	};
	var flushSyncCallbacks = function flushSyncCallbacks() {
	  if (!isFlushingSyncQueue && syncQueue !== null) {
	    //防止二次进入
	    isFlushingSyncQueue = true;
	    var i = 0;
	    var previousUpdatePriority = getCurrentUpdatePriority();

	    try {
	      var isSync = true;
	      var queue = syncQueue;
	      setCurrentUpdatePriority(DiscreteEventPriority);

	      for (; i < queue.length; ++i) {
	        var callback = queue[i];

	        do {
	          callback = callback(isSync);
	        } while (callback !== null);
	      }

	      syncQueue = null;
	      includesLegacySyncCallbacks = false;
	    } catch (error) {
	      /**
	       * 如果一个任务发生异常，则跳过他接着调度他后面的任务
	       */
	      if (syncQueue !== null) {
	        syncQueue = slice$3(syncQueue).call(syncQueue, i + 1);
	      }

	      scheduleCallback(ImmediatePriority$1, flushSyncCallbacks, null);
	      throw error;
	    } finally {
	      setCurrentUpdatePriority(previousUpdatePriority);
	      isFlushingSyncQueue = false;
	    }
	  }
	};

	var NoContext =
	/*             */
	0;
	var BatchedContext =
	/*               */
	1;
	var EventContext =
	/*                 */
	2;
	var LegacyUnbatchedContext =
	/*       */
	4;
	var RenderContext =
	/*                */
	8;
	var CommitContext =
	/*                */
	16;
	var RootIncomplete = 0;
	var RootCompleted = 5;
	var executionContext = NoContext;
	/**
	 * 当前在构建应用的root
	 */

	var workInProgressRoot = null;
	/**
	 * 当前正在进行工作的fiber节点
	 */

	var workInProgress = null;
	/**
	 * 当前渲染中的Lanes
	 */

	var workInProgressRootRenderLanes = NoLanes;
	var currentEventTime = NoTimestamp;
	var rootDoesHavePassiveEffects = false;
	/**
	 * 当前包含PassiveEffect(useEffect产生的effect)的FiberRoot
	 */

	var rootWithPendingPassiveEffects = null;
	var subtreeRenderLanes = NoLanes;

	var completeUnitOfWork = function completeUnitOfWork(unitOfWork) {
	  var completedWork = unitOfWork;

	  do {
	    var current = completedWork.alternate;
	    var returnFiber = completedWork["return"];
	    var next = completeWork(current, completedWork); // if (next !== null) {
	    //   //// Something suspended. Re-render with the fallback children.
	    //   workInProgress = next
	    //   return
	    // }

	    var siblingFiber = completedWork.sibling; //由于是深度优先遍历，当一个节点的"归阶段"完成后立马进入其下一个兄弟节点的递阶段

	    if (siblingFiber !== null) {
	      workInProgress = siblingFiber;
	      return;
	    } //returnFiber的所有子节点都完成递和归阶段，接下来到returnFiber的归阶段了


	    completedWork = returnFiber;
	    workInProgress = completedWork;
	  } while (completedWork !== null);
	};
	/**
	 * 以fiber节点为工作单位开始他们的begin阶段和complete阶段
	 * @param unitOfWork 当前要进行工作的fiber节点
	 */


	var performUnitOfWork = function performUnitOfWork(unitOfWork) {
	  var current = unitOfWork.alternate;
	  var next = null; //创建或者reconcile(也就是diff)unitOfWork的子节点(注意是子节点,是和unitOfWork仅有一层之隔的节点，不是孙子节点，更不是重孙节点)
	  //根据current fiber树和新创建的JSX对象的区别，
	  //为对应的fiber节点打上相应的标记比如Update,Placement,ChildDeletion等
	  //然后将第一个子节点返回也就是unitOfWork.child
	  //因为同级节点直接使用sibling链接所以只用返回第一个就行

	  next = beginWork(current, unitOfWork, subtreeRenderLanes);
	  unitOfWork.memoizedProps = unitOfWork.pendingProps; //进行的是深度优先遍历，next为null说明该节点没有子节点了，对其进行归过程

	  if (next === null) {
	    completeUnitOfWork(unitOfWork);
	  } else {
	    //将workInProgress赋值为unitOfWork的第一个子节点
	    workInProgress = next;
	  }
	};
	/**
	 * 为新一轮的更新初始化新的参数,当从头开始渲染一次更新或者之前的任务被打断，需要重置参数
	 * 时都会调用该函数
	 * @param root 新一轮更新的FiberRoot
	 */


	var prepareFreshStack = function prepareFreshStack(root, lanes) {
	  root.finishedWork = null;
	  workInProgressRoot = root; //创建workInProgress的HostRoot其props为null

	  workInProgress = createWorkInProgress(root.current, null);
	  workInProgressRootRenderLanes = subtreeRenderLanes = lanes;
	  enqueueInterleavedUpdates();
	};
	/**
	 * 同步执行PassiveEffects的destory和create函数
	 * @returns
	 */


	var flushPassiveEffectsImpl = function flushPassiveEffectsImpl() {
	  if (rootWithPendingPassiveEffects === null) return false;
	  var root = rootWithPendingPassiveEffects;
	  rootWithPendingPassiveEffects = null;
	  var prevExecutionContext = executionContext;
	  executionContext |= CommitContext;
	  commitPassiveUnmountEffects(root.current);
	  commitPassiveMountEffects(root, root.current);
	  executionContext = prevExecutionContext;
	  flushSyncCallbacks();
	  return true;
	};
	/**
	 * 如果存在PassiveEffects的话，就把他同步执行了
	 * @returns 返回是否执行了PassiveEffects，如果本来就不存在PassiveEffects那就返回false
	 */


	var flushPassiveEffects = function flushPassiveEffects() {
	  if (rootWithPendingPassiveEffects !== null) {
	    try {
	      return flushPassiveEffectsImpl();
	    } finally {}
	  }

	  return false;
	};

	var renderRootSync = function renderRootSync(root, lanes) {
	  //如果根节点改变调用prepareFreshStack重置参数
	  var prevExecutionContext = executionContext;
	  executionContext |= RenderContext;

	  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
	    prepareFreshStack(root, lanes);
	  }

	  while (workInProgress !== null) {
	    performUnitOfWork(workInProgress);
	  }

	  executionContext = prevExecutionContext;
	  /**
	   * 把它设置为null表示当前没有进行中的render
	   */

	  workInProgressRoot = null;
	  workInProgressRootRenderLanes = NoLanes;
	};

	var commitRootImpl = function commitRootImpl(root) {
	  do {
	    flushPassiveEffects();
	  } while (rootWithPendingPassiveEffects !== null);

	  var finishedWork = root.finishedWork;
	  if (finishedWork === null) return null;
	  root.finishedWork = null;
	  /**
	   * CommitRoot不会返回连续的操作,他总是同步的完成,所以我们可以清除他们
	   * 以允许新的callback能被规划
	   */

	  root.callbackNode = null;
	  root.callbackPriority = NoLane;
	  /**
	   * 剩余需要工作的lanes为HostRoot的lanes和他子树lanes的并集,finishedWork为HostRoot一般不会拥有剩余lanes
	   * 但是他的childLanes有剩余还是挺常见的，比如一个子树高优先级任务打断了一个低优先级的任务
	   * 那个低优先级任务的lanes就会保存到现在，就可以从HostRoot的childLanes获取到
	   * 具体可以看completeWork中的bubbleProperties，他将子树中跳过更新的lanes冒泡到上级节点
	   * 的childLanes中
	   */

	  var remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes); //进行lanes的收尾工作

	  markRootFinished(root, remainingLanes);
	  workInProgressRoot = null;
	  workInProgress = null; //如果存在PassiveEffects就是用Scheduler模块调度一下flushPassiveEffects

	  if ((finishedWork.subtreeFlags & PassiveMask) !== NoFlags || (flags$2(finishedWork) & PassiveMask) !== NoFlags) {
	    if (!rootDoesHavePassiveEffects) {
	      rootDoesHavePassiveEffects = true;
	      scheduleCallback(NormalPriority$1, function () {
	        flushPassiveEffects();
	        return null;
	      }, null);
	    }
	  }
	  /**
	   * 判断是否需要进行工作，大概率是需要进行dom操作，不过也不一定
	   * 比如使用了useLayoutEffect的函数组件会被打上Update的标签
	   * 但他不一定会进行dom操作
	   */


	  var subtreeHasEffects = (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	  var rootHasEffect = (flags$2(finishedWork) & MutationMask) !== NoFlags; //如果需要root或者他的子树进行操作

	  if (rootHasEffect || subtreeHasEffects) {
	    //BeforeMutation阶段，Class组件会在其中执行getSnapshotBeforeUpdate
	    //我们只实现了Function Commponent,以我们的实现无关,可以忽略
	    commitBeforeMutationEffects(root, finishedWork); //Mutation阶段，需要进行操作的HostComponent组件，会在这个阶段进行dom操作

	    commitMutationEffects(root, finishedWork); //此时的workInProgress树被赋值为current Fiber树

	    root.current = finishedWork; //LayoutEffects阶段，在其中执行useLayoutEffect的create函数
	    //这就是他和useEffect最大的区别，useLayoutEffect执行的时间是在dom操作完成后
	    //此时下一帧还没有开始渲染，此时如果做一些动画就非常适合，而如果把执行动画的
	    //操作放到useEffect中，因为他是被Scheduler模块调度，被postMessage注册到宏任务里面的
	    //等到他执行时下一帧已经渲染出来，dom操作后的效果已经体现在了页面上了，
	    //如果此时动画的起点还是前一帧的话页面就会出现闪烁的情况
	    //详细信息可以查看examples下的LayoutEffect例子，试试分别使用
	    //useLayoutEffect和useEffect分别是什么效果

	    commitLayoutEffects(finishedWork, root);
	  } else {
	    root.current = finishedWork;
	  }

	  var rootDidHavePassiveEffects = rootDoesHavePassiveEffects; //PassiveEffect已经被调度，将这些变量设为有值
	  //表示存在PassiveEffect

	  if (rootDidHavePassiveEffects) {
	    rootDoesHavePassiveEffects = false;
	    rootWithPendingPassiveEffects = root;
	  } //root上可能还有剩余的工作，在调度一次


	  ensureRootIsScheduled(root, now());
	  return null;
	};

	var commitRoot = function commitRoot(root) {
	  commitRootImpl(root);
	  return null;
	};
	/**
	 * 这个是不通过Scheduler调度的同步任务的入口
	 * @param root
	 */


	var performSyncWorkOnRoot = function performSyncWorkOnRoot(root) {
	  var lanes = getNextLanes(root, NoLanes);
	  if (!includesSomeLane(lanes, SyncLane)) return null;
	  var exitStatus = renderRootSync(root, lanes);
	  var finishedWork = root.current.alternate;
	  root.finishedWork = finishedWork;
	  commitRoot(root);
	  return null;
	};
	/**
	 * 用这个函数去调度一个任务，对于一个Root同时只能存在一个task,如果在调度一个任务时
	 * 发现已经存在了一个任务我们会检查他的优先级，确保他的优先级是小于等于当前调度的任务的
	 * @param root FiberRoot
	 * @param currentTime 当前任务创建时的时间
	 * @returns
	 */

	var ensureRootIsScheduled = function ensureRootIsScheduled(root, currentTime) {
	  //是否已有任务节点存在，该节点为上次调度时Scheduler返回的任务节点,如果没有则为null
	  var existingCallbackNode = root.callbackNode;
	  /**
	   * 检查是否某些lane上的任务已经过期了如果过期了把他们标记为过期，
	   * 然后接下来就能进行他们的工作
	   */

	  markStarvedLanesAsExpired(root, currentTime); //获得该次任务的优先级

	  var nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);

	  if (nextLanes === NoLanes) {
	    if (existingCallbackNode !== null) {
	      throw new Error('Not Implement');
	    }

	    root.callbackNode = null;
	    root.callbackPriority = NoLane;
	    return;
	  }
	  /**
	   * 我们取最高的lane去代表该callback的优先级
	   */


	  var newCallbackPriority = getHighestPriorityLane(nextLanes);
	  var existingCallbackPriority = root.callbackPriority;
	  /**
	   * 检查是是否已经存在任务，如果存在且优先级相同就可以复用他
	   * 这就是一个click事件内的多次setState
	   * 导致多次scheduleUpdateOnFiber但也只会渲染一次的原因
	   * 同一优先级的update只会被调度一次，后续的update会直接返回
	   * 只需要把他们挂在pending queue上的就行，待会beginWork阶段中拥有相同优先级的
	   * update会被一同reduce了
	   */

	  if (existingCallbackPriority === newCallbackPriority) {
	    return;
	  } //能走到着说明该次更新的的优先级一定大于现存任务的优先级
	  //如果有现存任务就可以直接取消他，让他待会在被重新调度执行


	  if (existingCallbackNode !== null) {
	    //取消现存的callback,然后调度一个新的
	    cancelCallback(existingCallbackNode);
	  } //调度一个新回调


	  var newCallbackNode;

	  if (newCallbackPriority === SyncLane) {
	    //将同步任务全都放到一个队列中，然后注册一个微任务待会把他们全部一同执行了
	    if (root.tag === LegacyRoot) {
	      scheduleLegacySyncCallback(bind$5(performSyncWorkOnRoot).call(performSyncWorkOnRoot, null, root));
	    } else {
	      scheduleSyncCallback(bind$5(performSyncWorkOnRoot).call(performSyncWorkOnRoot, null, root));
	    } //注册一个微任务


	    scheduleMicrotask(flushSyncCallbacks); //同步任务不经过Scheduler模块，所以callbackNode一直都不存在东西
	    //但是callbackPriority会被设置为SyncLane

	    newCallbackNode = null;
	  } else {
	    //不是同步任务，通过scheduler模块调度他
	    var schedulerPriorityLevel; //将lanes的优先级转换为Scheduler模块内使用的优先级
	    //以方便调用

	    switch (lanesToEventPriority(nextLanes)) {
	      case DefaultEventPriority:
	        schedulerPriorityLevel = NormalPriority$1;
	        break;

	      default:
	        throw new Error('Not implement');
	    } //调度performConcurrentWorkOnRoot


	    newCallbackNode = scheduleCallback(schedulerPriorityLevel, bind$5(performConcurrentWorkOnRoot).call(performConcurrentWorkOnRoot, null, root), null);
	  }

	  root.callbackNode = newCallbackNode;
	  root.callbackPriority = newCallbackPriority;
	};

	var performConcurrentWorkOnRoot = function performConcurrentWorkOnRoot(root, didTimeout) {
	  //react又要开始新的工作了,在此次工作完成后重新把控制权交给浏览器又算一个全新的开始，
	  //可以把当前的eventTime清除了，下一次更新的时候会计算一个新的
	  currentEventTime = NoTimestamp;
	  var originalCallbackNode = root.callbackNode; //要开始下一轮render了，如果上一轮留下的PassiveEffects还在没有被执行
	  //冲冲冲，不等他了，直接在这里同步执行了
	  //什么时候会有PassiveEffect呢?在某些组件中使用useEffect,且经过了commit阶段
	  //Scheduler模块调度了flushPassiveEffects后，会将rootDoesHavePassiveEffects
	  //设置为true，表示该root含有PassiveEffect,等到flushPassiveEffects执行后，rootDoesHavePassiveEffects又会被
	  //设置为flase,表示不存在PassiveEffect

	  var didFlushPassiveEffects = flushPassiveEffects();

	  if (didFlushPassiveEffects) {
	    throw new Error('Not Implement');
	  }

	  var lanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);

	  if (lanes === NoLanes) {
	    return null;
	  }

	  var exitStatus = shouldTimeSlice(root, lanes) && !didTimeout ? renderRootConcurrent(root, lanes) : renderRootSync(root, lanes);
	  /**
	   * 在时间切片的过程中，如果还有任务剩余，就会返回RootIncomplete
	   */

	  if (exitStatus !== RootIncomplete) {
	    var finishedWork = root.current.alternate;
	    root.finishedWork = finishedWork;
	    finishConcurrentRender(root, 5);
	  }

	  ensureRootIsScheduled(root, now());

	  if (root.callbackNode === originalCallbackNode) {
	    //这个被规划的task node和当前执行的一样，需要返回一个continuation
	    return bind$5(performConcurrentWorkOnRoot).call(performConcurrentWorkOnRoot, null, root);
	  }

	  return null;
	};
	/**
	 * 工作完成，根据返回的退出码执行对应的操作
	 * @param root FiberRoot
	 * @param exitStatus 退出码如果一切正常会返回RootCompleted
	 * @param lanes
	 */


	var finishConcurrentRender = function finishConcurrentRender(root, exitStatus, lanes) {
	  switch (exitStatus) {
	    case RootCompleted:
	      commitRoot(root);
	      break;

	    default:
	      throw new Error('Not Implement');
	  }
	};
	/**
	 * 在这个切片中一fiber为最小工作单位进行render工作，
	 * 这个切片到期就把控制权交还给浏览器
	 */


	var workLoopConcurrent = function workLoopConcurrent() {
	  //和Sync模式的区别就是，是否加了shouldYield，能在一定
	  //时机暂停render过程
	  while (workInProgress !== null && !shouldYield()) {
	    performUnitOfWork(workInProgress);
	  }
	};
	/**
	 * 开始时间切片下的render过程，如果必须要把控制权交给浏览器了
	 * 那么render过程就会在workInProgress这暂停
	 * 如果workInProgress不为空，那么就返回状态码RootIncomplete
	 * 方便让Scheduler模块在调度一次 performConcurrentWorkOnRoot
	 * 待会让他回来在接着进行render工作，如果workInProgress为空表示
	 * 表示render工作已经全部完成了，可以返回RootCompleted退出码
	 * 然后直接进入commit阶段
	 * @param root FiberRoot
	 * @param lanes 当前被占用的lanes
	 * @returns 退出码可以为RootIncomplete,RootCompleted等
	 */


	var renderRootConcurrent = function renderRootConcurrent(root, lanes) {
	  var prevExecutionContext = executionContext;
	  executionContext |= RenderContext; //如果root或者lanes变了，我们就抛弃现有的stack然后创建一个新的
	  //否则就从继续从我们离开的地方开始

	  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
	    prepareFreshStack(root, lanes);
	  }

	  do {
	    workLoopConcurrent();
	    break;
	  } while (true);

	  executionContext = prevExecutionContext;

	  if (workInProgress !== null) {
	    //还有剩余的工作
	    return RootIncomplete;
	  } else {
	    workInProgressRoot = null;
	    workInProgressRootRenderLanes = NoLanes;
	    return RootCompleted;
	  }
	};
	/**
	 * 将该节点上的更新的优先级冒泡到HostRoot
	在冒泡的过程中不断更新路径上fiber节点的lanes和childLanes
	 * @param sourceFiber 产生更新的节点 
	 * @param lane 该更新的优先级
	 * @returns 
	 */


	var markUpdateLaneFromFiberToRoot = function markUpdateLaneFromFiberToRoot(sourceFiber, lane) {
	  sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
	  var alternate = sourceFiber.alternate;

	  if (alternate !== null) {
	    alternate.lanes = mergeLanes(alternate.lanes, lane);
	  }

	  var node = sourceFiber;
	  var parent = sourceFiber["return"];

	  while (parent !== null) {
	    parent.childLanes = mergeLanes(parent.childLanes, lane);
	    alternate = parent.alternate;

	    if (alternate !== null) {
	      alternate.childLanes = mergeLanes(alternate.childLanes, lane);
	    }

	    node = parent;
	    parent = node["return"];
	  }

	  if (node.tag === HostRoot) {
	    var root = node.stateNode;
	    return root;
	  } else {
	    return null;
	  }
	};
	/**
	 * 获得该次事件的开始时间
	 * @returns 该次事件的开始时间
	 */


	var requestEventTime = function requestEventTime() {
	  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
	    //我们正处于React的工作流程中
	    //可以返回一个真实的时间,我们的实现没有用到该分支
	    throw new Error('Not Implement');
	  } //我们处于一个浏览器事件中，所有在同一个事件的handler中请求的开始时间
	  //都应该是相同的,比如在onClick的handler多次setState就会调用dispatchAction
	  //多次请求时间


	  if (currentEventTime !== NoTimestamp) {
	    return currentEventTime;
	  } //这是react将控制权交还给浏览器后，产生的第一次更新
	  //计算一个新的开始时间


	  currentEventTime = now();
	  return currentEventTime;
	};
	/**
	 * 调度fiber节点上的更新
	 *
	 * @param fiber 当前产生更新的fiber节点
	 * @returns 产生更新fiber树的FiberRoot(注意不是rootFiber)
	 */

	var scheduleUpdateOnFiber = function scheduleUpdateOnFiber(fiber, lane, eventTime) {
	  //将该节点上的更新的优先级冒泡到HostRoot
	  //在冒泡的过程中不断更新路径上fiber节点的lanes和childLanes
	  var root = markUpdateLaneFromFiberToRoot(fiber, lane);

	  if (root === null) {
	    return null;
	  }

	  markRootUpdated(root, lane, eventTime);

	  if (lane === SyncLane) {
	    if ( //检查是是否该调用是否处于unbatchedUpdates中，调用ReactDOM.render是会打上该标记
	    (executionContext & LegacyUnbatchedContext) !== NoContext && //检查是否以及处于渲染中
	    (executionContext & (RenderContext | CommitContext)) === NoContext) {
	      // 这个是一个遗留模式的情况，
	      //首次调用ReactDOM.render时处于batchedUpdates中的逻辑因该是同步执行的
	      //但是layout updates应该推迟到改batch的结尾
	      performSyncWorkOnRoot(root);
	    } else {
	      ensureRootIsScheduled(root, eventTime);

	      if (executionContext === NoContext && (fiber.mode & ConcurrentMode) === NoMode) {
	        throw new Error('Not Implement');
	      }
	    }
	  } else {
	    ensureRootIsScheduled(root, eventTime);
	  }

	  return root;
	};
	/**
	 * ReactDOM中点击事件的外层包装函数在这个函数内被调用的函数
	 * 在调用requestUpdateLane获取优先级是，会得到DiscreteEventPriority优先级
	 * @param fn 要被包装的函数
	 * @param a
	 * @param b
	 * @param c
	 * @param d
	 * @returns
	 */

	var discreteUpdates = function discreteUpdates(fn, a, b, c, d) {
	  var previousPriority = getCurrentUpdatePriority();

	  try {
	    setCurrentUpdatePriority(DiscreteEventPriority);
	    return fn(a, b, c, d);
	  } finally {
	    setCurrentUpdatePriority(previousPriority);
	  }
	};
	/**
	 * 将要执行的函数放入BatchedContext上下文下，此后在函数内创建的所有的更新指挥出发一次reconcil
	 * @param fn 要执行的函数
	 * @param a
	 * @returns
	 */

	var batchedEventUpdates = function batchedEventUpdates(fn, a) {
	  var prevExecutionContext = executionContext;
	  executionContext |= EventContext;

	  try {
	    return fn(a);
	  } finally {
	    executionContext = prevExecutionContext;
	  }
	};
	/**
	 * 给执行上下文加上LegacyUnbatchedContext,等到scheduleUpdateOnFilber执行时
	 * 就会跳转到performSyncWorkOnRoot逻辑，目前只有ReactDOM.render方法中用到了
	 * 该函数
	 * @param fn 要在该上下文中执行的操作要执行的操作
	 * @param a
	 * @returns
	 */

	var unbatchedUpdates = function unbatchedUpdates(fn, a) {
	  var prevExecutionContext = executionContext;
	  executionContext &= ~BatchedContext;
	  executionContext |= LegacyUnbatchedContext;

	  try {
	    return fn(a);
	  } finally {
	    executionContext = prevExecutionContext;
	  }
	};
	/**
	 * 更具fiber所处的mode获得该次更新的优先级
	 * @param fiber
	 * @returns 返回该次更新的优先级
	 */

	var requestUpdateLane = function requestUpdateLane(fiber) {
	  var mode = fiber.mode; //如果不处于ConcurrentMode，不管三七二十一直接返回SyncLane

	  if ((mode & ConcurrentMode) === NoMode) return SyncLane;else if ((executionContext & RenderContext) !== NoContext) {
	    throw new Error('Not Implement');
	  }
	  /**
	   * 不同模块产生的优先级能互动的桥梁比如ReactDom中产生的一个click事件就会先将
	   * CurrentUpdatePriority设置为DiscreteEventPriority然后像reconciler这种模块就能在这里获取到
	   * 当前的UpdatePriority
	   */

	  var updateLane = getCurrentUpdatePriority();

	  if (updateLane !== NoLane) {
	    return updateLane;
	  } //大部分事件产生的更新，可以通过getCurrentEventPriority单独获取优先级，比如click
	  //就会获取到DiscreteEventPriority


	  var eventLane = getCurrentEventPriority();
	  return eventLane;
	};
	var isInterleavedUpdate = function isInterleavedUpdate(fiber, lane) {
	  return workInProgressRoot !== null && (fiber.mode & ConcurrentMode) !== NoMode;
	};

	/**
	 *
	 * @param containerInfo 当前创建的React App所挂载在的dom节点，在concurrent模式下由createRoot方法传入
	 * @param tag 决定fiber树是以什么模式创建的(concurrent,legacy)
	 * @returns 返回FiberRoot（整个应用的根节点，其中current保存有当前页面所对应的fiber树）
	 */

	var createContainer = function createContainer(containerInfo, tag) {
	  return createFiberRoot(containerInfo, tag);
	};
	/**
	 *
	 * @param element 由react.createElement创建的jsx对象在legacy模式下由ReactDom.render方法第一个参数传入
	 * @param container 整个应用的根节点(类型为FiberRoot)，其current属性(类型为Fiber，是否为Fiber树根节点由tag是否为HostRoot决定)保存有当前页面所对应的fiber树
	 */

	var updateContainer = function updateContainer(element, container) {
	  var current = container.current;
	  var eventTime = requestEventTime(); //获得该次更新的优先级如果不处于ConcurrentMode下的话优先级永远都为Sync

	  var lane = requestUpdateLane(current); //创建一个更新，由于我们只实现了Function类型的组件
	  //这种类型的update就只有HostRoot用到了

	  var update = createUpdate();
	  update.payload = {
	    element: element
	  };
	  enqueueUpdate(current, update);
	  /**
	   * 调度该fiber节点上的更新
	   */

	  scheduleUpdateOnFiber(current, lane, eventTime);
	};

	var _context$2;

	var randomKey$1 = slice$3(_context$2 = Math.random().toString(36)).call(_context$2, 2);

	var internalContainerInstanceKey = '__reactContainer$' + randomKey$1;
	/**
	 * 将该dom节点标记为容器节点（整个React App挂载在的节点）
	 * @param hostRoot 当前fiber树的根节点
	 * @param node dom节点
	 */

	var markContainerAsRoot = function markContainerAsRoot(hostRoot, node) {
	  node[internalContainerInstanceKey] = hostRoot;
	};

	/**
	 * createRoot创建节点时使用的类（ConcurrentRoot）
	 */
	var ReactDomRoot = /*#__PURE__*/function () {
	  function ReactDomRoot(container) {
	    _classCallCheck(this, ReactDomRoot);

	    _defineProperty(this, "_internalRoot", void 0);

	    this._internalRoot = createRootImpl(container, ConcurrentRoot);
	  }

	  _createClass(ReactDomRoot, [{
	    key: "render",
	    value: function render(children) {}
	  }, {
	    key: "unmount",
	    value: function unmount() {}
	  }]);

	  return ReactDomRoot;
	}();
	/**
	 * ReactDOM.render创建FiberRoot的时使用的类
	 */


	var ReactDOMLegacyRoot = /*#__PURE__*/function () {
	  function ReactDOMLegacyRoot(container) {
	    _classCallCheck(this, ReactDOMLegacyRoot);

	    _defineProperty(this, "_internalRoot", void 0);

	    this._internalRoot = createRootImpl(container, LegacyRoot);
	  }

	  _createClass(ReactDOMLegacyRoot, [{
	    key: "unmount",
	    value: function unmount() {}
	  }, {
	    key: "render",
	    value: function render(children) {}
	  }]);

	  return ReactDOMLegacyRoot;
	}();
	/**
	 * 将JSX对象渲染为Dom并挂载到container上
	 */


	ReactDomRoot.prototype.render = ReactDOMLegacyRoot.prototype.render = function (children) {
	  var root = this._internalRoot;
	  updateContainer(children, root);
	};
	/**
	 *
	 * @param container createRoot的第一个参数，一个dom元素，表示该React App要改在的容器
	 * @param tag 该Root的类型用createRoot创建的为ConcurrentRoot,
	 * 用ReactDOM.render创建的为LegacyRoot
	 *该标签对以后的流程有深远的影响
	 * @returns 返回一个FiberRoot,一个在并不对应任何DOM的最上层节点，
	 * 所有的fiber节点的根节点，注意HostRoot(Fiber树根节点)可以有多个,
	 * 但是FiberRoot只有一个
	 */

	var createRootImpl = function createRootImpl(container, tag) {
	  var root = createContainer(container, tag);
	  markContainerAsRoot(root.current, container);
	  var rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container; //在container上初始化事件系统，在这里将ReactDom接入react，保证了
	  //基于fiber树的事件代理，以及基于不同事件优先级调度能正常工作

	  listenToAllSupportedEvents(rootContainerElement);
	  return root;
	};
	/**
	 * 创建一个LegacyRoot也就是ReactDOM.render所创建出的root
	 * 该模式没有优先级调度，以及时间切片功能
	 * @param container 挂载ReactApp 的dom容器
	 * @returns 
	 */


	var createLegacyRoot = function createLegacyRoot(container) {
	  return new ReactDOMLegacyRoot(container);
	};

	var legacyCreateRootFromDOMContainer = function legacyCreateRootFromDOMContainer(container) {
	  return createLegacyRoot(container);
	};

	var legacyRenderSubtreeIntoContainer = function legacyRenderSubtreeIntoContainer(parentComponent, children, container, callback) {
	  var _fiberRoot$current$ch3;

	  var root = container._reactRootContainer;
	  var fiberRoot;

	  if (!root) {
	    //首次挂载
	    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container);
	    fiberRoot = root._internalRoot;

	    unbatchedUpdates(function () {
	      updateContainer(children, fiberRoot);
	    }, null);
	  } else {
	    throw new Error('Not Implement');
	  }

	  return (_fiberRoot$current$ch3 = fiberRoot.current.child) === null || _fiberRoot$current$ch3 === void 0 ? void 0 : _fiberRoot$current$ch3.stateNode;
	};

	var render = function render(element, container, callback) {
	  return legacyRenderSubtreeIntoContainer(null, element, container);
	};

	var isArray$5 = isArray$2;

	var isArray$6 = isArray$5;

	var isArray$7 = isArray$6;

	var isArray$8 = isArray$7;

	var arrayWithHoles = createCommonjsModule(function (module) {
	function _arrayWithHoles(arr) {
	  if (isArray$8(arr)) return arr;
	}

	module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(arrayWithHoles);

	var getIteratorMethod_1 = getIteratorMethod;

	var getIteratorMethod$1 = getIteratorMethod_1;

	var getIteratorMethod$2 = getIteratorMethod$1;

	var getIteratorMethod$3 = getIteratorMethod$2;

	var getIteratorMethod$4 = getIteratorMethod$3;

	var getIteratorMethod$5 = getIteratorMethod$4;

	var iterableToArrayLimit = createCommonjsModule(function (module) {
	function _iterableToArrayLimit(arr, i) {
	  var _i = arr == null ? null : typeof symbol$5 !== "undefined" && getIteratorMethod$5(arr) || arr["@@iterator"];

	  if (_i == null) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;

	  var _s, _e;

	  try {
	    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(iterableToArrayLimit);

	var slice$4 = slice$2;

	var slice$5 = slice$4;

	var slice$6 = slice$5;

	var slice$7 = slice$6;

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose(iterator, 'throw', error);
	  }
	};

	var $Array$3 = Array;

	// `Array.from` method implementation
	// https://tc39.es/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var IS_CONSTRUCTOR = isConstructor(this);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
	  var iteratorMethod = getIteratorMethod(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod && !(this === $Array$3 && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = getIterator(O, iteratorMethod);
	    next = iterator.next;
	    result = IS_CONSTRUCTOR ? new this() : [];
	    for (;!(step = functionCall(next, iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty(result, index, value);
	    }
	  } else {
	    length = lengthOfArrayLike(O);
	    result = IS_CONSTRUCTOR ? new this(length) : $Array$3(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var ITERATOR$4 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$4] = function () {
	    return this;
	  };
	  // eslint-disable-next-line es-x/no-array-from, no-throw-literal -- required for testing
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$4] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
	  // eslint-disable-next-line es-x/no-array-from -- required for testing
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.es/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	var from_1 = path.Array.from;

	var from_1$1 = from_1;

	var from_1$2 = from_1$1;

	var from_1$3 = from_1$2;

	var from_1$4 = from_1$3;

	var from_1$5 = from_1$4;

	var arrayLikeToArray = createCommonjsModule(function (module) {
	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) {
	    arr2[i] = arr[i];
	  }

	  return arr2;
	}

	module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(arrayLikeToArray);

	var unsupportedIterableToArray = createCommonjsModule(function (module) {
	function _unsupportedIterableToArray(o, minLen) {
	  var _context;

	  if (!o) return;
	  if (typeof o === "string") return arrayLikeToArray(o, minLen);

	  var n = slice$7(_context = Object.prototype.toString.call(o)).call(_context, 8, -1);

	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return from_1$5(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
	}

	module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(unsupportedIterableToArray);

	var nonIterableRest = createCommonjsModule(function (module) {
	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(nonIterableRest);

	var slicedToArray = createCommonjsModule(function (module) {
	function _slicedToArray(arr, i) {
	  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
	}

	module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _slicedToArray = unwrapExports(slicedToArray);

	var MemorizedComponentDemo = function MemorizedComponentDemo() {
	  var _useState = useState(0),
	      _useState2 = _slicedToArray(_useState, 2),
	      count = _useState2[0],
	      setCount = _useState2[1];

	  useEffect(function () {}, []);
	  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
	    onClick: function onClick() {
	      setCount(count += 1);
	      console.log("count", count);
	    }
	  }, "\u70B9\u51FB"), /*#__PURE__*/React.createElement("p", null, count));
	};

	/*
	 * @Author: changcheng
	 * @LastEditTime: 2022-08-03 18:14:39
	 */
	render( /*#__PURE__*/React.createElement(MemorizedComponentDemo, null), document.querySelector("#app")); // createRoot(document.querySelector('#app')!).render(<TodoList />)
	// createRoot(document.querySelector('#app')!).render(<PriorityScheduling />)
	// createRoot(document.querySelector('#app')!).render(<ChildrenReconcilerDemo />)
	// createRoot(document.querySelector('#app')!).render(<LayoutEffectDemo />)
	// createRoot(document.querySelector('#app')!).render(<StateEffectDemo />)
	// createRoot(document.querySelector('#app')!).render(<TimeSlicingDemo />)
	// render(<PriorityScheduling />, document.querySelector('#app')!)
	// render(<StateEffectDemo />, document.querySelector('#app')!)
	// render(<TimeSlicingDemo />, document.querySelector("#app")!);

}());
//# sourceMappingURL=index.js.map
