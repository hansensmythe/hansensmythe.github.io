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
const MAXIMUM_PASSENGERS = 8;

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

    const passengerSelector = document.getElementById('passengerSelector');
    for (let i = 1; i <= MAXIMUM_PASSENGERS; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        passengerSelector.appendChild(option);
    }

    // Add a listener for tweaks to the kilometre value of a flight profile
    const distanceSlider = document.getElementById('distance');
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
    if (event.target.name == 'profile') {
        filterByProfile(event.target.value);
    } else if (event.target.id == 'manufacturerSelector') {
        selectManufacturer(event.target.value);
    } else if (event.target.id == 'modelSelector') {
        const selectedModel = filteredManufacturers[profileKey][manufacturerSelector.value].models[event.target.value];
        replaceFlightProfileButtons(selectedModel.flightProfiles);
        recalculateProfile();
    } else if (event.target.id == 'distance') {
        recalculateDistance(event.target.value);
    } else {
        // event.target.name == 'flight' or event.target.name == 'isReturn' or event.target.id == 'passengerSelector'
        recalculateProfile();
    }
}

/**
 * Called at initialization or when a flight profile radio button is clicked,
 * to load the filtered manufacturers and populate the models, and for the first model, populate the flights.
 *  
 * @param {string} key - one of 'commuter', 'regional', 'short', 'medium', 'long', or 'all'. Used to get the subset of manufacturers matching that profile.
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
 * Typically there will be just one, but for larger planes there was sometimes data for multiple configurations, e.g. different numbers of seats.
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
        radio.name = 'flight';
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

/**
 * Called when a manufacturer, model, flight configuration, or passenger count is changed. Populates seats, burn,
 * fuelPerSeat, and distanceSlider, then recalculates the distance using default kilometres for the flight config.
 */
function recalculateProfile() {
    const modelSelector = document.getElementById('modelSelector');
    const selectedFlight = document.querySelector('input[name="flight"]:checked');
    const selectedModel = filteredManufacturers[profileKey][manufacturerSelector.value].models[modelSelector.value];
    const selectedProfile = selectedModel.flightProfiles[selectedFlight.value];
    // Populate data for this profile
    document.getElementById('seats').innerText = selectedProfile.seats;
    document.getElementById('burn').innerText = selectedProfile.burn;
    document.getElementById('fuelPerSeat').innerText = selectedProfile.fuelPerSeat; // Display only - not for calculation

    // Recalculating the profile requires setting the distance slider's initial value and range.
    // If the user moves the slider, the min and max won't change, but we'll need to recalculate all the distance-related values.
    const distanceSlider = document.getElementById('distance');
    const min = selectedProfile.kilometres * (1 - SLIDER_KM_RANGE);
    const max = selectedProfile.kilometres * (1 + SLIDER_KM_RANGE);
    distanceSlider.min = min.toFixed(0);
    distanceSlider.max = max.toFixed(0);
    distanceSlider.value = selectedProfile.kilometres;
    const distanceDisplay = document.getElementById('distanceDisplay');
    distanceDisplay.innerText = selectedProfile.kilometres;

    recalculateDistance(selectedProfile.kilometres);
}

/**
 * Calculates the kilograms of fuel burned, and derives all other reported values.
 * @param {number} kilometres 
 */
function recalculateDistance(kilometres) {
    const modelSelector = document.getElementById('modelSelector');
    const selectedFlight = document.querySelector('input[name="flight"]:checked');
    const selectedManufacturer = filteredManufacturers[profileKey][manufacturerSelector.value];
    const selectedModel = selectedManufacturer.models[modelSelector.value];
    const selectedProfile = selectedModel.flightProfiles[selectedFlight.value];
    const returnButton = document.getElementById('return');
    // Double the distance if it's a return flight
    const kmMultiplier = returnButton.checked ? 2 : 1;
    const passengerSelector = document.getElementById('passengerSelector');

    const kgFuelBurned = selectedProfile.burn * kilometres * kmMultiplier;
    document.getElementById('fuelBurned').innerText = kgFuelBurned.toFixed(2);
    const kgSeatFuelBurned = kgFuelBurned / selectedProfile.seats * passengerSelector.value;
    document.getElementById('seatFuelBurned').innerText = kgSeatFuelBurned.toFixed(2);

    const megajoules = kgFuelBurned * MJ_PER_KG_JET_FUEL;
    // Convert grams per megajoule into kilograms of CO2 for the flight
    const totalCO2 = megajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000;
    document.getElementById('totalCO2').innerText = totalCO2.toFixed(2);
    const percentHiroshima = megajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('immediate').innerText = `${percentHiroshima.toFixed(2)}%`;
    const mjToMakeHiroshima = MJ_PER_HIROSHIMA / megajoules;
    const yearsForHiroshima = mjToMakeHiroshima * YEARS_TO_DUPLICATE_HEAT;
    document.getElementById('hiroshima').innerText = yearsForHiroshima.toFixed(1);

    const seatMegajoules = kgSeatFuelBurned * MJ_PER_KG_JET_FUEL;
    const seatTotalCO2 = seatMegajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000;
    document.getElementById('pTotalCO2').innerText = seatTotalCO2.toFixed(2);
    const percentSeatHiroshima = seatMegajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('pImmediate').innerText = `${percentSeatHiroshima.toFixed(4)}%`;
    const mjSeatToMakeHiroshima = MJ_PER_HIROSHIMA / seatMegajoules;
    const seatYearsForHiroshima = mjSeatToMakeHiroshima * YEARS_TO_DUPLICATE_HEAT;
    document.getElementById('pHiroshima').innerText = seatYearsForHiroshima.toFixed(0);

    const ctx = document.getElementById('IFChart').getContext('2d');
    if (flightChart) {
        flightChart.destroy(); // Free the canvas if a previous chart already exists there
    }
    flightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from(
                { length: YEARS_TO_RENDER },
                (_, index) => new Date().getFullYear() + index
            ),
            datasets: [
                {
                    label: `${selectedManufacturer.name} ${selectedModel.name} - ${selectedProfile.name}`,
                    data: Array.from(
                        { length: YEARS_TO_RENDER },
                        (_, index) => ((index + 1) * (megajoules / YEARS_TO_DUPLICATE_HEAT)) / MJ_PER_HIROSHIMA
                    ),
                    fill: false
                },
                {
                    label: `Just your seats`,
                    data: Array.from(
                        { length: YEARS_TO_RENDER },
                        (_, index) => ((index + 1) * (seatMegajoules / YEARS_TO_DUPLICATE_HEAT)) / MJ_PER_HIROSHIMA
                    ),
                    fill: true,
                    backgroundColor: "#ff6a00"
                }

            ]
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
