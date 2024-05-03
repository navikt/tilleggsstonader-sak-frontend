export const harIkkeVerdi = (str: string | undefined | null): boolean => !harVerdi(str);

export const harVerdi = (str: string | undefined | null): str is string =>
    !!str && str.trim() !== '';

export const fjernSpaces = (str: string) => str.replace(/ /g, '');

export const åpneFilIEgenTab = (
    journalpostId: string,
    dokumentinfoId: string,
    filnavn: string
): void => {
    const newWindow = window.open(
        `/dokument/journalpost/${journalpostId}/dokument-pdf/${dokumentinfoId}`,
        '_blank'
    );
    setTimeout(function () {
        if (newWindow) {
            newWindow.document.title = filnavn;
        }
    }, 500);
};
