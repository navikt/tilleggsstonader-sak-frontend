import * as React from 'react';
import { useState } from 'react';

import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Textarea } from '@navikt/ds-react';

import styles from './InterntNotat.module.css';
import { harVerdi } from '../../../../utils/utils';

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
            <div className={styles.knappWrapper}>
                <Button
                    variant={'tertiary'}
                    icon={utledIkon(skalViseFritekstFelt)}
                    onClick={handleClick}
                >
                    {skalViseFritekstFelt ? 'Fjern internt notat' : 'Skriv internt notat'}
                </Button>
            </div>
            {skalViseFritekstFelt && (
                <div className={styles.fritekstWrapper}>
                    <Textarea
                        label={'Internt notat'}
                        readOnly={!behandlingErRedigerbar}
                        onChange={(e) => oppdaterTekst(e.target.value)}
                        value={tekst}
                    />
                </div>
            )}
        </>
    );
};
