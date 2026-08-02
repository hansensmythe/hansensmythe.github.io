/*
    Data extracted from https://celebrityprivatejettracker.com/leaderboard/ on 24 July 2026
*/

/**
 * @constructor
 * @param {string} model - Model name of aircraft
 * @param {number} kilometres - Average distance per flight
 * @param {number} burn - kilograms of jet fuel burned per kilometre travelled
 * @param {number} flightsPerYear - how many flights with this average are taken annually
 */
class FlightProfile {
    constructor(model, kilometres, burn, flightsPerYear) {
        this.model = model;
        this.kilometres = kilometres;
        this.burn = burn;
        this.flightsPerYear = flightsPerYear;
    }
}

export const CELEBRITIES = {
    'Alex Rodriquez': [
        new FlightProfile('Gulfstream IV', 1728, 2.23, 241)
    ],
    'Bill Gates': [
        new FlightProfile('Gulfstream G650 (plane #1)', 2551, 2.15, 355),
        new FlightProfile('Gulfstream G650 (plane #2)', 2543, 2.16, 235)
    ],
    'Blake Shelton': [
        new FlightProfile('Gulfstream IV', 1702, 2.48, 170)
    ],
    'Caesars Palace Casino': [
        new FlightProfile('Gulfstream V', 1639, 1.86, 222)
    ],
    'Dan Bilzerian': [
        new FlightProfile('Gulfstream IV', 2263, 2.2, 93)
    ],
    'David Geffen': [
        new FlightProfile('Gulfstream G650', 2824, 2.09, 109)
    ],
    'Donald Trump': [
        new FlightProfile('Boeing 757-200', 1342, 29.71, 480)
    ],
    'Dr. Phil': [
        new FlightProfile('Gulfstream IV', 1863, 2.21, 155)
    ],
    'Drake': [
        new FlightProfile('Boeing 767-200ER', 1093, 25.62, 141)
    ],
    'Elon Musk': [
        new FlightProfile('Gulfstream G650 (plane #1)', 2323, 2.13, 358),
        new FlightProfile('Gulfstream V (plane #2)', 2075, 1.71, 240)
    ],
    'Elton John': [
        new FlightProfile('Bombardier Global Express', 595, 3.17, 51)
    ],
    'Eric Schmidt': [
        new FlightProfile('Gulfstream G650', 1983, 2.28, 687)
    ],
    'Floyd Mayweather': [
        new FlightProfile('Gulfstream IV', 1434, 2.53, 95)
    ],
    'George Lucas': [
        new FlightProfile('Gulfstream V', 2009, 1.69, 222)
    ],
    'Google': [
        new FlightProfile('Gulfstream V', 2209, 1.74, 141)
    ],
    'Harrison Ford': [
        new FlightProfile('Cessna Citation Sovereign', 1934, 0.88, 81)
    ],
    'Jay Z': [
        new FlightProfile('Gulfstream V', 2138, 1.7, 291)
    ],
    'Jeff Bezos': [
        new FlightProfile('Gulfstream G650 (plane #1)', 4456, 1.84, 8),
        new FlightProfile('Gulfstream G650 (plane #2)', 1777, 1.96, 4)
    ],
    'Jerry Jones': [
        new FlightProfile('Gulfstream V', 1889, 1.67, 167)
    ],
    'Jim Carrey': [
        new FlightProfile('Gulfstream V', 1521, 1.93, 229)
    ],
    'Judge Judy': [
        new FlightProfile('Cessna Citation 750', 2402, 1.41, 123)
    ],
    'Kenny Chesney': [
        new FlightProfile('Dassault Falcon 900', 1261, 1.38, 289)
    ],
    'Kid Rock': [
        new FlightProfile('Bombardier Challenger 600', 846, 1.66, 245)
    ],
    'Kim Kardashian': [
        new FlightProfile('Gulfstream G650', 2918, 2.13, 326)
    ],
    'Kylie Jenner': [
        new FlightProfile('Bombardier Global 7500', 2476, 2.38, 271)
    ],
    'Lady Gaga': [
        new FlightProfile('Gulfstream V', 2655, 1.81, 142)
    ],
    'Larry Ellison': [
        new FlightProfile('Gulfstream G650', 2117, 2.39, 125)
    ],
    'Luke Bryan': [
        new FlightProfile('Learjet 60', 969, 1.19, 880)
    ],
    'Magic Johnson': [
        new FlightProfile('Gulfstream II', 2070, 1.46, 15)
    ],
    'Marc Benioff': [
        new FlightProfile('Gulfstream G650', 2649, 2.32, 175)
    ],
    'Mark Cuban': [
        new FlightProfile('Bombardier Global Express', 1556, 2.34, 206)
    ],
    'Mark Wahlberg': [
        new FlightProfile('Bombardier Global Express', 2108, 2.41, 174)
    ],
    'Mark Zuckerberg': [
        new FlightProfile('Gulfstream G650', 1888, 2.41, 335)
    ],
    'Matt Damon': [
        new FlightProfile('Bombardier Global 7500', 2236, 2.35, 234)
    ],
    'Max Verstappen': [
        new FlightProfile('Dassault Falcon 900', 1968, 1.42, 95)
    ],
    'Michael Bloomberg': [
        new FlightProfile('Dassault Falcon 900 (plane #1)', 1847, 1.4, 365),
        new FlightProfile('Dassault Falcon 900 (plane #2)', 1505, 1.51, 382),
        new FlightProfile('Dassault Falcon 900 (plane #3)', 1640, 1.43, 155)
    ],
    'Michael Jordan': [
        new FlightProfile('Gulfstream V', 1495, 1.9, 116)
    ],
    'Nike Corporation': [
        new FlightProfile('Gulfstream G650', 2239, 2.41, 204)
    ],
    'Oprah Winfrey': [
        new FlightProfile('Gulfstream G650', 1931, 2.37, 260)
    ],
    'P. Diddy': [
        new FlightProfile('Gulfstream V', 2038, 1.81, 438)
    ],
    'Peter Thiel': [
        new FlightProfile('Gulfstream V', 2260, 1.8, 83)
    ],
    'Phil Knight': [
        new FlightProfile('Gulfstream G650', 1573, 2.74, 222)
    ],
    'Phil Mickelson': [
        new FlightProfile('Gulfstream V', 1613, 1.35, 2)
    ],
    'Playboy Corporation': [
        new FlightProfile('Bombardier Global Express', 1836, 2.1, 15)
    ],
    'Ron DeSantis': [
        new FlightProfile('Cessna Citation Latitude', 496, 2.42, 855)
    ],
    'Ronald Perelman': [
        new FlightProfile('Gulfstream G650', 1727, 2.22, 186)
    ],
    'Rupert Murdoch': [
        new FlightProfile('Gulfstream G650', 2111, 2.36, 110)
    ],
    'Sergey Brin': [
        new FlightProfile('Gulfstream G650', 3444, 2.09, 126)
    ],
    'Steve Ballmer': [
        new FlightProfile('Gulfstream G650', 1662, 2.32, 408)
    ],
    'Steve Wynn': [
        new FlightProfile('Gulfstream V', 874, 2.21, 682)
    ],
    'Steven Spielberg': [
        new FlightProfile('Gulfstream G650', 2464, 2.21, 130)
    ],
    'Taylor Swift': [
        new FlightProfile('Dassault Falcon 7X (plane #1)', 1763, 1.54, 136),
        new FlightProfile('Dassault Falcon 900 (sold)', 1590, 1.26, 41)
    ],
    'Tiger Woods': [
        new FlightProfile('Gulfstream V', 1313, 1.98, 60)
    ],
    'Tom Cruise': [
        new FlightProfile('Bombardier Challenger 350', 1535, 1.68, 367)
    ],
    'Tommy Hilfiger': [
        new FlightProfile('Dassault Falcon 900', 1782, 1.43, 146)
    ],
    'Travis Scott': [
        new FlightProfile('Embraer E-Jet-190', 2218, 3.24, 419)
    ],
    'Tyler Perry': [
        new FlightProfile('Embraer E-Jet-190', 2058, 3.73, 121)
    ],
    'Under Armour Corporation': [
        new FlightProfile('Gulfstream V', 1607, 1.93, 236)
    ],
};
