export function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Operations')
        .addItem('Convert transaction values', 'writeConvertedTransactionValues')
        .addItem('Convert transaction values (one row)', 'writeConvertedTransactionValuesSingleRow')
        .addItem('Reset converted transaction values', 'resetConvertedTransactionValues')
        .addSeparator()
        .addItem('Convert history values', 'writeConvertedHistoryValues')
        .addItem('Convert history values (one row)', 'writeConvertedHistoryValuesSingleRow')
        .addItem('Reset converted history values', 'resetConvertedHistoryValues')
        .addSeparator()
        .addItem('Refresh exchange rates', 'writeExchangeRates')
        .addToUi();
}
