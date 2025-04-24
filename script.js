// ✅ Update this to your Render backend URL
const API_BASE = "https://share-memories-backend-mlkf.onrender.com";

// Form submission to add a new memory
const form = document.getElementById("memoryForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const likes = document.getElementById("likes").value;
  const regret = document.getElementById("regret").value;
  const memories = document.getElementById("memories").value;

  // Check if all fields are filled
  if (name && likes && regret && memories) {
    try {
      // Send a POST request to add a new memory
      const response = await fetch(`${API_BASE}/api/memories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          likes,
          regret,
          memories,
        }),
      });

      const data = await response.json();
      
      if (response.status === 201) {
        alert("Memory submitted successfully!");
        form.reset();  // Reset form fields after successful submission
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Error adding memory:", err);
      alert("An error occurred while submitting the memory. Please try again.");
    }
  } else {
    alert("Please fill out all fields.");
  }
});

// Load and display all memories on the "View Memories" button click
document.getElementById("viewBtn").addEventListener("click", async () => {
  const messagesContainer = document.getElementById("messages");
  messagesContainer.innerHTML = "";  // Clear any previous memories

  try {
    // Fetch memories from the backend
    const response = await fetch(`${API_BASE}/api/memories`);
    
    // Handle non-200 responses
    if (!response.ok) {
      throw new Error("Failed to fetch memories.");
    }

    const memories = await response.json();

    if (memories.length === 0) {
      messagesContainer.innerHTML = "<p>No memories found.</p>";
    } else {
      memories.forEach((data) => {
        // Append each memory to the container
        messagesContainer.innerHTML += `
          <div class="memory-card">
            <h3>${data.name}</h3>
            <p><strong>Likes:</strong> ${data.likes}</p>
            <p><strong>Regret:</strong> ${data.regret}</p>
            <p><strong>Memories:</strong> ${data.memories}</p>
            <p><em>Submitted on: ${new Date(data.timestamp).toLocaleString()}</em></p>
          </div>
        `;
      });
    }
  } catch (err) {
    console.error("Error fetching memories:", err);
    messagesContainer.innerHTML = "<p>Failed to load memories. Please try again later.</p>";
  }
});
