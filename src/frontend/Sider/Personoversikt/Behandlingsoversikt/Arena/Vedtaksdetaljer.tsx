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
                        <Table.DataCell textSize={'small'}>
                            <strong>{info[0]}</strong>
                        </Table.DataCell>
                        <Table.DataCell textSize={'small'}>{info[1]}</Table.DataCell>
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
                    <Table.HeaderCell scope="col" textSize={'small'}>
                        Vilkår
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col" textSize={'small'}>
                        Vurdering
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col" textSize={'small'}>
                        Vurdert av
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtak.vilkårsvurderinger.map((vilkårsvurdering, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell textSize={'small'}>
                            {vilkårsvurdering.vilkår}
                        </Table.DataCell>
                        <Table.DataCell textSize={'small'}>
                            {vilkårsvurdering.vurdering}
                        </Table.DataCell>
                        <Table.DataCell textSize={'small'}>
                            {vilkårsvurdering.vurdertAv}
                        </Table.DataCell>
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
                    <Table.HeaderCell scope="col" textSize={'small'}>
                        Vedtaksfakta
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col" textSize={'small'}>
                        Verdi
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtak.vedtakfakta.map((fakta, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell textSize={'small'}>{fakta.type}</Table.DataCell>
                        <Table.DataCell textSize={'small'}>{fakta.verdi}</Table.DataCell>
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
            <Table.DataCell textSize={'small'}>
                {formaterIsoDato(spesialutbetaling.fom)}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>
                {formaterIsoDato(spesialutbetaling.tom)}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>
                {formaterTallMedTusenSkille(spesialutbetaling.belop)}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>
                {formaterIsoDato(spesialutbetaling.datoUtbetaling)}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>{spesialutbetaling.status}</Table.DataCell>
            <Table.DataCell textSize={'small'}>{spesialutbetaling.saksbehandler}</Table.DataCell>
            <Table.DataCell textSize={'small'}>
                {formaterIsoDato(spesialutbetaling.opprettetDato)}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>{spesialutbetaling.beslutter}</Table.DataCell>
            <Table.DataCell textSize={'small'}>
                {formaterIsoDato(spesialutbetaling.endretDato)}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>
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
