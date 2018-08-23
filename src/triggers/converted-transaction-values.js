import { ServiceTransactions } from 'src/services/transactions';

export function writeConvertedTransactionValues() {
    const service = new ServiceTransactions();
    service.convertValues(30);
}

export function writeConvertedTransactionValuesSingleRow() {
    const service = new ServiceTransactions();
    service.convertValues(1);
}

export function resetConvertedTransactionValues() {
    const service = new ServiceTransactions();
    service.clearConvertedValues();
}
