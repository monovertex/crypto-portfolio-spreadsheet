import { Sheet } from 'src/entities/sheet';
import { range as _range } from 'lodash';

const SpreadsheetApp = global.SpreadsheetApp;

afterEach(() => {
    global.SpreadsheetApp = SpreadsheetApp;
});

function setup() {
    const sheetInstance = {};
    const activeSpreadsheet = { getSheetByName: jest.fn().mockReturnValue(sheetInstance) };
    global.SpreadsheetApp = { getActiveSpreadsheet: () => activeSpreadsheet };
    return { sheetInstance, activeSpreadsheet };
}

it('properly retrieves the sheet instance when accessing the sheetInstance property', () => {
    const { activeSpreadsheet, sheetInstance } = setup();
    const sheet = new Sheet('some-sheet');
    let retrievedSheetInstance = sheet.sheetInstance;
    expect(retrievedSheetInstance).toBe(sheetInstance);
    expect(activeSpreadsheet.getSheetByName).toHaveBeenCalledWith('some-sheet');
});

it('will retrieve the instance once and cache it when accessing the sheetInstance property multiple times ', () => {
    const { activeSpreadsheet, sheetInstance } = setup();
    const sheet = new Sheet('some-sheet');
    let retrievedSheetInstance = sheet.sheetInstance;
    expect(retrievedSheetInstance).toBe(sheetInstance);

    retrievedSheetInstance = sheet.sheetInstance;
    expect(retrievedSheetInstance).toBe(sheetInstance);

    retrievedSheetInstance = sheet.sheetInstance;
    expect(retrievedSheetInstance).toBe(sheetInstance);

    expect(activeSpreadsheet.getSheetByName).toHaveBeenCalledWith('some-sheet');
    expect(activeSpreadsheet.getSheetByName.mock.calls.length).toBe(1);
});

it('will properly insert the column in the sheet instance when calling "insertColumnAtEnd"', () => {
    const { sheetInstance } = setup();
    const sheet = new Sheet();
    sheetInstance.getLastColumn = jest.fn().mockReturnValue(10);
    sheetInstance.insertColumnAfter = jest.fn();

    const newIndex = sheet.insertColumnAtEnd();
    expect(sheetInstance.getLastColumn).toHaveBeenCalled();
    expect(sheetInstance.insertColumnAfter).toHaveBeenCalledWith(10);
    expect(newIndex).toBe(11);
});

it('will properly insert the row in the sheet instance when calling "insertRowAtEnd"', () => {
    const { sheetInstance } = setup();
    const sheet = new Sheet();
    sheetInstance.getLastRow = jest.fn().mockReturnValue(10);
    sheetInstance.insertRowAfter = jest.fn();

    const newIndex = sheet.insertRowAtEnd();
    expect(sheetInstance.getLastRow).toHaveBeenCalled();
    expect(sheetInstance.insertRowAfter).toHaveBeenCalledWith(10);
    expect(newIndex).toBe(11);
});

it('will properly retrieve the value when calling "getCellValue"', () => {
    const { sheetInstance } = setup();
    const sheet = new Sheet();
    const range = { getValue: jest.fn().mockReturnValue(200) };
    sheetInstance.getRange = jest.fn().mockReturnValue(range);

    const value = sheet.getCellValue(5, 10);
    expect(sheetInstance.getRange).toHaveBeenCalledWith(5, 10);
    expect(range.getValue).toHaveBeenCalled();
    expect(value).toBe(200);
});

it('will properly set the value when calling "writeCellValue"', () => {
    const { sheetInstance } = setup();
    const sheet = new Sheet();
    const range = { setValue: jest.fn() };
    sheetInstance.getRange = jest.fn().mockReturnValue(range);

    sheet.writeCellValue(300, 5, 10);
    expect(sheetInstance.getRange).toHaveBeenCalledWith(5, 10);
    expect(range.setValue).toHaveBeenCalledWith(300);
});

it('properly fetches values from a column with "getColumnData"', () => {
    const { sheetInstance } = setup();
    const sheet = new Sheet();
    const range = { getValues: jest.fn().mockReturnValue(_range(5).map((index) => [index])) };

    sheetInstance.getLastRow = jest.fn().mockReturnValue(5);
    sheetInstance.getRange = jest.fn().mockReturnValue(range);

    const values = sheet.getColumnData(10, 2);
    expect(sheetInstance.getLastRow).toHaveBeenCalled();
    expect(sheetInstance.getRange).toHaveBeenCalledWith(2, 10, 5, 1);
    expect(range.getValues).toHaveBeenCalled();
    expect(values).toEqual([0, 1, 2, 3, 4]);
});

it('fetches data starting from row 1 by default with "getColumnData"', () => {
    const { sheetInstance } = setup();
    const sheet = new Sheet();
    const range = { getValues: jest.fn().mockReturnValue(_range(5).map((index) => [index])) };

    sheetInstance.getLastRow = jest.fn().mockReturnValue(5);
    sheetInstance.getRange = jest.fn().mockReturnValue(range);

    sheet.getColumnData(10);
    expect(sheetInstance.getRange).toHaveBeenCalledWith(1, 10, 5, 1);
});

it('properly fetches values from a row with "getRowData"', () => {
    const { sheetInstance } = setup();
    const sheet = new Sheet();
    const range = { getValues: jest.fn().mockReturnValue([_range(5).map((index) => index)]) };

    sheetInstance.getLastColumn = jest.fn().mockReturnValue(5);
    sheetInstance.getRange = jest.fn().mockReturnValue(range);

    const values = sheet.getRowData(10, 2);
    expect(sheetInstance.getLastColumn).toHaveBeenCalled();
    expect(sheetInstance.getRange).toHaveBeenCalledWith(10, 2, 1, 5);
    expect(range.getValues).toHaveBeenCalled();
    expect(values).toEqual([0, 1, 2, 3, 4]);
});

it('fetches data starting from column 1 by default with "getRowData"', () => {
    const { sheetInstance } = setup();
    const sheet = new Sheet();
    const range = { getValues: jest.fn().mockReturnValue([_range(5).map((index) => index)]) };

    sheetInstance.getLastColumn = jest.fn().mockReturnValue(5);
    sheetInstance.getRange = jest.fn().mockReturnValue(range);

    sheet.getRowData(10);
    expect(sheetInstance.getRange).toHaveBeenCalledWith(10, 1, 1, 5);
});

it('finds the index of a value when searched with "findInColumn"', () => {
    setup();
    const sheet = new Sheet();
    sheet.getColumnData = jest.fn().mockReturnValue(_range(5));

    const index = sheet.findInColumn(3, 1, 1);
    expect(sheet.getColumnData).toHaveBeenCalledWith(1, 1);
    expect(index).toEqual(4);
});

it('starts searching data from row 1 by default with "findInColumn"', () => {
    setup();
    const sheet = new Sheet();
    sheet.getColumnData = jest.fn().mockReturnValue(_range(5));

    sheet.findInColumn(3, 1);
    expect(sheet.getColumnData).toHaveBeenCalledWith(1, 1);
});

it('returns null when not finding the searched value with "findInColumn"', () => {
    setup();
    const sheet = new Sheet();
    sheet.getColumnData = jest.fn().mockReturnValue(_range(5));

    const index = sheet.findInColumn(6, 1, 1);
    expect(sheet.getColumnData).toHaveBeenCalledWith(1, 1);
    expect(index).toEqual(null);
});

it('finds the index of a value when searched with "findInRow"', () => {
    setup();
    const sheet = new Sheet();
    sheet.getRowData = jest.fn().mockReturnValue(_range(5));

    const index = sheet.findInRow(3, 1, 1);
    expect(sheet.getRowData).toHaveBeenCalledWith(1, 1);
    expect(index).toEqual(4);
});

it('starts searching data from column 1 by default with "findInRow"', () => {
    setup();
    const sheet = new Sheet();
    sheet.getRowData = jest.fn().mockReturnValue(_range(5));

    sheet.findInRow(3, 1);
    expect(sheet.getRowData).toHaveBeenCalledWith(1, 1);
});

it('returns null when not finding the searched value with "findInRow"', () => {
    setup();
    const sheet = new Sheet();
    sheet.getRowData = jest.fn().mockReturnValue(_range(5));

    const index = sheet.findInRow(6, 1, 1);
    expect(sheet.getRowData).toHaveBeenCalledWith(1, 1);
    expect(index).toEqual(null);
});
