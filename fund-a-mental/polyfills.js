/*
 * Comprehensive Guide to Polyfills in JavaScript
 *
 * A polyfill is a piece of code (usually JavaScript) that provides modern
 * functionality on older browsers or environments that do not natively support
 * that functionality. In essence, it "fills in" the gaps in a browser's or
 * environment's native feature set, allowing you to use newer JavaScript features
 * or Web APIs without sacrificing compatibility with older systems.
 *
 * The term "polyfill" was coined by Remy Sharp. Think of it as a patch or a shim
 * that brings a missing feature to an older environment.
 */

/*
 * Why are Polyfills Necessary?
 *
 * 1. Browser Compatibility: Different web browsers (and different versions
 * of the same browser) implement web standards and JavaScript features
 * at varying paces.
 * 2. Using Modern Features: Developers want to use the latest and most efficient
 * JavaScript syntax and Web APIs.
 * 3. Maintaining User Experience: Polyfills ensure a consistent experience
 * across a wider range of clients.
 * 4. Faster Development: Allows developers to write future-proof code today.
 */

/*
 * How Do Polyfills Work?
 *
 * Polyfills typically work by checking if a certain feature or method exists
 * in the current environment. If it doesn't, the polyfill provides its own
 * implementation of that feature.
 */

/*
 * General Polyfill Pattern:
 */
if (!SomeObject.prototype.someNewMethod) {
  SomeObject.prototype.someNewMethod = function() {
    // ... polyfill implementation logic ...
  };
}

/*
 * Different Implementations / Strategies for Polyfilling:
 *
 * While the core idea is simple (check and provide if missing), the actual
 * implementation can vary based on the complexity of the feature and the
 * desired level of robustness and performance.
 */

/*
 * 1. Simple Direct Assignment (Most Common)
 *
 * This is the straightforward way: check for existence and then assign
 * the polyfill directly to the prototype or global object.
 */
console.log("\n--- Implementation 1: Simple Direct Assignment ---");

if (!Array.prototype.includes) {
	console.log("Polyfilling Array.prototype.includes (Simple Direct Assignment)...");
	Array.prototype.includes = function (searchElement, fromIndex) {
		"use strict";
		if (this == null) {
			throw new TypeError('"this" is null or not defined');
		}

		var O = Object(this);
		var len = parseInt(O.length, 10) || 0;
		if (len === 0) {
			return false;
		}
		var n = parseInt(fromIndex, 10) || 0;
		var k;
		if (n >= 0) {
			k = n;
		} else {
			k = len + n;
			if (k < 0) {
				k = 0;
			}
		}
		while (k < len) {
			var currentElement = O[k];
			if (
				searchElement === currentElement ||
				(typeof searchElement === "number" &&
					isNaN(searchElement) &&
					typeof currentElement === "number" &&
					isNaN(currentElement))
			) {
				return true;
			}
			k++;
		}
		return false;
	};
} else {
	console.log("Native Array.prototype.includes is available. Skipping polyfill.");
}

const simpleArray = [1, 2, 3];
console.log(`Array.prototype.includes(2): ${simpleArray.includes(2)}`); // true

/*
 * 2. Using `Object.defineProperty`
 *
 * This method offers more control over the property's attributes, such as
 * `writable`, `enumerable`, and `configurable`. This is particularly useful
 * for preventing the polyfilled method from being accidentally overwritten
 * or showing up in `for...in` loops.
 * `writable: false` makes the property read-only.
 * `enumerable: false` makes the property non-enumerable (won't show up in for...in).
 * `configurable: false` prevents the property from being deleted or its attributes changed.
 */
console.log("\n--- Implementation 2: Using Object.defineProperty ---");

if (!String.prototype.startsWith) {
	console.log("Polyfilling String.prototype.startsWith (Object.defineProperty)...");
	Object.defineProperty(String.prototype, "startsWith", {
		value: function (searchString, position) {
			position = position || 0;
			return this.substr(position, searchString.length) === searchString;
		},
		writable: true, // Often set to false for built-in methods if strictly mimicking native
		configurable: true,
		enumerable: false, // Important for native-like behavior
	});
} else {
	console.log("Native String.prototype.startsWith is available. Skipping polyfill.");
}

const myString = "Hello World";
console.log(`String.prototype.startsWith("Hello"): ${myString.startsWith("Hello")}`); // true

/*
 * 3. Polyfilling Global Objects (e.g., `Promise`, `fetch`)
 *
 * For features that are new global constructors or APIs, you'd check for their
 * existence on the global `window` object (in browsers) or `global` (in Node.js).
 * These often involve more complex polyfill libraries like `core-js`.
 */
console.log("\n--- Implementation 3: Polyfilling Global Objects (Conceptual) ---");

// This is a simplified conceptual example. Actual Promise polyfills are much larger.
if (!window.Promise) {
	// In Node.js, you'd check `!global.Promise`
	console.log("Polyfilling global Promise object (Conceptual)...");
	window.Promise = function (executor) {
		let _resolve, _reject;
		const _state = "pending";
		const _value = undefined;
		const _error = undefined;
		const _thenCbs = [];
		const _catchCbs = [];

		const resolve = (val) => {
			// Simplified: A real polyfill would handle microtasks, state transitions, etc.
			// For demonstration, we'll just immediately call then callbacks.
			if (_state === "pending") {
				_state = "fulfilled";
				_value = val;
				_thenCbs.forEach((cb) => cb(_value));
			}
		};
		const reject = (err) => {
			if (_state === "pending") {
				_state = "rejected";
				_error = err;
				_catchCbs.forEach((cb) => cb(_error));
			}
		};

		this.then = (onFulfilled, onRejected) => {
			if (onFulfilled) _thenCbs.push(onFulfilled);
			if (onRejected) _catchCbs.push(onRejected);
			return this; // For chaining
		};
		this.catch = (onRejected) => {
			if (onRejected) _catchCbs.push(onRejected);
			return this;
		};

		try {
			executor(resolve, reject);
		} catch (e) {
			reject(e);
		}
	};

	// Note: This is NOT a complete or functional Promise polyfill.
	// It's merely illustrative of checking and assigning a global constructor.
	// Real polyfills for Promises (like those from core-js) are highly complex
	// to adhere to the spec precisely.
} else {
	console.log("Native global Promise object is available. Skipping polyfill.");
}

if (window.Promise) {
	new Promise((resolve) => setTimeout(() => resolve("Promise resolved!"), 500)).then((msg) => console.log(msg));
}

/*
 * 4. Feature Detection for Browser-Specific APIs (Web APIs)
 *
 * Many Web APIs (like `fetch`, `IntersectionObserver`, `localStorage`) are
 * browser-specific. Polyfilling them involves checking for their presence
 * on the `window` object or specific DOM elements.
 */
console.log("\n--- Implementation 4: Feature Detection for Web APIs (Conceptual) ---");

if (!window.fetch) {
	console.log("Polyfilling global fetch API (Conceptual)...");
	// A real fetch polyfill would typically use XMLHttpRequest or a similar mechanism.
	window.fetch = function (url, options) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open(options.method || "GET", url);
			xhr.onload = function () {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve({
						json: () => Promise.resolve(JSON.parse(xhr.responseText)),
						text: () => Promise.resolve(xhr.responseText),
						status: xhr.status,
						ok: true,
					});
				} else {
					reject(new Error(`HTTP error! Status: ${xhr.status}`));
				}
			};
			xhr.onerror = function () {
				reject(new Error("Network error"));
			};
			xhr.send(options.body);
		});
	};
	// Note: This is an extremely simplified fetch polyfill for illustration.
	// Real fetch polyfills (e.g., whatwg-fetch) are significantly more robust
	// to cover all headers, response types, streams, etc.
} else {
	console.log("Native global fetch API is available. Skipping polyfill.");
}

// Example usage (will use native or polyfilled fetch)
// Uncomment the lines below to try fetching something
/*
if (window.fetch) {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(json => console.log('Fetched data (conceptual):', json))
        .catch(error => console.error('Fetch error (conceptual):', error));
}
*/

/*
 * Polyfill vs. Transpiler vs. Shim:
 *
 * - Polyfill: Provides missing *functionality* for older environments.
 * - Transpiler (e.g., Babel): Converts newer *syntax* into older syntax
 * (e.g., arrow functions to regular functions, `const`/`let` to `var`).
 * - Shim: A broader term, often used interchangeably with polyfill, referring
 * to a library that intercepts API calls and provides a compatibility layer.
 * Polyfills are a specific type of shim that *add* missing functionality.
 *
 * In summary, polyfills are essential tools in modern web development,
 * enabling developers to leverage the latest language features and APIs
 * while ensuring broad compatibility across diverse user environments.
 */
