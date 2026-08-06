"use strict";
document.addEventListener('DOMContentLoaded', initialize);

import { CELEBRITIES } from './celebrityFlightsData.js';
import { buildChart, calculateDataSet } from './flightCharts.js';

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
const YEARS_TO_RENDER = 1000;

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
    const { data, yearsTo1Hiroshima } = calculateDataSet(megajoules, YEARS_TO_RENDER);
    writeFlightData(kgFuelBurned, megajoules, 'ONE FLIGHT', yearsTo1Hiroshima);
    flightChart = buildChart(flightChart, 'FlightChart', data, YEARS_TO_RENDER, `One flight in ${selectedProfile.model}`, 'yellow');

    // Calculate the annual amount of heating from all the flights
    const annualKgFuelBurned = kgFuelBurned * selectedProfile.flightsPerYear;
    const annualMegajoules = annualKgFuelBurned * MJ_PER_KG_JET_FUEL;
    const { data: annualData, yearsTo1Hiroshima: annualYearsTo1Hiroshima } = calculateDataSet(annualMegajoules, YEARS_TO_RENDER);
    writeAnnualData(annualKgFuelBurned, annualMegajoules, `${selectedProfile.flightsPerYear} ANNUAL FLIGHTS`, annualYearsTo1Hiroshima);
    annualChart = buildChart(annualChart, 'AnnualChart', annualData, YEARS_TO_RENDER, `${selectedProfile.flightsPerYear} annual flights in ${selectedProfile.model}`, 'red');
}

/**
 * Populate the flight-specific values
 * 
 * @param {number} kgFuelBurned  - kilograms of fuel burned for this flight
 * @param {number} megajoules - Amount of heat generated from this flight
 * @param {string} title - Inserted into element at the top of the flight data display
 * @param {number} annualYearsTo1Hiroshima - number of years until the flight generates one Hiroshima's warming
 */
function writeFlightData(kgFuelBurned, megajoules, title, yearsTo1Hiroshima) {
    document.getElementById('flightTitle').innerText = title; // 'ONE FLIGHT';
    document.getElementById('flightFuelBurned').innerText = `${getFormattedNumber(kgFuelBurned)} kg`;
    // Convert grams per megajoule into kilograms of CO2 for the flight
    document.getElementById('flightTotalCO2').innerText = `${getFormattedNumber(megajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000)} kg`;
    document.getElementById('flightImmediateHeat').innerText = `${getFormattedNumber(megajoules / MJ_PER_HIROSHIMA * 100)}%`;

    const greenhouseKaboomText = yearsTo1Hiroshima === undefined ? 'out of range' : `${yearsTo1Hiroshima} years`;
    document.getElementById('flightGreenhouseHeat').innerText = greenhouseKaboomText;
}

/**
 * Populate the annual values
 * 
 * @param {number} annualKgFuelBurned - kilograms of fuel burned in one year
 * @param {number} annualMegajoules - Amount of heat generated from flights for one year
 * @param {string} title - Inserted into element at the top of the annual data display
 * @param {number} annualYearsTo1Hiroshima - number of years until the annual flights generate one Hiroshima's warming
 */
function writeAnnualData(annualKgFuelBurned, annualMegajoules, title, annualYearsTo1Hiroshima) {
    document.getElementById('annualTitle').innerText = title;
    document.getElementById('annualFuelBurned').innerText = `${getFormattedNumber(annualKgFuelBurned)} kg annually`;

    const annualTotalCO2 = annualMegajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000;
    document.getElementById('annualTotalCO2').innerText = `${getFormattedNumber(annualTotalCO2)} kg annually`;

    const percentAnnualHiroshima = annualMegajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('annualImmediateHeat').innerText = `${getFormattedNumber(percentAnnualHiroshima)}% annually`;

    let greenhouseKaboomText;
    if (annualYearsTo1Hiroshima === undefined) {
        greenhouseKaboomText = 'out of range';
    } else if (annualYearsTo1Hiroshima == 0) {
        // Calculate months or days
        const mjAnnualToMakeHiroshima = MJ_PER_HIROSHIMA / annualMegajoules;
        // Try months
        let timeForHiroshima = mjAnnualToMakeHiroshima * YEARS_TO_DUPLICATE_HEAT * MONTHS_PER_YEAR;
        let timeLabel = 'months';
        if (timeForHiroshima < 1) {
            // Try days
            timeForHiroshima *= AVG_DAYS_PER_MONTH;
            timeLabel = 'days'
        }
        greenhouseKaboomText = `${getFormattedNumber(timeForHiroshima)} ${timeLabel}`
    } else {
        // Use the given value
        greenhouseKaboomText = `${annualYearsTo1Hiroshima} years`
    }
    document.getElementById('annualGreenhouseHeat').innerText = `${greenhouseKaboomText} at the current rate`;
}
