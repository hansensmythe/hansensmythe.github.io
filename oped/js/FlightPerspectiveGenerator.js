document.addEventListener('DOMContentLoaded', initialize);
import { MODELS } from './flights.js';

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
const MAXIMUM_PASSENGERS = 10;

// Control constants
const MODEL_BUTTON_NAME = 'model';
const FLIGHT_PROFILE_BUTTON_NAME = 'flightProfile';
const SLIDER_KM_RANGE = 0.25; // Percent higher or lower for kilometre range

// Chart constants
const YEARS_TO_RENDER = 10000; // TODO: This should be user-modifiable
const LABEL_FONT_SIZE = 20;
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

// Define global document elements populated once DOMContentLoaded fires loadSelectors
let seatsChart = null;
let flightChart = null;

/**
 * Called once the DOM is loaded. Adds a generic event listener for changes to page controls, populates various static elements,
 * adds a 'input' listener to the distance display, and kicks off a default profile display for long-haul flights.
 */
function initialize() {
    // Listen for changes to all select elements
    document.getElementById('contents').addEventListener('change', handleChangeEvent);
    document.getElementById('contents').addEventListener('input', handleInputEvent);

    // Chart.defaults.backgroundColor = '#9BD0F5';
    // Chart.defaults.borderColor = '#36A2EB';
    // Chart.defaults.color = '#f00';
    // Add constants to page
    document.getElementById('minCO2ePerMJ').textContent = MIN_OIL_SANDS_JET_FUEL_gCO2ePerMJ;
    document.getElementById('maxCO2ePerMJ').textContent = MAX_OIL_SANDS_JET_FUEL_gCO2ePerMJ;
    document.getElementById('mjPerKg').textContent = MJ_PER_KG_JET_FUEL;

    // Add a listener for tweaks to the kilometre value of a flight profile
    const distanceSlider = document.getElementById('distanceSlider');
    const distanceDisplay = document.getElementById('distanceDisplay');
    // Triggers continuously while dragging. We do not recalculate until the 'change' event.
    distanceSlider.addEventListener('input', function (event) {
        distanceDisplay.textContent = event.target.value;
    });

    // TODO: Is there a meaningful default that we should kick off?
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
        recalculateProfile(selectedModel[event.target.value]);
    } else if (event.target.id == 'distanceSlider') {
        writeData(event.target.value, document.getElementById('passengerSelector').value);
    } else if (event.target.id == 'passengerSelector') {
        writeData(document.getElementById('distanceSlider').value, event.target.value);
    } else if (event.target.name == 'isReturn') {
        writeData(document.getElementById('distanceSlider').value, document.getElementById('passengerSelector').value);
    }

    // We don't need to listen for 'change' events from modelSearch, so no 'else' is needed here
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
        if (index == 0) {
            // Select the first item by default
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

// Convenience function for recalculateProfile and buildChart. Used both for models and flight profiles.
function getSelectedButtonValue(buttonName) {
    return document.querySelector(`input[name="${buttonName}"]:checked`).value;
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
* Calculates the kilograms of fuel burned overall and just the share for the given number of passengers,
* then derives all other reported values to insert into the data and chart.
* 
* @param {number} kilometres 
* @param {number} passengerCount 
*/
function writeData(kilometres, passengerCount) {
    const modelName = getSelectedButtonValue(MODEL_BUTTON_NAME);
    const selectedModel = MODELS[modelName];
    const selectedProfile = selectedModel[getSelectedButtonValue(FLIGHT_PROFILE_BUTTON_NAME)];
    // TODO: Getting undefined selectedProfile here. Is getting button index broken?
    const returnButton = document.getElementById('returnFlight');
    // Double the distance if it's a return flight
    const kmMultiplier = returnButton.checked ? 2 : 1;

    const kgFuelBurned = selectedProfile.burn * kilometres * kmMultiplier;
    const megajoules = kgFuelBurned * MJ_PER_KG_JET_FUEL;
    writeFlightData(kgFuelBurned, megajoules, returnButton.checked);

    const kgContextFuelBurned = kgFuelBurned / selectedProfile.seats * passengerCount;
    const seatsMegajoules = kgContextFuelBurned * MJ_PER_KG_JET_FUEL;
    const seatsText = passengerCount == 1 ? 'Your seat' : `Your ${passengerCount} seats`;
    writeSeatsData(kgContextFuelBurned, seatsMegajoules, seatsText);

    buildCharts(modelName, selectedProfile, megajoules, seatsMegajoules, seatsText);
}

/**
 * Populate the values on the page for just your seats.
 * 
 * @param {number} kgContextFuelBurned - kilograms of fuel burned either by the subset of passengers or the annual superset of flights
 * @param {number} seatsMegajoules - Amount of heat generated either from the passenger subset or the annual superset
 * @param {string} seatsText - singular or plural description of seats
 */
function writeSeatsData(kgContextFuelBurned, seatsMegajoules, seatsText) {
    document.getElementById('seatsTitle').innerText = `RUNNING TOTAL FOR JUST ${seatsText.toUpperCase()}`;
    document.getElementById('seatsFuelBurned').innerText = `${getFormattedNumber(kgContextFuelBurned)} kg`;

    const seatsTotalCO2 = seatsMegajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000;
    document.getElementById('seatsTotalCO2').innerText = `${getFormattedNumber(seatsTotalCO2)} kg`;

    const percentContextHiroshima = seatsMegajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('seatsImmediateHeat').innerText = `${getFormattedNumber(percentContextHiroshima)}%`;

    const seatsTimeForHiroshima = MJ_PER_HIROSHIMA / seatsMegajoules * YEARS_TO_DUPLICATE_HEAT;
    document.getElementById('seatsGreenhouseHeat').innerText = `${getFormattedNumber(seatsTimeForHiroshima)} years`;
}

/**
 * Populate the flight-specific values on the page
 * 
 * @param {number} kgFuelBurned  - kilograms of fuel burned for this flight (or two flights if return trip)
 * @param {number} megajoules - Amount of heat generated from this flight
 * @param {boolean} isReturnFlight - false if one way flight, true if return flight
 */
function writeFlightData(kgFuelBurned, megajoules, isReturnFlight) {
    const flightText = `this ${isReturnFlight ? 'return' : 'one way'} flight`;
    document.getElementById('flightTitle').innerText = `RUNNING TOTAL FOR ${flightText.toUpperCase()}`;
    document.getElementById('flightFuelBurned').innerText = `${getFormattedNumber(kgFuelBurned)} kg`;

    const totalCO2 = megajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000;
    document.getElementById('flightTotalCO2').innerText = `${getFormattedNumber(totalCO2)} kg`;

    const percentContextHiroshima = megajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('flightImmediateHeat').innerText = `${getFormattedNumber(percentContextHiroshima)}%`;

    const timeForHiroshima = MJ_PER_HIROSHIMA / megajoules * YEARS_TO_DUPLICATE_HEAT;
    document.getElementById('flightGreenhouseHeat').innerText = `${getFormattedNumber(timeForHiroshima)} years`;
}

/**
 * Build the charts from the data.
 * 
 * @param {object} modelName - The name of the aircraft model for the selected flight profile
 * @param {object} selectedProfile - The selected flight profile
 * @param {number} megajoules - Amount of heat generated by the flight, derived from the kg of fuel burned
 * @param {number} seatsMegajoules - Amount of heat generated either from the passenger subset or the annual superset
 * @param {string} seatsText - singular or plural description of seats
 */
function buildCharts(modelName, selectedProfile, megajoules, seatsMegajoules, seatsText) {
    const options = {
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: LABEL_FONT_SIZE
                    },
                    color: 'white'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'cyan'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Hiroshima equivalents over time',
                    font: {
                        size: LABEL_FONT_SIZE,
                        weight: 'bold'
                    },
                    color: 'red',
                },
                ticks: {
                    font: {
                        size: LABEL_FONT_SIZE
                    },
                    color: 'red',
                    beginAtZero: true
                }
            }
        }
    };

    buildSeatsChart(options, modelName, seatsText, seatsMegajoules);

    buildFlightChart(options, modelName, selectedProfile.name, megajoules);
}

/**
 * 
 * @param {*} initialAnnualHiroshimas 
 * @param {*} yearsToRender 
 */
function calculateDataArray(initialAnnualHiroshimas, yearsToRender) {
    let biosphereCO2HeatRemaining = initialAnnualHiroshimas * BIOSPHERE_FRACTION;
    let deepOceanCO2HeatRemaining = initialAnnualHiroshimas * DEEP_OCEAN_FRACTION;
    let geologicalCO2HeatRemaining = initialAnnualHiroshimas * GEOLOGICAL_FRACTION;

    // Use the Pulse Response Model to generate a sum of exponentials.
    const totalAnnualHiroshimas = [];
    let runningTotal = 0;
    for (let i = 0; i < yearsToRender; i++) {
        const totalThisYear = biosphereCO2HeatRemaining + deepOceanCO2HeatRemaining + geologicalCO2HeatRemaining;
        totalAnnualHiroshimas.push(totalThisYear + runningTotal);
        runningTotal += totalThisYear;
        // Reduce the annual total by the annual reduction for each halflife
        biosphereCO2HeatRemaining *= BIOSPHERE_ANNUAL_REDUCTION;
        deepOceanCO2HeatRemaining *= DEEP_OCEAN_ANNUAL_REDUCTION;
        geologicalCO2HeatRemaining *= GEOLOGICAL_ANNUAL_REDUCTION;
    }
    return totalAnnualHiroshimas;

}

function buildSeatsChart(options, modelName, seatsText, seatsMegajoules) {
    const seatsContext = document.getElementById('SeatsChart').getContext('2d');
    if (seatsChart) {
        seatsChart.destroy(); // Free the canvas if a previous chart already exists there
    }

    // Chart is imported in HTML. Ignore the warning about Chart being undefined.
    seatsChart = new Chart(seatsContext, {
        type: 'line',
        data: {
            labels: Array.from(
                { length: YEARS_TO_RENDER },
                (_, index) => new Date().getFullYear() + index
            ),
            datasets: [
                {
                    label: `${seatsText} on ${modelName}`,
                    data: calculateDataArray((seatsMegajoules / YEARS_TO_DUPLICATE_HEAT) / MJ_PER_HIROSHIMA, YEARS_TO_RENDER),
                    borderColor: '#FF0000',
                    backgroundColor: "#ff6a00"
                }
            ]
        },
        options: options
    });
}

function buildFlightChart(options, modelName, profileName, megajoules) {
    const flightContext = document.getElementById('FlightChart').getContext('2d');
    if (flightChart) {
        flightChart.destroy(); // Free the canvas if a previous chart already exists there
    }

    // Chart is imported in HTML. Ignore the warning about Chart being undefined.
    flightChart = new Chart(flightContext, {
        type: 'line',
        data: {
            labels: Array.from(
                { length: YEARS_TO_RENDER },
                (_, index) => new Date().getFullYear() + index
            ),
            datasets: [
                {
                    label: `${modelName} - ${profileName}`,
                    data: calculateDataArray((megajoules / YEARS_TO_DUPLICATE_HEAT) / MJ_PER_HIROSHIMA, YEARS_TO_RENDER),
                    borderColor: '#FF0000',
                    backgroundColor: "#b6c6d5"
                }
            ]
        },
        options: options
    });
}
