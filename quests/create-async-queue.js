/**
 * Creates an asynchronous queue that limits the number of concurrently running tasks.
 *
 * @param {object} options - Configuration options for the queue.
 * @param {number} options.concurrency - The maximum number of tasks to run concurrently. Must be a positive integer.
 * @returns {object} An object representing the asynchronous queue with methods to add tasks, control its state, and listen for events.
 */
function createAsyncQueue({ concurrency }) {
	if (typeof concurrency !== "number" || concurrency <= 0 || !Number.isInteger(concurrency)) {
		throw new Error("Concurrency must be a positive integer.");
	}

	const taskQueue = []; // Stores tasks (functions that return promises)
	let runningTasks = 0; // Counts currently executing tasks
	let isPaused = false; // Flag to pause the queue
	let idlePromise = Promise.resolve(); // Resolves when the queue becomes idle
	let resolveIdle = () => {}; // Function to resolve the idlePromise

	// Initialize the idlePromise to be resolvable
	idlePromise = new Promise((resolve) => {
		resolveIdle = resolve;
	});

	// --- Internal Helpers ---

	/**
	 * Checks if the queue can run more tasks and, if so, starts them.
	 * This is the core logic for managing concurrency.
	 */
	const runNext = () => {
		if (isPaused || runningTasks >= concurrency || taskQueue.length === 0) {
			// If paused, at max concurrency, or no tasks left, do nothing.
			return;
		}

		// A task is available and we have capacity, so take the next one.
		const task = taskQueue.shift();
		runningTasks++;

		// Execute the task. Since tasks are expected to return promises,
		// we chain `.finally` to decrement `runningTasks` and then recursively call `runNext`.
		Promise.resolve(task())
			.then((result) => {
				// Emit success event if any listeners are attached (future extension)
			})
			.catch((error) => {
				// Emit error event
				if (typeof throttledQueue.onError === "function") {
					throttledQueue.onError(error);
				} else {
					// Default error handling if no custom handler is provided
					console.error("Unhandled error in async queue task:", error);
				}
			})
			.finally(() => {
				runningTasks--;
				// If no tasks are running and the queue is empty, resolve the idle promise.
				if (runningTasks === 0 && taskQueue.length === 0) {
					resolveIdle();
				}
				// Immediately try to run the next task to keep concurrency full.
				runNext();
			});

		// Recursively call runNext in case there's still capacity for more tasks.
		// This helps fill up the concurrency limit quickly.
		runNext();
	};

	// --- Public Interface ---

	const throttledQueue = {
		/**
		 * Adds a new task to the queue.
		 * A task must be a function that returns a Promise.
		 * @param {Function} taskFn - The function to execute.
		 */
		add(taskFn) {
			if (typeof taskFn !== "function") {
				throw new Error("Task must be a function that returns a Promise.");
			}
			taskQueue.push(taskFn);
			// As soon as a task is added, try to run it.
			// This ensures tasks start even if the queue was previously idle.
			runNext();

			// Reset the idle promise because a new task has been added.
			idlePromise = new Promise((resolve) => {
				resolveIdle = resolve;
			});
		},

		/**
		 * Returns a Promise that resolves when all current and pending tasks
		 * in the queue have completed.
		 * @returns {Promise<void>} A promise that resolves when the queue is idle.
		 */
		onIdle() {
			// If already idle, return the resolved promise.
			if (runningTasks === 0 && taskQueue.length === 0) {
				return Promise.resolve();
			}
			// Otherwise, return the promise that will resolve when it becomes idle.
			return idlePromise;
		},

		/**
		 * A callback function that is invoked when a task within the queue
		 * throws an error or its promise rejects.
		 * @param {Function} callback - The error handler function.
		 */
		onError: null, // Placeholder for user-defined error handler

		/**
		 * Pauses the queue. New tasks can be added but will not start executing
		 * until `resume()` is called. Currently running tasks will continue to completion.
		 */
		pause() {
			isPaused = true;
			console.log("Queue paused.");
		},

		/**
		 * Resumes a paused queue. Tasks will start executing again if there's capacity.
		 */
		resume() {
			if (isPaused) {
				isPaused = false;
				console.log("Queue resumed. Attempting to run tasks...");
				runNext(); // Attempt to start tasks immediately upon resuming
			}
		},

		/**
		 * Clears all pending tasks from the queue.
		 * Does not affect currently running tasks.
		 */
		clear() {
			const clearedCount = taskQueue.length;
			taskQueue.length = 0; // Empty the array
			console.log(`Queue cleared. ${clearedCount} pending tasks removed.`);
		},

		/**
		 * (Optional) Gets the current number of running tasks.
		 */
		getRunningTasksCount() {
			return runningTasks;
		},

		/**
		 * (Optional) Gets the current number of pending tasks.
		 */
		getPendingTasksCount() {
			return taskQueue.length;
		},
	};

	return throttledQueue;
}

// --- Example Usage ---

// Mock fetch function to simulate async operations
const fetchUser = (id, delay = 1000) => {
	return new Promise((resolve, reject) => {
		const startTime = Date.now();
		setTimeout(() => {
			// Simulate occasional errors for testing onError
			if (id === 3 && Math.random() < 0.5) {
				// 50% chance for user 3 to fail
				console.error(`[Task ${id}] Failed to fetch user!`);
				return reject(new Error(`Failed to fetch user ${id}`));
			}
			const endTime = Date.now();
			console.log(`[Task ${id}] Fetched user in ${endTime - startTime}ms.`);
			resolve({ id, name: `User ${id}` });
		}, delay + Math.random() * 500); // Add some randomness to delay
	});
};

console.log("--- Starting Queue Example ---");

const queue = createAsyncQueue({ concurrency: 2 });

// Set an error handler
queue.onError = (error) => {
	console.warn("Custom Error Handler Caught:", error.message);
};

// Add tasks to the queue
console.log("Adding tasks...");
queue.add(() => fetchUser(1, 1500));
queue.add(() => fetchUser(2, 800));
queue.add(() => fetchUser(3, 2000)); // This one might fail
queue.add(() => fetchUser(4, 1200));
queue.add(() => fetchUser(5, 700)); // Will be queued until concurrency opens up

console.log("Current running tasks:", queue.getRunningTasksCount()); // Expected: 2 (if tasks start immediately)
console.log("Current pending tasks:", queue.getPendingTasksCount()); // Expected: 3

// Test onIdle: This will resolve after all tasks (1,2,3,4,5) are done
queue
	.onIdle()
	.then(() => {
		console.log("\n--- Queue is now idle! All initial tasks completed. ---");
		console.log("Running tasks:", queue.getRunningTasksCount());
		console.log("Pending tasks:", queue.getPendingTasksCount());

		// Test pause and resume
		console.log("\n--- Testing pause and resume ---");
		queue.add(() => fetchUser(6, 1000));
		queue.add(() => fetchUser(7, 1200));
		queue.add(() => fetchUser(8, 500));

		console.log("Tasks 6, 7, 8 added. Pausing queue in 100ms...");
		setTimeout(() => {
			queue.pause();
			queue.add(() => fetchUser(9, 300)); // This task should be added but not run
			console.log(
				"Queue should be paused. Running:",
				queue.getRunningTasksCount(),
				"Pending:",
				queue.getPendingTasksCount()
			);
		}, 100);

		setTimeout(() => {
			queue.resume();
			console.log("Queue resumed. Running:", queue.getRunningTasksCount(), "Pending:", queue.getPendingTasksCount());
		}, 2500); // Resume after some time

		// Test clear
		setTimeout(() => {
			console.log("\n--- Testing clear ---");
			console.log("Current pending tasks before clear:", queue.getPendingTasksCount());
			queue.clear();
			console.log("Current pending tasks after clear:", queue.getPendingTasksCount());
			// Adding a new task after clear to ensure it still works
			queue.add(() => fetchUser(10, 500));
		}, 5000);

		// Final idle check for all tasks, including resumed and new ones
		queue.onIdle().then(() => {
			console.log("\n--- All tasks completed, queue is truly idle. ---");
		});
	})
	.catch((err) => {
		console.error("An unhandled error occurred in the onIdle promise chain:", err);
	});

// Demonstrate that onIdle can be called anytime
setTimeout(() => {
	console.log("\n--- onIdle called while tasks are still running ---");
	queue.onIdle().then(() => {
		console.log("onIdle resolved later, as expected.");
	});
}, 500);
