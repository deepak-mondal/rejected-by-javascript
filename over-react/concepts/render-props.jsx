/*
 * Comprehensive Guide to Render Props in React with Functional Components
 *
 * Render props are a powerful technique in React for sharing code (specifically,
 * stateful logic or behavior) between components using a prop whose value is a function.
 * This function is then called by the component that receives it to "render" its children,
 * based on the data or state provided by the component.
 *
 * While React Hooks are the modern, preferred way to share stateful logic
 * in functional components, understanding render props is crucial for
 * comprehending older React codebases and for certain library patterns.
 */

/*
 * I. The Problem Render Props Solve (Recap)
 *
 * The core problem is code reusability for stateful logic. If multiple components
 * need access to the same data or behavior (e.g., mouse position, authentication status,
 * data fetching results), but want to display that data in different ways,
 * render props provide a flexible solution to avoid duplicating the logic.
 */

/*
 * II. How Render Props Work with Functional Components
 *
 * A functional component that uses a render prop will:
 * 1. Manage some internal state or behavior using Hooks (e.g., `useState`, `useEffect`).
 * 2. Receive a prop that is a function (the render prop).
 * 3. Call this render prop function, passing its internal state/behavior
 * as arguments to that function.
 * 4. Return the result of that function call (which should be a React element).
 */

// --- MouseTracker.jsx (Functional Component) ---
// This component encapsulates the mouse tracking logic.
const MouseTracker = (props) => {
	// 1. Manage internal state using useState Hook
	const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

	// Event handler for mouse movement
	const handleMouseMove = (event) => {
		setMousePosition({
			x: event.clientX,
			y: event.clientY,
		});
	};

	// 2. Set up and clean up side effects using useEffect Hook
	React.useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);

		// Cleanup function: runs when the component unmounts or dependencies change
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

	// 3. Call the `render` prop function, passing its state as arguments
	// The consumer defines what UI to render with this data.
	return props.render(mousePosition);
};
// --- End MouseTracker.jsx ---

// --- MousePositionDisplay.jsx (Functional Component) ---
// This component is a consumer of the mouse position data.
const MousePositionDisplay = ({ x, y }) => {
	return (
		<div
			style={{
				border: "1px solid #ccc",
				padding: "10px",
				marginTop: "20px",
				borderRadius: "8px",
				background: "#f9f9f9",
			}}
		>
			<h2 style={{ color: "#333" }}>Mouse Position:</h2>
			<p style={{ fontSize: "1.2em", fontWeight: "bold" }}>
				X: {x}, Y: {y}
			</p>
		</div>
	);
};
// --- End MousePositionDisplay.jsx ---

// --- CatFollower.jsx (Functional Component) ---
// Another consumer, rendering a different UI with the same data.
const CatFollower = ({ x, y }) => {
	// Placeholder image for a cat
	const catImageUrl = "https://placehold.co/100x100/FFC0CB/000000?text=Cat";
	return (
		<img
			src={catImageUrl}
			alt="Cat following mouse"
			style={{
				position: "absolute",
				left: x - 50, // Adjust to center the image
				top: y - 50, // Adjust to center the image
				width: "100px",
				height: "100px",
				borderRadius: "8px",
				pointerEvents: "none", // Ensures mouse events pass through the image
			}}
		/>
	);
};
// --- End CatFollower.jsx ---

// --- DataFetcher.jsx (Functional Component) ---
// This component encapsulates data fetching logic.
const DataFetcher = ({ url, render }) => {
	const [state, setState] = React.useState({
		data: null,
		loading: true,
		error: null,
	});

	React.useEffect(() => {
		const fetchData = async () => {
			setState({ data: null, loading: true, error: null }); // Reset state on URL change
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setState({ data, loading: false, error: null });
			} catch (error) {
				setState({ data: null, loading: false, error });
			}
		};

		fetchData();
	}, [url]); // Re-fetch data whenever the 'url' prop changes

	// Call the `render` prop function, passing the current state
	return render(state);
};
// --- End DataFetcher.jsx ---

// --- App.jsx (Main Application Component) ---
// This is where we put everything together and use the render prop components.
const App = () => {
	return (
		<div
			style={{
				fontFamily: "Inter, sans-serif",
				textAlign: "center",
				padding: "20px",
				background: "#eef2f6",
				minHeight: "100vh",
				borderRadius: "12px",
				boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
			}}
		>
			<h1 style={{ color: "#2c3e50", marginBottom: "30px" }}>React Render Props with Functional Components</h1>
			<p style={{ fontSize: "1.1em", color: "#555" }}>Move your mouse around to see the mouse tracker in action!</p>
			<p style={{ fontSize: "1.1em", color: "#555" }}>Scroll down to see data fetching with render props.</p>

			{/* Example 1: Mouse Tracker with different render props */}
			<div
				style={{
					border: "2px dashed #a0aec0",
					padding: "20px",
					margin: "40px auto",
					maxWidth: "600px",
					borderRadius: "10px",
					background: "#ffffff",
				}}
			>
				<h2 style={{ color: "#2980b9" }}>Mouse Tracking Logic</h2>
				<MouseTracker
					// The 'render' prop is a function that receives the mouse position.
					// We define what UI to render based on that position.
					render={({ x, y }) => <MousePositionDisplay x={x} y={y} />}
				/>

				{/* Another instance of MouseTracker, rendering a different UI */}
				<MouseTracker render={({ x, y }) => <CatFollower x={x} y={y} />} />
			</div>

			{/* Example 2: Data Fetcher with different render props */}
			<div
				style={{
					marginTop: "50px",
					border: "2px dashed #a0aec0",
					padding: "20px",
					margin: "40px auto",
					maxWidth: "600px",
					borderRadius: "10px",
					background: "#ffffff",
				}}
			>
				<h2 style={{ color: "#2980b9" }}>Data Fetching Logic</h2>
				<DataFetcher
					url="https://jsonplaceholder.typicode.com/todos/1" // Example API 1
					render={({ data, loading, error }) => {
						if (loading) {
							return <p style={{ color: "#3498db" }}>Loading Todo data...</p>;
						}
						if (error) {
							return <p style={{ color: "red" }}>Error fetching Todo: {error.message}</p>;
						}
						return (
							<div style={{ background: "#ecf0f1", padding: "15px", borderRadius: "8px", textAlign: "left" }}>
								<h3>Fetched Todo:</h3>
								<p>
									<strong>ID:</strong> {data.id}
								</p>
								<p>
									<strong>Title:</strong> {data.title}
								</p>
								<p>
									<strong>Completed:</strong> {data.completed ? "Yes" : "No"}
								</p>
							</div>
						);
					}}
				/>

				<DataFetcher
					url="https://jsonplaceholder.typicode.com/users/1" // Example API 2
					render={({ data, loading, error }) => {
						if (loading) {
							return <p style={{ color: "#3498db", marginTop: "20px" }}>Loading User data...</p>;
						}
						if (error) {
							return <p style={{ color: "red", marginTop: "20px" }}>Error fetching User: {error.message}</p>;
						}
						return (
							<div
								style={{
									background: "#e0f2f7",
									padding: "15px",
									borderRadius: "8px",
									marginTop: "20px",
									textAlign: "left",
								}}
							>
								<h3>Fetched User:</h3>
								<p>
									<strong>Name:</strong> {data.name}
								</p>
								<p>
									<strong>Email:</strong> {data.email}
								</p>
								<p>
									<strong>Website:</strong> {data.website}
								</p>
							</div>
						);
					}}
				/>
			</div>
		</div>
	);
};

// This code is designed to be run in a React environment.
// For a full runnable example, you would need:
// 1. An HTML file with a root div: <div id="root"></div>
// 2. React and ReactDOM libraries included (e.g., via CDN or npm build)
//    <script src="https://unpkg.com/react/umd/react.development.js"></script>
//    <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
//    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
//    Then your JavaScript code should be in a script tag with type="text/babel"
//    or compiled with Babel.
// ReactDOM.render(<App />, document.getElementById('root'));
