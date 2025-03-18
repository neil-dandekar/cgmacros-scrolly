var currentDay = 1;
var circles;
var simulation;
var xScale, yScale, radiusScale, colorScale;
let currentScatterPlot = 1;

// Tooltip div selection
const tooltip = d3.select("#tooltip");

// Discrete color mapping for gut health => 1,2,3
const gutColors = {
    1: "#76c893", // red
    2: "#e9c46a", // yellow
    3: "#e63946", // green
};

const healthLabels = {
    1: "Healthy",
    2: "Moderate",
    3: "Unhealthy",
};

// Update function to transition bubbles smoothly
function updateDay(day) {
    currentDay = day;
    d3.select("#dayLabel").text(`Day ${day}`);

    simulation
        .force("y", d3.forceY((d) => yScale(d["day" + day])).strength(0.6)) // Slightly softer
        .alpha(0.5) // Reheat simulation
        .restart();
}

function updateScatterPlot(step) {
    if (step === 1) {
        d3.select("#scatter1").style("display", "block");
        d3.select("#scatter2").style("display", "none");
        d3.select("#scatter3").style("display", "none");
    } else if (step > 1) {
        d3.select("#scatter_viz")
            .selectAll(".scatter-plot")
            .style("display", "none");

        d3.select(`#scatter${step}`)
            .style("display", "block")
            .style("opacity", 1); // No transition here for an instant update
    }
}

// Load the data and initialize the visualization
d3.csv("data/newglucosespikedata.csv").then((data) => {
    data.forEach((d) => {
        d.bmi = +d.bmi;
        d.gut_microbiome_health = +d.gut_microbiome_health;
        for (let i = 1; i <= 10; i++) {
            d["day" + i] = +d["day" + i];
        }
    });

    const width = 800,
        height = 650;
    const margin = { top: 150, right: 50, bottom: 70, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    xScale = d3
        .scalePoint()
        .domain(["Non-Diabetic", "Pre-Diabetic", "Type 2 Diabetic"])
        .range([margin.left, margin.left + innerWidth])
        .padding(0.5);

    yScale = d3
        .scaleLinear()
        .domain([0, 160])
        .range([height - margin.bottom, margin.top]);

    radiusScale = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.bmi), d3.max(data, (d) => d.bmi)])
        .range([4, 15]);

    colorScale = d3
        .scaleOrdinal()
        .domain([1, 2, 3])
        .range(["#ADD8E6", "#6495ED", "#00008B"]);

    const svg = d3
        .select("#glucose_viz")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // For legend
    const bmiValues = [20, 25, 30, 35, 40];
    // Shifted up by 20px (from margin.top - 40 to margin.top - 60)
    const legendGroup = svg
        .append("g")
        .attr("class", "bmi-legend")
        .attr(
            "transform",
            `translate(${margin.left + 35}, ${margin.top - 60})`
        );
    // Add legend circles
    legendGroup
        .selectAll("circle")
        .data(bmiValues)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => i * 60) // Horizontal spacing
        .attr("cy", 0)
        .attr("r", (d) => radiusScale(d))
        .attr("fill", "#333")
        .attr("opacity", 0.7);

    // Add BMI labels
    legendGroup
        .selectAll("text")
        .data(bmiValues)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * 60) // Horizontal spacing
        .attr("y", -20)
        .text((d) => `BMI: ${d}`)
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");

    // Add legend title
    legendGroup
        .append("text")
        .attr("x", (bmiValues.length * 60) / 2) // Center the title
        .attr("y", -40)
        .text("BMI Scale")
        .attr("font-weight", "bold")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle");

    // For gut health legend
    // Shifted up by 20px (from margin.top - 40 to margin.top - 60)
    const gutHealthLegend = svg
        .append("g")
        .attr("class", "gut-health-legend")
        .attr(
            "transform",
            `translate(${margin.left + 430}, ${margin.top - 60})`
        );

    const gutHealthData = [
        { level: healthLabels[1], color: gutColors[1] },
        { level: healthLabels[2], color: gutColors[2] },
        { level: healthLabels[3], color: gutColors[3] },
    ];

    // Add color circles for gut health
    gutHealthLegend
        .selectAll("circle")
        .data(gutHealthData)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => i * 80)
        .attr("cy", 0)
        .attr("r", 6)
        .attr("fill", (d) => d.color);

    // Add labels for gut health
    gutHealthLegend
        .selectAll("text")
        .data(gutHealthData)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * 80)
        .attr("y", -20)
        .text((d) => d.level)
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");

    // Add title for gut health legend
    gutHealthLegend
        .append("text")
        .attr("x", (gutHealthData.length * 50) / 2)
        .attr("y", -40)
        .text("Gut Health")
        .attr("font-weight", "bold")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle");

    // Shifted up by 20px (from margin.top - 105 to margin.top - 125)
    svg.insert("rect", ":first-child")
        .attr("class", "legend-box")
        .attr("x", margin.left + 0)
        .attr("y", margin.top - 125)
        .attr("width", 650)
        .attr("height", 90)
        .attr("rx", 5)
        .attr("ry", 5);

    // Update axes with thicker strokes and the specified color

    // X-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("path, line")
        .attr("stroke", "#473b33")
        .attr("stroke-width", "2");

    // Y-axis (only one is needed; remove duplicate if unnecessary)
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale))
        .selectAll("path, line")
        .attr("stroke", "#473b33")
        .attr("stroke-width", "2");

    // Add axis labels similar to the second visualization:

    // Y-axis label: Rotated and centered alongside the y-axis.
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr(
            "transform",
            `translate(${margin.left / 1.5}, ${height / 1.8}) rotate(-90)`
        )
        .style("text-anchor", "middle")
        .style("fill", "#473b33")
        .style("font-weight", "bold")
        .text("Glucose Spike (mg/dL)");

    circles = svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("stroke", "black")
        .attr("fill", (d) => gutColors[d.gut_microbiome_health] || "#999")
        .attr("r", (d) => (d.bmi > 0 ? radiusScale(d.bmi) : 3))
        .style("opacity", 0.85)
        // Tooltip interactions
        .on("mouseover", function (event, d) {
            tooltip.style("display", "block");
            // d3.select(this).transition().duration(200).style("opacity", 0.85);
        })
        .on("mousemove", function (event, d) {
            let healthStatus =
                healthLabels[d.gut_microbiome_health] || "Unknown";
            tooltip.html(`
                <b>ID:</b> ${d.participant_id}<br/>
                Gender: ${d.gender} <br/>
                Age: ${d.age}<br/>
                Gut: ${healthStatus} <br/>
                BMI: ${d.bmi.toFixed(2)}<br/>
                Avg. Glucose Spike: ${d["day" + currentDay].toFixed(2)}
            `);

            let tipWidth = tooltip.node().offsetWidth;
            let tipHeight = tooltip.node().offsetHeight;

            tooltip
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - tipHeight - 10 + "px");
        })
        .on("mouseout", function () {
            tooltip.style("display", "none");
            // d3.select(this).transition().duration(200).style("opacity", 0.7);
        });

    // Force simulation to prevent overlap but keep bubbles close
    simulation = d3
        .forceSimulation(data)
        .force(
            "x",
            d3.forceX((d) => xScale(d.diabetes_status)).strength(0.8) // ✅ Increased strength for tighter grouping
        )
        .force(
            "y",
            d3.forceY((d) => yScale(d["day" + currentDay])).strength(0.5) // ✅ Slightly weaker to allow lateral movement
        )
        .force(
            "collide",
            d3.forceCollide((d) => radiusScale(d.bmi) + 1) // ✅ Adjust spacing
        )
        .alphaDecay(0.1) // ✅ Faster stabilization
        .on("tick", ticked);

    function ticked() {
        circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    }

    if (window.initScroll) {
        window.initScroll();
    }
});

// ----------------------------------------------------------------------------
// -----------------------------------  VIZ 2  --------------------------------
// ----------------------------------------------------------------------------
// Function to create scatter plots
function createScatterPlots() {
    const scatterViz = d3.select("#scatter_viz");

    // Create container divs for each scatter plot
    scatterViz
        .append("div")
        .attr("id", "scatter1")
        .attr("class", "scatter-plot")
        .style("display", "block");

    scatterViz
        .append("div")
        .attr("id", "scatter2")
        .attr("class", "scatter-plot")
        .style("display", "none");

    scatterViz
        .append("div")
        .attr("id", "scatter3")
        .attr("class", "scatter-plot")
        .style("display", "none");

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = 900 - margin.left - margin.right;
    const height = 550 - margin.top - margin.bottom;

    // Common color scale for all plots
    const colorScale = d3
        .scaleOrdinal()
        .domain(["Non-Diabetic", "Pre-Diabetic", "Type 2 Diabetic"])
        .range(["#76c893", "#e9c46a", "#e63946"]);

    d3.csv("data/meal_averages.csv").then(function (data) {
        // Create scatter plots for each macro
        createMacroPlot(data, "Protein", "#scatter1");
        createMacroPlot(data, "Carbs", "#scatter2");
        createMacroPlot(data, "Fat", "#scatter3");
    });

    function createMacroPlot(data, nutrientType, containerId) {
        const svg = d3
            .select(containerId)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => +d[nutrientType])])
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => +d.spike)])
            .range([height, 0]);

        // Add axes with thicker styling and the specified color
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("path, line")
            .attr("stroke", "#473b33")
            .attr("stroke-width", "2");

        svg.append("g")
            .call(d3.axisLeft(yScale))
            .selectAll("path, line")
            .attr("stroke", "#473b33")
            .attr("stroke-width", "2");

        // Add axis labels with thicker styling
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .style("text-anchor", "middle")
            .style("fill", "#473b33")
            .style("font-weight", "bold")
            .text(`${nutrientType} (g)`);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .style("text-anchor", "middle")
            .style("fill", "#473b33")
            .style("font-weight", "bold")
            .text("Glucose Spike (mg/dL)");

        // Line of best fit
        const diabeticStatus = [
            "Non-Diabetic",
            "Pre-Diabetic",
            "Type 2 Diabetic",
        ];

        diabeticStatus.forEach((status) => {
            // Filter data for this status
            const statusData = data.filter((d) => d.diabetic_status === status);

            // Calculate regression based on your data subset
            const regression = calculateRegression(statusData, nutrientType);

            // Override the regression line endpoints using the xScale's domain
            const xDomain = xScale.domain();
            regression.points = [
                [
                    xDomain[0],
                    regression.slope * xDomain[0] + regression.intercept,
                ],
                [
                    xDomain[1],
                    regression.slope * xDomain[1] + regression.intercept,
                ],
            ];

            // Create line generator
            const line = d3
                .line()
                .x((d) => xScale(d[0]))
                .y((d) => yScale(d[1]));

            // Add the regression line
            svg.append("path")
                .datum(regression.points)
                .attr("class", "regression-line")
                .attr("fill", "none")
                .attr("stroke", colorScale(status))
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", function () {
                    return this.getTotalLength();
                })
                .attr("stroke-dashoffset", function () {
                    return this.getTotalLength();
                })
                .attr("d", line)
                .transition()
                .delay(500) // Wait for scatter plot to appear
                .duration(1000)
                .attr("stroke-dashoffset", 0);
        });

        let currentlySelectedStatus = null;

        // Background rectangle for click exiting (resets filtering)
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "transparent")
            .lower() // ensure it’s behind the circles
            .on("click", function () {
                currentlySelectedStatus = null;
                svg.selectAll("circle").style("opacity", 0.85);
            });

        // Add circles
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(+d[nutrientType]))
            .attr("cy", (d) => yScale(+d.spike))
            .attr("r", 6) // slightly increased radius from 5 to 6
            .style("fill", (d) => colorScale(d.diabetic_status))
            .style("opacity", 0.85) // match first viz default opacity
            .attr("stroke", "black") // match first viz border color
            .attr("stroke-width", 1) // default thin border

            // Filtering: on click adjust opacity of non-selected circles
            .on("click", function (event, d) {
                event.stopPropagation();
                if (currentlySelectedStatus === d.diabetic_status) {
                    currentlySelectedStatus = null;
                    svg.selectAll("circle").style("opacity", 0.85);
                } else {
                    currentlySelectedStatus = d.diabetic_status;
                    svg.selectAll("circle").style("opacity", (dot) =>
                        dot.diabetic_status === currentlySelectedStatus
                            ? 0.85
                            : 0.2
                    );
                }
            })

            // Tooltip interactions with hover effect
            .on("mouseover", function (event, d) {
                tooltip.style("display", "block");
                // On hover, add a black outline with a slightly thicker stroke
                d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
            })
            .on("mousemove", function (event, d) {
                tooltip
                    .html(
                        `
            <strong>Meal:</strong> ${d["Meal Type"]}<br/>
            <strong>Spike:</strong> ${(+d.spike).toFixed(1)} mg/dL<br/>
            <strong>${nutrientType}:</strong> ${(+d[nutrientType]).toFixed(1)}g
        `
                    )
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 10 + "px");
            })
            .on("mouseout", function () {
                tooltip.style("display", "none");
                // Revert to the default thin border
                d3.select(this).attr("stroke", "black").attr("stroke-width", 1);
            });

        addLegend(svg);
    }

    function addLegend(svg) {
        const legend = svg
            .append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - 120}, 20)`);

        const diabeticStatus = [
            "Non-Diabetic",
            "Pre-Diabetic",
            "Type 2 Diabetic",
        ];

        diabeticStatus.forEach((status, i) => {
            legend
                .append("circle")
                .attr("cx", 0)
                .attr("cy", i * 20)
                .attr("r", 5)
                .style("fill", colorScale(status));

            legend
                .append("text")
                .attr("x", 10)
                .attr("y", i * 20 + 5)
                .text(status)
                .style("font-size", "12px");
        });
    }
}

// Helper function for line of best fit
function calculateRegression(data, nutrientType) {
    const xValues = data.map((d) => +d[nutrientType]);
    const yValues = data.map((d) => +d.spike);

    const xMean = d3.mean(xValues);
    const yMean = d3.mean(yValues);

    const ssXX = d3.sum(xValues.map((x) => Math.pow(x - xMean, 2)));
    const ssXY = d3.sum(
        xValues.map((x, i) => (x - xMean) * (yValues[i] - yMean))
    );

    const slope = ssXY / ssXX;
    const intercept = yMean - slope * xMean;

    // Generate points for the line using the xScale domain from the caller
    const xDomain = [d3.min(xValues), d3.max(xValues)];
    const x1 = xDomain[0];
    const x2 = xDomain[1];

    const y1 = slope * x1 + intercept;
    const y2 = slope * x2 + intercept;

    return {
        slope: slope,
        intercept: intercept,
        points: [
            [x1, y1],
            [x2, y2],
        ],
    };
}

// Call the function after your existing code
createScatterPlots();
