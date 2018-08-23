import { Transaction } from 'src/entities/transaction';
import { isUndefined, groupBy } from 'lodash';

export function COVER_TRADES(buyTrades, coveringTransactionsRaw) {
    const coveringTransactions = coveringTransactionsRaw
        .filter(([date]) => !isUndefined(date))
        .map((dataRow) => new Transaction(dataRow));
    const coveringTransactionsBySellCoin = groupBy(coveringTransactions, (transaction) => transaction.sellCoin);
    return buyTrades.map((buyTrade) => {
        const buyCoin = buyTrade[0];
        if (!buyCoin) { return; }
        return fillBuyTrade(buyTrade, coveringTransactionsBySellCoin[buyCoin]);
    });
}

function fillBuyTrade(buyTrade, sellTrades = []) {
    let coinBought = buyTrade[1];
    let coinSold = 0;
    let revenueCryptoBase = 0;
    let revenueCoreFiatBase = 0;
    let revenueFiatBase = 0;

    while (coinBought > 0 && sellTrades.length) {
        const currentSellTrade = sellTrades[0];
        const currentCryptoBaseRate = currentSellTrade.sellValueCryptoBase / currentSellTrade.sellValue;
        const currentCoreFiatBaseRate = currentSellTrade.sellValueCoreFiatBase / currentSellTrade.sellValue;
        const currentFiatBaseRate = currentSellTrade.sellValueFiatBase / currentSellTrade.sellValue;
        const currentCoinSold = Math.min(currentSellTrade.sellValue, coinBought);

        const currentSellValueCryptoBase = currentCoinSold * currentCryptoBaseRate;
        const currentSellValueCoreFiatBase = currentCoinSold * currentCoreFiatBaseRate;
        const currentSellValueFiatBase = currentCoinSold * currentFiatBaseRate;

        coinBought -= currentCoinSold;
        coinSold += currentCoinSold;
        revenueCryptoBase += currentSellValueCryptoBase;
        revenueCoreFiatBase += currentSellValueCoreFiatBase;
        revenueFiatBase += currentSellValueFiatBase;

        currentSellTrade.sellValue -= currentCoinSold;
        currentSellTrade.sellValueCryptoBase -= currentSellValueCryptoBase;
        currentSellTrade.sellValueCoreFiatBase -= currentSellValueCoreFiatBase;
        currentSellTrade.sellValueFiatBase -= currentSellValueFiatBase;

        if (currentSellTrade.sellValue <= 0) {
            sellTrades.shift();
        }
    }

    return [coinSold, revenueCryptoBase, revenueCoreFiatBase, revenueFiatBase];
}
