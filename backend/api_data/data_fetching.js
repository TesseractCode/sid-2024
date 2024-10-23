require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.ANAF_API_KEY;
const endpoint = process.env.ANAF_BALANCES_ENDPOINT;

const itp_data = [
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 494343,
        "active_imobilizate_total": 1863255,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_public": {},
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 2002078,
        "casa_si_conturi": 249450,
        "cheltuieli_in_avans": 5486,
        "cheltuieli_totale": 2131128,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 2850652,
        "creante": 244893,
        "datorii_total": 361006,
        "numar_mediu_de_salariati": 27,
        "pierdere_bruta": {},
        "pierdere_neta": {},
        "profit_brut": 737500,
        "profit_net": 624300,
        "provizioane": {},
        "stocuri": {},
        "venituri_in_avans": {},
        "venituri_totale": 2868628
      },
      "meta": {
        "updated_at": "2016-09-01T18:28:47.445420Z"
      },
      "year": 2010
    },
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 1091670,
        "active_imobilizate_total": 1751503,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_public": {},
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 2448043,
        "casa_si_conturi": 628064,
        "cheltuieli_in_avans": 5880,
        "cheltuieli_totale": 2411957,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 3457420,
        "creante": 463606,
        "datorii_total": 401010,
        "numar_mediu_de_salariati": 26,
        "pierdere_bruta": 0,
        "pierdere_neta": 0,
        "profit_brut": 1095246,
        "profit_net": 922157,
        "provizioane": {},
        "stocuri": {},
        "venituri_in_avans": {},
        "venituri_totale": 3507203
      },
      "meta": {
        "updated_at": "2016-09-01T18:28:30.552658Z"
      },
      "year": 2011
    },
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 1383806,
        "active_imobilizate_total": 1663476,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_public": {},
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 2684784,
        "casa_si_conturi": 1015037,
        "cheltuieli_in_avans": 7731,
        "cheltuieli_totale": 2885451,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 4123613,
        "creante": 368769,
        "datorii_total": 370229,
        "numar_mediu_de_salariati": 28,
        "pierdere_bruta": 0,
        "pierdere_neta": 0,
        "profit_brut": 1323687,
        "profit_net": 1096243,
        "provizioane": {},
        "stocuri": {},
        "venituri_in_avans": {},
        "venituri_totale": 4209138
      },
      "meta": {
        "updated_at": "2016-09-01T18:28:58.921075Z"
      },
      "year": 2012
    },
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 2097955,
        "active_imobilizate_total": 1554827,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_public": {},
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 3302267,
        "casa_si_conturi": 1331491,
        "cheltuieli_in_avans": 6932,
        "cheltuieli_totale": 3323789,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 4791122,
        "creante": 457961,
        "datorii_total": 357447,
        "numar_mediu_de_salariati": 32,
        "pierdere_bruta": 0,
        "pierdere_neta": 0,
        "profit_brut": 1589104,
        "profit_net": 1327042,
        "provizioane": {},
        "stocuri": 0,
        "venituri_in_avans": {},
        "venituri_totale": 4912893
      },
      "meta": {
        "updated_at": "2016-09-01T18:29:06.915045Z"
      },
      "year": 2013
    },
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 1646223,
        "active_imobilizate_total": 1425790,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_public": {},
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 2764288,
        "casa_si_conturi": 660478,
        "cheltuieli_in_avans": 7280,
        "cheltuieli_totale": 3510325,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 5089122,
        "creante": 537263,
        "datorii_total": 315005,
        "numar_mediu_de_salariati": 35,
        "pierdere_bruta": 0,
        "pierdere_neta": 0,
        "profit_brut": 1625817,
        "profit_net": 1369402,
        "provizioane": {},
        "stocuri": {},
        "venituri_in_avans": {},
        "venituri_totale": 5136142
      },
      "meta": {
        "updated_at": "2016-09-01T18:28:40.588024Z"
      },
      "year": 2014
    },
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 2423766,
        "active_imobilizate_total": 1515548,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_public": {},
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 3551971,
        "casa_si_conturi": 1238876,
        "cheltuieli_in_avans": 38333,
        "cheltuieli_totale": 4025963,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 6180635,
        "creante": 736043,
        "datorii_total": 425676,
        "numar_mediu_de_salariati": 40,
        "pierdere_bruta": 0,
        "pierdere_neta": 0,
        "profit_brut": 2203268,
        "profit_net": 1842445,
        "provizioane": {},
        "stocuri": 26,
        "venituri_in_avans": {},
        "venituri_totale": 6229231
      },
      "meta": {
        "updated_at": "2016-09-01T18:28:33.411571Z"
      },
      "year": 2015
    },
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 1370285,
        "active_imobilizate_total": 1552922,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 2312750,
        "casa_si_conturi": 299541,
        "cheltuieli_in_avans": 6371,
        "cheltuieli_totale": 4524700,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 6785470,
        "creante": 621650,
        "datorii_total": 616828,
        "numar_mediu_de_salariati": 43,
        "pierdere_bruta": 0,
        "pierdere_neta": 0,
        "profit_brut": 2394161,
        "profit_net": 2017039,
        "provizioane": {},
        "stocuri": 140,
        "venituri_in_avans": {},
        "venituri_totale": 6918861
      },
      "meta": {
        "updated_at": "2018-01-11T23:51:26.334274Z"
      },
      "year": 2016
    },
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 1287207,
        "active_imobilizate_total": 1449396,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 2186070,
        "casa_si_conturi": 87926,
        "cheltuieli_in_avans": 8046,
        "cheltuieli_totale": 5274950,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 7469415,
        "creante": 743997,
        "datorii_total": 558579,
        "numar_mediu_de_salariati": 48,
        "pierdere_bruta": 0,
        "pierdere_neta": 0,
        "profit_brut": 2216592,
        "profit_net": 1890359,
        "provizioane": {},
        "stocuri": 5381,
        "venituri_in_avans": {},
        "venituri_totale": 7491542
      },
      "meta": {
        "updated_at": "2018-05-26T06:45:58.684161Z"
      },
      "year": 2017
    },
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 3083419,
        "active_imobilizate_total": 1269150,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 3822065,
        "casa_si_conturi": 1919364,
        "cheltuieli_in_avans": 15375,
        "cheltuieli_totale": 5263105,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 7178261,
        "creante": 708767,
        "datorii_total": 545879,
        "numar_mediu_de_salariati": 45,
        "pierdere_bruta": 0,
        "pierdere_neta": 0,
        "profit_brut": 1928395,
        "profit_net": 1635894,
        "provizioane": {},
        "stocuri": 5352,
        "venituri_in_avans": {},
        "venituri_totale": 7191500
      },
      "meta": {
        "updated_at": "2019-06-01T04:26:32.137859Z"
      },
      "year": 2018
    },
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 5501135,
        "active_imobilizate_total": 1317369,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 6162288,
        "casa_si_conturi": 4157325,
        "cheltuieli_in_avans": 14094,
        "cheltuieli_totale": 6282542,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 8745634,
        "creante": 1087232,
        "datorii_total": 670310,
        "numar_mediu_de_salariati": 45,
        "pierdere_bruta": 0,
        "pierdere_neta": 0,
        "profit_brut": 2564457,
        "profit_net": 2186719,
        "provizioane": {},
        "stocuri": 244,
        "venituri_in_avans": {},
        "venituri_totale": 8846999
      },
      "meta": {
        "updated_at": "2020-05-30T21:41:33.244507Z"
      },
      "year": 2019
    },
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 8425641,
        "active_imobilizate_total": 1314843,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 8951058,
        "casa_si_conturi": 6703739,
        "cheltuieli_in_avans": 112680,
        "cheltuieli_totale": 8219880,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 12748997,
        "creante": 1464402,
        "datorii_total": 902106,
        "numar_mediu_de_salariati": 54,
        "pierdere_bruta": 0,
        "pierdere_neta": 0,
        "profit_brut": 4632116,
        "profit_net": 3996098,
        "provizioane": {},
        "stocuri": 445,
        "venituri_in_avans": {},
        "venituri_totale": 12851996
      },
      "meta": {
        "updated_at": "2021-07-07T04:41:30.859831Z"
      },
      "year": 2020
    },
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 14075052,
        "active_imobilizate_total": 1688820,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 14885732,
        "casa_si_conturi": 11892430,
        "cheltuieli_in_avans": 126457,
        "cheltuieli_totale": 10218599,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 17512292,
        "creante": 1924787,
        "datorii_total": 1004597,
        "numar_mediu_de_salariati": 67,
        "pierdere_bruta": 0,
        "pierdere_neta": 0,
        "profit_brut": 7450696,
        "profit_net": 6468599,
        "provizioane": {},
        "stocuri": 150,
        "venituri_in_avans": {},
        "venituri_totale": 17669295
      },
      "meta": {
        "updated_at": "2022-03-31T22:13:17.575596Z"
      },
      "year": 2021
    },
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 6832814,
        "active_imobilizate_total": 17217989,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 19422359,
        "casa_si_conturi": 3239246,
        "cheltuieli_in_avans": 224272,
        "cheltuieli_totale": 15474172,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 24127569,
        "creante": 2751526,
        "datorii_total": 4852716,
        "numar_mediu_de_salariati": 87,
        "pierdere_bruta": 0,
        "pierdere_neta": 0,
        "profit_brut": 8885409,
        "profit_net": 7694523,
        "provizioane": {},
        "stocuri": 149,
        "venituri_in_avans": {},
        "venituri_totale": 24359581
      },
      "meta": {
        "updated_at": "2023-03-11T01:50:18.005183Z"
      },
      "year": 2022
    },
    {
      "balance_type": "WEB_AN",
      "caen_code": "6201",
      "cif": "16341004",
      "data": {
        "active_circulante_total": 8019128,
        "active_imobilizate_total": 43310917,
        "caen_descriere": "Activitati de realizare a soft-ului la comanda (software orientat client)",
        "capitaluri_capital": 4000,
        "capitaluri_patrimoniul_regiei": {},
        "capitaluri_total": 22889108,
        "casa_si_conturi": 4661957,
        "cheltuieli_in_avans": 414118,
        "cheltuieli_totale": 19373688,
        "cif": 16341004,
        "cifra_de_afaceri_neta": 23275982,
        "creante": 2977845,
        "datorii_total": 28428316,
        "numar_mediu_de_salariati": 85,
        "pierdere_bruta": 0,
        "pierdere_neta": 0,
        "profit_brut": 4617076,
        "profit_net": 4003509,
        "provizioane": 83251,
        "stocuri": 209,
        "venituri_in_avans": 343488,
        "venituri_totale": 23990764
      },
      "meta": {
        "updated_at": "2024-06-07T08:53:03.201988Z"
      },
      "year": 2023
    }
  ]

const fetchData = async(cif) => {
    if (cif === 16341004)
    {
        return itp_data;
    }

    try {
        const response = await axios.get(endpoint.replace('{cif}', cif), {
            headers: {
                'x-api-key': `${apiKey}`,
            },
        });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

module.exports = { fetchData };
