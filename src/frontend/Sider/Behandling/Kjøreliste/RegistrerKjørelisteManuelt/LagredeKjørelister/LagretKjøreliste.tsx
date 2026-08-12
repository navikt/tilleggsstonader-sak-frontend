import React, { FC, useState } from 'react';

import { PencilIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    Box,
    Button,
    Heading,
    HStack,
    Label,
    Table,
    Textarea,
    VStack,
} from '@navikt/ds-react';
import { BorderNeutralSubtle } from '@navikt/ds-tokens/js';

import { SlettKjørelisteModal } from './SlettKjørelisteModal';
import { useRegistrerKjøreliste } from '../../../../../context/RegistrerKjørelisteContext/RegistrerKjørelisteContext';
import { useSteg } from '../../../../../context/StegContext';
import { Feilmelding } from '../../../../../komponenter/Feil/Feilmelding';
import {
    Feil,
    feiletRessursTilFeilmelding,
} from '../../../../../komponenter/Feil/feilmeldingUtils';
import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import { TableHeaderCellSmall } from '../../../../../komponenter/TabellSmall';
import { RessursStatus } from '../../../../../typer/ressurs';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import {
    KjørelisteDag,
    KjørelisteUke,
    ManuellRegistreringUkeDto,
    ManueltInnsendtKjørelisteUke,
} from '../typer';
import { UkeGrid } from '../UkeGrid';
import { LeggTilUkerPanel } from './LeggTilUkerPanel';
import { RedigerLagretKjørelisteDag } from './RedigerLagretKjørelisteDag';
import { UkeInnholdLagretKjøreliste } from './UkeInnholdLagretKjøreliste';

export const LagretKjøreliste: FC<{
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
            return { ukenummer: uke.ukenummer, fom: uke.fom, tom: uke.tom, dager };
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

        const respons = await oppdaterKjøreliste(kjøreliste.id, {
            begrunnelse: begrunnelseInput || undefined,
            uker: ukerIRedigering.map((uke) => ({
                fom: uke.fom,
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

    return (
        <Box background="default" borderColor="neutral-subtle" borderRadius="12" borderWidth="1">
            <VStack gap="space-8" paddingBlock="space-16 space-8" paddingInline="space-24">
                <HStack gap="space-48" align="center" justify="space-between" minWidth="200px">
                    <Heading size="small">
                        Reise til {kjøreliste.aktivitetsadresse} (
                        {formaterIsoPeriode(kjøreliste.reiseFom, kjøreliste.reiseTom)})
                    </Heading>
                    <HStack gap="space-8" align="center">
                        <BodyShort size="small" color="subtle">
                            Journalpost ID: {kjøreliste.journalpostId}
                        </BodyShort>
                    </HStack>
                </HStack>
                {erStegRedigerbart && !redigerer && (
                    <Button
                        style={{ width: '110px', alignSelf: 'self-end' }}
                        size="small"
                        variant="tertiary"
                        icon={<PencilIcon />}
                        onClick={startRedigering}
                    >
                        Rediger
                    </Button>
                )}
                {erStegRedigerbart && redigerer && (
                    <Button
                        size="small"
                        style={{ width: '110px', alignSelf: 'self-end' }}
                        variant="tertiary"
                        icon={<TrashIcon />}
                        iconPosition="right"
                        data-color="danger"
                        onClick={åpneSletteModal}
                    >
                        Slett
                    </Button>
                )}
                <SlettKjørelisteModal
                    kjørelisteId={kjøreliste.id}
                    visModal={visSletteModal}
                    lukkModal={lukkSletteModal}
                />

                {redigerer ? (
                    <Textarea
                        label="Begrunnelse for manuell registrering"
                        value={begrunnelseInput}
                        onChange={(e) => settBegrunnelseInput(e.target.value)}
                        size="small"
                        minRows={2}
                    />
                ) : (
                    <div>
                        <Label size="small">Begrunnelse for manuell registrering: </Label>
                        <BodyShort size="small">
                            {kjøreliste.begrunnelse
                                ? kjøreliste.begrunnelse
                                : 'Ingen begrunnelse lagt ved'}
                        </BodyShort>
                    </div>
                )}
            </VStack>

            <Skillelinje borderColor={BorderNeutralSubtle} />

            <Box paddingBlock="space-8 space-16" paddingInline="space-16">
                <VStack gap="space-8">
                    <Table size="small" width="fit-content">
                        <Table.Body>
                            {ukerForRendering.map((uke) => (
                                <Table.ExpandableRow
                                    key={uke.fom}
                                    expandOnRowClick
                                    defaultOpen
                                    content={
                                        redigerer ? (
                                            <UkeGrid>
                                                {(dagerPerUke[uke.fom] ?? []).map((dag) => (
                                                    <RedigerLagretKjørelisteDag
                                                        key={dag.dato}
                                                        dag={dag}
                                                        oppdaterDag={(oppdatertDag) =>
                                                            oppdaterDagForUke(uke.fom, oppdatertDag)
                                                        }
                                                    />
                                                ))}
                                            </UkeGrid>
                                        ) : (
                                            <UkeInnholdLagretKjøreliste dager={uke.dager} />
                                        )
                                    }
                                >
                                    <TableHeaderCellSmall>
                                        <HStack gap="space-16" align="center">
                                            <Heading size="small">{`Uke ${uke.ukenummer}`}</Heading>
                                            <BodyShort size="small">
                                                {formaterIsoPeriode(uke.fom, uke.tom)}
                                            </BodyShort>
                                        </HStack>
                                    </TableHeaderCellSmall>
                                </Table.ExpandableRow>
                            ))}
                        </Table.Body>
                    </Table>

                    {redigerer && (
                        <HStack justify={'space-between'}>
                            {tilgjengeligeUker.length > 0 &&
                                (visLeggTilUkerPanel ? (
                                    <LeggTilUkerPanel
                                        tilgjengeligeUker={tilgjengeligeUker}
                                        leggTilUker={leggTilUker}
                                        lukkPanel={() => settVisLeggTilUkerPanel(false)}
                                    />
                                ) : (
                                    <Button
                                        style={{ width: 'fit-content' }}
                                        size="small"
                                        variant="secondary"
                                        icon={<PlusCircleIcon />}
                                        onClick={() => settVisLeggTilUkerPanel(true)}
                                    >
                                        Legg til uker
                                    </Button>
                                ))}
                            <HStack
                                gap="space-8"
                                height="fit-content"
                                style={{ alignSelf: 'self-end' }}
                            >
                                <Button size="small" onClick={lagre} loading={laster}>
                                    Lagre
                                </Button>
                                <Button size="small" variant="tertiary" onClick={avbrytRedigering}>
                                    Avbryt
                                </Button>
                            </HStack>
                        </HStack>
                    )}
                    <Feilmelding feil={feilmelding} />
                </VStack>
            </Box>
        </Box>
    );
};
