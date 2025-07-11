import React, { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, HStack, Table, VStack } from '@navikt/ds-react';

import { Journalføringsaksjon, JournalføringState } from '../../../hooks/useJournalføringState';
import DataViewer from '../../../komponenter/DataViewer';
import { SøppelbøtteKnapp } from '../../../komponenter/Knapper/SøppelbøtteKnapp';
import { BehandlingForJournalføring } from '../../../typer/behandling/behandling';
import {
    BehandlingResultat,
    behandlingResultatTilTekst,
} from '../../../typer/behandling/behandlingResultat';
import { behandlingStatusTilTekst } from '../../../typer/behandling/behandlingStatus';
import { behandlingTypeTilTekst } from '../../../typer/behandling/behandlingType';
import { formaterIsoDatoTid } from '../../../utils/dato';
import {
    alleBehandlingerErFerdigstiltEllerSattPåVent,
    journalføringsÅrsakErKlage,
    utledBehandlingstype,
} from '../Felles/utils';

const StyledDataCell = styled(Table.DataCell)`
    padding: 0;
`;

const FjernBehandlingKnapp = styled(SøppelbøtteKnapp)`
    margin-right: 0.5rem;
`;

const TekstContainer = styled.div`
    padding-left: 1rem;
    padding-right: 1rem;
`;

const BodyShortItalic = styled(BodyShort)`
    font-style: italic;
`;

const LeggTilKnapp = styled(Button)`
    width: fit-content;
`;

interface Props {
    journalpostState: JournalføringState;
    settFeilmelding: Dispatch<SetStateAction<string | undefined>>;
}

const Behandlinger: React.FC<Props> = ({ journalpostState, settFeilmelding }) => {
    const { behandlinger, journalføringsaksjon, settJournalføringsaksjon, journalføringsårsak } =
        journalpostState;
    const leggTilNyBehandlingForOpprettelse = (behandlinger: BehandlingForJournalføring[]) => {
        settFeilmelding('');
        const kanOppretteNyBehandling =
            alleBehandlingerErFerdigstiltEllerSattPåVent(behandlinger) ||
            journalføringsÅrsakErKlage(journalføringsårsak);

        if (kanOppretteNyBehandling) {
            settJournalføringsaksjon(Journalføringsaksjon.OPPRETT_BEHANDLING);
        } else {
            settFeilmelding(
                'Kan ikke opprette ny behandling. Denne fagsaken har en behandling som ikke er ferdigstilt.'
            );
        }
    };

    const skalOppretteNyBehandling =
        journalføringsaksjon === Journalføringsaksjon.OPPRETT_BEHANDLING;

    return (
        <DataViewer type={'behandlinger'} response={{ behandlinger }}>
            {({ behandlinger }) => {
                const behandlingstypePåNyBehandling =
                    behandlingTypeTilTekst[
                        utledBehandlingstype(behandlinger, journalpostState.journalføringsårsak)
                    ];

                return (
                    <VStack gap="4">
                        <Table zebraStripes={true}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell scope={'col'}>Behandling</Table.HeaderCell>
                                    <Table.HeaderCell scope={'col'}>Status</Table.HeaderCell>
                                    <Table.HeaderCell scope={'col'}>Sist endret</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {skalOppretteNyBehandling && (
                                    <Table.Row>
                                        <Table.DataCell>
                                            {behandlingstypePåNyBehandling}
                                        </Table.DataCell>
                                        <Table.DataCell>Opprettes ved journalføring</Table.DataCell>
                                        <StyledDataCell>
                                            <HStack justify={'end'}>
                                                <FjernBehandlingKnapp
                                                    size={'medium'}
                                                    type={'button'}
                                                    onClick={() =>
                                                        settJournalføringsaksjon(
                                                            Journalføringsaksjon.JOURNALFØR_PÅ_FAGSAK
                                                        )
                                                    }
                                                />
                                            </HStack>
                                        </StyledDataCell>
                                    </Table.Row>
                                )}
                                {behandlinger.map((behandling) => (
                                    <Table.Row key={behandling.id}>
                                        <Table.DataCell>
                                            {behandlingTypeTilTekst[behandling.type]}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {behandling.resultat === BehandlingResultat.HENLAGT
                                                ? behandlingResultatTilTekst[behandling.resultat]
                                                : behandlingStatusTilTekst[behandling.status]}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {formaterIsoDatoTid(behandling.sistEndret)}
                                        </Table.DataCell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        {behandlinger.length === 0 && (
                            <TekstContainer>
                                <BodyShortItalic>
                                    Det finnes ingen behandlinger på denne fagsaken til brukeren. Du
                                    kan opprette en behandling eller journalføre på bruker uten
                                    behandling (lik generell sak i Gosys)
                                </BodyShortItalic>
                            </TekstContainer>
                        )}
                        <LeggTilKnapp
                            type="button"
                            onClick={() => leggTilNyBehandlingForOpprettelse(behandlinger)}
                            size="small"
                            disabled={skalOppretteNyBehandling}
                            variant="secondary"
                            icon={<PlusCircleIcon title="legg til" />}
                        >
                            Opprett ny behandling
                        </LeggTilKnapp>
                        {skalOppretteNyBehandling && (
                            <Alert variant="info">
                                Ny behandling opprettes når journalføring er utført
                            </Alert>
                        )}
                    </VStack>
                );
            }}
        </DataViewer>
    );
};

export default Behandlinger;
