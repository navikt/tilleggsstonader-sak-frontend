import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { useBehandling } from '../../../context/BehandlingContext';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';
import { Stønadstype, stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
import {
    TypeVedtak,
    VedtakResponse,
    ÅrsakAvslag,
    årsakAvslagTilTekst,
    ÅrsakOpphør,
    årsakOpphørTilTekst,
} from '../../../typer/vedtak/vedtak';
import { InnvilgelseBarnetilsyn } from '../../../typer/vedtak/vedtakTilsynBarn';
import { formaterNullablePeriode } from '../../../utils/dato';
import { OppsummeringGruppe } from '../OppsummeringVilkår/OppsummeringGruppe';

export const OppsummeringVedtak = () => {
    const { behandling } = useBehandling();

    const { vedtak } = useVedtak<VedtakResponse>();

    return (
        <DataViewer response={{ vedtak }}>
            {({ vedtak }) => {
                switch (vedtak.type) {
                    case TypeVedtak.AVSLAG:
                        return <OppsummeringAvslag årsaker={vedtak.årsakerAvslag} />;
                    case TypeVedtak.OPPHØR:
                        return <OppsummeringOpphør årsaker={vedtak.årsakerOpphør} />;
                }
                switch (behandling.stønadstype) {
                    case Stønadstype.BARNETILSYN:
                        return (
                            <OppsummeringVedtakTilsynBarn
                                vedtak={vedtak as InnvilgelseBarnetilsyn}
                            />
                        );
                }
                return (
                    <>Har ikke mappet vedtak for {stønadstypeTilTekst[behandling.stønadstype]}</>
                );
            }}
        </DataViewer>
    );
};

// TODO kun vedtaksperioder etter revurder-fra-dato?
const OppsummeringVedtakTilsynBarn = ({ vedtak }: { vedtak: InnvilgelseBarnetilsyn }) => {
    return (
        <OppsummeringGruppe tittel={'Vedtaksperioder'}>
            {vedtak.vedtaksperioder.map((vedtaksperiode) => (
                <BodyShort key={vedtaksperiode.id} size={'small'}>
                    {formaterNullablePeriode(vedtaksperiode.fom, vedtaksperiode.tom)}
                </BodyShort>
            ))}
        </OppsummeringGruppe>
    );
};

const OppsummeringAvslag = ({ årsaker }: { årsaker: ÅrsakAvslag[] }) => {
    return (
        <OppsummeringGruppe tittel={'Avslag'}>
            {årsaker.map((årsak) => (
                <BodyShort key={årsak} size={'small'}>
                    {årsakAvslagTilTekst[årsak]}
                </BodyShort>
            ))}
        </OppsummeringGruppe>
    );
};

const OppsummeringOpphør = ({ årsaker }: { årsaker: ÅrsakOpphør[] }) => {
    return (
        <OppsummeringGruppe tittel={'Opphør'}>
            {årsaker.map((årsak) => (
                <BodyShort key={årsak} size={'small'}>
                    {årsakOpphørTilTekst[årsak]}
                </BodyShort>
            ))}
        </OppsummeringGruppe>
    );
};
