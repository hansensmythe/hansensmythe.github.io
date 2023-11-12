// War dead by year from 1939 through 1945 was taken from http://www.fallen.io/ww2/#
// War dead by year from Deaths in State-Based Conflicts by Region at "https://ourworldindata.org/war-and-peace"
// Traffic deaths prior to 1990 were extrapolated from US traffic deaths per year by 100,000 people from https://en.wikipedia.org/wiki/Motor_vehicle_fatality_rate_in_U.S._by_year
// scaled up to global population figures starting in 1951 from https://www.worldometers.info/world-population/world-population-by-year/
// Traffic deaths 1990-2019 from https://ourworldindata.org/grapher/road-traffic-deaths-sdgs?tab=table&time=earliest..2019
const dataByYear = [
    {
    //     "year": 1939,
    //     "estCarDead": 0,
    //     "warDead": 500000
    // }, {
    //     "year": 1940,
    //     "estCarDead": 0,
    //     "warDead": 1100000
    // }, {
    //     "year": 1941,
    //     "estCarDead": 0,
    //     "warDead": 2400000
    // }, {
    //     "year": 1942,
    //     "estCarDead": 0,
    //     "warDead": 2600000
    // }, {
    //     "year": 1943,
    //     "estCarDead": 0,
    //     "warDead": 7500000
    // }, {
    //     "year": 1944,
    //     "estCarDead": 0,
    //     "warDead": 8500000
    // }, {
    //     "year": 1945,
    //     "estCarDead": 0,
    //     "warDead": 4000000
    // }, {
        "year": 1946,
        "estCarDead": 0,
        "warDead": 296386
    }, {
        "year": 1947,
        "estCarDead": 0,
        "warDead": 404784
    }, {
        "year": 1948,
        "estCarDead": 0,
        "warDead": 475588
    }, {
        "year": 1949,
        "estCarDead": 0,
        "warDead": 446646
    }, {
        "year": 1950,
        "estCarDead": 0,
        "warDead": 550676
    }, {
        "year": 1951,
        "estCarDead": 679192,
        "warDead": 396167
    }, {
        "year": 1952,
        "estCarDead": 695119,
        "warDead": 149073
    }, {
        "year": 1953,
        "estCarDead": 698642,
        "warDead": 98934
    }, {
        "year": 1954,
        "estCarDead": 655564,
        "warDead": 69519
    }, {
        "year": 1955,
        "estCarDead": 711197,
        "warDead": 31164
    }, {
        "year": 1956,
        "estCarDead": 737562,
        "warDead": 40580
    }, {
        "year": 1957,
        "estCarDead": 718725,
        "warDead": 32188
    }, {
        "year": 1958,
        "estCarDead": 689992,
        "warDead": 48037
    }, {
        "year": 1959,
        "estCarDead": 708728,
        "warDead": 52460
    }, {
        "year": 1960,
        "estCarDead": 712625,
        "warDead": 64873
    }, {
        "year": 1961,
        "estCarDead": 709845,
        "warDead": 77804
    }, {
        "year": 1962,
        "estCarDead": 765455,
        "warDead": 55938
    }, {
        "year": 1963,
        "estCarDead": 825418,
        "warDead": 69801
    }, {
        "year": 1964,
        "estCarDead": 910460,
        "warDead": 63348
    }, {
        "year": 1965,
        "estCarDead": 947528,
        "warDead": 98568
    }, {
        "year": 1966,
        "estCarDead": 1033043,
        "warDead": 96786
    }, {
        "year": 1967,
        "estCarDead": 1039323,
        "warDead": 126717
    }, {
        "year": 1968,
        "estCarDead": 1091407,
        "warDead": 233327
    }, {
        "year": 1969,
        "estCarDead": 1120492,
        "warDead": 198673
    }, {
        "year": 1970,
        "estCarDead": 1111156,
        "warDead": 208784
    }, {
        "year": 1971,
        "estCarDead": 1117299,
        "warDead": 258085
    }, {
        "year": 1972,
        "estCarDead": 1171394,
        "warDead": 299083
    }, {
        "year": 1973,
        "estCarDead": 1171421,
        "warDead": 222940
    }, {
        "year": 1974,
        "estCarDead": 988920,
        "warDead": 261646
    }, {
        "year": 1975,
        "estCarDead": 982906,
        "warDead": 135684
    }, {
        "year": 1976,
        "estCarDead": 1013170,
        "warDead": 106722
    }, {
        "year": 1977,
        "estCarDead": 1073558,
        "warDead": 45550
    }, {
        "year": 1978,
        "estCarDead": 1136088,
        "warDead": 102573
    }, {
        "year": 1979,
        "estCarDead": 1160798,
        "warDead": 157289
    }, {
        "year": 1980,
        "estCarDead": 1170199,
        "warDead": 125492
    }, {
        "year": 1981,
        "estCarDead": 1138958,
        "warDead": 197263
    }, {
        "year": 1982,
        "estCarDead": 1023923,
        "warDead": 234509
    }, {
        "year": 1983,
        "estCarDead": 1001346,
        "warDead": 228286
    }, {
        "year": 1984,
        "estCarDead": 1050031,
        "warDead": 249266
    }, {
        "year": 1985,
        "estCarDead": 1048985,
        "warDead": 228466
    }, {
        "year": 1986,
        "estCarDead": 1112691,
        "warDead": 235400
    }, {
        "year": 1987,
        "estCarDead": 1130767,
        "warDead": 194655
    }, {
        "year": 1988,
        "estCarDead": 1157862,
        "warDead": 152503
    }, {
        "year": 1989,
        "estCarDead": 1130145,
        "warDead": 54846
    }, {
        "year": 1990,
        "carDead": 1113411,
        "warDead": 80230
    }, {
        "year": 1991,
        "carDead": 1117666,
        "warDead": 70338
    }, {
        "year": 1992,
        "carDead": 1126217,
        "warDead": 53378
    }, {
        "year": 1993,
        "carDead": 1138091,
        "warDead": 44946
    }, {
        "year": 1994,
        "carDead": 1154304,
        "warDead": 38462
    }, {
        "year": 1995,
        "carDead": 1163463,
        "warDead": 36105
    }, {
        "year": 1996,
        "carDead": 1163484,
        "warDead": 28344
    }, {
        "year": 1997,
        "carDead": 1170473,
        "warDead": 40596
    }, {
        "year": 1998,
        "carDead": 1178491,
        "warDead": 39916
    }, {
        "year": 1999,
        "carDead": 1195982,
        "warDead": 80626
    }, {
        "year": 2000,
        "carDead": 1213031,
        "warDead": 78385
    }, {
        "year": 2001,
        "carDead": 1224896,
        "warDead": 23255
    }, {
        "year": 2002,
        "carDead": 1237786,
        "warDead": 20892
    }, {
        "year": 2003,
        "carDead": 1248905,
        "warDead": 22777
    }, {
        "year": 2004,
        "carDead": 1259242,
        "warDead": 19420
    }, {
        "year": 2005,
        "carDead": 1269937,
        "warDead": 12138
    }, {
        "year": 2006,
        "carDead": 1268190,
        "warDead": 19718
    }, {
        "year": 2007,
        "carDead": 1274027,
        "warDead": 19212
    }, {
        "year": 2008,
        "carDead": 1285039,
        "warDead": 28678
    }, {
        "year": 2009,
        "carDead": 1282368,
        "warDead": 34603
    }, {
        "year": 2010,
        "carDead": 1279539,
        "warDead": 21087
    }, {
        "year": 2011,
        "carDead": 1268433,
        "warDead": 25070
    }, {
        "year": 2012,
        "carDead": 1256149,
        "warDead": 74032
    }, {
        "year": 2013,
        "carDead": 1232930,
        "warDead": 93482
    }, {
        "year": 2014,
        "carDead": 1214700,
        "warDead": 115862
    }, {
        "year": 2015,
        "carDead": 1202132,
        "warDead": 103608
    }, {
        "year": 2016,
        "carDead": 1194268,
        "warDead": 90108
    }, {
        "year": 2017,
        "carDead": 1189003,
        "warDead": 71855
    }, {
        "year": 2018,
        "carDead": 1196641,
        "warDead": 54826
    }, {
        "year": 2019,
        "carDead": 1198289,
        "warDead": 52427
    }, {
        "year": 2020,
        "estCarDead": 1200000,
        "warDead": 53837
    }, {
        "year": 2021,
        "estCarDead": 1200000,
        "warDead": 84102
    }, {
        "year": 2022,
        "estCarDead": 1200000,
        "warDead": 204009
    }
];

function insertChart(ctx) {
    const labels = dataByYear.map(datum => datum.year);
    const carDeaths = dataByYear.map(datum => datum.carDead || 0);
    const estCarDeaths = dataByYear.map(datum => datum.estCarDead || 0);
    const warDeaths = dataByYear.map(datum => datum.warDead);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Global traffic deaths',
                    data: carDeaths,
                    borderWidth: 1
                }, {
                    label: 'Estimated global traffic deaths',
                    data: estCarDeaths,
                    borderWidth: 1
                }, {
                    label: 'War deaths',
                    data: warDeaths,
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
