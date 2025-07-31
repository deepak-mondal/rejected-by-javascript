/*
 * Comprehensive Guide to Event Bubbling and Capturing in JavaScript
 *
 * Event bubbling and capturing are two phases of event propagation in the
 * Document Object Model (DOM). When an event occurs on an element (e.g., a click),
 * it doesn't just trigger listeners on that element. Instead, the event "travels"
 * through the DOM tree, allowing multiple elements to react to the same event.
 *
 * Understanding these phases is crucial for effective event handling, especially
 * for event delegation and preventing unintended side effects.
 */

/*
 * I. The Event Flow (Phases of Event Propagation)
 *
 * When an event is dispatched on a DOM element, it goes through three phases:
 *
 * 1.  **Capturing Phase (Trickle Down):** The event starts from the `window` object,
 * then travels down the DOM tree to the target element. Listeners in this phase
 * are triggered from the outermost ancestor down to the immediate parent of the target.
 *
 * 2.  **Target Phase:** The event reaches the actual element on which the event occurred.
 * Listeners attached directly to the target element are executed.
 *
 * 3.  **Bubbling Phase (Bubble Up):** The event then travels back up the DOM tree,
 * from the target element back to the `window` object. Listeners in this phase
 * are triggered from the target's immediate parent up to the outermost ancestor.
 */

/*
 * II. `addEventListener()` and Event Phases
 *
 * The `addEventListener()` method is used to register event handlers. It has
 * an optional third argument, `useCapture` (or `options` object), which determines
 * which phase the listener will be active in.
 *
 * Syntax: `element.addEventListener(event, handler, [options])`
 *
 * `options` can be a boolean or an object:
 * - `false` (default): The event handler is registered for the **bubbling phase**.
 * - `true`: The event handler is registered for the **capturing phase**.
 * - `{ capture: true }`: Equivalent to `true`.
 * - `{ once: true }`: Listener is automatically removed after being invoked once.
 * - `{ passive: true }`: Listener will never call `preventDefault()`. Useful for scroll events.
 */

/*
 * III. Event Bubbling (Default Behavior)
 *
 * Bubbling is the default behavior. When an event occurs on an element, it first
 * triggers handlers on that element, then on its parent, then its grandparent,
 * and so on, all the way up to the `document` and `window` objects.
 *
 * Think of it like a bubble rising from the point of impact.
 */
console.log("--- Event Bubbling Example ---");

// HTML Structure (conceptual):
/*
<div id="grandparent" style="border: 2px solid blue; padding: 20px;">
  Grandparent
  <div id="parent" style="border: 2px solid green; padding: 20px;">
    Parent
    <button id="child" style="padding: 10px;">Click Me (Bubbling)</button>
  </div>
</div>
*/

// Create conceptual DOM elements for demonstration
const createBubblingElements = () => {
	const grandparent = document.createElement("div");
	grandparent.id = "grandparent-bubbling";
	grandparent.style.cssText = "border: 2px solid blue; padding: 20px; margin-bottom: 10px;";
	grandparent.textContent = "Grandparent";

	const parent = document.createElement("div");
	parent.id = "parent-bubbling";
	parent.style.cssText = "border: 2px solid green; padding: 20px; margin-top: 10px;";
	parent.textContent = "Parent";

	const child = document.createElement("button");
	child.id = "child-bubbling";
	child.style.cssText = "padding: 10px; margin-top: 10px;";
	child.textContent = "Click Me (Bubbling)";

	parent.appendChild(child);
	grandparent.appendChild(parent);
	document.body.appendChild(grandparent);

	// Add event listeners (default is bubbling phase)
	grandparent.addEventListener("click", function () {
		console.log("Bubbling: Grandparent clicked!");
	});

	parent.addEventListener("click", function () {
		console.log("Bubbling: Parent clicked!");
	});

	child.addEventListener("click", function () {
		console.log("Bubbling: Child (Button) clicked!");
	});

	console.log("Click the 'Click Me (Bubbling)' button below to see bubbling in action:");
};

// Call this function to create the elements and attach listeners
// createBubblingElements(); // Uncomment to run in a browser environment

/*
 * When you click the "Click Me (Bubbling)" button:
 * 1. "Bubbling: Child (Button) clicked!"
 * 2. "Bubbling: Parent clicked!"
 * 3. "Bubbling: Grandparent clicked!"
 *
 * The event bubbles up from the target element to its ancestors.
 */

/*
 * IV. Event Capturing (Trickle Down)
 *
 * Capturing is the opposite of bubbling. The event starts from the outermost
 * ancestor (e.g., `window` or `document`) and travels down to the target element.
 * Listeners registered for the capturing phase will be triggered first, before
 * any bubbling phase listeners on the same elements.
 *
 * Think of it like rain trickling down a tree.
 */
console.log("\n--- Event Capturing Example ---");

// Create conceptual DOM elements for demonstration
const createCapturingElements = () => {
	const grandparent = document.createElement("div");
	grandparent.id = "grandparent-capturing";
	grandparent.style.cssText = "border: 2px solid blue; padding: 20px; margin-bottom: 10px;";
	grandparent.textContent = "Grandparent";

	const parent = document.createElement("div");
	parent.id = "parent-capturing";
	parent.style.cssText = "border: 2px solid green; padding: 20px; margin-top: 10px;";
	parent.textContent = "Parent";

	const child = document.createElement("button");
	child.id = "child-capturing";
	child.style.cssText = "padding: 10px; margin-top: 10px;";
	child.textContent = "Click Me (Capturing)";

	parent.appendChild(child);
	grandparent.appendChild(parent);
	document.body.appendChild(grandparent);

	// Add event listeners (explicitly set to capturing phase)
	grandparent.addEventListener(
		"click",
		function () {
			console.log("Capturing: Grandparent clicked!");
		},
		true
	); // true for capturing phase

	parent.addEventListener(
		"click",
		function () {
			console.log("Capturing: Parent clicked!");
		},
		{ capture: true }
	); // equivalent to true

	child.addEventListener(
		"click",
		function () {
			console.log("Capturing: Child (Button) clicked!");
		},
		true
	); // true for capturing phase

	console.log("Click the 'Click Me (Capturing)' button below to see capturing in action:");
};

// Call this function to create the elements and attach listeners
// createCapturingElements(); // Uncomment to run in a browser environment

/*
 * When you click the "Click Me (Capturing)" button:
 * 1. "Capturing: Grandparent clicked!"
 * 2. "Capturing: Parent clicked!"
 * 3. "Capturing: Child (Button) clicked!"
 *
 * The event trickles down from the outermost ancestor to the target element.
 */

/*
 * V. Stopping Event Propagation
 *
 * You can stop the event from continuing its journey through the DOM tree
 * using `event.stopPropagation()`.
 *
 * - If called during the capturing phase, it prevents bubbling.
 * - If called during the bubbling phase, it prevents further bubbling.
 * - It does NOT prevent other listeners on the *same element* from firing.
 */
console.log("\n--- Stopping Event Propagation (`stopPropagation`) ---");

const createStopPropagationElements = () => {
	const outer = document.createElement("div");
	outer.id = "outer-stop";
	outer.style.cssText = "border: 2px solid purple; padding: 30px; margin-bottom: 10px;";
	outer.textContent = "Outer";

	const inner = document.createElement("button");
	inner.id = "inner-stop";
	inner.style.cssText = "padding: 10px; margin-top: 10px;";
	inner.textContent = "Click Me (Stop Propagation)";

	outer.appendChild(inner);
	document.body.appendChild(outer);

	outer.addEventListener("click", function () {
		console.log("Outer clicked!");
	});

	inner.addEventListener("click", function (event) {
		console.log("Inner (Button) clicked!");
		event.stopPropagation(); // Stop the event from bubbling up to `outer`
		console.log("Event propagation stopped!");
	});

	console.log("Click the 'Click Me (Stop Propagation)' button below:");
	console.log("You will only see 'Inner (Button) clicked!' and 'Event propagation stopped!'.");
	console.log("The 'Outer clicked!' message will NOT appear.");
};

// createStopPropagationElements(); // Uncomment to run in a browser environment

/*
 * VI. Preventing Default Behavior
 *
 * `event.preventDefault()` stops the default action associated with an event.
 * For example, preventing a form submission, a link navigation, or a checkbox toggle.
 * It does NOT stop event propagation (bubbling/capturing).
 */
console.log("\n--- Preventing Default Behavior (`preventDefault`) ---");

const createPreventDefaultElements = () => {
	const myLink = document.createElement("a");
	myLink.href = "https://www.google.com";
	myLink.id = "my-link";
	myLink.textContent = "Click to Google (Default Prevented)";
	myLink.style.cssText = "display: block; margin-top: 20px;";
	document.body.appendChild(myLink);

	myLink.addEventListener("click", function (event) {
		event.preventDefault(); // Prevent the default link navigation
		console.log("Default link navigation prevented!");
		console.log("Event still bubbles up if there were parent listeners.");
	});

	console.log("Click the 'Click to Google (Default Prevented)' link below:");
	console.log("It will not navigate to Google.");
};

// createPreventDefaultElements(); // Uncomment to run in a browser environment

/*
 * VII. Event Delegation (Leveraging Bubbling)
 *
 * Event delegation is a powerful technique that relies on event bubbling.
 * Instead of attaching a listener to every child element, you attach a single
 * listener to a common ancestor. When an event bubbles up to the ancestor,
 * you check `event.target` to determine which child element originally triggered it.
 *
 * Benefits:
 * - Improved performance: Fewer event listeners to manage.
 * - Dynamic elements: Works automatically for elements added to the DOM later.
 * - Reduced memory footprint.
 */
console.log("\n--- Event Delegation Example ---");

const createEventDelegationElements = () => {
	const listContainer = document.createElement("ul");
	listContainer.id = "my-list";
	listContainer.style.cssText = "border: 1px dashed gray; padding: 10px; margin-top: 20px;";
	document.body.appendChild(listContainer);

	const items = ["Item 1", "Item 2", "Item 3"];
	items.forEach((text) => {
		const li = document.createElement("li");
		li.textContent = text;
		li.style.cssText = "padding: 5px; cursor: pointer;";
		listContainer.appendChild(li);
	});

	// Add a new item dynamically after a delay
	setTimeout(() => {
		const newItem = document.createElement("li");
		newItem.textContent = "New Dynamic Item";
		newItem.style.cssText = "padding: 5px; cursor: pointer; background-color: lightyellow;";
		listContainer.appendChild(newItem);
		console.log("Dynamically added 'New Dynamic Item'.");
	}, 1000);

	// Attach ONE listener to the parent container
	listContainer.addEventListener("click", function (event) {
		// Check if the clicked element is an <li>
		if (event.target.tagName === "LI") {
			console.log(`Delegated click on: ${event.target.textContent}`);
			event.target.style.backgroundColor = "lightblue";
		}
	});

	console.log("Click any list item below (including the one that appears dynamically):");
};

// createEventDelegationElements(); // Uncomment to run in a browser environment

/*
 * Conclusion
 *
 * Event bubbling and capturing are fundamental concepts that define how events
 * propagate through the DOM. Bubbling (the default) is commonly used, especially
 * for event delegation. Capturing is less common but useful for specific
 * scenarios where you need to intercept an event before it reaches its target.
 * `stopPropagation()` and `preventDefault()` are essential methods for controlling
 * event behavior.
 */
