import * as React from 'react';
import { FC } from 'react';

import { styled } from 'styled-components';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { SlikGjørDuVurderingen } from './SlikGjørDuVurderingen';
import { regelIdTilSpørsmål, hjelpetekster, svarIdTilTekst } from './tekster';
import { Regel } from '../../../typer/regel';
import { Vurdering } from '../vilkår';

interface Props {
    regel: Regel;
    vurdering: Vurdering;
    settVurdering: (nyttSvar: Vurdering) => void;
}

const Container = styled.div`
    width: 400px;
`;

const DelvilkårRadioknapper: FC<Props> = ({ regel, vurdering, settVurdering }) => {
    const svaralternativer = Object.keys(regel.svarMapping);
    return (
        <Container>
            <RadioGroup
                legend={regelIdTilSpørsmål[regel.regelId] || regel.regelId}
                description={Spørsmålsbeskrivelse(regel.regelId)}
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

const Spørsmålsbeskrivelse = (regelId: string): React.ReactNode => {
    switch (regelId) {
        case 'UTGIFTER_DOKUMENTERT':
            return <SlikGjørDuVurderingen regelId={regelId} />;
        case 'ANNEN_FORELDER_MOTTAR_STØTTE':
            return hjelpetekster[regelId][0];
        default:
            return null;
    }
};

export default DelvilkårRadioknapper;
