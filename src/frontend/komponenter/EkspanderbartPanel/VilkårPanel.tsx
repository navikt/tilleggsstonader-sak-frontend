import React, { FC } from 'react';

import { BodyShort, HStack, Heading, Link } from '@navikt/ds-react';

import EkspanderbartPanel from './EkspanderbartPanel';
import { Lenke } from '../../Sider/Behandling/Inngangsvilkår/lenker';
import { Vilkårsresultat } from '../../Sider/Behandling/vilkår';
import { VilkårsresultatIkon } from '../Ikoner/Vilkårsresultat/VilkårsresultatIkon';

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

const ParagrafOgRundskrivLenker: React.FC<{
    paragrafLenker: Lenke[];
    rundskrivLenke: string;
}> = ({ paragrafLenker, rundskrivLenke }) => {
    return (
        <HStack gap="4">
            <BodyShort>
                {paragrafLenker.map((lenke, indeks) => (
                    <React.Fragment key={indeks}>
                        <Link key={indeks} href={lenke.url}>
                            {lenke.tekst}
                        </Link>
                        {indeks !== paragrafLenker.length - 1 && ', '}
                    </React.Fragment>
                ))}
            </BodyShort>
            <Link href={rundskrivLenke}>Rundskriv</Link>
        </HStack>
    );
};
