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

    // True importance scores based on research (0-100 scale)
    const correctWeights = {
        bmi: 85,
        age: 65,
        gut: 90,
        gender: 30,
        protein: 50,
        carbs: 95,
        fat: 40
    };

    let userErrors = {}; // Stores how far off the user was

    // Real-time slider updates
    sliders.forEach((factor) => {
        let slider = document.getElementById(`${factor}-importance`);
        let displayValue = document.getElementById(`${factor}-value`);

        slider.addEventListener("input", function () {
            displayValue.textContent = slider.value + "%";
        });
    });

    // Calculate accuracy score and store errors
    document.getElementById("calculate-score").addEventListener("click", function () {
        let totalDifference = 0;
        let maxDifference = 0;

        sliders.forEach((factor) => {
            let userValue = parseInt(document.getElementById(`${factor}-importance`).value);
            let correctValue = correctWeights[factor];

            let difference = Math.abs(userValue - correctValue);
            totalDifference += difference;
            maxDifference += 100; // Each factor max difference is 100

            // Store how far they were off
            userErrors[factor] = difference;
        });

        // Convert to a percentage score
        let accuracyScore = Math.round((1 - totalDifference / maxDifference) * 100);

        // Generate feedback message
        let feedbackMessage = "";
        if (accuracyScore > 80) {
            feedbackMessage = "Great job! You have a strong understanding of glucose spikes.";
        } else if (accuracyScore > 60) {
            feedbackMessage = "Not bad! You got most factors right but some could use tweaking.";
        } else {
            feedbackMessage = "Looks like there’s room for improvement. Check out the explanations in the visualization!";
        }

        // Display the score
        document.getElementById("score-result").innerHTML =
            `Your accuracy score: <strong>${accuracyScore}%</strong>. ${feedbackMessage}`;

        // Store errors globally for later reference in scrolling
        window.userErrors = userErrors;

        // Call function to display errors under each day
        updateErrorMessages();
    });

    // Function to inject errors dynamically under each day
    function updateErrorMessages() {
        let errorMessages = {
            2: `Your BMI prediction was off by <strong>${window.userErrors?.bmi || 0}%</strong>.`,
            3: `Your Age prediction was off by <strong>${window.userErrors?.age || 0}%</strong>.`,
            4: `Your Gut Microbiome prediction was off by <strong>${window.userErrors?.gut || 0}%</strong>.`,
            5: `Your Gender prediction was off by <strong>${window.userErrors?.gender || 0}%</strong>.`,
            6: `Your Protein prediction was off by <strong>${window.userErrors?.protein || 0}%</strong>.`,
            7: `Your Carbs prediction was off by <strong>${window.userErrors?.carbs || 0}%</strong>.`,
            8: `Your Fat prediction was off by <strong>${window.userErrors?.fat || 0}%</strong>.`
        };
    
        document.querySelectorAll(".step").forEach((stepElement, index) => {
            let stepNumber = index + 1;
    
            // Find the paragraph inside the step
            let paragraph = stepElement.querySelector("p");
    
            if (!paragraph) return; // Skip if no paragraph found
    
            // Find or create error message container
            let existingErrorBox = stepElement.querySelector(".error-box");
            if (!existingErrorBox) {
                existingErrorBox = document.createElement("p");
                existingErrorBox.classList.add("error-box");
                paragraph.insertAdjacentElement("afterend", existingErrorBox); // Place it directly under the paragraph
            }
    
            // Update error message for this step
            existingErrorBox.innerHTML = errorMessages[stepNumber] || "";
        });
    }
    
});





