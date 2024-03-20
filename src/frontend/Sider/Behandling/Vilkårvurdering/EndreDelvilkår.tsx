import React, { FC, useState } from 'react';

import styled from 'styled-components';

import { Button, HStack, VStack } from '@navikt/ds-react';
import { ABorderAction } from '@navikt/ds-tokens/dist/tokens';

import Begrunnelse from './Begrunnelse';
import DelvilkårRadioknapper from './DelvilkårRadioknapper';
import { vurderAvhengighetTilOverordnetValg } from './utils';
import { Feilmeldinger, validerVilkårsvurdering } from './validering';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import { erTomtObjekt } from '../../../typer/typeUtils';
import { RegelId, SvarId, Vilkårsvurdering } from '../vilkår';

const LagreKnapp = styled(Button)`
    margin-top: 1rem;
`;

const DelvilkårContainer = styled.div<{ $erUndervilkår: boolean }>`
    border-left: ${({ $erUndervilkår }) =>
        $erUndervilkår ? `5px solid ${ABorderAction}` : 'none'};
    padding-left: ${({ $erUndervilkår }) => ($erUndervilkår ? '1rem' : '0')};
    gap: ${({ $erUndervilkår }) => ($erUndervilkår ? `5rem` : `6rem`)};
    display: flex;

    @media (max-width: 900px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

const EndreDelvilkår: FC<{
    vilkårsvurdering: Vilkårsvurdering;
    lagreVilkårsvurdering: (vurdering: Vilkårsvurdering) => void;
}> = ({ lagreVilkårsvurdering, vilkårsvurdering }) => {
    const [vurdering, settVurdering] = useState<Vilkårsvurdering>(vilkårsvurdering);
    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>({});

    const validerOgLagreVilkårsvurdering = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const valideringsfeil = validerVilkårsvurdering(vurdering);
        settFeilmeldinger(valideringsfeil);

        if (erTomtObjekt(valideringsfeil)) {
            lagreVilkårsvurdering(vurdering);
        }
    };

    const nullstillFeilmelding = (regelId: string) => {
        settFeilmeldinger({ ...feilmeldinger, [regelId]: undefined });
    };

    const oppdaterSvar = (regel: RegelId, nyttSvar: SvarId) =>
        settVurdering((prevState) => {
            return {
                ...prevState,
                [regel]: {
                    ...prevState[regel],
                    ...{ svar: nyttSvar },
                },
            };
        });

    const oppdaterBegrunnelse = (regel: RegelId, nyBegrunnelse: string) => {
        settVurdering((prevState) => {
            return {
                ...prevState,
                [regel]: {
                    ...prevState[regel],
                    ...{ begrunnelse: nyBegrunnelse },
                },
            };
        });
    };

    return (
        <form onSubmit={validerOgLagreVilkårsvurdering}>
            <VStack gap="4">
                {Object.entries(vurdering).map(([regel, delvilkårsvurdering], indeks) => {
                    const { følgerAvOverordnetValg, valgetErOppfylt } =
                        vurderAvhengighetTilOverordnetValg(vurdering, regel);

                    if (følgerAvOverordnetValg && !valgetErOppfylt) {
                        return;
                    }

                    const svar = delvilkårsvurdering.svar;

                    const begrunnelsestype = svar
                        ? delvilkårsvurdering.svaralternativer[svar]?.begrunnelsestype
                        : 'VALGFRI';

                    return (
                        <React.Fragment key={regel}>
                            {indeks !== 0 && !følgerAvOverordnetValg && <Skillelinje />}
                            <DelvilkårContainer $erUndervilkår={følgerAvOverordnetValg}>
                                <DelvilkårRadioknapper
                                    regel={regel}
                                    svaralternativer={delvilkårsvurdering.svaralternativer}
                                    gjeldendeSvar={svar}
                                    settSvar={(nyttSvar) => oppdaterSvar(regel, nyttSvar)}
                                    feilmelding={feilmeldinger[regel]}
                                    nullstillFeilmelding={nullstillFeilmelding}
                                />
                                <Begrunnelse
                                    gjeldendeBegrunnelse={delvilkårsvurdering.begrunnelse}
                                    begrunnelsestype={begrunnelsestype}
                                    settBegrunnelse={(begrunnelse) =>
                                        oppdaterBegrunnelse(regel, begrunnelse || '')
                                    }
                                />
                            </DelvilkårContainer>
                        </React.Fragment>
                    );
                })}
                <HStack gap="1">
                    <Skillelinje />
                    <LagreKnapp size={'small'} style={{ maxWidth: 'fit-content' }}>
                        Lagre
                    </LagreKnapp>
                </HStack>
            </VStack>
        </form>
    );
};
export default EndreDelvilkår;
