export function addDays(input, days) {
    const output = new Date(input.getTime());
    output.setUTCDate(output.getDate() + days);
    output.setUTCHours(0, 0, 0, 0);
    return output;
}
