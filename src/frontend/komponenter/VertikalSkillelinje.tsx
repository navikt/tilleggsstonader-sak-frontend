import React from 'react';

import { BorderAccentSubtle } from '@navikt/ds-tokens/js';

export const VertikalSkillelinje: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
    return (
        <div
            {...props}
            style={{
                width: '1px',
                alignSelf: 'stretch',
                backgroundColor: BorderAccentSubtle,
                ...props.style,
            }}
        />
    );
};
