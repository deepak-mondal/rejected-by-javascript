/**
 * Type Coercion in JavaScript
 * * Type coercion is the automatic or implicit conversion of values from one data type to another.
 * It happens automatically in some cases (implicit coercion) and can be done manually
 * by the developer (explicit coercion).
 * * Implicit coercion can lead to unexpected results, so it's often a best practice to
 * use explicit coercion and the strict equality operator (===) to prevent bugs.
 */

// --- Basic Examples of Implicit Coercion ---

/**
 * 1. String and Number Coercion
 * * The `+` operator performs string concatenation if one of the operands is a string.
 * For other arithmetic operators (`-`, `*`, `/`), JavaScript tries to convert
 * the non-number values to a number.
 */

console.log("--- String and Number Coercion ---");

let result1 = 5 + "5"; // '55' (number 5 is coerced to string '5')
console.log(`5 + "5" = ${result1}, type: ${typeof result1}`);

let result2 = "10" - 5; // 5 (string '10' is coerced to number 10)
console.log(`"10" - 5 = ${result2}, type: ${typeof result2}`);

let result3 = "10" * 2; // 20 (string '10' is coerced to number 10)
console.log(`"10" * 2 = ${result3}, type: ${typeof result3}`);

let result4 = "10" - "five"; // NaN (Not a Number)
console.log(`"10" - "five" = ${result4}, type: ${typeof result4}`);

console.log("\n");

/**
 * 2. Loose Equality (`==`)
 * * The `==` operator performs type coercion before comparison. This can cause
 * unexpected results and is why the strict equality operator (`===`) is preferred.
 */

console.log("--- Loose Equality (`==`) ---");

console.log(`5 == "5" is ${5 == "5"}`); // true (string '5' is coerced to number 5)
console.log(`true == 1 is ${true == 1}`); // true (number 1 is coerced to boolean true)
console.log(`false == 0 is ${false == 0}`); // true (number 0 is coerced to boolean false)
console.log(`null == undefined is ${null == undefined}`); // true

console.log("\n");

/**
 * 3. Boolean Coercion
 * * In logical contexts (like `if` statements), values are coerced to booleans.
 * The following are "falsy": `false`, `0`, `-0`, `""`, `null`, `undefined`, `NaN`.
 * All other values are "truthy".
 */

console.log("--- Boolean Coercion ---");

let myString = "hello";
if (myString) {
	console.log(`The string "${myString}" is truthy.`);
}

let myNumber = 0;
if (myNumber) {
	console.log(`The number ${myNumber} is truthy.`);
} else {
	console.log(`The number ${myNumber} is falsy.`);
}

console.log("\n");

// --- Advanced Example: The `ToPrimitive` Operation ---

/**
 * When an object is involved in a coercion, JavaScript uses the `ToPrimitive`
 * operation. This checks for special methods on the object:
 * - `Symbol.toPrimitive`: If it exists, it takes precedence.
 * - `valueOf()`: Used for number-related coercion.
 * - `toString()`: Used for string-related coercion.
 */

console.log("--- Advanced Example with Custom Object ---");

let user = {
	name: "Alice",
	age: 30,

	// Custom method for string coercion
	toString() {
		return this.name;
	},

	// Custom method for number coercion
	valueOf() {
		return this.age;
	},
};

console.log(`"User: " + user => "User: ${user}"`); // toString() is called
console.log(`10 + user => ${10 + user}`); // valueOf() is called
console.log(`user == 30 => ${user == 30}`); // valueOf() is called for loose equality

console.log("\n");

// --- Explicit Coercion: Best Practices ---

/**
 * Explicit coercion is when you manually convert a value's type. This makes
 * your code predictable and easier to debug.
 */

console.log("--- Explicit Coercion ---");

// 1. To a Number
console.log("To a Number:");
let strNum = "123.45";
console.log(`Number("${strNum}") = ${Number(strNum)}`);
console.log(`parseInt("${strNum}") = ${parseInt(strNum)}`);
console.log(`parseFloat("${strNum}") = ${parseFloat(strNum)}`);
console.log(`+"${strNum}" (unary plus) = ${+strNum}`);

console.log("\n");

// 2. To a String
console.log("To a String:");
let num = 100;
console.log(`String(${num}) = ${String(num)}`);
console.log(`${num}.toString() = ${num.toString()}`);
console.log(`Template literal: \`${num}\` = ${`${num}`}`);

console.log("\n");

// 3. To a Boolean
console.log("To a Boolean:");
let myVariable = "hello";
console.log(`Boolean("${myVariable}") = ${Boolean(myVariable)}`);
console.log(`!!"${myVariable}" (double negation) = ${!!myVariable}`);

let emptyVar = null;
console.log(`Boolean(${emptyVar}) = ${Boolean(emptyVar)}`);
console.log(`!!${emptyVar} = ${!!emptyVar}`);
