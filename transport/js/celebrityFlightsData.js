// Data extracted from https://celebrityprivatejettracker.com/leaderboard/
export const DATA_DATE = '12 August 2026';

/**
 * Raw data from CelebrityPrivateJetTracker is input, then turned into metric values.
 * 
 * @constructor
 * @param {string} model - Model name of aircraft
 * @param {number} miles - Total distance travelled in miles
 * @param {number} gallons - Gallons of fuel used
 * @param {number} totalFlights - Total number of flights taken
 * @param {number} co2Pollution - Metric tons of CO2 pollution
 */
class FlightProfile {
    constructor(model, miles, gallons, totalFlights, co2Pollution) {
        this.model = model;
        this.kilometres = miles * 1.609344;
        this.kgBurnedFuel = gallons * 3.1; // Assuming Jet A at 3.1 kg per US gallon
        this.totalFlights = totalFlights;
        this.kgBurnedCO2 = co2Pollution * 1000;
        this.burn = this.kgBurnedFuel / this.kilometres; // kilograms of jet fuel burned per kilometre travelled
    }
}

export const CELEBRITIES = {
    'Alex Rodriquez': [
        new FlightProfile('Gulfstream IV', 258705, 299510, 241, 4026)
    ],
    'Bill Gates': [
        new FlightProfile('Gulfstream G650 (plane #1)', 562782, 629280, 355, 6290),
        new FlightProfile('Gulfstream G650 (plane #2)', 371316, 416040, 235, 4152)
    ],
    'Blake Shelton': [
        new FlightProfile('Gulfstream IV', 179760, 231280, 170, 3094)
    ],
    'Caesars Palace Casino': [
        new FlightProfile('Gulfstream V', 226051, 217750, 222, 2888)
    ],
    'Dan Bilzerian': [
        new FlightProfile('Gulfstream IV', 130779, 149500, 93, 2007)
    ],
    'David Geffen': [
        new FlightProfile('Gulfstream G650', 191280, 207780, 109, 2072)
    ],
    'Donald Trump': [
        new FlightProfile('Boeing 757', 400281, 6173540, 480, 35380)
    ],
    'Dr. Phil': [
        new FlightProfile('Gulfstream IV', 179432, 206030, 155, 2777)
    ],
    'Drake': [
        new FlightProfile('Boeing 767', 95756, 1273800, 141, 4258)
    ],
    'Elon Musk': [
        new FlightProfile('Gulfstream G650 (plane #1)', 516801, 571500, 358, 5705),
        new FlightProfile('Gulfstream V (plane #2)', 309380, 275130, 240, 3687)
    ],
    'Elton John': [
        new FlightProfile('Bombardier Global Express', 18859, 30990, 51, 384)
    ],
    'Eric Schmidt': [
        new FlightProfile('Gulfstream G650', 846608, 1002390, 687, 10017)
    ],
    'Floyd Mayweather': [
        new FlightProfile('Gulfstream IV', 84660, 111030, 95, 1500)
    ],
    'George Lucas': [
        new FlightProfile('Gulfstream V', 277189, 243130, 222, 3267)
    ],
    'Google': [
        new FlightProfile('Gulfstream V', 193560, 174650, 141, 2338)
    ],
    'Harrison Ford': [
        new FlightProfile('Cessna Citation Sovereign', 97352, 44340, 81, 791)
    ],
    'Jay Z': [
        new FlightProfile('Gulfstream V', 386642, 341990, 291, 4594)
    ],
    'Jeff Bezos': [
        new FlightProfile('Gulfstream G650 (plane #1)', 22150, 21140, 8, 212),
        new FlightProfile('Gulfstream G650 (plane #2)', 4416, 4490, 4, 44)
    ],
    'Jerry Jones': [
        new FlightProfile('Gulfstream V', 195976, 169890, 167, 2280)
    ],
    'Jim Carrey': [
        new FlightProfile('Gulfstream V', 216485, 216670, 229, 2916)
    ],
    'Judge Judy': [
        new FlightProfile('Cessna Citation 750', 183603, 134790, 123, 1218)
    ],
    'Kenny Chesney': [
        new FlightProfile('Dassault Falcon 900', 226361, 162190, 289, 2164)
    ],
    'Kid Rock': [
        new FlightProfile('Bombardier Challenger 600', 128811, 111270, 245, 1564)
    ],
    'Kim Kardashian': [
        new FlightProfile('Gulfstream G650', 591172, 652790, 326, 6579)
    ],
    'Kylie Jenner': [
        new FlightProfile('Bombardier Global 7500', 416887, 516010, 271, 5880)
    ],
    'Lady Gaga': [
        new FlightProfile('Gulfstream V', 234294, 219990, 142, 2830)
    ],
    'Larry Ellison': [
        new FlightProfile('Gulfstream G650', 164436, 203870, 125, 2052)
    ],
    'Luke Bryan': [
        new FlightProfile('Learjet 60', 529724, 328100, 880, 4862)
    ],
    'Magic Johnson': [
        new FlightProfile('Gulfstream II', 19290, 14640, 15, 158)
    ],
    'Mark Cuban': [
        new FlightProfile('Bombardier Global Express', 199155, 241520, 206, 2985)
    ],
    'Marc Benioff': [
        new FlightProfile('Gulfstream G650', 288043, 346340, 175, 3462)
    ],
    'Mark Wahlberg': [
        new FlightProfile('Bombardier Global Express', 227895, 285640, 174, 3527)
    ],
    'Mark Zuckerberg': [
        new FlightProfile('Gulfstream G650', 393099, 492270, 335, 4913)
    ],
    'Matt Damon': [
        new FlightProfile('Bombardier Global 7500', 325065, 397320, 234, 4523)
    ],
    'Max Verstappen': [
        new FlightProfile('Dassault Falcon 900', 116150, 85590, 95, 1106)
    ],
    'Michael Bloomberg': [
        new FlightProfile('Dassault Falcon 900 (plane #1)', 418894, 304910, 365, 4055),
        new FlightProfile('Dassault Falcon 900 (plane #2)', 357284, 280850, 382, 3728),
        new FlightProfile('Dassault Falcon 900 (plane #3)', 157945, 117560, 155, 1569)
    ],
    'Michael Jordan': [
        new FlightProfile('Gulfstream V', 107770, 106320, 116, 1365)
    ],
    'Phil Knight': [
        new FlightProfile('Gulfstream G650', 217031, 308840, 222, 3089)
    ],
    'Nike Corporation': [
        new FlightProfile('Gulfstream G650', 283840, 354900, 204, 3562)
    ],
    'Oprah Winfrey': [
        new FlightProfile('Gulfstream G650', 312030, 384390, 260, 3859)
    ],
    'P. Diddy': [
        new FlightProfile('Gulfstream V', 554659, 521950, 438, 7019)
    ],
    'Peter Thiel': [
        new FlightProfile('Gulfstream V', 116532, 108620, 83, 1454)
    ],
    'Phil Mickelson': [
        new FlightProfile('Gulfstream V', 2004, 1400, 2, 18)
    ],
    'Playboy Corporation': [
        new FlightProfile('Bombardier Global Express', 17116, 18650, 15, 232)
    ],
    'Ron DeSantis': [
        new FlightProfile('Cessna Citation Latitude', 263689, 330980, 855, 3708)
    ],
    'Ronald Perelman': [
        new FlightProfile('Gulfstream G650', 199559, 230140, 186, 2298)
    ],
    'Rupert Murdoch': [
        new FlightProfile('Gulfstream G650', 144277, 176760, 110, 1778)
    ],
    'Sergey Brin': [
        new FlightProfile('Gulfstream G650', 269631, 292420, 126, 2916)
    ],
    'Steve Ballmer': [
        new FlightProfile('Gulfstream G650', 421309, 508460, 408, 5087)
    ],
    'Steve Wynn': [
        new FlightProfile('Gulfstream V', 370234, 424430, 682, 5696)
    ],
    'Steven Spielberg': [
        new FlightProfile('Gulfstream G650', 199004, 228210, 130, 2309)
    ],
    'Taylor Swift': [
        new FlightProfile('Dassault Falcon 7X (plane #1)', 148980, 119030, 136, 1397),
        new FlightProfile('Dassault Falcon 900 (sold)', 40513, 26470, 41, 356)
    ],
    'Tommy Hilfiger': [
        new FlightProfile('Dassault Falcon 900', 161687, 120440, 146, 1594)
    ],
    'Tiger Woods': [
        new FlightProfile('Gulfstream V', 48950, 50360, 60, 673)
    ],
    'Tom Cruise': [
        new FlightProfile('Bombardier Challenger 350', 350144, 304970, 367, 2809)
    ],
    'Travis Scott': [
        new FlightProfile('Embraer E-190', 577484, 1094170, 419, 14775)
    ],
    'Tyler Perry': [
        new FlightProfile('Embraer E-190', 154750, 299850, 121, 3991)
    ],
    'Under Armour Corporation': [
        new FlightProfile('Gulfstream V', 235711, 235910, 236, 3158)
    ],
};
