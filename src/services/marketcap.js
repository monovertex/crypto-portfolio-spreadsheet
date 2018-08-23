import { ServiceAbstract } from 'src/services/abstract';
import { COIN_MARKETCAP_URL_LIST_ALL_BTC } from 'src/constants';
import { COIN_MARKETCAP_API_KEY } from 'src/env-constants';

export class ServiceMarketcap extends ServiceAbstract {
    fetchValues() {
        const rawValues = this._fetchRawValues() || [];
        return this._processValues(rawValues);
    }

    _fetchRawValues() {
        const response = UrlFetchApp.fetch(COIN_MARKETCAP_URL_LIST_ALL_BTC, {
            headers: { 'X-CMC_PRO_API_KEY': COIN_MARKETCAP_API_KEY },
        });
        if (!response) { return; }
        const payload = JSON.parse(response);
        if (!payload || !payload.data) { return; }
        return payload.data;
    }

    _processValues(rawValues) {
        return rawValues.map((item) => [
            this._convertSymbol(item.symbol),
            item.cmc_rank,
            item.circulating_supply,
            item.quote.BTC.market_cap,
        ]);
    }

    _convertSymbol(symbol) {
        switch (symbol) {
            case 'MIOTA': return 'IOTA';
        }
        return symbol;
    }
}
