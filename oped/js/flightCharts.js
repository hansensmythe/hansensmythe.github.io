import { MODELS } from './publicFlightsData.js';

const LABEL_FONT_SIZE = 16;
const MJ_PER_HIROSHIMA = 63000000; // Megajoules of heat in Hiroshima blast
// Rough estimate of every two months. Good on human scales, but does not include the long tail
const YEARS_TO_DUPLICATE_HEAT = 1 / 6;
// Fraction of CO2 handled by the pulse response model, separated into multiple half-life equations
const BIOSPHERE_FRACTION = 0.3;
const DEEP_OCEAN_FRACTION = 0.3;
const GEOLOGICAL_FRACTION = 0.4;
// Years before half of the CO2 is absorbed
const BIOSPHERE_HALFLIFE = 1 / 50;
const DEEP_OCEAN_HALFLIFE = 1 / 500;
const GEOLOGICAL_HALFLIFE = 1 / 10000;
// Annual reduction from each source of CO2 sequestration
const BIOSPHERE_ANNUAL_REDUCTION = 0.5 ** BIOSPHERE_HALFLIFE; // 50 years until half is taken up by plants and upper ocean
const DEEP_OCEAN_ANNUAL_REDUCTION = 0.5 ** DEEP_OCEAN_HALFLIFE; // 500 years until half is taken up by the deep ocean
const GEOLOGICAL_ANNUAL_REDUCTION = 0.5 ** GEOLOGICAL_HALFLIFE; // 10000 years until rock weathering sequesters half the CO2

const LINE_CHART_OPTIONS = {
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
            title: {
                display: true,
                text: 'Cumulative greenhouse gas heating year by year',
                font: {
                    size: LABEL_FONT_SIZE,
                    weight: 'bold'
                },
                color: 'cyan',
            },
            ticks: {
                color: 'cyan'
            }
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Heat in Hiroshima equivalents',
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
 * Calculate the annual reduction in greenhouse heat resulting from a matching reduction in CO2
 * due to the action of the three main greenhouse gas sequestration processes, at different time scales,
 * and additionally note the number of years before the runningTotal exceeds 1 Hiroshima's worth of heat,
 * or return undefined for the number of years if it is never reached (we can't use 0 to indicate that it's
 * unset because that's still a valid number of years before the Kaboom).
 * 
 * @param {number} megajoules - Amount of heat generated from the initial burning of fossil fuel
 * @param {number} yearsToRender - Integer between about 10 and 10000
 */
export function calculateDataSet(megajoules, yearsToRender) {
    const initialAnnualHiroshimas = megajoules / YEARS_TO_DUPLICATE_HEAT / MJ_PER_HIROSHIMA;
    let biosphereCO2HeatRemaining = initialAnnualHiroshimas * BIOSPHERE_FRACTION;
    let deepOceanCO2HeatRemaining = initialAnnualHiroshimas * DEEP_OCEAN_FRACTION;
    let geologicalCO2HeatRemaining = initialAnnualHiroshimas * GEOLOGICAL_FRACTION;

    // Use the Pulse Response Model to generate a sum of exponentials.
    const data = [];
    let runningTotal = 0;
    let yearsTo1Hiroshima = undefined;
    for (let i = 0; i < yearsToRender; i++) {
        // At i==0, the total will equal the initial megajoules translated into annual Hiroshima equivalents
        const totalThisYear = biosphereCO2HeatRemaining + deepOceanCO2HeatRemaining + geologicalCO2HeatRemaining;
        data.push(totalThisYear + runningTotal);
        runningTotal += totalThisYear;
        if (yearsTo1Hiroshima === undefined && runningTotal >= 1) {
            yearsTo1Hiroshima = i;
        }
        // For every subsequent year, reduce the total by the annual reduction for each halflife
        biosphereCO2HeatRemaining *= BIOSPHERE_ANNUAL_REDUCTION;
        deepOceanCO2HeatRemaining *= DEEP_OCEAN_ANNUAL_REDUCTION;
        geologicalCO2HeatRemaining *= GEOLOGICAL_ANNUAL_REDUCTION;
    }

    return {
        data,
        yearsTo1Hiroshima
    };
}

/**
 * Build a line chart for the given number of years, containing the running total heat generated from the initial 
 * burning of fossil fuels that released the given number of megajoules of heat.
 * 
 * @param {object} oldChart - Reference to the previous global Chart object
 * @param {string} chartId - Identifier for the HTML element into which the chart is written
 * @param {number[]} data - Yearly running total amount of reflected heat absorbed by greenhouse gases released from initial burning
 * @param {number} yearsToRender - Number of years for which to generate labels
 * @param {string} labelText - Dataset label
 * @param {string} borderColour - Colour of line on the graph
 * @returns reference to new line chart
 */
export function buildLineChart(oldChart, chartId, data, yearsToRender, labelText, borderColour) {
    const context = document.getElementById(chartId).getContext('2d');
    if (oldChart) {
        oldChart.destroy(); // Free the canvas if a previous chart already exists there
    }

    // Chart is imported in HTML. Ignore the warning about Chart being undefined.
    const newChart = new Chart(context, {
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
        options: LINE_CHART_OPTIONS
    });

    return newChart;
}

/**
 * Once at initialization, build a scatter chart of seats and kilometres.
 * 
 * @param {string} chartId - Identifier for the HTML element into which the chart is written
 * @param {string} label - Dataset label
 * @param {function} onClick - Fired when one of the data points is clicked
 */
export function buildScatterChart(chartId, label, onClick) {
    const scatterData = [];
    Object.entries(MODELS).forEach(([modelName, profiles]) => {
        // One plane may have multiple profiles with different numbers of seats and distances,
        // but when clicked we only need the modelName so that we can populate the model selector buttons.
        profiles.forEach((profile) => {
            scatterData.push({ x: profile.kilometres, y: profile.seats, modelName, profileName: profile.name });
        });
    });

    const context = document.getElementById(chartId).getContext('2d');
    new Chart(context, {
        type: 'scatter',
        data: {
            datasets: [{
                label,
                data: scatterData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            onClick,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = context.dataset.data[context.dataIndex];
                            return `${value.modelName} ${value.profileName}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear', // Scatter charts support only 'linear' scale type for x-axis
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Approximate kilometres to travel',
                        font: {
                            size: LABEL_FONT_SIZE,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    type: 'linear', // Scatter charts support only 'linear' scale type for y-axis
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Number of seats on aircraft',
                        font: {
                            size: LABEL_FONT_SIZE,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}
