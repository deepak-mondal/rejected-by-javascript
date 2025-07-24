/**
 * @fileoverview Notes on "The Power of JS Generators" by Anjana Vakil.
 * This file contains explanations and code samples illustrating JavaScript Generators.
 */

/**
 * 1. Introduction to Generators and Iterators
 *
 * Iterators: An object that defines a sequence and a `next()` method.
 * The `next()` method returns an object with two properties:
 * - `value`: The next value in the sequence.
 * - `done`: A boolean indicating if the iteration is complete.
 */

console.log("--- 1. Introduction to Generators and Iterators ---");

const myIterator = {
	i: 0,
	next() {
		if (this.i < 3) {
			return { value: this.i++, done: false };
		}
		return { value: undefined, done: true };
	},
};

console.log("Iterator Example:");
console.log(myIterator.next()); // { value: 0, done: false }
console.log(myIterator.next()); // { value: 1, done: false }
console.log(myIterator.next()); // { value: 2, done: false }
console.log(myIterator.next()); // { value: undefined, done: true }

/**
 * Generators: Functions defined with `function*` that use the `yield` keyword.
 * When a generator function is called, it returns a **generator object** (an iterator).
 * `yield` pauses the function's execution and returns a value.
 * The function can be resumed later from where it left off using `next()`.
 */
function* simpleGenerator() {
	yield "Hello";
	yield "World";
	return "Done"; // The value returned by the generator when done
}

console.log("\nBasic Generator Function Example:");
const gen = simpleGenerator();
console.log(gen.next()); // { value: 'Hello', done: false }
console.log(gen.next()); // { value: 'World', done: false }
console.log(gen.next()); // { value: 'Done', done: true }
console.log(gen.next()); // { value: undefined, done: true }

/**
 * 2. Generators as Iterables
 *
 * Generator objects are both iterators and iterables. This means they automatically
 * have the `Symbol.iterator` method, allowing them to be used in `for...of` loops
 * and with the spread operator.
 */
console.log("\n--- 2. Generators as Iterables ---");

function* colorsGenerator() {
	yield "red";
	yield "green";
	yield "blue";
}

console.log("Using for...of loop with a generator:");
for (const color of colorsGenerator()) {
	console.log(color);
}
// Output:
// red
// green
// blue

console.log("\nUsing spread operator with a generator:");
const colorArray = [...colorsGenerator()];
console.log(colorArray); // ['red', 'green', 'blue']

/**
 * 3. Practical Applications of Generators
 *
 * Custom Iterable Objects: Generators simplify creating custom iterables by
 * implementing the `Symbol.iterator` method with a generator function.
 */
console.log("\n--- 3. Practical Applications of Generators ---");
console.log("Custom Iterable Objects (Card Deck Example):");

class CardDeck {
	constructor() {
		this.suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
		this.ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
	}

	// The generator function makes this class iterable
	*[Symbol.iterator]() {
		for (const suit of this.suits) {
			for (const rank of this.ranks) {
				yield `${rank} of ${suit}`;
			}
		}
	}
}

const deck = new CardDeck();
// Example of iterating (commented out to avoid logging all 52 cards)
// for (const card of deck) {
//   console.log(card);
// }
const firstFiveCards = [...deck].slice(0, 5);
console.log("First 5 cards from the deck:", firstFiveCards);
// Output: [ '2 of Hearts', '3 of Hearts', '4 of Hearts', '5 of Hearts', '6 of Hearts' ]

/**
 * Lazy Evaluation and Infinite Sequences: Generators allow you to define
 * sequences that are only computed as needed, making it possible to work with
 * potentially infinite sequences without memory issues.
 */
console.log("\nLazy Evaluation (Infinite Counter Example):");
function* infiniteCounter() {
	let i = 0;
	while (true) {
		yield i++;
	}
}

const counter = infiniteCounter();
console.log("Infinite Counter:");
console.log(counter.next().value); // 0
console.log(counter.next().value); // 1
console.log(counter.next().value); // 2
// You can keep calling next() indefinitely without exhausting memory

/**
 * Powering Animations: In environments like Observable, generators can be used
 * to produce values for animation frames.
 * (This is a conceptual example as it depends on a specific runtime environment like Observable)
 */
console.log("\nPowering Animations (Conceptual Example):");
// In an Observable notebook:
// viewof frame = Generators.frame()
// circle.radius = frame % 100 // circle radius changes with each frame
console.log("Generators can be used to drive animations by yielding values per frame.");

/**
 * Recursive Iteration with `yield*`: The `yield*` expression is used to
 * delegate to another generator or iterable. This is useful for recursive
 * data structures like trees.
 */
console.log("\nRecursive Iteration with `yield*` (Tree Traversal - Depth-First):");

function* traverse(node) {
	if (node === null) return;
	yield node.value; // Yield the current node's value
	if (node.children) {
		for (const child of node.children) {
			yield* traverse(child); // Delegate to traverse child nodes
		}
	}
}

const tree = {
	value: "A",
	children: [
		{
			value: "B",
			children: [{ value: "D" }, { value: "E" }],
		},
		{
			value: "C",
			children: [{ value: "F" }],
		},
	],
};

const treeValues = [...traverse(tree)];
console.log("Tree traversal values (Depth-First):", treeValues); // ['A', 'B', 'D', 'E', 'C', 'F']

/**
 * 4. Asynchronous Generators
 *
 * Defined with `async function*`, they allow you to `await` promises within
 * the generator and `yield` values asynchronously.
 * They are consumed with `for await...of` loops.
 */
console.log("\n--- 4. Asynchronous Generators ---");
console.log("Fetching Paginated Data (Conceptual SWAPI Example):");

// This example requires a global `fetch` function, available in browsers or Node.js with a polyfill.
async function* fetchSWAPIPages(url) {
	let nextUrl = url;
	while (nextUrl) {
		try {
			const response = await fetch(nextUrl);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			yield* data.results; // Yield all results from the current page
			nextUrl = data.next; // Get the URL for the next page
		} catch (error) {
			console.error("Error fetching data:", error);
			nextUrl = null; // Stop iteration on error
		}
	}
}

// Example usage (uncomment to run in an async context, e.g., browser console or Node.js with `type: module` and `node --experimental-fetch`)
/*
async function mainAsyncGeneratorExample() {
  console.log('Fetching Star Wars characters asynchronously...');
  let count = 0;
  for await (const person of fetchSWAPIPages('https://swapi.dev/api/people/')) {
    console.log(`Character ${++count}:`, person.name);
    if (count >= 10) break; // Limit for example purposes
  }
  console.log('Finished fetching characters.');
}
// mainAsyncGeneratorExample();
*/
console.log("Async generator example commented out. Uncomment `mainAsyncGeneratorExample()` to run.");

/**
 * 5. Generators as Data Consumers (Two-Way Communication)
 *
 * Generators can not only `yield` values out but also receive values *into* them
 * via the `next()` method's argument.
 */
console.log("\n--- 5. Generators as Data Consumers (Two-Way Communication) ---");

function* receiverGenerator() {
	console.log("Generator started");
	const received1 = yield "Send me something 1";
	console.log("Received 1:", received1);
	const received2 = yield "Send me something 2";
	console.log("Received 2:", received2);
	return "Done";
}

const receiver = receiverGenerator();
console.log("First next call (starts generator):", receiver.next()); // { value: 'Send me something 1', done: false }
console.log('Second next call (sends "First message"):', receiver.next("First message")); // { value: 'Send me something 2', done: false } (logs "Received 1: First message")
console.log('Third next call (sends "Second message"):', receiver.next("Second message")); // { value: 'Done', done: true } (logs "Received 2: Second message")

/**
 * 6. Generators as State Machines and Co-routines
 *
 * State Machines: Because generators maintain their internal state between
 * `yield` calls, they can model state transitions.
 */
console.log("\n--- 6. Generators as State Machines and Co-routines ---");
console.log("State Machine (Simple Bank Account Example):");

function* bankAccount(initialBalance) {
	let balance = initialBalance;
	while (true) {
		// Yield current balance, receive transaction object
		const transaction = yield balance;
		if (transaction && transaction.type === "deposit") {
			balance += transaction.amount;
			console.log(`Deposited ${transaction.amount}. New balance: ${balance}`);
		} else if (transaction && transaction.type === "withdraw") {
			if (balance >= transaction.amount) {
				balance -= transaction.amount;
				console.log(`Withdrew ${transaction.amount}. New balance: ${balance}`);
			} else {
				console.log("Insufficient funds!");
			}
		} else {
			console.log("Invalid transaction.");
		}
	}
}

const account = bankAccount(100);
console.log("Initial balance:", account.next().value); // Initial balance: 100
console.log("Current balance (after deposit):", account.next({ type: "deposit", amount: 50 }).value); // Deposited 50. New balance: 150. Current balance: 150
console.log("Current balance (after withdrawal):", account.next({ type: "withdraw", amount: 75 }).value); // Withdrew 75. New balance: 75. Current balance: 75
console.log("Current balance (after invalid withdrawal):", account.next({ type: "withdraw", amount: 100 }).value); // Insufficient funds! Current balance: 75
console.log("Current balance (after invalid transaction):", account.next({ type: "invalid" }).value); // Invalid transaction. Current balance: 75

/**
 * Co-routines: Generators allow for cooperative multitasking, where different
 * "routines" can pause and resume execution, passing control to each other.
 */
console.log("\nCo-routines: Generators enable cooperative multitasking.");

/**
 * 7. Actor Model and Escaping Recursion Limits
 *
 * Escaping Recursion Limits: By using generators to manage state and explicitly
 * pass control, you can avoid JavaScript's call stack limits for deep recursion.
 * This effectively flattens the call stack.
 */
console.log("\n--- 7. Actor Model and Escaping Recursion Limits ---");
console.log("Escaping Recursion Limits (Ping Pong Example):");

function* ping(n) {
	if (n > 0) {
		console.log("Ping", n);
		yield* pong(n - 1); // Delegate to pong
	}
}

function* pong(n) {
	if (n > 0) {
		console.log("Pong", n);
		yield* ping(n - 1); // Delegate back to ping
	}
}

// A simple scheduler to run the generator chain without deep recursion
function runGenerator(generator) {
	let result = generator.next();
	while (!result.done) {
		// If the yielded value is another generator, delegate to it
		if (result.value && typeof result.value.next === "function") {
			result = runGenerator(result.value); // Recursively run the sub-generator
		} else {
			result = generator.next();
		}
	}
	return result; // Return the final result of the top-level generator
}

console.log("\nRunning ping-pong with a scheduler (up to 10 iterations for demonstration):");
// To demonstrate escaping recursion limits, you'd typically use a much larger number.
// For console output, limiting to 10.
runGenerator(ping(10));
// This pattern can handle very deep "recursion" without stack overflow.

/**
 * 8. Summary and Resources
 *
 * Key Uses of Generators:
 * - Custom iterables for collections.
 * - State machines.
 * - Processing data streams.
 * - Asynchronous data loading.
 * - Understanding control flow, co-routines, and the actor model.
 *
 * Generators are a powerful and versatile feature in JavaScript that can
 * simplify complex asynchronous and iterative tasks.
 */
console.log("\n--- 8. Summary and Resources ---");
console.log("Generators are a powerful tool for managing iteration, asynchronous operations, and state.");
console.log("They enable cleaner code for complex control flows.");
console.log("For more information, refer to MDN Web Docs on Generators and Iterators.");
