/**
 * A detailed explanation of useCallback and useMemo in React,
 * demonstrated with practical examples.
 *
 * These hooks are used for performance optimization by memoizing functions and values,
 * respectively, to prevent unnecessary re-creations and re-calculations.
 */

import React, { useState, useCallback, useMemo } from "react";

// --- Part 1: useCallback ---

/**
 * useCallback is used to memoize a function.
 * It returns a memoized version of the callback that only changes if one of the dependencies has changed.
 * This is crucial for preventing unnecessary re-renders of child components that are optimized with React.memo.
 */

// A child component optimized with React.memo()
// It will only re-render if its props have changed.
const ChildComponent = React.memo(({ onClick }) => {
	console.log("ChildComponent re-rendered");
	return <button onClick={onClick}>Click Me</button>;
});

const ParentComponentWithCallback = () => {
	const [count, setCount] = useState(0);
	const [otherState, setOtherState] = useState(0);

	/**
	 * Without useCallback, every time ParentComponentWithCallback re-renders (e'g', when otherState changes),
	 * a NEW function reference for `handleClick` is created.
	 * This would cause ChildComponent to re-render, even though its behavior hasn't changed,
	 * because React.memo sees the `onClick` prop's reference has changed.
	 *
	 * With useCallback, this function is only re-created when the `count` dependency changes.
	 * If otherState changes, the `handleClick` function reference remains the same,
	 * preventing ChildComponent from re-rendering.
	 */
	const handleClick = useCallback(() => {
		setCount(count + 1);
	}, [count]); // The dependency array ensures the function is only recreated when 'count' changes.

	return (
		<div>
			<h3>useCallback Example</h3>
			<p>Count: {count}</p>
			<p>Other State: {otherState}</p>
			<button onClick={() => setOtherState(otherState + 1)}>Increment Other State (Triggers Parent Rerender)</button>
			<ChildComponent onClick={handleClick} />
		</div>
	);
};

// --- Part 2: useMemo ---

/**
 * useMemo is used to memoize a value.
 * It returns a memoized value that is the result of a function execution.
 * It only re-computes the value when one of the dependencies has changed.
 * This is perfect for avoiding expensive calculations on every render.
 */

const expensiveComputation = (data, filter) => {
	console.log("Performing expensive computation...");
	// Simulate a slow, resource-intensive operation
	for (let i = 0; i < 1000000000; i++) {}
	return data.filter((item) => item.includes(filter));
};

const ComponentWithMemo = ({ list }) => {
	const [filterText, setFilterText] = useState("");
	const [unrelatedState, setUnrelatedState] = useState(0);

	/**
	 * Without useMemo, the expensiveComputation function would run on EVERY render of this component.
	 * This means if we update 'unrelatedState', the expensive calculation would still be performed,
	 * leading to a laggy user experience.
	 *
	 * With useMemo, the calculation is only re-run when its dependencies, `list` or `filterText`, change.
	 * When `unrelatedState` changes, the component re-renders, but useMemo returns the cached `filteredList` value,
	 * skipping the expensive computation entirely.
	 */
	const filteredList = useMemo(() => {
		return expensiveComputation(list, filterText);
	}, [list, filterText]); // The dependency array controls when the calculation is re-run.

	return (
		<div>
			<h3>useMemo Example</h3>
			<p>Unrelated State: {unrelatedState}</p>
			<button onClick={() => setUnrelatedState(unrelatedState + 1)}>Increment Unrelated State</button>
			<input
				type="text"
				value={filterText}
				onChange={(e) => setFilterText(e.target.value)}
				placeholder="Filter list..."
			/>
			<ul>
				{filteredList.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ul>
		</div>
	);
};

// --- Putting it all together ---

export default function App() {
	const sampleList = ["apple", "banana", "cherry", "date", "elderberry"];

	return (
		<div>
			<h2>React Hooks: useCallback & useMemo</h2>
			<p>Open the console to see when components and expensive functions are re-rendered/re-calculated.</p>
			<hr />
			<ParentComponentWithCallback />
			<hr />
			<ComponentWithMemo list={sampleList} />
		</div>
	);
}
