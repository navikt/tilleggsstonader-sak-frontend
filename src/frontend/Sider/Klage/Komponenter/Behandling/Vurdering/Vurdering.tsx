import * as React from 'react';
import { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/KlageAppContext';
import styled from 'styled-components';
import { Alert, Button, ReadMore } from '@navikt/ds-react';
import { Vedtak } from './Vedtak';
import { Årsak } from './Årsak';
import { HjemmelVelger } from './HjemmelVelger';
import { IVurdering, VedtakValg, vedtakValgTilTekst, årsakValgTilTekst } from './vurderingValg';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../../../typer/ressurs';
import { IFormkravVilkår } from '../Formkrav/typer';
import { useNavigate } from 'react-router-dom';
import { useKlagebehandling } from '../../../App/context/KlagebehandlingContext';
import { VurderingLesemodus } from './VurderingLesemodus';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { EnsligTextArea } from '../../../Felles/Input/EnsligTextArea';
import { alleVilkårOppfylt, påKlagetVedtakValgt } from '../Formkrav/validerFormkravUtils';
import { InterntNotat } from './InterntNotat';
import { useHentVurderinger } from '../../../App/hooks/useHentVurderinger';
import { formkravVilkårStub } from '../../../App/api/klage-stubs';
import { harVerdi } from '../../../../../utils/utils';

const FritekstFeltWrapper = styled.div`
    margin: 2rem 4rem 2rem 4rem;
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

const LesMerTekst = styled(ReadMore)`
    margin-top: 0.25rem;
    max-width: 40rem;
`;

const erAlleFelterUtfylt = (vurderingData: IVurdering): boolean => {
    const { vedtak, innstillingKlageinstans, årsak, hjemmel, begrunnelseOmgjøring } = vurderingData;

    if (vedtak === VedtakValg.OMGJØR_VEDTAK) {
        return harVerdi(årsak) && harVerdi(begrunnelseOmgjøring);
    } else if (vedtak === VedtakValg.OPPRETTHOLD_VEDTAK) {
        return harVerdi(innstillingKlageinstans) && harVerdi(hjemmel);
    } else {
        return false;
    }
};

export const Vurdering: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const [formkrav, settFormkrav] = useState<Ressurs<IFormkravVilkår>>(byggTomRessurs());
    const [senderInn, settSenderInn] = useState<boolean>(false);

    const navigate = useNavigate();

    const {
        oppdatertVurdering,
        settOppdatertVurdering,
        vurderingEndret,
        settVurderingEndret,
        hentBehandlingshistorikk,
        hentBehandling,
        behandlingErRedigerbar,
    } = useKlagebehandling();

    const { vurdering, hentVurdering, lagreVurdering, melding, settMelding } = useHentVurderinger();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    useEffect(() => {
        if (behandlingId !== undefined) {
            if (vurdering.status !== RessursStatus.SUKSESS) {
                hentVurdering(behandlingId);
            }
        }
        // eslint-disable-next-line
    }, [behandlingId, hentVurdering]);

    useEffect(() => {
        axiosRequest<IFormkravVilkår, null>({
            method: 'GET',
            url: `/api/klage/formkrav/vilkar/${behandlingId}`,
        }).then(settFormkrav);
    }, [axiosRequest, behandlingId, settFormkrav]);

    useEffect(() => {
        settFormkrav({status: RessursStatus.SUKSESS, data: formkravVilkårStub}) // ++
    }, [settFormkrav]);

    useEffect(() => {
        if (vurdering.status === RessursStatus.SUKSESS && vurdering.data != null) {
            settOppdatertVurdering(vurdering.data);
        } else settVurderingEndret(true);
    }, [vurdering, settVurderingEndret, settOppdatertVurdering]);
    //
    const opprettVurdering = () => {
        if (senderInn) {
            return;
        }

        const vurderingSomSkalLagres =
            oppdatertVurdering.vedtak === VedtakValg.OPPRETTHOLD_VEDTAK
                ? {
                      ...oppdatertVurdering,
                      årsak: null,
                      begrunnelseOmgjøring: null,
                  }
                : {
                      ...oppdatertVurdering,
                      hjemmel: null,
                      innstillingKlageinstans: null,
                      interntNotat: null,
                  };

        settSenderInn(true);
        settMelding(undefined);
        // @ts-ignore
        lagreVurdering(vurderingSomSkalLagres).then(
            (res: RessursSuksess<IVurdering> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    nullstillIkkePersisterteKomponenter();
                }
                settSenderInn(false);
                settVurderingEndret(false);
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
            }
        );
    };

    const oppdaterNotat = (tekst?: string) => {
        settOppdatertVurdering((prevState) => ({
            ...prevState,
            interntNotat: tekst,
        }));
        settIkkePersistertKomponent('internt-notat');
    };

    function navigerTilBrev() {
        navigate(`/klagebehandling/${behandlingId}/brev`);
    }

    return (
        <DataViewer response={{ formkrav }}>
            {({ formkrav }) => {
                const skalViseVurderingsvalg =
                    påKlagetVedtakValgt(formkrav) && alleVilkårOppfylt(formkrav);

                return (
                    <>
                        {behandlingErRedigerbar && !skalViseVurderingsvalg && (
                            <Alert variant={'error'}>Noen formkrav er ikke oppfylt</Alert>
                        )}
                        {!behandlingErRedigerbar && skalViseVurderingsvalg && (
                            <VurderingLesemodus vurdering={oppdatertVurdering} />
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
                                        <Årsak
                                            settÅrsak={settOppdatertVurdering}
                                            årsakValgt={oppdatertVurdering.årsak}
                                            årsakValgmuligheter={årsakValgTilTekst}
                                            endring={settIkkePersistertKomponent}
                                        />
                                        <FritekstFeltWrapper>
                                            <EnsligTextArea
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
                                                erLesevisning={false}
                                            />
                                        </FritekstFeltWrapper>
                                    </>
                                )}
                                {oppdatertVurdering.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK && (
                                    <>
                                        <HjemmelVelger
                                            settHjemmel={settOppdatertVurdering}
                                            hjemmelValgt={oppdatertVurdering.hjemmel}
                                            endring={settIkkePersistertKomponent}
                                        />
                                        <FritekstFeltWrapper>
                                            <EnsligTextArea
                                                label="Innstilling til NAV Klageinstans (kommer med i brev til bruker)"
                                                value={oppdatertVurdering.innstillingKlageinstans}
                                                onChange={(e) => {
                                                    settIkkePersistertKomponent(e.target.value);
                                                    settOppdatertVurdering((tidligereTilstand) => ({
                                                        ...tidligereTilstand,
                                                        innstillingKlageinstans: e.target.value,
                                                    }));
                                                    settVurderingEndret(true);
                                                }}
                                                size="medium"
                                                erLesevisning={false}
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
                                            onClick={opprettVurdering}
                                            disabled={!erAlleFelterUtfylt(oppdatertVurdering)}
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

const LesMerTekstInnstilling: React.FC = () => {
    return (
        <LesMerTekst size="small" header="Dette skal innstillingen inneholde">
            <ol>
                <li>
                    Hva klagesaken gjelder
                    <ol type="a">
                        <li>
                            Skriv kort om resultatet i vedtaket. Eksempel: Klagers søknad om
                            overgangsstønad ble avslått fordi hun har fått nytt barn med samme
                            partner.
                        </li>
                    </ol>
                </li>
                <li>
                    Vurdering av klagen
                    <ol type="a">
                        <li>Begrunn hvorfor vi opprettholder vedtaket</li>
                        <li>Klagers argumenter skal vurderes/kommenteres</li>
                        <li>Avslutt med konklusjon og vis til hjemmel</li>
                    </ol>
                </li>
            </ol>
        </LesMerTekst>
    );
};
