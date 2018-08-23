import { ProviderBNC } from 'src/entities/exchange-rate-providers/bnc';

const UrlFetchApp = global.UrlFetchApp;

afterEach(() => {
    global.UrlFetchApp = UrlFetchApp;
});

it('fetches the correct URL, based on the provided currencies and date', () => {
    const fakeFetch = jest.fn();
    global.UrlFetchApp = { fetch: fakeFetch };
    const provider = new ProviderBNC('BTC', 'RON', new Date(Date.UTC(2018, 0, 1)));
    provider.getExchangeRate();
    expect(fakeFetch).toHaveBeenCalledWith('https://bravenewcoin-mwa-historic-v1.p.mashape.com/mwa-historic?coin=btc&market=ron&from=1514764800&to=1514764801');
});

it('returns an undefined rate when the payload is undefined', () => {
    global.UrlFetchApp = { fetch() {} };
    const provider = new ProviderBNC('BTC', 'RON', new Date(Date.UTC(2018, 0, 1)));
    const result = provider.getExchangeRate();
    expect(result).toBe(undefined);
});

it('returns an undefined rate when the request is not successful', () => {
    global.UrlFetchApp = { fetch: () => '{ "success": false }' };
    const provider = new ProviderBNC('BTC', 'RON', new Date(Date.UTC(2018, 0, 1)));
    const result = provider.getExchangeRate();
    expect(result).toBe(undefined);
});

it('returns an undefined rate when the request is missing the data attribute', () => {
    global.UrlFetchApp = { fetch: () => '{ "success": true }' };
    const provider = new ProviderBNC('BTC', 'RON', new Date(Date.UTC(2018, 0, 1)));
    const result = provider.getExchangeRate();
    expect(result).toBe(undefined);
});

it('returns an undefined rate when the request has an empty data attribute', () => {
    global.UrlFetchApp = { fetch: () => '{ "success": true, "data": [] }' };
    const provider = new ProviderBNC('BTC', 'RON', new Date(Date.UTC(2018, 0, 1)));
    const result = provider.getExchangeRate();
    expect(result).toBe(undefined);
});

it('returns the provided rate when the request is successful', () => {
    global.UrlFetchApp = { fetch: () => '{ "success": true, "data": [[0, 0.1]] }' };
    const provider = new ProviderBNC('BTC', 'RON', new Date(Date.UTC(2018, 0, 1)));
    const result = provider.getExchangeRate();
    expect(result).toBe(0.1);
});
