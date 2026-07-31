document.addEventListener('DOMContentLoaded', initialize);
import { getFilteredManufacturers } from './aircraft.js';

// From https://www.bts.gov/content/energy-consumption-mode-transportation-0
const MJ_PER_KG_JET_FUEL = 43.1;
// From https://www.sciencedirect.com/science/article/abs/pii/S0360544215006593?via%3Dihub
const MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ = 92.5;
const MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ = 126.5;
const AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ = (MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ + MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ) / 2;
// Megajoules of heat for different types of nuclear bomb
const MJ_PER_HIROSHIMA = 63000000;
// const MJ_PER_MEGATONNE = 4184000000;
// Rough estimate of every two months. Good on human scales, but does not include the long tail
const YEARS_TO_DUPLICATE_HEAT = 1 / 6;
const MONTHS_PER_YEAR = 12;
const AVG_DAYS_PER_MONTH = 30.4375;
const MAXIMUM_PASSENGERS = 10;

// Chart constants
const YEARS_TO_RENDER = 75;
const LABEL_FONT_SIZE = 20;
const SLIDER_KM_RANGE = 0.25;

// Define global document elements populated once DOMContentLoaded fires loadSelectors
let manufacturerSelector;
let profileKey;
let filteredManufacturers;
let flightChart = null;

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
    // Add constants to page
    document.getElementById('minCO2ePerMJ').textContent = MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ;
    document.getElementById('maxCO2ePerMJ').textContent = MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ;
    document.getElementById('mjPerKg').textContent = MJ_PER_KG_JET_FUEL;
    document.getElementById('yearsToRender').textContent = YEARS_TO_RENDER;

    // Populate filtered subsets of the data by calling function in aircraft.js
    filteredManufacturers = getFilteredManufacturers();

    // Add a listener for tweaks to the kilometre value of a flight profile
    const distanceSlider = document.getElementById('distanceSlider');
    const distanceDisplay = document.getElementById('distanceDisplay');
    // Triggers continuously while dragging. We do not recalculate until the 'change' event.
    distanceSlider.addEventListener('input', function (event) {
        distanceDisplay.textContent = event.target.value;
    });

    // Kick off an initial filterByProfile to populate the default
    filterByProfile('long');
}

/**
 * For every control, listen for a 'change' event and fire the appropriate function to update values.
 * 
 * @param {object} event - The object describing the changed element on the page
 */
function handleChangeEvent(event) {
    // For radio buttons we can use the 'name' attribute to recognize the event, because each button has a different ID.
    // However, dropdowns and sliders don't have or need a 'name' because their 'id' works to identify them.
    if (event.target.name == 'profileFilter') {
        filterByProfile(event.target.value);
    } else if (event.target.id == 'manufacturerSelector') {
        selectManufacturer(event.target.value);
    } else if (event.target.id == 'modelSelector') {
        const selectedModel = filteredManufacturers[profileKey][manufacturerSelector.value].models[event.target.value];
        replaceFlightProfileButtons(selectedModel.flightProfiles);
        recalculateProfile();
    } else if (event.target.name == 'flightProfile') {
        recalculateProfile();
    } else if (event.target.id == 'distanceSlider') {
        buildChart(event.target.value, document.getElementById('passengerSelector').value);
    } else if (event.target.id == 'passengerSelector') {
        buildChart(document.getElementById('distanceSlider').value, event.target.value);
    } else if (event.target.name == 'isReturn') {
        buildChart(document.getElementById('distanceSlider').value, document.getElementById('passengerSelector').value);
    } else {
        console.log(`Found unhandled change event for id=${event.target.id} or name=${event.target.name}`)
    }
}

/**
 * Called at initialization or when a flight profile radio button is clicked,
 * to load the filtered manufacturers and populate the models, and for the first model, populate the flights.
 *  
 * @param {string} key - one of 'commuter', 'regional', 'short', 'medium', 'long', 'private', or 'all'. Used to get the subset of manufacturers matching that profile.
 */
function filterByProfile(key) {
    // Store profileKey global value
    profileKey = key;
    manufacturerSelector = document.getElementById('manufacturerSelector');
    // Clear all previous manufacturer lists
    manufacturerSelector.options.length = 0;
    filteredManufacturers[profileKey].forEach((manufacturer, index) => {
        manufacturerSelector.add(new Option(manufacturer.name, index));
    });

    // Call selectManufacturer on the first element to populate other dropdowns
    selectManufacturer(0);
}

/**
 * Called when the model is initialized or updated, to create or replace the radio buttons for the flight profiles.
 * Typically there will be just one, but for larger planes there was sometimes data for multiple configurations,
 * e.g. different numbers of seats, or custom data for different celebrities.
 * 
 * @param {FlightProfile[]} flightProfiles - Array of flight profile objects matching the selected model and filtered for the flight profile range.
 */
function replaceFlightProfileButtons(flightProfiles) {
    const flightButtonDiv = document.getElementById('flightButtonDiv');
    flightButtonDiv.replaceChildren();
    flightProfiles.forEach((profile, index) => {
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
        label.innerHTML = profile.name;

        // Create a div for each label and radio button so they are organized vertically
        const innerDiv = document.createElement('div');
        innerDiv.appendChild(radio);
        innerDiv.appendChild(label);
        flightButtonDiv.appendChild(innerDiv);
    });
}

/**
 * Called whenever the flight profile range changes, or when a specific manufacturer is selected.
 * Loads the models for the manufacturer and the flight profile buttons for the first model.
 * 
 * @param {number} manufacturerIndex 
 */
function selectManufacturer(manufacturerIndex) {
    const selectedManufacturer = filteredManufacturers[profileKey][manufacturerIndex];
    // Clear all previous models and profiles
    const modelSelector = document.getElementById('modelSelector');
    modelSelector.options.length = 0;
    // For each model containing the selected profile type, populate the model dropdown
    selectedManufacturer.models.forEach((model, index) => {
        modelSelector.add(new Option(model.name, index));
    });

    replaceFlightProfileButtons(selectedManufacturer.models[0].flightProfiles);

    recalculateProfile();
}

// Convenience function for recalculateProfile and buildChart
function getSelectedProfileIndex() {
    return document.querySelector('input[name="flightProfile"]:checked').value;
}

/**
 * Called when a manufacturer, model, or flight configuration is changed. Populates seats, burn, fuelPerSeat,
 * and distanceSlider, then recalculates the distance using default kilometres for the flight config.
 */
function recalculateProfile() {
    const modelSelector = document.getElementById('modelSelector');
    const selectedModel = filteredManufacturers[profileKey][manufacturerSelector.value].models[modelSelector.value];
    const selectedProfile = selectedModel.flightProfiles[getSelectedProfileIndex()];
    // Populate data for this profile
    document.getElementById('seats').innerText = selectedProfile.isPrivate() ? 'private owner uses entire plane' : `${selectedProfile.seats} seats`;
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
    const maximumPassengers = selectedProfile.isPrivate() ? 1 : MAXIMUM_PASSENGERS;
    for (let i = 1; i <= maximumPassengers; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        passengerSelector.appendChild(option);
    }

    // We have just repopulated the passenger count, so by default it's 1
    buildChart(selectedProfile.kilometres, 1);
}

// Use a standard formatter to add commas to numbers for readability
function getFormattedNumber(x) {
    // TODO: Can we get formatting and also number of decimals? 
    return x.toLocaleString();
}

/**
* Calculates the kilograms of fuel burned overall and just the share for the given number of passengers,
* then derives all other reported values to insert into the data and chart.
* 
* @param {number} kilometres 
* @param {number} passengerCount 
*/
function buildChart(kilometres, passengerCount) {
    const modelSelector = document.getElementById('modelSelector');
    const selectedManufacturer = filteredManufacturers[profileKey][manufacturerSelector.value];
    const selectedModel = selectedManufacturer.models[modelSelector.value];
    const selectedProfile = selectedModel.flightProfiles[getSelectedProfileIndex()];
    const returnButton = document.getElementById('returnFlight');
    // Double the distance if it's a return flight
    const kmMultiplier = returnButton.checked ? 2 : 1;
    const flightText = `this ${returnButton.checked ? 'return' : 'one way'} flight`;

    const kgFuelBurned = selectedProfile.burn * kilometres * kmMultiplier;
    const megajoules = kgFuelBurned * MJ_PER_KG_JET_FUEL;
    writeFlightData(kgFuelBurned, megajoules, flightText);

    // For public passengers, the second set of data provides information on personal fraction of the heating,
    // but for private jets, the annual amount of heating from all the flights: two very different contexts.
    const kgContextFuelBurned = selectedProfile.isPrivate() ? kgFuelBurned * selectedProfile.privateFlightsPerYear : kgFuelBurned / selectedProfile.seats * passengerCount;
    const contextMegajoules = kgContextFuelBurned * MJ_PER_KG_JET_FUEL;
    const seatsText = passengerCount == 1 ? 'your seat' : `your ${passengerCount} seats`;
    writeContextData(kgContextFuelBurned, contextMegajoules, seatsText, selectedProfile);

    const ctx = document.getElementById('IFChart').getContext('2d');
    if (flightChart) {
        flightChart.destroy(); // Free the canvas if a previous chart already exists there
    }
    const datasets = [
        {
            label: `${selectedManufacturer.name} ${selectedModel.name} - ${selectedProfile.name}`,
            data: Array.from(
                { length: YEARS_TO_RENDER },
                (_, index) => ((index + 1) * (megajoules / YEARS_TO_DUPLICATE_HEAT)) / MJ_PER_HIROSHIMA
            ),
            backgroundColor: "#b6c6d5"
        },
        {
            label: selectedProfile.isPrivate() ? "One year's worth of flights" : seatsText,
            data: Array.from(
                { length: YEARS_TO_RENDER },
                (_, index) => ((index + 1) * (contextMegajoules / YEARS_TO_DUPLICATE_HEAT)) / MJ_PER_HIROSHIMA
            ),
            backgroundColor: "#ff6a00"
        }
    ];

    flightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from(
                { length: YEARS_TO_RENDER },
                (_, index) => new Date().getFullYear() + index
            ),
            datasets: datasets
        },
        options: {
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
        }
    });
}

// Populate the flight-specific values on the page
function writeFlightData(kgFuelBurned, megajoules, flightText) {
    document.getElementById('flightFuelBurned').innerText = `${getFormattedNumber(kgFuelBurned)} kg on ${flightText}`;
    // Convert grams per megajoule into kilograms of CO2 for the flight
    document.getElementById('flightTotalCO2').innerText = `${getFormattedNumber(megajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000)} kg on ${flightText}`;
    document.getElementById('flightImmediateHeat').innerText = `${getFormattedNumber(megajoules / MJ_PER_HIROSHIMA * 100)}% on ${flightText}`;
    const mjToMakeHiroshima = MJ_PER_HIROSHIMA / megajoules;
    document.getElementById('flightGreenhouseHeat').innerText = `${getFormattedNumber(mjToMakeHiroshima * YEARS_TO_DUPLICATE_HEAT)} years for ${flightText}`;
}

// Populate the values on the page that change with context: annual for private jets, just your seats for public flights
function writeContextData(kgContextFuelBurned, contextMegajoules, seatsText, selectedProfile) {
    document.getElementById('contextFuelBurned').innerText = `${getFormattedNumber(kgContextFuelBurned)} kg ${selectedProfile.isPrivate() ? 'annually' : 'for ' + seatsText}`;

    const contextTotalCO2 = contextMegajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000;
    document.getElementById('contextTotalCO2').innerText = `${getFormattedNumber(contextTotalCO2)} kg ${selectedProfile.isPrivate() ? 'annually' : 'for ' + seatsText}`;

    const percentContextHiroshima = contextMegajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('contextImmediateHeat').innerText = `${getFormattedNumber(percentContextHiroshima)}% ${selectedProfile.isPrivate() ? 'annually' : 'for ' + seatsText }`;

    // Because the time duration for context data can change, the label for the data is generated here
    const mjContextToMakeHiroshima = MJ_PER_HIROSHIMA / contextMegajoules;
    // Some egregious private flyers generate a Hiroshima's worth of warming in less than a year. Change the time context for readability.
    let contextTimeForHiroshima = mjContextToMakeHiroshima * YEARS_TO_DUPLICATE_HEAT;
    let contextTimeLabel = 'years';
    if (contextTimeForHiroshima < 1) {
        // Try months
        contextTimeForHiroshima *= MONTHS_PER_YEAR;
        contextTimeLabel = 'months';
    }
    if (contextTimeForHiroshima < 1) {
        // Try days
        contextTimeForHiroshima *= AVG_DAYS_PER_MONTH;
        contextTimeLabel = 'days';
    }
    document.getElementById('contextGreenhouseHeat').innerText = `${getFormattedNumber(contextTimeForHiroshima)} ${contextTimeLabel} ${selectedProfile.isPrivate() ? ' at the current rate of ' + selectedProfile.privateFlightsPerYear + ' flights per year' : ' by ' + seatsText }`;
}

