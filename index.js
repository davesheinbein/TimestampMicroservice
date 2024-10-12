const express = require('express');  
// Import the Express framework to create a web server
// Framework: A collection of tools that provide a standard way to build apps. Express helps build web servers efficiently.

const cors = require('cors');        
// Import the CORS middleware to allow cross-origin requests
// Middleware: Software that processes requests before they reach route handlers. CORS handles cross-origin security.

const app = express();               
// Initialize the Express app (core of your web server)

app.use(cors({ optionsSuccessStatus: 200 }));  
// Apply CORS middleware, return 200 status for OPTIONS requests (CORS pre-flight)

app.use(express.static('public'));             
// Serve static files (CSS, images, etc.) from the 'public' directory

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
// Root route: Sends the 'index.html' file from the 'views' directory when the root URL ("/") is accessed

app.get("/api/hello", (req, res) => {
  res.json({ greeting: 'hello API' });
});
// Define an API route that returns a JSON object with a greeting message at "/api/hello"

app.get("/api/:date?", (req, res) => {
  const input = req.params.date;           
  // Extract 'date' from the URL
  
  const isValidDate = Date.parse(input);   
  // Check if input is a valid date (returns `NaN` if invalid)
  
  const isValidUnixNumber = /^[0-9]+$/.test(input);  
  // Check if the input is a Unix timestamp (numbers only)
  
  const isEmpty = !input;                  
  // Check if no date was provided

  const getDateResponse = (date) => ({
    unix: date.valueOf(),                  
    // Unix timestamp (milliseconds since 1970)
    
    utc: date.toUTCString()                
    // UTC string representation of the date
  });
  // Helper function to return the date in both Unix timestamp and UTC format

  if (isValidDate) {
    return res.json(getDateResponse(new Date(input)));
    // If input is a valid date, return it in Unix and UTC formats
  } else if (isNaN(isValidDate) && isValidUnixNumber) {
    return res.json(getDateResponse(new Date(parseInt(input, 10))));
    // If input is a valid Unix timestamp, convert it to a date and return it
  } else if (isEmpty) {
    return res.json(getDateResponse(new Date()));
    // If no date is provided, return the current date in Unix and UTC formats
  } else {
    return res.json({ error: "Invalid Date" });
    // If input is invalid, return an error message
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
// Start the Express server and listen on the environment's defined port (or default), logging the port number once running
