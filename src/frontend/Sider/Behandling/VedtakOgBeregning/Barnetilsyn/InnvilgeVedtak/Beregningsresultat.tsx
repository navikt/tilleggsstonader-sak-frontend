import React, { FC } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import styled from 'styled-components';

import { BodyShort, Label, List, VStack } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';
import '@navikt/ds-css';

import {
    BeregningsresultatTilsynBarn,
    Vedtaksperiode,
} from '../../../../../typer/vedtak/vedtakTilsynBarn';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { Toggle } from '../../../../../utils/toggles';
import { aktivitetTypeTilTekst } from '../../../Inngangsvilkår/Aktivitet/utilsAktivitet';
import { målgruppeTypeTilTekst } from '../../../Inngangsvilkår/typer/vilkårperiode/målgruppe';

const Container = styled.div`
    background-color: ${AWhite};
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, max-content);
    gap: 0.4rem 2rem;
`;

const Vedtaksliste = styled(List)`
    ul {
        margin-block: 0.5rem; // overskriver Aksel pga for mye space i Aksel. default = 1rem
    }
`;

interface Props {
    beregningsresultat: BeregningsresultatTilsynBarn;
}

const formaterVedtaksperiode = (vedtaksperiode: Vedtaksperiode): string => {
    const periode = formaterIsoPeriode(vedtaksperiode.fom, vedtaksperiode.tom);
    const målgruppe = målgruppeTypeTilTekst(vedtaksperiode.målgruppe);
    const aktivitet = aktivitetTypeTilTekst(vedtaksperiode.aktivitet);

    return `${periode} (${målgruppe}, ${aktivitet}, ${vedtaksperiode.antallBarn} barn)`;
};

const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => {
    const kanBrukeVedtaksperioderTilsynBarn = useFlag(Toggle.KAN_BRUKE_VEDTAKSPERIODER_TILSYN_BARN);

    return (
        <VStack gap={'8'}>
            {!kanBrukeVedtaksperioderTilsynBarn && (
                <Vedtaksliste title={'Vedtaksperioder'}>
                    {beregningsresultat.vedtaksperioder.map((vedtaksperiode) => (
                        <List.Item key={vedtaksperiode.fom}>
                            {formaterVedtaksperiode(vedtaksperiode)}
                        </List.Item>
                    ))}
                </Vedtaksliste>
            )}

            <Container>
                <Grid>
                    <Label>Periode</Label>
                    <Label>Barn</Label>
                    <Label>Månedlige utgifter</Label>
                    <Label>Dagsats</Label>
                    <Label>Stønadsbeløp</Label>
                    {beregningsresultat.perioder.map((periode, indeks) => (
                        <React.Fragment key={indeks}>
                            <BodyShort size="small">{periode.grunnlag.måned}</BodyShort>
                            <BodyShort size="small">{periode.grunnlag.antallBarn}</BodyShort>
                            <BodyShort size="small">{periode.grunnlag.utgifterTotal}</BodyShort>
                            <BodyShort size="small">{periode.dagsats}</BodyShort>
                            <BodyShort size="small">{periode.månedsbeløp}</BodyShort>
                        </React.Fragment>
                    ))}
                </Grid>
            </Container>
        </VStack>
    );
};

export default Beregningsresultat;
