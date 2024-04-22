import React from 'react';

import styled from 'styled-components';

import { Textarea } from '@navikt/ds-react';

import { BegrunnelseGrunner, begrunnelseTilTekst } from './utils';

interface Props {
    begrunnelse?: string;
    oppdaterBegrunnelse: (nyBegrunnelse: string) => void;
    delvilkårSomKreverBegrunnelse: BegrunnelseGrunner[];
}

const Liste = styled.ul`
    margin: 0.25rem;
`;

const Begrunnelse: React.FC<Props> = ({
    begrunnelse,
    oppdaterBegrunnelse,
    delvilkårSomKreverBegrunnelse,
}) => {
    const begrunnelseSuffix =
        delvilkårSomKreverBegrunnelse.length > 0 ? '(obligatorisk)' : '(valgfri)';

    return (
        <Textarea
            label={`Begrunnelse ${begrunnelseSuffix}`}
            description={
                delvilkårSomKreverBegrunnelse.length > 0 && (
                    <>
                        Du må begrunne vurderingen av:
                        <Liste>
                            {delvilkårSomKreverBegrunnelse.map((delvilkår, indeks) => (
                                <li key={indeks}>{begrunnelseTilTekst[delvilkår]}</li>
                            ))}
                        </Liste>
                    </>
                )
            }
            value={begrunnelse || ''}
            onChange={(e) => oppdaterBegrunnelse(e.target.value)}
            size="small"
        />
    );
};

export default Begrunnelse;
