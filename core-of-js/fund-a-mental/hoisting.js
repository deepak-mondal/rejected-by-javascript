/*
 * Comprehensive Guide to Hoisting in JavaScript
 *
 * Hoisting is a JavaScript mechanism where variable and function declarations
 * are moved to the top of their containing scope during the compilation phase,
 * before the code is executed.
 *
 * It's important to understand that *only the declarations* are hoisted, not the
 * initializations. This can lead to unexpected behavior if you're not aware of it.
 */

/*
 * I. Conceptual Understanding of Hoisting
 *
 * Imagine JavaScript scans your code before executing it. During this scan,
 * it picks up all `var` variable declarations and `function` declarations
 * and mentally moves them to the top of their current scope (either global
 * or function scope).
 *
 * This "moving" is purely conceptual; the code isn't physically rewritten.
 * It's how the JavaScript engine parses and interprets your code.
 */

/*
 * II. Hoisting with `var` Variables
 *
 * - `var` declarations are hoisted to the top of their nearest function scope
 * (or global scope if declared outside any function).
 * - They are initialized with `undefined` during the hoisting phase.
 * - This means you can *access* a `var` variable before it's declared,
 * but its value will be `undefined` until the line of its actual assignment is reached.
 */

console.log("--- Hoisting with `var` Variables ---");

console.log(`Value of a before declaration: ${a}`); // Output: Value of a before declaration: undefined
var a = 10;
console.log(`Value of a after declaration and assignment: ${a}`); // Output: Value of a after declaration and assignment: 10

// This is conceptually what happens:
/*
 * var a; // Declaration is hoisted and initialized to undefined
 * console.log(`Value of a before declaration: ${a}`);
 * a = 10; // Assignment remains in place
 * console.log(`Value of a after declaration and assignment: ${a}`);
 */

// Example in a function scope:
function demonstrateVarHoisting() {
	console.log(`\nInside function: Value of x before declaration: ${x}`); // Output: undefined
	var x = 20;
	console.log(`Inside function: Value of x after declaration: ${x}`); // Output: 20
}
demonstrateVarHoisting();

/*
 * III. Hoisting with `let` and `const` Variables (Temporal Dead Zone - TDZ)
 *
 * - `let` and `const` declarations are also hoisted, but they are *not* initialized
 * to `undefined`.
 * - Instead, they are placed in a "Temporal Dead Zone" (TDZ) from the start of their
 * block scope until their actual declaration line is executed.
 * - Accessing a `let` or `const` variable within the TDZ will result in a
 * `ReferenceError`. This makes them safer and less prone to unexpected behavior
 * compared to `var`.
 */

console.log("\n--- Hoisting with `let` and `const` Variables (TDZ) ---");

// Uncommenting the line below would throw a ReferenceError: Cannot access 'b' before initialization
// console.log(`Value of b before declaration: ${b}`);
let b = 30;
console.log(`Value of b after declaration and assignment: ${b}`); // Output: Value of b after declaration and assignment: 30

// Uncommenting the line below would throw a ReferenceError: Cannot access 'c' before initialization
// console.log(`Value of c before declaration: ${c}`);
const c = 40;
console.log(`Value of c after declaration and assignment: ${c}`); // Output: Value of c after declaration and assignment: 40

/*
 * This is conceptually what happens:
 *
 * // b and c are conceptually hoisted but are in TDZ here
 * // console.log(`Value of b before declaration: ${b}`); // ReferenceError
 * let b = 30; // b is initialized and exits TDZ
 * console.log(`Value of b after declaration and assignment: ${b}`);
 *
 * // console.log(`Value of c before declaration: ${c}`); // ReferenceError
 * const c = 40; // c is initialized and exits TDZ
 * console.log(`Value of c after declaration and assignment: ${c}`);
 */

/*
 * IV. Hoisting with Function Declarations
 *
 * - Function declarations are fully hoisted. This means both the function name
 * and its definition (the function body) are moved to the top of their scope.
 * - Consequently, you can call a function declaration before it appears
 * in the code.
 */

console.log("\n--- Hoisting with Function Declarations ---");

console.log(greet()); // Output: Hello from a hoisted function!

function greet() {
	return "Hello from a hoisted function!";
}

// Example with arguments:
console.log(`Sum before definition: ${addNumbers(5, 7)}`); // Output: Sum before definition: 12
function addNumbers(num1, num2) {
	return num1 + num2;
}

/*
 * This is conceptually what happens:
 *
 * function greet() {
 * return "Hello from a hoisted function!";
 * }
 * function addNumbers(num1, num2) {
 * return num1 + num2;
 * }
 *
 * console.log(greet());
 * console.log(`Sum before definition: ${addNumbers(5, 7)}`);
 */

/*
 * V. Hoisting with Function Expressions and Arrow Functions
 *
 * - Function expressions and arrow functions are assigned to variables.
 * - Their hoisting behavior follows the rules of the variable type (`var`, `let`, `const`)
 * they are assigned to.
 * - This means they are NOT fully hoisted like function declarations.
 * - You cannot call them before their variable declaration line.
 */

console.log("\n--- Hoisting with Function Expressions and Arrow Functions ---");

// Example with `var` (function expression):
// console.log(sayHiVar()); // Output: TypeError: sayHiVar is not a function (because sayHiVar is undefined at this point)
var sayHiVar = function () {
	return "Hi from a var function expression!";
};
console.log(sayHiVar()); // Output: Hi from a var function expression!

/*
 * Conceptual `var` function expression hoisting:
 *
 * var sayHiVar; // sayHiVar is hoisted and initialized to undefined
 * // console.log(sayHiVar()); // TypeError: undefined is not a function
 * sayHiVar = function() {
 * return "Hi from a var function expression!";
 * };
 * console.log(sayHiVar());
 */

// Example with `let` (function expression):
// console.log(sayHelloLet()); // ReferenceError: Cannot access 'sayHelloLet' before initialization
let sayHelloLet = function () {
	return "Hello from a let function expression!";
};
console.log(sayHelloLet()); // Output: Hello from a let function expression!

// Example with `const` (arrow function):
// console.log(multiplyArrow()); // ReferenceError: Cannot access 'multiplyArrow' before initialization
const multiplyArrow = (x, y) => x * y;
console.log(`Arrow function result: ${multiplyArrow(4, 5)}`); // Output: Arrow function result: 20

/*
 * VI. Order of Hoisting Precedence
 *
 * In cases where there are conflicts (e.g., a `var` variable and a function
 * declaration with the same name), function declarations generally take precedence
 * over variable declarations.
 */

console.log("\n--- Hoisting Precedence ---");

// Function declaration takes precedence over var declaration
var myVar = "I'm a variable";

function myVar() {
	return "I'm a function";
}

console.log(typeof myVar); // Output: function (the function declaration overwrites the var)
console.log(myVar()); // Output: I'm a function

// Note: If you assigned to myVar after the function declaration, the variable assignment would win.
// myVar = "Now I'm a string again";
// console.log(typeof myVar); // string

/*
 * VII. Best Practices and Avoiding Confusion
 *
 * - **Always declare variables at the top of their scope:** This practice,
 * even if not strictly necessary for `var` due to hoisting, makes your
 * code clearer and helps avoid confusion. It also aligns with how `let` and `const` behave.
 * - **Use `let` and `const` instead of `var`:** They have block scope and are
 * subject to the TDZ, which reduces common hoisting-related bugs and makes
 * variable declarations more predictable. `const` should be your default choice,
 * and `let` when the variable needs to be reassigned.
 * - **Declare functions before you call them:** While function declarations
 * are hoisted, explicitly defining them before their first use improves
 * code readability and makes the execution flow more intuitive.
 */

/*
 * Conclusion
 *
 * Hoisting is a crucial concept in JavaScript's compilation phase.
 * Understanding how `var`, `let`, `const`, and function declarations behave
 * in terms of hoisting (and the Temporal Dead Zone for `let`/`const`) is essential
 * for writing correct, bug-free, and predictable JavaScript code.
 * Adhering to modern best practices (using `let`/`const` and declaring everything
 * before use) largely mitigates the complexities often associated with hoisting.
 */
