/*
 * Comprehensive Guide to the JavaScript Event Loop and Its Quirks
 *
 * The JavaScript Event Loop is a fundamental mechanism that enables
 * non-blocking, asynchronous behavior in JavaScript, despite its
 * single-threaded nature. Understanding it is crucial for building
 * responsive web applications and Node.js servers.
 */

/*
 * I. The Single-Threaded Nature of JavaScript
 *
 * JavaScript is inherently single-threaded. This means it has only one
 * "call stack" and can execute only one piece of code at a time.
 * If a long-running synchronous operation occurs, it "blocks" the thread,
 * making the application unresponsive (e.g., UI freezes, no user input processed).
 */

console.log("--- Single-Threaded Nature ---");
console.log("Synchronous task 1");

// This would block the entire thread for 2 seconds
/*
const start = Date.now();
while (Date.now() - start < 2000) {
  // Do nothing, just block
}
console.log("Synchronous task 2 (after blocking)");
*/

console.log("Synchronous task 2 (without blocking)");

/*
 * II. Components of the Event Loop
 *
 * The Event Loop is not part of the JavaScript engine itself, but rather
 * part of the JavaScript runtime environment (e.g., browser's Web APIs, Node.js APIs).
 *
 * 1. Call Stack (Execution Stack):
 * - A LIFO (Last-In, First-Out) stack data structure.
 * - Where synchronous code is executed. When a function is called, it's pushed
 * onto the stack. When it returns, it's popped off.
 *
 * 2. Web APIs (Browser) / Node.js APIs (Server):
 * - Provided by the runtime environment, not by the JS engine.
 * - Handle asynchronous operations like `setTimeout`, `fetch` requests,
 * DOM events (`click`, `load`), file I/O, etc.
 * - When an async operation is initiated, it's handed off to these APIs.
 *
 * 3. Callback Queue (or Macrotask Queue / Task Queue):
 * - A FIFO (First-In, First-Out) queue.
 * - Callbacks from completed Web API tasks (e.g., `setTimeout` callbacks,
 * DOM event handlers, `fetch` response handlers) are placed here.
 *
 * 4. Microtask Queue (or Job Queue):
 * - A FIFO queue with higher priority than the Callback Queue.
 * - Callbacks from Promises (`.then()`, `.catch()`, `.finally()`) and
 * `queueMicrotask()` are placed here.
 *
 * 5. The Event Loop Itself:
 * - A continuous process that constantly monitors the Call Stack and the queues.
 * - Its job is to move callbacks from the queues to the Call Stack for execution
 * *only when the Call Stack is empty*.
 */

/*
 * III. How the Event Loop Works (Simplified Cycle)
 *
 * 1. Execute all synchronous code on the Call Stack.
 * 2. When an asynchronous operation is encountered (e.g., `setTimeout`, `Promise`),
 * it's handed off to the appropriate Web API.
 * 3. The JavaScript engine continues executing the rest of the synchronous code.
 * 4. When a Web API task completes, its callback is placed into either the
 * Microtask Queue or the Macrotask Queue.
 * 5. The Event Loop continuously checks:
 * a. Is the Call Stack empty?
 * b. If yes, process *all* tasks in the Microtask Queue, moving them to the
 * Call Stack one by one until the Microtask Queue is empty.
 * c. Is the Call Stack empty again?
 * d. If yes, take *one* task from the Macrotask Queue and move it to the Call Stack.
 * e. Repeat from step 5a.
 */

console.log("\n--- Basic Event Loop Flow Example ---");

console.log("1. Script start");

setTimeout(() => {
  console.log("4. setTimeout callback (Macrotask)");
}, 0); // Even with 0ms, it's still asynchronous and goes to Macrotask Queue

Promise.resolve().then(() => {
  console.log("3. Promise.resolve().then() callback (Microtask)");
});

console.log("2. Script end");

/*
 * Expected Output:
 * 1. Script start
 * 2. Script end
 * 3. Promise.resolve().then() callback (Microtask)
 * 4. setTimeout callback (Macrotask)
 *
 * Explanation:
 * - "Script start" and "Script end" are synchronous, so they execute first.
 * - `setTimeout` callback goes to the Macrotask Queue.
 * - `Promise.resolve().then()` callback goes to the Microtask Queue.
 * - After synchronous code finishes, the Call Stack is empty.
 * - The Event Loop prioritizes the Microtask Queue, so the Promise callback runs next.
 * - Then, the Event Loop takes one task from the Macrotask Queue, and the `setTimeout` callback runs.
 */

/*
 * IV. Quirks and Advanced Concepts of the Event Loop
 */

/*
 * Quirk 1: Microtask Queue Priority
 *
 * Microtasks are always processed *before* macrotasks in the same event loop tick.
 * This means if a microtask adds another microtask, that new microtask will also
 * be processed before any macrotask gets a chance to run.
 */
console.log("\n--- Quirk 1: Microtask Queue Priority ---");

console.log("A. Script start");

setTimeout(() => {
  console.log("F. setTimeout 1 (Macrotask)");
  Promise.resolve().then(() => {
    console.log("G. Promise inside setTimeout (Microtask)");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("C. Promise 1 (Microtask)");
  Promise.resolve().then(() => {
    console.log("D. Promise 2 (Microtask inside another Microtask)");
  });
});

setTimeout(() => {
  console.log("H. setTimeout 2 (Macrotask)");
}, 0);

console.log("B. Script end");

/*
 * Expected Output:
 * A. Script start
 * B. Script end
 * C. Promise 1 (Microtask)
 * D. Promise 2 (Microtask inside another Microtask)
 * F. setTimeout 1 (Macrotask)
 * G. Promise inside setTimeout (Microtask)
 * H. setTimeout 2 (Macrotask)
 *
 * Explanation:
 * 1. Synchronous code: A, B.
 * 2. Call Stack empty. Event Loop checks Microtask Queue.
 * 3. C runs. Inside C, D is added to Microtask Queue.
 * 4. D runs (Microtask Queue is still prioritized).
 * 5. Microtask Queue empty. Event Loop checks Macrotask Queue.
 * 6. F runs. Inside F, G is added to Microtask Queue.
 * 7. Call Stack empty. Event Loop checks Microtask Queue. G runs.
 * 8. Microtask Queue empty. Event Loop checks Macrotask Queue. H runs.
 */

/*
 * Quirk 2: `queueMicrotask()`
 *
 * `queueMicrotask()` explicitly queues a function as a microtask. It's useful
 * when you need to run code asynchronously but want it to execute with higher
 * priority than `setTimeout` callbacks, immediately after the current script
 * execution completes, and before the next macrotask.
 */
console.log("\n--- Quirk 2: `queueMicrotask()` ---");

console.log("1. Start");

setTimeout(() => console.log("4. setTimeout (Macrotask)"), 0);
Promise.resolve().then(() => console.log("3. Promise (Microtask)"));
queueMicrotask(() => console.log("2.5. queueMicrotask (Microtask)")); // Will run after Promise, before setTimeout

console.log("2. End");

/*
 * Expected Output:
 * 1. Start
 * 2. End
 * 3. Promise (Microtask)
 * 2.5. queueMicrotask (Microtask)
 * 4. setTimeout (Macrotask)
 *
 * Explanation: `queueMicrotask` is also a microtask, so it runs after other
 * microtasks (like Promises) but before any macrotasks.
 */

/*
 * Quirk 3: `async/await` and the Event Loop
 *
 * `async/await` is syntactic sugar over Promises.
 * - An `async` function always returns a Promise.
 * - `await` pauses the execution of the `async` function and puts the rest
 * of the `async` function's code into the Microtask Queue when the awaited
 * Promise resolves.
 */
console.log("\n--- Quirk 3: `async/await` and the Event Loop ---");

async function asyncFunction() {
  console.log("Async Function: 1. Before await");
  await Promise.resolve(); // This puts the rest of the function into the Microtask Queue
  console.log("Async Function: 3. After await (Microtask)");
}

console.log("Script: A. Start");
asyncFunction();
Promise.resolve().then(() => console.log("Script: C. Promise.then (Microtask)"));
console.log("Script: B. End");

/*
 * Expected Output:
 * Script: A. Start
 * Async Function: 1. Before await
 * Script: B. End
 * Script: C. Promise.then (Microtask)
 * Async Function: 3. After await (Microtask)
 *
 * Explanation:
 * 1. Synchronous code runs: "Script: A. Start".
 * 2. `asyncFunction()` is called. "Async Function: 1. Before await" logs.
 * 3. `await Promise.resolve()` is encountered. The Promise resolves immediately.
 * The *rest of `asyncFunction`* is scheduled as a microtask.
 * 4. "Script: B. End" logs (synchronous code continues).
 * 5. Call Stack empty. Microtask Queue is processed.
 * 6. "Script: C. Promise.then (Microtask)" logs.
 * 7. "Async Function: 3. After await (Microtask)" logs (from the microtask scheduled by `await`).
 */

/*
 * Quirk 4: DOM Rendering and Event Handling (Browser Specific)
 *
 * DOM rendering and user interaction events (like clicks, key presses) are
 * typically handled as macrotasks. This is why a long synchronous script
 * can freeze the UI, preventing rendering updates and event processing.
 * Asynchronous operations, by deferring work to the queues, allow the browser
 * to remain responsive.
 */
console.log("\n--- Quirk 4: DOM Rendering and Event Handling (Conceptual) ---");

// This part is conceptual as it requires a browser environment with a DOM.
// Imagine a button click handler:
/*
document.getElementById('myButton').addEventListener('click', () => {
  console.log("Button clicked! (Macrotask)");
  // If this handler had a long synchronous loop, it would block the UI
});

console.log("Page loaded.");
// If the user clicks the button while a long synchronous script is running,
// the click event callback won't execute until the synchronous script finishes.
// If an async operation is running (e.g., fetch), the UI remains responsive.
*/

/*
 * V. Key Takeaways
 *
 * - JavaScript is single-threaded, but the Event Loop enables concurrency.
 * - The Call Stack executes synchronous code.
 * - Web APIs handle asynchronous operations.
 * - Callbacks are queued in the Microtask Queue (Promises, `async/await`, `queueMicrotask`)
 * or the Macrotask Queue (`setTimeout`, DOM events, `fetch` callbacks).
 * - Microtasks have higher priority and are processed *completely* before the
 * next macrotask.
 * - Understanding this flow is vital for predicting execution order and
 * debugging asynchronous code.
 */