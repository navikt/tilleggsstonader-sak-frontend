import React, { FC } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../../typer/behandling/steg';
import { FanePath } from '../../../faner';

export const KjørelisteDagligReise: FC = () => {
    return (
        <>
            <BodyShort size="small">Her kommer det informasjon om kjøring med privat bil</BodyShort>
            <StegKnapp
                nesteFane={FanePath.BREV}
                steg={Steg.KJØRELISTE}
                validerUlagedeKomponenter={false}
            >
                Gå videre
            </StegKnapp>
        </>
    );
};
