import * as React from 'react';
import { FC } from 'react';

import { styled } from 'styled-components';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { regelIdTilTekst, svarIdTilTekst } from './tekster';
import { Regel } from '../../../typer/regel';
import { Vurdering } from '../vilkår';

interface Props {
    regel: Regel;
    vurdering: Vurdering;
    settVurdering: (nyttSvar: Vurdering) => void;
}

const Container = styled.div`
    width: 300px;
`;

const DelvilkårRadioknapper: FC<Props> = ({ regel, vurdering, settVurdering }) => {
    const svaralternativer = Object.keys(regel.svarMapping);
    return (
        <Container>
            <RadioGroup
                legend={regelIdTilTekst[regel.regelId] || `${regel.regelId} mangler mapping`}
                value={vurdering.svar || ''}
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

export default DelvilkårRadioknapper;
