// ✅ Update this to your Render backend URL
const API_BASE = "https://share-memories-backend-mlkf.onrender.com";

// Form submission
const form = document.getElementById("memoryForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const likes = document.getElementById("likes").value;
  const regret = document.getElementById("regret").value;
  const memories = document.getElementById("memories").value;

  if (name && likes && regret && memories) {
    try {
      // Send a POST request to the server
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
        form.reset();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Error adding memory:", err);
    }
  } else {
    alert("Please fill out all fields.");
  }
});

// Load messages
document.getElementById("viewBtn").addEventListener("click", async () => {
  const messagesContainer = document.getElementById("messages");
  messagesContainer.innerHTML = "";

  try {
    // Fetch messages from the backend
    const response = await fetch(`${API_BASE}/api/memories`);
    const memories = await response.json();

    memories.forEach((data) => {
      messagesContainer.innerHTML += `
        <div>
          <h3>${data.name}</h3>
          <p><strong>Likes:</strong> ${data.likes}</p>
          <p><strong>Regret:</strong> ${data.regret}</p>
          <p><strong>Memories:</strong> ${data.memories}</p>
        </div>
      `;
    });
  } catch (err) {
    console.error("Error fetching memories:", err);
  }
});
