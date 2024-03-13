import * as React from 'react';
import { FC } from 'react';

import { styled } from 'styled-components';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { SlikGjørDuVurderingen } from './SlikGjørDuVurderingen';
import { hjelpetekster, regelIdTilSpørsmål, svarIdTilTekst } from './tekster';
import { Regel, SvarId } from '../../../typer/regel';

interface Props {
    regel: Regel;
    gjeldendeSvar: SvarId | undefined;
    settSvar: (nyttSvar: SvarId) => void;
    feilmelding?: string;
    nullstillFeilmelding: (regelId: string) => void;
}

const Container = styled.div`
    width: 400px;
`;

const DelvilkårRadioknapper: FC<Props> = ({
    regel,
    gjeldendeSvar,
    settSvar,
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
                value={gjeldendeSvar || ''}
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
                                settSvar(svar);
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
            return <SlikGjørDuVurderingen regelId={regelId} />;
        case 'ANNEN_FORELDER_MOTTAR_STØTTE':
            return hjelpetekster[regelId][0];
        default:
            return null;
    }
};

export default DelvilkårRadioknapper;
