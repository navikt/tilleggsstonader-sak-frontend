export const classNames = (classes: Array<string | undefined | null | false>) =>
    classes.filter(Boolean).join(' ');
