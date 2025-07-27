/*
 * Comprehensive Guide to Functions in JavaScript
 *
 * Functions are fundamental building blocks in JavaScript. They are reusable
 * blocks of code that perform a specific task or calculate a value.
 * Functions allow you to organize your code, make it more modular,
 * and avoid repetition (DRY - Don't Repeat Yourself principle).
 */

/*
 * I. What is a Function?
 *
 * In JavaScript, a function is a type of object. It can be stored in a variable,
 * passed as an argument to another function, and returned from a function.
 * This makes functions "first-class citizens" in JavaScript.
 */

/*
 * II. Different Kinds of Functions in JavaScript
 */

/*
 * 1. Function Declarations (or Function Statements)
 *
 * - The most common and traditional way to define a function.
 * - Are "hoisted" to the top of their scope, meaning you can call them
 * before they are defined in the code.
 * - Syntax: `function name(parameters) { ... }`
 */

console.log("--- Function Declarations ---");

function greetDeclaration(name) {
	return `Hello, ${name}! (from a Function Declaration)`;
}

// Can be called before its definition due to hoisting
console.log(greetDeclaration("Alice"));

// Example of calling after definition
function calculateSum(a, b) {
	return a + b;
}
console.log(`Sum of 5 and 3: ${calculateSum(5, 3)}`);

/*
 * 2. Function Expressions
 *
 * - A function defined as part of an expression (e.g., assigned to a variable).
 * - Are NOT hoisted in the same way; you cannot call them before their definition
 * (this leads to a `ReferenceError`).
 * - Can be named or anonymous. Anonymous function expressions are very common.
 * - Syntax: `const name = function(parameters) { ... };`
 */

console.log("\n--- Function Expressions ---");

const greetExpression = function (name) {
	return `Hello, ${name}! (from a Function Expression)`;
};

console.log(greetExpression("Bob"));

// Named Function Expression (name only available within the function itself,
// primarily for recursion or debugging)
const factorial = function calculateFactorial(n) {
	if (n <= 1) return 1;
	return n * calculateFactorial(n - 1);
};
console.log(`Factorial of 5: ${factorial(5)}`); // 120

// Attempting to call before definition would result in an error:
// console.log(anotherGreetExpression("Charlie")); // ReferenceError: Cannot access 'anotherGreetExpression' before initialization
// const anotherGreetExpression = function(name) { return `Hello, ${name}!`; };

/*
 * 3. Arrow Functions (ES6 / ES2015)
 *
 * - A more concise syntax for writing function expressions.
 * - The main difference lies in their syntax and how they handle the `this` keyword.
 * - Are always anonymous (though they can be assigned to a variable, like expressions).
 * - Do NOT have their own `this` context (lexical `this`).
 * - Do NOT have their own `arguments` object.
 * - Cannot be used as constructors (cannot be called with `new`).
 * - Cannot be hoisted.
 * - Syntax: `(parameters) => { ... }` or `parameters => expression`
 */

console.log("\n--- Arrow Functions ---");

// Basic syntax:
const greetArrow = (name) => {
	return `Hello, ${name}! (from an Arrow Function)`;
};
console.log(greetArrow("David"));

// Concise body (implicit return for single-expression functions):
const add = (a, b) => a + b;
console.log(`Sum using arrow function: ${add(10, 20)}`);

// Single parameter (parentheses optional):
const square = (num) => num * num;
console.log(`Square of 7: ${square(7)}`);

// No parameters (empty parentheses required):
const sayHi = () => console.log("Hi there!");
sayHi();

/*
 * III. Key Differences: Arrow Functions vs. Normal Functions
 *
 * This is a crucial topic for JavaScript interviews.
 */

/*
 * 1. 'this' Binding
 *
 * - Normal Functions (Function Declarations & Expressions):
 * - Have their own `this` context.
 * - The value of `this` is determined by how the function is called.
 * - Method call: `this` refers to the object the method is called on.
 * - Simple function call: `this` refers to the global object (window in browsers, undefined in strict mode).
 * - Constructor call: `this` refers to the new instance.
 * - Explicit binding (`call`, `apply`, `bind`): `this` is set explicitly.
 *
 * - Arrow Functions:
 * - Do NOT have their own `this` context.
 * - They inherit `this` from the *enclosing lexical scope* (the scope where they are defined),
 * not where they are called.
 * - This behavior is often called "lexical `this`".
 */

console.log("\n--- 'this' Binding Differences ---");

// Example 1: `this` in Object Methods

const person = {
	name: "John",
	// Normal function as a method
	sayHelloNormal: function () {
		console.log(`Normal Function: Hello, my name is ${this.name}`);
	},
	// Arrow function as a method
	sayHelloArrow: () => {
		// 'this' here refers to the global object (window) or undefined in strict mode
		// because the arrow function inherits 'this' from its outer (global) scope
		console.log(`Arrow Function: Hello, my name is ${this.name}`);
	},
};

person.sayHelloNormal(); // Normal Function: Hello, my name is John
person.sayHelloArrow(); // Arrow Function: Hello, my name is undefined (in strict mode/Node.js) or "Window Object's name" if globalThis.name exists in browser

// Example 2: `this` with `setTimeout` (common use case)
// Problem with normal functions losing 'this' context in callbacks:
const counterNormal = {
	count: 0,
	start: function () {
		console.log("Normal function counter starting...");
		// 'this' inside setTimeout callback refers to global object, not counterNormal
		setTimeout(function () {
			// This will try to increment globalThis.count or throw error in strict mode
			// console.log(this.count++); // Would fail or act unexpectedly
			console.log("Normal function (inside setTimeout): 'this' is", this); // Will be global object
		}, 1000);
	},
};
counterNormal.start();

// Solution with arrow functions: `this` is lexically bound
const counterArrow = {
	count: 0,
	start: function () {
		// This outer function needs to be normal to get 'this' as counterArrow
		console.log("Arrow function counter starting...");
		setTimeout(() => {
			// 'this' here correctly refers to `counterArrow`
			this.count++;
			console.log(`Arrow function (inside setTimeout): Count is ${this.count}`); // Count is 1
		}, 1000);
	},
};
counterArrow.start();

/*
 * 2. 'arguments' Object
 *
 * - Normal Functions:
 * - Have an `arguments` object, which is an array-like object containing
 * all arguments passed to the function.
 * - Arrow Functions:
 * - Do NOT have their own `arguments` object.
 * - They inherit `arguments` from the nearest non-arrow parent function.
 * - If no such parent exists, `arguments` is not available.
 * - To get arguments in arrow functions, use rest parameters (`...args`).
 */

console.log("\n--- 'arguments' Object Differences ---");

function showArgsNormal() {
	console.log("Normal Function arguments:", arguments);
}
showArgsNormal(1, 2, 3); // Normal Function arguments: [Arguments] { '0': 1, '1': 2, '2': 3 }

const showArgsArrow = (...args) => {
	// Use rest parameters
	console.log("Arrow Function (using rest parameters):", args);
	// console.log("Arrow Function (direct arguments object):", arguments); // ReferenceError: arguments is not defined
};
showArgsArrow(4, 5, 6); // Arrow Function (using rest parameters): [ 4, 5, 6 ]

// Arrow function inheriting arguments from a parent normal function
function outerNormalFunction() {
	const innerArrowFunction = () => {
		console.log("Arrow function inheriting arguments:", arguments); // Inherits from outerNormalFunction
	};
	innerArrowFunction();
}
outerNormalFunction(7, 8, 9); // Arrow function inheriting arguments: [Arguments] { '0': 7, '1': 8, '2': 9 }

/*
 * 3. Constructor Capabilities (`new` keyword)
 *
 * - Normal Functions:
 * - Can be used as constructors with the `new` keyword to create new objects.
 * - When called with `new`, they create a new `this` context, set `this` to the new object,
 * and implicitly return `this`.
 * - Arrow Functions:
 * - Cannot be used as constructors.
 * - Calling an arrow function with `new` will throw a `TypeError`.
 */

console.log("\n--- Constructor Capabilities Differences ---");

function PersonNormal(name) {
	this.name = name;
}
const p1 = new PersonNormal("Charlie");
console.log(`Normal Function as Constructor: ${p1.name}`); // Normal Function as Constructor: Charlie

const PersonArrow = (name) => {
	this.name = name;
};
// Uncommenting the line below would throw a TypeError: PersonArrow is not a constructor
// const p2 = new PersonArrow("Diana");
// console.log(`Arrow Function as Constructor: ${p2.name}`);

/*
 * 4. Hoisting
 *
 * - Function Declarations:
 * - Fully hoisted. Can be called before they are defined in the code.
 * - Function Expressions & Arrow Functions:
 * - Not hoisted in the same way. They behave like variable declarations (let/const),
 * meaning they are only accessible after their definition.
 */

console.log("\n--- Hoisting Differences ---");

// Hoisting example for Function Declaration (already shown above)
// console.log(greetDeclaration("Hoisted!")); // Works

// Hoisting example for Function Expression / Arrow Function
// console.log(notHoistedExpression()); // ReferenceError: Cannot access 'notHoistedExpression' before initialization
// const notHoistedExpression = function() { return "I'm a function expression"; };

// console.log(notHoistedArrow()); // ReferenceError: Cannot access 'notHoistedArrow' before initialization
// const notHoistedArrow = () => "I'm an arrow function";

/*
 * 5. Implicit Return (Arrow Functions only)
 *
 * - Arrow Functions:
 * - If the function body consists of a single expression, you can omit
 * the curly braces `{}` and the `return` keyword. The expression's
 * result will be implicitly returned.
 * - Normal Functions:
 * - Always require an explicit `return` keyword to return a value,
 * even for single-line bodies.
 */

console.log("\n--- Implicit Return (Arrow Functions) ---");

// Arrow function with implicit return
const multiply = (a, b) => a * b;
console.log(`Implicit return: 4 * 6 = ${multiply(4, 6)}`);

// Arrow function returning an object implicitly (must wrap in parentheses)
const createObject = (key, value) => ({ [key]: value });
console.log("Implicit object return:", createObject("name", "Eve"));

// Normal function requires explicit return
function divide(a, b) {
	return a / b;
}
console.log(`Explicit return: 10 / 2 = ${divide(10, 2)}`);

/*
 * IV. Other Types of Functions / Function Patterns
 */

/*
 * 1. Immediately Invoked Function Expressions (IIFEs)
 *
 * - Functions that run as soon as they are defined.
 * - Used to create a private scope for variables, preventing global pollution.
 * - Syntax: `(function() { ... })()` or `(() => { ... })()`
 */
console.log("\n--- Immediately Invoked Function Expressions (IIFEs) ---");
(function () {
	const privateVar = "I'm private!";
	console.log(`IIFE says: ${privateVar}`);
})();

// console.log(privateVar); // ReferenceError: privateVar is not defined

/*
 * 2. Generator Functions (ES6)
 *
 * - Functions that can be paused and resumed, producing a sequence of values.
 * - Use the `function*` syntax and the `yield` keyword.
 */
console.log("\n--- Generator Functions ---");
function* idGenerator() {
	let id = 1;
	while (true) {
		yield id++;
	}
}
const gen = idGenerator();
console.log(`Generated ID 1: ${gen.next().value}`);
console.log(`Generated ID 2: ${gen.next().value}`);

/*
 * V. When to Use Which Type?
 *
 * - Function Declarations:
 * - For general-purpose, named functions that you want to be hoisted
 * and callable from anywhere in their scope (e.g., utility functions, event handlers).
 * - Function Expressions:
 * - When you need to pass a function as an argument, define it conditionally,
 * or use it in IIFEs.
 * - Arrow Functions:
 * - For concise, short functions, especially as callbacks in array methods
 * (`map`, `filter`, `reduce`), event listeners, or anywhere `this`
 * binding behavior is desired (lexical `this`).
 * - Avoid for object methods if you need `this` to refer to the object itself.
 * - Avoid for constructors.
 */

/*
 * Conclusion
 *
 * Understanding the different types of functions and, especially, the nuances
 * between arrow and normal functions is critical for writing correct,
 * readable, and maintainable JavaScript code. Choose the right function type
 * for the right job!
 */
