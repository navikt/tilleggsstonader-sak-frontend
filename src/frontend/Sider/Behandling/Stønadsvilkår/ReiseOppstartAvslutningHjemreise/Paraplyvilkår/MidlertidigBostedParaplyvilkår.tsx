import React, { useEffect, useId, useState } from 'react';

import { Heading, VStack } from '@navikt/ds-react';

import { LesevisningMidlertidigBostedPeriode } from './LesevisningMidlertidigBostedPeriode';
import { MidlertidigBostedFakta } from './MidlertidigBostedFakta';
import { RedigerParaplyvilkårKnapp } from './RedigerParaplyvilkårKnapp';
import { ReiserIParaplyvilkår } from './ReiserIParaplyvilkår';
import { MidlertidigBostedUtkast, tilUtkast, tomtMidlertidigBostedUtkast } from './typer';
import { useApp } from '../../../../../context/AppContext';
import { useSteg } from '../../../../../context/StegContext';
import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import {
    Feil,
    feiletRessursTilFeilmelding,
} from '../../../../../komponenter/Feil/feilmeldingUtils';
import { ResultatOgStatusKort } from '../../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { RessursStatus } from '../../../../../typer/ressurs';
import { BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal } from '../../../Felles/BekreftEndretDatoetFørTidligereVedtak/BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal';
import { useHarEndretDatoerFørTidligereVedtak } from '../../../Felles/BekreftEndretDatoetFørTidligereVedtak/useHarEndretDatoerFørTidligereVedtak';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import {
    FeilmeldingerMidlertidigBostedPeriode,
    validerMidlertidigBostedPeriode,
} from '../EndreVilkår/validering';
import {
    LagreNyttParaplyvilkårReiseOppstartAvslutningHjemreise,
    ParaplyvilkårReiseOppstartAvslutningHjemreise,
    RedigeringslåsROAH,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';

interface Props {
    aktivitet: Aktivitet;
    vilkår: ParaplyvilkårReiseOppstartAvslutningHjemreise | undefined;
    fjernUtkast?: () => void;
    redigeringsId: string;
    redigeringslås: RedigeringslåsROAH;
}

export const MidlertidigBostedParaplyvilkår: React.FC<Props> = ({
    aktivitet,
    vilkår,
    fjernUtkast,
    redigeringsId,
    redigeringslås,
}) => {
    const { regelstruktur, lagreNyttParaplyvilkår, oppdaterParaplyvilkår, slettVilkår } =
        useVilkårReiseOppstartAvslutningHjemreise();
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const { erStegRedigerbart } = useSteg();
    const komponentId = useId();
    const erUtkast = vilkår === undefined;

    const [utkast, settUtkast] = useState(vilkår ? tilUtkast(vilkår) : tomtMidlertidigBostedUtkast);
    const redigerer = redigeringslås.redigererId === redigeringsId;
    const [feil, settFeil] = useState<FeilmeldingerMidlertidigBostedPeriode>({});
    const [feilVedLagring, settFeilVedLagring] = useState<Feil>();
    const [laster, settLaster] = useState(false);

    const { visBekreftModal, settVisBekreftModal, burdeViseModal } =
        useHarEndretDatoerFørTidligereVedtak({
            tidligere: vilkår,
            ny: { fom: utkast.fom, tom: utkast.tom },
        });

    // Fjerner ulagret-markeringen når kortet fjernes, for eksempel når et utkast slettes
    useEffect(
        () => () => nullstillUlagretKomponent(komponentId),
        [nullstillUlagretKomponent, komponentId]
    );

    const endreUtkast = (endring: Partial<MidlertidigBostedUtkast>) => {
        settUtkast((forrige) => ({ ...forrige, ...endring }));
        settFeil({});
        settUlagretKomponent(komponentId);
    };

    const validerOgLagre = async () => {
        if (laster) return;

        const fom = utkast.fom ?? '';
        const tom = utkast.tom ?? '';

        const nyeFeil = validerMidlertidigBostedPeriode(
            { fom, tom },
            { fraAdresse: utkast.fraAdresse, tilAdresse: utkast.tilAdresse },
            utkast.svar,
            regelstruktur.midlertidigBostedPeriode
        );
        settFeil(nyeFeil);
        if (Object.keys(nyeFeil).length > 0) {
            return;
        }

        if (burdeViseModal) {
            settVisBekreftModal(true);
            return;
        }

        await lagre();
    };

    const lagre = async () => {
        const fom = utkast.fom ?? '';
        const tom = utkast.tom ?? '';

        const nyttVilkår: LagreNyttParaplyvilkårReiseOppstartAvslutningHjemreise = {
            type: 'PARAPLYVILKÅR',
            fom,
            tom,
            aktivitetId: aktivitet.globalId,
            svar: utkast.svar,
            fakta: {
                type: 'MIDLERTIDIG_BOSTED',
                fraAdresse: utkast.fraAdresse,
                tilAdresse: utkast.tilAdresse,
            },
        };

        settLaster(true);
        const respons = vilkår
            ? await oppdaterParaplyvilkår(vilkår.id, nyttVilkår)
            : await lagreNyttParaplyvilkår(nyttVilkår);
        settLaster(false);

        if (respons.status === RessursStatus.SUKSESS) {
            settFeilVedLagring(undefined);
            nullstillUlagretKomponent(komponentId);
            redigeringslås.avsluttRedigering();
            // Lagret vilkår vises nå fra konteksten, så utkastet fjernes
            if (erUtkast) fjernUtkast?.();
        } else {
            settFeilVedLagring(feiletRessursTilFeilmelding(respons));
        }
    };

    const avbryt = () => {
        if (!vilkår) {
            redigeringslås.avsluttRedigering();
            fjernUtkast?.();
            return;
        }
        settUtkast(tilUtkast(vilkår));
        settFeil({});
        settFeilVedLagring(undefined);
        nullstillUlagretKomponent(komponentId);
        redigeringslås.avsluttRedigering();
    };

    return (
        <>
            <ResultatOgStatusKort
                periode={vilkår}
                redigeres={redigerer}
                redigeringKnapp={
                    erStegRedigerbart &&
                    !redigerer && (
                        <RedigerParaplyvilkårKnapp
                            startRedigering={() => redigeringslås.startRedigering(redigeringsId)}
                        />
                    )
                }
            >
                <VStack gap="space-16">
                    <Heading size="xsmall" level="4">
                        Periode hvor bruker bor borte
                    </Heading>
                    {erStegRedigerbart && redigerer ? (
                        <MidlertidigBostedFakta
                            utkast={utkast}
                            endreUtkast={endreUtkast}
                            feil={feil}
                            feilVedLagring={feilVedLagring}
                            laster={laster}
                            regelstruktur={regelstruktur.midlertidigBostedPeriode}
                            lagre={validerOgLagre}
                            avbryt={avbryt}
                            lagretVilkår={vilkår}
                            avsluttRedigering={() => redigeringslås.avsluttRedigering()}
                            slett={slettVilkår}
                        />
                    ) : (
                        vilkår && <LesevisningMidlertidigBostedPeriode vilkår={vilkår} />
                    )}
                    {vilkår && (
                        <ReiserIParaplyvilkår
                            aktivitet={aktivitet}
                            paraplyvilkår={vilkår}
                            kanLeggeTilReise={!redigerer}
                            redigeringslås={redigeringslås}
                        />
                    )}
                </VStack>
            </ResultatOgStatusKort>
            <BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal
                visBekreftModal={visBekreftModal}
                settVisBekreftModal={settVisBekreftModal}
                bekreftLagre={lagre}
                laster={laster}
            />
        </>
    );
};
