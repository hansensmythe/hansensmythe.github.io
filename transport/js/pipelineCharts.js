// Data extracted from https://www.oilsandsmagazine.com/energy-statistics/alberta Alberta Oil Production By Type
export const DATA_DATE = '4 August 2026';
export const DAYS_PER_YEAR = 365.25;

// https://www150.statcan.gc.ca/n1/pub/57-601-x/00105/4173282-eng.htm
export const MJ_PER_BARREL_CRUDE_OIL = 6193;
export const MJ_PER_MEGATONNE = 4184000000;

// I could not find any information on amount of heat (MJ) emitted during oil sands production. However,
// since we know that burning a barrel of crude oil releases 438 kgCO2, the MJ likely has a similar ratio
const KG_CO2_PER_BARREL_BURNED = 438;
const KG_CO2_PER_BARREL_PRODUCED = 59;
const PRODUCED_RATIO = KG_CO2_PER_BARREL_PRODUCED / KG_CO2_PER_BARREL_BURNED;

// https://www.sciencedirect.com/topics/earth-and-planetary-sciences/oil-refinery
const MJ_PER_BARREL_REFINED = 615; // Typical refinery in U.S. consumes 540 to 690 MJ per barrel of crude oil refined
const REFINED_RATIO = MJ_PER_BARREL_REFINED / MJ_PER_BARREL_CRUDE_OIL;

// Where MJ_PER_BARREL_CRUDE_OIL == 1, add the produced and refined ratios to generate a total ratio
const TOTAL_RATIO = 1 + PRODUCED_RATIO + REFINED_RATIO;

// https://en.wikipedia.org/wiki/Atomic_bombings_of_Hiroshima_and_Nagasaki
export const MJ_PER_HIROSHIMA = 63000000; // Megajoules of heat in Hiroshima blast

const RAINBOW = [
    "rgba(128, 255, 128, 0.75)",
    "rgba(255, 255, 128, 0.75)",
    "rgba(255, 128, 128, 0.75)",
    "rgba(255, 0, 128, 0.75)",
    "rgba(128, 0, 0, 0.75)",
    "rgba(128, 0, 128, 0.75)",
    "rgba(0, 0, 128, 0.75)",
    "rgba(0, 0, 255, 0.75)",
    "rgba(0, 128, 255, 0.75)",
    "rgba(0, 255, 255, 0.75)",
    "rgba(0, 128, 0, 0.75)",
    "rgba(0, 255, 0, 0.75)",
    "rgba(255, 255, 0, 0.75)",
    "rgba(255, 128, 0, 0.75)",
    "rgba(255, 0, 0, 0.75)",
    "rgba(255, 0, 255, 0.75)",
    "rgba(255, 128, 255, 0.75)",
    "rgba(128, 0, 255, 0.75)",
    "rgba(128, 128, 255, 0.75)",
    "rgba(128, 255, 255, 0.75)",
    "rgba(0, 128, 128, 0.75)",
]
const DIMMER = [
    "rgba(0, 255, 255, 0.5)",
    "rgba(0, 128, 0, 0.5)",
    "rgba(96, 96, 96, 0.5)",
    "rgba(128, 128, 128, 0.5)",
    "rgba(0, 255, 0, 0.5)",
    "rgba(255, 255, 0, 0.5)",
    "rgba(255, 128, 0, 0.5)",
    "rgba(255, 0, 0, 0.5)",
    "rgba(255, 0, 255, 0.5)",
    "rgba(255, 128, 255, 0.5)",
    "rgba(128, 0, 255, 0.5)",
    "rgba(128, 128, 255, 0.5)",
    "rgba(128, 255, 255, 0.5)",
    "rgba(0, 128, 128, 0.5)",
    "rgba(160, 160, 160, 0.5)",
    "rgba(192, 192, 192, 0.5)",
    "rgba(224, 224, 224, 0.5)",
    "rgba(128, 255, 128, 0.5)",
    "rgba(255, 255, 128, 0.5)",
    "rgba(255, 128, 128, 0.5)",
    "rgba(255, 0, 128, 0.5)",
    "rgba(128, 0, 0, 0.5)",
    "rgba(128, 0, 128, 0.5)",
    "rgba(0, 0, 128, 0.5)",
    "rgba(32, 32, 32, 0.5)",
    "rgba(64, 64, 64, 0.5)",
    "rgba(0, 0, 255, 0.5)",
    "rgba(0, 128, 255, 0.5)",
];

/**
 * Average yearly per day data is input and turned into yearly millions of barrels
 * 
 * @constructor
 * @param {number} bitumen - Millions of barrels of bitumen per day
 * @param {number} sco - Millions of barrels of synthetic crude oil per day
 * @param {number} convLtMed - Millions of barrels of conventional light to medium oil per day
 * @param {number} convHeavy - Millions of barrels of conventional heavy oil per day
 * @param {number} condensate - Millions of barrels of condensate per day
 */
class OilProductionByYear {
    constructor(bitumen, sco, convLtMed, convHeavy, condensate) {
        this.bitumen = bitumen * DAYS_PER_YEAR;
        this.sco = sco * DAYS_PER_YEAR;
        this.convLtMed = convLtMed * DAYS_PER_YEAR;
        this.convHeavy = convHeavy * DAYS_PER_YEAR;
        this.condensate = condensate * DAYS_PER_YEAR;
        this.totalMillionBarrels = this.bitumen + this.sco + this.convLtMed + this.convHeavy + this.condensate;
    }
}

export const OIL_PRODUCTION_YEARS = {
    '2012': new OilProductionByYear(.895, .901, .408, .148, .012),
    '2013': new OilProductionByYear(1.012, 0.936, 0.429, 0.153, 0.016),
    '2014': new OilProductionByYear(1.212, 0.954, 0.439, 0.15, 0.024),
    '2015': new OilProductionByYear(1.406, 0.976, 0.393, 0.137, 0.021),
    '2016': new OilProductionByYear(1.485, 0.929, 0.327, 0.117, 0.048),
    '2017': new OilProductionByYear(1.648, 1.026, 0.332, 0.114, 0.063),
    '2018': new OilProductionByYear(1.856, 1.056, 0.372, 0.117, 0.089),
    '2019': new OilProductionByYear(1.837, 1.111, 0.375, 0.112, 0.088),
    '2020': new OilProductionByYear(1.718, 1.116, 0.323, 0.099, 0.078),
    '2021': new OilProductionByYear(1.921, 1.181, 0.326, 0.11, 0.073),
    '2022': new OilProductionByYear(1.995, 1.167, 0.359, 0.132, 0.079),
    '2023': new OilProductionByYear(2.006, 1.222, 0.374, 0.145, 0.071),
    '2024': new OilProductionByYear(2.087, 1.271, 0.382, 0.155, 0.085),
    '2025': new OilProductionByYear(2.19, 1.309, 0.394, 0.166, 0.088),
    '2026': new OilProductionByYear(2.165, 1.303, 0.401, 0.171, 0.092)
};

/**
 * 
 * @param {object} oldChart - Reference to previous chart, if it exists. Undefined for static initialized charts
 * @param {string} chartId 
 * @param {string[]} labels - Array of strings associated with array of datasets
 * @param {object[]} datasets - Array of objects containing label, data, and backgroundColor
 * @param {string} xText - Legend to show on X axis
 * @param {string} yText - Legend to show on Y axis
 * @returns {object} Reference to new chart.
 */
function createStackedBarChart(oldChart, chartId, labels, datasets, xText, yText) {
    const ctx = document.getElementById(chartId).getContext('2d');
    if (oldChart) {
        oldChart.destroy(); // Free the canvas if a previous chart already exists there
    }

    // Chart is imported in HTML. Ignore the warning about Chart being undefined.
    const newChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets
        },
        options: {
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: xText,
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
                    stacked: true,
                    title: {
                        display: true,
                        text: yText,
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
        }
    });

    return newChart;
}

export function chartHistoricalOilProduction(chartId) {
    createStackedBarChart(
        undefined,
        chartId,
        Object.keys(OIL_PRODUCTION_YEARS),
        [
            {
                label: 'Bitumen',
                data: Object.values(OIL_PRODUCTION_YEARS).map((year) => year.bitumen),
                backgroundColor: 'rgba(0, 0, 0, 0.75)'
            },
            {
                label: 'Synthetic Crude Oil',
                data: Object.values(OIL_PRODUCTION_YEARS).map((year) => year.sco),
                backgroundColor: 'rgba(0, 0, 196, 0.75)'
            },
            {
                label: 'Conventional Light & Medium',
                data: Object.values(OIL_PRODUCTION_YEARS).map((year) => year.convLtMed),
                backgroundColor: 'rgba(255, 0, 0, 0.75)'
            },
            {
                label: 'Conventional Heavy',
                data: Object.values(OIL_PRODUCTION_YEARS).map((year) => year.convHeavy),
                backgroundColor: 'rgba(255, 0, 255, 0.75)'
            },
            {
                label: 'Condensate',
                data: Object.values(OIL_PRODUCTION_YEARS).map((year) => year.condensate),
                backgroundColor: 'rgba(0, 255, 0, 0.75)'
            }
        ],
        'Alberta oil production by type',
        'Millions of barrels per year'
    );
}

function millionBarrelsToHiroshimas(MBarrels, conversionFactor) {
    const barrels = MBarrels * 1000000;
    const megajoules = barrels * MJ_PER_BARREL_CRUDE_OIL;
    const hiroshimas = megajoules / MJ_PER_HIROSHIMA;
    return hiroshimas * conversionFactor;
}

function millionBarrelsToPetajoules(MBarrels, conversionFactor) {
    // mega -> giga -> tera -> peta. Peta is a billion times bigger than meta,
    // but we're dealing with a per-barrel conversion, and millions of barrels.
    // We could have converted MBarrels into barrels by multiplying by a million,
    // then dividing the megajoules by a billion. Easier just to divide by a thousand.
    const petajoules = MBarrels * MJ_PER_BARREL_CRUDE_OIL / 1000;
    return petajoules * conversionFactor;
}

// 4,184 terajoules, or 1000 kilotons
function millionBarrelsToMegatonnes(MBarrels, conversionFactor) {
    const barrels = MBarrels * 1000000;
    const megajoules = barrels * MJ_PER_BARREL_CRUDE_OIL;
    return megajoules * conversionFactor / MJ_PER_MEGATONNE;
}

export function chartHistoricalHeatProduced(oldChart, chartId, measurementUnit) {
    let conversionFunction;
    if (measurementUnit == 'Hiroshimas') {
        conversionFunction = millionBarrelsToHiroshimas;
    } else if (measurementUnit == 'Petajoules') {
        conversionFunction = millionBarrelsToPetajoules;
    } else {
        conversionFunction = millionBarrelsToMegatonnes;
    }

    return createStackedBarChart(
        oldChart,
        chartId,
        Object.keys(OIL_PRODUCTION_YEARS),
        [
            {
                label: 'Alberta upstream production',
                data: Object.values(OIL_PRODUCTION_YEARS).map((year) => conversionFunction(year.totalMillionBarrels, PRODUCED_RATIO)),
                backgroundColor: 'rgba(0, 0, 0, 0.75)'
            },
            {
                label: 'Refining (typically in U.S.A.)',
                data: Object.values(OIL_PRODUCTION_YEARS).map((year) => conversionFunction(year.totalMillionBarrels, REFINED_RATIO)),
                backgroundColor: 'rgba(88, 45, 4, 0.75)'
            },
            {
                label: 'Burning (by end customer)',
                data: Object.values(OIL_PRODUCTION_YEARS).map((year) => conversionFunction(year.totalMillionBarrels, 1)),
                backgroundColor: 'rgba(255, 0, 0, 0.75)'
            },
        ],
        `${measurementUnit} of heat released by source`,
        `${measurementUnit} per year`
    );
}

// Percent boundaries beyond which we do not allow the PulseResponseModel to be set
const MIN_FRACTION = 0.1;
const MAX_FRACTION = 0.9;

/**
 * Object that controls how yearly reduction in CO2 is modelled
 * 
 * @constructor
 * @param {number} radiativeForcingDays - Number of days before heat from combustion is matched by radiative forcing
 * @param {number} biosphereFraction - Fraction of CO2 absorbed by plants and upper ocean
 * @param {number} biosphereYears - Number of years before half of the CO2 is absorbed by the biosphere
 * @param {number} deepOceanFraction - Fraction of CO2 absorbed by the deep ocean
 * @param {number} deepOceanYears - Number of years before half of the CO2 is absorbed by the deep ocean
 * @param {number} geologicalFraction - Fraction of CO2 eventually sequestered by rock weathering
 * @param {number} geologicalYears - Number of years before half of the CO2 is sequestered by rock weathering
 */
class PulseResponseModel {
    constructor(radiativeForcingDays, biosphereFraction, biosphereYears, deepOceanFraction, deepOceanYears, geologicalFraction, geologicalYears) {
        // Initialize fractions to equal 1, so that subsequent setting can make adjustments
        this.biosphereFraction = 0.34;
        this.deepOceanFraction = 0.26;
        this.geologicalFraction = 0.4;
        this.setRadiativeForcingDays(radiativeForcingDays);
        this.setBiosphereFraction(biosphereFraction);
        this.setBiosphereAnnualReduction(biosphereYears);
        // We use deepOceanFraction to take changes from either side - biology or geology
        this.deepOceanFraction = deepOceanFraction;
        this.setDeepOceanAnnualReduction(deepOceanYears);
        this.setGeologicalFraction(geologicalFraction);
        this.setGeologicalAnnualReduction(geologicalYears);
    }
    setRadiativeForcingDays(radiativeForcingDays) {
        this.radiativeForcingYears = radiativeForcingDays / DAYS_PER_YEAR;
    }
    setBiosphereFraction(biosphereFraction) {
        const adjustment = this.biosphereFraction - biosphereFraction;
        if (adjustment !== 0) {
            // Increase or decrease the deepOcean by the same amount, unless it exceeds min and max values
            const proposedNewValue = this.deepOceanFraction + adjustment;
            if (proposedNewValue >= MIN_FRACTION && proposedNewValue <= MAX_FRACTION) {
                this.deepOceanFraction = proposedNewValue;
                this.biosphereFraction = biosphereFraction;
            }
        }
    }
    setGeologicalFraction(geologicalFraction) {
        const adjustment = this.geologicalFraction - geologicalFraction;
        if (adjustment !== 0) {
            // Increase or decrease the deepOcean by the same amount, unless it exceeds min and max values
            const proposedNewValue = this.deepOceanFraction + adjustment;
            if (proposedNewValue >= MIN_FRACTION && proposedNewValue <= MAX_FRACTION) {
                this.deepOceanFraction = proposedNewValue;
                this.geologicalFraction = geologicalFraction;
            }
        }
    }
    setBiosphereAnnualReduction(biosphereYears) {
        const biosphereHalflife = 1 / biosphereYears;
        this.biosphereAnnualReduction = 0.5 ** biosphereHalflife;
    }
    setDeepOceanAnnualReduction(deepOceanYears) {
        const deepOceanHalflife = 1 / deepOceanYears;
        this.deepOceanAnnualReduction = 0.5 ** deepOceanHalflife;
    }
    setGeologicalAnnualReduction(geologicalYears) {
        const geologicalHalflife = 1 / geologicalYears;
        this.geologicalAnnualReduction = 0.5 ** geologicalHalflife;
    }
}

export function getDefaultPulseResponseModel() {
    // https://agupubs.onlinelibrary.wiley.com/doi/full/10.1002/2015GL063514 says radiative forcing from oil is ~45 days.
    // The Bern model for biosphere is 18.5-year time constant for 34% of emissions,
    // for deep ocean is 173-year time constant for 26% of emissions, and
    // 40% is left for geology - many millennia, with ~<2% still airborne after 100,000 years 
    return new PulseResponseModel(45, 0.34, 18.5, 0.26, 173, 0.4, 10000);
}

function getConversionFunction(measurementUnit) {
    if (measurementUnit == 'Hiroshimas') {
        return millionBarrelsToHiroshimas;
    } else if (measurementUnit == 'Petajoules') {
        return millionBarrelsToPetajoules;
    } else {
        return millionBarrelsToMegatonnes;
    }
}

/**
 * Calculate a data set of years, where in each year the greenhouse gas heating is calculated from the initial heat
 * @param {object} PulseResponseModel - provides variables to plug into the three CO2 sinks with annual reduction value 
 * @param {number} millionBarrels - Millions of barrels of crude oil produced this year.
 * @param {number} years - Array of years used on the x-axis
 * @param {number} yearOfProduction - Year of production (we assume that everything produced in a year is also consumed in that year)
 * @param {string} measurementUnit - one of Hiroshimas, Petajoules, or Megatonnes to determine conversion from MBarrels
 */
export function calculateDataSet(prm, millionBarrels, years, yearOfProduction, measurementUnit) {
    const heatUnit = getConversionFunction(measurementUnit)(millionBarrels, TOTAL_RATIO);
    const initialAnnualHeatUnits = heatUnit / prm.radiativeForcingYears;
    let biosphereCO2HeatRemaining = initialAnnualHeatUnits * prm.biosphereFraction;
    let deepOceanCO2HeatRemaining = initialAnnualHeatUnits * prm.deepOceanFraction;
    let geologicalCO2HeatRemaining = initialAnnualHeatUnits * prm.geologicalFraction;
    // Use the Pulse Response Model to generate a sum of exponentials.
    const chartData = [];
    years.forEach((year) => {
        if (year >= yearOfProduction) {
            const totalThisYear = biosphereCO2HeatRemaining + deepOceanCO2HeatRemaining + geologicalCO2HeatRemaining;
            chartData.push(totalThisYear);
            // For every subsequent year, reduce the total by the annual reduction for each halflife
            biosphereCO2HeatRemaining *= prm.biosphereAnnualReduction;
            deepOceanCO2HeatRemaining *= prm.deepOceanAnnualReduction;
            geologicalCO2HeatRemaining *= prm.geologicalAnnualReduction;
        } else {
            chartData.push(0);
        }
    });
    return chartData;
}

function calculateTotal(prm, millionBarrels, yearsToRender, measurementUnit) {
    // N(t) = N0(1/2)^(t/halflife)
    const initialQuantity = getConversionFunction(measurementUnit)(millionBarrels, TOTAL_RATIO);
    const biosphereInitialQuantity = initialQuantity * prm.biosphereFraction;
    const deepOceanInitialQuantity = initialQuantity * prm.deepOceanFraction;
    const geologicalInitialQuantity = initialQuantity * prm.geologicalFraction;

    const biosphereQuantityRemaining = biosphereInitialQuantity * 0.5 ** (yearsToRender / prm.radiativeForcingYears);
    const deepOceanQuantityRemaining = deepOceanInitialQuantity * 0.5 ** (yearsToRender / prm.radiativeForcingYears);
    const geologicalQuantityRemaining = geologicalInitialQuantity * 0.5 ** (yearsToRender / prm.radiativeForcingYears);

    return biosphereQuantityRemaining + deepOceanQuantityRemaining + geologicalQuantityRemaining;
}

export function chartHistoricalImpact(oldChart, chartId, prm, measurementUnit) {
    // The calculateDataSet function automatically converts totalMillionBarrels
    // into a heat unit that includes producing, refining, and burning.
    return createStackedBarChart(oldChart,
        chartId,
        Object.keys(OIL_PRODUCTION_YEARS),
        Object.keys(OIL_PRODUCTION_YEARS).map((key, index) => {
            return {
                label: `Greenhouse heat from ${key} oil`,
                data: calculateDataSet(prm, OIL_PRODUCTION_YEARS[key].totalMillionBarrels, Object.keys(OIL_PRODUCTION_YEARS), key, measurementUnit),
                backgroundColor: RAINBOW[index % RAINBOW.length]
            };
        }),
        'Greenhouse gas-induced warming per year from producing, refining, and burning the oil',
        `${measurementUnit} of heat`
    );
}

/**
 * 
 * @param {number} peakMBarrelsPerYear 
 * @param {number} peakYear 
 * @param {number} zeroYear 
 * @returns 
 */
function addFutureOilProduction(peakMBarrelsPerYear, peakYear, zeroYear) {
    const totalOilProduction = {};
    let latestYear;
    let latestYearMBarrels;
    // Add the totals for existing years
    Object.keys(OIL_PRODUCTION_YEARS).forEach((key) => {
        latestYear = parseInt(key);
        latestYearMBarrels = OIL_PRODUCTION_YEARS[key].totalMillionBarrels;
        totalOilProduction[key] = latestYearMBarrels;
    });
    // Add calculated totals for future growth
    const futureYearsOfRise = peakYear - latestYear;
    const yearlyGrowth = (peakMBarrelsPerYear - latestYearMBarrels) / futureYearsOfRise;
    let runningTotal = latestYearMBarrels;
    for (let futureYear = latestYear + 1; futureYear <= peakYear; futureYear++) {
        runningTotal += yearlyGrowth;
        totalOilProduction[futureYear] = runningTotal;
    }
    // Add calculated totals for future shutdown
    const futureYearsOfFall = zeroYear - peakYear;
    if (futureYearsOfFall > 0) {
        const yearlyDecline = runningTotal / futureYearsOfFall;
        for (let futureYear = peakYear + 1; futureYear < zeroYear; futureYear++) {
            runningTotal -= yearlyDecline;
            totalOilProduction[futureYear] = runningTotal;
        }
    }
    return totalOilProduction;
}

export function chartFutureImpact(oldChart, chartId, prm, measurementUnit, peakMBarrelsPerYear, peakYear, zeroYear) {
    // Create a new array of oil production years that simulates linear growth and decline
    const totalOilProduction = addFutureOilProduction(peakMBarrelsPerYear, peakYear, zeroYear);
    const firstYear = parseInt(Object.keys(totalOilProduction)[0]);
    const years = [];
    // Create labels going out to 100. We'll need to ensure that calculateDataSet also goes out to 100
    for (let i = 0; i < 100; i++) {
        years.push(firstYear + i);
    }

    return createStackedBarChart(oldChart,
        chartId,
        years,
        Object.keys(totalOilProduction).map((key, index) => {
            // Each iteration generates one block in the vertical stack for the year.
            // We assume that the number of vertical blocks in the final year is also the last year on the X axis
            const backgroundColour = key > new Date().getFullYear() ? DIMMER[index % DIMMER.length] : RAINBOW[index % RAINBOW.length];
            return {
                label: `Greenhouse heat from ${key} oil`,
                data: calculateDataSet(prm, totalOilProduction[key], years, key, measurementUnit),
                backgroundColor: backgroundColour
            };
        }),
        'Greenhouse gas-induced warming per year',
        `${measurementUnit} of heat`
    );
}
