import React, { Dispatch, SetStateAction } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, HStack, Table, VStack } from '@navikt/ds-react';

import styles from './Behandlinger.module.css';
import { Journalføringsaksjon, JournalføringState } from '../../../hooks/useJournalføringState';
import DataViewer from '../../../komponenter/DataViewer';
import { SøppelbøtteKnapp } from '../../../komponenter/Knapper/SøppelbøtteKnapp';
import { BehandlingForJournalføring } from '../../../typer/behandling/behandling';
import {
    BehandlingResultat,
    behandlingResultatTilTekst,
} from '../../../typer/behandling/behandlingResultat';
import {
    BehandlingStatus,
    behandlingStatusTilTekst,
} from '../../../typer/behandling/behandlingStatus';
import { behandlingTypeTilTekst } from '../../../typer/behandling/behandlingType';
import { formaterIsoDatoTid } from '../../../utils/dato';
import {
    alleBehandlingerErFerdigstiltEllerSattPåVent,
    journalføringsÅrsakErKlage,
    utledBehandlingstype,
} from '../Felles/utils';

interface Props {
    journalpostState: JournalføringState;
    kanHaFlereAktiveBehandlingerPerFagsak: boolean;
    settFeilmelding: Dispatch<SetStateAction<string | undefined>>;
}

const Behandlinger: React.FC<Props> = ({
    journalpostState,
    kanHaFlereAktiveBehandlingerPerFagsak,
    settFeilmelding,
}) => {
    const { behandlinger, journalføringsaksjon, settJournalføringsaksjon, journalføringsårsak } =
        journalpostState;

    const leggTilNyBehandlingForOpprettelse = (behandlinger: BehandlingForJournalføring[]) => {
        settFeilmelding('');
        const kanOppretteNyBehandling =
            kanHaFlereAktiveBehandlingerPerFagsak ||
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

    const opprettNyBehandlingAlertTekst = (finnesAktivBehandling: boolean) =>
        kanHaFlereAktiveBehandlingerPerFagsak && finnesAktivBehandling
            ? 'Ny behandling opprettes når journalføring er utført. Behandlingen settes på vent da det allerede finnes en aktiv behandling på denne fagsaken.'
            : 'Ny behandling opprettes når journalføring er utført.';

    return (
        <DataViewer type={'behandlinger'} response={{ behandlinger }}>
            {({ behandlinger }) => {
                const behandlingstypePåNyBehandling =
                    behandlingTypeTilTekst[
                        utledBehandlingstype(behandlinger, journalpostState.journalføringsårsak)
                    ];

                const finnesAktivBehandling = behandlinger.some(
                    (behandling) => behandling.status !== BehandlingStatus.FERDIGSTILT
                );

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
                                        <Table.DataCell className={styles.dataCell}>
                                            <HStack justify={'end'}>
                                                <SøppelbøtteKnapp
                                                    className={styles.fjernBehandlingKnapp}
                                                    size={'medium'}
                                                    type={'button'}
                                                    onClick={() =>
                                                        settJournalføringsaksjon(
                                                            Journalføringsaksjon.JOURNALFØR_PÅ_FAGSAK
                                                        )
                                                    }
                                                />
                                            </HStack>
                                        </Table.DataCell>
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
                            <div className={styles.tekstContainer}>
                                <BodyShort className={styles.bodyShortItalic}>
                                    Det finnes ingen behandlinger på denne fagsaken til brukeren. Du
                                    kan opprette en behandling eller journalføre på bruker uten
                                    behandling (lik generell sak i Gosys)
                                </BodyShort>
                            </div>
                        )}
                        <Button
                            className={styles.leggTilKnapp}
                            type="button"
                            onClick={() => leggTilNyBehandlingForOpprettelse(behandlinger)}
                            size="small"
                            disabled={skalOppretteNyBehandling}
                            variant="secondary"
                            icon={<PlusCircleIcon title="legg til" />}
                        >
                            Opprett ny behandling
                        </Button>
                        {skalOppretteNyBehandling && (
                            <Alert variant="info">
                                {opprettNyBehandlingAlertTekst(finnesAktivBehandling)}
                            </Alert>
                        )}
                    </VStack>
                );
            }}
        </DataViewer>
    );
};

export default Behandlinger;
