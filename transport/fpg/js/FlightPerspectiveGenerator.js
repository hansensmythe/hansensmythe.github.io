document.addEventListener('DOMContentLoaded', initialize);
import { MODELS, KM_PLUS_MINUS, SEATS_PLUS_MINUS } from './publicFlightsData.js';
import { buildLineChart, calculateDataSet } from './flightCharts.js';

// From https://www.bts.gov/content/energy-consumption-mode-transportation-0
const MJ_PER_KG_JET_FUEL = 43.1;
// From https://www.sciencedirect.com/science/article/abs/pii/S0360544215006593?via%3Dihub
const MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ = 92.5;
const MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ = 126.5;
const AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ = (MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ + MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ) / 2;
const MJ_PER_HIROSHIMA = 63000000; // Megajoules of heat

// Control constants
const MODEL_BUTTON_NAME = 'model';
const FLIGHT_PROFILE_BUTTON_NAME = 'flightProfile';
const SLIDER_KM_RANGE = 0.25; // Percent higher or lower for kilometre range
const MAXIMUM_FLIGHTS = 20;
const MAXIMUM_PASSENGERS = 10;
// Rough estimate of every two months. Good on human scales, but does not include the long tail
const YEARS_TO_DUPLICATE_HEAT = 1 / 6;
const MONTHS_PER_YEAR = 12;
const AVG_DAYS_PER_MONTH = 30.4375;

// Define global document elements populated once DOMContentLoaded fires loadSelectors
let seatsChart = null;
let flightChart = null;
// Store the current target values for proper flight profile filtering. 0 means unset
let currentSeatsTarget = 0;
let currentKmTarget = 0;

/**
 * Utility function to set rounded values in sliders at initialization
 * 
 * @param {number} num 
 * @returns {number} rounded to nearest 10
 */
function roundToNearest10(num) {
    return Math.round(num / 10) * 10;
}

/**
 * The target has come from a control on the web page, and sometimes turns up as a string, so we
 * sanitize the input before calculating the minimum and maximum.
 * 
 * @param {number} target - The value in the middle of the range
 * @param {number} plusMinus - The factor to add to or subtract from the target
 * @returns {object} containing min and max values above and below the target
 */
function getRange(target, plusMinus) {
    const numericTarget = parseInt(target);
    let min = numericTarget - plusMinus;
    if (min < 0) {
        min = 0;
    }
    const max = numericTarget + plusMinus;
    return {
        min, max
    };
}

function getSeatRange(targetSeats) {
    return getRange(targetSeats, SEATS_PLUS_MINUS);
}

function getSectorRange(targetKilometres) {
    return getRange(targetKilometres, KM_PLUS_MINUS);
}

/**
 * Utility function to replace radio buttons in a div. Always sets value to the optionString because
 * due to profile filtering we can't trust array index values in display buttons to match the raw data.
 * 
 * @param {string} divId - The target div to populate with radio buttons
 * @param {string} buttonName - Common identifier for all radio buttons within this div
 * @param {string[]} optionStrings - Array of strings to be used as option values
 * @param {boolean} isFirstItemChecked - true if we want the first item checked even if there are many items
 */
function replaceButtons(divId, buttonName, optionStrings, isFirstItemChecked) {
    const buttonDiv = document.getElementById(divId);
    buttonDiv.replaceChildren();
    optionStrings.forEach((optionString, index) => {
        const id = `${buttonName}${index}`;
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = buttonName;
        radio.value = optionString;
        radio.id = id;
        if (optionStrings.length == 1 || index == 0 && isFirstItemChecked) {
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

function replaceModelButtons(modelNames) {
    replaceButtons('modelButtonDiv', MODEL_BUTTON_NAME, modelNames, false);
}

function replaceProfileButtons(flightProfileNames) {
    replaceButtons('flightButtonDiv', FLIGHT_PROFILE_BUTTON_NAME, flightProfileNames, true);
}

function populateDropdown(dropdownId, maxValue) {
    const dropdown = document.getElementById(dropdownId);
    // Shouldn't need to clear previous options, e.g. dropdown.options.length = 0;
    for (let i = 1; i <= maxValue; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        dropdown.appendChild(option);
    }
}

/**
 * Called once the DOM is loaded. Adds generic event listeners for inputs and changes to page controls,
 * populates various static elements, and kicks off a default profile display for default size and sector.
 */
function initialize() {
    // Listen for changes to all page elements
    document.getElementById('contents').addEventListener('change', handleChangeEvent);
    document.getElementById('contents').addEventListener('input', handleInputEvent);
    // Add constants to page
    document.getElementById('minCO2ePerMJ').textContent = MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ;
    document.getElementById('maxCO2ePerMJ').textContent = MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ;
    document.getElementById('mjPerKg').textContent = MJ_PER_KG_JET_FUEL;

    // Initialize static dropdown lists
    populateDropdown('flightCountSelector', MAXIMUM_FLIGHTS);
    populateDropdown('passengerCountSelector', MAXIMUM_PASSENGERS);

    // Initially disable all optional controls and charts. They're reenabled once the user has chosen a model.
    hideChartElements(true);

    // Set absolute minimum and maximum slider settings based on MODELS values
    const minSeats = roundToNearest10(Math.min(...MODELS.map(model => model.getMinimumSeats())));
    const maxSeats = roundToNearest10(Math.max(...MODELS.map(model => model.getMaximumSeats())));
    const defaultSeats = roundToNearest10((minSeats + maxSeats) / 2);
    currentSeatsTarget = defaultSeats;
    const seatsSlider = document.getElementById('seatsSlider');
    seatsSlider.min = minSeats;
    seatsSlider.max = maxSeats;
    seatsSlider.value = defaultSeats;
    const aircraftSizeDisplay = document.getElementById('aircraftSizeDisplay');
    const seatRange = getSeatRange(defaultSeats);
    aircraftSizeDisplay.textContent = `${seatRange.min} to ${seatRange.max} seats`;

    const minKilometres = roundToNearest10(Math.min(...MODELS.map(model => model.getMinimumKilometres())));
    const maxKilometres = roundToNearest10(Math.max(...MODELS.map(model => model.getMaximumKilometres())));
    const defaultKilometres = roundToNearest10((minKilometres + maxKilometres) / 2);
    currentKmTarget = defaultKilometres;
    const sectorSlider = document.getElementById('sectorSlider');
    sectorSlider.min = minKilometres;
    sectorSlider.max = maxKilometres;
    sectorSlider.defaultValue = defaultKilometres;
    const sectorDisplay = document.getElementById('sectorDisplay');
    const sectorRange = getSectorRange(defaultKilometres);
    sectorDisplay.textContent = `${sectorRange.min} to ${sectorRange.max} km`;

    // Load the aircraft models that match the defaults above so that the user sees something from the outset
    const filteredModels = MODELS.filter((model) => model.hasMatchingSeats(defaultSeats) && model.hasMatchingSector(defaultKilometres));
    const filteredModelNames = filteredModels.map(filteredModel => filteredModel.name);
    replaceModelButtons(filteredModelNames);
}

/**
 * Toggle visibility of various page elements depending on whether they're usable.
 * 
 * @param {boolean} isHidden - true to hide elements, false to show them
 */
function hideChartElements(isHidden) {
    const hidableElements = [
        document.getElementById('optionalControls'),
        document.getElementById('seatsDiv'),
        document.getElementById('flightDiv')
    ];
    hidableElements.forEach((hidableElement) => {
        hidableElement.style.display = isHidden ? 'none' : 'block';
    });
}

/**
 * Find the selected model using the modelName
 * @param {string} modelName - Identifying name of the aircraft model
 * @returns {object} first model in the data with that name (should always be exactly 1)
 */
function findSelectedModel(modelName) {
    return MODELS.find(model => model.name == modelName);
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
        const selectedModel = findSelectedModel(event.target.value);
        // We may be in the process of selecting a specific model from a size- or sector-filtered list
        // so we should only get the flight profiles that match current values. Use the presence or
        // absence of an aircraft search text to know whether or not to filter the profiles.
        let flightProfileNames;
        if (currentKmTarget > 0 && currentSeatsTarget > 0) {
            // Filter profiles by both size and sector. This typically only happens upon first selecting
            // a model that is presented at initialization time with default size and sector values.
            flightProfileNames = selectedModel.getMatchingProfileNames(currentKmTarget, currentSeatsTarget);
        } else if (currentSeatsTarget > 0) {
            // Use size-filtered profiles
            flightProfileNames = selectedModel.getMatchingAircraftSizeProfileNames(currentSeatsTarget);
        } else if (currentKmTarget > 0) {
            // Use sector-filtered profiles
            flightProfileNames = selectedModel.getMatchingSectorProfileNames(currentKmTarget);
        } else {
            // Model search clears both size and sector filtering, so use all the flight profiles
            flightProfileNames = selectedModel.getProfileNames();
        }
        replaceProfileButtons(flightProfileNames);
        // Recalculate using the default first flight profile
        recalculateProfile(selectedModel.getProfileFromName(flightProfileNames[0]));
    } else if (event.target.name == FLIGHT_PROFILE_BUTTON_NAME) {
        // A flight profile other than the default first profile has been selected.
        const selectedModel = findSelectedModel(getSelectedButtonValue(MODEL_BUTTON_NAME));
        // From the currently selected model, load the flight profile matching the target.
        // We cannot trust indexing from raw data, as the buttons may be filtered.
        const selectedProfile = selectedModel.getProfileFromName(event.target.value);
        recalculateProfile(selectedProfile);
    } else if (event.target.id == 'distanceSlider' ||
        event.target.id == 'flightCountSelector' ||
        event.target.id == 'yearsSlider' ||
        event.target.id == 'passengerCountSelector') {
        writeData();
    }
}

/**
 * For every control, listen for an 'input' event and fire the appropriate function to update values.
 * 
 * @param {object} event - The object describing the input element on the page
 */
function handleInputEvent(event) {
    if (event.target.name == 'modelSearch') {
        handleModelSearchChange(event);
    } else if (event.target.id == 'seatsSlider') {
        handleAircraftSizeChange();
    } else if (event.target.id == 'sectorSlider') {
        handleSectorChange();
    } else if (event.target.id == 'distanceSlider') {
        const distanceDisplay = document.getElementById('distanceDisplay');
        distanceDisplay.textContent = event.target.value;
    } else if (event.target.id == 'yearsSlider') {
        const yearsDisplay = document.getElementById('yearsDisplay');
        yearsDisplay.textContent = event.target.value;
    }

    // We don't need to listen for 'input' events from any other controls, so no 'else' is needed here
}

function handleModelSearchChange(event) {
    // Clear the sector and size displays, as we're selecting by model name
    const sectorDisplay = document.getElementById('sectorDisplay');
    sectorDisplay.textContent = '';
    currentKmTarget = 0;
    const aircraftSizeDisplay = document.getElementById('aircraftSizeDisplay');
    aircraftSizeDisplay.textContent = '';
    currentSeatsTarget = 0;

    const filteredModelNames = MODELS.map(model => model.name).filter((modelName) => {
        // Using a safe, case-insensitive search, return only the models with names matching the search term
        const escapedValue = event.target.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (escapedValue.trim().length > 0) {
            return new RegExp(escapedValue, 'i').test(modelName);
        } else {
            // If the user has deleted the last character, there are no matches, not all matches!
            return false;
        }
    });

    replaceModelButtons(filteredModelNames);
    if (filteredModelNames.length == 1) {
        // The model will already be preselected. Populate flight profiles for the one model
        const selectedModel = findSelectedModel(filteredModelNames[0]);
        replaceProfileButtons(selectedModel.getProfileNames());
        // Recalculate using the first flight profile. We can trust [0] because we're not filtering profile names
        recalculateProfile(selectedModel.flightProfiles[0]);
    } else {
        replaceProfileButtons([]);
        hideChartElements(true);
    }
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

function handleSectorChange() {
    // Clear the aircraft model search
    document.getElementById('modelSearch').value = '';
    // Generate a filtered subset of models that match the kilometres flown.
    const targetKilometres = getIntegerElementValue('sectorSlider');
    const filteredModels = MODELS.filter((model) => model.hasMatchingSector(targetKilometres));
    const filteredModelNames = filteredModels.map(filteredModel => filteredModel.name);
    replaceModelButtons(filteredModelNames);

    if (filteredModelNames.length == 1) {
        // The model will already be preselected. Populate flight profiles for the one model
        const selectedModel = findSelectedModel(filteredModelNames[0]);
        const filteredProfileNames = selectedModel.getMatchingSectorProfileNames(targetKilometres);
        replaceProfileButtons(filteredProfileNames);
        // Recalculate using the first flight profile
        recalculateProfile(selectedModel.getProfileFromName(filteredProfileNames[0]));
    } else {
        replaceProfileButtons([]);
        hideChartElements(true);
    }

    const sectorDisplay = document.getElementById('sectorDisplay');
    const sectorRange = getSectorRange(targetKilometres);
    sectorDisplay.textContent = `${sectorRange.min} to ${sectorRange.max} km`;
    currentKmTarget = targetKilometres;

    // Clear the aircraft size display, as we're selecting only for sector
    const aircraftSizeDisplay = document.getElementById('aircraftSizeDisplay');
    aircraftSizeDisplay.textContent = '';
    currentSeatsTarget = 0;
}

function handleAircraftSizeChange() {
    // Clear the aircraft model search
    document.getElementById('modelSearch').value = '';
    // Generate a filtered subset of models that match the number of aircraft seats.
    const targetSeats = getIntegerElementValue('seatsSlider');
    const filteredModels = MODELS.filter((model) => model.hasMatchingSeats(targetSeats));
    const filteredModelNames = filteredModels.map(filteredModel => filteredModel.name);

    replaceModelButtons(filteredModelNames);
    if (filteredModelNames.length == 1) {
        // The model will already be preselected. Populate flight profiles for the one model
        const selectedModel = findSelectedModel(filteredModelNames[0]);
        const filteredProfileNames = selectedModel.getMatchingAircraftSizeProfileNames(targetSeats);
        replaceProfileButtons(filteredProfileNames);
        // Recalculate using the first flight profile
        recalculateProfile(selectedModel.getProfileFromName(filteredProfileNames[0]));
    } else {
        replaceProfileButtons([]);
        hideChartElements(true);
    }

    const aircraftSizeDisplay = document.getElementById('aircraftSizeDisplay');
    // Display a range centred on the target value
    const seatRange = getSeatRange(targetSeats);
    aircraftSizeDisplay.textContent = `${seatRange.min} to ${seatRange.max} seats`;
    currentSeatsTarget = targetSeats;

    // Clear the sector display, as we're selecting only for number of seats
    const sectorDisplay = document.getElementById('sectorDisplay');
    sectorDisplay.textContent = '';
    currentKmTarget = 0;
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
    // Reenable optional controls
    hideChartElements(false);
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

    writeData();
}

// Use a standard formatter to add commas to numbers for readability
function getFormattedNumber(x) {
    // TODO: Can we get formatting at the same time as controlling for number of decimals? 
    return x.toLocaleString();
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
        const yearsToRender = getIntegerElementValue('yearsSlider');
        const kilometres = getIntegerElementValue('distanceSlider');
        const flightCount = getIntegerElementValue('flightCountSelector');
        const passengerCount = getIntegerElementValue('passengerCountSelector');
        const selectedModel = findSelectedModel(modelName);
        const selectedProfileName = getSelectedButtonValue(FLIGHT_PROFILE_BUTTON_NAME);
        const selectedProfile = selectedModel.getProfileFromName(selectedProfileName);
        // Multiply the distance if there's more than one flight to model
        const kgFuelBurned = selectedProfile.burn * kilometres * flightCount;
        const megajoules = kgFuelBurned * MJ_PER_KG_JET_FUEL;
        const kgSeatFuelBurned = kgFuelBurned / selectedProfile.seats * passengerCount;
        const seatsMegajoules = kgSeatFuelBurned * MJ_PER_KG_JET_FUEL;

        const seatsText = passengerCount == 1 ? 'Your seat' : `Your ${passengerCount} seats`;
        const { data: seatsData, yearsTo1Hiroshima: seatsYearsTo1Hiroshima } = calculateDataSet(seatsMegajoules, yearsToRender);
        writeSeatsData(kgSeatFuelBurned, seatsMegajoules, seatsText, flightCount, seatsYearsTo1Hiroshima);
        // Set the global seatsChart to the new value returned from buildLineChart
        seatsChart = buildLineChart(seatsChart, 'SeatsChart', seatsData, yearsToRender, seatsText);

        const { data, yearsTo1Hiroshima } = calculateDataSet(megajoules, yearsToRender);
        writeFlightData(kgFuelBurned, megajoules, flightCount, yearsTo1Hiroshima);
        flightChart = buildLineChart(flightChart, 'FlightChart', data, yearsToRender, `${modelName} - ${selectedProfile.name}`);
    }
}

/**
 * Populate the values on the page for just your seats.
 * 
 * @param {number} kgContextFuelBurned - kilograms of fuel burned either by the subset of passengers or the annual superset of flights
 * @param {number} seatsMegajoules - Amount of heat generated either from the passenger subset or the annual superset
 * @param {string} title - singular or plural description of seats
 * @param {number} flightCount - Number of flights to model (default 1)
 * @param {number} seatsYearsTo1Hiroshima - number of years until just your seats' portion of the flight(s) generates one Hiroshima's warming, or undefined if out of range
 */
function writeSeatsData(kgContextFuelBurned, seatsMegajoules, title, flightCount, seatsYearsTo1Hiroshima) {
    document.getElementById('seatsTitle').innerText = `CUMULATIVE TOTAL ${flightCount > 1 ? 'FOR ' + flightCount + ' FLIGHTS' : ''} IN JUST ${title.toUpperCase()}`;
    document.getElementById('seatsFuelBurned').innerText = `${getFormattedNumber(kgContextFuelBurned)} kg`;

    const seatsTotalCO2 = seatsMegajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000;
    document.getElementById('seatsTotalCO2').innerText = `${getFormattedNumber(seatsTotalCO2)} kg`;

    const percentContextHiroshima = seatsMegajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('seatsImmediateHeat').innerText = `${getFormattedNumber(percentContextHiroshima)}%`;

    const greenhouseKaboomText = seatsYearsTo1Hiroshima === undefined ? 'out of range' : `${seatsYearsTo1Hiroshima} years`;
    document.getElementById('seatsGreenhouseHeat').innerText = greenhouseKaboomText;
}

/**
 * Populate the flight-specific values on the page
 * 
 * @param {number} kgFuelBurned  - kilograms of fuel burned for this flight (or multiple flights)
 * @param {number} megajoules - Amount of heat generated from this flight
 * @param {number} flightCount - Number of flights to model (default 1)
 * @param {number} yearsTo1Hiroshima - number of years until the flight generates one Hiroshima's warming
 */
function writeFlightData(kgFuelBurned, megajoules, flightCount, yearsTo1Hiroshima) {
    const flightText = `${flightCount > 1 ? 'these ' + flightCount + ' flights' : 'this flight'}`;
    document.getElementById('flightTitle').innerText = `CUMULATIVE TOTAL FOR ${flightText.toUpperCase()}`;
    document.getElementById('flightFuelBurned').innerText = `${getFormattedNumber(kgFuelBurned)} kg`;

    const totalCO2 = megajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000;
    document.getElementById('flightTotalCO2').innerText = `${getFormattedNumber(totalCO2)} kg`;

    const percentContextHiroshima = megajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('flightImmediateHeat').innerText = `${getFormattedNumber(percentContextHiroshima)}%`;

    let greenhouseKaboomText;
    if (yearsTo1Hiroshima === undefined) {
        greenhouseKaboomText = 'out of range';
    } else if (yearsTo1Hiroshima == 0) {
        // Calculate months or days rather than displaying 0 years
        const mjAnnualToMakeHiroshima = MJ_PER_HIROSHIMA / megajoules;
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
        greenhouseKaboomText = `${yearsTo1Hiroshima} year${yearsTo1Hiroshima > 1 ? 's' : ''}`
    }

    document.getElementById('flightGreenhouseHeat').innerText = greenhouseKaboomText;
}
