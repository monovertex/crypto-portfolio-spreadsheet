const PROPERTIES = [
    'date',
    'sellCoin', 'sellValue', 'sellAccount',
    'buyCoin', 'buyValue', 'buyAccount',
    'type', 'from', 'comment', 'transaction', 'address', 'market', 'exRate', 'month',
];

export class Transaction {
    constructor(dataRow) {
        PROPERTIES.forEach((propertyKey, index) => (this[propertyKey] = dataRow[index]));
    }
}
