import React, { FC } from 'react';

import { styled } from 'styled-components';

import { BodyShort, Heading, Link } from '@navikt/ds-react';
import { ABlue100, ABlue50 } from '@navikt/ds-tokens/dist/tokens';

import { Lenke } from '../../typer/common';

const Container = styled.div`
    background-color: ${ABlue50};
`;

const Header = styled.div`
    background-color: ${ABlue100};
    padding: 1rem 2rem;
    display: flex;
    gap: 2rem;
    align-items: center;
`;

const HeaderInnhold = styled.div`
    display: flex;
    gap: 1rem;
`;

const Innhold = styled.div`
    padding: 2rem;
`;

interface PanelProps {
    tittel: string;
    headerInnhold?: React.ReactNode;
    children: React.ReactNode;
}

export const Panel: FC<PanelProps> = ({ tittel, headerInnhold, children }) => {
    return (
        <Container>
            <Header>
                <Heading size="small">{tittel}</Heading>
                <HeaderInnhold>{headerInnhold}</HeaderInnhold>
                {/* TODO: Legg til knapp for å åpne og lukke panel */}
            </Header>
            <Innhold>{children}</Innhold>
        </Container>
    );
};

interface VilkårPanelProps {
    tittel: string;
    paragrafLenker: Lenke[];
    rundskrivLenke: string;
    children: React.ReactNode;
}

export const VilkårPanel: FC<VilkårPanelProps> = ({
    tittel,
    paragrafLenker,
    rundskrivLenke,
    children,
}) => {
    return (
        <Panel
            tittel={tittel}
            headerInnhold={
                <>
                    <div>
                        {paragrafLenker.map((lenke, indeks) => (
                            <>
                                <Link key={indeks} href={lenke.url}>
                                    {lenke.tekst}
                                </Link>
                                {indeks !== paragrafLenker.length - 1 && <BodyShort>, </BodyShort>}
                            </>
                        ))}
                    </div>
                    <Link href={rundskrivLenke}>Rundskriv</Link>
                </>
            }
        >
            {children}
        </Panel>
    );
};
