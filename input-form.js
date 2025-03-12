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
