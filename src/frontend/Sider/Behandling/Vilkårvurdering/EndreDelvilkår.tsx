import React, { FC, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button, HStack, VStack } from '@navikt/ds-react';
import { ABorderAction } from '@navikt/ds-tokens/dist/tokens';

import Begrunnelse from './Begrunnelse';
import DelvilkårRadioknapper from './DelvilkårRadioknapper';
import { oppdaterVilkårsvurderinger } from './oppdatering';
import { delvilkårSomSkalVises } from './utils';
import { Feilmeldinger, validerVilkårsvurdering } from './validering';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import { erTomtObjekt } from '../../../typer/typeUtils';
import { RegelId, VurderingInput, Vilkårsvurdering } from '../vilkår';

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
    lagreVilkårsvurdering: (svarsett: VurderingInput, begrunnelser: VurderingInput) => void;
}> = ({ lagreVilkårsvurdering, vilkårsvurdering }) => {
    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>({});
    const [begrunnelser, settBegrunnelser] = useState<VurderingInput>(
        Object.fromEntries(
            Object.entries(vilkårsvurdering).map(([regelId, delvilkårsvurdering]) => [
                regelId,
                delvilkårsvurdering?.begrunnelse,
            ])
        )
    );
    const [svarsett, settSvarsett] = useState<VurderingInput>(
        Object.fromEntries(
            Object.entries(vilkårsvurdering).map(([regelId, delvilkårsvurdering]) => [
                regelId,
                delvilkårsvurdering?.svar,
            ])
        )
    );

    useEffect(() => {
        settSvarsett(
            Object.fromEntries(
                Object.entries(vilkårsvurdering).map(([regelId, delvilkårsvurdering]) => [
                    regelId,
                    delvilkårsvurdering?.svar,
                ])
            )
        );
        settBegrunnelser(
            Object.fromEntries(
                Object.entries(vilkårsvurdering).map(([regelId, delvilkårsvurdering]) => [
                    regelId,
                    delvilkårsvurdering?.begrunnelse,
                ])
            )
        );
    }, [vilkårsvurdering]);

    const validerOgLagreVilkårsvurdering = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const valideringsfeil = validerVilkårsvurdering(
            oppdaterVilkårsvurderinger(vilkårsvurdering, svarsett, begrunnelser)
        );
        settFeilmeldinger(valideringsfeil);

        if (erTomtObjekt(valideringsfeil)) {
            lagreVilkårsvurdering(svarsett, begrunnelser);
        }
    };

    const oppdaterSvar = (regelId: RegelId, nyttSvar: string) => {
        settSvarsett({ ...svarsett, [regelId]: nyttSvar || null });
    };

    const oppdaterBegrunnelse = (regelId: RegelId, nyBegrunnelse?: string) => {
        settBegrunnelser({ ...begrunnelser, [regelId]: nyBegrunnelse || null });
    };

    const nullstillFeilmelding = (regelId: string) => {
        settFeilmeldinger({ ...feilmeldinger, [regelId]: undefined });
    };

    return (
        <form onSubmit={validerOgLagreVilkårsvurdering}>
            <VStack gap="4">
                {delvilkårSomSkalVises(
                    oppdaterVilkårsvurderinger(vilkårsvurdering, svarsett, begrunnelser)
                ).map(([regel, delvilkårsvurdering], indeks) => {
                    const gjeldendeSvar = svarsett[regel];

                    const begrunnelsestype = gjeldendeSvar
                        ? delvilkårsvurdering.svaralternativer[gjeldendeSvar]?.begrunnelsestype
                        : 'VALGFRI';

                    const følgerAvOverordnetValg =
                        delvilkårsvurdering.følgerFraOverordnetValg !== null;

                    return (
                        <React.Fragment key={regel}>
                            {indeks !== 0 && !følgerAvOverordnetValg && <Skillelinje />}
                            <DelvilkårContainer $erUndervilkår={følgerAvOverordnetValg}>
                                <DelvilkårRadioknapper
                                    regelId={regel}
                                    svaralternativer={delvilkårsvurdering.svaralternativer}
                                    gjeldendeSvar={gjeldendeSvar}
                                    settSvar={(nyttSvar) => oppdaterSvar(regel, nyttSvar)}
                                    feilmelding={feilmeldinger[regel]}
                                    nullstillFeilmelding={nullstillFeilmelding}
                                />
                                <Begrunnelse
                                    gjeldendeBegrunnelse={begrunnelser[regel] || undefined}
                                    begrunnelsestype={begrunnelsestype}
                                    settBegrunnelse={(begrunnelse) =>
                                        oppdaterBegrunnelse(regel, begrunnelse)
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
