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
const YEARS_TO_RENDER = 75;

// Define global document elements populated once DOMContentLoaded fires loadSelectors
let manufacturerSelector;
let profileKey;
let filteredManufacturers;
let flightChart = null;

function initialize() {
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

    // The flight profiles are used to filter the data provided. The initial checked profile is 'long' i.e. long-haul.
    const profileSelectors = document.querySelectorAll('input[type="radio"][name="profile"]');
    for (const profile of profileSelectors) {
        profile.addEventListener('input', filterByProfile);
    }
    // Kick off an initial filterByProfile to populate the default
    filterByProfile({ target: { value: 'long' } });
}

// Called when a flight profile radio button is clicked
function filterByProfile(event) {
    profileKey = event.target.value;

    manufacturerSelector = document.getElementById('manufacturerSelector');
    // Clear all previous manufacturer lists
    manufacturerSelector.options.length = 0;
    filteredManufacturers[profileKey].forEach((manufacturer, index) => {
        manufacturerSelector.add(new Option(manufacturer.name, index));
    });
    manufacturerSelector.addEventListener('input', selectManufacturer);

    // Other selectors are populated once a manufacturer is selected
    const modelSelector = document.getElementById('modelSelector');
    modelSelector.addEventListener('input', updateModel);

    // Because the first manufacturer is selected automatically without clicking an option,
    // we need to call selectManufacturer explicitly to populate other dropdowns
    selectManufacturer();
}

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
        radio.addEventListener('input', recalculate);

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

function selectManufacturer() {
    const selectedManufacturer = filteredManufacturers[profileKey][manufacturerSelector.value];
    // Clear all previous models and profiles
    const modelSelector = document.getElementById('modelSelector');
    modelSelector.options.length = 0;
    // For each model containing the selected profile type, populate the model dropdown
    selectedManufacturer.models.forEach((model, index) => {
        modelSelector.add(new Option(model.name, index));
    });

    replaceFlightProfileButtons(selectedManufacturer.models[0].flightProfiles);

    recalculate();
}

// Called when a new model is selected from the dropdown
function updateModel() {
    const modelSelector = document.getElementById('modelSelector');
    const selectedModel = filteredManufacturers[profileKey][manufacturerSelector.value].models[modelSelector.value];

    replaceFlightProfileButtons(selectedModel.flightProfiles);

    recalculate();
}

// Called when a new value is selected from any dropdown
function recalculate() {
    const modelSelector = document.getElementById('modelSelector');
    const selectedFlight = document.querySelector('input[name="flight"]:checked');
    const selectedModel = filteredManufacturers[profileKey][manufacturerSelector.value].models[modelSelector.value]
    const selectedProfile = selectedModel.flightProfiles[selectedFlight.value];
    // Populate data for this profile
    document.getElementById('seats').innerText = selectedProfile.seats;
    document.getElementById('distance').innerText = selectedProfile.kilometres;
    document.getElementById('burn').innerText = selectedProfile.burn;
    document.getElementById('fuelPerSeat').innerText = selectedProfile.fuelPerSeat; // Display only - not for calculation

    const kgFuelBurned = selectedProfile.burn * selectedProfile.kilometres;
    document.getElementById('fuelBurned').innerText = kgFuelBurned.toFixed(2);
    // Fuel per seat is in L/100 km. However, our calculations use kilograms, not litres
    const kgSeatFuelBurned = kgFuelBurned / selectedProfile.seats;
    document.getElementById('seatFuelBurned').innerText = kgSeatFuelBurned.toFixed(2);

    const megajoules = kgFuelBurned * MJ_PER_KG_JET_FUEL;
    // Convert grams per megajoule into kilograms of CO2 for the flight
    const totalCO2 = megajoules * AVG_OIL_SANDS_JET_FUEL_gCO2ePerMJ / 1000;
    document.getElementById('totalCO2').innerText = totalCO2.toFixed(2);
    const percentHiroshima = megajoules / MJ_PER_HIROSHIMA * 100;
    document.getElementById('immediate').innerText = `${percentHiroshima.toFixed(2)}%`;
    const mjToMakeHiroshima = MJ_PER_HIROSHIMA / megajoules;
    const yearsForHiroshima = mjToMakeHiroshima * YEARS_TO_DUPLICATE_HEAT;
    document.getElementById('hiroshima').innerText = yearsForHiroshima.toFixed(0);

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
                    label: `${selectedModel.name} ${selectedProfile.name}`,
                    data: Array.from(
                        { length: YEARS_TO_RENDER },
                        (_, index) => ((index + 1) * (megajoules / YEARS_TO_DUPLICATE_HEAT)) / MJ_PER_HIROSHIMA
                    ),
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Hiroshima equivalents over time'
                    }
                }
            }
        }
    });
}
