const contentData = {
  overview: `
      <h2 class="text-2xl font-bold mb-4">Overview</h2>
      <p>Social media sites like Twitter and Facebook, being user-friendly and accessible sources, provide opportunities for people to air their voices. People, irrespective of age group, use these sites to share every moment of their lives, making these sites flooded with data. Apart from these commendable features of social media, they also have downsides...</p>
  `,
  "call-for-participation": `
      <h2 class="text-2xl font-bold mb-4">Call for Participation</h2>
      <p>Details about the call for participation...</p>
  `,
  registration: `
      <h2 class="text-2xl font-bold mb-4">Registration</h2>
      <p>Details about registration...</p>
  `,
  "important-dates": `
      <h2 class="text-2xl font-bold mb-4">Important Dates</h2>
      <p>Details about important dates...</p>
  `,
  organizers: `
      <h2 class="text-2xl font-bold mb-4">Organizers</h2>
      <p>Details about the organizers...</p>
  `,
  "datasets-baseline-model": `
      <h2 class="text-2xl font-bold mb-4">Datasets and Baseline Model</h2>
      <p>Details about datasets and baseline model...</p>
  `,
  proceedings: `
      <h2 class="text-2xl font-bold mb-4">Proceedings</h2>
      <p>Details about the proceedings...</p>
  `,
};

document.querySelectorAll(".sidebar-btn, .dropdown-item").forEach((button) => {
  button.addEventListener("click", () => {
    const contentId = button.getAttribute("data-content");

    if (button.hasAttribute("data-url")) {
      const url = button.getAttribute("data-url");
      window.open(url, "_blank");
    } else {
      document.getElementById("content").innerHTML = contentData[contentId];
    }

    document.querySelectorAll(".sidebar-btn, .dropdown-item").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    // Update dropdown button text (for mobile)
    const dropdownBtn = document.getElementById("dropdown-btn");
    dropdownBtn.textContent = button.textContent.trim();

    // Hide dropdown on selection (for mobile)
    document.getElementById("dropdown-content").style.display = "none";
  });
});

document.getElementById("dropdown-btn").addEventListener("click", () => {
  const dropdownContent = document.getElementById("dropdown-content");
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});
