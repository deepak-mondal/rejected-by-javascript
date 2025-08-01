/*
 * Understanding `event.preventDefault()` and `event.stopPropagation()` in JavaScript
 *
 * These are two distinct but often confused methods of the Event object,
 * used to control how events behave in the browser's DOM.
 */

/*
 * I. `event.preventDefault()`
 *
 * Purpose: Stops the *default action* associated with an event.
 *
 * What it does:
 * - Prevents the browser's default behavior for a specific event.
 * - For example:
 * - Clicking an `<a>` tag: Prevents navigation to the `href` URL.
 * - Submitting a `<form>`: Prevents the form from being submitted to the server.
 * - Clicking a `<checkbox>`: Prevents the checkbox from being toggled.
 * - Pressing a key in an `<input>`: Prevents the character from appearing (e.g., in a game).
 *
 * What it DOES NOT do:
 * - It does NOT stop the event from propagating (bubbling or capturing) through the DOM.
 * Listeners on parent or child elements will still fire.
 *
 * When to use:
 * - When you want to handle an event with your own JavaScript logic and
 * override the browser's built-in behavior for that event.
 */

console.log("--- `event.preventDefault()` Example ---");

// Create a link element
const preventDefaultLink = document.createElement("a");
preventDefaultLink.href = "https://www.example.com";
preventDefaultLink.textContent = "Click Me (Prevents Default)";
preventDefaultLink.style.cssText = "display: block; margin-bottom: 10px; border: 1px solid blue; padding: 5px;";
document.body.appendChild(preventDefaultLink);

// Create a parent div to demonstrate bubbling still occurs
const parentDivForLink = document.createElement("div");
parentDivForLink.style.cssText = "border: 2px dashed gray; padding: 15px;";
parentDivForLink.textContent = "Parent Div for Link";
parentDivForLink.appendChild(preventDefaultLink);
document.body.appendChild(parentDivForLink);

// Add an event listener to the link
preventDefaultLink.addEventListener("click", function (event) {
	console.log("Link clicked!");
	event.preventDefault(); // Prevent the browser from navigating to example.com
	console.log("`event.preventDefault()` called: Default navigation stopped.");
});

// Add an event listener to the parent div (to show bubbling still happens)
parentDivForLink.addEventListener("click", function () {
	console.log("Parent Div clicked! (Event still bubbled up)");
});

console.log("Click the 'Click Me (Prevents Default)' link above.");
console.log("You will see 'Link clicked!' and 'Parent Div clicked!', but the page will NOT navigate.");

/*
 * II. `event.stopPropagation()`
 *
 * Purpose: Stops the *event propagation* (bubbling and capturing) through the DOM.
 *
 * What it does:
 * - Prevents the event from traveling further up or down the DOM tree.
 * - If called during the capturing phase, it stops the event from reaching the target
 * element's bubbling phase or any ancestors' bubbling phase.
 * - If called during the bubbling phase, it stops the event from bubbling up to
 * any further ancestors.
 *
 * What it DOES NOT do:
 * - It does NOT prevent the default action of the event.
 * - It does NOT prevent other event listeners *on the same element* from firing.
 * (If you have multiple listeners on the same element, they will all run.)
 *
 * When to use:
 * - When you want to ensure that an event is handled *only* by the current element
 * or a specific set of elements, and you don't want parent/child elements
 * to react to the same event.
 * - To prevent "event bubbling" from causing unintended side effects on parent elements.
 */

console.log("\n--- `event.stopPropagation()` Example ---");

// Create nested div elements
const outerDiv = document.createElement("div");
outerDiv.id = "outer-div";
outerDiv.style.cssText = "border: 2px solid green; padding: 30px; margin-top: 20px;";
outerDiv.textContent = "Outer Div";

const innerButton = document.createElement("button");
innerButton.id = "inner-button";
innerButton.textContent = "Click Me (Stop Propagation)";
innerButton.style.cssText = "padding: 10px; margin-top: 10px;";

outerDiv.appendChild(innerButton);
document.body.appendChild(outerDiv);

// Add event listener to the outer div
outerDiv.addEventListener("click", function () {
	console.log("Outer Div clicked! (This should NOT appear if propagation is stopped)");
});

// Add event listener to the inner button
innerButton.addEventListener("click", function (event) {
	console.log("Inner Button clicked!");
	event.stopPropagation(); // Stop the event from bubbling up to `outerDiv`
	console.log("`event.stopPropagation()` called: Event will not bubble further.");
});

console.log("Click the 'Click Me (Stop Propagation)' button above.");
console.log("You will only see 'Inner Button clicked!' and 'Event will not bubble further.'.");
console.log("You will NOT see 'Outer Div clicked!'.");

/*
 * III. Combining `preventDefault()` and `stopPropagation()`
 *
 * You can use both methods together if you want to stop both the default
 * action AND the event propagation.
 */
console.log("\n--- Combining `preventDefault()` and `stopPropagation()` Example ---");

const combinedActionLink = document.createElement("a");
combinedActionLink.href = "https://www.another-example.com";
combinedActionLink.textContent = "Click Me (Both Prevented)";
combinedActionLink.style.cssText = "display: block; margin-top: 20px; border: 1px solid red; padding: 5px;";
document.body.appendChild(combinedActionLink);

const parentDivForCombined = document.createElement("div");
parentDivForCombined.style.cssText = "border: 2px dashed purple; padding: 15px;";
parentDivForCombined.textContent = "Parent Div for Combined Action";
parentDivForCombined.appendChild(combinedActionLink);
document.body.appendChild(parentDivForCombined);

parentDivForCombined.addEventListener("click", function () {
	console.log("Parent Div for Combined Action clicked! (This should NOT appear)");
});

combinedActionLink.addEventListener("click", function (event) {
	console.log("Combined Action Link clicked!");
	event.preventDefault(); // Stop default navigation
	event.stopPropagation(); // Stop event from bubbling up
	console.log("Both `preventDefault()` and `stopPropagation()` called.");
});

console.log("Click the 'Click Me (Both Prevented)' link above.");
console.log("You will only see 'Combined Action Link clicked!' messages.");
console.log("The page will NOT navigate, and 'Parent Div for Combined Action clicked!' will NOT appear.");

/*
 * Conclusion
 *
 * - `event.preventDefault()`: Stops the browser's default action for an event.
 * (e.g., navigating a link, submitting a form).
 * - `event.stopPropagation()`: Stops the event from traveling further up or down
 * the DOM tree (stops bubbling/capturing).
 *
 * They address different aspects of event handling and can be used independently
 * or together depending on your specific needs.
 */
