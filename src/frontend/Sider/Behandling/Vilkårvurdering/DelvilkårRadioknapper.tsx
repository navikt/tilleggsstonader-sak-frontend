import * as React from 'react';
import { FC } from 'react';

import { styled } from 'styled-components';

import { Radio, RadioGroup, ReadMore } from '@navikt/ds-react';

import { regelIdTilSpørsmål, regelIdTilSpørsmålsbeskrivelse, svarIdTilTekst } from './tekster';
import { Regel } from '../../../typer/regel';
import { Vurdering } from '../vilkår';

interface Props {
    regel: Regel;
    vurdering: Vurdering;
    settVurdering: (nyttSvar: Vurdering) => void;
    feilmelding?: string;
    nullstillFeilmelding: (regelId: string) => void;
}

const Container = styled.div`
    width: 300px;
`;

const DelvilkårRadioknapper: FC<Props> = ({
    regel,
    vurdering,
    settVurdering,
    feilmelding,
    nullstillFeilmelding,
}) => {
    const svaralternativer = Object.keys(regel.svarMapping);
    const regelId = regel.regelId;
    return (
        <Container>
            <RadioGroup
                legend={regelIdTilSpørsmål[regelId] || regelId}
                description={Spørsmålsbeskrivelse(regelId)}
                value={vurdering.svar || ''}
                size="small"
                error={feilmelding}
            >
                {svaralternativer.map((svar) => {
                    return (
                        <Radio
                            key={`${regelId}_${svar}`}
                            name={`${regelId}_${svar}`}
                            value={svar}
                            onChange={() => {
                                settVurdering({ svar, regelId });
                                nullstillFeilmelding(regelId);
                            }}
                        >
                            {svarIdTilTekst[svar] || svar}
                        </Radio>
                    );
                })}
            </RadioGroup>
        </Container>
    );
};

const Spørsmålsbeskrivelse = (regelId: string): React.ReactNode => {
    switch (regelId) {
        case 'UTGIFTER_DOKUMENTERT':
            return (
                <ReadMore size="small" header="Slik gjør du vurderingen">
                    {regelIdTilSpørsmålsbeskrivelse[regelId]}
                </ReadMore>
            );
        case 'ANNEN_FORELDER_MOTTAR_STØTTE':
            return regelIdTilSpørsmålsbeskrivelse[regelId];
        default:
            return null;
    }
};

export default DelvilkårRadioknapper;
