export function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Operations')
        .addItem('Refresh exchange rates', 'writeExchangeRates')
        .addToUi();
}
