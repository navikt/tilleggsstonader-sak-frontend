import React, { FC, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button, HStack, VStack } from '@navikt/ds-react';
import { ABorderAction } from '@navikt/ds-tokens/dist/tokens';

import Begrunnelse from './Begrunnelse';
import DelvilkårRadioknapper from './DelvilkårRadioknapper';
import { mapTilVurderingInput, oppdaterVurderinger } from './oppdatering';
import { delvilkårSomErRelevante } from './utils';
import { Feilmeldinger, validerVilkårsvurdering } from './validering';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import { erTomtObjekt } from '../../../typer/typeUtils';
import { RegelId, VurderingInput, Delvilkårsett, SvarId } from '../vilkår';

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
    delvilkårsett: Delvilkårsett;
    oppdaterVilkår: (oppdaterteDelvilkår: Delvilkårsett) => void;
}> = ({ oppdaterVilkår, delvilkårsett }) => {
    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>({});

    const [vurderingInput, settVurderingInput] = useState<VurderingInput>(
        mapTilVurderingInput(delvilkårsett)
    );

    useEffect(() => {
        settVurderingInput(mapTilVurderingInput(delvilkårsett));
    }, [delvilkårsett]);

    const oppdaterteVurderinger = oppdaterVurderinger(delvilkårsett, vurderingInput);

    const validerOgLagreVilkårsvurdering = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const valideringsfeil = validerVilkårsvurdering(oppdaterteVurderinger);
        settFeilmeldinger(valideringsfeil);

        if (erTomtObjekt(valideringsfeil)) {
            oppdaterVilkår(oppdaterteVurderinger);
        }
    };

    const oppdaterSvar = (regelId: RegelId, nyttSvar: SvarId) => {
        settVurderingInput({
            ...vurderingInput,
            [regelId]: { ...vurderingInput[regelId], svar: nyttSvar || null },
        });
    };

    const oppdaterBegrunnelse = (regelId: RegelId, nyBegrunnelse?: string) => {
        settVurderingInput({
            ...vurderingInput,
            [regelId]: { ...vurderingInput[regelId], begrunnelse: nyBegrunnelse || null },
        });
    };

    const nullstillFeilmelding = (regelId: string) => {
        settFeilmeldinger({ ...feilmeldinger, [regelId]: undefined });
    };

    return (
        <form onSubmit={validerOgLagreVilkårsvurdering}>
            <VStack gap="4">
                {delvilkårSomErRelevante(oppdaterteVurderinger).map(
                    ([regel, delvilkår], indeks) => {
                        const gjeldendeSvar = delvilkår.svar;

                        const begrunnelsestype = gjeldendeSvar
                            ? delvilkår.svaralternativer[gjeldendeSvar]?.begrunnelsestype
                            : 'VALGFRI';

                        const følgerFraOverordnetValg = delvilkår.følgerFraOverordnetValg !== null;

                        return (
                            <React.Fragment key={regel}>
                                {indeks !== 0 && !følgerFraOverordnetValg && <Skillelinje />}
                                <DelvilkårContainer $erUndervilkår={følgerFraOverordnetValg}>
                                    <DelvilkårRadioknapper
                                        regelId={regel}
                                        svaralternativer={delvilkår.svaralternativer}
                                        gjeldendeSvar={gjeldendeSvar}
                                        settSvar={(nyttSvar) => oppdaterSvar(regel, nyttSvar)}
                                        feilmelding={feilmeldinger[regel]}
                                        nullstillFeilmelding={nullstillFeilmelding}
                                    />
                                    <Begrunnelse
                                        gjeldendeBegrunnelse={delvilkår.begrunnelse || undefined}
                                        begrunnelsestype={begrunnelsestype}
                                        settBegrunnelse={(begrunnelse) =>
                                            oppdaterBegrunnelse(regel, begrunnelse)
                                        }
                                    />
                                </DelvilkårContainer>
                            </React.Fragment>
                        );
                    }
                )}
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
