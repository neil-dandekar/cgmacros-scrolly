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

    var figureHeight = window.innerHeight / 2;
    var figureMarginTop = (window.innerHeight - figureHeight) / 2;
    figure
        .style("height", figureHeight + "px")
        .style("top", figureMarginTop + "px");

    // Scatter plots resize
    stepScatter.style("height", stepH + "px");
    stepScatter.style("width", "250px");

    figureScatter
        .style("height", figureHeight + "px")
        .style("top", figureMarginTop + "px");

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
