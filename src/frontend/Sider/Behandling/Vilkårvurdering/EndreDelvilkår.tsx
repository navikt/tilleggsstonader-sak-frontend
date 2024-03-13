import React, { FC, useState } from 'react';

import styled from 'styled-components';

import { Button, HStack, VStack } from '@navikt/ds-react';
import { ABorderAction } from '@navikt/ds-tokens/dist/tokens';

import Begrunnelse from './Begrunnelse';
import DelvilkårRadioknapper from './DelvilkårRadioknapper';
import { Feilmeldinger, validerVilkårsvurderinger } from './validering';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import { BegrunnelseRegel, BegrunnelseType, RegelId, Regler, SvarId } from '../../../typer/regel';
import { erTomtObjekt } from '../../../typer/typeUtils';
import { DelvilkårSvar } from '../vilkår';

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
    regler: Regler;
    delvilkårSvarsett: DelvilkårSvar[];
    oppdaterDelvilkårSvarSett: (delvilkår: DelvilkårSvar[]) => void;
}> = ({ regler, oppdaterDelvilkårSvarSett, delvilkårSvarsett }) => {
    const [vilkårsvurderinger, settVilkårsvurderinger] =
        useState<DelvilkårSvar[]>(delvilkårSvarsett);
    const [feilmeldinger, settFeilmeldinger] = useState<Feilmeldinger>({});

    const validerOgLagreVilkårsvurderinger = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const valideringsfeil = validerVilkårsvurderinger(
            vilkårsvurderinger.flatMap((it) => it.vurderinger),
            regler
        );

        settFeilmeldinger(valideringsfeil);

        if (erTomtObjekt(valideringsfeil)) {
            oppdaterDelvilkårSvarSett(delvilkårSvarsett);
        }
    };

    const nullstillFeilmelding = (regelId: string) => {
        settFeilmeldinger({ ...feilmeldinger, [regelId]: undefined });
    };

    function finnPlasseringTilRegel(
        delvilkårSvar: DelvilkårSvar[],
        regelId: RegelId
    ): [number, number] | null {
        const ytreIndeks = delvilkårSvar.findIndex(
            (ytreArray) => ytreArray.vurderinger.findIndex((v) => v.regelId === regelId) !== -1
        );
        if (ytreIndeks === -1) return null;
        const indreIndeks = delvilkårSvar[ytreIndeks].vurderinger.findIndex(
            (v) => v.regelId === regelId
        );
        return [ytreIndeks, indreIndeks];
    }

    const oppdaterSvar = (regelId: RegelId, nyttSvar: SvarId) => {
        settVilkårsvurderinger((prevState) => {
            const indekser = finnPlasseringTilRegel(prevState, regelId);

            if (!indekser) {
                return prevState;
            }

            const [ytreIndeks, indreIndeks] = indekser;

            return prevState.map((delvilkår, i) => {
                const nesteRegel = regler[regelId].svarMapping[nyttSvar].regelId;

                if (nesteRegel === 'SLUTT_NODE') {
                    if (i === ytreIndeks) {
                        return {
                            vurderinger: [
                                {
                                    regelId: regelId,
                                    svar: nyttSvar,
                                    begrunnelse: delvilkår.vurderinger[0].begrunnelse,
                                },
                            ],
                        };
                    } else {
                        return delvilkår;
                    }
                }

                return {
                    vurderinger: delvilkår.vurderinger.map((it, j) => {
                        if (i === ytreIndeks && j === indreIndeks) {
                            return { ...it, svar: nyttSvar };
                        } else {
                            return it;
                        }
                    }),
                };
            });
        });
    };

    const oppdaterBegrunnelse = (regelId: RegelId, nyBegrunnelse: BegrunnelseType) => {
        settVilkårsvurderinger((prevState) => {
            const indekser = finnPlasseringTilRegel(prevState, regelId);

            if (!indekser) {
                return prevState;
            }

            const [ytreIndeks, indreIndeks] = indekser;

            return prevState.map((delvilkår, i) => {
                return {
                    vurderinger: delvilkår.vurderinger.map((delvilkår, j) => {
                        if (i === ytreIndeks && j === indreIndeks) {
                            return { ...delvilkår, begrunnelse: nyBegrunnelse };
                        } else {
                            return delvilkår;
                        }
                    }),
                };
            });
        });
    };

    return (
        <form onSubmit={validerOgLagreVilkårsvurderinger}>
            <VStack gap="4">
                {vilkårsvurderinger.map((vilkårsvurdering, delvilkårIndeks) => {
                    return vilkårsvurdering.vurderinger.map((delvilkårsvurdering, indeks) => {
                        const regel = regler[delvilkårsvurdering.regelId];
                        const svar = delvilkårsvurdering.svar;

                        const begrunnelsestype = svar
                            ? regel.svarMapping[svar].begrunnelseType
                            : BegrunnelseRegel.VALGFRI;

                        const erUndervilkår = indeks !== 0;

                        return (
                            <React.Fragment key={self.crypto.randomUUID()}>
                                {delvilkårIndeks !== 0 && !erUndervilkår && <Skillelinje />}
                                <DelvilkårContainer $erUndervilkår={erUndervilkår}>
                                    <DelvilkårRadioknapper
                                        gjeldendeSvar={svar}
                                        regel={regel}
                                        settSvar={(nyttSvar) =>
                                            oppdaterSvar(regel.regelId, nyttSvar)
                                        }
                                        feilmelding={feilmeldinger[regel.regelId]}
                                        nullstillFeilmelding={nullstillFeilmelding}
                                    />
                                    <Begrunnelse
                                        gjeldendeBegrunnelse={delvilkårsvurdering.begrunnelse}
                                        typeBegrunnelse={begrunnelsestype}
                                        settBegrunnelse={(begrunnelse) =>
                                            oppdaterBegrunnelse(regel.regelId, begrunnelse)
                                        }
                                    />
                                </DelvilkårContainer>
                            </React.Fragment>
                        );
                    });
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
