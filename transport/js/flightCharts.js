export const MJ_PER_HIROSHIMA = 63000000; // Megajoules of heat in Hiroshima blast
// From https://megacalc.org/units/joules-per-kilogram
export const MJ_PER_KG_JET_FUEL = 43.15;
export const CO2_PER_KG_JET_FUEL = 3.16;

// From https://www.sciencedirect.com/science/article/abs/pii/S0360544215006593?via%3Dihub
export const MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ = 92.5;
export const MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ = 126.5;
// Take average and convert to kg from grams
export const AVG_OIL_SANDS_JET_FUEL_kgCO2ePerMJ = (MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ + MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ) / 2000;
const BURN_TO_TOTAL_RATIO = MJ_PER_KG_JET_FUEL * AVG_OIL_SANDS_JET_FUEL_kgCO2ePerMJ / CO2_PER_KG_JET_FUEL;

// Rough estimate of every two months. Good on human scales, but does not include the long tail
const YEARS_TO_DUPLICATE_HEAT = 1 / 6;
const MONTHS_PER_YEAR = 12;
const AVG_DAYS_PER_MONTH = 30.4375;
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

// Number of years or months below which we try using a lower unit, e.g. if years==2, try months, but if years==3 use years
const TIME_FOR_HIROSHIMA_SENSITIVITY = 3;

const LINE_CHART_OPTIONS = {
    plugins: {
        legend: {
            labels: {
                color: 'black'
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Cumulative greenhouse gas heating year by year',
                font: {
                    weight: 'bold'
                },
                color: 'blue',
            },
            ticks: {
                color: 'blue'
            }
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Heat in Hiroshima equivalents',
                font: {
                    weight: 'bold'
                },
                color: 'red',
            },
            ticks: {
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
 * @param {number} kgFuelBurned - Kilograms of jet fuel burned
 * @param {number} yearsToRender - Integer between about 10 and 10000
 * @return {{kgFuelBurned, burnedMegajoules, totalMegajoules, chartData, yearsToRender, yearsTo1Hiroshima}}
 */
export function calculateDataSet(kgFuelBurned, yearsToRender) {
    // Calculate and extrapolate not just the MJ from burning, but add the MJ generated from manufacturing
    const burnedMegajoules = kgFuelBurned * MJ_PER_KG_JET_FUEL;
    const totalMegajoules = burnedMegajoules * BURN_TO_TOTAL_RATIO;

    const initialAnnualHiroshimas = totalMegajoules / YEARS_TO_DUPLICATE_HEAT / MJ_PER_HIROSHIMA;
    let biosphereCO2HeatRemaining = initialAnnualHiroshimas * BIOSPHERE_FRACTION;
    let deepOceanCO2HeatRemaining = initialAnnualHiroshimas * DEEP_OCEAN_FRACTION;
    let geologicalCO2HeatRemaining = initialAnnualHiroshimas * GEOLOGICAL_FRACTION;

    // Use the Pulse Response Model to generate a sum of exponentials.
    const chartData = [];
    let runningTotal = 0;
    let yearsTo1Hiroshima = undefined;
    for (let i = 0; i < yearsToRender; i++) {
        // At i==0, the total will equal the initial megajoules translated into annual Hiroshima equivalents
        const totalThisYear = biosphereCO2HeatRemaining + deepOceanCO2HeatRemaining + geologicalCO2HeatRemaining;
        chartData.push(totalThisYear + runningTotal);
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
        kgFuelBurned,
        burnedMegajoules,
        totalMegajoules,
        chartData,
        yearsToRender,
        yearsTo1Hiroshima
    };
}

// Use a standard formatter to add commas to numbers for readability
export function getFormattedNumber(x) {
    // TODO: Can we get formatting and also number of decimals? 
    return x.toLocaleString();
}

/**
 * Generate user-friendly description of the time before greenhouse gases will trap a Hiroshima's worth
 * of heat after burning fossil fuels generating an initial amount of megajoules.
 * 
 * @param {number} totalMegajoules - Megajoules of heat including manufacturing and burning
 * @param {number} yearsToRender - How many years in the future we checked (same value as the calculateDataSet input)
 * @param {number} yearsTo1Hiroshima - Undefined if calculateDataSet if greater than the yearsToRender, otherwise 0 or more
 * @returns {string} describing time to first Hiroshima energy equivalent in years, months, or days
 */
export function getTimeToHiroshimaText(totalMegajoules, yearsToRender, yearsTo1Hiroshima) {
    let timeToHiroshimaText;
    if (yearsTo1Hiroshima === undefined) {
        timeToHiroshimaText = `more than ${yearsToRender} years`;
    } else if (yearsTo1Hiroshima >= TIME_FOR_HIROSHIMA_SENSITIVITY) {
        // Use the given value
        timeToHiroshimaText = `${yearsTo1Hiroshima} year${yearsTo1Hiroshima > 1 ? 's' : ''}`
    } else {
        // If we are here, yearsTo1Hiroshima is less than TIME_FOR_HIROSHIMA_SENSITIVITY,
        // so fine-tune the text by calculating the time to greate precision from total megajoules
        const mjToMakeHiroshima = MJ_PER_HIROSHIMA / totalMegajoules;
        // Calculate months rather than displaying 0 or 1 or 2 years
        let timeForHiroshima = mjToMakeHiroshima * YEARS_TO_DUPLICATE_HEAT * MONTHS_PER_YEAR;
        let timeLabel = 'months';
        if (timeForHiroshima < TIME_FOR_HIROSHIMA_SENSITIVITY) {
            // Calculate days rather than displaying 0 or 1 or 2 months
            timeForHiroshima *= AVG_DAYS_PER_MONTH;
            timeLabel = 'days'
        }
        timeToHiroshimaText = `${getFormattedNumber(timeForHiroshima)} ${timeLabel}`
    }
    return timeToHiroshimaText;
}

/**
 * Build a line chart for the given number of years, containing the running total heat generated from the initial 
 * burning of fossil fuels that released the given number of megajoules of heat.
 * 
 * @param {object} oldChart - Reference to the previous global Chart object
 * @param {string} chartId - Identifier for the HTML element into which the chart is written
 * @param {object} dataSet - Object returned from calculateDataSet including chartData[] and yearsToRender 
 * @param {string} labelText - Dataset label
 * @returns pointer to new line chart
 */
export function buildLineChart(oldChart, chartId, { chartData, yearsToRender }, labelText) {
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
                    data: chartData,
                    borderColor: 'red',
                    fill: true, // Required to fill the area under the line
                    // Scriptable option for dynamic gradient based on chart area
                    backgroundColor: (context) => {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) return null; // Handle initial render
                        // Create vertical gradient
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        gradient.addColorStop(0, 'rgba(210, 207, 17, 0.3)');
                        gradient.addColorStop(1, 'rgba(250, 46, 0, 0.8)');
                        return gradient;
                    }
                }
            ]
        },
        options: LINE_CHART_OPTIONS
    });

    return newChart;
}
