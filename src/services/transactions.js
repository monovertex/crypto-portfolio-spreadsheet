import { ServiceAbstractConvertedValues } from 'src/services/abstract-converted-values';
import { Transaction } from 'src/entities/transaction';
import { TransactionsSheet } from 'src/entities/transactions-sheet';
import { memoized } from 'src/decorators/memoized';

export class ServiceTransactions extends ServiceAbstractConvertedValues {
    @memoized
    get _targetSheet() {
        return new TransactionsSheet();
    }

    _getConvertedValuesForDataRow(dataRow) {
        const transaction = new Transaction(dataRow);
        transaction.convertValues();
        return [
            transaction.sellValueCryptoBase,
            transaction.buyValueCryptoBase,
            transaction.sellValueFiatCoreBase,
            transaction.buyValueFiatCoreBase,
            transaction.sellValueFiatBase,
            transaction.buyValueFiatBase,
        ];
    }
}
