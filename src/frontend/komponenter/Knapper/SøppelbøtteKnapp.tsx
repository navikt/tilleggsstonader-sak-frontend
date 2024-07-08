import React from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps } from '@navikt/ds-react';

export const SøppelbøtteKnapp = (props: ButtonProps) => {
    return (
        <Button
            icon={<TrashIcon title="Fjern" />}
            size={props.size ?? 'small'}
            variant={props.variant ?? 'tertiary'}
            {...props}
        >
            {props.children}
        </Button>
    );
};
