import { ProviderAbstract } from './abstract';
import {
    CRYPTO_COMPARE_URL_DAY_AVERAGE,
    CRYPTO_COMPARE_URL_PRICE_MULTI,
} from 'src/constants';
import { isUndefined } from 'lodash';

export class ServiceCryptoCompare extends ProviderAbstract {
    _getExchangeRateMulti(pairs) {
        const { fromSymbols, toSymbols } = this._extractSymbolsFromPairs(pairs);
        const url = `${CRYPTO_COMPARE_URL_PRICE_MULTI}?fsyms=${fromSymbols}&tsyms=${toSymbols}`;
        const payload = this._fetchPayload(url);
        if (isUndefined(payload)) { return {}; }

        const result = {};
        pairs.forEach((pair) => {
            const [fromSymbol, toSymbol] = this._splitPair(pair);
            const values = payload[this._normalizeCurrency(fromSymbol)];
            if (!values) { return; }

            const value = values[this._normalizeCurrency(toSymbol)];
            if (value) { result[pair] = value; }
        });
        return result;
    }

    _buildBaseUrl(fromCurrency, toCurrency, timestamp) {
        return `${CRYPTO_COMPARE_URL_DAY_AVERAGE}?fsym=${fromCurrency}&tsym=${toCurrency}&toTs=${timestamp}`;
    }

    _validatePayload(payload) {
        return payload.Response !== 'Error';
    }

    _extractRateFromPayload(payload, fromCurrency, toCurrency) {
        return payload[toCurrency];
    }

    _normalizeCurrency() {
        const normalizedSymbol = super._normalizeCurrency(...arguments);
        if (normalizedSymbol === 'NET') { return 'NET*'; }
        if (normalizedSymbol === 'IOTA') { return 'IOT'; }
        if (normalizedSymbol === 'MIOTA') { return 'IOT'; }
        return normalizedSymbol;
    }

    _extractSymbolsFromPairs(pairs) {
        const splitPairs = pairs.map((pair) => this._splitPair(pair));

        return {
            fromSymbols: this._normalizeCurrencyList(splitPairs.map(([rawFrom]) => rawFrom)),
            toSymbols: this._normalizeCurrencyList(splitPairs.map(([, rawTo]) => rawTo)),
        };
    }

    _normalizeCurrencyList(list) {
        const normalizedList = list
            .filter((item) => item)
            .map((item) => this._normalizeCurrency(item));
        const uniqueList = normalizedList.filter((item, index) => normalizedList.indexOf(item) === index);
        return uniqueList.join(',');
    }
}
