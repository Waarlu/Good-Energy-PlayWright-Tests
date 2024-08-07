/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";

const e2eData = {
  "estimateUuid": "09a940a2-c7cd-4876-8bcc-8f7a403a6797",
  "addressList": [
    "4 Monkton Park",
    "",
    "",
    "Farnham",
    "Surrey",
    "GU9 9PA"
  ]
}

test('E2E scenario', async ({ request }) => {
  const estimatesRequest = await request.post(`/api/estimates`, {
    data: e2eData
  });

  expect(estimatesRequest.status()).toEqual(200);
  expect((await estimatesRequest.json())['how_much_cost']['total_estimated_price']).toEqual('£20,000')
});


test('No estimateUuid', async ({ request }) => {
  const data = e2eData;
  delete (data as any)['estimateUuid']
  const estimatesRequest = await request.post(`/api/estimates`, {
    data
  });

  expect(estimatesRequest.status()).toEqual(500);
});

test('Incorrect estimateUuid', async ({ request }) => {
  const data = e2eData;
  data['estimateUuid'] = "1234"
  const estimatesRequest = await request.post(`/api/estimates`, {
    data
  });

  expect(estimatesRequest.status()).toEqual(204);
});

test('No addressList', async ({ request }) => {
  const data = e2eData;
  delete (data as any)['addressList']
  const estimatesRequest = await request.post(`/api/estimates`, {
    data
  });

  expect(estimatesRequest.status()).toEqual(204);
});

test('Incorrect addressList', async ({ request }) => {
  const data = e2eData;
  data['addressList'][4] = "BS1 2NB"
  const estimatesRequest = await request.post(`/api/estimates`, {
    data
  });

  expect(estimatesRequest.status()).toEqual(200);
  expect((await estimatesRequest.json())['how_much_cost']['total_estimated_price']).toEqual('£20,000')

});