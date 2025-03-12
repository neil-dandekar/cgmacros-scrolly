var scroller = scrollama();
var scrollerScatter = scrollama();

var scrolly = d3.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");

// Setup for scatter plot section
var scrollyScatter = d3.select("#scrolly-scatter");
var figureScatter = scrollyScatter.select("figure");
var articleScatter = scrollyScatter.select("article");
var stepScatter = articleScatter.selectAll(".step2");

function handleResize() {
    var stepH = Math.floor(window.innerHeight * 0.75);
    step.style("height", stepH + "px");
    step.style("width", "250px");

    // Define the total sticky height for the figure
    var stickyHeight = window.innerHeight / 2;
    // Get the height of the instructions element
    var instructionsEl = document.querySelector(".scrolly-instructions");
    var instructionsHeight = instructionsEl ? instructionsEl.offsetHeight : 0;
    // Set the viz height to the remaining space
    var vizHeight = stickyHeight - instructionsHeight;
    // New code: fixed offset so the sticky container starts near the top
    var figureMarginTop = 20; // 20px from the top (adjust as needed)

    // Set the overall sticky container height
    figure
        .style("height", stickyHeight + "px")
        .style("top", figureMarginTop + "px");
    // Adjust the D3 viz container height so it doesn't include the instructions height
    d3.select("#glucose_viz").style("height", vizHeight + "px");

    // Scatter plots resize (if applicable; adjust similarly if you add instructions there)
    stepScatter.style("height", stepH + "px");
    stepScatter.style("width", "250px");

    var figureMarginTopScatter = (window.innerHeight - stickyHeight) / 2;
    figureScatter
        .style("height", stickyHeight + "px")
        .style("top", figureMarginTopScatter + "px");

    // If you have separate viz area for scatter, adjust its height if needed.
    // For example:
    // d3.select("#scatter_viz").style("height", vizHeight + "px");

    scroller.resize();
    scrollerScatter.resize();
}

function handleStepEnter(response) {
    var day = response.index + 1;
    step.classed("is-active", (d, i) => i === day - 1);
    d3.select("#dayLabel").text(`Day ${day}`);

    if (window.updateDay) {
        window.updateDay(day);
    }
}

function handleScatterStepEnter(response) {
    var stepIndex = response.index;
    stepScatter.classed("is-active", (d, i) => i === stepIndex);

    if (window.updateScatterPlot) {
        window.updateScatterPlot(stepIndex + 1);
    }
}

function initScroll() {
    handleResize();
    scroller
        .setup({ step: "#scrolly article .step", offset: 0.5 })
        .onStepEnter(handleStepEnter);

    // Setup scatter plots scrolly
    scrollerScatter
        .setup({ step: "#scrolly-scatter article .step2", offset: 0.5 })
        .onStepEnter(handleScatterStepEnter);

    window.addEventListener("resize", handleResize);
}

window.initScroll = initScroll;
