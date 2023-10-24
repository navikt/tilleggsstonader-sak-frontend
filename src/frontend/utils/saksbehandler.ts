export interface Saksbehandler {
    groups: string[];
    name: string;
    navIdent: string;
}

export const hentInnloggetSaksbehandler = (
    settInnloggetSaksbehandler: (saksbehandler: Saksbehandler | undefined) => void
) => {
    settInnloggetSaksbehandler(undefined);
    fetch('/api/profile')
        .then((res) => {
            if (res.ok) {
                res.json().then((json) => settInnloggetSaksbehandler(json as Saksbehandler));
            } else {
                // eslint-disable-next-line no-console
                console.log('Feilet henting av profil', res.status);
            }
        })
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.log('Feilet henting av profil', err);
        });
};
