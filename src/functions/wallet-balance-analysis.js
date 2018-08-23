export function WALLET_BALANCE_ANALYSIS(balances) {
    const processedData = processWalletBalances(balances);
    const matrix = buildWalletBalancesMatrix(processedData.currencies, processedData.wallets, processedData.balances);
    return matrix;
}

function processWalletBalances(balances) {
    const result = {};
    const currencies = {};
    const wallets = {};

    balances.forEach(function (balanceRow) {
        const wallet = balanceRow[0];
        const currency = balanceRow[1];
        const value = balanceRow[5];

        if (!wallet || !currency || !value || value < 0.00001) { return; }

        result[currency] = result[currency] || {};
        result[currency][wallet] = (result[currency][wallet] || 0) + value;

        currencies[currency] = (currencies[currency] || 0) + value;
        wallets[wallet] = (wallets[wallet] || 0) + value;
    });

    const sortedCurrencies = Object.keys(currencies).sort(function (a, b) { return currencies[b] - currencies[a]; });
    const sortedWallets = Object.keys(wallets).sort(function (a, b) { return wallets[b] - wallets[a]; });

    return {
        balances: result,
        currencies: sortedCurrencies,
        wallets: sortedWallets,
    };
}

function buildWalletBalancesMatrix(currencies, wallets, balances) {
    const result = [[''].concat(wallets)];

    currencies.forEach(function (currency) {
        const resultRow = [currency];

        wallets.forEach(function (wallet) {
            const value = getCurrencyWalletBalance(currency, wallet, balances);
            resultRow.push(value);
        });

        result.push(resultRow);
    });

    return result;
}

function getCurrencyWalletBalance(currency, wallet, balances) {
    if (!balances[currency]) { return 0; }
    if (!balances[currency][wallet]) { return 0; }
    return balances[currency][wallet];
}
