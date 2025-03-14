
document
    .getElementById("glucose-form")
    .addEventListener("submit", function (e) {
        e.preventDefault();

        // Clear previous error messages
        var errorMessages = document.querySelectorAll(
            "#user-form .error-message"
        );
        errorMessages.forEach(function (msg) {
            msg.style.display = "none";
        });

        // Retrieve and parse form values
        var height = parseFloat(document.getElementById("height").value);
        var weight = parseFloat(document.getElementById("weight").value);
        var age = parseFloat(document.getElementById("age").value);
        var gender = document.getElementById("gender").value;
        var bmi = parseFloat(document.getElementById("bmi").value);
        var diabetes = document.getElementById("diabetes").value;
        var protein = parseFloat(document.getElementById("protein").value);
        var carbs = parseFloat(document.getElementById("carbs").value);
        var fats = parseFloat(document.getElementById("fats").value);

        var isValid = true;

        // Basic validations with error messages
        if (isNaN(height) || height <= 0) {
            showError("height", "Please enter a valid height.");
            isValid = false;
        }
        if (isNaN(weight) || weight <= 0) {
            showError("weight", "Please enter a valid weight.");
            isValid = false;
        }
        if (isNaN(age) || age <= 0) {
            showError("age", "Please enter a valid age.");
            isValid = false;
        }
        if (gender === "") {
            showError("gender", "Please select your gender.");
            isValid = false;
        }
        if (isNaN(bmi) || bmi <= 0) {
            showError("bmi", "Please enter a valid BMI.");
            isValid = false;
        }
        if (diabetes === "") {
            showError("diabetes", "Please select your diabetes status.");
            isValid = false;
        }
        if (isNaN(protein) || protein < 0) {
            showError("protein", "Please enter a valid protein amount.");
            isValid = false;
        }
        if (isNaN(carbs) || carbs < 0) {
            showError("carbs", "Please enter a valid carbohydrate amount.");
            isValid = false;
        }
        if (isNaN(fats) || fats < 0) {
            showError("fats", "Please enter a valid fat amount.");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Simulate prediction calculation (replace with your ML model)
        // Example formula: predicted spike = (carbs * 1.5) + (protein * 0.5) + (fats * 0.2)
        var predictedSpike = carbs * 1.5 + protein * 0.5 + fats * 0.2;
        predictedSpike = Math.round(predictedSpike * 10) / 10; // round to 1 decimal

        // Display the prediction
        document.getElementById("prediction-output").innerText =
            "Predicted Glucose Spike: " + predictedSpike + " mg/dL";
    });

// Helper function to show error messages
function showError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
        errorElement.innerText = message;
        errorElement.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const sliders = ["bmi", "age", "gut", "gender", "protein", "carbs", "fat"];

    const correctWeights = {
        bmi: 85,
        age: 65,
        gut: 90,
        gender: 30,
        protein: 50,
        carbs: 95,
        fat: 40
    };

    let userErrors = {};

    // Real-time slider updates
    sliders.forEach((factor) => {
        let slider = document.getElementById(`${factor}-importance`);
        let displayValue = document.getElementById(`${factor}-value`);

        slider.addEventListener("input", function () {
            displayValue.textContent = slider.value + "%";
        });
    });

    document.getElementById("calculate-score").addEventListener("click", function () {
        let totalDifference = 0;
        let maxDifference = 0;

        sliders.forEach((factor) => {
            let userValue = parseInt(document.getElementById(`${factor}-importance`).value);
            let correctValue = correctWeights[factor];

            let difference = Math.abs(userValue - correctValue);
            totalDifference += difference;
            maxDifference += 100;
            userErrors[factor] = difference;
        });

        let accuracyScore = Math.round((1 - totalDifference / maxDifference) * 100);
        let feedbackMessage = accuracyScore > 80 ? "Great job!" :
                              accuracyScore > 60 ? "Not bad, but some factors could use adjusting." :
                              "There's room for improvement—review the visualizations!";

        document.getElementById("score-result").innerHTML =
            `Your accuracy score: <strong>${accuracyScore}%</strong>. ${feedbackMessage}`;

        // **Diabetes Quiz Evaluation**
        const correctDiabetesAnswer = "type2";
        const selectedDiabetes = document.querySelector('input[name="diabetes-choice"]:checked');

        if (!selectedDiabetes) {
            document.getElementById("diabetes-feedback").innerText = "Please select an answer for the diabetes question.";
        } else if (selectedDiabetes.value === correctDiabetesAnswer) {
            document.getElementById("diabetes-feedback").innerText = "✅ Correct! Type 2 diabetics have the highest glucose spikes.";
        } else {
            document.getElementById("diabetes-feedback").innerText = "❌ Not quite! Type 2 diabetics tend to have the highest glucose spikes.";
        }

        window.userErrors = userErrors;
        updateErrorMessages();
    });

    function updateErrorMessages() {
        let errorMessages = {
            2: `<strong>Your BMI prediction was off by <strong>${window.userErrors?.bmi || 0}%</strong>`,
            3: `<strong>Your Age prediction was off by <strong>${window.userErrors?.age || 0}%</strong>`,
            4: `<strong>Your Gut Microbiome prediction was off by <strong>${window.userErrors?.gut || 0}%</strong>`,
            5:  `<strong>Your Gender prediction was off by <strong>${window.userErrors?.gender || 0}%</strong>`,
            // 6: `</strong>Your Diabetes Status prediction was off.`,
            // 7: `<strong>Day 7: Pre-Diabetic Prediction</strong><br>Your Pre-Diabetic prediction was off.`,
            // 9: `<strong>Day 9: Diabetic Status (All)</strong><br>Your prediction of diabetic status impact was off.`,
            6: `</strong>Your prediction of diabetic status impact was off.`,
        };

        document.querySelectorAll(".step").forEach((stepElement, index) => {
            let stepNumber = index + 1;
            let paragraph = stepElement.querySelector("p");
            if (!paragraph) return;

            let existingErrorBox = stepElement.querySelector(".error-box") || document.createElement("p");
            existingErrorBox.classList.add("error-box");
            paragraph.insertAdjacentElement("afterend", existingErrorBox);
            existingErrorBox.innerHTML = errorMessages[stepNumber] || "";
        });

        // Scatterplot error messages
        let scatterErrorMessages = {
            2: `<strong>Your Protein prediction was off by <strong>${window.userErrors?.protein || 0}%</strong>`,
            3: `<strong>Your Carbohydrate prediction was off by <strong>${window.userErrors?.carbs || 0}%</strong>`,
            4: `<strong>Your Fat prediction was off by <strong>${window.userErrors?.fat || 0}%</strong>`,
        };

        document.querySelectorAll(".step2").forEach((stepElement, index) => {
            let stepNumber = index + 2; // Step2 starts at 2
            let paragraph = stepElement.querySelector("p");
            if (!paragraph) return;

            let existingErrorBox = stepElement.querySelector(".error-box") || document.createElement("p");
            existingErrorBox.classList.add("error-box");
            paragraph.insertAdjacentElement("afterend", existingErrorBox);
            existingErrorBox.innerHTML = scatterErrorMessages[stepNumber] || "";
        });
    }
});
