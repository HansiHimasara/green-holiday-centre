import test from "node:test";
import assert from "node:assert/strict";
import { getLkrPerUsd } from "../src/server/exchangeRate.ts";

async function withRateSettings(settings, fakeFetch, action) {
  const previous = {
    key: process.env.EXCHANGE_RATE_API_KEY,
    fallback: process.env.LKR_PER_USD,
    fetch: globalThis.fetch,
  };
  if (settings.key === undefined) delete process.env.EXCHANGE_RATE_API_KEY;
  else process.env.EXCHANGE_RATE_API_KEY = settings.key;
  if (settings.fallback === undefined) delete process.env.LKR_PER_USD;
  else process.env.LKR_PER_USD = settings.fallback;
  if (fakeFetch) globalThis.fetch = fakeFetch;
  try { await action(); }
  finally {
    if (previous.key === undefined) delete process.env.EXCHANGE_RATE_API_KEY;
    else process.env.EXCHANGE_RATE_API_KEY = previous.key;
    if (previous.fallback === undefined) delete process.env.LKR_PER_USD;
    else process.env.LKR_PER_USD = previous.fallback;
    globalThis.fetch = previous.fetch;
  }
}

test("uses manual exchange rate when an API key is not set", async () => {
  await withRateSettings({ fallback: "300" }, () => { throw Error("Network should not be called"); }, async () => {
    assert.equal(await getLkrPerUsd(), 300);
  });
});

test("fetches USD/LKR rate on server and caches it for repeat requests", async () => {
  let requests = 0;
  await withRateSettings({ key: "fake-api-key-for-cache-test" }, async (url, options) => {
    requests++;
    assert.match(String(url), /^https:\/\/v6\.exchangerate-api\.com\/v6\/fake-api-key-for-cache-test\/latest\/USD$/);
    assert.equal(options.cache, "no-store");
    return Response.json({ result: "success", base_code: "USD", conversion_rates: { LKR: 330.466 } });
  }, async () => {
    assert.equal(await getLkrPerUsd(), 330.466);
    assert.equal(await getLkrPerUsd(), 330.466);
    assert.equal(requests, 1);
  });
});

test("deduplicates simultaneous API requests", async () => {
  let requests = 0;
  await withRateSettings({ key: "fake-api-key-for-concurrency-test" }, async () => {
    requests++;
    await new Promise(resolve => setTimeout(resolve, 10));
    return Response.json({ result: "success", base_code: "USD", conversion_rates: { LKR: 331 } });
  }, async () => {
    assert.deepEqual(await Promise.all([getLkrPerUsd(), getLkrPerUsd(), getLkrPerUsd()]), [331, 331, 331]);
    assert.equal(requests, 1);
  });
});

test("uses agreed fallback rate when provider returns an API error", async () => {
  await withRateSettings({ key: "fake-api-key-for-fallback-test", fallback: "315" }, async () =>
    Response.json({ result: "error", "error-type": "invalid-key" }), async () => {
      assert.equal(await getLkrPerUsd(), 315);
    });
});

test("never invents a rate if provider and fallback are both unavailable", async () => {
  await withRateSettings({ key: "fake-api-key-for-failure-test" }, async () => Response.json({ result: "error", "error-type": "quota-reached" }), async () => {
    await assert.rejects(() => getLkrPerUsd(), /temporarily|unavailable/i);
  });
  await withRateSettings({}, () => { throw Error("Network should not be called"); }, async () => {
    await assert.rejects(() => getLkrPerUsd(), /Set EXCHANGE_RATE_API_KEY/);
  });
});
