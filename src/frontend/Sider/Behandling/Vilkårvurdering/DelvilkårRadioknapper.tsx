import * as React from 'react';
import { FC } from 'react';

import { styled } from 'styled-components';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { SlikGjørDuVurderingen } from './SlikGjørDuVurderingen';
import { hjelpetekster, regelIdTilSpørsmål, svarIdTilTekst } from './tekster';
import { SvarId } from '../../../typer/regel';
import { Svaralternativer } from '../vilkår';

interface Props {
    regel: string;
    svaralternativer: Svaralternativer;
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
    svaralternativer,
    gjeldendeSvar,
    settSvar,
    feilmelding,
    nullstillFeilmelding,
}) => {
    return (
        <Container>
            <RadioGroup
                legend={regelIdTilSpørsmål[regel] || regel}
                description={Spørsmålsbeskrivelse(regel)}
                value={gjeldendeSvar || ''}
                size="small"
                error={feilmelding}
            >
                {Object.keys(svaralternativer).map((svaralternativ) => {
                    return (
                        <Radio
                            key={`${regel}_${svaralternativ}`}
                            name={`${regel}_${svaralternativ}`}
                            value={svaralternativ}
                            onChange={() => {
                                settSvar(svaralternativ);
                                nullstillFeilmelding(regel);
                            }}
                        >
                            {svarIdTilTekst[svaralternativ] || svaralternativ}
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
