const chatContainer = document.querySelector('.chat-container');
const inputField = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

// Function to create a chat message element
function createChatMessage(message, isUser) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.classList.add(isUser ? 'user' : 'bot');

  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  messageElement.appendChild(paragraph);

  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
}

// Function to simulate a bot response using the Gemini API
async function simulateBotResponse(userInput) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userInput })
    });

    const data = await response.json();
    console.log('Bot response:', data); // Log the bot response for debugging

    createChatMessage(data.message, false);
  } catch (error) {
    console.error('Error:', error);
    // Handle error, e.g., display an error message to the user
  }
}



// Event listener for the send button
sendButton.addEventListener('click', () => {
  const userInput = inputField.value;
  if (userInput.trim() !== '') {
    createChatMessage(userInput, true);
    inputField.value = '';
    simulateBotResponse(userInput);
  }
});
