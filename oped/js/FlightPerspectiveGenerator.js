document.addEventListener('DOMContentLoaded', initialize);
import { MODELS } from './flights.js';
import { buildChart } from './flightCharts.js';

// From https://www.bts.gov/content/energy-consumption-mode-transportation-0
const MJ_PER_KG_JET_FUEL = 43.1;
// From https://www.sciencedirect.com/science/article/abs/pii/S0360544215006593?via%3Dihub
const MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ = 92.5;
const MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ = 126.5;
const AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ = (MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ + MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ) / 2;
const MJ_PER_HIROSHIMA = 63000000; // Megajoules of heat
// Rough estimate of every two months. Good on human scales, but does not include the long tail
const YEARS_TO_DUPLICATE_HEAT = 1 / 6;
// Fraction of CO2 handled by the pulse response model, separated into multiple half-life equations
const BIOSPHERE_FRACTION = 0.3;
const DEEP_OCEAN_FRACTION = 0.3;
const GEOLOGICAL_FRACTION = 0.4;
// Years before half of the CO2 is absorbed
const BIOSPHERE_HALFLIFE = 1/50;
const DEEP_OCEAN_HALFLIFE = 1/500;
const GEOLOGICAL_HALFLIFE = 1/10000;
// Annual reduction from each source of CO2 sequestration
const BIOSPHERE_ANNUAL_REDUCTION = 0.5 ** BIOSPHERE_HALFLIFE; // 50 years until half is taken up by plants and upper ocean
const DEEP_OCEAN_ANNUAL_REDUCTION = 0.5 ** DEEP_OCEAN_HALFLIFE; // 500 years until half is taken up by the deep ocean
const GEOLOGICAL_ANNUAL_REDUCTION = 0.5 ** GEOLOGICAL_HALFLIFE; // 10000 years until rock weathering sequesters half the CO2

// Cap the number of passengers for which to calculate a subset
const MAXIMUM_PASSENGERS = 10;

// Control constants
const MODEL_BUTTON_NAME = 'model';
const FLIGHT_PROFILE_BUTTON_NAME = 'flightProfile';
const SLIDER_KM_RANGE = 0.25; // Percent higher or lower for kilometre range

// Define global document elements populated once DOMContentLoaded fires loadSelectors
let seatsChart = null;
let flightChart = null;

/**
 * Called once the DOM is loaded. Adds a generic event listener for changes to page controls, populates various static elements,
 * adds a 'input' listener to the distance display, and kicks off a default profile display for long-haul flights.
 */
function initialize() {
    // Listen for changes to all page elements
    document.getElementById('contents').addEventListener('change', handleChangeEvent);
    document.getElementById('contents').addEventListener('input', handleInputEvent);
    // Add constants to page
    document.getElementById('minCO2ePerMJ').textContent = MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ;
    document.getElementById('maxCO2ePerMJ').textContent = MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ;
    document.getElementById('mjPerKg').textContent = MJ_PER_KG_JET_FUEL;
}

/**
 * For every control, listen for a 'change' event and fire the appropriate function to update values.
 * 
 * @param {object} event - The object describing the changed element on the page
 */
function handleChangeEvent(event) {
    // For radio buttons we can use the 'name' attribute to recognize the event, because each button has a different ID.
    // However, dropdowns and sliders don't have or need a 'name' because their 'id' works to identify them.
    if (event.target.name == MODEL_BUTTON_NAME) {
        // A specific model has been chosen from the model radio buttons, so update the flight profile buttons
        const selectedModelProfiles = MODELS[event.target.value];
        const flightProfileNames = selectedModelProfiles.map(flightProfile => flightProfile.name);
        replaceButtons('flightButtonDiv', FLIGHT_PROFILE_BUTTON_NAME, flightProfileNames, true);
        // Recalculate using the default first flight profile
        recalculateProfile(selectedModelProfiles[0]);
    } else if (event.target.name == FLIGHT_PROFILE_BUTTON_NAME) {
        // A flight profile other than the default first profile has been selected.
        const selectedModel = MODELS[getSelectedButtonValue(MODEL_BUTTON_NAME)];
        if (selectedModel) {
            recalculateProfile(selectedModel[event.target.value]);
        }
    } else if (event.target.id == 'distanceSlider' ||
               event.target.id == 'yearsSlider' || 
               event.target.id == 'passengerSelector' ||
               event.target.name == 'isReturn') {
        writeData();
    }

    // We don't need to listen for 'change' events from modelSearch, so no 'else' is needed here.
}

/**
 * For every control, listen for an 'input' event and fire the appropriate function to update values.
 * 
 * @param {object} event - The object describing the input element on the page
 */
function handleInputEvent(event) {
    // The only control that we care about for 'input' events is typing into the modelSearch box
    if (event.target.name == 'modelSearch') {
        const filteredModelKeys = Object.keys(MODELS).filter((modelKey) => {
            // Using a safe, case-insensitive search, return only the models with names matching the search term
            const escapedValue = event.target.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(escapedValue, 'i').test(modelKey);
        });
        replaceButtons('modelButtonDiv', MODEL_BUTTON_NAME, filteredModelKeys, false);
        // And now that no model is selected, clear the flight profiles
        replaceButtons('flightButtonDiv', FLIGHT_PROFILE_BUTTON_NAME, [], true);
    } else if (event.target.id == 'distanceSlider') {
        const distanceDisplay = document.getElementById('distanceDisplay');
        distanceDisplay.textContent = event.target.value;
    } else if (event.target.id == 'yearsSlider') {
        const yearsDisplay = document.getElementById('yearsDisplay');
        yearsDisplay.textContent = event.target.value;
    }

    // We don't need to listen for 'input' events from any other controls, so no 'else' is needed here
}

/**
 * Utility function to replace radio buttons in a div
 * 
 * @param {string} divId - The target div to populate with radio buttons
 * @param {string} buttonName - Common identifier for all radio buttons within this div
 * @param {string[]} optionStrings - Array of strings to be used as option values
 * @param {boolean} isIndexed - True if the buttons represent array items where the value is an array index, false if buttons represent object keys as strings
 */
function replaceButtons(divId, buttonName, optionStrings, isIndexed) {
    const buttonDiv = document.getElementById(divId);
    buttonDiv.replaceChildren();
    optionStrings.forEach((optionString, index) => {
        const id = `${buttonName}${index}`;
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = buttonName;
        radio.value = isIndexed ? index : optionString;
        radio.id = id;
        if (isIndexed && index == 0) {
            // Select the first item by default - this is the first and possibly only Flight Profile
            radio.checked = true;
        }

        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.innerHTML = optionString;

        // Create a div for each label and radio button so they are organized vertically
        const innerDiv = document.createElement('div');
        innerDiv.appendChild(radio);
        innerDiv.appendChild(label);
        buttonDiv.appendChild(innerDiv);
    });
}

// Convenience function for recalculateProfile. Used both for models and flight profiles.
// Returns undefined if no button had been checked, so calling methods can tell when to bail out.
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
 * Called when a model or flight configuration is changed. Populates seats, burn, fuelPerSeat,
 * and distanceSlider, then recalculates the distance using default kilometres for the flight config.
 * 
 * @param {FlightProfile} selectedProfile - A single flight profile object
 */
function recalculateProfile(selectedProfile) {
    // Populate data for this profile
    document.getElementById('seats').innerText = `${selectedProfile.seats} seats`;
    document.getElementById('burn').innerText = selectedProfile.burn;

    // Recalculating the profile requires setting the distance slider's initial value and range.
    // If the user moves the slider, the min and max won't change, but we'll need to recalculate all the distance-related values.
    const distanceSlider = document.getElementById('distanceSlider');
    const min = selectedProfile.kilometres * (1 - SLIDER_KM_RANGE);
    const max = selectedProfile.kilometres * (1 + SLIDER_KM_RANGE);
    distanceSlider.min = min.toFixed(0);
    distanceSlider.max = max.toFixed(0);
    distanceSlider.value = selectedProfile.kilometres;
    const distanceDisplay = document.getElementById('distanceDisplay');
    distanceDisplay.innerText = selectedProfile.kilometres;

    const passengerSelector = document.getElementById('passengerSelector');
    passengerSelector.options.length = 0;
    // Deal with celebrities where the entire plane counts as one seat, no matter how many people are in it
    const maximumPassengers = MAXIMUM_PASSENGERS;
    for (let i = 1; i <= maximumPassengers; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        passengerSelector.appendChild(option);
    }

    // We have just repopulated the passenger count, so by default it's 1
    writeData(selectedProfile.kilometres, 1);
}

// Use a standard formatter to add commas to numbers for readability
function getFormattedNumber(x) {
    // TODO: Can we get formatting at the same time as controlling for number of decimals? 
    return x.toLocaleString();
}

/**
 * Calculate the annual reduction in greenhouse heat resulting from a matching reduction in CO2
 * due to the action of the three main greenhouse gas sequestration processes, at different time scales.
 * 
 * @param {number} megajoules - Amount of heat generated from the initial burning of fossil fuel
 * @param {number} yearsToRender - Integer between about 10 and 10000
 */
function calculateData(megajoules, yearsToRender) {
    const initialAnnualHiroshimas = (megajoules / YEARS_TO_DUPLICATE_HEAT) / MJ_PER_HIROSHIMA;
    let biosphereCO2HeatRemaining = initialAnnualHiroshimas * BIOSPHERE_FRACTION;
    let deepOceanCO2HeatRemaining = initialAnnualHiroshimas * DEEP_OCEAN_FRACTION;
    let geologicalCO2HeatRemaining = initialAnnualHiroshimas * GEOLOGICAL_FRACTION;

    // Use the Pulse Response Model to generate a sum of exponentials.
    const data = [];
    let runningTotal = 0;
    let yearsTo1Hiroshima = 0;
    for (let i = 0; i < yearsToRender; i++) {
        // At i==0, the total will equal the initial megajoules translated into annual Hiroshima equivalents
        const totalThisYear = biosphereCO2HeatRemaining + deepOceanCO2HeatRemaining + geologicalCO2HeatRemaining;
        data.push(totalThisYear + runningTotal);
        runningTotal += totalThisYear;
        if (!yearsTo1Hiroshima && runningTotal >= 1) {
            yearsTo1Hiroshima = i;
        }
        // For every year, reduce the total by the annual reduction for each halflife
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
* Calculates the kilograms of fuel burned overall and just the share for the given number of passengers,
* then derives all other reported values to insert into the data and chart.
*/
function writeData() {
    const modelName = getSelectedButtonValue(MODEL_BUTTON_NAME);
    if (!modelName) {
        // The user is playing with other controls before the model has been chosen. Ignore.
    } else {
        const yearsToRender = document.getElementById('yearsSlider').value;
        const kilometres = document.getElementById('distanceSlider').value;
        const passengerCount = document.getElementById('passengerSelector').value;
        const returnButton = document.getElementById('returnFlight');
        const selectedModel = MODELS[modelName];
        const selectedProfile = selectedModel[getSelectedButtonValue(FLIGHT_PROFILE_BUTTON_NAME)];
        // Double the distance if it's a return flight
        const kmMultiplier = returnButton.checked ? 2 : 1;
        const kgFuelBurned = selectedProfile.burn * kilometres * kmMultiplier;
        const megajoules = kgFuelBurned * MJ_PER_KG_JET_FUEL;
        const kgSeatFuelBurned = kgFuelBurned / selectedProfile.seats * passengerCount;
        const seatsMegajoules = kgSeatFuelBurned * MJ_PER_KG_JET_FUEL;

        const seatsText = passengerCount == 1 ? 'Your seat' : `Your ${passengerCount} seats`;
        const { data: seatsData, yearsTo1Hiroshima: seatsYearsTo1Hiroshima } = calculateData(seatsMegajoules, yearsToRender);
        writeSeatsData(kgSeatFuelBurned, seatsMegajoules, seatsText, seatsYearsTo1Hiroshima);
        seatsChart = buildChart(seatsChart, 'SeatsChart', seatsData, yearsToRender, seatsText, 'red');

        const { data, yearsTo1Hiroshima } = calculateData(megajoules, yearsToRender);
        writeFlightData(kgFuelBurned, megajoules, returnButton.checked, yearsTo1Hiroshima);
        flightChart = buildChart(flightChart, 'FlightChart', data, yearsToRender, `${modelName} - ${selectedProfile.name}`, 'yellow');
    }
}

/**
 * Populate the values on the page for just your seats.
 * 
 * @param {number} kgContextFuelBurned - kilograms of fuel burned either by the subset of passengers or the annual superset of flights
 * @param {number} seatsMegajoules - Amount of heat generated either from the passenger subset or the annual superset
 * @param {string} seatsText - singular or plural description of seats
 * @param {number} seatsYearsTo1Hiroshima - number of years until just your seats' portion of the flight generates one Hiroshima's warming
 */
function writeSeatsData(kgContextFuelBurned, seatsMegajoules, seatsText, seatsYearsTo1Hiroshima) {
    document.getElementById('seatsTitle').innerText = `RUNNING TOTAL FOR JUST ${seatsText.toUpperCase()}`;
    document.getElementById('seatsFuelBurned').innerText = `${getFormattedNumber(kgContextFuelBurned)} kg`;

    const seatsTotalCO2 = seatsMegajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000;
    document.getElementById('seatsTotalCO2').innerText = `${getFormattedNumber(seatsTotalCO2)} kg`;

    const percentContextHiroshima = seatsMegajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('seatsImmediateHeat').innerText = `${getFormattedNumber(percentContextHiroshima)}%`;

    const greenhouseKaboomText = seatsYearsTo1Hiroshima > 0 ? `${seatsYearsTo1Hiroshima} years` : 'out of range';
    document.getElementById('seatsGreenhouseHeat').innerText = greenhouseKaboomText;
}

/**
 * Populate the flight-specific values on the page
 * 
 * @param {number} kgFuelBurned  - kilograms of fuel burned for this flight (or two flights if return trip)
 * @param {number} megajoules - Amount of heat generated from this flight
 * @param {boolean} isReturnFlight - false if one way flight, true if return flight
 * @param {number} yearsTo1Hiroshima - number of years until the flight generates one Hiroshima's warming
 */
function writeFlightData(kgFuelBurned, megajoules, isReturnFlight, yearsTo1Hiroshima) {
    const flightText = `this ${isReturnFlight ? 'return' : 'one way'} flight`;
    document.getElementById('flightTitle').innerText = `RUNNING TOTAL FOR ${flightText.toUpperCase()}`;
    document.getElementById('flightFuelBurned').innerText = `${getFormattedNumber(kgFuelBurned)} kg`;

    const totalCO2 = megajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000;
    document.getElementById('flightTotalCO2').innerText = `${getFormattedNumber(totalCO2)} kg`;

    const percentContextHiroshima = megajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('flightImmediateHeat').innerText = `${getFormattedNumber(percentContextHiroshima)}%`;

    const greenhouseKaboomText = yearsTo1Hiroshima > 0 ? `${yearsTo1Hiroshima} years` : 'out of range';
    document.getElementById('flightGreenhouseHeat').innerText = greenhouseKaboomText;
}
