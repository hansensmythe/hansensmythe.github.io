"use strict";
document.addEventListener('DOMContentLoaded', initialize);

import { CELEBRITIES } from './celebrityFlightsData.js';
import { 
    MJ_PER_HIROSHIMA,
    MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ, 
    MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ, 
    AVG_OIL_SANDS_JET_FUEL_kgCO2ePerMJ, 
    CO2_PER_KG_JET_FUEL,
    buildLineChart, 
    calculateDataSet, 
    getFormattedNumber, 
    getTimeToHiroshimaText 
} from './flightCharts.js';

// We render 1000 years as a fixed yet arbitrary value on this page
const YEARS_TO_RENDER = 1000;

// Define global document elements populated once DOMContentLoaded fires initialize
let flightChart = null;
let annualChart = null;

/**
 * Called once the DOM is loaded. Adds a generic event listener for changes to page controls, populates various static elements,
 * adds a 'input' listener to the distance display, and kicks off a default profile display for long-haul flights.
 */
function initialize() {
    document.getElementById('co2PerKg').textContent = CO2_PER_KG_JET_FUEL;
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
        document.getElementById('annualDiv'),
        document.getElementById('flightDiv')
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
        span.innerText = selectedProfile.burn;
    });
    const kgFuelBurned = selectedProfile.burn * selectedProfile.kilometres;

    const flightDataSet = calculateDataSet(kgFuelBurned, YEARS_TO_RENDER);
    writeFlightData(flightDataSet, celebritySelector.value);
    flightChart = buildLineChart(flightChart, 'FlightChart', flightDataSet, `One flight in ${selectedProfile.model}`);

    // Calculate the annual amount of heating from all the flights
    const annualKgFuelBurned = kgFuelBurned * selectedProfile.flightsPerYear;

    const annualDataSet = calculateDataSet(annualKgFuelBurned, YEARS_TO_RENDER);
    writeAnnualData(annualDataSet, celebritySelector.value, selectedProfile.flightsPerYear);
    annualChart = buildLineChart(annualChart, 'AnnualChart', annualDataSet, `${selectedProfile.flightsPerYear} annual flights in ${selectedProfile.model}`);
}

/**
 * Populate the flight-specific values
 * 
 * @param {number} kgFuelBurned  - kilograms of fuel burned for this flight (or multiple flights)
 * @param {number} burnedMegajoules - Amount of heat generated from this flight
 * @param {number} totalMegajoules - Derived from multiplying burnedMegajoules by ratio between burned CO2 and total CO2
 * @param {number} yearsToRender - value of the yearsSlider that got passed into calculateDataSet
 * @param {number} yearsTo1Hiroshima - number of years until the flight generates one Hiroshima's warming, or undefined if past yearsToRender
 * @param {string} celebrityName - Inserted into element at the top of the flight data display
 */
function writeFlightData({ kgFuelBurned, burnedMegajoules, totalMegajoules, yearsToRender, yearsTo1Hiroshima }, celebrityName) {
    document.getElementById('flightTitle').innerText = `${celebrityName} - One Flight`;

    document.getElementById('flightFuelBurned').innerText = `${getFormattedNumber(kgFuelBurned)} kg`;

    // Convert grams per megajoule into kilograms of CO2 for the flight
    const burnedCO2 = kgFuelBurned * CO2_PER_KG_JET_FUEL;
    document.getElementById('flightFuelBurnedCO2').innerText = `${getFormattedNumber(burnedCO2)} kg`;

    // Calculate the total lifecycle CO2 for oil sands jet fuel
    const totalCO2 = burnedMegajoules * AVG_OIL_SANDS_JET_FUEL_kgCO2ePerMJ;
    document.getElementById('flightTotalCO2').innerText = `${getFormattedNumber(totalCO2)} kg`;

    const percentContextHiroshima = totalMegajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('flightImmediateHeat').innerText = `${getFormattedNumber(percentContextHiroshima)}%`;

    document.getElementById('flightGreenhouseHeat').innerText = 
        getTimeToHiroshimaText(totalMegajoules, yearsToRender, yearsTo1Hiroshima);
}

/**
 * Populate the annual values
 * 
 * @param {number} kgFuelBurned  - kilograms of fuel burned annually
 * @param {number} burnedMegajoules - Amount of heat generated annually
 * @param {number} totalMegajoules - Derived from multiplying burnedMegajoules by ratio between burned CO2 and total CO2
 * @param {number} yearsToRender - for this data, always 1000, but for consistency we use the value passed in the dataSet
 * @param {number} yearsTo1Hiroshima - number of years until the annual flights generate one Hiroshima's warming, or undefined if past yearsToRender
 * @param {string} celebrityName - Inserted into element at the top of the annual data display
 * @param {string} annualFlightCount - Inserted into element at the top of the annual data display
 */
function writeAnnualData({ kgFuelBurned, totalMegajoules, yearsToRender, yearsTo1Hiroshima }, celebrityName, annualFlightCount) {
    document.getElementById('annualTitle').innerText = `${celebrityName} - ${annualFlightCount} Annual Flights`;
    document.getElementById('annualFuelBurned').innerText = `${getFormattedNumber(kgFuelBurned)} kg annually`;

    const annualBurnedCO2 = kgFuelBurned * CO2_PER_KG_JET_FUEL;
    document.getElementById('annualFuelBurnedCO2').innerText = `${getFormattedNumber(annualBurnedCO2)} kg`;

    // totalMegajoules = burnedMegajoules * BURN_TO_TOTAL_RATIO;
    // Calculate the total lifecycle CO2 for oil sands jet fuel
    const annualTotalCO2 = totalMegajoules * AVG_OIL_SANDS_JET_FUEL_kgCO2ePerMJ;
    document.getElementById('annualTotalCO2').innerText = `${getFormattedNumber(annualTotalCO2)} kg annually`;

    const percentAnnualHiroshima = totalMegajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('annualImmediateHeat').innerText = `${getFormattedNumber(percentAnnualHiroshima)}% annually`;

    document.getElementById('annualGreenhouseHeat').innerText = 
        `${getTimeToHiroshimaText(totalMegajoules, yearsToRender, yearsTo1Hiroshima)} at the current rate`;
}
