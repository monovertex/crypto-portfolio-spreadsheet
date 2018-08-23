import { SHEET_BALANCE_HISTORY } from 'src/constants';
import { Sheet } from 'src/entities/sheet';

export class HistorySheet extends Sheet {
    constructor() {
        super(SHEET_BALANCE_HISTORY);
    }

    writeConvertedValuesForRow(rowIndex, convertedValues) {
        this.sheetInstance.getRange(`D${rowIndex}:F${rowIndex}`).setValues([convertedValues]);
    }

    getLastUnconvertedRow() {
        const valueCryptoBaseColumn = this.getColumnData(4, 2);
        const valueFiatCoreBaseColumn = this.getColumnData(5, 2);
        const valueFiatBaseColumn = this.getColumnData(6, 2);

        for (const [index, value] of valueCryptoBaseColumn.entries()) {
            if (value === '' &&
                valueFiatCoreBaseColumn[index] === '' &&
                valueFiatBaseColumn[index] === '') {
                return index + 2;
            }
        }
    }

    clearConvertedValues() {
        this.sheetInstance.getRange('D2:F').clearContent();
    }
}
