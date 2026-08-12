"use strict";
document.addEventListener('DOMContentLoaded', initialize);

import { CELEBRITIES, DATA_DATE } from './celebrityFlightsData.js';
import {
    MJ_PER_HIROSHIMA,
    MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ,
    MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ,
    BURN_TO_TOTAL_RATIO,
    buildLineChart,
    calculateDataSet,
    getDefaultPulseResponseModel,
    getFormattedNumber,
    getTimeToHiroshimaText
} from './flightCharts.js';

// We render 1000 years as a fixed yet arbitrary value on this page
const YEARS_TO_RENDER = 1000;

// Define global document elements populated once DOMContentLoaded fires initialize
let flightChart = null;
let totalChart = null;

/**
 * Called once the DOM is loaded. Adds a generic event listener for changes to page controls, populates various static elements,
 * adds a 'input' listener to the distance display, and kicks off a default profile display for long-haul flights.
 */
function initialize() {
    const dateSpans = document.querySelectorAll('span.dataDate');
    dateSpans.forEach((span) => {
        span.innerText = getFormattedNumber(DATA_DATE);
    });
    document.getElementById('minCO2ePerMJ').textContent = MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ;
    document.getElementById('maxCO2ePerMJ').textContent = MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ;
    // Listen for changes to all select elements
    document.getElementById('contents').addEventListener('change', handleChangeEvent);
    const celebritySelector = document.getElementById('celebritySelector');
    // Add an empty element at the top
    celebritySelector.add(new Option('', []));
    Object.keys(CELEBRITIES).forEach((celebrityName) => {
        celebritySelector.add(new Option(celebrityName, celebrityName));
    });

    // Initially disable all optional controls and charts. They're reenabled once the user has chosen a model.
    hideChartElements(true);
}

/**
 * Toggle visibility of various page elements depending on whether they're usable.
 * 
 * @param {boolean} isHidden - true to hide elements, false to show them
 */
function hideChartElements(isHidden) {
    const hidableElements = [
        document.getElementById('flightDiv'),
        document.getElementById('totalDiv')
    ];
    hidableElements.forEach((hidableElement) => {
        hidableElement.style.display = isHidden ? 'none' : 'block';
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

/**
 * Called when a celebrity is selected from the dropdown, to populate the flight profiles radio buttons
 * and calculate the graph for the first (default selected) flight profile
 *  
 * @param {string} key - A celebrity name used as a key in the CELEBRITIES object
 */
function selectCelebrity(key) {
    const profileButtonDiv = document.getElementById('profileButtonDiv');
    profileButtonDiv.replaceChildren();

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
            profileButtonDiv.appendChild(innerDiv);
        });
        // Calculate values for the first (default) profile for the celebrity
        recalculateProfile(0);
    } else {
        // Hide existing data and graphs - the user has selected the empty first option
        hideChartElements(true);
    }
}

/**
 * Recalculate values for this profile, and build the charts.
 * 
 * @param {number} index - The index of the array of profiles for this celebrity. Usually index=0 because there will only be 1 profile
 */
function recalculateProfile(index) {
    hideChartElements(false);
    const celebritySelector = document.getElementById('celebritySelector');
    const selectedProfile = CELEBRITIES[celebritySelector.value][index];
    const burnSpans = document.querySelectorAll('span.burn');
    burnSpans.forEach((span) => {
        span.innerText = getFormattedNumber(selectedProfile.burn);
    });

    // Derive values for an average single flight
    const avgKgBurnedFuelPerFlight = selectedProfile.kgBurnedFuel / selectedProfile.totalFlights;
    const prm = getDefaultPulseResponseModel();
    const flightDataSet = calculateDataSet(prm, avgKgBurnedFuelPerFlight, YEARS_TO_RENDER, `One flight in ${selectedProfile.model}`);
    const avgKgBurnedCO2PerFlight = selectedProfile.kgBurnedCO2 / selectedProfile.totalFlights;
    writeFlightData(flightDataSet, avgKgBurnedCO2PerFlight, celebritySelector.value);
    flightChart = buildLineChart(flightChart, 'FlightChart', flightDataSet);

    const totalDataSet = calculateDataSet(prm, selectedProfile.kgBurnedFuel, YEARS_TO_RENDER, `${selectedProfile.totalFlights} flights in ${selectedProfile.model}`);
    writeTotalData(totalDataSet, selectedProfile.kgBurnedCO2, celebritySelector.value);
    totalChart = buildLineChart(totalChart, 'TotalChart', totalDataSet);
}

/**
 * Populate the flight-specific values
 * 
 * @param {number} kgBurnedFuel  - kilograms of fuel burned for this flight (or multiple flights)
 * @param {number} totalMegajoules - Derived from multiplying burnedMegajoules by ratio between burned CO2 and total CO2
 * @param {number} yearsToRender - value of the yearsSlider that got passed into calculateDataSet
 * @param {number} yearsTo1Hiroshima - number of years until the flight generates one Hiroshima's warming, or undefined if past yearsToRender
 * @param {string} labelText - Forms part of the title of the data display, along with celebrityName
 * @param {number} kgBurnedCO2 - Kilograms of CO2 released from burning the fuel
 * @param {string} celebrityName - Used in the chart title
 */
function writeFlightData({ kgBurnedFuel, totalMegajoules, yearsToRender, yearsTo1Hiroshima, labelText }, kgBurnedCO2, celebrityName) {
    document.getElementById('flightTitle').innerText = `${celebrityName} - ${labelText}`;

    document.getElementById('flightBurnedFuel').innerText = `${getFormattedNumber(kgBurnedFuel)} kg`;

    document.getElementById('flightBurnedCO2').innerText = `${getFormattedNumber(kgBurnedCO2)} kg`;

    // Multiply kgBurnedCO2 by the ratio between burned and lifecycle emissions
    const totalCO2 = Math.round(kgBurnedCO2 * BURN_TO_TOTAL_RATIO);
    document.getElementById('flightTotalCO2').innerText = `${getFormattedNumber(totalCO2)} kg`;

    const percentContextHiroshima = totalMegajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('flightImmediateHeat').innerText = `${getFormattedNumber(percentContextHiroshima)}%`;

    document.getElementById('flightGreenhouseHeat').innerText =
        getTimeToHiroshimaText(totalMegajoules, yearsToRender, yearsTo1Hiroshima);
}

/**
 * Populate the total values
 * 
 * @param {number} kgBurnedFuel  - kilograms of fuel burned
 * @param {number} totalMegajoules - Derived from multiplying burnedMegajoules by ratio between burned CO2 and total CO2
 * @param {number} yearsToRender - for this data, always 1000, but for consistency we use the value passed in the dataSet
 * @param {number} yearsTo1Hiroshima - number of years until the total flights generate one Hiroshima's warming, or undefined if past yearsToRender
 * @param {string} labelText - Forms part of the title of the data display, along with celebrityName
 * @param {number} kgBurnedCO2 - Kilograms of CO2 released from burning the fuel
 * @param {string} celebrityName - Used in the chart title
 */
function writeTotalData({ kgBurnedFuel, totalMegajoules, yearsToRender, yearsTo1Hiroshima, labelText }, kgBurnedCO2, celebrityName) {
    document.getElementById('totalTitle').innerText = `${celebrityName} - ${labelText}`;
    document.getElementById('totalBurnedFuel').innerText = `${getFormattedNumber(kgBurnedFuel)} kg`;

    document.getElementById('totalBurnedCO2').innerText = `${getFormattedNumber(kgBurnedCO2)} kg`;

    // Multiply kgBurnedCO2 by the ratio between burned and lifecycle emissions
    const totalCO2 = Math.round(kgBurnedCO2 * BURN_TO_TOTAL_RATIO);
    document.getElementById('totalCO2').innerText = `${getFormattedNumber(totalCO2)} kg`;

    const percentTotalHiroshima = totalMegajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('immediateHeat').innerText = `${getFormattedNumber(percentTotalHiroshima)}%`;

    document.getElementById('greenhouseHeat').innerText =
        `${getTimeToHiroshimaText(totalMegajoules, yearsToRender, yearsTo1Hiroshima)} at the current rate`;
}
