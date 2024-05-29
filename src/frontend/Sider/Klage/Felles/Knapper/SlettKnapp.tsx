import { TrashIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Button } from '@navikt/ds-react';

const SlettKnapp: React.FC<{ onClick: () => void; tekst: string }> = ({ onClick, tekst }) => {
    return (
        <Button onClick={onClick} icon={<TrashIcon fontSize="1.5rem" />} variant={'tertiary'}>
            {tekst}
        </Button>
    );
};

export default SlettKnapp;
