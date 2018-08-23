import { ServiceHistory } from 'src/services/history';

export function writeConvertedHistoryValues() {
    const service = new ServiceHistory();
    service.convertValues(30);
}

export function writeConvertedHistoryValuesSingleRow() {
    const service = new ServiceHistory();
    service.convertValues(1);
}

export function resetConvertedHistoryValues() {
    const service = new ServiceHistory();
    service.clearConvertedValues();
}
