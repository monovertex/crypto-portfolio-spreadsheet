import { isUndefined } from 'lodash';
import { GOOGLE_FINANCE_CURRENCY_PAIRS, SHEET_EXCHANGE_RATES } from 'src/constants';
import { Sheet } from 'src/entities/sheet';
import { ServiceExchangeRate } from 'src/services/exchange-rate';

export function writeExchangeRates() {
    const ratesSheet = new Sheet(SHEET_EXCHANGE_RATES);
    const pairs = ratesSheet.getColumnData(1, 2);
    const previousValues = ratesSheet.getColumnData(2, 2);
    const pairsToFetch = pairs.filter((pair) => !GOOGLE_FINANCE_CURRENCY_PAIRS.includes(pair));

    const exchangeRateService = new ServiceExchangeRate();
    const values = exchangeRateService.getExchangeRateMulti(pairsToFetch);

    const resolvedValues = pairs.map((pair, index) => {
        if (GOOGLE_FINANCE_CURRENCY_PAIRS.includes(pair)) {
            return `=GOOGLEFINANCE("${pair.replace('_', '')}")`;
        }

        if (!isUndefined(values[pair])) { return values[pair]; }
        return previousValues[index] || 0;
    }).map((item) => [item]);

    const range = ratesSheet.sheetInstance.getRange(2, 2, resolvedValues.length, 1);
    range.setFormulas(resolvedValues);
}
