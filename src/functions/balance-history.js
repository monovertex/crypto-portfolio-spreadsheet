import { addDays } from 'src/utils/add-days';
import { isUndefined } from 'lodash';

export function BALANCE_HISTORY(rawBalances, startDay, endDay) {
    const processedBalances = processBalances(rawBalances);
    const rollingBalances = calculateRollingBalances(processedBalances);
    return buildBalanceHistory(rollingBalances, startDay, endDay);
}

function processBalances(rawBalances) {
    return rawBalances.reduce((accumulator, balance) => {
        const [date, currency, value] = balance;
        if (!date || !currency) { return accumulator; }

        const timestamp = String(date.getTime());
        accumulator[timestamp] = accumulator[timestamp] || {};
        accumulator[timestamp][currency] = value;
        return accumulator;
    }, {});
}

function calculateRollingBalances(balances) {
    let previousRow = {};
    const currencies = new Set();

    const balancesKeys = Object.keys(balances).sort(
        (a, b) => parseInt(a, 10) - parseInt(b, 10));

    return balancesKeys.reduce((accumulator, timestamp) => {
        const currentRow = {};
        const currentBalance = balances[String(timestamp)];
        Object.keys(currentBalance).forEach((currency) => currencies.add(currency));

        currencies.forEach((currency) => {
            const previousValue = previousRow[currency] || 0;
            const currentValue = currentBalance[currency] || 0;
            currentRow[currency] = previousValue + currentValue;
        });

        accumulator[timestamp] = currentRow;
        previousRow = currentRow;
        return accumulator;
    }, {});
}

function buildBalanceHistory(rollingBalances, startDay, endDay) {
    const dayTimestamps = getConsecutiveDays(startDay, endDay);
    const currencies = new Set();
    let previousBalance = {};

    return dayTimestamps.reduce((result, dayTimestamp) => {
        const currentBalance = rollingBalances[dayTimestamp];
        const hasCurrentBalance = !isUndefined(currentBalance);
        const hasPreviousBalance = !isUndefined(previousBalance);
        if (!hasCurrentBalance && !hasPreviousBalance) { return result; }

        if (hasCurrentBalance) {
            Object.keys(currentBalance).forEach((currency) => currencies.add(currency));
        }

        const currentDate = new Date(parseInt(dayTimestamp, 10));
        currencies.forEach((currency) => {
            const currentValue = hasCurrentBalance ? currentBalance[currency] : undefined;
            const previousValue = hasPreviousBalance ? previousBalance[currency] : undefined;
            const actualValue = isUndefined(currentValue)
                ? (isUndefined(previousValue) ? 0 : previousValue)
                : currentValue;

            if (!actualValue || actualValue < 0.000000005) { return; }
            result.push([currentDate, currency, actualValue]);
        });

        if (hasCurrentBalance) { previousBalance = currentBalance; }
        return result;
    }, []);
}

function getConsecutiveDays(startDay, endDay) {
    const days = [];
    let currentDay = new Date(startDay.getTime());
    while (currentDay <= endDay) {
        days.push(String(currentDay.getTime()));
        currentDay = addDays(currentDay, 1);
    }

    return days;
}
