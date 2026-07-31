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
    getPrivateModels() {
        return this.models.filter(model => model.hasPrivateProfiles());
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
    hasPrivateProfiles() {
        return this.flightProfiles.some(profile => profile.isPrivate());
    }
    getPrivateProfiles() {
        return this.flightProfiles.filter(profile => profile.isPrivate());
    }}

/**
 * @constructor
 * @param {string} key - Short string matching the radio button values in ImpactOfFlying.html, used for filtering
 * @param {string} name - Flight profile name to disambiguate different profiles with similar range
 * @param {number} seats - Number of seats in the aircraft
 * @param {number} kilometres - Distance route travelled while having its fuel efficiency tested
 * @param {number} burn - kilograms of jet fuel burned per kilometre travelled
 * @param {number} privateFlightsPerYear - if privately owned, how many flights with this average are taken annually
 */
class FlightProfile {
    constructor(key, name, seats, kilometres, burn, privateFlightsPerYear) {
        this.key = key;
        this.name = name;
        this.seats = seats;
        this.kilometres = kilometres;
        this.burn = burn;
        this.privateFlightsPerYear = privateFlightsPerYear;
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
    isPrivate() {
        return this.privateFlightsPerYear > 0;
    }
}

const MANUFACTURERS = [
    new Manufacturer('Airbus', [
        new Model('A220-100', [
            new FlightProfile('regional', 'Regional (115 seats)', 115, 1100, 2.8),
            new FlightProfile('regional', 'Regional (125 seats)', 125, 930, 2.57),
            new FlightProfile('short', 'Short Haul', 125, 1900, 2.28)
        ]),
        new Model('A220-300', [
            new FlightProfile('regional', 'Regional (140 seats)', 140, 1100, 3.10),
            new FlightProfile('regional', 'Regional (160 seats)', 160, 930, 2.85),
            new FlightProfile('short', 'Short Haul (135 seats)', 135, 1900, 2.30),
            new FlightProfile('short', 'Short Haul (150 seats)', 150, 1900, 2.42),
            new FlightProfile('short', 'Short Haul (160 seats)', 160, 1900, 2.56),
            new FlightProfile('medium', 'Medium Haul', 150, 3700, 2.42)
        ]),
        new Model('A319', [
            new FlightProfile('short', 'Short Haul', 124, 1900, 2.93)
        ]),
        new Model('A319neo', [
            new FlightProfile('regional', 'Regional (124 seats)', 124, 1220, 2.82),
            new FlightProfile('regional', 'Regional (144 seats)', 144, 1100, 3.37),
            new FlightProfile('regional', 'Regional (154 seats)', 154, 1220, 2.79),
            new FlightProfile('short', 'Short Haul', 136, 1900, 2.4)
        ]),
        new Model('A320', [
            new FlightProfile('short', 'Short Haul', 150, 1900, 3.13),
            new FlightProfile('medium', 'Medium Haul', 150, 3984, 2.91)
        ]),
        new Model('A320neo', [
            new FlightProfile('short', 'Short Haul', 180, 1900, 2.79)
        ]),
        new Model('A321-200', [
            new FlightProfile('short', 'Short Haul', 180, 1900, 3.61)
        ]),
        new Model('A321neo', [
            new FlightProfile('regional', 'Regional', 192, 1220, 3.30),
            new FlightProfile('short', 'Short Haul', 220, 1900, 3.47)
        ]),
        new Model('A321LR', [
            new FlightProfile('medium', 'Medium Haul', 154, 6300, 2.99)
        ]),
        new Model('A330-200', [
            new FlightProfile('short', 'Short Haul', 293, 1900, 5.6),
            new FlightProfile('medium', 'Medium Haul', 241, 5600, 6),
            new FlightProfile('long', 'Long Haul (241 seats)', 241, 11000, 6.4),
            new FlightProfile('long', 'Long Haul (248 seats)', 248, 10277, 6.55)
        ]),
        new Model('A330-300', [
            new FlightProfile('medium', 'Medium Haul', 262, 5600, 6.25),
            new FlightProfile('long', 'Long Haul', 274, 10275, 6.81)
        ]),
        new Model('A330-800', [
            new FlightProfile('long', 'Long Haul', 248, 8610, 5.45)
        ]),
        new Model('A330-900', [
            new FlightProfile('medium', 'Medium Haul', 310, 6200, 6),
            new FlightProfile('long', 'Long Haul', 300, 8610, 5.94)
        ]),
        new Model('A340-300', [
            new FlightProfile('medium', 'Medium Haul', 262, 5600, 6.81),
            new FlightProfile('long', 'Long Haul', 262, 11000, 7.32)
        ]),
        new Model('A350-900', [
            new FlightProfile('long', 'Long Haul (315 seats, 9208 km)', 315, 9208, 6.03),
            new FlightProfile('long', 'Long Haul (315 seats, 12116 km)', 315, 12116, 7.07),
            new FlightProfile('long', 'Long Haul (318 seats)', 318, 10249, 6.52)
        ]),
        new Model('A350-1000', [
            new FlightProfile('long', 'Long Haul (327 seats)', 327, 10243, 7.46),
            new FlightProfile('long', 'Long Haul (367 seats)', 367, 10243, 7.58)
        ]),
        new Model('A380', [
            new FlightProfile('medium', 'Medium Haul', 544, 3700, 13.6),
            new FlightProfile('long', 'Long Haul (525 seats)', 525, 13300, 13.78),
            new FlightProfile('long', 'Long Haul (544 seats)', 544, 11000, 13.78)
        ])
    ]),
    new Manufacturer('Antonov', [
        new Model('An-148', [
            new FlightProfile('commuter', 'Commuter', 89, 446, 4.23),
            new FlightProfile('regional', 'Regional', 89, 1267, 2.89),
            new FlightProfile('short', 'Short Haul', 89, 2204, 2.75)
        ]),
        new Model('An-158', [
            new FlightProfile('commuter', 'Commuter', 99, 446, 4.34),
            new FlightProfile('regional', 'Regional', 99, 1267, 3),
            new FlightProfile('short', 'Short Haul', 99, 2204, 2.83)
        ]),
    ]),
    new Manufacturer('ATR', [
        new Model('42-500', [
            new FlightProfile('commuter', 'Commuter', 48, 560, 1.26)
        ]),
        new Model('42-600', [
            new FlightProfile('regional', 'Regional', 50, 930, 1.30)
        ]),
        new Model('72-500', [
            new FlightProfile('commuter', 'Commuter', 72, 560, 1.67)
        ]),
        new Model('72-500', [
            new FlightProfile('commuter', 'Commuter', 70, 560, 1.42)
        ]),
        new Model('72-600', [
            new FlightProfile('commuter', 'Commuter', 72, 560, 1.56),
            new FlightProfile('regional', 'Regional', 72, 930, 1.41)
        ]),
    ]),
    new Manufacturer('Beechcraft', [
        new Model('1900D', [
            new FlightProfile('commuter', 'Commuter', 19, 419, 1.00)
        ]),
    ]),
    new Manufacturer('Boeing', [
        new Model('737-300', [
            new FlightProfile('regional', 'Regional', 126, 939, 3.49)
        ]),
        new Model('737-600', [
            new FlightProfile('regional', 'Regional', 110, 930, 3.16),
            new FlightProfile('short', 'Short Haul', 110, 1900, 2.77)
        ]),
        new Model('737-700', [
            new FlightProfile('regional', 'Regional', 126, 930, 3.21),
            new FlightProfile('short', 'Short Haul (126 seats)', 126, 1900, 2.82),
            new FlightProfile('short', 'Short Haul (128 seats)', 128, 1900, 2.8)
        ]),
        new Model('737 MAX 7', [
            new FlightProfile('regional', 'Regional (128 seats)', 128, 1220, 2.85),
            new FlightProfile('regional', 'Regional (144 seats)', 144, 1100, 3.39),
            new FlightProfile('short', 'Short Haul', 140, 1900, 2.51)
        ]),
        new Model('737-800', [
            new FlightProfile('regional', 'Regional', 162, 930, 3.59),
            new FlightProfile('short', 'Short Haul (160 seats)', 160, 1900, 3.45),
            new FlightProfile('short', 'Short Haul (162 seats)', 162, 1900, 3.17)
        ]),
        new Model('737-800W', [
            new FlightProfile('short', 'Short Haul', 162, 1900, 3.18)
        ]),
        new Model('737 MAX 8', [
            new FlightProfile('regional', 'Regional', 166, 1220, 3.04),
            new FlightProfile('short', 'Short Haul', 162, 1900, 2.71),
            new FlightProfile('medium', 'Medium Haul', 168, 6300, 2.86)
        ]),
        new Model('737-900ER', [
            new FlightProfile('regional', 'Regional', 180, 930, 3.83),
            new FlightProfile('short', 'Short Haul', 180, 1900, 3.42)
        ]),
        new Model('737-900ERW', [
            new FlightProfile('short', 'Short Haul', 180, 1900, 3.42)
        ]),
        new Model('737 MAX 9', [
            new FlightProfile('regional', 'Regional', 180, 1220, 3.30),
            new FlightProfile('short', 'Short Haul', 180, 1900, 2.91),
            new FlightProfile('medium', 'Medium Haul', 144, 6300, 2.91)
        ]),
        new Model('747-400', [
            new FlightProfile('medium', 'Medium Haul', 416, 3984, 10.77),
            new FlightProfile('long', 'Long Haul (393 seats)', 393, 10192, 11.82),
            new FlightProfile('long', 'Long Haul (416 seats)', 416, 11000, 11.11),
            new FlightProfile('long', 'Long Haul (487 seats)', 487, 10147, 12.31)
        ]),
        new Model('747-8', [
            new FlightProfile('medium', 'Medium Haul', 467, 5600, 9.9),
            new FlightProfile('long', 'Long Haul (405 seats)', 405, 13300, 10.9),
            new FlightProfile('long', 'Long Haul (467 seats)', 467, 11000, 10.54)
        ]),
        new Model('757-200', [
            new FlightProfile('regional', 'Regional', 200, 930, 4.68),
            new FlightProfile('regional', 'Donald Trump', 1, 1342, 29.71, 480),
            new FlightProfile('short', 'Short Haul (190 seats)', 190, 1900, 4.60),
            new FlightProfile('short', 'Short Haul (200 seats)', 200, 1900, 4.16),
        ]),
        new Model('757-200W', [
            new FlightProfile('medium', 'Medium Haul', 158, 6300, 3.79)
        ]),
        new Model('757-300', [
            new FlightProfile('regional', 'Regional', 243, 930, 5.19),
            new FlightProfile('short', 'Short Haul', 243, 1900, 4.68)
        ]),
        new Model('767-200ER', [
            new FlightProfile('regional', 'Drake', 1, 1093, 25.62, 141),
            new FlightProfile('medium', 'Medium Haul (181 seats)', 181, 5600, 4.83),
            new FlightProfile('medium', 'Medium Haul (193 seats)', 193, 6300, 5.01),
            new FlightProfile('medium', 'Medium Haul (224 seats)', 224, 5600, 4.93),
            new FlightProfile('long', 'Long Haul (301 seats)', 301, 11000, 7.42),
            new FlightProfile('long', 'Long Haul (304 seats)', 304, 10251, 7.57),
        ]),
        new Model('767-300ER', [
            new FlightProfile('medium', 'Medium Haul (218 seats)', 218, 3984, 5.38),
            new FlightProfile('medium', 'Medium Haul (269 seats)', 269, 5600, 5.51)
        ]),
        new Model('767-400ER', [
            new FlightProfile('medium', 'Medium Haul (245 seats)', 245, 5600, 5.78),
            new FlightProfile('medium', 'Medium Haul (304 seats)', 304, 5600, 5.93)
        ]),
        new Model('777-200', [
            new FlightProfile('medium', 'Medium Haul', 305, 5600, 6.83)
        ]),
        new Model('777-200ER', [
            new FlightProfile('medium', 'Medium Haul', 301, 5600, 6.96),
            new FlightProfile('long', 'Long Haul', 301, 11000, 7.44)
        ]),
        new Model('777-200LR', [
            new FlightProfile('long', 'Long Haul', 291, 9208, 7.57)
        ]),
        new Model('777-300', [
            new FlightProfile('medium', 'Medium Haul', 368, 5600, 7.88)
        ]),
        new Model('777-300ER', [
            new FlightProfile('long', 'Long Haul', 344, 13300, 8.58),
            new FlightProfile('long', 'Long Haul (365 seats)', 365, 11000, 8.49),
            new FlightProfile('long', 'Long Haul (382 seats)', 382, 10199, 8.86)
        ]),
        new Model('777-9X', [
            new FlightProfile('long', 'Long Haul', 395, 13300, 7.69)
        ]),
        new Model('787-8', [
            new FlightProfile('short', 'Short Haul', 248, 1900, 5.50),
            new FlightProfile('medium', 'Medium Haul (238 seats)', 238, 6300, 5.11),
            new FlightProfile('medium', 'Medium Haul (291 seats)', 291, 6300, 5.26),
            new FlightProfile('long', 'Long Haul', 243, 8610, 5.38)
        ]),
        new Model('787-8 GEnx', [
            new FlightProfile('long', 'Long Haul', 220, 10255, 5.3)
        ]),
        new Model('787-8 Trent', [
            new FlightProfile('long', 'Long Haul', 220, 10255, 5.51)
        ]),
        new Model('787-9', [
            new FlightProfile('short', 'Short Haul', 296, 1900, 5.67),
            new FlightProfile('medium', 'Medium Haul', 304, 6200, 5.77),
            new FlightProfile('long', 'Long Haul (291 seats)', 291, 12116, 7.18),
            new FlightProfile('long', 'Long Haul (304 seats)', 304, 9208, 5.63)
        ]),
        new Model('787-9 GEnx', [
            new FlightProfile('long', 'Long Haul (266 seats)', 266, 10249, 5.62),
            new FlightProfile('long', 'Long Haul (294 seats)', 294, 8610, 5.85)
        ]),
        new Model('787-10', [
            new FlightProfile('short', 'Short Haul', 336, 1900, 6.09)
        ]),
        new Model('787-10 GEnx', [
            new FlightProfile('long', 'Long Haul', 337, 10240, 6.12)
        ]),
        new Model('787-10 Trent', [
            new FlightProfile('long', 'Long Haul', 337, 10240, 6.24)
        ]),
    ]),
    new Manufacturer('Bombardier', [
        new Model('Challenger 350', [
            new FlightProfile('regional', 'Tom Cruise', 1, 1535, 1.68, 367)
        ]),
        new Model('Challenger 600', [
            new FlightProfile('commuter', 'Kid Rock', 1, 846, 1.66, 245)
        ]),
        new Model('CRJ100', [
            new FlightProfile('commuter', 'Commuter', 50, 560, 2.21),
            new FlightProfile('regional', 'Regional', 50, 1069, 1.87)
        ]),
        new Model('CRJ200', [
            new FlightProfile('commuter', 'Commuter', 50, 560, 2.18),
            new FlightProfile('regional', 'Regional', 50, 1070, 1.80)
        ]),
        new Model('CRJ700', [
            new FlightProfile('commuter', 'Commuter', 70, 560, 2.95),
            new FlightProfile('regional', 'Regional', 70, 1063, 2.45)
        ]),
        new Model('CRJ900', [
            new FlightProfile('commuter', 'Commuter', 88, 560, 3.47),
            new FlightProfile('regional', 'Regional', 88, 1061, 2.78)
        ]),
        new Model('CRJ1000', [
            new FlightProfile('regional', 'Regional', 100, 930, 2.66)
        ]),
        new Model('Dash 8 Q400', [
            new FlightProfile('commuter', 'Commuter', 78, 560, 2.16),
            new FlightProfile('regional', 'Regional', 74, 930, 2.31),
            new FlightProfile('regional', 'Regional', 74, 1100, 1.83)
        ]),
        new Model('Global 7500', [
            new FlightProfile('short', 'Kylie Jenner', 1, 2476, 2.38, 271),
            new FlightProfile('short', 'Matt Damon', 1, 2236, 2.35, 234)
        ]),
        new Model('Global Express', [
            new FlightProfile('commuter', 'Elton John', 1, 595, 3.17, 51),
            new FlightProfile('regional', 'Mark Cuban', 1, 1556, 2.34, 206),
            new FlightProfile('short', 'Playboy Corporation', 1, 1836, 2.1, 15),
            new FlightProfile('short', 'Mark Wahlberg', 1, 2108, 2.41, 174)
        ]),
    ]),
    new Manufacturer('Cessna', [
        new Model('Citation 750', [
            new FlightProfile('short', 'Judge Judy', 1, 2402, 1.41, 123)
        ]),
        new Model('Citation Latitude', [
            new FlightProfile('commuter', 'Ron DeSantis', 1, 496, 2.42, 855)
        ]),
        new Model('Citation Sovereign', [
            new FlightProfile('short', 'Harrison Ford', 1, 1934, 0.88, 81)
        ]),
    ]),
    new Manufacturer('Dassault', [
        new Model('Falcon 7X', [
            new FlightProfile('short', 'Taylor Swift (plane #1)', 1, 1763, 1.54, 136)
        ]),
        new Model('Falcon 900', [
            new FlightProfile('regional', 'Kenny Chesney', 1, 1261, 1.38, 289),
            new FlightProfile('short', 'Max Verstappen', 1, 1968, 1.42, 95),
            new FlightProfile('short', 'Michael Bloomberg (plane #1)', 1, 1847, 1.4, 365),
            new FlightProfile('regional', 'Michael Bloomberg (plane #2)', 1, 1505, 1.51, 382),
            new FlightProfile('short', 'Michael Bloomberg (plane #3)', 1, 1640, 1.43, 155),
            new FlightProfile('regional', 'Taylor Swift (sold)', 1, 1590, 1.26, 41),
            new FlightProfile('short', 'Tommy Hilfiger', 1, 1782, 1.43, 146),
        ])
    ]),
    new Manufacturer('Dornier', [
        new Model('228', [
            new FlightProfile('commuter', 'Commuter', 19, 560, 0.94)
        ]),
        new Model('328', [
            new FlightProfile('commuter', 'Commuter', 32, 560, 1.22),
            new FlightProfile('regional', 'Regional', 31, 1100, 1.08)
        ]),
    ]),
    new Manufacturer('Embraer', [
        new Model('Brasilia', [
            new FlightProfile('commuter', 'Commuter', 30, 560, 0.92)
        ]),
        new Model('E-Jet E2-175', [
            new FlightProfile('regional', 'Regional', 88, 1100, 2.44)
        ]),
        new Model('E-Jet E2-190', [
            new FlightProfile('regional', 'Regional', 106, 930, 2.48)
        ]),
        new Model('E-Jet E2-190', [
            new FlightProfile('regional', 'Regional', 106, 1100, 2.83)
        ]),
        new Model('E-Jet E2-195', [
            new FlightProfile('regional', 'Regional', 132, 930, 2.62)
        ]),
        new Model('E-Jet E2-195', [
            new FlightProfile('regional', 'Regional', 132, 1100, 3.07)
        ]),
        new Model('E-Jet-170', [
            new FlightProfile('regional', 'Regional', 80, 1122, 2.6)
        ]),
        new Model('E-Jet-175', [
            new FlightProfile('regional', 'Regional', 88, 1120, 2.80)
        ]),
        new Model('E-Jet-190', [
            new FlightProfile('regional', 'Regional', 114, 1124, 3.24),
            new FlightProfile('short', 'Travis Scott', 1, 2218, 3.24, 419),
            new FlightProfile('short', 'Tyler Perry', 1, 2058, 3.73, 121),
        ]),
        new Model('E-Jet-195', [
            new FlightProfile('regional', 'Regional', 122, 1124, 3.21)
        ]),
        new Model('ERJ-135ER', [
            new FlightProfile('commuter', 'Commuter', 37, 572, 1.64),
            new FlightProfile('regional', 'Regional', 37, 1104, 1.44)
        ]),
        new Model('ERJ-145ER', [
            new FlightProfile('commuter', 'Commuter', 50, 565, 1.76),
            new FlightProfile('regional', 'Regional', 50, 1107, 1.55)
        ]),
    ]),
    new Manufacturer('Gulfstream', [
        new Model('II', [
            new FlightProfile('short', 'Magic Johnson', 1, 2070, 1.46, 15)
        ]),
        new Model('IV', [
            new FlightProfile('short', 'Alex Rodriquez', 1, 1728, 2.23, 241),
            new FlightProfile('short', 'Blake Shelton', 1, 1702, 2.48, 170),
            new FlightProfile('short', 'Dan Bilzerian', 1, 2263, 2.2, 93),
            new FlightProfile('regional', 'Floyd Mayweather', 1, 1434, 2.53, 95),
            new FlightProfile('short', 'Dr. Phil', 1, 1863, 2.21, 155),
        ]),
        new Model('V', [
            new FlightProfile('short', 'Caesars Palace Casino', 1, 1639, 1.86, 222),
            new FlightProfile('short', 'Elon Musk (plane #2)', 1, 2075, 1.71, 240),
            new FlightProfile('short', 'George Lucas', 1, 2009, 1.69, 222),
            new FlightProfile('short', 'Google', 1, 2209, 1.74, 141),
            new FlightProfile('short', 'Jay Z', 1, 2138, 1.7, 291),
            new FlightProfile('short', 'Jerry Jones', 1, 1889, 1.67, 167),
            new FlightProfile('regional', 'Jim Carrey', 1, 1521, 1.93, 229),
            new FlightProfile('medium', 'Lady Gaga', 1, 2655, 1.81, 142),
            new FlightProfile('regional', 'Michael Jordan', 1, 1495, 1.9, 116),
            new FlightProfile('short', 'P. Diddy', 1, 2038, 1.81, 438),
            new FlightProfile('short', 'Peter Thiel', 1, 2260, 1.8, 83),
            new FlightProfile('short', 'Phil Mickelson', 1, 1613, 1.35, 2),
            new FlightProfile('commuter', 'Steve Wynn', 1, 874, 2.21, 682),
            new FlightProfile('regional', 'Tiger Woods', 1, 1313, 1.98, 60),
            new FlightProfile('short', 'Under Armour Corporation', 1, 1607, 1.93, 236),
        ]),
        new Model('G650', [
            new FlightProfile('medium', 'Bill Gates (plane #1)', 1, 2551, 2.15, 355),
            new FlightProfile('medium', 'Bill Gates (plane #2)', 1, 2543, 2.16, 235),
            new FlightProfile('medium', 'David Geffen', 1, 2824, 2.09, 109),
            new FlightProfile('short', 'Elon Musk (plane #1)', 1, 2323, 2.13, 358),
            new FlightProfile('short', 'Eric Schmidt', 1, 1983, 2.28, 687),
            new FlightProfile('medium', 'Jeff Bezos (plane #1)', 1, 4456, 1.84, 8),
            new FlightProfile('short', 'Jeff Bezos (plane #2)', 1, 1777, 1.96, 4),
            new FlightProfile('medium', 'Kim Kardashian', 1, 2918, 2.13, 326),
            new FlightProfile('short', 'Larry Ellison', 1, 2117, 2.39, 125),
            new FlightProfile('medium', 'Marc Benioff', 1, 2649, 2.32, 175),
            new FlightProfile('short', 'Mark Zuckerberg', 1, 1888, 2.41, 335),
            new FlightProfile('short', 'Nike Corporation', 1, 2239, 2.41, 204),
            new FlightProfile('short', 'Oprah Winfrey', 1, 1931, 2.37, 260),
            new FlightProfile('regional', 'Phil Knight', 1, 1573, 2.74, 222),
            new FlightProfile('short', 'Ronald Perelman', 1, 1727, 2.22, 186),
            new FlightProfile('short', 'Rupert Murdoch', 1, 2111, 2.36, 110),
            new FlightProfile('medium', 'Sergey Brin', 1, 3444, 2.09, 126),
            new FlightProfile('short', 'Steve Ballmer', 1, 1662, 2.32, 408),
            new FlightProfile('short', 'Steven Spielberg', 1, 2464, 2.21, 130),
        ])
    ]),
    new Manufacturer('Irkut', [
        new Model('MC-21-300', [
            new FlightProfile('medium', 'Medium Haul', 163, 3240, 3.04)
        ]),
    ]),
    new Manufacturer('Pilatus', [
        new Model('PC-12', [
            new FlightProfile('regional', 'Regional', 9, 930, 0.41)
        ]),
    ]),
    new Manufacturer('Learjet', [
        new Model('60', [
            new FlightProfile('regional', 'Luke Bryan', 1, 969, 1.19, 880)
        ]),
    ]),
    new Manufacturer('Quest', [
        new Model('Kodiak', [
            new FlightProfile('short', 'Short Haul', 9, 1900, 0.71)
        ]),
    ]),
    new Manufacturer('Saab', [
        new Model('340', [
            new FlightProfile('commuter', 'Commuter', 32, 560, 1.1),
            new FlightProfile('regional', 'Regional', 31, 930, 0.95)
        ]),
        new Model('2000', [
            new FlightProfile('commuter', 'Commuter', 50, 560, 1.75),
            new FlightProfile('regional', 'Regional', 50, 930, 1.54)
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
        private: [],
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

        const privateModels = manufacturer.getPrivateModels();
        if (privateModels.length > 0) {
            const filteredPrivateModels = [];
            privateModels.forEach((model) => {
                filteredPrivateModels.push(new Model(model.name, model.getPrivateProfiles()));
            });
            filteredManufacturers.private.push(new Manufacturer(manufacturer.name, filteredPrivateModels));
        }
    });

    return filteredManufacturers;
}