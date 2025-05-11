const apiKey = "716ab90d877d8b375e5296b0999dc246";
const app_id = "fcda030b";
const user_id = "bhargaviraavi";

// Global variables
let currentMealType = "";
let currentCalorieFilter = "all";

// Function to fetch recipes based on meal type and calorie filter
async function foodData(mealType = "", calorieFilter = "all") {
  try {
    // Construct the API URL based on the meal type and calorie filter
    let foodApiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${mealType}&app_id=${app_id}&app_key=${apiKey}`;

    // Fetch data from the API
    let response = await fetch(foodApiUrl, {
      headers: {
        "Edamam-Account-User": user_id
      }
    });

    let data = await response.json();
    console.log("API Data:", data);

    let cardContainer = document.getElementById("card_container");
    cardContainer.innerHTML = ""; // Clear previous results

    if (!data.hits || data.hits.length === 0) {
      cardContainer.innerHTML = "<p>No recipes found for your search.</p>";
      return;
    }

    // Sort all recipes in increasing order of calories
    let sortedRecipes = data.hits.sort((a, b) => a.recipe.calories - b.recipe.calories);

    // Apply calorie filter
    let filteredRecipes = sortedRecipes.filter(hit => {
      let calories = hit.recipe.calories;

      if (calorieFilter === "low" && calories >= 1500) {
        return false;
      } else if (calorieFilter === "medium" && (calories < 1500 || calories > 3000)) {
        return false;
      } else if (calorieFilter === "high" && calories <= 3000) {
        return false;
      }
      return true;
    });

    // Display filtered and sorted recipes
    filteredRecipes.forEach(hit => {
      let recipe = hit.recipe;
      let calories = recipe.calories;

      let card = document.createElement("div");
      card.className = "col-md-4 mb-4 col-lg-3";
      card.innerHTML = `
        <div class="card">
          <img src="${recipe.image}" class="card-img-top" alt="${recipe.label}">
          <div class="card-body">
            <h5 class="card-title">${recipe.label}</h5>
            <p class="card-text">Calories: ${Math.round(calories)}</p>
            <a href="${recipe.url}" target="_blank" class="btn btn-primary">View Recipe</a>
          </div>
        </div>
      `;
      cardContainer.appendChild(card);
    });

  } catch (error) {
    console.log("Error fetching recipes:", error);
  }
}

// Meal type dropdown event
document.querySelectorAll(".dropdown-menu a[data-meal]").forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    currentMealType = item.getAttribute("data-meal");
    document.getElementById("search_input").value = currentMealType; // Automatically set search input to meal type
    foodData(currentMealType, currentCalorieFilter); // Fetch recipes based on selected meal type and current calorie filter
  });
});

// Calorie filter dropdown event
document.querySelectorAll(".dropdown-menu.calorie-filter a").forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    currentCalorieFilter = item.getAttribute("data-calories");
    foodData(currentMealType, currentCalorieFilter); // Fetch recipes based on current meal type and selected calorie filter
  });
});

// Search button event
document.getElementById("search_btn").addEventListener("click", (e) => {
  e.preventDefault();
  let searchTerm = document.getElementById("search_input").value.trim();
  if (searchTerm) {
    foodData(searchTerm, currentCalorieFilter); // Fetch recipes based on search term and current filters
  }
});

// Initial fetch for all recipes (optional)
foodData();
