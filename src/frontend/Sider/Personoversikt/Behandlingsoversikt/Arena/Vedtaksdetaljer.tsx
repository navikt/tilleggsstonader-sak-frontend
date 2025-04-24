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

const Begrunnelse = styled(BodyLong)`
    white-space: pre-wrap;
`;

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
            <BodyShort>{aktivitet.type}</BodyShort>
            <BodyShort>Status: {aktivitet.status}</BodyShort>
            <BodyShort>Periode: {formaterNullablePeriode(aktivitet.fom, aktivitet.tom)}</BodyShort>
            {aktivitet.gjelderUtdanning && <BodyShort>Utdanning</BodyShort>}
            {aktivitet.beskrivelse && <BodyShort>Beskrivelse: {aktivitet.beskrivelse}</BodyShort>}
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
                        <Table.DataCell>
                            <strong>{info[0]}</strong>
                        </Table.DataCell>
                        <Table.DataCell>{info[1]}</Table.DataCell>
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
        return <>Mangler begrunnelse</>;
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
                    <Table.HeaderCell scope="col">Vilkår</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Vurdering</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Vurdert av</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtak.vilkårsvurderinger.map((vilkårsvurdering, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell>{vilkårsvurdering.vilkår}</Table.DataCell>
                        <Table.DataCell>{vilkårsvurdering.vurdering}</Table.DataCell>
                        <Table.DataCell>{vilkårsvurdering.vurdertAv}</Table.DataCell>
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
                    <Table.HeaderCell scope="col">Vedtaksfakta</Table.HeaderCell>
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
    );
}

function Spesialutbetalinger({ vedtak }: { vedtak: ArenaVedtak }) {
    if (!vedtak.spesialutbetalinger.length) {
        return null;
    }
    return (
        <div>
            <Heading size={'small'} level={'3'}>
                Spesialutbetalinger
            </Heading>
            <Table size={'small'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Dato fra</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Dato til</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Beløp</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Utbet.dato</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Saksbeh.</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Opprettet dato</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Endret dato</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Begrunnelse</Table.HeaderCell>
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
            <Table.DataCell>{formaterIsoDato(spesialutbetaling.fom)}</Table.DataCell>
            <Table.DataCell>{formaterIsoDato(spesialutbetaling.tom)}</Table.DataCell>
            <Table.DataCell>{formaterTallMedTusenSkille(spesialutbetaling.belop)}</Table.DataCell>
            <Table.DataCell>{formaterIsoDato(spesialutbetaling.datoUtbetaling)}</Table.DataCell>
            <Table.DataCell>{spesialutbetaling.status}</Table.DataCell>
            <Table.DataCell>{spesialutbetaling.saksbehandler}</Table.DataCell>
            <Table.DataCell>{formaterIsoDato(spesialutbetaling.opprettetDato)}</Table.DataCell>
            <Table.DataCell>{spesialutbetaling.beslutter}</Table.DataCell>
            <Table.DataCell>{formaterIsoDato(spesialutbetaling.endretDato)}</Table.DataCell>
            <Table.DataCell>
                {harVerdi(spesialutbetaling.begrunnelse) ? (
                    <Button variant={'tertiary'} size={'small'} onClick={() => setOpen(!open)}>
                        {!open ? 'Vis' : 'Skjul'}
                    </Button>
                ) : (
                    'Ingen begrunnelse'
                )}
            </Table.DataCell>
        </Table.ExpandableRow>
    );
}
