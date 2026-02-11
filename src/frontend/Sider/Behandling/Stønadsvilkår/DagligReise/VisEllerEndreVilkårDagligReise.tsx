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
    startKopiering: (vilkår: VilkårDagligReise) => void;
    startSplitting: (vilkår: VilkårDagligReise, splittdato: string) => void;
}

export const VisEllerEndreVilkårDagligReise: FC<Props> = ({
    vilkår,
    startKopiering,
    startSplitting,
}) => {
    const { erStegRedigerbart } = useSteg();
    const { oppdaterVilkår } = useVilkårDagligReise();

    const [redigerer, settRedigerer] = useState<boolean>(false);
    const [visSplittModal, settVisSplittModal] = useState<boolean>(false);
    const [lasterSplitt, settSplitterEksisterendeVilkår] = useState<boolean>(false);
    const [splittFeil, settSplittFeil] = useState<Feil | undefined>(undefined);

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

    const handleBekreftSplitt = async (splittdato: string) => {
        settSplitterEksisterendeVilkår(true);
        settSplittFeil(undefined);

        // Oppdater eksisterende vilkår med tom = splittdato - 1 dag
        const nyTomDato = dagenFør(splittdato);
        const respons = await lagre(
            { fom: vilkår.fom || '', tom: nyTomDato },
            vilkår.adresse,
            vilkår.reiseId,
            initierSvar(vilkår),
            vilkår.fakta
        );

        settSplitterEksisterendeVilkår(false);

        if (respons.status === RessursStatus.SUKSESS) {
            settVisSplittModal(false);
            settSplittFeil(undefined);
            startSplitting(vilkår, splittdato);
        } else {
            settSplittFeil(
                feiletRessursTilFeilmelding(respons, 'Kunne ikke oppdatere eksisterende vilkår')
            );
        }
    };

    const handleLukkSplittModal = () => {
        settVisSplittModal(false);
        settSplittFeil(undefined);
    };

    return (
        <>
            <SplittVilkårDagligReiseModal
                visModal={visSplittModal}
                onClose={handleLukkSplittModal}
                onBekreft={handleBekreftSplitt}
                eksisterendeFom={vilkår.fom!} // TODO: Sjekk om vilkår.fom/tom trenger å være nullable i VilkårBase
                eksisterendeTom={vilkår.tom!}
                laster={lasterSplitt}
                feilmelding={splittFeil}
            />
            {erStegRedigerbart && redigerer ? (
                <EndreVilkårDagligReise
                    vilkår={vilkår}
                    lagre={lagre}
                    avsluttRedigering={() => settRedigerer(false)}
                />
            ) : (
                <LesevisningVilkårDagligReise
                    vilkår={vilkår}
                    skalViseRedigeringsknapp={skalViseRedigeringsknapp}
                    startRedigering={() => settRedigerer(true)}
                    startKopiering={() => startKopiering(vilkår)}
                    startSplitting={() => settVisSplittModal(true)}
                />
            )}
        </>
    );
};
