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

// // Show quiz modal when scrolling down from intro
// document.addEventListener("DOMContentLoaded", function () {
//     setTimeout(() => {
//         document.getElementById("quiz-modal").style.display = "block";
//     }, 2000); // Delay pop-up slightly after page loads

//     document.getElementById("submit-quiz").addEventListener("click", function () {
//         let results = {
//             bmi: document.getElementById("bmi-importance").value,
//             age: document.getElementById("age-importance").value,
//             gut: document.getElementById("gut-importance").value,
//             gender: document.getElementById("gender-importance").value,
//             protein: document.getElementById("protein-importance").value,
//             carbs: document.getElementById("carbs-importance").value,
//             fat: document.getElementById("fat-importance").value
//         };
//         console.log("User Input:", results);

//         // Hide the modal
//         document.getElementById("quiz-modal").style.display = "none";
//     });
// });


// //// FOR QUIZ IN BEGGINING

// document.addEventListener("DOMContentLoaded", function () {
//     const sliders = ["bmi", "age", "gut", "gender", "protein", "carbs", "fat"];

//     sliders.forEach((factor) => {
//         let slider = document.getElementById(`${factor}-importance`);
//         let displayValue = document.getElementById(`${factor}-value`);

//         slider.addEventListener("input", function () {
//             displayValue.textContent = slider.value + "%";
//         });
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const sliders = ["bmi", "age", "gut", "gender", "protein", "carbs", "fat"];

//     // True importance scores based on research (0-100 scale)
//     const correctWeights = {
//         bmi: 85,     // BMI is a major factor
//         age: 65,     // Age affects metabolism, but less than BMI
//         gut: 90,     // Gut microbiome is highly influential
//         gender: 30,  // Gender has a smaller impact
//         protein: 50, // Moderate effect
//         carbs: 95,   // Carbs have the strongest effect
//         fat: 40      // Fat has a weaker effect
//     };

//     // Real-time slider updates
//     sliders.forEach((factor) => {
//         let slider = document.getElementById(`${factor}-importance`);
//         let displayValue = document.getElementById(`${factor}-value`);

//         slider.addEventListener("input", function () {
//             displayValue.textContent = slider.value + "%";
//         });
//     });

//     // Calculate accuracy score
//     document.getElementById("calculate-score").addEventListener("click", function () {
//         let totalDifference = 0;
//         let maxDifference = 0;

//         sliders.forEach((factor) => {
//             let userValue = parseInt(document.getElementById(`${factor}-importance`).value);
//             let correctValue = correctWeights[factor];

//             let difference = Math.abs(userValue - correctValue);
//             totalDifference += difference;
//             maxDifference += 100; // Each factor max difference is 100
//         });

//         // Convert to a percentage score
//         let accuracyScore = Math.round((1 - totalDifference / maxDifference) * 100);

//         // Generate feedback message
//         let feedbackMessage = "";
//         if (accuracyScore > 80) {
//             feedbackMessage = "Great job! You have a strong understanding of glucose spikes.";
//         } else if (accuracyScore > 60) {
//             feedbackMessage = "Not bad! You got most factors right but some could use tweaking.";
//         } else {
//             feedbackMessage = "Looks like there’s room for improvement. Check out the explanations in the visualization!";
//         }

//         // Display the score
//         document.getElementById("score-result").innerHTML = 
//             `Your accuracy score: <strong>${accuracyScore}%</strong>. ${feedbackMessage}`;
//     });
// });

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
