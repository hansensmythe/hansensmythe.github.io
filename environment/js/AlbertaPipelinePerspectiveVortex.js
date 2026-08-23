"use strict";
document.addEventListener('DOMContentLoaded', initialize);

import {
    DATA_DATE,
    DAYS_PER_YEAR,
    chartHistoricalOilProduction,
    chartHistoricalHeatProduced,
    chartHistoricalImpact,
    chartFutureImpact,
    chartLongTermImpact,
    getDefaultPulseResponseModel
} from './AlbertaPipelineCharts.js';

// Number of years to report in Alberta's plans for growth section
const FUTURE_IMPACT_YEARS = 200;

const MEASUREMENT_BUTTON_NAME = 'measurement';
let selectedMeasurement;

// Define global document elements populated once DOMContentLoaded fires the initialize function
let historicalHeatChart;
let historicalImpactChart;
let futureImpactChart;
let longTermChart;

const prm = getDefaultPulseResponseModel();

// Use a standard formatter to add commas to numbers for readability
function getFormattedNumber(x) {
    // TODO: Can we get formatting and also number of decimals?
    return x.toLocaleString();
}

/**
 * Called whenever we need an element unhidden
 *
 * @param {string} elementId
 */
function showElement(elementId) {
    document.getElementById(elementId).style.display = 'block';
}

/**
 * Called whenever we need an element hidden
 *
 * @param {string} elementId
 */
function hideElement(elementId) {
    document.getElementById(elementId).style.display = 'none';
}

/**
 * Utility function to get the integer value of a page element using the elementId
 * 
 * @param {string} elementId - Id of the target element
 * @returns {number} integer value of the target element
 */
function getIntegerElementValue(elementId) {
    return parseInt(document.getElementById(elementId).value);
}

/**
 * Used to select measurement unit
 * 
 * @param {string} buttonName - Name (not ID) of button group whose checked value we want to return
 * @returns value of the checked button, or undefined if none were checked
 */
function getSelectedButtonValue(buttonName) {
    // Note that if a model has not been selected, but the user starts playing with the other controls,
    // change events will get generated that will try to recalculate things, but we won't find a value.
    const queryResult = document.querySelector(`input[name="${buttonName}"]:checked`);
    if (queryResult) {
        return queryResult.value;
    } else {
        return undefined;
    }
}

/**
 * Toggle visibility of model-related page elements depending on whether they're enabled.
 * 
 * @param {boolean} isHidden - true to hide elements, false to show them
 */
function hideModelControls(isHidden) {
    isHidden ? hideElement('modelControls') : showElement('modelControls');
}

/**
 * Given an empty select element, populate it with options
 * 
 * @param {string} dropdownId - Identifier of the dropdown list
 * @param {string} minValue - Minimum (starting) value
 * @param {string} maxValue - Maximum (ending) value
 * @param {string} defaultValue - Initially selected value
 */
function populateDropdown(dropdownId, minValue, maxValue, defaultValue) {
    const dropdown = document.getElementById(dropdownId);
    // Shouldn't need to clear previous options, e.g. dropdown.options.length = 0;
    for (let i = minValue; i <= maxValue; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        dropdown.appendChild(option);
    }
    dropdown.value = defaultValue;
}

/**
 * Using the latest selectedMeasurement and prm values, redisplays the Future Impact Chart, and calls refreshLongTermChart.
 */
function refreshFutureImpactChart() {
    const maxMBarrels = document.getElementById('maxMBarrels');
    document.getElementById('maxMBarrelsDisplay').textContent = maxMBarrels.value;
    document.getElementById('futureImpactYears').textContent = FUTURE_IMPACT_YEARS;
    futureImpactChart = chartFutureImpact(
        futureImpactChart, 
        'FutureImpactChart', 
        prm, 
        selectedMeasurement, 
        maxMBarrels.value * DAYS_PER_YEAR, 
        getIntegerElementValue('maxYearSelector'), 
        getIntegerElementValue('zeroYearSelector'),
        FUTURE_IMPACT_YEARS
    );
    refreshLongTermChart();
}

/**
 * Using the latest selectedMeasurement and prm values, redisplays the Long Term Chart.
 */
function refreshLongTermChart() {
    const maxMBarrels = document.getElementById('maxMBarrels');
    const zeroYearSelector = document.getElementById('zeroYearSelector');
    document.getElementById('zeroYear').textContent = zeroYearSelector.value;
    const futureYears = document.getElementById('futureYears');
    document.getElementById('futureYearsDisplay').textContent = futureYears.value;
    longTermChart = chartLongTermImpact(
        longTermChart,
        'LongTermChart',
        prm,
        selectedMeasurement,
        maxMBarrels.value * DAYS_PER_YEAR,
        getIntegerElementValue('maxYearSelector'), 
        getIntegerElementValue('zeroYearSelector'),
        futureYears.value
    );
}

/**
 * Called once the DOM is loaded. Adds a generic event listener for changes to page controls, populates various static elements,
 * adds a 'input' listener to the distance display, and kicks off a default profile display for long-haul flights.
 */
function initialize() {
    // Add constants to page
    document.getElementById('dataDate').textContent = getFormattedNumber(DATA_DATE);
    // Use default measurement for now
    selectedMeasurement = getSelectedButtonValue(MEASUREMENT_BUTTON_NAME);
    document.getElementById('selectedMeasurement').textContent = selectedMeasurement;
    populateDropdown('maxYearSelector', 2027, 2050, 2035);
    populateDropdown('zeroYearSelector', 2027, 2075, 2050);
 
    // Add listeners for user events
    document.getElementById('contents').addEventListener('change', handleChangeEvent);
    document.getElementById('contents').addEventListener('click', handleClickEvent);
    document.getElementById('contents').addEventListener('input', handleInputEvent);

    hideModelControls(true);
    // Initially hide key detail sections
    const sections = document.querySelectorAll('[id$="Key"]');
    sections.forEach((section) => {
        section.style.display = 'none';
    });

    chartHistoricalOilProduction('HistoricalChart');
    historicalHeatChart = chartHistoricalHeatProduced(historicalHeatChart, 'HistoricalHeatChart', selectedMeasurement);
    historicalImpactChart = chartHistoricalImpact(historicalImpactChart, 'HistoricalImpactChart', prm, selectedMeasurement);
    refreshFutureImpactChart();
}

function updateFractionDisplays() {
    document.getElementById('biosphereFraction').value = getFormattedNumber(prm.biosphereFraction);
    document.getElementById('geologicalFraction').value = getFormattedNumber(prm.geologicalFraction);
    document.getElementById('biosphereFractionDisplay').textContent = getFormattedNumber(prm.biosphereFraction * 100);
    document.getElementById('deepOceanFractionDisplay').textContent = getFormattedNumber(prm.deepOceanFraction * 100);
    document.getElementById('geologicalFractionDisplay').textContent = getFormattedNumber(prm.geologicalFraction * 100);
}

function handleChangeEvent(event) {
    if (event.target.name == MEASUREMENT_BUTTON_NAME) {
        selectedMeasurement = getSelectedButtonValue(MEASUREMENT_BUTTON_NAME);
        document.getElementById('selectedMeasurement').textContent = selectedMeasurement;
        refreshFutureImpactChart();
    } else if (event.target.id == 'maxMBarrels' ||
        event.target.id == 'maxYearSelector' ||
        event.target.id == 'zeroYearSelector') {
        refreshFutureImpactChart();
    } else if (event.target.id == 'futureYears') {
        refreshLongTermChart();
    } else if (event.target.id == 'enableModelControls') {
        hideModelControls(!event.target.checked);
    } else if (event.target.id == 'biosphereFraction' ||
        event.target.id == 'geologicalFraction' ||
        event.target.id == 'biosphereYears' ||
        event.target.id == 'deepOceanYears' ||
        event.target.id == 'geologicalYears' ||
        event.target.id == 'flightCountSelector' ||
        event.target.id == 'distanceSlider' ||
        event.target.id == 'yearsSlider' ||
        event.target.id == 'passengerCountSelector' ||
        event.target.id == 'radiativeForcing') {
        // These model controls update the PRM used in the future impact charts
        refreshFutureImpactChart();
    }
}
function handleClickEvent(event) {
    if (event.target.type == 'button') {
        const button = document.getElementById(event.target.id);
        const matchingDiv = `${event.target.id}Key`;
        if (button.value == 'Show more') {
            showElement(matchingDiv);
            button.value = 'Show less';
        } else {
            hideElement(matchingDiv);
            button.value = 'Show more';
        }
    }
}

function handleInputEvent(event) {
    if (event.target.id == 'maxMBarrels') {
        document.getElementById('maxMBarrelsDisplay').textContent = event.target.value;
    } else if (event.target.id == 'maxYearSelector') {
        // zeroYear must be at least maxYear
        const zeroYear = document.getElementById('zeroYearSelector');
        if (zeroYear.value < event.target.value) {
            zeroYear.value = event.target.value;
        }
    } else if (event.target.id == 'zeroYearSelector') {
        // maxYear must be no greater than zeroYear
        const maxYear = document.getElementById('maxYearSelector');
        if (maxYear.value > event.target.value) {
            maxYear.value = event.target.value;
        }
    } else if (event.target.id == 'futureYears') {
        // Update the futureYearsDisplay
        document.getElementById('futureYearsDisplay').textContent = event.target.value;
    } else if (event.target.id == 'radiativeForcing') {
        const radiativeForcingDisplay = document.getElementById('radiativeForcingDisplay');
        radiativeForcingDisplay.textContent = event.target.value;
        prm.setRadiativeForcingDays(event.target.value);
    } else if (event.target.id == 'biosphereFraction') {
        prm.setBiosphereFraction(parseFloat(event.target.value));
        updateFractionDisplays();
    } else if (event.target.id == 'geologicalFraction') {
        prm.setGeologicalFraction(parseFloat(event.target.value));
        updateFractionDisplays();
    } else if (event.target.id == 'biosphereYears') {
        prm.setBiosphereAnnualReduction(parseFloat(event.target.value));
        document.getElementById('biosphereYearsDisplay').textContent = event.target.value;
    } else if (event.target.id == 'deepOceanYears') {
        prm.setDeepOceanAnnualReduction(parseFloat(event.target.value));
        document.getElementById('deepOceanYearsDisplay').textContent = event.target.value;
    } else if (event.target.id == 'geologicalYears') {
        prm.setGeologicalAnnualReduction(parseFloat(event.target.value));
        document.getElementById('geologicalYearsDisplay').textContent = event.target.value;
    }
}
