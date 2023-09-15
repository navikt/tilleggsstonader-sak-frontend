import React, { FC, ReactNode } from 'react';

import styled from 'styled-components';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import { ABlue50, ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

import { VilkårsresultatIkon } from '../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { Vilkårsresultat } from '../vilkår';

const VilkårpanelBase = styled.div`
    margin: 2rem;
    background-color: ${ABlue50};
`;

const VilkårpanelTittel = styled.div`
    padding-left: 1rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid white;
`;

const VilkårsresultatContainer = styled.span`
    display: flex;
    align-items: center;

    .tittel {
        margin: 0 1rem 0 0.5rem;
    }

    .paragrafTittel {
        color: ${ATextSubtle};
    }
`;

interface Props {
    tittel: string;
    vilkårsresultat: Vilkårsresultat;
    children: ReactNode;
}

export const Vilkårpanel: FC<Props> = ({ tittel, vilkårsresultat, children }) => {
    // const { ekspanderteVilkår, toggleEkspandertTilstand } = useEkspanderbareVilkårpanelContext();
    const erEkspandert = true;

    return (
        <VilkårpanelBase>
            <>
                <VilkårpanelTittel>
                    <VilkårsresultatContainer>
                        <VilkårsresultatIkon vilkårsresultat={vilkårsresultat} />
                        <Heading className={'tittel'} size="small" level="5">
                            {tittel}
                        </Heading>
                    </VilkårsresultatContainer>
                    <Button
                        size="medium"
                        variant="tertiary"
                        icon={erEkspandert ? <ChevronDownIcon /> : <ChevronUpIcon />}
                        // onClick={() => toggleEkspandertTilstand(vilkår)}
                        // disabled={ekspanderteVilkår[vilkår] === EkspandertTilstand.KAN_IKKE_LUKKES}
                    />
                </VilkårpanelTittel>
                {/* {ekspanderteVilkår[vilkår] !== EkspandertTilstand.KOLLAPSET && children} */}
                {children}
            </>
        </VilkårpanelBase>
    );
};
