import React, { useState } from 'react';

import styled from 'styled-components';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, Button, Heading, Table, VStack } from '@navikt/ds-react';

import { ArenaSak, ArenaVedtak, Spesialutbetaling } from './vedtakArena';
import {
    formaterIsoDato,
    formaterNullableIsoDato,
    formaterNullablePeriode,
} from '../../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../../utils/fomatering';
import { harVerdi } from '../../../../utils/utils';

const Vedtakinfotabell = styled(Table)`
    max-width: fit-content;
`;

const Begrunnelse = styled(BodyLong).attrs({ size: 'small' })`
    white-space: pre-wrap;
`;

const HeaderCellCol = styled(Table.HeaderCell).attrs({ scope: 'col', textSize: 'small' })``;
const DataCell = styled(Table.DataCell).attrs({ textSize: 'small' })``;

export function Vedtaksdetaljer({
    vedtak,
    sak,
}: {
    vedtak: ArenaVedtak;
    sak: ArenaSak | undefined;
}) {
    return (
        <VStack gap={'8'}>
            <Vedtaksinfo vedtak={vedtak} sak={sak} />
            <Vedtaksfakta vedtak={vedtak} />
            <Vilkårsvurderinger vedtak={vedtak} />
            <Spesialutbetalinger vedtak={vedtak} />
        </VStack>
    );
}

const formaterAktivitet = function (sak: ArenaSak | undefined) {
    const aktivitet = sak?.aktivitet;
    if (!aktivitet) return undefined;
    return (
        <>
            <BodyShort size={'small'}>{aktivitet.type}</BodyShort>
            <BodyShort size={'small'}>Status: {aktivitet.status}</BodyShort>
            <BodyShort size={'small'}>
                Periode: {formaterNullablePeriode(aktivitet.fom, aktivitet.tom)}
            </BodyShort>
            {aktivitet.gjelderUtdanning && <BodyShort size={'small'}>Utdanning</BodyShort>}
            {aktivitet.beskrivelse && (
                <Begrunnelse>Beskrivelse: {aktivitet.beskrivelse}</Begrunnelse>
            )}
        </>
    );
};

function Vedtaksinfo({ vedtak, sak }: { vedtak: ArenaVedtak; sak: ArenaSak | undefined }) {
    type Vedtakinfo = [string, React.ReactNode | string | number | undefined];

    const vedtakinfo: Vedtakinfo[] = [
        ['Sak', vedtak.sakId],
        ['Saksbehandler', vedtak.saksbehandler],
        ['Beslutter', vedtak.beslutter],
        ['Dato mottatt', formaterNullableIsoDato(vedtak.datoMottatt)],
        ['Målgruppe', sak?.målgruppe],
        ['Aktivitet', formaterAktivitet(sak)],
        ['Begrunnelse', <BegrunnelseVedtak key={null} vedtak={vedtak} />],
    ];
    return (
        <Vedtakinfotabell size={'small'}>
            <Table.Body>
                {vedtakinfo.map((info) => (
                    <Table.Row key={info[0]}>
                        <DataCell>
                            <strong>{info[0]}</strong>
                        </DataCell>
                        <DataCell>{info[1]}</DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Vedtakinfotabell>
    );
}

function BegrunnelseVedtak({ vedtak }: { vedtak: ArenaVedtak }) {
    const begrunnelseMaksTegn = 300;
    const [visHele, settVisHele] = useState(false);
    const begrunnelse = vedtak.begrunnelse;
    if (!harVerdi(begrunnelse)) {
        return <BodyShort size={'small'}>Mangler begrunnelse</BodyShort>;
    }

    return (
        <>
            {!visHele && begrunnelse.length > begrunnelseMaksTegn ? (
                <Begrunnelse>{begrunnelse.substring(0, begrunnelseMaksTegn)}...</Begrunnelse>
            ) : (
                <Begrunnelse>{begrunnelse}</Begrunnelse>
            )}
            {begrunnelse.length > begrunnelseMaksTegn && (
                <Button
                    size={'small'}
                    variant={'secondary-neutral'}
                    icon={visHele ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    iconPosition={'right'}
                    onClick={() => settVisHele(!visHele)}
                >
                    {visHele ? 'Vis mindre' : 'Vis mer'}
                </Button>
            )}
        </>
    );
}

function Vilkårsvurderinger({ vedtak }: { vedtak: ArenaVedtak }) {
    if (!vedtak.vilkårsvurderinger.length) {
        return null;
    }
    return (
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <HeaderCellCol>Vilkår</HeaderCellCol>
                    <HeaderCellCol>Vurdering</HeaderCellCol>
                    <HeaderCellCol>Vurdert av</HeaderCellCol>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtak.vilkårsvurderinger.map((vilkårsvurdering, index) => (
                    <Table.Row key={index}>
                        <DataCell>{vilkårsvurdering.vilkår}</DataCell>
                        <DataCell>{vilkårsvurdering.vurdering}</DataCell>
                        <DataCell>{vilkårsvurdering.vurdertAv}</DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

function Vedtaksfakta({ vedtak }: { vedtak: ArenaVedtak }) {
    if (!vedtak.vedtakfakta.length) {
        return null;
    }
    return (
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <HeaderCellCol>Vedtaksfakta</HeaderCellCol>
                    <HeaderCellCol>Verdi</HeaderCellCol>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtak.vedtakfakta.map((fakta, index) => (
                    <Table.Row key={index}>
                        <DataCell>{fakta.type}</DataCell>
                        <DataCell>{fakta.verdi}</DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

function Spesialutbetalinger({ vedtak }: { vedtak: ArenaVedtak }) {
    return (
        <div>
            <Heading size={'small'} level={'3'}>
                Spesialutbetalinger
            </Heading>
            {vedtak.spesialutbetalinger.length === 0 && (
                <BodyShort size={'small'}>Ingen spesialutbetalinger</BodyShort>
            )}
            {vedtak.spesialutbetalinger.length > 0 && (
                <Table size={'small'}>
                    <Table.Header>
                        <Table.Row>
                            <HeaderCellCol>Dato fra</HeaderCellCol>
                            <HeaderCellCol>Dato til</HeaderCellCol>
                            <HeaderCellCol>Beløp</HeaderCellCol>
                            <HeaderCellCol>Utbet.dato</HeaderCellCol>
                            <HeaderCellCol>Status</HeaderCellCol>
                            <HeaderCellCol>Saksbeh.</HeaderCellCol>
                            <HeaderCellCol>Opprettet dato</HeaderCellCol>
                            <HeaderCellCol>Beslutter</HeaderCellCol>
                            <HeaderCellCol>Endret dato</HeaderCellCol>
                            <HeaderCellCol>Begrunnelse</HeaderCellCol>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {vedtak.spesialutbetalinger.map((spesialutbetaling) => (
                            <SpesialutbetalingRad
                                key={spesialutbetaling.spesialutbetalingId}
                                spesialutbetaling={spesialutbetaling}
                            />
                        ))}
                    </Table.Body>
                </Table>
            )}
        </div>
    );
}

function SpesialutbetalingRad({ spesialutbetaling }: { spesialutbetaling: Spesialutbetaling }) {
    const [open, setOpen] = useState(false);
    return (
        <Table.ExpandableRow
            content={<Begrunnelse>{spesialutbetaling.begrunnelse}</Begrunnelse>}
            togglePlacement={'right'}
            expansionDisabled={true}
            open={open}
        >
            <DataCell>{formaterIsoDato(spesialutbetaling.fom)}</DataCell>
            <DataCell>{formaterIsoDato(spesialutbetaling.tom)}</DataCell>
            <DataCell>{formaterTallMedTusenSkille(spesialutbetaling.belop)}</DataCell>
            <DataCell>{formaterIsoDato(spesialutbetaling.datoUtbetaling)}</DataCell>
            <DataCell>{spesialutbetaling.status}</DataCell>
            <DataCell>{spesialutbetaling.saksbehandler}</DataCell>
            <DataCell>{formaterIsoDato(spesialutbetaling.opprettetDato)}</DataCell>
            <DataCell>{spesialutbetaling.beslutter}</DataCell>
            <DataCell>{formaterIsoDato(spesialutbetaling.endretDato)}</DataCell>
            <DataCell>
                {harVerdi(spesialutbetaling.begrunnelse) ? (
                    <Button variant={'tertiary'} size={'small'} onClick={() => setOpen(!open)}>
                        {!open ? 'Vis' : 'Skjul'}
                    </Button>
                ) : (
                    'Ingen begrunnelse'
                )}
            </DataCell>
        </Table.ExpandableRow>
    );
}
