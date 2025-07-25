function throttle(func, wait, options = {}) {
	// inThrottle: A boolean flag indicating if the function is currently in a throttled state.
	// lastFn: Stores the original function when a trailing call is pending.
	// lastTime: Stores the timestamp of the last function execution or leading edge trigger.
	let inThrottle, lastFn, lastTime;

	// Destructure leading and trailing options from the options object.
	// Provide default values of true if they are not explicitly set.
	const { leading = true, trailing = true } = options;

	// Input validation: Ensure 'func' is a function.
	if (typeof func !== "function") {
		throw new TypeError("Expected a function");
	}

	// Input validation: Ensure 'wait' is a non-negative number.
	if (typeof wait !== "number" || wait < 0) {
		throw new TypeError("Expected a non-negative number for wait");
	}

	// This is the throttled function that will be returned and called by the user.
	const throttled = function (...args) {
		// Capture the 'this' context of the current call to 'throttled'.
		// This ensures 'func' is executed with the correct 'this' binding.
		const context = this;

		// Check if the function is currently NOT in a throttled state.
		if (!inThrottle) {
			// If 'leading' option is true, execute the original function immediately.
			if (leading) {
				func.apply(context, args);
			} else {
				// If 'leading' is false, but it's the first call after a non-throttled state,
				// store the function and current time to prepare for a potential trailing call.
				lastFn = func;
				lastTime = Date.now();
			}
			// Set 'inThrottle' to true to indicate that we've just entered a throttle period.
			inThrottle = true;
		} else {
			// If the function IS currently in a throttled state (i.e., called within the 'wait' period),
			// update 'lastFn' and 'lastTime' to ensure the latest call's context and arguments
			// are considered for a potential trailing execution.
			lastFn = func;
			lastTime = Date.now();
		}

		// Clear any previously set timeout. This is crucial for the 'trailing' option,
		// as it ensures the trailing execution only happens 'wait' milliseconds
		// after the *very last call* within the throttled period.
		clearTimeout(throttled.timeoutId);

		// Set a new timeout. This timeout is responsible for:
		// 1. Executing the 'func' for the trailing call (if 'trailing' is true).
		// 2. Resetting the throttle state after the 'wait' period.
		throttled.timeoutId = setTimeout(function () {
			// If 'trailing' option is true AND there was at least one call during
			// the throttled period (which would have set 'lastFn'), execute 'func'.
			if (trailing && lastFn) {
				func.apply(context, args);
				// Clear 'lastFn' after trailing execution to prevent re-execution.
				lastFn = null;
			}
			// Reset 'inThrottle' to false, making the function ready for a new
			// leading execution or the start of a new trailing period.
			inThrottle = false;
			// Clear 'lastTime' as the throttle period has ended.
			lastTime = null;
		}, wait);
	};

	// Add a 'cancel' method directly to the returned 'throttled' function.
	// This allows the user to cancel any pending throttled executions.
	throttled.cancel = function () {
		// Clear any active timeout, preventing a trailing execution.
		clearTimeout(throttled.timeoutId);
		// Reset the throttle state.
		inThrottle = false;
		// Clear any stored function and time for trailing.
		lastFn = null;
		lastTime = null;
	};

	// Return the throttled function.
	return throttled;
}

// Example Usage:

function logMessage(message) {
	console.log(`[${Date.now()}] ${message}`);
}

console.log("--- Leading and Trailing ---");
// Throttle 'logMessage' with a 1000ms wait, with both leading and trailing executions.
const throttledLog1 = throttle(logMessage, 1000, { leading: true, trailing: true });
throttledLog1("First call (should execute immediately)"); // Leading execution
setTimeout(() => throttledLog1("Second call"), 200); // Call within throttle, sets up potential trailing
setTimeout(() => throttledLog1("Third call"), 400); // Call within throttle, updates potential trailing
setTimeout(() => throttledLog1("Fourth call"), 1100); // This call triggers a new throttle period. A trailing call will execute after 1000ms from the *last* call within the previous throttle period if no new calls come in.

setTimeout(() => {
	console.log("\n--- Leading only ---");
	// Throttle 'logMessage' with a 1000ms wait, only leading execution.
	const throttledLog2 = throttle(logMessage, 1000, { leading: true, trailing: false });
	throttledLog2("First call leading only (should execute immediately)");
	setTimeout(() => throttledLog2("Second call leading only"), 200); // Ignored, as it's within throttle and no trailing
	setTimeout(() => throttledLog2("Third call leading only"), 400); // Ignored
	setTimeout(() => throttledLog2("Fourth call leading only"), 1100); // Executes immediately as previous throttle ended
}, 3000);

setTimeout(() => {
	console.log("\n--- Trailing only ---");
	// Throttle 'logMessage' with a 1000ms wait, only trailing execution.
	const throttledLog3 = throttle(logMessage, 1000, { leading: false, trailing: true });
	throttledLog3("First call trailing only (should NOT execute immediately)"); // No leading execution
	setTimeout(() => throttledLog3("Second call trailing only"), 200); // Sets up trailing
	setTimeout(() => throttledLog3("Third call trailing only"), 400); // Updates trailing
	setTimeout(() => throttledLog3("Fourth call trailing only"), 1100); // This call will initiate a new throttle period, and a trailing call will occur 1000ms from now.
}, 6000);

setTimeout(() => {
	console.log("\n--- Cancel Method ---");
	// Throttle 'logMessage' with leading and trailing.
	const throttledLog4 = throttle(logMessage, 1000, { leading: true, trailing: true });
	throttledLog4("Call before cancel"); // Executes immediately due to leading: true
	setTimeout(() => {
		throttledLog4("Call to be cancelled"); // This would normally set up a trailing call
		throttledLog4.cancel(); // BUT, we immediately cancel any pending execution.
		console.log("Cancelled pending throttle.");
	}, 500);
	setTimeout(() => {
		throttledLog4("Call after cancel"); // A new throttle period starts, so this executes immediately.
	}, 1500);
}, 9000);
