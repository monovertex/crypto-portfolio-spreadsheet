import { ServiceAbstract } from 'src/services/abstract';

export class ServiceExchangeRateTempCache extends ServiceAbstract {
    constructor() {
        super(...arguments);
        this._cache = CacheService.getScriptCache();
    }

    readValue(symbol, timestamp) {
        return parseFloat(this._cache.get(this._cacheKey(symbol, timestamp)));
    }

    writeValue(symbol, timestamp, value) {
        this._cache.put(this._cacheKey(symbol, timestamp), String(value));
    }

    _cacheKey(symbol, timestamp) {
        return `ex-rate-${symbol}-${timestamp}`;
    }
}
