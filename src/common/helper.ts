
export function omit(obj: any, ...props: any[]) {
    const result = { ...obj };
    props.forEach(function(prop) {
      delete result[prop];
    });
    return result;
};

export function makeid(length: number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

export function isDate24HoursOrOlder(then: Date) {
    const now = new Date();
    const msBetweenDates = Math.abs(then.getTime() - now.getTime());
    // convert ms to hours  (min  sec   ms)
    const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);
    return (hoursBetweenDates >= 24);
}

  