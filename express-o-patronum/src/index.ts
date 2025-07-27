// This is the main application file for your Express server.

import express from 'express'; // Import the express library

const app = express(); // Create an instance of the express application
const port = process.env.PORT || 3000; // Define the port the server will listen on, default to 3000

// Middleware to parse JSON bodies from incoming requests.
// This allows you to send JSON data in the request body (e.g., for POST requests)
// and have it automatically parsed and available in `req.body`.
app.use(express.json());

// Define a simple GET route for the root URL ('/')
// When a GET request is made to '/', this function will be executed.
// req: The request object, containing information about the HTTP request.
// res: The response object, used to send a response back to the client.
app.get('/', (req, res) => {
	// Send a string response back to the client
	res.send('Hello from Express.js with TypeScript!');
});

// Define another GET route for '/api/greet/:name'
// This route demonstrates how to use route parameters.
// The ':name' part is a placeholder that will capture whatever is in that position of the URL.
app.get('/api/greet/:name', (req, res) => {
	// Access the 'name' parameter from the request object's params property.
	const name = req.params.name;
	// Send a personalized greeting back to the client.
	res.json({ message: `Hello, ${name}! Welcome to the API.` });
});

// Start the server and listen for incoming requests on the specified port.
app.listen(port, () => {
	// Log a message to the console once the server starts successfully.
	console.log(`Server is running on http://localhost:${port}`);
	console.log('Press Ctrl+C to stop the server.');
});