// =============================================================================
// 1. BASIC CURRYING CONCEPTS
// =============================================================================

// Manual currying
const add = (a) => (b) => (c) => a + b + c;
console.log(add(1)(2)(3)); // 6

// Generic curry helper
const curry = (fn) => {
	return function curried(...args) {
		if (args.length >= fn.length) {
			return fn.apply(this, args);
		}
		return function (...nextArgs) {
			return curried.apply(this, args.concat(nextArgs));
		};
	};
};

// =============================================================================
// 2. ADVANCED CONFIGURATION PATTERNS
// =============================================================================

// Database query builder using currying
const queryBuilder = curry((table, fields, conditions, orderBy, limit, offset) => {
	return {
		sql: `SELECT ${fields.join(
			", "
		)} FROM ${table} WHERE ${conditions} ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
		params: { table, fields, conditions, orderBy, limit, offset },
	};
});

// Create specialized query functions
const userQueries = queryBuilder("users");
const userFieldQuery = userQueries(["id", "name", "email"]);
const activeUserQuery = userFieldQuery('status = "active"');
const sortedActiveUsers = activeUserQuery("created_at DESC");
const paginatedUsers = sortedActiveUsers(10);

console.log(paginatedUsers(0));

// HTTP API client with currying
const apiCall = curry((baseUrl, method, endpoint, headers, body) => {
	return fetch(`${baseUrl}${endpoint}`, {
		method,
		headers: { "Content-Type": "application/json", ...headers },
		body: body ? JSON.stringify(body) : undefined,
	});
});

// Create specialized API functions
const myApi = apiCall("https://api.example.com");
const getRequest = myApi("GET");
const postRequest = myApi("POST");
const authenticatedGet = getRequest("/users", { Authorization: "Bearer token123" });

// =============================================================================
// 3. FUNCTIONAL COMPOSITION WITH CURRYING
// =============================================================================

// Curried utility functions
const map = curry((fn, array) => array.map(fn));
const filter = curry((predicate, array) => array.filter(predicate));
const reduce = curry((reducer, initial, array) => array.reduce(reducer, initial));
const pipe =
	(...functions) =>
	(value) =>
		functions.reduce((acc, fn) => fn(acc), value);

// Data transformation pipeline
const users = [
	{ name: "Alice", age: 25, active: true, score: 85 },
	{ name: "Bob", age: 30, active: false, score: 92 },
	{ name: "Charlie", age: 35, active: true, score: 78 },
	{ name: "Diana", age: 28, active: true, score: 95 },
];

const processUsers = pipe(
	filter((user) => user.active),
	map((user) => ({ ...user, grade: user.score >= 90 ? "A" : user.score >= 80 ? "B" : "C" })),
	filter((user) => user.grade !== "C"),
	map((user) => user.name)
);

console.log("Active high-scoring users:", processUsers(users));

// =============================================================================
// 4. EVENT HANDLING AND CALLBACKS
// =============================================================================

// Curried event handler factory
const createEventHandler = curry((eventType, selector, handler) => {
	return (element) => {
		if (selector) {
			element.addEventListener(eventType, (e) => {
				if (e.target.matches(selector)) {
					handler(e);
				}
			});
		} else {
			element.addEventListener(eventType, handler);
		}
		return element;
	};
});

// Create specialized handlers
const onClick = createEventHandler("click");
const onButtonClick = onClick("button");
const onSubmit = createEventHandler("submit", null);

// Usage (in browser environment)
// onButtonClick((e) => console.log('Button clicked:', e.target.textContent));

// =============================================================================
// 5. VALIDATION SYSTEM WITH CURRYING
// =============================================================================

// Curried validators
const validate = curry((validator, errorMessage, value) => {
	return validator(value) ? { valid: true, value } : { valid: false, error: errorMessage, value };
});

const isRequired = (value) => value !== null && value !== undefined && value !== "";
const minLength = curry((min, value) => typeof value === "string" && value.length >= min);
const maxLength = curry((max, value) => typeof value === "string" && value.length <= max);
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Create specific validators
const validateRequired = validate(isRequired, "Field is required");
const validateMinLength6 = validate(minLength(6), "Must be at least 6 characters");
const validateMaxLength100 = validate(maxLength(100), "Must be no more than 100 characters");
const validateEmail = validate(isEmail, "Must be a valid email address");

// Validation pipeline
const validateField = (value, ...validators) => {
	for (const validator of validators) {
		const result = validator(value);
		if (!result.valid) return result;
	}
	return { valid: true, value };
};

// Test validation
console.log("Password validation:", validateField("12345", validateRequired, validateMinLength6));

console.log("Email validation:", validateField("user@example.com", validateRequired, validateEmail));

// =============================================================================
// 6. MATHEMATICAL OPERATIONS AND SERIES
// =============================================================================

// Curried mathematical operations
const operation = curry((op, a, b) => {
	const operations = {
		add: (x, y) => x + y,
		multiply: (x, y) => x * y,
		power: (x, y) => Math.pow(x, y),
		divide: (x, y) => (y !== 0 ? x / y : NaN),
	};
	return operations[op](a, b);
});

const addOpp = operation("add");
const multiply = operation("multiply");
const power = operation("power");

// Create specialized functions
const double = multiply(2);
const square = power(2);
const addTen = add(10);

// Function composition for complex calculations
const calculateCompound = pipe(
	addTen, // Add initial amount
	square, // Square it
	double // Double the result
);

console.log("Compound calculation for 5:", calculateCompound(5)); // ((5+10)²) × 2 = 450

// =============================================================================
// 7. ASYNC OPERATIONS WITH CURRYING
// =============================================================================

// Curried async utilities
const delay = curry((ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms)));

const retryOperation = curry(async (maxRetries, operation, ...args) => {
	let lastError;
	for (let i = 0; i <= maxRetries; i++) {
		try {
			return await operation(...args);
		} catch (error) {
			lastError = error;
			if (i < maxRetries) {
				await delay(Math.pow(2, i) * 1000, null); // Exponential backoff
			}
		}
	}
	throw lastError;
});

// Create specialized retry functions
const retryThreeTimes = retryOperation(3);
const retryFiveTimes = retryOperation(5);

// Simulated async operation
const unreliableApi = async (data) => {
	if (Math.random() < 0.7) throw new Error("API temporarily unavailable");
	return `Success: ${data}`;
};

// Usage
retryThreeTimes(unreliableApi, "test data")
	.then((result) => console.log("API result:", result))
	.catch((error) => console.log("API failed:", error.message));

// =============================================================================
// 8. MEMOIZATION WITH CURRYING
// =============================================================================

// Curried memoization
const memoize = (fn) => {
	const cache = new Map();
	return curry((...args) => {
		const key = JSON.stringify(args);
		if (cache.has(key)) {
			console.log("Cache hit for:", key);
			return cache.get(key);
		}
		const result = fn(...args);
		cache.set(key, result);
		console.log("Cache miss for:", key);
		return result;
	});
};

// Expensive calculation
const expensiveCalculation = memoize((a, b, c) => {
	console.log("Performing expensive calculation...");
	return a * b * c + Math.random(); // Adding random to show it's cached
});

// Create partially applied memoized functions
const calculate10 = expensiveCalculation(10);
const calculate10x5 = calculate10(5);

console.log("First call:", calculate10x5(3));
console.log("Second call (cached):", calculate10x5(3));

// =============================================================================
// 9. PATTERN MATCHING WITH CURRYING
// =============================================================================

// Curried pattern matcher
const match = curry((patterns, value) => {
	for (const [condition, handler] of patterns) {
		if (typeof condition === "function" ? condition(value) : condition === value) {
			return typeof handler === "function" ? handler(value) : handler;
		}
	}
	throw new Error(`No pattern matched for value: ${value}`);
});

// HTTP status code handler
const handleHttpStatus = match([
	[200, "Success"],
	[404, "Not Found"],
	[500, "Internal Server Error"],
	[(code) => code >= 400 && code < 500, (code) => `Client Error: ${code}`],
	[(code) => code >= 500, (code) => `Server Error: ${code}`],
	[() => true, "Unknown Status"], // Default case
]);

console.log("Status 200:", handleHttpStatus(200));
console.log("Status 418:", handleHttpStatus(418));
console.log("Status 503:", handleHttpStatus(503));

// =============================================================================
// 10. REACTIVE PROGRAMMING WITH CURRYING
// =============================================================================

// Simple observable implementation with currying
const createObservable = (subscribe) => ({
	subscribe: curry((observer) => subscribe(observer)),
	map: curry((fn) =>
		createObservable((observer) => subscribe({ next: (value) => observer.next(fn(value)), ...observer }))
	),
	filter: curry((predicate) =>
		createObservable((observer) =>
			subscribe({
				next: (value) => predicate(value) && observer.next(value),
				...observer,
			})
		)
	),
});

// Create an observable
const numbers$ = createObservable((observer) => {
	let count = 0;
	const interval = setInterval(() => {
		observer.next(count++);
		if (count > 5) {
			observer.complete?.();
			clearInterval(interval);
		}
	}, 1000);

	return () => clearInterval(interval); // Cleanup
});

// Create a processing pipeline
const processedNumbers$ = numbers$.map((x) => x * 2).filter((x) => x > 4);

// Subscribe to the processed stream
processedNumbers$.subscribe({
	next: (value) => console.log("Processed value:", value),
	complete: () => console.log("Stream completed"),
});

console.log("\n=== Currying Examples Complete ===");
console.log("Check the console for various outputs including async operations...");
