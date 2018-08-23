import { ServiceAbstractConvertedValues } from 'src/services/abstract-converted-values';
import { HistorySheet } from 'src/entities/history-sheet';
import { ServiceExchangeRate } from 'src/services/exchange-rate';
import { memoized } from 'src/decorators/memoized';

export class ServiceHistory extends ServiceAbstractConvertedValues {
    constructor() {
        super(...arguments);
        this._exchangeRateService = new ServiceExchangeRate();
    }

    @memoized
    get _targetSheet() {
        return new HistorySheet();
    }

    _getConvertedValuesForDataRow(dataRow) {
        const [date, currency, balance] = dataRow;
        const {
            cryptoBaseRate,
            fiatCoreBaseRate,
            fiatBaseRate,
        } = this._getExchangeRatesForBases(currency, date);

        return [
            balance * (cryptoBaseRate || 0),
            balance * (fiatCoreBaseRate || 0),
            balance * (fiatBaseRate || 0),
        ];
    }

    _getExchangeRatesForBases(currency, date) {
        return this._exchangeRateService.getExchangeRateForBases(currency, date);
    }
}
