import { ServiceExchangeRate } from 'src/services/exchange-rate';

export function EXCHANGE_RATE(_fromCurrency, _toCurrency, _date) {
    const service = new ServiceExchangeRate();
    return service.getExchangeRate(...arguments);
}
