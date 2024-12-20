import { useApp } from '../../../context/AppContext';
import { usePersonopplysninger } from '../../../context/PersonopplysningerContext';
import { RessursStatus } from '../../../typer/ressurs';
import { erProd } from '../../../utils/miljø';

interface Request {
    fnr: string;
}

/**
 * Returner en temporær kode for å kunne lenke till bruker uten å bruke ident i url
 */
interface Response {
    code: string;
}

export const useGenererModiaLenke = () => {
    const { request } = useApp();
    const { personopplysninger } = usePersonopplysninger();
    const envUrl = erProd() ? '.' : '.dev.';
    const urlModiaPersonoversikt = `https://modiapersonoversikt.intern${envUrl}nav.no`;

    const genererModiaLenke = async () => {
        try {
            const response = await request<Response, Request>('/api/generer-lenke-modia', 'POST', {
                fnr: personopplysninger.personIdent,
            });
            if (response.status === RessursStatus.SUKSESS) {
                return `${urlModiaPersonoversikt}/person?sokFnrCode=${response.data.code}`;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // kaster feil etterpå
        }
        throw Error('Feilet generering av lenke');
    };
    return {
        genererModiaLenke,
    };
};
