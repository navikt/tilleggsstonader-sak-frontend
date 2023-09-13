const replaceUnderscoreWithSpace = (str: string): string => {
    return str.replace('_', ' ');
};

const toTitleCase = (str: string): string =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

export const formaterEnumVerdi = (str: string): string =>
    replaceUnderscoreWithSpace(toTitleCase(str));
