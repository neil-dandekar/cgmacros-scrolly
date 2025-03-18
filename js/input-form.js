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
        // BMI is auto-calculated so we skip manual retrieval
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
        // Base formula: predicted spike = (carbs * 1.5) + (protein * 0.5) + (fats * 0.2)
        var predictedSpike = carbs * 1.5 + protein * 0.5 + fats * 0.2;

        // Hard-coded diabetic status adjustment:
        //   - "non-diabetic": decrease spike by 10%
        //   - "type1": no change
        //   - "type2": increase spike by 20%
        var adjustmentFactor = 1;
        if (diabetes === "non-diabetic") {
            adjustmentFactor = 0.9;
        } else if (diabetes === "type1") {
            adjustmentFactor = 1.0;
        } else if (diabetes === "type2") {
            adjustmentFactor = 1.2;
        }
        predictedSpike = predictedSpike * adjustmentFactor;
        predictedSpike = Math.round(predictedSpike * 10) / 10; // round to 1 decimal

        // Analysis based on the predicted spike:
        // For many non-diabetic individuals, post-prandial levels below 140 mg/dL are ideal,
        // between 140 and 180 mg/dL are moderate, and above 180 mg/dL are high.
        var analysisText = "";
        if (predictedSpike < 140) {
            analysisText =
                "Your predicted glucose spike is within an ideal range. " +
                "This indicates that your macronutrient distribution is effectively controlling your blood sugar levels. " +
                "Keep maintaining a balanced diet to help sustain these levels. " +
                "Great job!";
        } else if (predictedSpike < 180) {
            analysisText =
                "Your predicted glucose spike is moderate. " +
                "While your values are acceptable, there is room for improvement in managing your blood sugar levels. " +
                "Consider reviewing your meal composition—especially your carbohydrate intake—to lower your spike further. " +
                "Small adjustments could make a significant difference.";
        } else {
            analysisText =
                "Your predicted glucose spike is high, which suggests that your current macronutrient intake may be causing significant blood sugar fluctuations. " +
                "High spikes over time can increase health risks. " +
                "It may be beneficial to reduce your carbohydrate load or increase dietary fiber. " +
                "Consider consulting a nutrition expert for personalized advice.";
        }

        // Display the prediction and analysis using innerHTML so the nested <p> is retained.
        // Display the prediction and analysis with color/emojis based on risk level
        var outputHTML =
            "<p>Predicted Glucose Spike: " + predictedSpike + " mg/dL</p>";

        if (predictedSpike < 140) {
            outputHTML +=
                "<p id='pred-out-analysis' style='color:green;'>✅ " +
                analysisText +
                "</p>";
        } else if (predictedSpike < 180) {
            outputHTML +=
                "<p id='pred-out-analysis' style='color:orange;'>😐 " +
                analysisText +
                "</p>";
        } else {
            outputHTML +=
                "<p id='pred-out-analysis' style='color:red;'>⚠️ " +
                analysisText +
                "</p>";
        }

        document.getElementById("prediction-output").innerHTML = outputHTML;
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
    // Auto-calculate BMI when height or weight changes
    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");
    const bmiInput = document.getElementById("bmi");

    function updateBMI() {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        if (!isNaN(height) && height > 0 && !isNaN(weight) && weight > 0) {
            // For imperial units: BMI = (weight (lbs) / (height (inches)^2)) * 703
            const bmiCalculated = (weight / (height * height)) * 703;
            bmiInput.value = bmiCalculated.toFixed(1);
        } else {
            bmiInput.value = "";
        }
    }

    heightInput.addEventListener("input", updateBMI);
    weightInput.addEventListener("input", updateBMI);

    const sliders = ["bmi", "age", "gut", "gender", "protein", "carbs", "fat"];
    const correctWeights = {
        bmi: 85,
        age: 65,
        gut: 90,
        gender: 30,
        protein: 50,
        carbs: 95,
        fat: 40,
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

    document
        .getElementById("calculate-score")
        .addEventListener("click", function () {
            let totalDifference = 0;
            let maxDifference = 0;
            sliders.forEach((factor) => {
                let userValue = parseInt(
                    document.getElementById(`${factor}-importance`).value
                );
                let correctValue = correctWeights[factor];
                let difference = Math.abs(userValue - correctValue);
                totalDifference += difference;
                maxDifference += 100;
                userErrors[factor] = difference;
            });
            let accuracyScore = Math.round(
                (1 - totalDifference / maxDifference) * 100
            );
            let feedbackMessage =
                accuracyScore > 80
                    ? "Great job!"
                    : accuracyScore > 60
                    ? "Not bad, but some factors could use adjusting."
                    : "There's room for improvement—review the visualizations!";
            document.getElementById(
                "score-result"
            ).innerHTML = `Your accuracy score: <strong>${accuracyScore}%</strong>. ${feedbackMessage}`;
            const correctDiabetesAnswer = "type2";
            const selectedDiabetes = document.querySelector(
                'input[name="diabetes-choice"]:checked'
            );
            if (!selectedDiabetes) {
                document.getElementById("diabetes-feedback").innerText =
                    "Please select an answer for the diabetes question.";
            } else if (selectedDiabetes.value === correctDiabetesAnswer) {
                document.getElementById("diabetes-feedback").innerText =
                    "✅ Correct! Type 2 diabetics have the highest glucose spikes.";
            } else {
                document.getElementById("diabetes-feedback").innerText =
                    "❌ Not quite! Type 2 diabetics tend to have the highest glucose spikes.";
            }
            window.userErrors = userErrors;
            updateErrorMessages();
        });

    function updateErrorMessages() {
        let errorMessages = {
            2: `<strong>Your BMI prediction was off by <strong>${
                window.userErrors?.bmi || 0
            }%</strong>`,
            3: `<strong>Your Age prediction was off by <strong>${
                window.userErrors?.age || 0
            }%</strong>`,
            4: `<strong>Your Gut Microbiome prediction was off by <strong>${
                window.userErrors?.gut || 0
            }%</strong>`,
            5: `<strong>Your Gender prediction was off by <strong>${
                window.userErrors?.gender || 0
            }%</strong>`,
            6: `</strong>Your prediction of diabetic status impact was off.`,
        };

        document.querySelectorAll(".step").forEach((stepElement, index) => {
            let stepNumber = index + 1;
            let paragraph = stepElement.querySelector("p");
            if (!paragraph) return;
            let existingErrorBox =
                stepElement.querySelector(".error-box") ||
                document.createElement("p");
            existingErrorBox.classList.add("error-box");
            paragraph.insertAdjacentElement("afterend", existingErrorBox);
            existingErrorBox.innerHTML = errorMessages[stepNumber] || "";
        });

        let scatterErrorMessages = {
            2: `<strong>Your Protein prediction was off by <strong>${
                window.userErrors?.protein || 0
            }%</strong>`,
            3: `<strong>Your Carbohydrate prediction was off by <strong>${
                window.userErrors?.carbs || 0
            }%</strong>`,
            4: `<strong>Your Fat prediction was off by <strong>${
                window.userErrors?.fat || 0
            }%</strong>`,
        };

        document.querySelectorAll(".step2").forEach((stepElement, index) => {
            let stepNumber = index + 2; // Step2 starts at 2
            let paragraph = stepElement.querySelector("p");
            if (!paragraph) return;
            let existingErrorBox =
                stepElement.querySelector(".error-box") ||
                document.createElement("p");
            existingErrorBox.classList.add("error-box");
            paragraph.insertAdjacentElement("afterend", existingErrorBox);
            existingErrorBox.innerHTML = scatterErrorMessages[stepNumber] || "";
        });
    }
});
