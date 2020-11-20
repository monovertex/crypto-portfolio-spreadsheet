import { Transaction } from 'src/entities/transaction';
import { getDateAndTime } from 'src/utils/get-date-and-time';

export class DeltaTransaction {
    constructor(source, fees = []) {
        this._transaction = source instanceof Transaction ? source : new Transaction(source);
        this._fees = fees;
    }

    getFormattedDataRow() {
        return [
            this.date,
            this.type,
            this.exchange,
            this.baseAmount,
            this.baseCurrency,
            this.quoteAmount,
            this.quoteCurrency,
            this.feeAmount,
            this.feeCurrency,
            null, // ICO costs, not used.
            null, // ICO currency, not used.
            1, // Always deduct holdings.
            this.sentFrom,
            this.sentTo,
            this.notes,
        ];
    }

    get date() {
        const { date, time } = getDateAndTime(this._transaction.date);
        return `${date} ${time}`;
    }

    get type() {
        const type = this._transaction.type;
        switch (type) {
            case 'Buy': return 'BUY';
            case 'Sell': return 'SELL';
            case 'Fiat':
            case 'Transaction':
                if (this._transaction.sellCoin && this._transaction.buyCoin) { return 'TRANSFER'; }
                if (this._transaction.sellCoin) { return 'WITHDRAW'; }
                return 'DEPOSIT';
        }
        return 'TRANSFER';
    }

    get exchangeRaw() {
        if (this._transaction.from) { return ''; }
        switch (this.type) {
            case 'BUY':
            case 'DEPOSIT': return this._transaction.buyAccount;
            case 'SELL': return this._transaction.sellAccount;
        }
        return '';
    }

    get exchange() {
        return this._processExchange(this.exchangeRaw);
    }

    get baseAmount() {
        switch (this.type) {
            case 'BUY':
            case 'DEPOSIT': return this._transaction.buyValue;
            case 'SELL':
            case 'WITHDRAW': return this._transaction.sellValue;
        }
        return this._transaction.buyValue;
    }

    get baseCurrency() {
        switch (this.type) {
            case 'BUY':
            case 'DEPOSIT': return this._transaction.buyCoin;
            case 'SELL':
            case 'WITHDRAW': return this._transaction.sellCoin;
        }
        return this._transaction.buyCoin;
    }

    get quoteAmount() {
        switch (this.type) {
            case 'BUY':
            case 'DEPOSIT': return this._transaction.sellValue;
            case 'SELL':
            case 'WITHDRAW': return this._transaction.buyValue;
        }
        return '';
    }

    get quoteCurrency() {
        switch (this.type) {
            case 'BUY':
            case 'DEPOSIT': return this._transaction.sellCoin;
            case 'SELL':
            case 'WITHDRAW': return this._transaction.buyCoin;
        }
        return '';
    }

    get feeAmount() {
        if (this._fees.length < 1) { return null; }
        return this._fees[0].sellValue;
    }

    get feeCurrency() {
        if (this._fees.length < 1) { return null; }
        return this._fees[0].sellCoin;
    }

    get sentFromRaw() {
        if (this._transaction.from) { return this._transaction.from; }
        switch (this.type) {
            case 'TRANSFER':
            case 'WITHDRAW': return this._transaction.sellAccount;
        }
        return '';
    }

    get sentFrom() {
        return this._processLocation(this.sentFromRaw);
    }

    get sentToRaw() {
        if (this._transaction.from) { return this._transaction.buyAccount; }
        switch (this.type) {
            case 'TRANSFER':
            case 'WITHDRAW': return this._transaction.buyAccount || 'OTHER';
        }
        return '';
    }

    get sentTo() {
        return this._processLocation(this.sentToRaw);
    }

    get notes() {
        const notes = [];
        if (this._transaction.comment) { notes.push(`Comment: ${this._transaction.comment}`); }
        if (this._transaction.transaction) { notes.push(`Transaction: ${this._transaction.transaction}`); }
        if (this._transaction.address) { notes.push(`Address: ${this._transaction.address}`); }
        return notes.join('; ');
    }

    _processLocation(raw) {
        switch (raw) {
            case 'Wallet':
            case 'Activation':
            case 'Abra': return 'MY_WALLET';
            case 'Gate.io': return 'Gateio';
        }
        if (raw) { return raw.toUpperCase(); }
        return raw;
    }

    _processExchange(raw) {
        switch (raw) {
            case 'Abra': return '';
            case 'Wallet': return '';
            case 'Gate.io': return 'Gateio';
        }
        return raw;
    }
}
