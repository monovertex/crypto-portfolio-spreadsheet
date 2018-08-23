import { ServiceAbstract } from 'src/services/abstract';
import { isUndefined, range } from 'lodash';

export class ServiceAbstractConvertedValues extends ServiceAbstract {
    get _targetSheet() {
        throw new Error('Not implemented');
    }

    convertValues(count) {
        const startRowIndex = this._targetSheet.getLastUnconvertedRow();
        const lastRowIndex = this._targetSheet.sheetInstance.getLastRow();
        if (startRowIndex > lastRowIndex || isUndefined(startRowIndex)) { return; }
        range(count).forEach((offset) => {
            const rowIndex = startRowIndex + offset;
            if (rowIndex > lastRowIndex) { return; }
            this._convertValuesForRow(rowIndex);
        });
    }

    clearConvertedValues() {
        this._targetSheet.clearConvertedValues();
    }

    _convertValuesForRow(rowIndex) {
        const dataRow = this._targetSheet.getRowData(rowIndex);
        this._getConvertedValuesForDataRow(dataRow);
        // this._targetSheet.writeConvertedValuesForRow(rowIndex, convertedValues);
    }

    _getConvertedValuesForDataRow() {
        throw new Error('Not implemented');
    }
}
