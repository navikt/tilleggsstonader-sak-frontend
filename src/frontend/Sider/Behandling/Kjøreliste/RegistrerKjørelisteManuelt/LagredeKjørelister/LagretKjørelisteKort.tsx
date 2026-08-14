import React, { FC, useState } from 'react';

import { Box, VStack } from '@navikt/ds-react';
import { BorderNeutralSubtle } from '@navikt/ds-tokens/js';

import { LagretKjørelisteKortFooter } from './LagretKjørelisteKortFooter';
import { useRegistrerKjøreliste } from '../../../../../context/RegistrerKjørelisteContext/RegistrerKjørelisteContext';
import { useSteg } from '../../../../../context/StegContext';
import { Feilmelding } from '../../../../../komponenter/Feil/Feilmelding';
import {
    Feil,
    feiletRessursTilFeilmelding,
    lagFeilmelding,
} from '../../../../../komponenter/Feil/feilmeldingUtils';
import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import { RessursStatus } from '../../../../../typer/ressurs';
import {
    KjørelisteDag,
    KjørelisteUke,
    ManuellRegistreringUkeDto,
    ManueltInnsendtKjørelisteUke,
} from '../typer';
import { LagretKjørelisteKortHeader } from './LagretKjørelisteKortHeader';
import { LagretKjørelisteUkerTabell } from './LagretKjørelisteUkerTabell';
import { SlettKjørelisteModal } from './SlettKjørelisteModal';
import { tilUkeIÅr } from '../../../../../utils/dato';

export const LagretKjørelisteKort: FC<{
    kjøreliste: ManueltInnsendtKjørelisteUke;
}> = ({ kjøreliste }) => {
    const { erStegRedigerbart } = useSteg();
    const { oppdaterKjøreliste, tilgjengeligeReiser } = useRegistrerKjøreliste();

    const [redigerer, settRedigerer] = useState(false);
    const [begrunnelseInput, settBegrunnelseInput] = useState('');
    const [ukerIRedigering, settUkerIRedigering] = useState<KjørelisteUke[]>([]);
    const [dagerPerUke, settDagerPerUke] = useState<Record<string, KjørelisteDag[]>>({});
    const [visLeggTilUkerPanel, settVisLeggTilUkerPanel] = useState(false);
    const [visSletteModal, settVisSletteModal] = useState(false);
    const [laster, settLaster] = useState(false);
    const [feilmelding, settFeilmelding] = useState<Feil | undefined>(undefined);
    const [forsøktLagret, settForsøktLagret] = useState(false);

    const tilgjengeligeUker =
        tilgjengeligeReiser
            .find((reise) => reise.fom === kjøreliste.reiseFom)
            ?.uker.filter((uke) => !ukerIRedigering.some((u) => u.fom === uke.fom)) ?? [];

    const startRedigering = () => {
        settBegrunnelseInput(kjøreliste.begrunnelse ?? '');
        settUkerIRedigering([...kjøreliste.innsendteUker]);
        settDagerPerUke(
            Object.fromEntries(
                kjøreliste.innsendteUker.map((uke) => [
                    uke.fom,
                    uke.dager.map((dag) => ({ ...dag })),
                ])
            )
        );
        settRedigerer(true);
    };

    const avbrytRedigering = () => {
        settRedigerer(false);
        settVisLeggTilUkerPanel(false);
        settFeilmelding(undefined);
        settForsøktLagret(false);
    };

    const oppdaterDagForUke = (ukeFom: string, oppdatertDag: KjørelisteDag) => {
        settDagerPerUke((prev) => ({
            ...prev,
            [ukeFom]: prev[ukeFom].map((dag) =>
                dag.dato === oppdatertDag.dato ? oppdatertDag : dag
            ),
        }));
    };

    const leggTilUker = (nyeUker: ManuellRegistreringUkeDto[]) => {
        const nyeDager: Record<string, KjørelisteDag[]> = {};
        const nyeKjørelisteUker: KjørelisteUke[] = nyeUker.map((uke) => {
            const dager: KjørelisteDag[] = uke.dager.map((dato) => ({
                dato,
                harKjørt: false,
                parkeringsutgift: undefined,
            }));
            nyeDager[uke.fom] = dager;
            return {
                ukenummer: uke.ukenummer,
                ukeIÅr: uke.ukeIÅr ?? tilUkeIÅr(uke.fom),
                fom: uke.fom,
                tom: uke.tom,
                dager,
            };
        });

        settDagerPerUke((prev) => ({ ...prev, ...nyeDager }));
        settUkerIRedigering((prev) =>
            [...prev, ...nyeKjørelisteUker].sort((a, b) => a.fom.localeCompare(b.fom))
        );
    };

    const lagre = async () => {
        if (laster) return;
        settLaster(true);
        settFeilmelding(undefined);

        const parkeringsutgiftPåDagSomIkkeErKjørt = Object.values(dagerPerUke)
            .flat()
            .some((dag) => !dag.harKjørt && dag.parkeringsutgift && dag.parkeringsutgift > 0);

        if (parkeringsutgiftPåDagSomIkkeErKjørt) {
            settForsøktLagret(true);
            settFeilmelding(
                lagFeilmelding(
                    'En parkeringsutgift er registrert for dager det ikke er kjørt. Fjern parkeringsutgiften eller huk av for kjørt.'
                )
            );
            settLaster(false);
            return;
        }

        const respons = await oppdaterKjøreliste(kjøreliste.id, {
            begrunnelse: begrunnelseInput,
            uker: ukerIRedigering.map((uke) => ({
                ukeIÅr: uke.ukeIÅr,
                dager: dagerPerUke[uke.fom] ?? uke.dager,
            })),
        });

        if (respons.status === RessursStatus.SUKSESS) {
            settRedigerer(false);
            settVisLeggTilUkerPanel(false);
        } else {
            settFeilmelding(feiletRessursTilFeilmelding(respons));
        }

        settLaster(false);
    };

    const ukerForRendering = redigerer ? ukerIRedigering : kjøreliste.innsendteUker;

    const åpneSletteModal = () => {
        settVisSletteModal(true);
    };

    const lukkSletteModal = () => {
        settVisSletteModal(false);
    };

    const visLeggTilUker = () => {
        settVisLeggTilUkerPanel(true);
    };

    const lukkLeggTilUker = () => {
        settVisLeggTilUkerPanel(false);
    };

    return (
        <Box background="default" borderColor="neutral-subtle" borderRadius="12" borderWidth="1">
            <VStack gap="space-8" paddingBlock="space-16 space-8" paddingInline="space-24">
                <LagretKjørelisteKortHeader
                    kjøreliste={kjøreliste}
                    erStegRedigerbart={erStegRedigerbart}
                    redigerer={redigerer}
                    startRedigering={startRedigering}
                    åpneSletteModal={åpneSletteModal}
                    begrunnelseInput={begrunnelseInput}
                    settBegrunnelseInput={settBegrunnelseInput}
                />
                <SlettKjørelisteModal
                    kjørelisteId={kjøreliste.id}
                    visModal={visSletteModal}
                    lukkModal={lukkSletteModal}
                />
            </VStack>

            <Skillelinje borderColor={BorderNeutralSubtle} />

            <Box paddingBlock="space-8 space-16" paddingInline="space-16">
                <VStack gap="space-8">
                    <LagretKjørelisteUkerTabell
                        redigerer={redigerer}
                        ukerForRendering={ukerForRendering}
                        dagerPerUke={dagerPerUke}
                        oppdaterDagForUke={oppdaterDagForUke}
                        forsøktLagret={forsøktLagret}
                    />
                    <LagretKjørelisteKortFooter
                        redigerer={redigerer}
                        tilgjengeligeUker={tilgjengeligeUker}
                        visLeggTilUkerPanel={visLeggTilUkerPanel}
                        leggTilUker={leggTilUker}
                        visLeggTilUker={visLeggTilUker}
                        lukkLeggTilUker={lukkLeggTilUker}
                        lagre={lagre}
                        avbrytRedigering={avbrytRedigering}
                        laster={laster}
                    />
                    <Feilmelding feil={feilmelding} />
                </VStack>
            </Box>
        </Box>
    );
};
