import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useCallback, useState } from 'react';
import { IPersonopplysninger } from '../typer/personopplysninger';
import { personopplysningerStub } from '../api/klage-stubs';

// export const useHentPersonopplysninger = (
//     behandlingId: string
// ): {
//     hentPersonopplysninger: (behandlingsid: string) => void;
//     personopplysningerResponse: Ressurs<IPersonopplysninger>;
// } => {
//     // const { axiosRequest } = useApp();
//     const [personopplysningerResponse, settPersonopplysningerResponse] =
//         useState<Ressurs<IPersonopplysninger>>(byggTomRessurs());
//
//     const hentPersonopplysninger = useCallback(() => {
//         settPersonopplysningerResponse(byggHenterRessurs());
//         axiosRequest<IPersonopplysninger, { behandlingId: string }>({
//             method: 'GET',
//             url: `/familie-klage/api/personopplysninger/${behandlingId}`,
//         }).then((res) => {
//             settPersonopplysningerResponse(res);
//         });
//     }, [axiosRequest, behandlingId]);
//
//     return {
//         hentPersonopplysninger,
//         personopplysningerResponse,
//     };
// };

// TODO: Fjern alt under her, det er for mocking av endepunkt før vi får det på plass i backend
export const useHentPersonopplysninger = (
    behandlingId: string
): {
    hentPersonopplysninger: (behandlingsid: string) => void;
    personopplysningerResponse: Ressurs<IPersonopplysninger>;
} => {
    const [personopplysningerResponse, settPersonopplysningerResponse] =
        useState<Ressurs<IPersonopplysninger>>(byggTomRessurs());

    const hentPersonopplysninger = () => {
        settPersonopplysningerResponse({
            status: RessursStatus.SUKSESS,
            data: personopplysningerStub,
        });
    };

    return {
        hentPersonopplysninger,
        personopplysningerResponse,
    };
};
