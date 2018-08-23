import { isUndefined } from 'lodash';
import { FIAT_CURRENCIES } from 'src/constants';
import { ServiceAbstract } from 'src/services/abstract';
import { ServiceBNC } from 'src/services/exchange-rate-providers/bnc';
import { ServiceCryptoCompare } from 'src/services/exchange-rate-providers/crypto-compare';
import { ServiceForeignExchange } from 'src/services/exchange-rate-providers/foreign-exchange';
import { ServiceExchangeRateTempCache } from 'src/services/exchange-rate-temp-cache';

const PROVIDERS = [ServiceCryptoCompare, ServiceBNC];
const FIAT_PROVIDERS = [ServiceForeignExchange];
const MULTI_PROVIDERS = [ServiceCryptoCompare];

const instantiateProviders = (ProviderClasses) => ProviderClasses.map((ProviderClass) => new ProviderClass());

export class ServiceExchangeRate extends ServiceAbstract {
    constructor() {
        super(...arguments);
        this._tempCache = new ServiceExchangeRateTempCache();
        this._instantiateProviders();
    }

    getExchangeRate(fromCurrency, toCurrency, date = new Date()) {
        if (!fromCurrency || !toCurrency) { return; }
        if (fromCurrency === toCurrency) { return 1; }
        const symbol = this._convertToSymbol(fromCurrency, toCurrency);
        const timestamp = this._convertToTimestamp(date);

        const cachedValue = this._readCachedValue(symbol, timestamp);
        if (cachedValue) { return cachedValue; }

        const liveValue = this._getLiveExchangeRateWithReverseFallback(fromCurrency, toCurrency, date);
        this._writeCachedValue(symbol, timestamp, liveValue);
        return liveValue;
    }

    _readCachedValue(symbol, timestamp) {
        return this._tempCache.readValue(symbol, timestamp);
    }

    _writeCachedValue(symbol, timestamp, value) {
        const normalizedValue = isUndefined(value) ? 0 : value;
        this._tempCache.writeValue(symbol, timestamp, normalizedValue);
    }

    getExchangeRateMulti(pairs) {
        for (const provider of this._multiProviders) {
            const exchangeRates = provider.getExchangeRateMulti(pairs);
            if (!isUndefined(exchangeRates)) { return exchangeRates; }
        }
    }

    _instantiateProviders() {
        this._providers = instantiateProviders(PROVIDERS);
        this._fiatProviders = instantiateProviders(FIAT_PROVIDERS);
        this._multiProviders = instantiateProviders(MULTI_PROVIDERS);
    }

    _convertToSymbol(fromCurrency, toCurrency) {
        return `${fromCurrency}_${toCurrency}`.toUpperCase();
    }

    _convertToTimestamp(date) {
        return date.getTime();
    }

    _getLiveExchangeRateWithReverseFallback(fromCurrency, toCurrency, date) {
        const value = this._getLiveExchangeRate(...arguments);
        if (value) { return value; }
        const reverseValue = this._getLiveExchangeRate(toCurrency, fromCurrency, date);
        if (isUndefined(reverseValue)) { return; }
        if (reverseValue === 0) { return 0; }
        return 1 / reverseValue;
    }

    _getLiveExchangeRate(fromCurrency, toCurrency, date) {
        const isFxRate = FIAT_CURRENCIES.includes(fromCurrency) && FIAT_CURRENCIES.includes(toCurrency);
        const providers = isFxRate ? this._fiatProviders : this._providers;
        for (const provider of providers) {
            const exchangeRate = provider.getExchangeRate(fromCurrency, toCurrency, date);
            if (exchangeRate) { return exchangeRate; }
        }
    }
}
