import { BNC_API_KEY } from 'src/env-constants';
import { BNC_URL_DAY_AVERAGE } from 'src/constants';

import { ProviderAbstract } from './abstract';

export class ServiceBNC extends ProviderAbstract {
    _buildBaseUrl(fromCurrency, toCurrency, timestamp) {
        const toTimestamp = timestamp + 1;
        return `${BNC_URL_DAY_AVERAGE}?coin=${fromCurrency}&market=${toCurrency}&from=${timestamp}&to=${toTimestamp}`;
    }

    _validatePayload(payload) {
        return payload.success &&
            payload.data &&
            payload.data.length &&
            payload.data[0].length;
    }

    _buildFetchHeaders() {
        return { 'X-Mashape-Key': BNC_API_KEY };
    }

    _extractRateFromPayload(payload) {
        return payload.data[0][8];
    }

    _normalizeCurrency() {
        const normalizedSymbol = super._normalizeCurrency(...arguments);
        if (normalizedSymbol === 'NIM') { return 'NET'; }
        return normalizedSymbol;
    }
}
