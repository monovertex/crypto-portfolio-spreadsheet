import { FOREIGN_EXCHANGE_URL_DAY_AVERAGE } from 'src/constants';
import { size } from 'lodash';

import { ProviderAbstract } from './abstract';

export class ServiceForeignExchange extends ProviderAbstract {
    _buildBaseUrl(fromCurrency, toCurrency, date) {
        return `${FOREIGN_EXCHANGE_URL_DAY_AVERAGE}/${date}?base=${fromCurrency}&symbols=${toCurrency}`;
    }

    _validatePayload(payload) {
        return !payload.error && payload.rates && size(payload.rates);
    }

    _extractRateFromPayload(payload, fromCurrency, toCurrency) {
        return payload.rates[toCurrency];
    }

    _normalizeDate(date) {
        return date.toISOString().substring(0, 10);
    }
}
