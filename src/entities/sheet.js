import { memoized } from 'src/decorators/memoized';

export class Sheet {
    constructor(sheetName) {
        this.sheetName = sheetName;
    }

    @memoized
    get sheetInstance() {
        const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        return activeSpreadsheet.getSheetByName(this.sheetName);
    }

    insertColumnAtEnd() {
        const lastColumn = this.sheetInstance.getLastColumn();
        this.sheetInstance.insertColumnAfter(lastColumn);
        return lastColumn + 1;
    }

    insertRowAtEnd() {
        const lastRow = this.sheetInstance.getLastRow();
        this.sheetInstance.insertRowAfter(lastRow);
        return lastRow + 1;
    }

    getColumnData(column, row = 1) {
        const sheet = this.sheetInstance;
        const rowCount = sheet.getLastRow();
        const data = sheet.getRange(row, column, rowCount - row + 1, 1).getValues();
        const results = data.map((item) => item[0]);
        return results;
    }

    getRowData(row, column = 1) {
        const sheet = this.sheetInstance;
        const columnCount = sheet.getLastColumn();
        const data = sheet.getRange(row, column, 1, columnCount - column + 1).getValues();
        const [results] = data;
        return results;
    }

    getCellValue(rowIndex, columnIndex) {
        return this.sheetInstance.getRange(rowIndex, columnIndex).getValue();
    }

    writeCellValue(value, rowIndex, columnIndex) {
        return this.sheetInstance.getRange(rowIndex, columnIndex).setValue(value);
    }

    findInColumn(value, columnIndex, startRowIndex = 1) {
        const values = this.getColumnData(columnIndex, startRowIndex);
        const index = values.indexOf(value);
        return (index === -1 ? null : index + 1);
    }

    findInRow(value, rowIndex, startColumnIndex = 1) {
        const values = this.getRowData(rowIndex, startColumnIndex);
        const index = values.indexOf(value);
        return (index === -1 ? null : index + 1);
    }
}
