import React from 'react';

import { Link } from '@navikt/ds-react';

import { useGenererModiaLenke } from './useGenererModiaLenke';

export const ModiaLenke = () => {
    const { genererModiaLenke } = useGenererModiaLenke();
    return (
        <Link
            href={'/#/modiapersonoversikt'}
            target={'_blank'}
            rel={'noopener noreferrer'}
            onClick={async (e) => {
                e.preventDefault();
                try {
                    window.open(await genererModiaLenke());
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                    alert('Feilet henting av lenke');
                }
            }}
        >
            Modia personoversikt
        </Link>
    );
};
