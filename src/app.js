import 'core-js/es6/map';
import 'core-js/es6/object';
import 'core-js/es6/set';
import 'core-js/es6/symbol';
import 'core-js/fn/array/includes';
import 'core-js/fn/object/entries';

import { FIAT_CURRENCIES } from 'src/functions/currencies';
import { WALLET_BALANCE_ANALYSIS } from 'src/functions/wallet-balance-analysis';

import { writeExchangeRates } from 'src/triggers/exchange-rates';

import { onOpen } from 'src/menus';

global.onOpen = onOpen;
global.writeExchangeRates = writeExchangeRates;

global.FIAT_CURRENCIES = FIAT_CURRENCIES;
global.WALLET_BALANCE_ANALYSIS = WALLET_BALANCE_ANALYSIS;
