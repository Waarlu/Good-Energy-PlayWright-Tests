/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";

const e2eData = {
    "questionnaire": {
      "google_analytics_client_id": null,
      "channel": "Good Energy",
      "property_address": {
        "postcode": "SN15 1ER",
        "latitude": 51.4604,
        "longitude": -2.11656,
        "formatted_address": [
          "Wiltshire Council",
          "Monkton Park Offices",
          "Monkton Park",
          "Chippenham",
          "Wiltshire"
        ],
        "thoroughfare": "",
        "building_name": "Monkton Park Offices",
        "sub_building_name": "",
        "sub_building_number": "",
        "building_number": "",
        "line_1": "Wiltshire Council",
        "line_2": "Monkton Park Offices",
        "line_3": "Monkton Park",
        "line_4": "",
        "locality": "",
        "town_or_city": "Chippenham",
        "county": "Wiltshire",
        "district": "Wiltshire",
        "country": "England",
        "residential": false,
        "display": "Wiltshire Council,\n Monkton Park Offices,\n Monkton Park,\n Chippenham,\n Wiltshire,\n SN15 1ER"
      },
      "epc": {
        "epc_found": false,
        "lodgement_date": "",
        "heating_demand": null,
        "hotwater_demand": null,
        "valid_until_date": ""
      },
      "fabric": {
        "energy_efficiency_measures": [
          "wall_insulation"
        ],
        "floor_type": [],
        "roof_type": [],
        "walls_type": [],
        "windows_type": []
      },
      "house": {
        "house_age": "<1965",
        "house_bedrooms": "one_bedroom",
        "house_type": "detached_house",
        "postcode": "SN15 1ER",
        "storeys": "1",
        "total_floor_area": 150,
        "is_in_area": true,
        "basement": true
      },
      "systems": {
        "boiler_type": "system",
        "heating_fuel": "mains_gas"
      }
    }
}

test('E2E scenario', async ({ request }) => {
  const newIssue = await request.post(`/api/enquiries`, {
    data: e2eData
  });
  expect(newIssue.status()).toEqual(200);
  expect((await newIssue.json())['how_much_cost']['total_estimated_price']).toEqual('£19,200')

});

test('No email format', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']["email_address"] = "test"

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect( newIssue.status()).toEqual(500);
  });

test('No property address provided', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['property_address']
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(500);
  });

test('No postcode', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['property_address']['postcode']
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.status()).toEqual(400);
    const json = await newIssue.json();
    expect(json['errors']['Message']).toEqual([", 'Questionnaire Property Address Postcode' must not be empty.. Attempted Value: "])
    
  });

  test('Incorrect postcode abc', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']['property_address']['postcode'] = 'abc'
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.status()).toEqual(400);
    const json = await newIssue.json();
    expect(json['errors']['Message']).toEqual([", 'Questionnaire Property Address Postcode' must be between 5 and 10 characters. You entered 3 characters.. Attempted Value: abc"])
  });

  test('Incorrect postcode abc12', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']['property_address']['postcode'] = 'abc12'
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.status()).toEqual(500);
  });

  test('No address', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['property_address']['display']
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.status()).toEqual(400);
    const json = await newIssue.json();
    expect(json['errors']['Message']).toEqual([", 'Questionnaire Property Address Display' must not be empty.. Attempted Value: "])
    
  });

  test('No epc provided', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['epc']
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(500);
  });

  test('Incorrect epc date provided', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']['epc']['valid_until_date'] = 'abc'
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(500);
  });


  test('Past epc date provided', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']['epc']['valid_until_date'] = '2005'
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(500);
  });

  test('No fabric provided', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['fabric']
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(500);
  });

  test('Incorrect energy_efficiency_measures provided', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']['fabric']['energy_efficiency_measures'] = ['unknown']
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect( newIssue.status()).toEqual(200);
  expect((await newIssue.json())['how_much_cost']['total_estimated_price']).toEqual('£20,100')

  });

  test('No energy_efficiency_measures provided', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['fabric']['energy_efficiency_measures']

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect( newIssue.status()).toEqual(200);
    expect((await newIssue.json())['how_much_cost']['total_estimated_price']).toEqual('£20,100')

  });

  test('Incorrect house age 2005', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']['house']['house_age'] = '2005'
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(400);
  });



  test('Incorrect house_bedrooms', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']['house']['house_bedrooms'] = '1'
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(400);
  });

  test('No house_bedrooms', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['house']['house_bedrooms']

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(400);
  });

  test('Incorrect house_type', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']['house']['house_type'] = 'a'
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(400);
  });

  test('No house_type', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['house']['house_type']

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(400);
  });

  test('Incorrect storeys', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']['house']['storeys'] = 'a'
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect( newIssue.status()).toEqual(400);
  });

  test('No storeys', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['house']['storeys']

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(400);
  });


  test('No basement', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['house']['basement']

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect( newIssue.status()).toEqual(200);
  });


  test('No is_in_area', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['house']['is_in_area']

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect( newIssue.status()).toEqual(200);
  });

  test('Incorrect house age abc', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']['house']['house_age'] = 'abc'
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(400);
  });

  test('No house age', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['house']['house_age']

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(400);
  });

  test('No house floor area', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['house']['total_floor_area']

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect( newIssue.status()).toEqual(200);
  });

  test('Incorrect house floor area abc', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']['house']['total_floor_area'] = -1
    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(500);
  });

  test('No systems object provided', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['systems']

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(500);
  });

  test('No boiler_type provided', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['systems']['boiler_type']

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(400);
  });

  test('Incorrect boiler_type provided', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']['systems']['boiler_type'] = 'abc'

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(400);
  });

  test('No heating_fuel provided', async ({ request }) => {
    const data = e2eData;
    delete (data as any)['questionnaire']['systems']['heating_fuel']

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(400);
  });

  test('Incorrect heating_fuel provided', async ({ request }) => {
    const data = e2eData;
    data['questionnaire']['systems']['heating_fuel'] = 'abc'

    const newIssue = await request.post(`/api/enquiries`, {
      data
    });

    expect(newIssue.ok()).not.toBeTruthy();
    expect( newIssue.status()).toEqual(400);
  });