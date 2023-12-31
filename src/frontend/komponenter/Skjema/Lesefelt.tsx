import React, { FC } from 'react';

import { BodyShort, Label, LabelProps } from '@navikt/ds-react';

interface Props {
    className?: string;
    hideLabel?: boolean;
    label?: React.ReactNode;
    verdi?: string | readonly string[] | number;
    size?: LabelProps['size'];
}

const Lesefelt: FC<Props> = ({ className, hideLabel, label, verdi, size }) => {
    return (
        <div className={className}>
            {!hideLabel && label !== undefined && <Label size={size}>{label}</Label>}
            <BodyShort size={size}>{verdi}</BodyShort>
        </div>
    );
};

export default Lesefelt;
