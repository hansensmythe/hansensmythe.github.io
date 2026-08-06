"use strict";
document.addEventListener('DOMContentLoaded', initialize);

import { CELEBRITIES } from './celebrityFlightsData.js';
import { Chart, ArcElement, Tooltip, Legend, LinearScale } from 'chart.js';

// Register the chart components globally so that we can set defaults in initialize function
Chart.register(ArcElement, Tooltip, Legend, LinearScale);

// From https://www.bts.gov/content/energy-consumption-mode-transportation-0
const MJ_PER_KG_JET_FUEL = 43.1;
// From https://www.sciencedirect.com/science/article/abs/pii/S0360544215006593?via%3Dihub
const MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ = 92.5;
const MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ = 126.5;
const AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ = (MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ + MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ) / 2;
// Megajoules of heat for different types of nuclear bomb
const MJ_PER_HIROSHIMA = 63000000;
// Rough estimate of every two months. Good on human scales, but does not include the long tail
const YEARS_TO_DUPLICATE_HEAT = 1 / 6;
const MONTHS_PER_YEAR = 12;
const AVG_DAYS_PER_MONTH = 30.4375;

// Chart constants
const YEARS_TO_RENDER = 75;
const LABEL_FONT_SIZE = 14;

// Define global document elements populated once DOMContentLoaded fires initialize
let flightChart = null;
let annualChart = null;

/**
 * Called once the DOM is loaded. Adds a generic event listener for changes to page controls, populates various static elements,
 * adds a 'input' listener to the distance display, and kicks off a default profile display for long-haul flights.
 */
function initialize() {
    // Listen for changes to all select elements
    document.getElementById('contents').addEventListener('change', handleChangeEvent);

    Chart.defaults.backgroundColor = '#9BD0F5';
    Chart.defaults.borderColor = '#36A2EB';
    Chart.defaults.color = '#f00';

    const celebritySelector = document.getElementById('celebritySelector');
    // Add an empty element at the top
    celebritySelector.add(new Option('', []));
    Object.keys(CELEBRITIES).forEach((celebrityName) => {
        celebritySelector.add(new Option(celebrityName, celebrityName));
    });
}

/**
 * For every control, listen for a 'change' event and fire the appropriate function to update values.
 * 
 * @param {object} event - The object describing the changed element on the page
 */
function handleChangeEvent(event) {
    if (event.target.id == 'celebritySelector') {
        selectCelebrity(event.target.value);
    } else if (event.target.name == 'flightProfile') {
        recalculateProfile(event.target.value);
    } else {
        console.log(`Found unhandled change event for id=${event.target.id} or name=${event.target.name}`)
    }
}

// Use a standard formatter to add commas to numbers for readability
function getFormattedNumber(x) {
    // TODO: Can we get formatting and also number of decimals? 
    return x.toLocaleString();
}

/**
 * Called when a celebrity is selected from the dropdown, to populate the flight profiles radio buttons
 * and calculate the graph for the first (default selected) flight profile
 *  
 * @param {string} key - A celebrity name used as a key in the CELEBRITIES object
 */
function selectCelebrity(key) {
    const flightButtonDiv = document.getElementById('flightButtonDiv');
    flightButtonDiv.replaceChildren();

    if (key) {
        CELEBRITIES[key].forEach((profile, index) => {
            const id = 'flight' + index;
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'flightProfile';
            radio.value = index;
            radio.id = id;
            if (index == 0) {
                // Select the first item by default
                radio.checked = true;
            }

            const label = document.createElement('label');
            label.setAttribute('for', id);
            label.innerHTML = profile.model;

            // Create a div for each label and radio button so they are organized vertically
            const innerDiv = document.createElement('div');
            innerDiv.appendChild(radio);
            innerDiv.appendChild(label);
            flightButtonDiv.appendChild(innerDiv);
        });
        // Calculate values for the first (default) profile for the celebrity
        recalculateProfile(0);
    } else {
        // Clear existing data and graphs - the user has selected the empty first option
        document.getElementById('burn').innerText = 0;
        document.getElementById('flightTitle').innerText = '';
        document.getElementById('flightFuelBurned').innerText = '0 kg';
        document.getElementById('flightTotalCO2').innerText = '0 kg';
        document.getElementById('flightImmediateHeat').innerText = '0%';
        document.getElementById('flightGreenhouseHeat').innerText = 'Forever';
        document.getElementById('annualTitle').innerText = '';
        document.getElementById('annualFuelBurned').innerText = '0 kg';
        document.getElementById('annualTotalCO2').innerText = '0 kg annually';
        document.getElementById('annualImmediateHeat').innerText = '0% annually';
        document.getElementById('annualGreenhouseHeat').innerText = 'Forever';
        if (flightChart) {
            flightChart.destroy(); // Free the canvas if a previous chart already exists there
        }
        if (annualChart) {
            annualChart.destroy(); // Free the canvas if a previous chart already exists there
        }
    }
}

/**
 * Recalculate values for this profile, and build the charts.
 * 
 * @param {number} index - The index of the array of profiles for this celebrity. Usually index=0 because there will only be 1 profile
 */
function recalculateProfile(index) {
    const celebritySelector = document.getElementById('celebritySelector');
    const selectedProfile = CELEBRITIES[celebritySelector.value][index];

    document.getElementById('burn').innerText = selectedProfile.burn;
    const kgFuelBurned = selectedProfile.burn * selectedProfile.kilometres;
    const megajoules = kgFuelBurned * MJ_PER_KG_JET_FUEL;
    writeFlightData(kgFuelBurned, megajoules);

    // Calculate the annual amount of heating from all the flights
    const annualKgFuelBurned = kgFuelBurned * selectedProfile.flightsPerYear;
    const annualMegajoules = annualKgFuelBurned * MJ_PER_KG_JET_FUEL;
    writeAnnualData(selectedProfile, annualKgFuelBurned, annualMegajoules);

    buildCharts(selectedProfile, megajoules, annualMegajoules);
}

/**
 * Populate the flight-specific values
 * 
 * @param {number} kgFuelBurned  - kilograms of fuel burned for this flight
 * @param {number} megajoules - Amount of heat generated from this flight
 */
function writeFlightData(kgFuelBurned, megajoules) {
    document.getElementById('flightTitle').innerText = 'ONE FLIGHT';
    document.getElementById('flightFuelBurned').innerText = `${getFormattedNumber(kgFuelBurned)} kg`;
    // Convert grams per megajoule into kilograms of CO2 for the flight
    document.getElementById('flightTotalCO2').innerText = `${getFormattedNumber(megajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000)} kg`;
    document.getElementById('flightImmediateHeat').innerText = `${getFormattedNumber(megajoules / MJ_PER_HIROSHIMA * 100)}%`;
    const mjToMakeHiroshima = MJ_PER_HIROSHIMA / megajoules;
    document.getElementById('flightGreenhouseHeat').innerText = `${getFormattedNumber(mjToMakeHiroshima * YEARS_TO_DUPLICATE_HEAT)} years`;
}

/**
 * Populate the annual values
 * 
 * @param {object} selectedProfile - The selected flight profile
 * @param {number} annualKgFuelBurned - kilograms of fuel burned in one year
 * @param {number} annualMegajoules - Amount of heat generated from flights for one year
 */
function writeAnnualData(selectedProfile, annualKgFuelBurned, annualMegajoules) {
    document.getElementById('annualTitle').innerText = `${selectedProfile.flightsPerYear} ANNUAL FLIGHTS`;
    document.getElementById('annualFuelBurned').innerText = `${getFormattedNumber(annualKgFuelBurned)} kg annually`;

    const annualTotalCO2 = annualMegajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000;
    document.getElementById('annualTotalCO2').innerText = `${getFormattedNumber(annualTotalCO2)} kg annually`;

    const percentAnnualHiroshima = annualMegajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('annualImmediateHeat').innerText = `${getFormattedNumber(percentAnnualHiroshima)}% annually`;

    // Because the time duration for annual data can change, the label for the data is generated here
    const mjAnnualToMakeHiroshima = MJ_PER_HIROSHIMA / annualMegajoules;
    // Some egregious private flyers generate a Hiroshima's worth of warming in less than a year. Change the time context for readability.
    let timeForHiroshima = mjAnnualToMakeHiroshima * YEARS_TO_DUPLICATE_HEAT;
    let timeLabel = 'years';
    if (timeForHiroshima < 1) {
        // Try months
        timeForHiroshima *= MONTHS_PER_YEAR;
        timeLabel = 'months';
    }
    if (timeForHiroshima < 1) {
        // Try days
        timeForHiroshima *= AVG_DAYS_PER_MONTH;
        timeLabel = 'days';
    }
    document.getElementById('annualGreenhouseHeat').innerText = `${getFormattedNumber(timeForHiroshima)} ${timeLabel} at the current rate`;
}

/**
 * Build the charts from the data.
 * 
 * @param {object} selectedProfile - The selected flight profile
 * @param {number} megajoules - Amount of heat generated by the flight, derived from the kg of fuel burned
 * @param {number} annualMegajoules - Amount of heat generated annually
 */
function buildCharts(selectedProfile, megajoules, annualMegajoules) {
    const options = {
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: LABEL_FONT_SIZE
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Hiroshima equivalents over time',
                    font: {
                        size: LABEL_FONT_SIZE,
                        weight: 'bold'
                    }
                },
                ticks: {
                    font: {
                        size: LABEL_FONT_SIZE
                    }
                }
            }
        }
    };

    buildFlightChart(options, selectedProfile.model, megajoules);

    buildAnnualChart(options, selectedProfile.model, annualMegajoules);
}

/**
 * Write the data to the Flight chart, which shows the impact of a single flight
 * 
 * @param {object} options 
 * @param {string} modelName 
 * @param {number} megajoules 
 */
function buildFlightChart(options, modelName, megajoules) {
    const flightContext = document.getElementById('FlightChart').getContext('2d');
    if (flightChart) {
        flightChart.destroy(); // Free the canvas if a previous chart already exists there
    }

    flightChart = new Chart(flightContext, {
        type: 'line',
        data: {
            labels: Array.from(
                { length: YEARS_TO_RENDER },
                (_, index) => new Date().getFullYear() + index
            ),
            datasets: [
                {
                    label: `One flight in ${modelName}`,
                    data: Array.from(
                        { length: YEARS_TO_RENDER },
                        (_, index) => ((index + 1) * (megajoules / YEARS_TO_DUPLICATE_HEAT)) / MJ_PER_HIROSHIMA
                    ),
                    backgroundColor: "#b6c6d5"
                }
            ]
        },
        options: options
    });
}

/**
 * Write the data to the Annual chart, which shows the impact of flying for a year at the given rate
 * 
 * @param {object} options 
 * @param {string} modelName 
 * @param {number} annualMegajoules 
 */
function buildAnnualChart(options, modelName, annualMegajoules) {
    const annualContext = document.getElementById('AnnualChart').getContext('2d');
    if (annualChart) {
        annualChart.destroy(); // Free the canvas if a previous chart already exists there
    }

    annualChart = new Chart(annualContext, {
        type: 'line',
        data: {
            labels: Array.from(
                { length: YEARS_TO_RENDER },
                (_, index) => new Date().getFullYear() + index
            ),
            datasets: [
                {
                    label: `Annual flights in ${modelName}`,
                    data: Array.from(
                        { length: YEARS_TO_RENDER },
                        (_, index) => ((index + 1) * (annualMegajoules / YEARS_TO_DUPLICATE_HEAT)) / MJ_PER_HIROSHIMA
                    ),
                    backgroundColor: "#ff6a00"
                }
            ]
        },
        options: options
    });
}
