const axios = require('axios');

async function getNutritionInfo() {
    const foodItems = document.getElementById('foodItem').value.split(',').map(item => item.trim());
    const apiKey = '4655a4d45f0b482182f2b4c2ca26cb00';  // Replace with your actual API key
    const apiId = '4b2afe14';    // Replace with your actual App ID
    const url = `https://trackapi.nutritionix.com/v2/natural/nutrients`;

    let allNutritionData = [];

    for (let foodItem of foodItems) {
        console.log(`Fetching nutritional info for: ${foodItem}`);
        console.log(`Using API Key: ${apiKey} and App ID: ${apiId}`);

        try {
            const response = await axios.post(url, { query: foodItem }, {
                headers: {
                    'x-app-id': '4b2afe14',
                    'x-app-key': '4655a4d45f0b482182f2b4c2ca26cb00',
                    'Content-Type': 'application/json'
                }
            });

            console.log('API Response:', response.data);

            allNutritionData = allNutritionData.concat(response.data.foods);
        } catch (error) {
            console.error('Error fetching nutrition info:', error);
            const resultsDiv = document.getElementById('nutritionResults');
            if (resultsDiv) {
                resultsDiv.innerHTML = `<p>Error fetching nutritional information for ${foodItem}. Please try again. Details: ${error.message}</p>`;
            }
        }
    }

    displayNutritionInfo(allNutritionData);
}

function displayNutritionInfo(data) {
    const resultsDiv = document.getElementById('nutritionResults');
    const totalDiv = document.getElementById('totalNutrition');
    if (resultsDiv) resultsDiv.innerHTML = '';
    if (totalDiv) totalDiv.innerHTML = '';

    let totalCalories = 0;
    let totalFat = 0;
    let totalCarbohydrates = 0;
    let totalProtein = 0;

    // Display individual nutritional information and calculate totals
    data.forEach(food => {
        totalCalories += food.nf_calories;
        totalFat += food.nf_total_fat;
        totalCarbohydrates += food.nf_total_carbohydrate;
        totalProtein += food.nf_protein;

        const foodDiv = document.createElement('div');
        foodDiv.classList.add('food-item');

        foodDiv.innerHTML = `
            <h3>${food.food_name}</h3>
            <p>Calories: ${food.nf_calories}</p>
            <p>Total Fat: ${food.nf_total_fat}g</p>
            <p>Total Carbohydrate: ${food.nf_total_carbohydrate}g</p>
            <p>Protein: ${food.nf_protein}g</p>
        `;

        if (resultsDiv) resultsDiv.appendChild(foodDiv);
    });

    // Round totals to two decimal places
    totalCalories = totalCalories.toFixed(2);
    totalFat = totalFat.toFixed(2);
    totalCarbohydrates = totalCarbohydrates.toFixed(2);
    totalProtein = totalProtein.toFixed(2);

    // Display collective total nutritional information
    if (totalDiv) {
        totalDiv.innerHTML = `
            <div class="total-item">
                <h3>Total Nutritional Information</h3>
                <p>Total Calories: ${totalCalories}</p>
                <p>Total Fat: ${totalFat}g</p>
                <p>Total Carbohydrate: ${totalCarbohydrates}g</p>
                <p>Total Protein: ${totalProtein}g</p>
            </div>
        `;
    }
}
