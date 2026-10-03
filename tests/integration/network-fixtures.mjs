// Used only by the isolated test runner. No live maps or SMTP calls are made.
if (process.env.TEST_DATABASE_ISOLATED !== 'true') throw new Error('Test-only network fixtures.');
const original = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = String(input instanceof Request ? input.url : input);
  if (url.startsWith('https://photon.komoot.io/api/')) return Response.json({ features: [{ geometry: { coordinates: [79.8612, 6.9271] } }] });
  if (url.startsWith('https://api.openrouteservice.org/v2/directions/')) return Response.json({ features: [{ properties: { summary: { distance: 10000, duration: 900 } } }] });
  return original(input, init);
};
