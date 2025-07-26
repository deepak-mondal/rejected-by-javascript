/*
 * Asynchronous JavaScript: Introduction and Concepts
 *
 * Asynchronous JavaScript is a fundamental concept for building responsive
 * and efficient web applications. It allows your code to perform long-running
 * operations (like fetching data from a server, reading files, or handling
 * user input) without "blocking" the main execution thread, which would
 * otherwise freeze the user interface.
 */

/*
 * The Problem: Synchronous JavaScript and Blocking
 *
 * JavaScript is inherently single-threaded. This means it can only execute
 * one piece of code at a time. In a synchronous model, if you have a task
 * that takes a long time (e.g., a network request that takes 5 seconds),
 * the JavaScript engine will simply stop and wait for that task to complete
 * before moving on to the next line of code.
 */

/*
 * Example of Blocking Synchronous Code
 *
 * In this example, when fetchData() is called, the browser tab would
 * completely freeze for 5 seconds. The user couldn't click anything, scroll,
 * or interact with the page. This is a terrible user experience.
 */
console.log("Start (Synchronous Blocking Example)");

function fetchData() {
	// Simulate a long-running network request
	const startTime = Date.now();
	while (Date.now() - startTime < 5000) {
		// This is a blocking loop for 5 seconds
	}
	return "Data received synchronously!";
}

// Uncomment the line below to see the blocking behavior
// const data = fetchData();
// console.log(data);
// console.log("End (Synchronous Blocking Example)");

/*
 * The Solution: Asynchronous JavaScript and Non-Blocking
 *
 * Asynchronous JavaScript solves this by allowing certain operations to run
 * "in the background" or be "deferred." Instead of waiting, the JavaScript
 * engine continues executing the rest of your code, and when the long-running
 * operation finishes, it notifies the main thread so that its result can be processed.
 *
 * This "notification" and subsequent processing are managed by the Event Loop.
 */

/*
 * The Event Loop (A Quick Overview)
 *
 * The Event Loop is a continuous process that checks two main things:
 * 1. The Call Stack: Where your synchronous JavaScript code is executed.
 * 2. Task Queues (Callback Queue/Macrotask Queue, and Microtask Queue/Job Queue):
 * - Web APIs/Node.js APIs: Asynchronous operations are handed over here.
 * - Once an asynchronous operation completes, its callback is placed into a Task Queue.
 * - Microtask Queue (for Promises, queueMicrotask): Higher priority. Processed before Macrotasks.
 * - Macrotask Queue (for setTimeout, setInterval, DOM events, I/O): Lower priority.
 * 3. The Event Loop's Job: Continuously checks if the Call Stack is empty.
 * If empty, it takes the first callback from the Microtask Queue, then from the Macrotask Queue,
 * and pushes it onto the Call Stack for execution. This cycle repeats.
 */

/*
 * How to Implement Asynchronous JavaScript
 *
 * 1. Callbacks (Oldest, but still used)
 * 2. Promises (ES6 / ES2015)
 * 3. Async/Await (ES8 / ES2017 - built on Promises)
 */

/*
 * 1. Callbacks
 *
 * A callback function is simply a function passed as an argument to another
 * function, which is then executed when the "outer" function completes some task.
 */

console.log("\n--- Callbacks Example ---");
console.log("Start (Callbacks)");

function greet(name, callback) {
	setTimeout(() => {
		console.log(`Hello, ${name}!`);
		if (callback) {
			callback(); // Execute the callback after greeting
		}
	}, 2000); // Wait for 2 seconds
}

function sayGoodbye() {
	console.log("Goodbye!");
}

greet("Alice", sayGoodbye); // Pass sayGoodbye as a callback

console.log("End (Callbacks)");

/*
 * Output (approximate):
 * Start (Callbacks)
 * End (Callbacks)
 * Hello, Alice!  (after 2 seconds)
 * Goodbye!       (after 2 seconds, immediately after "Hello, Alice!")
 */

/*
 * Cons of Callbacks (Callback Hell / Pyramid of Doom):
 *
 * When you have multiple dependent asynchronous operations, callbacks can lead
 * to deeply nested, unreadable code.
 */

// Callback Hell example (conceptual, not runnable without getUser, getPosts, getComments)
getUser(1, (user) => {
	getPosts(user.id, (posts) => {
		getComments(posts[0].id, (comments) => {
			console.log("User:", user);
			console.log("First Post:", posts[0]);
			console.log("Comments on first post:", comments);
			// More nested callbacks...
		});
	});
});

/*
 * 2. Promises
 *
 * Promises were introduced in ES6 (ES2015) to address the problems of callback hell
 * and provide a more structured and readable way to handle asynchronous operations.
 * A Promise is an object representing the eventual completion (or failure) of an
 * asynchronous operation and its resulting value.
 *
 * States of a Promise:
 * - Pending: Initial state, neither fulfilled nor rejected.
 * - Fulfilled (or Resolved): Operation completed successfully.
 * - Rejected: Operation failed.
 *
 * You interact with promises using .then(), .catch(), and .finally() methods.
 */

console.log("\n--- Promises Example ---");
console.log("Start (Promises)");

function fetchDataPromise(shouldSucceed = true) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (shouldSucceed) {
				resolve("Data fetched successfully!"); // Operation completed successfully
			} else {
				reject("Failed to fetch data!"); // Operation failed
			}
		}, 2000);
	});
}

// Consuming the Promise (Success Scenario):
fetchDataPromise(true)
	.then((data) => {
		console.log("Success (Promise):", data); // Handled if the promise is fulfilled
		return "Processed " + data; // Return value for the next .then()
	})
	.then((processedData) => {
		console.log("Further processing (Promise):", processedData);
	})
	.catch((error) => {
		console.error("Error (Promise):", error); // Handled if the promise is rejected anywhere in the chain
	})
	.finally(() => {
		console.log("Promise operation finished (success scenario)"); // Always runs
	});

// Consuming the Promise (Failure Scenario):
fetchDataPromise(false) // This one will fail
	.then((data) => {
		console.log("Success (Promise - this should not run for failure):", data);
	})
	.catch((error) => {
		console.error("Error (Promise - failed promise):", error);
	})
	.finally(() => {
		console.log("Promise operation finished (failure scenario)");
	});

console.log("End (Promises - This will log before promises resolve)");

/*
 * Output (approximate):
 * Start (Promises)
 * End (Promises - This will log before promises resolve)
 * Success (Promise): Data fetched successfully! (after ~2 seconds)
 * Further processing (Promise): Processed Data fetched successfully! (after ~2 seconds)
 * Promise operation finished (success scenario) (after ~2 seconds)
 * Error (Promise - failed promise): Failed to fetch data! (after ~2 seconds)
 * Promise operation finished (failure scenario) (after ~2 seconds)
 */

/*
 * 3. Async/Await
 *
 * `async` and `await` keywords, introduced in ES8 (ES2017), are "syntactic sugar"
 * built on top of Promises. They allow you to write asynchronous code that *looks*
 * and *feels* synchronous, making it even more readable and easier to reason about.
 *
 * - An `async` function always returns a Promise.
 * - The `await` keyword can *only* be used inside an `async` function.
 * It pauses the execution of the `async` function until the Promise it's
 * waiting for settles (resolves or rejects).
 * - When the Promise resolves, `await` returns its resolved value.
 * - If the Promise rejects, `await` throws an error, which can be caught with
 * a `try...catch` block.
 */

console.log("\n--- Async/Await Example ---");
console.log("Start (Async/Await)");

function simulateFetch(data, delay, shouldSucceed = true) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (shouldSucceed) {
				resolve(data);
			} else {
				reject(new Error("Network error during simulated fetch!"));
			}
		}, delay);
	});
}

async function getUserData() {
	try {
		console.log("Fetching user...");
		// Pause here until simulateFetch(user) promise resolves (1.5s)
		const user = await simulateFetch({ id: 1, name: "Charlie" }, 1500);
		console.log("User fetched:", user);

		console.log("Fetching posts for user...");
		// Pause again until simulateFetch(posts) promise resolves (1s)
		const posts = await simulateFetch([{ title: "My First Post" }, { title: "Another Post" }], 1000);
		console.log("Posts fetched:", posts);

		console.log("Fetching comments for first post...");
		// This one will fail, and the catch block will be executed
		const comments = await simulateFetch(["Great post!", "Nice!"], 800, false);
		console.log("Comments fetched:", comments); // This line won't run if comments promise rejects
	} catch (error) {
		// Catches any rejection from an awaited Promise in the try block
		console.error("An error occurred with async/await:", error.message);
	} finally {
		console.log("Finished getUserData execution (async/await).");
	}
}

getUserData(); // Call the async function

console.log("End (Async/Await - This logs immediately while getUserData is awaiting)");

/*
 * Output (approximate):
 * Start (Async/Await)
 * End (Async/Await - This logs immediately while getUserData is awaiting)
 * Fetching user... (after 0 seconds)
 * User fetched: { id: 1, name: "Charlie" } (after ~1.5 seconds)
 * Fetching posts for user... (after ~1.5 seconds)
 * Posts fetched: [ { title: 'My First Post' }, { title: 'Another Post' } ] (after ~2.5 seconds total)
 * Fetching comments for first post... (after ~2.5 seconds total)
 * An error occurred with async/await: Network error during simulated fetch! (after ~3.3 seconds total)
 * Finished getUserData execution (async/await). (after ~3.3 seconds total)
 */

/*
 * Common Use Cases for Asynchronous JavaScript
 *
 * - Network Requests: Fetching data from APIs (using `fetch` or `XMLHttpRequest`).
 * - File I/O: Reading from or writing to files (in Node.js).
 * - Timers: `setTimeout` and `setInterval` for delayed or repeated execution.
 * - User Interface Events: Handling clicks, key presses, form submissions, etc.
 * - Database Operations: Querying or updating databases (in Node.js).
 * - Animations: Creating smooth animations without freezing the browser.
 */

/*
 * Key Takeaways
 *
 * - JavaScript is single-threaded, but it handles long-running operations
 * asynchronously to remain non-blocking.
 * - The Event Loop is the mechanism that facilitates this non-blocking
 * behavior by managing the Call Stack and task queues.
 * - Callbacks are the oldest way, prone to "callback hell" for complex flows.
 * - Promises provide a more structured way to handle asynchronous operations,
 * offering better readability and error handling through chaining `.then()`, `.catch()`.
 * - Async/Await is the modern, most readable syntax for asynchronous code,
 * building on Promises and allowing `try...catch` for error management.
 *
 * Mastering asynchronous JavaScript is crucial for any modern JavaScript developer,
 * as it's at the heart of building performant and user-friendly applications.
 */
