import React from 'react';

import styled from 'styled-components';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import {
    EndreAktivitetFormLæremidler,
    VurderingerAktivitetLæremidler,
} from '../EndreAktivitetLæremidler';
import { skalVurdereHarUtgifter } from '../utilsLæremidler';

const Container = styled.div`
    display: flex;
    gap: 2rem;
`;

export const AktivitetDelvilkårLæremidler: React.FC<{
    aktivitetForm: EndreAktivitetFormLæremidler;
    oppdaterVurderinger: (key: keyof VurderingerAktivitetLæremidler, nyttSvar: SvarJaNei) => void;
    readOnly: boolean;
}> = ({ aktivitetForm, oppdaterVurderinger, readOnly }) => {
    if (aktivitetForm.type === '') return null;

    return (
        <Container>
            {skalVurdereHarUtgifter(aktivitetForm.type) && (
                <JaNeiVurdering
                    label="Har bruker utgifter til læremidler?"
                    readOnly={readOnly}
                    svar={aktivitetForm.vurderinger.svarHarUtgifter}
                    oppdaterSvar={(nyttSvar: SvarJaNei) =>
                        oppdaterVurderinger('svarHarUtgifter', nyttSvar)
                    }
                />
            )}
            <JaNeiVurdering
                label="Har bruker rett til utsstyrsstipend?"
                readOnly={readOnly}
                svar={aktivitetForm.vurderinger.svarHarRettTilUtstyrsstipend}
                oppdaterSvar={(nyttSvar: SvarJaNei) =>
                    oppdaterVurderinger('svarHarRettTilUtstyrsstipend', nyttSvar)
                }
            />
        </Container>
    );
};
