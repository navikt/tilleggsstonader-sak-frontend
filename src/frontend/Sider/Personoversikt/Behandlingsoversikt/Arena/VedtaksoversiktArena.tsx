import React, { useEffect, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import styled from 'styled-components';

import { BodyShort, Heading, Table } from '@navikt/ds-react';

import { ArenaSak, ArenaSakOgVedtak, ArenaVedtak } from './vedtakArena';
import { useApp } from '../../../../context/AppContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';
import { formaterNullableIsoDato } from '../../../../utils/dato';
import { Toggle } from '../../../../utils/toggles';

const Vedtakstabell = styled(Table)`
    max-width: 1200px;
`;

const Detaljer: React.FC<{ vedtak: ArenaVedtak; sak: ArenaSak | undefined }> = ({
    vedtak,
    sak,
}) => {
    return (
        <>
            <BodyShort>
                <strong>Målgruppe:</strong> {sak?.målgruppe}
            </BodyShort>
            <BodyShort>
                <strong>Aktivitet:</strong> {sak?.aktivitet?.type}{' '}
                {sak?.aktivitet && ` (${sak?.aktivitet.status})`}
            </BodyShort>
            {sak?.aktivitet?.beskrivelse && (
                <span>
                    <strong>Aktivitetsbeskrivelse:</strong> {sak.aktivitet.beskrivelse}
                </span>
            )}

            {vedtak.vedtakfakta.length && (
                <>
                    <Heading size="xsmall">Vedtakfakta</Heading>
                    <Table size={'small'}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell scope="col">Rettighetstype</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Verdi</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {vedtak.vedtakfakta.map((fakta, index) => (
                                <Table.Row key={index}>
                                    <Table.DataCell>{fakta.type}</Table.DataCell>
                                    <Table.DataCell>{fakta.verdi}</Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </>
            )}
        </>
    );
};

export const VedtaksoversiktArena: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [vedtakArena, settVedtakArena] = useState<Ressurs<ArenaSakOgVedtak>>(byggTomRessurs());

    const skalViseVedtakArena = useFlag(Toggle.SKAL_VISE_VEDTAK_ARENA);

    useEffect(() => {
        if (skalViseVedtakArena) {
            request<ArenaSakOgVedtak, null>(`/api/sak/arena/vedtak/${fagsakPersonId}`).then(
                settVedtakArena
            );
        }
    }, [skalViseVedtakArena, request, fagsakPersonId]);

    if (!skalViseVedtakArena) {
        return null;
    }
    return (
        <>
            <Heading size="small">Vedtak i Arena</Heading>
            <DataViewer response={{ vedtakArena }}>
                {({ vedtakArena }) => (
                    <Vedtakstabell>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell scope="col">Rettighetstype</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Utfall</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Dato innstillt</Table.HeaderCell>
                                <Table.HeaderCell scope="col"></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {vedtakArena.vedtak.map((vedtak, index) => {
                                const sak = vedtakArena.saker[vedtak.sakId];
                                return (
                                    <Table.ExpandableRow
                                        key={index}
                                        content={<Detaljer vedtak={vedtak} sak={sak} />}
                                        togglePlacement={'right'}
                                    >
                                        <Table.DataCell>{vedtak.rettighet}</Table.DataCell>
                                        <Table.DataCell>{vedtak.type}</Table.DataCell>
                                        <Table.DataCell>{vedtak.utfall}</Table.DataCell>
                                        <Table.DataCell>
                                            {formaterNullableIsoDato(vedtak.fom)} -{' '}
                                            {formaterNullableIsoDato(vedtak.tom)}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {formaterNullableIsoDato(vedtak.datoInnstillt)}
                                        </Table.DataCell>
                                    </Table.ExpandableRow>
                                );
                            })}
                        </Table.Body>
                    </Vedtakstabell>
                )}
            </DataViewer>
        </>
    );
};
