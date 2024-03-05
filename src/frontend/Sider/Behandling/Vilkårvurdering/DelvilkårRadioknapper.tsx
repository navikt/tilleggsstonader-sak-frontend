import * as React from 'react';
import { FC } from 'react';

import { styled } from 'styled-components';

import { BodyShort, Radio, RadioGroup, ReadMore } from '@navikt/ds-react';

import { svarIdTilTekst } from './tekster';
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
                legend={mapRegelIdTilDelvilkårLabel(regel.regelId)}
                value={vurdering.svar || ''}
                size="small"
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

const mapRegelIdTilDelvilkårLabel = (regelId: string): React.ReactNode => {
    switch (regelId) {
        case 'UTGIFTER_DOKUMENTERT':
            return (
                <>
                    Er utgifter til pass tilfredsstillende dokumentert?
                    <ReadMore size="small" header={'Slik gjør du vurderingen'}>
                        Hva skal stå her?🤷‍
                    </ReadMore>
                </>
            );
        case 'ANNEN_FORELDER_MOTTAR_STØTTE':
            return (
                <>
                    Mottar den andre forelderen støtte til pass av barnet?
                    <BodyShort size="small">Dette inkluderer både søker og foresatt</BodyShort>
                </>
            );
        case 'HAR_ALDER_LAVERE_ENN_GRENSEVERDI':
            return 'Er barnet ferdig med 4. skoleår?';
        case 'UNNTAK_ALDER':
            return 'Har barnet behov for pass utover 4. skoleår, og er behovet tilfredsstillende dokumentert?';
        default:
            return `${regelId} mangler mapping`;
    }
};

export default DelvilkårRadioknapper;
