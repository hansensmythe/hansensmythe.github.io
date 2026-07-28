/*
    Data extracted from https://en.wikipedia.org/wiki/Fuel_economy_in_aircraft on 24 July 2026
*/

/**
 * @constructor
 * @param {string} name - The name of the manufacturer, e.g. Boeing
 * @param {Model[]} models - The array of aircraft models produced by the manufacturer
 */
class Manufacturer {
    constructor(name, models) {
        this.name = name;
        this.models = models;

    }
    getCommuterModels() {
        return this.models.filter(model => model.hasCommuterProfiles());
    }
    getRegionalModels() {
        return this.models.filter(model => model.hasRegionalProfiles());
    }
    getShortHaulModels() {
        return this.models.filter(model => model.hasShortHaulProfiles());
    }
    getMediumHaulModels() {
        return this.models.filter(model => model.hasMediumHaulProfiles());
    }
    getLongHaulModels() {
        return this.models.filter(model => model.hasLongHaulProfiles());
    }
}

/**
 * @constructor
 * @param {string} name - The name of the type of aircraft, e.g. 747
 * @param {FlightProfile[]} - The array of flight profiles for this aircraft
 */
class Model {
    constructor(name, flightProfiles) {
        this.name = name;
        this.flightProfiles = flightProfiles;
    }
    hasCommuterProfiles() {
        return this.flightProfiles.some(profile => profile.isCommuter());
    }
    getCommuterProfiles() {
        return this.flightProfiles.filter(profile => profile.isCommuter());
    }
    hasRegionalProfiles() {
        return this.flightProfiles.some(profile => profile.isRegional());
    }
    getRegionalProfiles() {
        return this.flightProfiles.filter(profile => profile.isRegional());
    }
    hasShortHaulProfiles() {
        return this.flightProfiles.some(profile => profile.isShortHaul());
    }
    getShortHaulProfiles() {
        return this.flightProfiles.filter(profile => profile.isShortHaul());
    }
    hasMediumHaulProfiles() {
        return this.flightProfiles.some(profile => profile.isMediumHaul());
    }
    getMediumHaulProfiles() {
        return this.flightProfiles.filter(profile => profile.isMediumHaul());
    }
    hasLongHaulProfiles() {
        return this.flightProfiles.some(profile => profile.isLongHaul());
    }
    getLongHaulProfiles() {
        return this.flightProfiles.filter(profile => profile.isLongHaul());
    }
}

/**
 * @constructor
 * @param {string} key - Short string matching the radio button values in ImpactOfFlying.html, used for filtering
 * @param {string} name - Flight profile name to disambiguate different profiles with similar range
 * @param {number} seats - Number of seats in the aircraft
 * @param {number} kilometres - Distance route travelled while having its fuel efficiency tested
 * @param {number} burn - kilograms of jet fuel burned per kilometre travelled
 * @param {number} fuelPerSeat - Fuel efficiency per seat in L/100 km. Not used in calculation - only good for comparing with other transportation types
 */
class FlightProfile {
    constructor(key, name, seats, kilometres, burn, fuelPerSeat) {
        this.key = key;
        this.name = name;
        this.seats = seats;
        this.kilometres = kilometres;
        this.burn = burn;
        this.fuelPerSeat = fuelPerSeat;
    }
    isCommuter() {
        return this.key == 'commuter';
    }
    isRegional() {
        return this.key == 'regional';
    }
    isShortHaul() {
        return this.key == 'short';
    }
    isMediumHaul() {
        return this.key == 'medium';
    }
    isLongHaul() {
        return this.key == 'long';
    }
}

const MANUFACTURERS = [
    new Manufacturer('Airbus', [
        new Model('A220-100', [
            new FlightProfile('regional', 'Regional (115 seats)', 115, 1100, 2.8, 3.07),
            new FlightProfile('regional', 'Regional (125 seats)', 125, 930, 2.57, 2.57),
            new FlightProfile('short', 'Short Haul', 125, 1900, 2.28, 2.28)
        ]),
        new Model('A220-300', [
            new FlightProfile('regional', 'Regional (140 seats)', 140, 1100, 3.10, 2.75),
            new FlightProfile('regional', 'Regional (160 seats)', 160, 930, 2.85, 2.23),
            new FlightProfile('short', 'Short Haul (135 seats)', 135, 1900, 2.30, 2.13),
            new FlightProfile('short', 'Short Haul (150 seats)', 150, 1900, 2.42, 2.02),
            new FlightProfile('short', 'Short Haul (160 seats)', 160, 1900, 2.56, 2.00),
            new FlightProfile('medium', 'Medium Haul', 150, 3700, 2.42, 2.02)
        ]),
        new Model('A319', [
            new FlightProfile('short', 'Short Haul', 124, 1900, 2.93, 2.95)
        ]),
        new Model('A319neo', [
            new FlightProfile('regional', 'Regional (124 seats)', 124, 1220, 2.82, 2.82),
            new FlightProfile('regional', 'Regional (144 seats)', 144, 1100, 3.37, 2.92),
            new FlightProfile('regional', 'Regional (154 seats)', 154, 1220, 2.79, 2.25),
            new FlightProfile('short', 'Short Haul', 136, 1900, 2.4, 2.22)
        ]),
        new Model('A320', [
            new FlightProfile('short', 'Short Haul', 150, 1900, 3.13, 2.61),
            new FlightProfile('medium', 'Medium Haul', 150, 3984, 2.91, 2.43)
        ]),
        new Model('A320neo', [
            new FlightProfile('short', 'Short Haul', 180, 1900, 2.79, 1.94)
        ]),
        new Model('A321-200', [
            new FlightProfile('short', 'Short Haul', 180, 1900, 3.61, 2.50)
        ]),
        new Model('A321neo', [
            new FlightProfile('regional', 'Regional', 192, 1220, 3.30, 2.19),
            new FlightProfile('short', 'Short Haul', 220, 1900, 3.47, 1.98)
        ]),
        new Model('A321LR', [
            new FlightProfile('medium', 'Medium Haul', 154, 6300, 2.99, 2.43)
        ]),
        new Model('A330-200', [
            new FlightProfile('short', 'Short Haul', 293, 1900, 5.6, 2.37),
            new FlightProfile('medium', 'Medium Haul', 241, 5600, 6, 3.11),
            new FlightProfile('long', 'Long Haul (241 seats)', 241, 11000, 6.4, 3.32),
            new FlightProfile('long', 'Long Haul (248 seats)', 248, 10277, 6.55, 3.3)
        ]),
        new Model('A330-300', [
            new FlightProfile('medium', 'Medium Haul', 262, 5600, 6.25, 2.98),
            new FlightProfile('long', 'Long Haul', 274, 10275, 6.81, 3.11)
        ]),
        new Model('A330-800', [
            new FlightProfile('long', 'Long Haul', 248, 8610, 5.45, 2.75)
        ]),
        new Model('A330-900', [
            new FlightProfile('medium', 'Medium Haul', 310, 6200, 6, 2.42),
            new FlightProfile('long', 'Long Haul', 300, 8610, 5.94, 2.48)
        ]),
        new Model('A340-300', [
            new FlightProfile('medium', 'Medium Haul', 262, 5600, 6.81, 3.25),
            new FlightProfile('long', 'Long Haul', 262, 11000, 7.32, 3.49)
        ]),
        new Model('A350-900', [
            new FlightProfile('long', 'Long Haul (315 seats, 9208 km)', 315, 9208, 6.03, 2.39),
            new FlightProfile('long', 'Long Haul (315 seats, 12116 km)', 315, 12116, 7.07, 2.81),
            new FlightProfile('long', 'Long Haul (318 seats)', 318, 10249, 6.52, 2.56)
        ]),
        new Model('A350-1000', [
            new FlightProfile('long', 'Long Haul (327 seats)', 327, 10243, 7.46, 2.85),
            new FlightProfile('long', 'Long Haul (367 seats)', 367, 10243, 7.58, 2.58)
        ]),
        new Model('A380', [
            new FlightProfile('medium', 'Medium Haul', 544, 3700, 13.6, 3.14),
            new FlightProfile('long', 'Long Haul (525 seats)', 525, 13300, 13.78, 3.27),
            new FlightProfile('long', 'Long Haul (544 seats)', 544, 11000, 13.78, 3.16)
        ])
    ]),
    new Manufacturer('Antonov', [
        new Model('An-148', [
            new FlightProfile('commuter', 'Commuter', 89, 446, 4.23, 5.95),
            new FlightProfile('regional', 'Regional', 89, 1267, 2.89, 4.06),
            new FlightProfile('short', 'Short Haul', 89, 2204, 2.75, 3.86)
        ]),
        new Model('An-158', [
            new FlightProfile('commuter', 'Commuter', 99, 446, 4.34, 5.47),
            new FlightProfile('regional', 'Regional', 99, 1267, 3, 3.79),
            new FlightProfile('short', 'Short Haul', 99, 2204, 2.83, 3.57)
        ]),
    ]),
    new Manufacturer('ATR', [
        new Model('42-500', [
            new FlightProfile('commuter', 'Commuter', 48, 560, 1.26, 3.15)
        ]),
        new Model('42-600', [
            new FlightProfile('regional', 'Regional', 50, 930, 1.30, 3.27)
        ]),
        new Model('72-500', [
            new FlightProfile('commuter', 'Commuter', 72, 560, 1.67, 2.89)
        ]),
        new Model('72-500', [
            new FlightProfile('commuter', 'Commuter', 70, 560, 1.42, 2.53)
        ]),
        new Model('72-600', [
            new FlightProfile('commuter', 'Commuter', 72, 560, 1.56, 2.79),
            new FlightProfile('regional', 'Regional', 72, 930, 1.41, 2.46)
        ]),
    ]),
    new Manufacturer('Beechcraft', [
        new Model('1900D', [
            new FlightProfile('commuter', 'Commuter', 19, 419, 1.00, 6.57)
        ]),
    ]),
    new Manufacturer('Boeing', [
        new Model('737-300', [
            new FlightProfile('regional', 'Regional', 126, 939, 3.49, 3.46)
        ]),
        new Model('737-600', [
            new FlightProfile('regional', 'Regional', 110, 930, 3.16, 3.59),
            new FlightProfile('short', 'Short Haul', 110, 1900, 2.77, 3.15)
        ]),
        new Model('737-700', [
            new FlightProfile('regional', 'Regional', 126, 930, 3.21, 3.19),
            new FlightProfile('short', 'Short Haul (126 seats)', 126, 1900, 2.82, 2.79),
            new FlightProfile('short', 'Short Haul (128 seats)', 128, 1900, 2.8, 2.71)
        ]),
        new Model('737 MAX 7', [
            new FlightProfile('regional', 'Regional (128 seats)', 128, 1220, 2.85, 2.77),
            new FlightProfile('regional', 'Regional (144 seats)', 144, 1100, 3.39, 2.93),
            new FlightProfile('short', 'Short Haul', 140, 1900, 2.51, 1.94)
        ]),
        new Model('737-800', [
            new FlightProfile('regional', 'Regional', 162, 930, 3.59, 2.77),
            new FlightProfile('short', 'Short Haul (160 seats)', 160, 1900, 3.45, 2.68),
            new FlightProfile('short', 'Short Haul (162 seats)', 162, 1900, 3.17, 2.44)
        ]),
        new Model('737-800W', [
            new FlightProfile('short', 'Short Haul', 162, 1900, 3.18, 2.45)
        ]),
        new Model('737 MAX 8', [
            new FlightProfile('regional', 'Regional', 166, 1220, 3.04, 2.28),
            new FlightProfile('short', 'Short Haul', 162, 1900, 2.71, 2.04),
            new FlightProfile('medium', 'Medium Haul', 168, 6300, 2.86, 2.13)
        ]),
        new Model('737-900ER', [
            new FlightProfile('regional', 'Regional', 180, 930, 3.83, 2.66),
            new FlightProfile('short', 'Short Haul', 180, 1900, 3.42, 2.38)
        ]),
        new Model('737-900ERW', [
            new FlightProfile('short', 'Short Haul', 180, 1900, 3.42, 2.37)
        ]),
        new Model('737 MAX 9', [
            new FlightProfile('regional', 'Regional', 180, 1220, 3.30, 2.28),
            new FlightProfile('short', 'Short Haul', 180, 1900, 2.91, 2.02),
            new FlightProfile('medium', 'Medium Haul', 144, 6300, 2.91, 2.53)
        ]),
        new Model('747-400', [
            new FlightProfile('medium', 'Medium Haul', 416, 3984, 10.77, 3.24),
            new FlightProfile('long', 'Long Haul (393 seats)', 393, 10192, 11.82, 3.76),
            new FlightProfile('long', 'Long Haul (416 seats)', 416, 11000, 11.11, 3.34),
            new FlightProfile('long', 'Long Haul (487 seats)', 487, 10147, 12.31, 3.16)
        ]),
        new Model('747-8', [
            new FlightProfile('medium', 'Medium Haul', 467, 5600, 9.9, 2.65),
            new FlightProfile('long', 'Long Haul (405 seats)', 405, 13300, 10.9, 3.35),
            new FlightProfile('long', 'Long Haul (467 seats)', 467, 11000, 10.54, 2.82)
        ]),
        new Model('757-200', [
            new FlightProfile('regional', 'Regional', 200, 930, 4.68, 2.91),
            new FlightProfile('short', 'Short Haul (190 seats)', 190, 1900, 4.60, 3.02),
            new FlightProfile('short', 'Short Haul (200 seats)', 200, 1900, 4.16, 2.59)
        ]),
        new Model('757-200W', [
            new FlightProfile('medium', 'Medium Haul', 158, 6300, 3.79, 3.00)
        ]),
        new Model('757-300', [
            new FlightProfile('regional', 'Regional', 243, 930, 5.19, 2.66),
            new FlightProfile('short', 'Short Haul', 243, 1900, 4.68, 2.40)
        ]),
        new Model('767-200ER', [
            new FlightProfile('medium', 'Medium Haul (181 seats)', 181, 5600, 4.83, 3.34),
            new FlightProfile('medium', 'Medium Haul (193 seats)', 193, 6300, 5.01, 3.25),
            new FlightProfile('medium', 'Medium Haul (224 seats)', 224, 5600, 4.93, 2.75),
            new FlightProfile('long', 'Long Haul (301 seats)', 301, 11000, 7.42, 3.08),
            new FlightProfile('long', 'Long Haul (304 seats)', 304, 10251, 7.57, 3.11)
        ]),
        new Model('767-300ER', [
            new FlightProfile('medium', 'Medium Haul (218 seats)', 218, 3984, 5.38, 3.09),
            new FlightProfile('medium', 'Medium Haul (269 seats)', 269, 5600, 5.51, 2.56)
        ]),
        new Model('767-400ER', [
            new FlightProfile('medium', 'Medium Haul (245 seats)', 245, 5600, 5.78, 2.95),
            new FlightProfile('medium', 'Medium Haul (304 seats)', 304, 5600, 5.93, 2.44)
        ]),
        new Model('777-200', [
            new FlightProfile('medium', 'Medium Haul', 305, 5600, 6.83, 2.80)
        ]),
        new Model('777-200ER', [
            new FlightProfile('medium', 'Medium Haul', 301, 5600, 6.96, 2.89),
            new FlightProfile('long', 'Long Haul', 301, 11000, 7.44, 3.09)
        ]),
        new Model('777-200LR', [
            new FlightProfile('long', 'Long Haul', 291, 9208, 7.57, 3.25)
        ]),
        new Model('777-300', [
            new FlightProfile('medium', 'Medium Haul', 368, 5600, 7.88, 2.68)
        ]),
        new Model('777-300ER', [
            new FlightProfile('long', 'Long Haul', 344, 13300, 8.58, 3.11),
            new FlightProfile('long', 'Long Haul (365 seats)', 365, 11000, 8.49, 2.91),
            new FlightProfile('long', 'Long Haul (382 seats)', 382, 10199, 8.86, 2.9)
        ]),
        new Model('777-9X', [
            new FlightProfile('long', 'Long Haul', 395, 13300, 7.69, 2.42)
        ]),
        new Model('787-8', [
            new FlightProfile('short', 'Short Haul', 248, 1900, 5.50, 2.77),
            new FlightProfile('medium', 'Medium Haul (238 seats)', 238, 6300, 5.11, 2.68),
            new FlightProfile('medium', 'Medium Haul (291 seats)', 291, 6300, 5.26, 2.26),
            new FlightProfile('long', 'Long Haul', 243, 8610, 5.38, 2.77)
        ]),
        new Model('787-8 GEnx', [
            new FlightProfile('long', 'Long Haul', 220, 10255, 5.3, 3.01)
        ]),
        new Model('787-8 Trent', [
            new FlightProfile('long', 'Long Haul', 220, 10255, 5.51, 3.13)
        ]),
        new Model('787-9', [
            new FlightProfile('short', 'Short Haul', 296, 1900, 5.67, 2.39),
            new FlightProfile('medium', 'Medium Haul', 304, 6200, 5.77, 2.37),
            new FlightProfile('long', 'Long Haul (291 seats)', 291, 12116, 7.18, 3.08),
            new FlightProfile('long', 'Long Haul (304 seats)', 304, 9208, 5.63, 2.31)
        ]),
        new Model('787-9 GEnx', [
            new FlightProfile('long', 'Long Haul (266 seats)', 266, 10249, 5.62, 2.64),
            new FlightProfile('long', 'Long Haul (294 seats)', 294, 8610, 5.85, 2.49)
        ]),
        new Model('787-10', [
            new FlightProfile('short', 'Short Haul', 336, 1900, 6.09, 2.27)
        ]),
        new Model('787-10 GEnx', [
            new FlightProfile('long', 'Long Haul', 337, 10240, 6.12, 2.27)
        ]),
        new Model('787-10 Trent', [
            new FlightProfile('long', 'Long Haul', 337, 10240, 6.24, 2.31)
        ]),
    ]),
    new Manufacturer('Bombardier', [
        new Model('CRJ100', [
            new FlightProfile('commuter', 'Commuter', 50, 560, 2.21, 5.50),
            new FlightProfile('regional', 'Regional', 50, 1069, 1.87, 4.68)
        ]),
        new Model('CRJ200', [
            new FlightProfile('commuter', 'Commuter', 50, 560, 2.18, 5.43),
            new FlightProfile('regional', 'Regional', 50, 1070, 1.80, 4.49)
        ]),
        new Model('CRJ700', [
            new FlightProfile('commuter', 'Commuter', 70, 560, 2.95, 5.25),
            new FlightProfile('regional', 'Regional', 70, 1063, 2.45, 4.36)
        ]),
        new Model('CRJ900', [
            new FlightProfile('commuter', 'Commuter', 88, 560, 3.47, 4.91),
            new FlightProfile('regional', 'Regional', 88, 1061, 2.78, 3.94)
        ]),
        new Model('CRJ1000', [
            new FlightProfile('regional', 'Regional', 100, 930, 2.66, 3.33)
        ]),
        new Model('Dash 8 Q400', [
            new FlightProfile('commuter', 'Commuter', 78, 560, 2.16, 3.46),
            new FlightProfile('regional', 'Regional', 74, 930, 2.31, 3.90),
            new FlightProfile('regional', 'Regional', 74, 1100, 1.83, 3.09)
        ]),
    ]),
    new Manufacturer('Dornier', [
        new Model('228', [
            new FlightProfile('commuter', 'Commuter', 19, 560, 0.94, 6.22)
        ]),
        new Model('328', [
            new FlightProfile('commuter', 'Commuter', 32, 560, 1.22, 4.76),
            new FlightProfile('regional', 'Regional', 31, 1100, 1.08, 4.35)
        ]),
    ]),
    new Manufacturer('Embraer', [
        new Model('Brasilia', [
            new FlightProfile('commuter', 'Commuter', 30, 560, 0.92, 3.82)
        ]),
        new Model('E-Jet E2-175', [
            new FlightProfile('regional', 'Regional', 88, 1100, 2.44, 3.44)
        ]),
        new Model('E-Jet E2-190', [
            new FlightProfile('regional', 'Regional', 106, 930, 2.48, 2.93)
        ]),
        new Model('E-Jet E2-190', [
            new FlightProfile('regional', 'Regional', 106, 1100, 2.83, 3.32)
        ]),
        new Model('E-Jet E2-195', [
            new FlightProfile('regional', 'Regional', 132, 930, 2.62, 2.50)
        ]),
        new Model('E-Jet E2-195', [
            new FlightProfile('regional', 'Regional', 132, 1100, 3.07, 2.90)
        ]),
        new Model('E-Jet-170', [
            new FlightProfile('regional', 'Regional', 80, 1122, 2.6, 4.08)
        ]),
        new Model('E-Jet-175', [
            new FlightProfile('regional', 'Regional', 88, 1120, 2.80, 3.97)
        ]),
        new Model('E-Jet-190', [
            new FlightProfile('regional', 'Regional', 114, 1124, 3.24, 3.54)
        ]),
        new Model('E-Jet-195', [
            new FlightProfile('regional', 'Regional', 122, 1124, 3.21, 3.28)
        ]),
        new Model('ERJ-135ER', [
            new FlightProfile('commuter', 'Commuter', 37, 572, 1.64, 5.52),
            new FlightProfile('regional', 'Regional', 37, 1104, 1.44, 4.86)
        ]),
        new Model('ERJ-145ER', [
            new FlightProfile('commuter', 'Commuter', 50, 565, 1.76, 4.37),
            new FlightProfile('regional', 'Regional', 50, 1107, 1.55, 3.86)
        ]),
    ]),
    new Manufacturer('Irkut', [
        new Model('MC-21-300', [
            new FlightProfile('medium', 'Medium Haul', 163, 3240, 3.04, 2.33)
        ]),
    ]),
    new Manufacturer('Pilatus', [
        new Model('PC-12', [
            new FlightProfile('regional', 'Regional', 9, 930, 0.41, 5.66)
        ]),
    ]),
    new Manufacturer('Quest', [
        new Model('Kodiak', [
            new FlightProfile('short', 'Short Haul', 9, 1900, 0.71, 6.28)
        ]),
    ]),
    new Manufacturer('Saab', [
        new Model('340', [
            new FlightProfile('commuter', 'Commuter', 32, 560, 1.1, 4.29),
            new FlightProfile('regional', 'Regional', 31, 930, 0.95, 3.83)
        ]),
        new Model('2000', [
            new FlightProfile('commuter', 'Commuter', 50, 560, 1.75, 4.39),
            new FlightProfile('regional', 'Regional', 50, 930, 1.54, 3.85)
        ]),
    ]),
    new Manufacturer('Sukhoi', [
        new Model('SSJ100', [
            new FlightProfile('regional', 'Regional', 98, 930, 2.81, 3.59)
        ]),
    ])
]

/**
 * At page initialization, populate a filtered set of objects derived from the above data, or all of the data.
 * 
 * @returns {object} keyed on profile type, containing new manufacturer objects with models and profiles matching that type
 */
export function getFilteredManufacturers() {
    const filteredManufacturers = {
        commuter: [],
        regional: [],
        short: [],
        medium: [],
        long: [],
        all: MANUFACTURERS
    };

    MANUFACTURERS.forEach((manufacturer) => {
        // If a manufacturer has one or more models with the right flight profile, add to the filter object a new
        // manufacturer containing only those commuter models and profiles. Note that we must NOT use the array.filter
        // method because that just creates a shallow copy, and we want a new Manufacturer object that contains a new
        // Model array, where each model can contain a shallow Profiles array. If we reused the Models, for any model
        // with multiple profile types, each block below would overwrite the existing profiles.
        const commuterModels = manufacturer.getCommuterModels();
        if (commuterModels.length > 0) {
            const filteredCommuterModels = [];
            commuterModels.forEach((model) => {
                filteredCommuterModels.push(new Model(model.name, model.getCommuterProfiles()));
            });
            filteredManufacturers.commuter.push(new Manufacturer(manufacturer.name, filteredCommuterModels));
        }

        const regionalModels = manufacturer.getRegionalModels();
        if (regionalModels.length > 0) {
            const filteredRegionalModels = [];
            regionalModels.forEach((model) => {
                filteredRegionalModels.push(new Model(model.name, model.getRegionalProfiles()));
            });
            filteredManufacturers.regional.push(new Manufacturer(manufacturer.name, filteredRegionalModels));
        }

        const shortHaulModels = manufacturer.getShortHaulModels();
        if (shortHaulModels.length > 0) {
            const filteredShortHaulModels = [];
            shortHaulModels.forEach((model) => {
                filteredShortHaulModels.push(new Model(model.name, model.getShortHaulProfiles()));
            });
            filteredManufacturers.short.push(new Manufacturer(manufacturer.name, filteredShortHaulModels));
        }

        const mediumHaulModels = manufacturer.getMediumHaulModels();
        if (mediumHaulModels.length > 0) {
            const filteredMediumHaulModels = [];
            mediumHaulModels.forEach((model) => {
                filteredMediumHaulModels.push(new Model(model.name, model.getMediumHaulProfiles()));
            });
            filteredManufacturers.medium.push(new Manufacturer(manufacturer.name, filteredMediumHaulModels));
        }

        const longHaulModels = manufacturer.getLongHaulModels();
        if (longHaulModels.length > 0) {
            const filteredLongHaulModels = [];
            longHaulModels.forEach((model) => {
                filteredLongHaulModels.push(new Model(model.name, model.getLongHaulProfiles()));
            });
            filteredManufacturers.long.push(new Manufacturer(manufacturer.name, filteredLongHaulModels));
        }
    });

    return filteredManufacturers;
}