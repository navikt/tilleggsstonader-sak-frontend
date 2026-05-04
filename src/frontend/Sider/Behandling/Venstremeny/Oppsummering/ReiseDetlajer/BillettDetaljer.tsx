import React from 'react';

import { VStack } from '@navikt/ds-react';

import {
    BillettType,
    BillettTypeTilTekst,
    OffentligTransport,
} from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { formaterTallMedTusenSkille } from '../../../../../utils/fomatering';
import { harTallverdi } from '../../../../../utils/tall';
import { SøknadInfoFelt, SøknadInfoFeltKompakt } from '../Visningskomponenter';

type Billett = {
    billettype: string;
    pris: string;
};

export const BillettDetaljer: React.FC<{ offentligTransport: OffentligTransport }> = ({
    offentligTransport,
}) => {
    const billetter: Billett[] = offentligTransport.billettTyperValgt
        .map((billettType) => {
            const pris = {
                [BillettType.ENKELTBILLETT]: offentligTransport.enkeltbillettPris,
                [BillettType.SYVDAGERSBILLETT]: offentligTransport.syvdagersbillettPris,
                [BillettType.TRETTIDAGERSBILLETT]: offentligTransport.månedskortPris,
            }[billettType];

            return harTallverdi(pris)
                ? {
                      billettype: BillettTypeTilTekst[billettType],
                      pris: `${formaterTallMedTusenSkille(pris)} kr`,
                  }
                : undefined;
        })
        .filter((billettpris): billettpris is Billett => Boolean(billettpris));

    return (
        <SøknadInfoFelt
            label="Hva koster billettene?"
            value={
                <VStack gap="space-4">
                    {billetter.map((billettpris) => (
                        <SøknadInfoFeltKompakt
                            key={billettpris.billettype}
                            label={billettpris.billettype}
                            value={billettpris.pris}
                        />
                    ))}
                </VStack>
            }
        />
    );
};
