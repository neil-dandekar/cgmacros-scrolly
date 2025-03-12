var currentDay = 1;
var circles;
var simulation;
var xScale, yScale, radiusScale, colorScale;
let currentScatterPlot = 1;

// Tooltip div selection
const tooltip = d3.select("#tooltip");

// Discrete color mapping for gut health => 1,2,3
const gutColors = {
    1: "#7CB9E8", // darker light blue
    2: "#4169E1", // darker medium blue
    3: "#000080", // navy blue
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
    // Hide all plots except protein plot initially
    if (step === 1) {
        d3.select("#scatter1").style("display", "block");
        d3.select("#scatter2").style("display", "none");
        d3.select("#scatter3").style("display", "none");
    }
    // For other steps, show corresponding plot
    else if (step > 1) {
        d3.select("#scatter_viz")
            .selectAll(".scatter-plot")
            .style("display", "none");

        d3.select(`#scatter${step}`)
            .style("display", "block")
            .style("opacity", 0)
            .transition()
            .duration(500)
            .style("opacity", 1);
    }
}

// Load the data and initialize the visualization
d3.csv("data.csv").then((data) => {
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
        .domain([0, d3.max(data, (d) => d["day10"])])
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

    // for legend
    const bmiValues = [20, 25, 30, 35, 40];
    const legendGroup = svg
        .append("g")
        .attr("class", "bmi-legend")
        .attr(
            "transform",
            `translate(${margin.left + 100}, ${margin.top - 40})`
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
        .attr("opacity", 0.8);

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
    // Add Gut Health Legend
    const gutHealthLegend = svg
        .append("g")
        .attr("class", "gut-health-legend")
        .attr(
            "transform",
            `translate(${margin.left + 450}, ${margin.top - 40})`
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
        .attr("x", (gutHealthData.length * 80) / 2)
        .attr("y", -40)
        .text("Gut Health")
        .attr("font-weight", "bold")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle");

    svg.insert("rect", ":first-child")
        .attr("class", "legend-box")
        .attr("x", margin.left + 60)
        .attr("y", margin.top - 100)
        .attr("width", 650) // Wide enough to contain both legends
        .attr("height", 80)
        .attr("rx", 5)
        .attr("ry", 5);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

    circles = svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("stroke", "black")
        .attr("fill", (d) => gutColors[d.gut_microbiome_health] || "#999")
        .attr("r", (d) => (d.bmi > 0 ? radiusScale(d.bmi) : 3))
        .style("opacity", 0.7)

        // Tooltip interactions
        .on("mouseover", function (event, d) {
            tooltip.style("display", "block");
            d3.select(this).transition().duration(200).style("opacity", 1);
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
                Avg. Glucose Level: ${d["day" + currentDay].toFixed(2)}
            `);

            let tipWidth = tooltip.node().offsetWidth;
            let tipHeight = tooltip.node().offsetHeight;

            tooltip
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - tipHeight - 10 + "px");
        })
        .on("mouseout", function () {
            tooltip.style("display", "none");
            d3.select(this).transition().duration(200).style("opacity", 0.7);
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
// -----------------------------------  VIZ 2  --------------------------------
// -----------------------------------  VIZ 2  --------------------------------
// -----------------------------------  VIZ 2  --------------------------------

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
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Common color scale for all plots
    const colorScale = d3
        .scaleOrdinal()
        .domain(["Non-Diabetic", "Pre-Diabetic", "Type 2 Diabetic"])
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    // Load data once and create all plots
    d3.csv("meal_averages.csv").then(function (data) {
        // Protein scatter plot
        createProteinPlot(data);
        // Carbs scatter plot
        createCarbsPlot(data);
        // Fat scatter plot
        createFatPlot(data);
    });

    function createProteinPlot(data) {
        const svg1 = d3
            .select("#scatter1")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => +d.Protein)])
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => +d.spike)])
            .range([height, 0]);

        // Add axes
        svg1.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        svg1.append("g").call(d3.axisLeft(yScale));

        // Add axis labels
        svg1.append("text")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .style("text-anchor", "middle")
            .text("Protein (g)");
        3;

        svg1.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .style("text-anchor", "middle")
            .text("Glucose Spike (mg/dL)");

        // Add dots
        let currentlySelectedStatus = null;

        // Append a transparent rectangle to serve as a clickable background
        svg1.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "transparent")
            .lower()
            .on("click", function () {
                currentlySelectedStatus = null;
                svg1.selectAll("circle").style("opacity", 0.6);
            });

        // Add the circles
        svg1.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(+d.Protein))
            .attr("cy", (d) => yScale(+d.spike))
            .attr("r", 5)
            .style("fill", (d) => colorScale(d.diabetic_status))
            .style("opacity", 0.6)
            .on("click", function (event, d) {
                // Prevent the click event from bubbling up to the background rect
                event.stopPropagation();
                // Toggle the selection
                if (currentlySelectedStatus === d.diabetic_status) {
                    currentlySelectedStatus = null;
                    svg1.selectAll("circle").style("opacity", 0.6);
                } else {
                    currentlySelectedStatus = d.diabetic_status;
                    svg1.selectAll("circle").style("opacity", (dot) =>
                        dot.diabetic_status === currentlySelectedStatus
                            ? 1
                            : 0.2
                    );
                }
            })
            .on("mouseover", function (event, d) {
                tooltip.style("display", "block");
                d3.select(this).style("opacity", 1);
            })
            .on("mousemove", function (event, d) {
                tooltip
                    .html(
                        `
                    <strong>Meal:</strong> ${d["Meal Type"]}<br/>
                    <strong>Spike:</strong> ${(+d.spike).toFixed(1)} mg/dL<br/>
                    <strong>Protein:</strong> ${(+d.Protein).toFixed(1)}g
                `
                    )
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 10 + "px");
            })
            .on("mouseout", function () {
                tooltip.style("display", "none");
                d3.select(this).style("opacity", 0.6);
            });
        addLegend(svg1);
    }

    function createCarbsPlot(data) {
        const svg2 = d3
            .select("#scatter2")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => +d.Carbs)])
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => +d.spike)])
            .range([height, 0]);

        // Add axes
        svg2.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        svg2.append("g").call(d3.axisLeft(yScale));

        // Add axis labels
        svg2.append("text")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .style("text-anchor", "middle")
            .text("Carbohydrates (g)");

        svg2.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .style("text-anchor", "middle")
            .text("Glucose Spike (mg/dL)");

        let currentlySelectedStatus = null;

        // Append a transparent rectangle to serve as a clickable background
        svg2.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "transparent")
            .lower()
            .on("click", function () {
                currentlySelectedStatus = null;
                svg2.selectAll("circle").style("opacity", 0.6);
            });

        // Add the circles
        svg2.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(+d.Protein))
            .attr("cy", (d) => yScale(+d.spike))
            .attr("r", 5)
            .style("fill", (d) => colorScale(d.diabetic_status))
            .style("opacity", 0.6)
            .on("click", function (event, d) {
                // Prevent the click event from bubbling up to the background rect
                event.stopPropagation();
                // Toggle the selection
                if (currentlySelectedStatus === d.diabetic_status) {
                    currentlySelectedStatus = null;
                    svg2.selectAll("circle").style("opacity", 0.6);
                } else {
                    currentlySelectedStatus = d.diabetic_status;
                    svg2.selectAll("circle").style("opacity", (dot) =>
                        dot.diabetic_status === currentlySelectedStatus
                            ? 1
                            : 0.2
                    );
                }
            })
            .on("mouseover", function (event, d) {
                tooltip.style("display", "block");
                d3.select(this).style("opacity", 1);
            })
            .on("mousemove", function (event, d) {
                tooltip
                    .html(
                        `
                    <strong>Meal:</strong> ${d["Meal Type"]}<br/>
                    <strong>Spike:</strong> ${(+d.spike).toFixed(1)} mg/dL<br/>
                    <strong>Protein:</strong> ${(+d.Protein).toFixed(1)}g
                `
                    )
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 10 + "px");
            })
            .on("mouseout", function () {
                tooltip.style("display", "none");
                d3.select(this).style("opacity", 0.6);
            });

        addLegend(svg2);
    }

    function createFatPlot(data) {
        const svg3 = d3
            .select("#scatter3")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => +d.Fat)])
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => +d.spike)])
            .range([height, 0]);

        // Add axes
        svg3.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        svg3.append("g").call(d3.axisLeft(yScale));

        // Add axis labels
        svg3.append("text")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .style("text-anchor", "middle")
            .text("Fat (g)");

        svg3.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .style("text-anchor", "middle")
            .text("Glucose Spike (mg/dL)");

        // Add dots
        let currentlySelectedStatus = null;
        // Append a transparent rectangle to serve as a clickable background
        svg3.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "transparent")
            .lower()
            .on("click", function () {
                currentlySelectedStatus = null;
                svg3.selectAll("circle").style("opacity", 0.6);
            });

        // Add the circles
        svg3.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(+d.Protein))
            .attr("cy", (d) => yScale(+d.spike))
            .attr("r", 5)
            .style("fill", (d) => colorScale(d.diabetic_status))
            .style("opacity", 0.6)
            .on("click", function (event, d) {
                // Prevent the click event from bubbling up to the background rect
                event.stopPropagation();
                // Toggle the selection
                if (currentlySelectedStatus === d.diabetic_status) {
                    currentlySelectedStatus = null;
                    svg3.selectAll("circle").style("opacity", 0.6);
                } else {
                    currentlySelectedStatus = d.diabetic_status;
                    svg3.selectAll("circle").style("opacity", (dot) =>
                        dot.diabetic_status === currentlySelectedStatus
                            ? 1
                            : 0.2
                    );
                }
            })
            .on("mouseover", function (event, d) {
                tooltip.style("display", "block");
                d3.select(this).style("opacity", 1);
            })
            .on("mousemove", function (event, d) {
                tooltip
                    .html(
                        `
                <strong>Meal:</strong> ${d["Meal Type"]}<br/>
                <strong>Spike:</strong> ${(+d.spike).toFixed(1)} mg/dL<br/>
                <strong>Protein:</strong> ${(+d.Protein).toFixed(1)}g
            `
                    )
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 10 + "px");
            })
            .on("mouseout", function () {
                tooltip.style("display", "none");
                d3.select(this).style("opacity", 0.6);
            });

        addLegend(svg3);
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

// Call the function after your existing code
createScatterPlots();
