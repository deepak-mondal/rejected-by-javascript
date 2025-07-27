/*
 * Comprehensive Guide to Memory Leaks in JavaScript
 *
 * A memory leak occurs when a program consumes memory but fails to release it
 * back to the operating system when it's no longer needed. Over time, this
 * unreleased memory accumulates, leading to increased memory consumption,
 * slower application performance, and eventually, crashes.
 *
 * In JavaScript, memory management (especially garbage collection) is largely
 * automatic. However, it's still possible to create situations where the
 * garbage collector cannot determine that certain objects are no longer
 * reachable or needed, thus leading to leaks.
 */

/*
 * I. How JavaScript Manages Memory (Briefly: Garbage Collection)
 *
 * JavaScript engines use a garbage collector (GC) to automatically reclaim
 * memory that is no longer being used by the program. The most common
 * algorithm is "mark-and-sweep":
 *
 * 1. Mark: The GC starts from "roots" (global objects like `window` or `global`,
 * and currently executing function scopes) and finds all objects that are
 * reachable from these roots. These objects are "marked."
 * 2. Sweep: All objects that were *not* marked (i.e., are unreachable) are
 * considered garbage and their memory is reclaimed.
 *
 * A memory leak happens when objects that are no longer needed by your application
 * are *still reachable* from a root, preventing the garbage collector from freeing them.
 */

/*
 * II. Common Causes of Memory Leaks in JavaScript
 */

/*
 * 1. Global Variables
 *
 * Variables declared without `var`, `let`, or `const` inside a function
 * (in non-strict mode) automatically become global properties of the `window`
 * object (in browsers) or `global` object (in Node.js). Global variables
 * are never garbage collected as they are always reachable from the root.
 */
console.log("--- Memory Leak Cause 1: Global Variables ---");

function createGlobalLeak() {
	// In non-strict mode, `leakedGlobal` becomes a property of `window` (browser)
	// or `global` (Node.js).
	leakedGlobal = {
		data: "This object will never be garbage collected because it's global.",
	};
	console.log("Global variable created:", leakedGlobal.data);
}

createGlobalLeak();
// Now `leakedGlobal` is a property of the global object.
// It will persist for the lifetime of the application.
// console.log(window.leakedGlobal); // In browser
// console.log(global.leakedGlobal); // In Node.js

/*
 * Prevention:
 * - Always use `var`, `let`, or `const` to declare variables.
 * - Use strict mode (`'use strict';`) to prevent accidental global variable creation.
 */
("use strict");
function preventGlobalLeak() {
	// This will throw a ReferenceError in strict mode if `anotherLeakedGlobal` is not declared.
	// anotherLeakedGlobal = { data: "This would leak if not in strict mode." };
	// console.log("Attempted to create another global variable.");
}
// preventGlobalLeak(); // Uncomment to see the ReferenceError in strict mode

/*
 * 2. Forgotten Timers or Intervals
 *
 * `setTimeout` and `setInterval` functions, if not cleared, can keep
 * references to objects or functions within their scope, preventing them
 * from being garbage collected, even if the rest of their environment
 * is gone.
 */
console.log("\n--- Memory Leak Cause 2: Forgotten Timers/Intervals ---");

let counter = 0;
let myInterval;

function startLeakingInterval() {
	let largeData = new Array(1000000).fill("some_data_string"); // Large array
	console.log("Large data created for interval.");

	myInterval = setInterval(() => {
		counter++;
		// The `largeData` array is referenced by this closure,
		// so it will never be garbage collected as long as `myInterval` runs.
		if (counter % 100 === 0) {
			console.log(`Interval running, counter: ${counter}. Large data still referenced.`);
		}
	}, 100); // Runs every 100ms

	// In a real app, you'd navigate away or the component would unmount,
	// but the interval keeps running in the background.
	setTimeout(() => {
		console.log("Simulating component unmount. Interval should be cleared.");
		// To prevent the leak, clear the interval:
		// clearInterval(myInterval);
		// console.log("Interval cleared. Large data can now be GC'd.");
	}, 2000); // Simulate running for 2 seconds
}

// startLeakingInterval(); // Uncomment to see the interval running and potentially leaking

/*
 * Prevention:
 * - Always clear timers/intervals using `clearInterval()` or `clearTimeout()`
 * when they are no longer needed (e.g., component unmounts, task completes).
 */
function stopLeakingInterval() {
	if (myInterval) {
		clearInterval(myInterval);
		console.log("Interval successfully cleared, preventing leak.");
		myInterval = null; // Dereference to aid GC
	}
}
// setTimeout(stopLeakingInterval, 2500); // Call this after the simulated unmount

/*
 * 3. Detached DOM Elements
 *
 * If you remove DOM elements from the document but still hold references
 * to them (or their descendants) in JavaScript variables, those elements
 * cannot be garbage collected. This is a common source of leaks in SPAs.
 */
console.log("\n--- Memory Leak Cause 3: Detached DOM Elements (Conceptual) ---");

// This is conceptual for a browser environment.

// Assume an HTML structure: <div id="container"><span id="child">Hello</span></div>
const container = document.getElementById('container');
let childElement = document.getElementById('child');

// Remove child from DOM
if (container && childElement) {
  container.removeChild(childElement);
  console.log("Child element removed from DOM.");
}

// Problem: `childElement` variable still holds a reference to the detached element.
// The element and its subtree (if any) cannot be garbage collected.
console.log(childElement); // Still accessible, thus leaked.

// To trigger leak:
setInterval(() => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const ref = div; // Hold reference
  document.body.removeChild(div); // Remove from DOM
  // 'ref' still holds a reference to the detached div, leaking it.
}, 100);


/*
 * Prevention:
 * - Nullify references to DOM elements once they are removed from the DOM
 * and no longer needed.
 */

childElement = null; // Nullify the reference
console.log("Child element reference nullified."); // Now it can be GC'd


/*
 * 4. Closures Holding References to Outer Scope Variables
 *
 * Closures are powerful, but if a long-lived closure (e.g., an event listener
 * or a timer callback) captures a reference to a large object in its outer scope,
 * that object will not be garbage collected as long as the closure exists.
 */
console.log("\n--- Memory Leak Cause 4: Closures Holding References ---");

function createLeakyClosure() {
	let hugeArray = new Array(5000000).fill("closure_data"); // Very large array
	console.log("Huge array created for leaky closure.");

	// This inner function forms a closure over `hugeArray`.
	// If `longLivedFunction` is stored somewhere and never released,
	// `hugeArray` will also never be released.
	return function longLivedFunction() {
		// This function might be an event listener, a timer callback, etc.
		// It keeps `hugeArray` in memory.
		console.log("Leaky closure function called. Huge array still alive.");
		// Accessing hugeArray ensures the reference is maintained
		return hugeArray.length;
	};
}

let leakedClosureRef = createLeakyClosure();
// `leakedClosureRef` now holds the inner function, which in turn holds `hugeArray`.
// If `leakedClosureRef` itself is never nullified or goes out of scope,
// the `hugeArray` leaks.
console.log(`Leaked closure function reference created. Array size: ${leakedClosureRef()}`);

/*
 * Prevention:
 * - Be mindful of what variables closures capture.
 * - If a closure needs to use a large object, consider passing it as an argument
 * or explicitly nullifying the reference within the closure once it's no longer needed.
 * - Ensure the closure itself is eventually garbage collected (e.g., remove event listeners).
 */
// leakedClosureRef = null; // Nullify the closure reference to allow GC
// console.log("Leaked closure reference nullified.");

/*
 * 5. Unremoved Event Listeners
 *
 * If an event listener is added to a DOM element but not removed when the
 * element or the component is destroyed, the listener (and any objects it
 * closes over) can remain in memory.
 */
console.log("\n--- Memory Leak Cause 5: Unremoved Event Listeners (Conceptual) ---");

// This is conceptual for a browser environment.

const myButton = document.getElementById('myButton'); // Assume this button exists
let largeObject = { data: new Array(100000).fill('event_data') };

function handleClick() {
  // This function closes over `largeObject`
  console.log("Button clicked. Large object still referenced.");
}

if (myButton) {
  myButton.addEventListener('click', handleClick);
  console.log("Event listener added to button.");
}

// Problem: If `myButton` is removed from the DOM, or the component
// containing it is destroyed, the `handleClick` function (and `largeObject`)
// will still be in memory because the browser's event system holds a reference
// to the listener.

// To simulate leak:
const leakyButton = document.createElement('button');
document.body.appendChild(leakyButton);
const someBigData = { payload: new Array(100000).fill('leak') };
leakyButton.addEventListener('click', () => {
  console.log(someBigData.payload.length); // Closure over someBigData
});
document.body.removeChild(leakyButton); // Button removed, but listener and someBigData still leak.


/*
 * Prevention:
 * - Always remove event listeners when they are no longer needed.
 * `removeEventListener()` is crucial.
 * - For single-use events, consider `{ once: true }` option in `addEventListener`.
 * - Use `WeakMap` or `WeakSet` for references that should not prevent GC.
 */

if (myButton) {
  myButton.removeEventListener('click', handleClick);
  console.log("Event listener removed from button.");
}
largeObject = null; // Also nullify the object reference if not needed elsewhere


/*
 * 6. Out-of-Bound References in Data Structures
 *
 * If you push objects into an array or map and never remove them, or if you
 * maintain references to objects that are logically "out of scope" for your
 * application's current state, they will accumulate.
 */
console.log("\n--- Memory Leak Cause 6: Out-of-Bound References in Data Structures ---");

const cache = []; // This cache will grow indefinitely

function addToCache(item) {
	// If items are added but never removed, this array will grow
	// and hold references to all added items, preventing their GC.
	cache.push(item);
	console.log(`Item added to cache. Cache size: ${cache.length}`);
}

for (let i = 0; i < 5; i++) {
	addToCache({ id: i, data: new Array(10000).fill(`item_${i}`) });
}
// At this point, `cache` holds 5 large objects. If this continues, it's a leak.

/*
 * Prevention:
 * - Implement proper cache invalidation strategies (e.g., LRU - Least Recently Used).
 * - Use `Map` or `Set` if appropriate, and ensure items are `delete()`d.
 * - Consider `WeakMap` or `WeakSet` if the key-value pairs should not prevent
 * garbage collection of the keys (e.g., mapping DOM elements to data).
 */
// To prevent leak:
// cache.length = 0; // Clear the array
// console.log("Cache cleared, allowing items to be GC'd.");

/*
 * III. How to Detect and Prevent Memory Leaks
 */

/*
 * 1. Browser Developer Tools (Chrome DevTools Memory Tab)
 *
 * - **Heap Snapshots:** Take snapshots of your application's memory over time.
 * Compare snapshots to identify objects that are increasing in count or size.
 * Look for "Detached DOM trees" or unexpected object types.
 * - **Performance Monitor:** Observe the memory usage graph over time. A steadily
 * increasing graph often indicates a leak.
 * - **Allocation Timeline:** Records memory allocations over a period, helping
 * to pinpoint where memory is being allocated and potentially leaked.
 */

/*
 * 2. Code Review and Best Practices
 *
 * - Be mindful of global variables (`'use strict';`).
 * - Always clean up timers, intervals, and event listeners.
 * - Nullify references to large objects or detached DOM elements when no longer needed.
 * - Implement proper data structure management (e.g., cache limits, explicit deletion).
 * - Be cautious with closures, especially if they capture large amounts of data
 * and are themselves long-lived.
 */

/*
 * 3. Weak References (`WeakMap`, `WeakSet`)
 *
 * - `WeakMap` and `WeakSet` store "weak" references to objects.
 * - If the only reference to an object is from a `WeakMap` or `WeakSet`,
 * that object can still be garbage collected.
 * - Useful for associating metadata with objects without preventing their GC.
 */
console.log("\n--- Prevention: WeakMap Example ---");

let element = { id: 1, name: "My Element" }; // Simulate a DOM element or complex object
let data = { value: "Some associated data" };

const weakMap = new WeakMap();
weakMap.set(element, data);
console.log("WeakMap created with element and data.");

// If `element` loses all other strong references, it (and its associated `data` in the WeakMap)
// can be garbage collected. The WeakMap itself doesn't prevent GC of its keys.
element = null; // Nullify the strong reference
console.log("Strong reference to 'element' nullified. It can now be GC'd if no other refs exist.");

// You cannot iterate over WeakMap/WeakSet or get their size, as their contents
// can change unpredictably due to GC.

/*
 * Conclusion
 *
 * While JavaScript's garbage collector handles much of memory management,
 * developers must still be aware of scenarios that can lead to memory leaks.
 * Understanding common leak patterns and employing best practices, along with
 * utilizing browser developer tools, are key to building performant and stable
 * JavaScript applications.
 */
