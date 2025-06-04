import { drawIndustryChart, drawCountryChart } from "./charts.js";

let originalData = [];
let currentFilteredData = [];
let currentDisplayIndex = 0;
const itemsPerPage = 5;

// API Data fetch
fetch("https://dujour.squiz.cloud/developer-challenge/data")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    originalData = data;
    populateFilters(data);
    restorePreferences();
    applyFiltersAndSort();
  })
  .catch((error) => {
    showError("Error loading data. Please try again later.");
    console.error("Fetch error:", error);
  });

// API Error message
function showError(message) {
  const errorContainer = document.getElementById("error-message");
  errorContainer.textContent = message;
}

// Displaying data function
function displayData(data, reset = false) {
  const container = document.getElementById("data-container");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  if (reset) {
    container.innerHTML = "";
    currentDisplayIndex = 0;
  }

  const nextItems = data.slice(
    currentDisplayIndex,
    currentDisplayIndex + itemsPerPage
  );

  if (nextItems.length === 0 && currentDisplayIndex === 0) {
    container.innerHTML =
      "<p class='no-results'>Sorry, that filter combination has no results. Please try different combination.</p>";
    loadMoreBtn.style.display = "none";
    return;
  }

  // For each loop to create table elements based on the given data
  nextItems.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.country}</td>
      <td>${item.industry}</td>
      <td>${item.numberOfEmployees}</td>
    `;
    container.appendChild(row);
  });

  currentDisplayIndex += itemsPerPage;

  // Show/hide Load More button
  if (currentDisplayIndex >= data.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }

  // End message after no more results is left to show by "Load more" button
  const endMessage = document.getElementById("end-message");
  endMessage.style.display = "none";

  loadMoreBtn.addEventListener("click", () => {
    if (loadMoreBtn.style.display === "none") {
      endMessage.style.display = "block";
    }
  });
}

// Function to create filters
function populateFilters(data) {
  const industrySet = new Set();
  const countrySet = new Set();

  data.forEach((item) => {
    industrySet.add(item.industry);
    countrySet.add(item.country);
  });

  const industryFilter = document.getElementById("industry-filter");
  const countryFilter = document.getElementById("country-filter");

  industrySet.forEach((industry) => {
    const option = document.createElement("option");
    option.value = industry;
    option.textContent = industry;
    industryFilter.appendChild(option);
  });

  countrySet.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countryFilter.appendChild(option);
  });
}

// Filter sorting logic function
function applyFiltersAndSort() {
  const industry = document.getElementById("industry-filter").value;
  const country = document.getElementById("country-filter").value;
  const search = document.getElementById("search-input").value.toLowerCase();
  const sort = document.getElementById("sort-filter").value;

  let filtered = originalData.filter((item) => {
    return (
      (!industry || item.industry === industry) &&
      (!country || item.country === country) &&
      (!search || item.name.toLowerCase().includes(search))
    );
  });

  switch (sort) {
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "employees-asc":
      filtered.sort((a, b) => a.numberOfEmployees - b.numberOfEmployees);
      break;
    case "employees-desc":
      filtered.sort((a, b) => b.numberOfEmployees - a.numberOfEmployees);
      break;
  }

  currentFilteredData = filtered;

  // Redraw charts with filtered data
  drawIndustryChart(currentFilteredData);
  drawCountryChart(currentFilteredData);

  displayData(currentFilteredData, true);
}

// Function to save user preferences
function savePreferences() {
  const prefs = {
    industry: document.getElementById("industry-filter").value,
    country: document.getElementById("country-filter").value,
    sort: document.getElementById("sort-filter").value,
    search: document.getElementById("search-input").value,
  };
  localStorage.setItem("userFilters", JSON.stringify(prefs));
}

// Restoring user preferences after browser refresh
function restorePreferences() {
  const saved = JSON.parse(localStorage.getItem("userFilters"));
  const sortFilter = document.getElementById("sort-filter");

  if (saved) {
    document.getElementById("industry-filter").value = saved.industry || "";
    document.getElementById("country-filter").value = saved.country || "";
    sortFilter.value = saved.sort || "name-asc";
    document.getElementById("search-input").value = saved.search || "";
  } else {
    // No saved preferences, default to "name-asc"
    sortFilter.value = "name-asc";
  }
}

// Add event listeners AFTER page load
document.addEventListener("DOMContentLoaded", () => {
  restorePreferences();
  applyFiltersAndSort();

  // Get all the filter elements
  const industryFilter = document.getElementById("industry-filter");
  const countryFilter = document.getElementById("country-filter");
  const sortFilter = document.getElementById("sort-filter");
  const searchInput = document.getElementById("search-input");

  // Add event listeners to each filter
  industryFilter.addEventListener("change", () => {
    savePreferences();
    applyFiltersAndSort();
  });

  countryFilter.addEventListener("change", () => {
    savePreferences();
    applyFiltersAndSort();
  });

  sortFilter.addEventListener("change", () => {
    savePreferences();
    applyFiltersAndSort();
  });

  searchInput.addEventListener("input", () => {
    savePreferences();
    applyFiltersAndSort();
  });

  document.getElementById("loadMoreBtn").addEventListener("click", () => {
    displayData(currentFilteredData);
  });
});
