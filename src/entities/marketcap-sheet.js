import { SHEET_MARKETCAP } from 'src/constants';
import { Sheet } from 'src/entities/sheet';
import { ServiceMarketcap } from 'src/services/marketcap';

export class MarketcapSheet extends Sheet {
    constructor() {
        super(SHEET_MARKETCAP);
        this._marketcapService = new ServiceMarketcap();
    }

    writeMarketcapValues() {
        const values = this._marketcapService.fetchValues();
        this.sheetInstance.getRange(2, 1, values.length, values[0].length).setValues(values);
    }
}
