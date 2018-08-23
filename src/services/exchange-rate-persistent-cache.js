import { ServiceAbstract } from 'src/services/abstract';
import { SHEET_EXCHANGE_RATES_CACHE } from 'src/constants';
import { Sheet } from 'src/entities/sheet';
import { isUndefined } from 'lodash';

export class ServiceExchangeRatePersistentCache extends ServiceAbstract {
    constructor() {
        super(...arguments);
        this._sheet = new Sheet(SHEET_EXCHANGE_RATES_CACHE);
    }

    readValue(symbol, timestamp) {
        const rowIndex = this._getCacheRowIndex(symbol, timestamp);
        if (isUndefined(rowIndex)) { return; }
        return this._sheet.getCellValue(rowIndex, 4);
    }

    writeValue(symbol, timestamp, value) {
        // let rowIndex = this._getCacheRowIndex(symbol, timestamp);
        // if (isUndefined(rowIndex)) {
        //     rowIndex = this._sheet.insertRowAtEnd();
        // }
        const rowIndex = this._sheet.insertRowAtEnd();
        const cacheRow = [[this._cacheKey(symbol, timestamp), new Date(timestamp), symbol, value]];
        this._sheet.sheetInstance.getRange(rowIndex, 1, 1, cacheRow[0].length).setValues(cacheRow);
    }

    _getCacheRowIndex(symbol, timestamp) {
        const keys = this._sheet.getColumnData(1);
        const cacheKey = this._cacheKey(symbol, timestamp);
        const keyIndex = keys.indexOf(cacheKey);
        if (keyIndex === -1) { return; }
        return keyIndex + 1;
    }

    _cacheKey(symbol, timestamp) {
        return `${timestamp}___${symbol}`;
    }
}
