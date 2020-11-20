import { DeltaTransaction } from 'src/entities/delta-transaction';
import { Transaction } from 'src/entities/transaction';
import { isUndefined } from 'lodash';

export function CONVERT_TO_DELTA_FORMAT(rawTransactions) {
    const transactions = rawTransactions.map((data) => new Transaction(data));
    const transactionsWithFees = groupFeesWithTransactions(transactions);
    return transactionsWithFees.map(({ transaction, fees }) => {
        const deltaTransaction = new DeltaTransaction(transaction, fees);
        return deltaTransaction.getFormattedDataRow();
    });
}

function groupFeesWithTransactions(transactions) {
    let previousTransaction;
    return transactions.reduce((result, transaction) => {
        const isFee = transaction.type === 'Fee';
        if (isFee && isUndefined(previousTransaction)) { return result; }
        if (isFee) {
            previousTransaction.fees.push(transaction);
        } else {
            const currentTransaction = { transaction, fees: [] };
            result.push(currentTransaction);
            previousTransaction = currentTransaction;
        }
        return result;
    }, []);
}
