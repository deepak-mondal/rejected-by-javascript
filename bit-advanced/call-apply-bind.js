/*
 * Comprehensive Guide to `call`, `apply`, and `bind` in JavaScript
 *
 * In JavaScript, `call`, `apply`, and `bind` are three essential methods
 * available on all `Function.prototype` objects. Their primary purpose is to
 * explicitly control the `this` keyword within a function, and in the case of
 * `call` and `apply`, to immediately invoke the function.
 */

/*
 * I. The Problem They Solve: Understanding `this`
 *
 * The `this` keyword in JavaScript is notoriously tricky because its value
 * is determined dynamically at runtime, based on *how a function is called*,
 * not where it is defined.
 *
 * Typical `this` binding rules:
 * - Global context: `this` refers to the global object (`window` in browsers, `global` in Node.js).
 * - Method call: `this` refers to the object the method is called on.
 * - Constructor call (`new` keyword): `this` refers to the new instance being created.
 * - Event handlers: `this` often refers to the element that fired the event.
 * - Arrow functions: `this` is lexically scoped (inherits `this` from the enclosing scope).
 *
 * `call`, `apply`, and `bind` allow you to explicitly *set* the value of `this`
 * for a function, overriding the default binding rules.
 */

/*
 * II. `call()` Method
 *
 * Definition: The `call()` method calls a function with a given `this` value
 * and arguments provided individually.
 *
 * Syntax: `func.call(thisArg, arg1, arg2, ...)`
 * - `thisArg`: The value of `this` provided for the call to `func`.
 * If `null` or `undefined`, `this` will default to the global object.
 * (In strict mode, `this` will actually be `undefined` if `null` or `undefined` is passed).
 * - `arg1, arg2, ...`: Arguments to be passed to the function, provided one by one.
 *
 * Key Feature: Invokes the function *immediately*.
 */
console.log("--- `call()` Method ---");

// Basic Example: Setting `this` explicitly
const person = {
	name: "Alice",
	greet: function (city, job) {
		console.log(`Hello, my name is ${this.name}, I live in ${city} and I'm a ${job}.`);
	},
};

const anotherPerson = {
	name: "Bob",
};

person.greet("New York", "Engineer"); // Default binding: `this` is `person`

// Using `call()` to borrow `greet` and set `this` to `anotherPerson`
person.greet.call(anotherPerson, "London", "Designer");
// Output: Hello, my name is Bob, I live in London and I'm a Designer.

// Example: `this` in a global function and strict mode
function showThis() {
	console.log("`this` in showThis:", this);
}

showThis(); // `this` will be `window` (browser) or `global` (Node.js) in non-strict mode

// Using call to explicitly set `this`
showThis.call({ custom: "object" }); // `this` will be `{ custom: "object" }`
showThis.call(null); // `this` will be `window`/`global` in non-strict, `null` in strict mode
showThis.call(undefined); // `this` will be `window`/`global` in non-strict, `undefined` in strict mode

/*
 * Advanced Example 1: Function Borrowing
 *
 * You can "borrow" methods from other objects (or even prototypes) and use them
 * for your own objects. This is powerful for leveraging existing utility functions.
 */
console.log("\n--- `call()` Advanced Example 1: Function Borrowing ---");

const car = {
	brand: "Toyota",
	model: "Camry",
};

const motorcycle = {
	brand: "Honda",
	model: "CBR",
};

function getVehicleInfo() {
	// This function doesn't live on `car` or `motorcycle` directly,
	// but it expects `this` to have `brand` and `model` properties.
	return `This is a ${this.brand} ${this.model}.`;
}

console.log(getVehicleInfo.call(car)); // Output: This is a Toyota Camry.
console.log(getVehicleInfo.call(motorcycle)); // Output: This is a Honda CBR.

// Borrowing a method from Array.prototype for an array-like object
const args = {
	0: "apple",
	1: "banana",
	length: 2,
};

// We want to use Array.prototype.join on `args` (which is not a real array)
const fruits = Array.prototype.join.call(args, " & ");
console.log(`Joined fruits: ${fruits}`); // Output: Joined fruits: apple & banana

/*
 * Advanced Example 2: Chaining Constructors (Less common with ES6 classes)
 *
 * Before ES6 classes and `super()`, `call` was commonly used to chain
 * constructors in pseudo-classical inheritance.
 */
console.log("\n--- `call()` Advanced Example 2: Chaining Constructors (Historical) ---");

function Product(name, price) {
	this.name = name;
	this.price = price;
}

function Book(name, price, author) {
	// Call the Product constructor to initialize name and price on the new Book instance
	Product.call(this, name, price); // `this` inside Product will be the new Book instance
	this.author = author;
}

const myBook = new Book("The JavaScript Way", 25.99, "Jeremy Author");
console.log(`Book: ${myBook.name}, Price: $${myBook.price}, Author: ${myBook.author}`);
// Output: Book: The JavaScript Way, Price: $25.99, Author: Jeremy Author

/*
 * III. `apply()` Method
 *
 * Definition: The `apply()` method calls a function with a given `this` value
 * and arguments provided as an array (or an array-like object).
 *
 * Syntax: `func.apply(thisArg, [argsArray])`
 * - `thisArg`: Same as in `call()`.
 * - `[argsArray]`: An array or array-like object (e.g., `arguments` object)
 * whose elements are passed as individual arguments to the function.
 *
 * Key Feature: Invokes the function *immediately*. The main difference from `call`
 * is how arguments are passed.
 */
console.log("\n--- `apply()` Method ---");

// Basic Example: Setting `this` with arguments as an array
const customer = {
	name: "Charlie",
	order: function (item1, item2, item3) {
		console.log(`${this.name} ordered: ${item1}, ${item2}, and ${item3}.`);
	},
};

const waiter = {
	name: "Daisy",
};

const orderItems = ["Coffee", "Sandwich", "Cake"];

// Using `apply()` to borrow `order` and pass arguments from an array
customer.order.apply(waiter, orderItems);
// Output: Daisy ordered: Coffee, Sandwich, and Cake.

/*
 * Advanced Example 1: Using `Math.max()`/`Math.min()` on an Array
 *
 * This is a classic use case for `apply()` because `Math.max()` and `Math.min()`
 * expect individual arguments, not an array.
 */
console.log("\n--- `apply()` Advanced Example 1: `Math.max()`/`Math.min()` ---");

const numbers = [10, 5, 20, 15, 30];

// `Math.max` expects arguments like `Math.max(10, 5, 20, ...)`
// `apply` spreads the array elements as individual arguments.
const maxNumber = Math.max.apply(null, numbers); // `this` (null) doesn't matter for Math functions
const minNumber = Math.min.apply(null, numbers);

console.log(`Max number: ${maxNumber}`); // Output: Max number: 30
console.log(`Min number: ${minNumber}`); // Output: Min number: 5

// Note: With ES6 spread syntax, this is now often simpler:
const maxNumberES6 = Math.max(...numbers);
console.log(`Max number (ES6 spread): ${maxNumberES6}`);

/*
 * Advanced Example 2: Appending Elements to an Array
 *
 * You can append all elements of one array to another using `push.apply()`.
 */
console.log("\n--- `apply()` Advanced Example 2: Appending Arrays ---");

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Array.prototype.push.apply(arr1, arr2) is equivalent to arr1.push(4, 5, 6)
Array.prototype.push.apply(arr1, arr2);
console.log(`Combined array using apply: ${arr1}`); // Output: Combined array using apply: 1,2,3,4,5,6

// Note: With ES6 spread syntax, this is also often simpler:
// arr1.push(...arr2);
// Or create new array: const combinedArr = [...arr1, ...arr2];

/*
 * Advanced Example 3: Handling Dynamic Arguments
 *
 * When a function needs to accept a dynamic number of arguments and you want
 * to pass them to another function that expects individual arguments (e.g., in a wrapper).
 */
console.log("\n--- `apply()` Advanced Example 3: Dynamic Arguments ---");

function logArguments(arg1, arg2, arg3) {
	console.log(`Individual arguments: ${arg1}, ${arg2}, ${arg3}`);
}

function dynamicWrapper() {
	// `arguments` is an array-like object. `apply` can handle it.
	console.log("Wrapping call with apply:");
	logArguments.apply(this, arguments); // `this` is passed through, arguments are spread
}

dynamicWrapper("alpha", "beta", "gamma");
// Output: Individual arguments: alpha, beta, gamma

/*
 * IV. `bind()` Method
 *
 * Definition: The `bind()` method creates a new function that, when called,
 * has its `this` keyword set to the provided value, with a given sequence
 * of arguments preceding any provided when the new function is called.
 *
 * Syntax: `func.bind(thisArg, arg1, arg2, ...)`
 * - `thisArg`: The value of `this` for the new function.
 * - `arg1, arg2, ...`: Arguments to prepend to the arguments provided to the
 * newly bound function. This enables "partial application" or "currying."
 *
 * Key Feature: Returns a *new function*. It does *not* invoke the original function immediately.
 */
console.log("\n--- `bind()` Method ---");

// Basic Example: Permanently binding `this`
const presenter = {
	name: "Eve",
	introduce: function () {
		console.log(`Hello, I'm ${this.name}.`);
	},
};

// Default call
presenter.introduce(); // Output: Hello, I'm Eve.

// Store `introduce` in a variable, `this` will be lost in global context
const standaloneIntroduce = presenter.introduce;
// standaloneIntroduce(); // Output: Hello, I'm undefined. (or "Hello, I'm Window/GlobalObject")

// Create a new bound function
const boundIntroduce = presenter.introduce.bind(presenter);
boundIntroduce(); // Output: Hello, I'm Eve. (`this` is permanently bound to `presenter`)

/*
 * Advanced Example 1: Binding `this` in Event Listeners
 *
 * This is one of the most common and practical uses of `bind()`.
 * Event listener callbacks often have `this` bound to the element firing the event.
 * If your callback is an object method, you need to bind `this` to the object.
 */
console.log("\n--- `bind()` Advanced Example 1: Event Listeners (Conceptual) ---");

// This is conceptual for a browser environment.
/*
const appController = {
  count: 0,
  button: null, // Assume this is a DOM button element

  init: function() {
    this.button = document.getElementById('myButton');
    if (this.button) {
      // Problem: `this` inside handleClick would refer to the button, not `appController`.
      // this.button.addEventListener('click', this.handleClick);

      // Solution with `bind`: create a new function where `this` is always `appController`.
      this.button.addEventListener('click', this.handleClick.bind(this));
      console.log("Event listener attached with bound `this`.");
    }
  },

  handleClick: function() {
    this.count++;
    console.log(`Button clicked! Count: ${this.count}`); // `this` correctly refers to `appController`
  }
};

// appController.init(); // Call this to initialize in a browser environment
*/

/*
 * Advanced Example 2: Binding `this` in `setTimeout` callbacks
 *
 * Similar to event listeners, `setTimeout` callbacks execute in the global
 * context by default, losing the `this` context of the object that scheduled them.
 */
console.log("\n--- `bind()` Advanced Example 2: `setTimeout` Callbacks ---");

const logger = {
	message: "Hello from logger!",
	logMessage: function () {
		console.log(this.message);
	},
	delayedLog: function () {
		console.log("Scheduling delayed log...");
		// `this` inside `setTimeout` will be `window`/`global` if not bound.
		setTimeout(this.logMessage.bind(this), 1000); // Bind `this` to `logger`
	},
};

logger.delayedLog(); // Output: (after 1 second) Hello from logger!

/*
 * Advanced Example 3: Partial Application / Currying
 *
 * `bind()` can also pre-set some arguments of a function, creating a new
 * function with fewer parameters. This is known as partial application or currying.
 */
console.log("\n--- `bind()` Advanced Example 3: Partial Application / Currying ---");

function multiply(a, b) {
	return a * b;
}

// Create a new function `double` that always has `a` set to 2.
const double = multiply.bind(null, 2); // `null` for `thisArg` if `this` is not used in `multiply`

console.log(`Double of 5: ${double(5)}`); // Output: Double of 5: 10
console.log(`Double of 10: ${double(10)}`); // Output: Double of 10: 20

function greetUser(greeting, user) {
	return `${greeting}, ${user}!`;
}

const sayHello = greetUser.bind(null, "Hello");
const sayHi = greetUser.bind(null, "Hi");

console.log(sayHello("Frank")); // Output: Hello, Frank!
console.log(sayHi("Grace")); // Output: Hi, Grace!

/*
 * V. Key Differences Summary
 *
 * | Feature            | `call()`                     | `apply()`                      | `bind()`                           |
 * |--------------------|------------------------------|--------------------------------|------------------------------------|
 * | **Invocation** | Immediately invokes function | Immediately invokes function   | Returns a new function (does not invoke) |
 * | **Arguments** | Passed individually          | Passed as an array (or array-like) | Passed individually (for pre-setting) |
 * | **`this` Binding** | Sets `this` for *this* call  | Sets `this` for *this* call    | Permanently binds `this` for the new function |
 * | **Return Value** | Result of the function call  | Result of the function call    | A new function                     |
 */

/*
 * VI. When to Use Which?
 *
 * - Use `call()`:
 * - When you want to immediately execute a function and you have the arguments
 * individually ready.
 * - For simple function borrowing.
 * - When chaining constructors in older inheritance patterns.
 *
 * - Use `apply()`:
 * - When you want to immediately execute a function and you have the arguments
 * already in an array or array-like object.
 * - Classic use case: `Math.max.apply(null, anArray)`.
 * - When working with the `arguments` object in a wrapper function.
 *
 * - Use `bind()`:
 * - When you need to create a *new function* with a specific `this` context
 * that will be called later (e.g., as an event listener, a timer callback).
 * - For partial application (pre-setting some arguments).
 * - In React class components' constructor to bind `this` to methods (historical,
 * less common with modern React/arrow functions).
 */

/*
 * Conclusion
 *
 * `call`, `apply`, and `bind` are powerful tools for managing the `this` context
 * in JavaScript and for enhancing function reusability. Understanding their
 * nuances, especially how they handle arguments and invocation, is fundamental
 * for writing robust and flexible JavaScript applications.
 */
