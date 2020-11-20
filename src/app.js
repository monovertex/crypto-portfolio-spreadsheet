import 'core-js/es6/map';
import 'core-js/es6/object';
import 'core-js/es6/set';
import 'core-js/es6/symbol';
import 'core-js/fn/array/includes';
import 'core-js/fn/object/entries';

import { CONVERT_TO_DELTA_FORMAT } from 'src/functions/delta-formatter';
import { FIAT_CURRENCIES } from 'src/functions/currencies';
import { WALLET_BALANCE_ANALYSIS } from 'src/functions/wallet-balance-analysis';
import { onOpen } from 'src/menus';
import { writeExchangeRates } from 'src/triggers/exchange-rates';

global.onOpen = onOpen;
global.writeExchangeRates = writeExchangeRates;

global.FIAT_CURRENCIES = FIAT_CURRENCIES;
global.WALLET_BALANCE_ANALYSIS = WALLET_BALANCE_ANALYSIS;
global.CONVERT_TO_DELTA_FORMAT = CONVERT_TO_DELTA_FORMAT;
