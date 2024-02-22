export const erDesimaltall = (verdi: number) => {
    return verdi % 1 !== 0;
};

const erPågåendeDesimaltall = (verdi: string) => {
    return (
        (verdi.indexOf(',') > 0 && verdi.indexOf(',') == verdi.length - 1) ||
        (verdi.indexOf('.') > 0 && verdi.indexOf('.') == verdi.length - 1)
    );
};

export const tilTallverdi = (verdi: number | string | undefined): number | undefined | string => {
    if (verdi === '' || verdi === undefined || verdi === null) {
        return undefined;
    }
    if (typeof verdi === 'string') {
        if (erPågåendeDesimaltall(verdi)) {
            return verdi;
        }
        const formatertVerdi = Number(verdi.replace(/\s/g, '').replace(/,/g, '.'));
        return isNaN(formatertVerdi) ? verdi : formatertVerdi;
    }
    return Number(verdi);
};

export const tilHeltall = (verdi: number | string | undefined): number | undefined => {
    if (!verdi) {
        return undefined;
    }
    if (typeof verdi === 'string') {
        return isNaN(parseInt(verdi)) ? undefined : parseInt(verdi);
    }
    return verdi;
};

export const harTallverdi = (verdi: number | undefined | null | string): verdi is number =>
    verdi !== undefined && verdi !== null;
