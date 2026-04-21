
const OWNER_WEBHOOK_URL = "https://mbaghdadi6g.app.n8n.cloud/webhook/gown-owner-submit";
const SEARCH_WEBHOOK_URL = "https://mbaghdadi6g.app.n8n.cloud/webhook/gown-search";

const ownerForm = document.getElementById("ownerForm");
const borrowerForm = document.getElementById("borrowerForm");

if (ownerForm) {
  ownerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ownerMessage = document.getElementById("ownerMessage");
    ownerMessage.textContent = "Submitting...";

    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      degree_level: document.getElementById("degree_level").value,
      size_range_label: document.getElementById("size_range_label").value,
      hood_color: document.getElementById("hood_color").value.trim(),
      fulfillment_method: document.getElementById("fulfillment_method").value,
      notes: document.getElementById("notes").value.trim()
    };

    try {
      const response = await fetch(OWNER_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.ok) {
        ownerMessage.textContent = data.message || "Submitted successfully.";
        ownerForm.reset();
      } else {
        ownerMessage.textContent = "Something went wrong. Please try again.";
      }
    } catch (error) {
      ownerMessage.textContent = "Could not submit the form. Please try again.";
    }
  });
}

if (borrowerForm) {
  borrowerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const borrowerMessage = document.getElementById("borrowerMessage");
    const resultsContainer = document.getElementById("results");

    borrowerMessage.textContent = "Searching...";
    resultsContainer.innerHTML = "";

    const payload = {
      degree_level: document.getElementById("degree_level").value,
      height_feet: Number(document.getElementById("height_feet").value),
      height_inches: Number(document.getElementById("height_inches").value),
      fulfillment_method: document.getElementById("fulfillment_method").value,
      ceremony_date: document.getElementById("ceremony_date").value
    };

    try {
      const response = await fetch(SEARCH_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!data.ok) {
        borrowerMessage.textContent = "Something went wrong. Please try again.";
        return;
      }

      const results = data.results || [];

      if (results.length === 0) {
        borrowerMessage.textContent = "No matching gowns were found.";
        return;
      }

      borrowerMessage.textContent = `${results.length} match(es) found.`;

      results.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <p><strong>Name:</strong> ${item.name || ""}</p>
          <p><strong>Email:</strong> ${item.email || ""}</p>
          <p><strong>Degree Level:</strong> ${item.degree_level || ""}</p>
          <p><strong>Size Range:</strong> ${item.size_range_label || ""}</p>
          <p><strong>Hood Color:</strong> ${item.hood_color || ""}</p>
          <p><strong>Pickup / Shipping:</strong> ${item.fulfillment_method || ""}</p>
          <p><strong>Notes:</strong> ${item.notes || ""}</p>
        `;

        resultsContainer.appendChild(card);
      });
    } catch (error) {
      borrowerMessage.textContent = "Could not complete the search. Please try again.";
    }
  });
}
