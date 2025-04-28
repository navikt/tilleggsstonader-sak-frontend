import React from 'react';

import { VStack, Label, BodyShort } from '@navikt/ds-react';

import { VilkårOppsummeringRad } from './OppsummeringRad';
import { useBehandling } from '../../../../context/BehandlingContext';
import { OppsummertVedtak } from '../../../../typer/behandling/behandlingOppsummering';
import { TypeVedtak, ÅrsakAvslag, årsakAvslagTilTekst } from '../../../../typer/vedtak/vedtak';
import { Vedtaksperiode } from '../../../../typer/vedtak/vedtakperiode';
import { faktiskMålgruppeTilTekst } from '../../Felles/faktiskMålgruppe';
import { aktivitetTypeTilTekst } from '../../Inngangsvilkår/Aktivitet/utilsAktivitet';

export const VedtakOppsummering: React.FC<{ vedtak: OppsummertVedtak | undefined }> = ({
    vedtak,
}) => {
    if (!vedtak) return null;

    switch (vedtak.resultat) {
        case TypeVedtak.INNVILGELSE:
            return <OppsummeringInnvilgelse vedtaksperioder={vedtak.vedtaksperioder} />;
        case TypeVedtak.AVSLAG:
            return <OppsummeringAvslag årsaker={vedtak.årsaker} />;
        case TypeVedtak.OPPHØR:
            return <OppsummeringOpphør />;
    }
};

const OppsummeringInnvilgelse: React.FC<{
    vedtaksperioder: Vedtaksperiode[];
}> = ({ vedtaksperioder }) => {
    return (
        <VStack gap="2">
            <Label size="small">Innvilget</Label>
            {vedtaksperioder.length > 0 ? (
                vedtaksperioder.map((vedtaksperiode) => (
                    <VilkårOppsummeringRad
                        key={vedtaksperiode.id}
                        fom={vedtaksperiode.fom}
                        tom={vedtaksperiode.tom}
                        gjelder={
                            aktivitetTypeTilTekst(vedtaksperiode.aktivitetType) +
                            ', ' +
                            faktiskMålgruppeTilTekst(vedtaksperiode.målgruppeType)
                        }
                    />
                ))
            ) : (
                <BodyShort size={'small'}>Ingen vedtaksperioder registrert</BodyShort>
            )}
        </VStack>
    );
};

const OppsummeringAvslag: React.FC<{
    årsaker: ÅrsakAvslag[];
}> = ({ årsaker }) => {
    return (
        <VStack gap="2">
            <Label size="small">Avslått</Label>
            <BodyShort size={'small'}>
                Årsaker: {årsaker.map((årsak) => årsakAvslagTilTekst[årsak]).join(', ')}
            </BodyShort>
        </VStack>
    );
};

const OppsummeringOpphør: React.FC = () => {
    const { behandling } = useBehandling();
    return (
        <VStack gap="2">
            <Label size="small">Opphørt</Label>
            <BodyShort size={'small'}>Fra og med: {behandling.revurderFra}</BodyShort>
        </VStack>
    );
};
