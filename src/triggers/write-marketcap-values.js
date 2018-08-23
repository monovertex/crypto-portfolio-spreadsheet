import { MarketcapSheet } from 'src/entities/marketcap-sheet';

export function writeMarketcapValues() {
    const sheet = new MarketcapSheet();
    sheet.writeMarketcapValues();
}
