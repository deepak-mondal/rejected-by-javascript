/**
 * @file Masterclass on Prototypes in JavaScript
 *
 * This file provides a detailed breakdown of how prototypes work in JavaScript,
 * covering fundamental concepts, inheritance mechanisms, and best practices.
 *
 * To run this file:
 * Node.js: `node filename.js`
 * Browser: Include it in an HTML file with `<script src="filename.js"></script>`
 */

console.log("--- Masterclass: Prototypes in JavaScript ---");
console.log("-------------------------------------------\n");

/**
 * Introduction: The "Spirit" of Objects
 *
 * JavaScript is a "prototype-based" language. Objects inherit properties and
 * methods directly from other objects (their "prototypes").
 * A prototype acts as a blueprint or shared characteristic set.
 * If a property/method isn't on an object, JavaScript looks it up in its prototype,
 * then that prototype's prototype, forming a "prototype chain."
 */
console.log("1. The Basics: Every Object Has a Prototype");
console.log("-------------------------------------------\n");

// Almost every JavaScript object has a prototype.
// Exception: Objects created with Object.create(null).

// How to access an object's prototype:
// - __proto__ (Deprecated but useful for understanding): Non-standard, but widely implemented.
// - Object.getPrototypeOf(obj) (Standard and Recommended): Returns the prototype of the specified object.

const myObject = {}; // A plain object literal

console.log("myObject.__proto__:", myObject.__proto__);
console.log("Object.getPrototypeOf(myObject):", Object.getPrototypeOf(myObject));

// They both point to the same object:
console.log(
	"myObject.__proto__ === Object.getPrototypeOf(myObject):",
	myObject.__proto__ === Object.getPrototypeOf(myObject)
);

console.log("\n-------------------------------------------\n");

/**
 * 2. The Prototype Chain: The Lookup Mechanism
 *
 * When accessing a property/method:
 * 1. Direct Property: Checks if property exists directly on the object.
 * 2. Prototype Lookup: If not found, looks at the object's prototype.
 * 3. Up the Chain: If still not found, looks at the prototype's prototype, and so on.
 * 4. null: Continues until it reaches a prototype that is null. If not found, returns `undefined`.
 */
console.log("2. The Prototype Chain: The Lookup Mechanism");
console.log("-------------------------------------------\n");

const protoA = {
	a: 1,
	getA() {
		return this.a;
	},
};

const protoB = {
	b: 2,
	getB() {
		return this.b;
	},
};
// Set protoB's prototype to protoA.
// This is generally discouraged for performance in hot code paths, better to set at creation.
Object.setPrototypeOf(protoB, protoA);

const myObj = {
	c: 3,
	getC() {
		return this.c;
	},
};
// Set myObj's prototype to protoB.
Object.setPrototypeOf(myObj, protoB);

console.log("myObj.c (direct):", myObj.c); // 3 (found directly on myObj)
console.log("myObj.b (inherited from protoB):", myObj.b); // 2 (found on protoB)
console.log("myObj.a (inherited from protoA):", myObj.a); // 1 (found on protoA)
console.log("myObj.d (not found):", myObj.d); // undefined (not found anywhere in the chain)

console.log("myObj.getA() (method from protoA):", myObj.getA()); // 1 (method found on protoA, 'this' context works correctly)
console.log("myObj.getB() (method from protoB):", myObj.getB()); // 2 (method found on protoB)
console.log("myObj.getC() (method from myObj):", myObj.getC()); // 3 (method found on myObj)

console.log("Visualizing the chain: myObj -> protoB -> protoA -> Object.prototype -> null");

console.log("\n-------------------------------------------\n");

/**
 * 3. Object.prototype: The Grand Parent
 *
 * Object.prototype is the base of almost all prototype chains.
 * Methods like toString(), hasOwnProperty(), etc., are available on virtually every object.
 */
console.log("3. Object.prototype: The Grand Parent");
console.log("-------------------------------------------\n");

const arr = [];
const str = "hello";
const num = 123;
const func = () => {};

console.log("Object.getPrototypeOf(arr) === Array.prototype:", Object.getPrototypeOf(arr) === Array.prototype);
console.log("Object.getPrototypeOf(str) === String.prototype:", Object.getPrototypeOf(str) === String.prototype);
console.log("Object.getPrototypeOf(num) === Number.prototype:", Object.getPrototypeOf(num) === Number.prototype);
console.log("Object.getPrototypeOf(func) === Function.prototype:", Object.getPrototypeOf(func) === Function.prototype);

// And they all ultimately chain to Object.prototype:
console.log(
	"Object.getPrototypeOf(Array.prototype) === Object.prototype:",
	Object.getPrototypeOf(Array.prototype) === Object.prototype
);
console.log(
	"Object.getPrototypeOf(String.prototype) === Object.prototype:",
	Object.getPrototypeOf(String.prototype) === Object.prototype
);
console.log(
	"Object.getPrototypeOf(Number.prototype) === Object.prototype:",
	Object.getPrototypeOf(Number.prototype) === Object.prototype
);
console.log(
	"Object.getPrototypeOf(Function.prototype) === Object.prototype:",
	Object.getPrototypeOf(Function.prototype) === Object.prototype
);
console.log("Object.getPrototypeOf(Object.prototype):", Object.getPrototypeOf(Object.prototype)); // null (the end of the chain)

console.log("\n-------------------------------------------\n");

/**
 * 4. Setting Prototypes: How Inheritance is Established
 */
console.log("4. Setting Prototypes: How Inheritance is Established");
console.log("-------------------------------------------\n");

// --- 4.1. Object.create(proto) ---
console.log("--- 4.1. Object.create(proto) ---");
const animal = {
	isAlive: true,
	speak() {
		console.log("Animal sound!");
	},
};

const dog = Object.create(animal); // dog's prototype is 'animal'
dog.breed = "Golden Retriever";
dog.speak = function () {
	// This method shadows 'animal.speak'
	console.log("Woof!");
};

console.log("dog.isAlive (inherited):", dog.isAlive);
console.log("dog.speak() (own method shadowing):");
dog.speak();
console.log("\n");

// --- 4.2. Constructor Functions (.prototype property) ---
console.log("--- 4.2. Constructor Functions (.prototype property) ---");
function Person(name) {
	this.name = name; // Own property
}

// Add a method to the Person's prototype.
// All instances created with 'new Person()' will inherit this method.
Person.prototype.greet = function () {
	console.log(`Hello, my name is ${this.name}`);
};

const alice = new Person("Alice");
const bob = new Person("Bob");

console.log("alice.greet():");
alice.greet();
console.log("bob.greet():");
bob.greet();

console.log("Object.getPrototypeOf(alice) === Person.prototype:", Object.getPrototypeOf(alice) === Person.prototype);
console.log("alice.hasOwnProperty('name'):", alice.hasOwnProperty("name")); // true (own property)
console.log("alice.hasOwnProperty('greet'):", alice.hasOwnProperty("greet")); // false (inherited)
console.log("\n");

// --- 4.3. ES6 class Syntax ---
console.log("--- 4.3. ES6 class Syntax ---");
class AnimalClass {
	// Using AnimalClass to avoid name collision with 'animal' object
	constructor(name) {
		this.name = name;
	}
	speak() {
		console.log(`${this.name} makes a sound.`);
	}
}

class DogClass extends AnimalClass {
	// 'extends' sets up the prototype chain
	constructor(name, breed) {
		super(name); // Calls AnimalClass's constructor
		this.breed = breed;
	}
	speak() {
		// Overrides AnimalClass's speak method
		console.log(`${this.name} (${this.breed}) barks!`);
	}
	fetch() {
		console.log(`${this.name} fetches the ball.`);
	}
}

const myDogClass = new DogClass("Buddy", "Labrador");
console.log("myDogClass.speak():");
myDogClass.speak();
console.log("myDogClass.fetch():");
myDogClass.fetch();
console.log("myDogClass.name:", myDogClass.name);

console.log(
	"Object.getPrototypeOf(DogClass.prototype) === AnimalClass.prototype:",
	Object.getPrototypeOf(DogClass.prototype) === AnimalClass.prototype
);
console.log("\n");

// --- 4.4. Object.setPrototypeOf(obj, proto) ---
console.log("--- 4.4. Object.setPrototypeOf(obj, proto) ---");
// Generally discouraged for performance reasons in hot code paths.
const obj1 = { val: 1 };
const obj2 = { val: 2 };

Object.setPrototypeOf(obj2, obj1); // obj2 now inherits from obj1

console.log("obj2.val (own property takes precedence):", obj2.val);
console.log("obj2.otherProp (before addition to proto):", obj2.otherProp);
obj1.otherProp = "Hello";
console.log("obj2.otherProp (after addition to proto):", obj2.otherProp);

console.log("\n-------------------------------------------\n");

/**
 * 5. `this` Context and Prototypes
 *
 * When a method is called on an object, `this` inside that method refers to the object
 * *on which the method was called*, regardless of where the method is found in the prototype chain.
 */
console.log("5. `this` Context and Prototypes");
console.log("-------------------------------------------\n");

const personProto = {
	greet() {
		console.log(`Hello, my name is ${this.name}`);
	},
};

const john = Object.create(personProto);
john.name = "John";
console.log("john.greet():");
john.greet(); // 'this' inside greet refers to 'john', so it finds john.name

const jane = {
	name: "Jane",
};
Object.setPrototypeOf(jane, personProto);
console.log("jane.greet():");
jane.greet(); // 'this' inside greet refers to 'jane', so it finds jane.name

console.log("\n-------------------------------------------\n");

/**
 * 6. Property Assignment and Shadowing
 *
 * When you assign a property to an object that already has a property with the same name
 * higher up in its prototype chain, the object creates its *own* property.
 * This is called **shadowing** or **masking**.
 * The inherited property is not changed.
 */
console.log("6. Property Assignment and Shadowing");
console.log("-------------------------------------------\n");

const vehicle = {
	wheels: 4,
	move() {
		console.log("Moving!");
	},
};

const car = Object.create(vehicle);
console.log("car.wheels (inherited):", car.wheels);

car.wheels = 2; // Assigning 'wheels' to 'car' creates an OWN property on 'car'
console.log("car.wheels (car's own property):", car.wheels);
console.log("vehicle.wheels (vehicle's property is unchanged):", vehicle.wheels);

console.log("car.move():");
car.move(); // Moving! (still inherited)

console.log("\n-------------------------------------------\n");

/**
 * 7. `hasOwnProperty()` vs. Property Access
 *
 * `hasOwnProperty()` (inherited from `Object.prototype`) determines if a property is
 * *directly* on an object, rather than inherited.
 */
console.log("7. `hasOwnProperty()` vs. Property Access");
console.log("-------------------------------------------\n");

const parent = { a: 1 };
const child = Object.create(parent);
child.b = 2;

console.log("child.a:", child.a); // 1
console.log("child.b:", child.b); // 2

console.log("child.hasOwnProperty('a'):", child.hasOwnProperty("a")); // false (inherited)
console.log("child.hasOwnProperty('b'):", child.hasOwnProperty("b")); // true (own property)
console.log("parent.hasOwnProperty('a'):", parent.hasOwnProperty("a")); // true (parent's own property)

console.log("\n-------------------------------------------\n");

/**
 * 8. Common Prototype Use Cases and Anti-Patterns
 */
console.log("8. Common Prototype Use Cases and Anti-Patterns");
console.log("-------------------------------------------\n");

console.log("--- Use Cases ---");
console.log("- Code Reusability: Share methods and properties efficiently.");
console.log("- Performance: Storing methods on the prototype saves memory per instance.");
console.log("- Inheritance: Establish relationships between objects.");
console.log("\n");

console.log("--- Anti-Patterns (Things to avoid or be cautious about) ---");
console.log("- Modifying `Object.prototype` (Prototype Pollution):");
console.log(
	"  - NEVER extend `Object.prototype` directly. It's a security vulnerability (prototype pollution) and can cause unexpected behavior."
);
console.log("- Modifying built-in prototypes (e.g., `Array.prototype`, `String.prototype`):");
console.log("  - Can lead to 'monkey patching' issues, conflicts, and unexpected behavior.");
console.log("  - Prefer utility functions or extending specific instances if needed.");
console.log("- Using `__proto__` for setting prototypes in production:");
console.log("  - While useful for learning, `Object.setPrototypeOf()` or `Object.create()` are standard.");
console.log(
	"  - For general object creation and inheritance, ES6 `class` syntax or constructor functions are preferred."
);

console.log("\n-------------------------------------------\n");

/**
 * 9. Advanced Concepts: Descriptor Properties
 *
 * Properties on objects (and their prototypes) have associated "descriptors"
 * that define their characteristics (value, writable, enumerable, configurable, get, set).
 */
console.log("9. Advanced Concepts: Descriptor Properties");
console.log("-------------------------------------------\n");

const descriptorObj = {};
Object.defineProperty(descriptorObj, "myProp", {
	value: 123,
	writable: false, // If false, the property's value cannot be changed.
	enumerable: true, // If true, the property will be enumerated by for...in loops and Object.keys().
	configurable: false, // If true, the property can be deleted, and its attributes can be changed.
});

console.log("descriptorObj.myProp:", descriptorObj.myProp); // 123
console.log("Attempting to change myProp (no effect in non-strict mode, TypeError in strict):");
descriptorObj.myProp = 456;
console.log("descriptorObj.myProp (after attempted change):", descriptorObj.myProp); // Still 123

console.log("Attempting to delete myProp (no effect in non-strict mode, TypeError in strict):");
delete descriptorObj.myProp;
console.log("descriptorObj.myProp (after attempted delete):", descriptorObj.myProp); // Still 123

console.log(
	"Object.getOwnPropertyDescriptor(descriptorObj, 'myProp'):",
	Object.getOwnPropertyDescriptor(descriptorObj, "myProp")
);

console.log("\n-------------------------------------------\n");
console.log("--- End of Masterclass ---");
