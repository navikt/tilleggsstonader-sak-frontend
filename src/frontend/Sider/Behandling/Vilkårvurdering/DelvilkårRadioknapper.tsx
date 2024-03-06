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
}

const Container = styled.div`
    width: 300px;
`;

const DelvilkårRadioknapper: FC<Props> = ({ regel, vurdering, settVurdering, feilmelding }) => {
    const svaralternativer = Object.keys(regel.svarMapping);
    return (
        <Container>
            <RadioGroup
                legend={regelIdTilSpørsmål[regel.regelId] || regel.regelId}
                description={Spørsmålsbeskrivelse(regel.regelId)}
                value={vurdering.svar || ''}
                size="small"
                error={feilmelding}
            >
                {svaralternativer.map((svarId) => {
                    return (
                        <Radio
                            key={`${regel.regelId}_${svarId}`}
                            name={`${regel.regelId}_${svarId}`}
                            value={svarId}
                            onChange={() =>
                                settVurdering({
                                    svar: svarId,
                                    regelId: regel.regelId,
                                })
                            }
                        >
                            {svarIdTilTekst[svarId] || svarId}
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
