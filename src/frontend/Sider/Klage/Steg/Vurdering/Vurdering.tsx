import * as React from 'react';
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Alert, Button, Textarea } from '@navikt/ds-react';

import { HjemmelVelger } from './HjemmelVelger';
import { InterntNotat } from './InterntNotat';
import { LesMerTekstInnstilling } from './LesMerTekstInnstilling';
import { Vedtak } from './Vedtak';
import { VelgÅrsakOmgjøring } from './VelgÅrsakOmgjøring';
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
import { useVurdering } from '../../hooks/useVurdering';
import { IFormkravVilkår } from '../Formkrav/typer';
import { alleVilkårOppfylt, påKlagetVedtakValgt } from '../Formkrav/validerFormkravUtils';

const FritekstFeltWrapper = styled.div`
    margin: 2rem 4rem 2rem 4rem;
    max-width: 50rem;
`;

const AlertStyled = styled(Alert)`
    margin: 2rem 4rem 2rem 4rem;
    width: 25rem;
`;

const VurderingKnapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 4rem;
`;

export const Vurdering: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const [formkrav, settFormkrav] = useState<Ressurs<IFormkravVilkår>>(byggTomRessurs());

    const [senderInn, settSenderInn] = useState<boolean>(false);

    const navigate = useNavigate();

    const { vurderingEndret, settVurderingEndret, hentBehandling, behandlingErRedigerbar } =
        useKlagebehandling();

    const [oppdatertVurdering, settOppdatertVurdering] = useState<Vurderingsfelter>({});

    const { vurdering, hentVurdering, lagreVurdering, melding, settMelding } = useVurdering();

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
                                        <FritekstFeltWrapper>
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
                                        </FritekstFeltWrapper>
                                    </>
                                )}
                                {oppdatertVurdering.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK && (
                                    <>
                                        <HjemmelVelger
                                            settHjemler={settOppdatertVurdering}
                                            hjemler={oppdatertVurdering.hjemler}
                                            endring={settIkkePersistertKomponent}
                                        />
                                        <FritekstFeltWrapper>
                                            <Textarea
                                                label="Innstilling til Nav Klageinstans (kommer med i brev til bruker)"
                                                value={
                                                    oppdatertVurdering.innstillingKlageinstans || ''
                                                }
                                                onChange={(e) => {
                                                    settIkkePersistertKomponent(e.target.value);
                                                    settOppdatertVurdering((tidligereTilstand) => ({
                                                        ...tidligereTilstand,
                                                        innstillingKlageinstans: e.target.value,
                                                    }));
                                                    settVurderingEndret(true);
                                                }}
                                                size="medium"
                                            />
                                            <LesMerTekstInnstilling />
                                        </FritekstFeltWrapper>
                                        <InterntNotat
                                            behandlingErRedigerbar={behandlingErRedigerbar}
                                            tekst={oppdatertVurdering?.interntNotat}
                                            oppdaterTekst={oppdaterNotat}
                                        />
                                    </>
                                )}
                                <VurderingKnapper>
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
                                </VurderingKnapper>
                                {melding && (
                                    <AlertStyled variant={melding.type} size="medium">
                                        {melding.tekst}
                                    </AlertStyled>
                                )}
                            </>
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
};
