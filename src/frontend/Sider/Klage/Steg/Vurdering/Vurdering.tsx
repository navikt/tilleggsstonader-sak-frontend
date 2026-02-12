import * as React from 'react';
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Alert, Button, Textarea } from '@navikt/ds-react';

import { HjemmelVelger } from './HjemmelVelger';
import { InterntNotat } from './InterntNotat';
import { LesMerTekstInnstilling } from './LesMerTekstInnstilling';
import { Vedtak } from './Vedtak';
import { VelgÅrsakOmgjøring } from './VelgÅrsakOmgjøring';
import styles from './Vurdering.module.css';
import { VurderingLesemodus } from './VurderingLesemodus';
import { erNødvendigeFelterUtfylt, tilVurderingDto, Vurderingsfelter } from './vurderingsfelter';
import { VedtakValg, vedtakValgTilTekst, årsakValgTilTekst } from './vurderingValg';
import { useApp } from '../../../../context/AppContext';
import DataViewer from '../../../../komponenter/DataViewer';
import {
    byggTomRessurs,
    pakkUtHvisSuksess,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../../typer/ressurs';
import { useKlageApp } from '../../context/KlageAppContext';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import { useHjemler } from '../../hooks/useHjemler';
import { useVurdering } from '../../hooks/useVurdering';
import { IFormkravVilkår } from '../Formkrav/typer';
import { alleVilkårOppfylt, påKlagetVedtakValgt } from '../Formkrav/validerFormkravUtils';

export const Vurdering: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const [formkrav, settFormkrav] = useState<Ressurs<IFormkravVilkår>>(byggTomRessurs());

    const [senderInn, settSenderInn] = useState<boolean>(false);

    const navigate = useNavigate();

    const { vurderingEndret, settVurderingEndret, hentBehandling, behandlingErRedigerbar } =
        useKlagebehandling();

    const [oppdatertVurdering, settOppdatertVurdering] = useState<Vurderingsfelter>({});

    const { vurdering, hentVurdering, lagreVurdering, melding, settMelding } = useVurdering();

    const { hjemler } = useHjemler(behandlingId);

    const { nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } = useKlageApp();

    const { request } = useApp();

    useEffect(() => {
        if (behandlingId && vurdering.status !== RessursStatus.SUKSESS) {
            hentVurdering(behandlingId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [behandlingId, hentVurdering]);

    useEffect(() => {
        request<IFormkravVilkår, null>(`/api/klage/formkrav/vilkar/${behandlingId}`).then(
            settFormkrav
        );
    }, [behandlingId, request, settFormkrav]);

    useEffect(() => {
        if (vurdering.status === RessursStatus.SUKSESS) {
            settOppdatertVurdering(vurdering.data);
        } else settVurderingEndret(true);
    }, [vurdering, settVurderingEndret, settOppdatertVurdering]);

    const oppdaterVurdering = () => {
        if (senderInn) {
            return;
        }

        if (!erNødvendigeFelterUtfylt(oppdatertVurdering)) {
            return;
        }

        settSenderInn(true);
        settMelding(undefined);

        lagreVurdering(tilVurderingDto(oppdatertVurdering, behandlingId)).then(
            (res: RessursSuksess<Vurderingsfelter> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    nullstillIkkePersisterteKomponenter();
                }
                settSenderInn(false);
                settVurderingEndret(false);
                hentBehandling.rerun();
            }
        );
    };

    function navigerTilBrev() {
        navigate(`/klagebehandling/${behandlingId}/brev`);
    }

    const oppdaterNotat = (tekst?: string) => {
        settOppdatertVurdering((prevState) => ({
            ...prevState,
            interntNotat: tekst,
        }));
        settIkkePersistertKomponent('internt-notat');
    };

    return (
        <DataViewer type={'formkrav'} response={{ formkrav }}>
            {({ formkrav }) => {
                const skalViseVurderingsvalg =
                    påKlagetVedtakValgt(formkrav) && alleVilkårOppfylt(formkrav);

                return (
                    <>
                        {behandlingErRedigerbar && !skalViseVurderingsvalg && (
                            <Alert variant={'error'}>Noen formkrav er ikke oppfylt</Alert>
                        )}
                        {!behandlingErRedigerbar && skalViseVurderingsvalg && (
                            <VurderingLesemodus vurdering={pakkUtHvisSuksess(vurdering)} />
                        )}
                        {behandlingErRedigerbar && skalViseVurderingsvalg && (
                            <>
                                <Vedtak
                                    settVedtak={settOppdatertVurdering}
                                    vedtakValgt={oppdatertVurdering.vedtak}
                                    vedtakValgmuligheter={vedtakValgTilTekst}
                                    endring={settIkkePersistertKomponent}
                                />
                                {oppdatertVurdering.vedtak == VedtakValg.OMGJØR_VEDTAK && (
                                    <>
                                        <VelgÅrsakOmgjøring
                                            settÅrsak={settOppdatertVurdering}
                                            årsakValgt={oppdatertVurdering.årsak}
                                            årsakValgmuligheter={årsakValgTilTekst}
                                            endring={settIkkePersistertKomponent}
                                        />
                                        <div className={styles.fritekstFeltWrapper}>
                                            <Textarea
                                                label="Begrunnelse for omgjøring (internt notat)"
                                                value={oppdatertVurdering.begrunnelseOmgjøring}
                                                onChange={(e) => {
                                                    settIkkePersistertKomponent(e.target.value);
                                                    settOppdatertVurdering((tidligereTilstand) => ({
                                                        ...tidligereTilstand,
                                                        begrunnelseOmgjøring: e.target.value,
                                                    }));
                                                    settVurderingEndret(true);
                                                }}
                                                size="medium"
                                            />
                                        </div>
                                    </>
                                )}
                                {oppdatertVurdering.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK && (
                                    <DataViewer type={'hjemler'} response={{ hjemler }}>
                                        {({ hjemler }) => (
                                            <>
                                                <HjemmelVelger
                                                    settHjemler={settOppdatertVurdering}
                                                    valgteHjemler={oppdatertVurdering.hjemler}
                                                    tilgjengeligeHjemler={hjemler}
                                                    endring={settIkkePersistertKomponent}
                                                />
                                                <div className={styles.fritekstFeltWrapper}>
                                                    <Textarea
                                                        label="Innstilling til Nav Klageinstans (kommer med i brev til bruker)"
                                                        value={
                                                            oppdatertVurdering.innstillingKlageinstans ||
                                                            ''
                                                        }
                                                        onChange={(e) => {
                                                            settIkkePersistertKomponent(
                                                                e.target.value
                                                            );
                                                            settOppdatertVurdering(
                                                                (tidligereTilstand) => ({
                                                                    ...tidligereTilstand,
                                                                    innstillingKlageinstans:
                                                                        e.target.value,
                                                                })
                                                            );
                                                            settVurderingEndret(true);
                                                        }}
                                                        size="medium"
                                                    />
                                                    <LesMerTekstInnstilling />
                                                </div>
                                                <InterntNotat
                                                    behandlingErRedigerbar={behandlingErRedigerbar}
                                                    tekst={oppdatertVurdering?.interntNotat}
                                                    oppdaterTekst={oppdaterNotat}
                                                />
                                            </>
                                        )}
                                    </DataViewer>
                                )}
                                <div className={styles.vurderingKnapper}>
                                    {(vurderingEndret || melding?.type === 'error') && (
                                        <Button
                                            variant="primary"
                                            size="medium"
                                            onClick={oppdaterVurdering}
                                            disabled={!erNødvendigeFelterUtfylt(oppdatertVurdering)}
                                        >
                                            Lagre vurdering
                                        </Button>
                                    )}
                                    {!vurderingEndret && melding?.type !== 'error' && (
                                        <Button
                                            variant="primary"
                                            size="medium"
                                            onClick={navigerTilBrev}
                                        >
                                            Fortsett
                                        </Button>
                                    )}
                                </div>
                                {melding && (
                                    <Alert
                                        variant={melding.type}
                                        size="medium"
                                        className={styles.alert}
                                    >
                                        {melding.tekst}
                                    </Alert>
                                )}
                            </>
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
};
