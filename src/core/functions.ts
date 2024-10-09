function removeControlCharacters(str: string) {
    return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
}

function convertToCronTime(time: number, timezone: string) {
    // set timezone 
    const preDate = new Date(time);
    const date = changeTimezone(preDate, timezone);
  
    // Ensure proper formatting for day and month values
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adjust for 0-based month index

    // Format the time string with leading zeros for consistency
    const hour = preDate.toISOString().split("T")[1].split(":")[0];
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${minutes} ${hour} ${day} ${month} *`;
}

function changeTimezone(date: Date, ianatz: string) {
    // suppose the date is 12:00 UTC
    var invdate = new Date(date.toLocaleString('en-US', {
      timeZone: ianatz
    }));
  
    // then invdate will be 07:00 in Toronto
    // and the diff is 5 hours
    var diff = date.getTime() - invdate.getTime();
  
    // so 12:00 in Toronto is 17:00 UTC
    return new Date(date.getTime() - diff); // needs to substract
}
  
export { removeControlCharacters, convertToCronTime };