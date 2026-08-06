/*
    Data extracted from https://en.wikipedia.org/wiki/Fuel_economy_in_aircraft
    and https://celebrityprivatejettracker.com/leaderboard/ on 24 July 2026
*/

/**
 * @constructor
 * @param {string} name - Flight profile name to disambiguate different profiles with similar range
 * @param {number} seats - Number of seats in the aircraft
 * @param {number} kilometres - Distance route travelled while having its fuel efficiency tested
 * @param {number} burn - kilograms of jet fuel burned per kilometre travelled
 */
class FlightProfile {
    constructor(name, seats, kilometres, burn) {
        this.name = name;
        this.seats = seats;
        this.kilometres = kilometres;
        this.burn = burn;
    }
}

export const MODELS = {
    'Airbus A220-100': [
        new FlightProfile('Regional (115 seats)', 115, 1100, 2.8),
        new FlightProfile('Regional (125 seats)', 125, 930, 2.57),
        new FlightProfile('Short Haul', 125, 1900, 2.28)
    ],
    'Airbus A220-300': [
        new FlightProfile('Regional (140 seats)', 140, 1100, 3.10),
        new FlightProfile('Regional (160 seats)', 160, 930, 2.85),
        new FlightProfile('Short Haul (135 seats)', 135, 1900, 2.30),
        new FlightProfile('Short Haul (150 seats)', 150, 1900, 2.42),
        new FlightProfile('Short Haul (160 seats)', 160, 1900, 2.56),
        new FlightProfile('Medium Haul', 150, 3700, 2.42)
    ],
    'Airbus A319': [
        new FlightProfile('Short Haul', 124, 1900, 2.93)
    ],
    'Airbus A319neo': [
        new FlightProfile('Regional (124 seats)', 124, 1220, 2.82),
        new FlightProfile('Regional (144 seats)', 144, 1100, 3.37),
        new FlightProfile('Regional (154 seats)', 154, 1220, 2.79),
        new FlightProfile('Short Haul', 136, 1900, 2.4)
    ],
    'Airbus A320': [
        new FlightProfile('Short Haul', 150, 1900, 3.13),
        new FlightProfile('Medium Haul', 150, 3984, 2.91)
    ],
    'Airbus A320neo': [
        new FlightProfile('Short Haul', 180, 1900, 2.79)
    ],
    'Airbus A321-200': [
        new FlightProfile('Short Haul', 180, 1900, 3.61)
    ],
    'Airbus A321neo': [
        new FlightProfile('Regional', 192, 1220, 3.30),
        new FlightProfile('Short Haul', 220, 1900, 3.47)
    ],
    'Airbus A321LR': [
        new FlightProfile('Medium Haul', 154, 6300, 2.99)
    ],
    'Airbus A330-200': [
        new FlightProfile('Short Haul', 293, 1900, 5.6),
        new FlightProfile('Medium Haul', 241, 5600, 6),
        new FlightProfile('Long Haul (241 seats)', 241, 11000, 6.4),
        new FlightProfile('Long Haul (248 seats)', 248, 10277, 6.55)
    ],
    'Airbus A330-300': [
        new FlightProfile('Medium Haul', 262, 5600, 6.25),
        new FlightProfile('Long Haul', 274, 10275, 6.81)
    ],
    'Airbus A330-800': [
        new FlightProfile('Long Haul', 248, 8610, 5.45)
    ],
    'Airbus A330-900': [
        new FlightProfile('Medium Haul', 310, 6200, 6),
        new FlightProfile('Long Haul', 300, 8610, 5.94)
    ],
    'Airbus A340-300': [
        new FlightProfile('Medium Haul', 262, 5600, 6.81),
        new FlightProfile('Long Haul', 262, 11000, 7.32)
    ],
    'Airbus A350-900': [
        new FlightProfile('Long Haul (315 seats, 9208 km)', 315, 9208, 6.03),
        new FlightProfile('Long Haul (315 seats, 12116 km)', 315, 12116, 7.07),
        new FlightProfile('Long Haul (318 seats)', 318, 10249, 6.52)
    ],
    'Airbus A350-1000': [
        new FlightProfile('Long Haul (327 seats)', 327, 10243, 7.46),
        new FlightProfile('Long Haul (367 seats)', 367, 10243, 7.58)
    ],
    'Airbus A380': [
        new FlightProfile('Medium Haul', 544, 3700, 13.6),
        new FlightProfile('Long Haul (525 seats)', 525, 13300, 13.78),
        new FlightProfile('Long Haul (544 seats)', 544, 11000, 13.78)
    ],
    'Antonov An-148': [
        new FlightProfile('Commuter', 89, 446, 4.23),
        new FlightProfile('Regional', 89, 1267, 2.89),
        new FlightProfile('Short Haul', 89, 2204, 2.75)
    ],
    'Antonov An-158': [
        new FlightProfile('Commuter', 99, 446, 4.34),
        new FlightProfile('Regional', 99, 1267, 3),
        new FlightProfile('Short Haul', 99, 2204, 2.83)
    ],
    'ATR 42-500': [
        new FlightProfile('Commuter', 48, 560, 1.26)
    ],
    'ATR 42-600': [
        new FlightProfile('Regional', 50, 930, 1.30)
    ],
    'ATR 72-500': [
        new FlightProfile('Commuter', 72, 560, 1.67)
    ],
    'ATR 72-500': [
        new FlightProfile('Commuter', 70, 560, 1.42)
    ],
    'ATR 72-600': [
        new FlightProfile('Commuter', 72, 560, 1.56),
        new FlightProfile('Regional', 72, 930, 1.41)
    ],
    'Beechcraft 1900D': [
        new FlightProfile('Commuter', 19, 419, 1.00)
    ],
    'Boeing 737-300': [
        new FlightProfile('Regional', 126, 939, 3.49)
    ],
    'Boeing 737-600': [
        new FlightProfile('Regional', 110, 930, 3.16),
        new FlightProfile('Short Haul', 110, 1900, 2.77)
    ],
    'Boeing 737-700': [
        new FlightProfile('Regional', 126, 930, 3.21),
        new FlightProfile('Short Haul (126 seats)', 126, 1900, 2.82),
        new FlightProfile('Short Haul (128 seats)', 128, 1900, 2.8)
    ],
    'Boeing 737 MAX 7': [
        new FlightProfile('Regional (128 seats)', 128, 1220, 2.85),
        new FlightProfile('Regional (144 seats)', 144, 1100, 3.39),
        new FlightProfile('Short Haul', 140, 1900, 2.51)
    ],
    'Boeing 737-800': [
        new FlightProfile('Regional', 162, 930, 3.59),
        new FlightProfile('Short Haul (160 seats)', 160, 1900, 3.45),
        new FlightProfile('Short Haul (162 seats)', 162, 1900, 3.17)
    ],
    'Boeing 737-800W': [
        new FlightProfile('Short Haul', 162, 1900, 3.18)
    ],
    'Boeing 737 MAX 8': [
        new FlightProfile('Regional', 166, 1220, 3.04),
        new FlightProfile('Short Haul', 162, 1900, 2.71),
        new FlightProfile('Medium Haul', 168, 6300, 2.86)
    ],
    'Boeing 737-900ER': [
        new FlightProfile('Regional', 180, 930, 3.83),
        new FlightProfile('Short Haul', 180, 1900, 3.42)
    ],
    'Boeing 737-900ERW': [
        new FlightProfile('Short Haul', 180, 1900, 3.42)
    ],
    'Boeing 737 MAX 9': [
        new FlightProfile('Regional', 180, 1220, 3.30),
        new FlightProfile('Short Haul', 180, 1900, 2.91),
        new FlightProfile('Medium Haul', 144, 6300, 2.91)
    ],
    'Boeing 747-400': [
        new FlightProfile('Medium Haul', 416, 3984, 10.77),
        new FlightProfile('Long Haul (393 seats)', 393, 10192, 11.82),
        new FlightProfile('Long Haul (416 seats)', 416, 11000, 11.11),
        new FlightProfile('Long Haul (487 seats)', 487, 10147, 12.31)
    ],
    'Boeing 747-8': [
        new FlightProfile('Medium Haul', 467, 5600, 9.9),
        new FlightProfile('Long Haul (405 seats)', 405, 13300, 10.9),
        new FlightProfile('Long Haul (467 seats)', 467, 11000, 10.54)
    ],
    'Boeing 757-200': [
        new FlightProfile('Regional', 200, 930, 4.68),
        new FlightProfile('Short Haul (190 seats)', 190, 1900, 4.60),
        new FlightProfile('Short Haul (200 seats)', 200, 1900, 4.16),
    ],
    'Boeing 757-200W': [
        new FlightProfile('Medium Haul', 158, 6300, 3.79)
    ],
    'Boeing 757-300': [
        new FlightProfile('Regional', 243, 930, 5.19),
        new FlightProfile('Short Haul', 243, 1900, 4.68)
    ],
    'Boeing 767-200ER': [
        new FlightProfile('Medium Haul (181 seats)', 181, 5600, 4.83),
        new FlightProfile('Medium Haul (193 seats)', 193, 6300, 5.01),
        new FlightProfile('Medium Haul (224 seats)', 224, 5600, 4.93),
        new FlightProfile('Long Haul (301 seats)', 301, 11000, 7.42),
        new FlightProfile('Long Haul (304 seats)', 304, 10251, 7.57),
    ],
    'Boeing 767-300ER': [
        new FlightProfile('Medium Haul (218 seats)', 218, 3984, 5.38),
        new FlightProfile('Medium Haul (269 seats)', 269, 5600, 5.51)
    ],
    'Boeing 767-400ER': [
        new FlightProfile('Medium Haul (245 seats)', 245, 5600, 5.78),
        new FlightProfile('Medium Haul (304 seats)', 304, 5600, 5.93)
    ],
    'Boeing 777-200': [
        new FlightProfile('Medium Haul', 305, 5600, 6.83)
    ],
    'Boeing 777-200ER': [
        new FlightProfile('Medium Haul', 301, 5600, 6.96),
        new FlightProfile('Long Haul', 301, 11000, 7.44)
    ],
    'Boeing 777-200LR': [
        new FlightProfile('Long Haul', 291, 9208, 7.57)
    ],
    'Boeing 777-300': [
        new FlightProfile('Medium Haul', 368, 5600, 7.88)
    ],
    'Boeing 777-300ER': [
        new FlightProfile('Long Haul', 344, 13300, 8.58),
        new FlightProfile('Long Haul (365 seats)', 365, 11000, 8.49),
        new FlightProfile('Long Haul (382 seats)', 382, 10199, 8.86)
    ],
    'Boeing 777-9X': [
        new FlightProfile('Long Haul', 395, 13300, 7.69)
    ],
    'Boeing 787-8': [
        new FlightProfile('Short Haul', 248, 1900, 5.50),
        new FlightProfile('Medium Haul (238 seats)', 238, 6300, 5.11),
        new FlightProfile('Medium Haul (291 seats)', 291, 6300, 5.26),
        new FlightProfile('Long Haul', 243, 8610, 5.38)
    ],
    'Boeing 787-8 GEnx': [
        new FlightProfile('Long Haul', 220, 10255, 5.3)
    ],
    'Boeing 787-8 Trent': [
        new FlightProfile('Long Haul', 220, 10255, 5.51)
    ],
    'Boeing 787-9': [
        new FlightProfile('Short Haul', 296, 1900, 5.67),
        new FlightProfile('Medium Haul', 304, 6200, 5.77),
        new FlightProfile('Long Haul (291 seats)', 291, 12116, 7.18),
        new FlightProfile('Long Haul (304 seats)', 304, 9208, 5.63)
    ],
    'Boeing 787-9 GEnx': [
        new FlightProfile('Long Haul (266 seats)', 266, 10249, 5.62),
        new FlightProfile('Long Haul (294 seats)', 294, 8610, 5.85)
    ],
    'Boeing 787-10': [
        new FlightProfile('Short Haul', 336, 1900, 6.09)
    ],
    'Boeing 787-10 GEnx': [
        new FlightProfile('Long Haul', 337, 10240, 6.12)
    ],
    'Boeing 787-10 Trent': [
        new FlightProfile('Long Haul', 337, 10240, 6.24)
    ],
    'Bombardier CRJ100': [
        new FlightProfile('Commuter', 50, 560, 2.21),
        new FlightProfile('Regional', 50, 1069, 1.87)
    ],
    'Bombardier CRJ200': [
        new FlightProfile('Commuter', 50, 560, 2.18),
        new FlightProfile('Regional', 50, 1070, 1.80)
    ],
    'Bombardier CRJ700': [
        new FlightProfile('Commuter', 70, 560, 2.95),
        new FlightProfile('Regional', 70, 1063, 2.45)
    ],
    'Bombardier CRJ900': [
        new FlightProfile('Commuter', 88, 560, 3.47),
        new FlightProfile('Regional', 88, 1061, 2.78)
    ],
    'Bombardier CRJ1000': [
        new FlightProfile('Regional', 100, 930, 2.66)
    ],
    'Bombardier Dash 8 Q400': [
        new FlightProfile('Commuter', 78, 560, 2.16),
        new FlightProfile('Regional', 74, 930, 2.31),
        new FlightProfile('Regional', 74, 1100, 1.83)
    ],
    'Dornier 228': [
        new FlightProfile('Commuter', 19, 560, 0.94)
    ],
    'Dornier 328': [
        new FlightProfile('Commuter', 32, 560, 1.22),
        new FlightProfile('Regional', 31, 1100, 1.08)
    ],
    'Embraer Brasilia': [
        new FlightProfile('Commuter', 30, 560, 0.92)
    ],
    'Embraer E-Jet E2-175': [
        new FlightProfile('Regional', 88, 1100, 2.44)
    ],
    'Embraer E-Jet E2-190': [
        new FlightProfile('Regional', 106, 930, 2.48)
    ],
    'Embraer E-Jet E2-190': [
        new FlightProfile('Regional', 106, 1100, 2.83)
    ],
    'Embraer E-Jet E2-195': [
        new FlightProfile('Regional', 132, 930, 2.62)
    ],
    'Embraer E-Jet E2-195': [
        new FlightProfile('Regional', 132, 1100, 3.07)
    ],
    'Embraer E-Jet-170': [
        new FlightProfile('Regional', 80, 1122, 2.6)
    ],
    'Embraer E-Jet-175': [
        new FlightProfile('Regional', 88, 1120, 2.80)
    ],
    'Embraer E-Jet-190': [
        new FlightProfile('Regional', 114, 1124, 3.24),
    ],
    'Embraer E-Jet-195': [
        new FlightProfile('Regional', 122, 1124, 3.21)
    ],
    'Embraer ERJ-135ER': [
        new FlightProfile('Commuter', 37, 572, 1.64),
        new FlightProfile('Regional', 37, 1104, 1.44)
    ],
    'Embraer ERJ-145ER': [
        new FlightProfile('Commuter', 50, 565, 1.76),
        new FlightProfile('Regional', 50, 1107, 1.55)
    ],
    'Irkut MC-21-300': [
        new FlightProfile('Medium Haul', 163, 3240, 3.04)
    ],
    'Pilatus PC-12': [
        new FlightProfile('Regional', 9, 930, 0.41)
    ],
    'Quest Kodiak': [
        new FlightProfile('Short Haul', 9, 1900, 0.71)
    ],
    'Saab 340': [
        new FlightProfile('Commuter', 32, 560, 1.1),
        new FlightProfile('Regional', 31, 930, 0.95)
    ],
    'Saab 2000': [
        new FlightProfile('Commuter', 50, 560, 1.75),
        new FlightProfile('Regional', 50, 930, 1.54)
    ],
    'Sukhoi SSJ100': [
        new FlightProfile('Regional', 98, 930, 2.81)
    ]
}
