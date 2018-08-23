import 'core-js/es6/map';
import 'core-js/es6/object';
import 'core-js/es6/set';
import 'core-js/es6/symbol';
import 'core-js/fn/array/includes';
import 'core-js/fn/object/entries';

import { BALANCE_HISTORY } from 'src/functions/balance-history';
import { COVER_TRADES } from 'src/functions/trade-analysis';
import { EXCHANGE_RATE } from 'src/functions/exchange-rate';
import { FIAT_CURRENCIES } from 'src/functions/currencies';
import { WALLET_BALANCE_ANALYSIS } from 'src/functions/wallet-balance-analysis';

import { writeMarketcapValues } from 'src/triggers/write-marketcap-values';
import { writeExchangeRates } from 'src/triggers/exchange-rates';
import {
    writeConvertedTransactionValues,
    resetConvertedTransactionValues,
    writeConvertedTransactionValuesSingleRow,
} from 'src/triggers/converted-transaction-values';
import {
    writeConvertedHistoryValues,
    resetConvertedHistoryValues,
    writeConvertedHistoryValuesSingleRow,
} from 'src/triggers/converted-history-values';

import { onOpen } from 'src/menus';

global.onOpen = onOpen;
global.resetConvertedTransactionValues = resetConvertedTransactionValues;
global.writeConvertedTransactionValues = writeConvertedTransactionValues;
global.writeConvertedTransactionValuesSingleRow = writeConvertedTransactionValuesSingleRow;
global.resetConvertedHistoryValues = resetConvertedHistoryValues;
global.writeConvertedHistoryValues = writeConvertedHistoryValues;
global.writeConvertedHistoryValuesSingleRow = writeConvertedHistoryValuesSingleRow;
global.writeExchangeRates = writeExchangeRates;
global.writeMarketcapValues = writeMarketcapValues;

global.BALANCE_HISTORY = BALANCE_HISTORY;
global.COVER_TRADES = COVER_TRADES;
global.EXCHANGE_RATE = EXCHANGE_RATE;
global.FIAT_CURRENCIES = FIAT_CURRENCIES;
global.WALLET_BALANCE_ANALYSIS = WALLET_BALANCE_ANALYSIS;
