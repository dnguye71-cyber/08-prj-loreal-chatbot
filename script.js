// =====================================
// LiveLab 10 – AI Recommendation Engine
// L'Oréal Chatbot - COMPLETE SOLUTION
//
// Student: [Dylan Nguyen]
// Assignment: Project 8 - L'Oréal Chatbot
// ⚠️ SECURITY: API key is securely stored in Cloudflare Worker
// =====================================

// =====================================
// STEP 1: Select DOM Elements
// =====================================
// Get references to HTML elements for user interaction
const chatForm = document.getElementById("chatForm"); // Form element for submitting messages
const userInput = document.getElementById("userInput"); // Input field where user types questions
const chatWindow = document.getElementById("chatWindow"); // Div where chatbot responses display

// =====================================
// STEP 2: Configure Cloudflare Worker
// =====================================
// URL to our secure Cloudflare Worker (keeps API key safe!)
// This Worker handles the API key securely on the backend
const CLOUDFLARE_WORKER_URL = "https://lorealchatbot.dnguye71.workers.dev";

// =====================================
// STEP 3: Set Initial Message
// =====================================
// Display welcome message when page loads
chatWindow.textContent = "Hello! How can I help you today?";

// =====================================
// STEP 4: Add Event Listener for Form Submission
// =====================================
// Listen for when user submits the form (clicks send or presses Enter)
chatForm.addEventListener("submit", async (e) => {
  // Prevent default form behavior (page reload)
  e.preventDefault();

  // =====================================
  // STEP 5: Get and Validate User Input
  // =====================================
  // Get the user's question from the input field
  const userQuestion = userInput.value.trim();

  // TODO: Check if the user's input is empty
  // If user didn't type anything:
  //   1. Show helpful error message
  //   2. Stop the function (return early)
  if (!userQuestion) {
    chatWindow.textContent = "Please enter a question before asking!";
    return; // Exit early if input is empty
  }

  // =====================================
  // STEP 6: Show Loading Message
  // =====================================
  // Display "Thinking..." while waiting for AI response
  chatWindow.textContent = "Thinking...";

  // =====================================
  // STEP 7: Connect to OpenAI API via Cloudflare Worker
  // =====================================
  // ⚠️ IMPORTANT SECURITY NOTE:
  // Our Cloudflare Worker securely stores the API key
  // The API key is NOT exposed in this frontend code
  // This is production-ready security!
  //
  // The flow:
  // 1. Browser (this code) sends request to Cloudflare Worker
  // 2. Cloudflare Worker uses the hidden API key
  // 3. Cloudflare Worker calls OpenAI API
  // 4. OpenAI responds to Cloudflare Worker
  // 5. Cloudflare Worker sends response back to us
  //
  // This way: User can NEVER see the API key ✅

  try {
    // TODO: Complete the fetch request to our Cloudflare Worker
    const res = await fetch(CLOUDFLARE_WORKER_URL, {
      // TODO: Set the HTTP method to POST
      // POST is required for sending data to the API
      method: "POST",

      // TODO: Add headers object
      // Tell the API we're sending JSON data
      headers: {
        "Content-Type": "application/json",
        // NOTE: No Authorization header needed!
        // Cloudflare Worker handles the API key securely
      },

      // TODO: Add body with the message data
      // This is what we send to OpenAI:
      // - model: which AI model to use
      // - messages: array of conversation messages
      body: JSON.stringify({
        // Use GPT-3.5 Turbo (fast and affordable)
        model: "gpt-3.5-turbo",

        // Array of messages in the conversation
        messages: [
          // SYSTEM MESSAGE: Tells the AI how to behave
          {
            role: "system",
            content: `You are an expert L'Oréal product advisor with deep knowledge of L'Oréal's product lines including:
- Makeup: L'Oréal Paris Infallible, True Match, Voluminous Lashes
- Skincare: Revitalift, Pure Clean, Hydra Fresh, Men Expert
- Haircare: Elsève, Professionnel, Advanced Haircare
- Fragrances: Lancôme, Giorgio Armani, Yves Saint Laurent (owned by L'Oréal)

Your role is to:
1. Help customers find the right products for their specific skin/hair type and concerns
2. Explain product benefits, ingredients, and how to use them
3. Suggest personalized beauty routines based on their needs
4. Provide expert advice on makeup application and skincare

For questions unrelated to L'Oréal products or beauty, politely decline and redirect to L'Oréal topics.
Always be friendly, knowledgeable, and tailor recommendations to the customer's unique needs.`,
          },

          // USER MESSAGE: What the user is asking
          {
            role: "user",
            content: userQuestion, // Use the question the user typed
          },
        ],
      }),
    });

    // =====================================
    // STEP 8: Check if API Response Was Successful
    // =====================================
    // TODO: Check if the response status is OK
    // If not OK, throw an error with the status code
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    // =====================================
    // STEP 9: Parse the JSON Response
    // =====================================
    // TODO: Parse the JSON response from the API
    // Convert response to JavaScript object
    const data = await res.json();

    // =====================================
    // STEP 10: Extract and Display AI Response
    // =====================================
    // TODO: Extract the AI's message from the response
    // OpenAI returns the message in: data.choices[0].message.content
    // Display it in the chat window
    chatWindow.textContent = data.choices[0].message.content;

    // Clear the input field so user can ask another question
    userInput.value = "";
  } catch (error) {
    // =====================================
    // STEP 11: Handle Errors Gracefully
    // =====================================
    // TODO: Handle errors by:
    // 1. Log the error to console for debugging
    // 2. Show user-friendly error message

    // Log error to console (for developers)
    console.error("Error fetching AI response:", error);

    // Show friendly error message to user
    chatWindow.textContent =
      "Sorry, something went wrong. Please try again later.";
  }
});
