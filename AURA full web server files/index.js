const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // For serving static files
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Replace with your desired model
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function simulateBotResponse(userInput) {
  try {
    const botResponse = await fetch('http://localhost:3000/api/chat', { // Replace with your actual server address
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userInput })
    }).then(response => response.json());

    return botResponse.message;
  } catch (error) {
    console.error('Error:', error);
    // Handle error, e.g., display an error message to the user
  }
}

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming data as JSON
app.use(bodyParser.json());

// Define a route for the root path
app.get('/', (req, res) => {
  // You can send a basic response or render an HTML file here
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve an index.html file
});

// Chat route (modified endpoint and error handling)
app.post('/api/chat', async (req, res) => { // Endpoint changed to '/api/chat'
  const userInput = req.body.message; // Assuming your input data has a 'message' property

  if (userInput) {
    try {
      const botResponse = await simulateBotResponse(userInput);
      res.json({ botResponse }); // Send bot response as JSON
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error'); // Handle internal errors
    }
  } else {
    res.status(400).send('Missing message in request body'); // Handle missing input
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
