import React from 'react';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { ActionMenu } from '@navikt/ds-react';

import { erProd } from '../../../utils/miljø';

export const GosysLenke = () => {
    const url = erProd()
        ? 'https://gosys.intern.nav.no/gosys/bruker/brukeroversikt.jsf'
        : 'https://gosys-q2.dev.intern.nav.no/gosys/bruker/brukeroversikt.jsf';
    return (
        <ActionMenu.Item
            as={'a'}
            href={url}
            target={'_blank'}
            rel={'noopener noreferrer'}
            icon={<ExternalLinkIcon />}
        >
            Gosys
        </ActionMenu.Item>
    );
};
