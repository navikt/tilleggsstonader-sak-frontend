import React, { FC } from 'react';

import { BodyShort, Label, Textarea } from '@navikt/ds-react';

interface Props {
    redigerer: boolean;
    begrunnelseInput: string;
    settBegrunnelseInput: (begrunnelse: string) => void;
    begrunnelse?: string;
}

export const LagretKjørelisteBegrunnelse: FC<Props> = ({
    redigerer,
    begrunnelseInput,
    settBegrunnelseInput,
    begrunnelse,
}) => {
    if (redigerer) {
        return (
            <Textarea
                style={{ width: '900px' }}
                label="Begrunnelse for manuell registrering"
                value={begrunnelseInput}
                resize
                onChange={(e) => settBegrunnelseInput(e.target.value)}
                size="small"
                minRows={2}
            />
        );
    }

    return (
        <div>
            <Label size="small">Begrunnelse for manuell registrering: </Label>
            <BodyShort size="small">{begrunnelse || 'Ingen begrunnelse lagt ved'}</BodyShort>
        </div>
    );
};
