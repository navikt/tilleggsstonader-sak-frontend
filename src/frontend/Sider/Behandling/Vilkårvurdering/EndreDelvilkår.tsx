import React, { FC, useState } from 'react';

import styled from 'styled-components';

import { Button, HStack, VStack } from '@navikt/ds-react';
import { ABorderAction } from '@navikt/ds-tokens/dist/tokens';

import Begrunnelse from './Begrunnelse';
import DelvilkårRadioknapper from './DelvilkårRadioknapper';
import { Feilmeldinger, validerVilkårsvurdering } from './validering';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import { BegrunnelseRegel, BegrunnelseType, RegelId, SvarId } from '../../../typer/regel';
import { erTomtObjekt } from '../../../typer/typeUtils';
import { Vilkårsvurdering } from '../vilkår';

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
    settVilkårsvurdering: (delvilkår: Vilkårsvurdering) => void;
}> = ({ settVilkårsvurdering, vilkårsvurdering }) => {
    const [vilkårsvurderinger, settVilkårsvurderinger] =
        useState<Vilkårsvurdering>(vilkårsvurdering);

    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>({});

    const validerOgLagreVilkårsvurdering = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const valideringsfeil = validerVilkårsvurdering(vilkårsvurderinger);
        settFeilmeldinger(valideringsfeil);

        if (erTomtObjekt(valideringsfeil)) {
            settVilkårsvurdering(vilkårsvurdering);
        }
    };

    const nullstillFeilmelding = (regelId: string) => {
        settFeilmeldinger({ ...feilmeldinger, [regelId]: undefined });
    };

    const oppdaterVurdering = (
        regelId: RegelId,
        nyttSvar?: SvarId,
        nyBegrunnelse?: BegrunnelseType
    ) => {
        settVilkårsvurderinger((prevState) => {
            const vurderingSomSkalOppdateres = prevState[regelId];

            if (nyttSvar) {
                vurderingSomSkalOppdateres.svar = nyttSvar;
            }

            if (nyBegrunnelse) {
                vurderingSomSkalOppdateres.begrunnelse = nyBegrunnelse;
            }

            return { ...prevState, [regelId]: vurderingSomSkalOppdateres };
        });
    };

    return (
        <form onSubmit={validerOgLagreVilkårsvurdering}>
            <VStack gap="4">
                {Object.entries(vilkårsvurderinger).map(([regel, delvilkårsvurdering], indeks) => {
                    const svar = delvilkårsvurdering.svar;

                    const begrunnelsestype = svar
                        ? delvilkårsvurdering.svaralternativer[svar].begrunnelsesType
                        : BegrunnelseRegel.VALGFRI;

                    const erUndervilkår = delvilkårsvurdering.følgerFraAnnenRegel !== null;

                    return (
                        <React.Fragment key={self.crypto.randomUUID()}>
                            {indeks !== 0 && !erUndervilkår && <Skillelinje />}
                            <DelvilkårContainer $erUndervilkår={erUndervilkår}>
                                <DelvilkårRadioknapper
                                    regel={regel}
                                    svaralternativer={delvilkårsvurdering.svaralternativer}
                                    gjeldendeSvar={svar}
                                    settSvar={(nyttSvar) => oppdaterVurdering(regel, nyttSvar)}
                                    feilmelding={feilmeldinger[regel]}
                                    nullstillFeilmelding={nullstillFeilmelding}
                                />
                                <Begrunnelse
                                    gjeldendeBegrunnelse={delvilkårsvurdering.begrunnelse}
                                    typeBegrunnelse={begrunnelsestype}
                                    settBegrunnelse={(begrunnelse) =>
                                        oppdaterVurdering(regel, begrunnelse)
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
