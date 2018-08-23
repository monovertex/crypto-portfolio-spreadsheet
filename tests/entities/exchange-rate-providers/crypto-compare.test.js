import { ProviderCryptoCompare } from 'src/entities/exchange-rate-providers/crypto-compare';

const UrlFetchApp = global.UrlFetchApp;

afterEach(() => {
    global.UrlFetchApp = UrlFetchApp;
});

it('fetches the correct URL, based on the provided currencies and date', () => {
    const fakeFetch = jest.fn();
    global.UrlFetchApp = { fetch: fakeFetch };
    const provider = new ProviderCryptoCompare('BTC', 'RON', new Date(Date.UTC(2018, 0, 1)));
    provider.getExchangeRate();
    expect(fakeFetch).toHaveBeenCalledWith('https://crypto-compare.monovertex.com/data/dayAvg?fsym=BTC&tsym=RON&toTs=1514764800');
});

[
    ['NET', 'NET*'],
    ['NIM', 'NET*'],
    ['IOTA', 'IOT'],
].forEach(([providedSymbol, expectedSymbol]) => {
    it(`fetches the correct URL, when the mapped symbol "${providedSymbol}" is provided`, () => {
        const fakeFetch = jest.fn();
        global.UrlFetchApp = { fetch: fakeFetch };
        const provider = new ProviderCryptoCompare(providedSymbol, 'BTC', new Date(Date.UTC(2018, 0, 1)));
        provider.getExchangeRate();
        expect(fakeFetch).toHaveBeenCalledWith(`https://crypto-compare.monovertex.com/data/dayAvg?fsym=${expectedSymbol}&tsym=BTC&toTs=1514764800`);
    });
});

it('returns an undefined rate when the payload is undefined', () => {
    global.UrlFetchApp = { fetch() {} };
    const provider = new ProviderCryptoCompare('BTC', 'RON', new Date(Date.UTC(2018, 0, 1)));
    const result = provider.getExchangeRate();
    expect(result).toBe(undefined);
});

it('returns an undefined rate when the request is not successful', () => {
    global.UrlFetchApp = { fetch: () => '{ "Response": "Error" }' };
    const provider = new ProviderCryptoCompare('BTC', 'RON', new Date(Date.UTC(2018, 0, 1)));
    const result = provider.getExchangeRate();
    expect(result).toBe(undefined);
});

it('returns the provided rate when the request is successful', () => {
    global.UrlFetchApp = { fetch: () => '{ "RON": 0.1 }' };
    const provider = new ProviderCryptoCompare('BTC', 'RON', new Date(Date.UTC(2018, 0, 1)));
    const result = provider.getExchangeRate();
    expect(result).toBe(0.1);
});
