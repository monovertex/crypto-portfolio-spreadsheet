import { ServiceExchangeRate } from 'src/services/exchange-rate';
import { isUndefined } from 'lodash';

const PROPERTIES = [
    'date',
    'sellCoin', 'sellValue', 'sellAccount',
    'buyCoin', 'buyValue', 'buyAccount',
    'type', 'comment', 'transaction', 'address', 'market', 'exRate', 'month',
    'sellValueCryptoBase', 'buyValueCryptoBase',
    'sellValueCoreFiatBase', 'buyValueCoreFiatBase',
    'sellValueFiatBase', 'buyValueFiatBase',
];

const CONVERTED_VALUES_CONFIG = [
    { target: 'sellValue', coin: 'sellCoin', value: 'sellValue', fallback: 'buyValue' },
    { target: 'buyValue', coin: 'buyCoin', value: 'buyValue', fallback: 'sellValue' },
];

const CURRENCY_BASES = ['Crypto', 'FiatCore', 'Fiat'];

export class Transaction {
    constructor(dataRow) {
        this._exchangeRateService = new ServiceExchangeRate();
        PROPERTIES.forEach((propertyKey, index) => (this[propertyKey] = dataRow[index]));
    }

    convertValues() {
        for (const config of CONVERTED_VALUES_CONFIG) {
            const {
                cryptoBaseRate,
                fiatCoreBaseRate,
                fiatBaseRate,
            } = this._getExchangeRatesForBases(this[config.coin]);

            const basesConfig = [
                [CURRENCY_BASES[0], cryptoBaseRate],
                [CURRENCY_BASES[1], fiatCoreBaseRate],
                [CURRENCY_BASES[2], fiatBaseRate],
            ];

            for (const [base, exRate] of basesConfig) {
                this[`${config.target}${base}Base`] = this._convertValue(this[config.value], exRate);
            }
        }

        for (const base of CURRENCY_BASES) {
            for (const config of CONVERTED_VALUES_CONFIG) {
                const target = `${config.target}${base}Base`;
                const fallbackTarget = `${config.fallback}${base}Base`;
                if (!this[target] && this[config.value]) {
                    this[target] = this[fallbackTarget];
                }
            }
        }
    }

    _convertValue(value, exRate) {
        if (isUndefined(value) || value === 0 || isUndefined(exRate)) { return 0; }
        return value * exRate;
    }

    _getExchangeRatesForBases(currency) {
        return this._exchangeRateService.getExchangeRateForBases(currency, this.date);
    }
}
