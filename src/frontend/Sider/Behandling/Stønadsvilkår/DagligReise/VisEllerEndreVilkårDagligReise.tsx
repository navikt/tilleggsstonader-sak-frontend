import React, { FC, useState } from 'react';

import { EndreVilkårDagligReise } from './EndreVilkår/EndreVilkårDagligReise';
import { initierSvar } from './EndreVilkår/utils';
import LesevisningVilkårDagligReise from './Lesevisning/LesevisningVilkårDagligReise';
import { SplittVilkårDagligReiseModal } from './Lesevisning/SplittVilkårDagligReiseModal';
import { FaktaDagligReise } from './typer/faktaDagligReise';
import { SvarVilkårDagligReise, VilkårDagligReise } from './typer/vilkårDagligReise';
import { useSteg } from '../../../../context/StegContext';
import { useVilkårDagligReise } from '../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import { Feil, feiletRessursTilFeilmelding } from '../../../../komponenter/Feil/feilmeldingUtils';
import { RessursStatus } from '../../../../typer/ressurs';
import { dagenFør } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { PeriodeStatus } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

interface Props {
    vilkår: VilkårDagligReise;
    redigerer: boolean;
    redigererAnnetVilkår: boolean;
    startRedigering: () => boolean;
    avsluttRedigering: () => void;
    startKopiering: (vilkår: VilkårDagligReise, kopidato: string) => void;
}

export const VisEllerEndreVilkårDagligReise: FC<Props> = ({
    vilkår,
    redigerer,
    redigererAnnetVilkår,
    startRedigering,
    avsluttRedigering,
    startKopiering,
}) => {
    const { erStegRedigerbart } = useSteg();
    const { oppdaterVilkår } = useVilkårDagligReise();

    const [visSplittModal, settVisSplittModal] = useState<boolean>(false);
    const [lasterOppdatering, settLasterOppdatering] = useState<boolean>(false);
    const [kopieringFeil, settKopieringFeil] = useState<Feil | undefined>(undefined);
    const [feilmeldingRedigering, settFeilmeldingRedigering] = useState<string | undefined>(
        undefined
    );

    const handleStartRedigering = () => {
        const kanStarte = startRedigering();
        if (!kanStarte) {
            settFeilmeldingRedigering(
                'Ferdigstill redigering av annet vilkår før du starter ny redigering'
            );
        }
    };

    const handleStartKopiering = () => {
        if (redigererAnnetVilkår) {
            settFeilmeldingRedigering(
                'Ferdigstill redigering av annet vilkår før du starter ny redigering'
            );
        } else {
            settVisSplittModal(true);
        }
    };

    const nullstillFeilmeldingRedigering = () => {
        settFeilmeldingRedigering(undefined);
    };

    const skalViseRedigeringsknapp = erStegRedigerbart && vilkår.status !== PeriodeStatus.SLETTET;

    const lagre = async (
        periode: Periode,
        adresse: string | undefined,
        reiseId: string,
        svar: SvarVilkårDagligReise,
        fakta: FaktaDagligReise
    ) => {
        return await oppdaterVilkår(vilkår.id, {
            fom: periode.fom,
            tom: periode.tom,
            adresse: adresse || '',
            reiseId: reiseId,
            svar: svar,
            fakta: fakta,
        });
    };

    const handleBekreftKopiering = async (kopidato: string) => {
        settLasterOppdatering(true);
        settKopieringFeil(undefined);

        // Sjekk om kopidato er innenfor eksisterende periode (og ikke lik fom)
        if (kopidato > vilkår.fom! && kopidato <= vilkår.tom!) {
            // Oppdater eksisterende vilkår med tom = kopidato - 1 dag
            const nyTomDato = dagenFør(kopidato);
            const respons = await lagre(
                { fom: vilkår.fom || '', tom: nyTomDato },
                vilkår.adresse,
                vilkår.reiseId,
                initierSvar(vilkår),
                vilkår.fakta
            );

            settLasterOppdatering(false);

            if (respons.status === RessursStatus.SUKSESS) {
                settVisSplittModal(false);
                settKopieringFeil(undefined);
                startKopiering(vilkår, kopidato);
            } else {
                settKopieringFeil(
                    feiletRessursTilFeilmelding(respons, 'Kunne ikke oppdatere eksisterende vilkår')
                );
            }
        } else {
            // kopidato <= fom eller kopidato > tom: Ikke oppdater eksisterende vilkår
            settLasterOppdatering(false);
            settVisSplittModal(false);
            settKopieringFeil(undefined);
            startKopiering(vilkår, kopidato);
        }
    };

    const handleLukkModal = () => {
        settVisSplittModal(false);
        settKopieringFeil(undefined);
    };

    return (
        <>
            <SplittVilkårDagligReiseModal
                visModal={visSplittModal}
                onClose={handleLukkModal}
                onBekreft={handleBekreftKopiering}
                eksisterendeFom={vilkår.fom!} // Vilkår har alltid fom/tom-dato for daglig reise
                eksisterendeTom={vilkår.tom!}
                laster={lasterOppdatering}
                feilmelding={kopieringFeil}
            />
            {erStegRedigerbart && redigerer ? (
                <EndreVilkårDagligReise
                    vilkår={vilkår}
                    lagre={lagre}
                    avsluttRedigering={avsluttRedigering}
                />
            ) : (
                <LesevisningVilkårDagligReise
                    vilkår={vilkår}
                    skalViseRedigeringsknapp={skalViseRedigeringsknapp}
                    startRedigering={handleStartRedigering}
                    startKopiering={handleStartKopiering}
                    feilmeldingRedigering={feilmeldingRedigering}
                    nullstillFeilmeldingRedigering={nullstillFeilmeldingRedigering}
                />
            )}
        </>
    );
};
