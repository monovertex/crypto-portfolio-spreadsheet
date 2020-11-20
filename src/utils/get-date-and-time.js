const DATE_AND_TIME_REGEX = /^(.+?)T(.+?)\..*?$/;

export function getDateAndTime(source) {
    const matches = DATE_AND_TIME_REGEX.exec(source.toISOString());
    return {
        date: matches[1],
        time: matches[2],
    };
}
