import React, { FC } from 'react';

import { BodyShort, Link } from '@navikt/ds-react';

import EkspanderbartPanel from './EkspanderbartPanel';
import { Lenke } from '../../Sider/Behandling/Inngangsvilkår/lenker';

interface Props {
    tittel: string;
    paragrafLenker: Lenke[];
    rundskrivLenke: string;
    children: React.ReactNode;
}

const VilkårPanel: FC<Props> = ({ tittel, paragrafLenker, rundskrivLenke, children }) => {
    return (
        <EkspanderbartPanel
            tittel={tittel}
            headerInnhold={
                <>
                    <BodyShort>
                        {paragrafLenker.map((lenke, indeks) => (
                            <>
                                <Link key={indeks} href={lenke.url}>
                                    {lenke.tekst}
                                </Link>
                                {indeks !== paragrafLenker.length - 1 && ', '}
                            </>
                        ))}
                    </BodyShort>
                    <Link href={rundskrivLenke}>Rundskriv</Link>
                </>
            }
        >
            {children}
        </EkspanderbartPanel>
    );
};

export default VilkårPanel;
