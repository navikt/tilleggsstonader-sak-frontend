import React, { FC } from 'react';

import { Heading, HStack } from '@navikt/ds-react';

import EkspanderbartPanel from './EkspanderbartPanel';
import { Lenke } from '../../Sider/Behandling/lenker';
import { Vilkårsresultat } from '../../Sider/Behandling/vilkår';
import { VilkårsresultatIkon } from '../Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { ParagrafOgRundskrivLenker } from '../ParagrafOgRundskrivLenker';

interface Props {
    tittel: string;
    paragrafLenker: Lenke[];
    rundskrivLenke: string;
    children: React.ReactNode;
}

export const VilkårPanel: FC<Props> = ({ tittel, paragrafLenker, rundskrivLenke, children }) => {
    return (
        <EkspanderbartPanel
            tittel={tittel}
            heading={
                <ParagrafOgRundskrivLenker
                    paragrafLenker={paragrafLenker}
                    rundskrivLenke={rundskrivLenke}
                />
            }
        >
            {children}
        </EkspanderbartPanel>
    );
};

export const VilkårPanelMedResultat: FC<{ resultat: Vilkårsresultat } & Props> = ({
    resultat,
    tittel,
    paragrafLenker,
    rundskrivLenke,
    children,
}) => {
    return (
        <EkspanderbartPanel
            heading={
                <>
                    <HStack gap="2">
                        <VilkårsresultatIkon vilkårsresultat={resultat} />
                        <Heading size="small">{tittel}</Heading>
                    </HStack>
                    <ParagrafOgRundskrivLenker
                        paragrafLenker={paragrafLenker}
                        rundskrivLenke={rundskrivLenke}
                    />
                </>
            }
        >
            {children}
        </EkspanderbartPanel>
    );
};
