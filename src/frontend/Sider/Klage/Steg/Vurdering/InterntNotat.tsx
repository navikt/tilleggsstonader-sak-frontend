import * as React from 'react';
import { useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { harVerdi } from '../../../../utils/utils';
import { EnsligTextArea } from '../../Komponenter/EnsligTextArea/EnsligTextArea';

const FritekstWrapper = styled.div`
    margin: 0 4rem 2rem 4rem;
`;

const KnappWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-right: 4rem;
    margin-bottom: -1.75rem;
`;

export const InterntNotat: React.FC<{
    behandlingErRedigerbar: boolean;
    tekst?: string;
    oppdaterTekst: (tekst?: string) => void;
}> = ({ behandlingErRedigerbar, tekst, oppdaterTekst }) => {
    const [skalViseFritekstFelt, settSkalViseFritekstFelt] = useState<boolean>(harVerdi(tekst));

    const handleClick = () => {
        if (skalViseFritekstFelt) {
            oppdaterTekst(undefined);
        }
        settSkalViseFritekstFelt(!skalViseFritekstFelt);
    };

    const utledIkon = (skalViseFritekstFelt: boolean) =>
        skalViseFritekstFelt ? (
            <TrashIcon fontSize="1.5rem" />
        ) : (
            <PlusCircleIcon fontSize="1.5rem" />
        );

    return (
        <>
            <KnappWrapper>
                <Button
                    variant={'tertiary'}
                    icon={utledIkon(skalViseFritekstFelt)}
                    onClick={handleClick}
                >
                    {skalViseFritekstFelt ? 'Fjern internt notat' : 'Skriv internt notat'}
                </Button>
            </KnappWrapper>
            {skalViseFritekstFelt && (
                <FritekstWrapper>
                    <EnsligTextArea
                        label={'Internt notat'}
                        erLesevisning={!behandlingErRedigerbar}
                        onChange={(e) => oppdaterTekst(e.target.value)}
                        value={tekst}
                    />
                </FritekstWrapper>
            )}
        </>
    );
};
