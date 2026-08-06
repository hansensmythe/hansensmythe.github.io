const LABEL_FONT_SIZE = 20;

const OPTIONS = {
    plugins: {
        legend: {
            labels: {
                font: {
                    size: LABEL_FONT_SIZE
                },
                color: 'white'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: 'cyan'
            }
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Hiroshima equivalents over time',
                font: {
                    size: LABEL_FONT_SIZE,
                    weight: 'bold'
                },
                color: 'red',
            },
            ticks: {
                font: {
                    size: LABEL_FONT_SIZE
                },
                color: 'red',
                beginAtZero: true
            }
        }
    }
};

/**
 * Build a chart for the given number of years, containing the running total heat generated from the initial 
 * burning of fossil fuels that released the given number of megajoules of heat.
 * 
 * @param {object} chartObject - Reference to the global Chart object
 * @param {string} chartId - Identifier for the HTML element into which the chart is written
 * @param {number[]} data - Yearly running total amount of reflected heat absorbed by greenhouse gases released from initial burning
 * @param {number} yearsToRender - Number of years for which to generate labels
 * @param {string} labelText - Dataset label
 * @param {string} borderColour - Colour of line on the graph
 * @returns new reference to chartObject
 */
export function buildChart(chartObject, chartId, data, yearsToRender, labelText, borderColour) {
    const context = document.getElementById(chartId).getContext('2d');
    if (chartObject) {
        chartObject.destroy(); // Free the canvas if a previous chart already exists there
    }

    // Chart is imported in HTML. Ignore the warning about Chart being undefined.
    chartObject = new Chart(context, {
        type: 'line',
        data: {
            labels: Array.from(
                { length: yearsToRender },
                (_, index) => new Date().getFullYear() + index
            ),
            datasets: [
                {
                    label: labelText,
                    data: data,
                    borderColor: borderColour
                }
            ]
        },
        options: OPTIONS
    });

    return chartObject;
}
