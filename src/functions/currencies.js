import { FIAT_CURRENCIES as FIAT_CURRENCIES_LIST } from 'src/constants';

export function FIAT_CURRENCIES() {
    return FIAT_CURRENCIES_LIST.map((currency) => [currency]);
}
