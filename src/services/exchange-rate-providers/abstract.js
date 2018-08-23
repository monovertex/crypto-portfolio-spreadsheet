import { ServiceAbstract } from 'src/services/abstract';

export class ProviderAbstract extends ServiceAbstract {
    getExchangeRate(fromCurrency, toCurrency, date) {
        const normalizedFromCurrency = this._normalizeCurrency(fromCurrency);
        const normalizedToCurrency = this._normalizeCurrency(toCurrency);
        const normalizedTimestamp = this._normalizeDate(date);

        const url = this._buildBaseUrl(normalizedFromCurrency, normalizedToCurrency, normalizedTimestamp);
        const payload = this._fetchPayload(url);
        if (!payload) { return; }
        return this._extractRateFromPayload(payload, normalizedFromCurrency, normalizedToCurrency, normalizedTimestamp);
    }

    getExchangeRateMulti(pairs) {
        const rates = this._getExchangeRateMulti(pairs);
        return this._processMultiResults(pairs, rates);
    }

    _getExchangeRateMulti(_pairs) {
        throw new Error('Not Implemented');
    }

    _buildBaseUrl(_fromCurrency, _toCurrency, _timestamp) {
        throw new Error('Not Implemented');
    }

    _validatePayload(_payload) {
        throw new Error('Not Implemented');
    }

    _extractRateFromPayload(_payload) {
        throw new Error('Not Implemented');
    }

    _fetchPayload(url) {
        const headers = this._buildFetchHeaders();
        const response = UrlFetchApp.fetch(url, { headers });
        if (!response) { return; }
        const payload = JSON.parse(response);
        if (!payload || !this._validatePayload(payload)) { return; }
        return payload;
    }

    _buildFetchHeaders() {
        return {};
    }

    _normalizeCurrency(symbol) {
        return String(symbol).toUpperCase();
    }

    _normalizeDate(date) {
        return date.getTime() / 1000;
    }

    _splitPair(pair) { return pair.split('_'); }

    _processMultiResults(pairs, rates) {
        return pairs.reduce((result, pair) =>
            Object.assign(result, { [pair]: this._processMultiResult(pair, rates) }), {});
    }

    _processMultiResult(pair, rates) {
        const [fromSymbol, toSymbol] = this._splitPair(pair);
        const normalizedFromSymbol = this._normalizeCurrency(fromSymbol);
        const normalizedToSymbol = this._normalizeCurrency(toSymbol);

        if (normalizedFromSymbol === normalizedToSymbol) { return 1; }
        if (rates[pair]) { return rates[pair]; }
        const reversePair = `${normalizedToSymbol}_${normalizedFromSymbol}`;
        if (rates[reversePair]) { return 1 / rates[reversePair]; }
    }
}
