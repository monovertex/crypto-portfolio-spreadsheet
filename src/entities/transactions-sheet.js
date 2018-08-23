import { SHEET_TRANSACTIONS_PROCESSED } from 'src/constants';
import { Sheet } from 'src/entities/sheet';

export class TransactionsSheet extends Sheet {
    constructor() {
        super(SHEET_TRANSACTIONS_PROCESSED);
    }

    writeConvertedValuesForRow(rowIndex, convertedValues) {
        this.sheetInstance.getRange(`O${rowIndex}:T${rowIndex}`).setValues([convertedValues]);
    }

    getLastUnconvertedRow() {
        const buyAmountCryptoBaseColumn = this.getColumnData(15, 2);
        const sellAmountCryptoBaseColumn = this.getColumnData(16, 2);
        const buyAmountFiatCoreBaseColumn = this.getColumnData(17, 2);
        const sellAmountFiatCoreBaseColumn = this.getColumnData(18, 2);
        const buyAmountFiatBaseColumn = this.getColumnData(19, 2);
        const sellAmountFiatBaseColumn = this.getColumnData(20, 2);

        for (const [index, value] of buyAmountCryptoBaseColumn.entries()) {
            if (value === '' &&
                sellAmountCryptoBaseColumn[index] === '' &&
                buyAmountFiatBaseColumn[index] === '' &&
                sellAmountFiatBaseColumn[index] === '' &&
                buyAmountFiatCoreBaseColumn[index] === '' &&
                sellAmountFiatCoreBaseColumn[index] === '') {
                return index + 2;
            }
        }
    }

    clearConvertedValues() {
        this.sheetInstance.getRange('O2:T').clearContent();
    }
}
