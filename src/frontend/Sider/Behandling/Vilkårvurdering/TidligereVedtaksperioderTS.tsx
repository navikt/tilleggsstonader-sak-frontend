import React from 'react';

import { ExpansionCard, Heading } from '@navikt/ds-react';
import { MetaLime100 } from '@navikt/ds-tokens/darkside-js';

import { DetaljerteVedtaksperioder } from '../../../hooks/useHentFullstendigVedtaksOversikt';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { formaterDato } from '../../../utils/dato';
import { DetaljerteVedtaksperioderBehandling } from '../DetaljerteVedtaksperioderBehandling';

type Props = {
    sluttdatoPåVedtakIArena: string | undefined;
    sluttdatoForrigeVedtak: string | undefined;
    stønadstype: Stønadstype;
    vedtaksperioderOversiktForStønad: DetaljerteVedtaksperioder;
};

export function TidligereVedtaksperioderTS({
    sluttdatoPåVedtakIArena,
    sluttdatoForrigeVedtak,
    stønadstype,
    vedtaksperioderOversiktForStønad,
}: Props) {
    return (
        <>
            {vedtaksperioderOversiktForStønad.length > 0 && (
                <ExpansionCard
                    style={{ backgroundColor: MetaLime100 }}
                    size={'small'}
                    aria-labelledby={'Vedtaksperioder for forrige behandling'}
                >
                    <ExpansionCard.Header>
                        <ExpansionCard.Title>
                            <Heading size={'xsmall'} as="span">
                                Søker har vedtak i TS-sak til og med{' '}
                                {formaterDato(sluttdatoForrigeVedtak)}
                            </Heading>
                        </ExpansionCard.Title>
                        {sluttdatoPåVedtakIArena && (
                            <ExpansionCard.Description>
                                Det finnes også et vedtak i Arena til og med{' '}
                                {formaterDato(sluttdatoPåVedtakIArena)}
                            </ExpansionCard.Description>
                        )}
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <DetaljerteVedtaksperioderBehandling
                            stønadstype={stønadstype}
                            vedtaksperioderOversiktForStønad={vedtaksperioderOversiktForStønad}
                        />
                    </ExpansionCard.Content>
                </ExpansionCard>
            )}
        </>
    );
}
