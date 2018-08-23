import { Sheet } from 'src/entities/sheet';
import { SHEET_EXCHANGE_RATES } from 'src/constants';
import { ServiceExchangeRate } from 'src/services/exchange-rate';
import { isUndefined } from 'lodash';

export function writeExchangeRates() {
    const ratesSheet = new Sheet(SHEET_EXCHANGE_RATES);
    const pairs = ratesSheet.getColumnData(1, 2);
    const previousValues = ratesSheet.getColumnData(2, 2);

    const exchangeRateService = new ServiceExchangeRate();
    const values = exchangeRateService.getExchangeRateMulti(pairs);

    const resolvedValues = pairs.map((pair, index) => {
        if (!isUndefined(values[pair])) { return values[pair]; }
        return previousValues[index] || 0;
    }).map((item) => [item]);

    const range = ratesSheet.sheetInstance.getRange(2, 2, resolvedValues.length, 1);
    range.setValues(resolvedValues);
}
