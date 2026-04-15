import React from 'react';

import {
    BillettTypeTilTekst,
    OffentligTransport,
} from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { OppsummeringFelt } from '../Visningskomponenter';

export const BillettDetaljer: React.FC<{ offentligTransport: OffentligTransport }> = ({
    offentligTransport,
}) => (
    <>
        {offentligTransport.billettTyperValgt.length > 0 && (
            <OppsummeringFelt
                label="Valgte billettyper"
                value={offentligTransport.billettTyperValgt
                    .map((billettType) => BillettTypeTilTekst[billettType])
                    .join(', ')}
            />
        )}
        {offentligTransport.enkeltbillettPris && (
            <OppsummeringFelt
                label="Hvor mye koster én enkeltbillett?"
                value={`${offentligTransport.enkeltbillettPris} kr`}
            />
        )}

        {offentligTransport.syvdagersbillettPris && (
            <OppsummeringFelt
                label="Hvor mye koster ett ukeskort / 7-dagersbillett?"
                value={`${offentligTransport.syvdagersbillettPris} kr`}
            />
        )}

        {offentligTransport.månedskortPris && (
            <OppsummeringFelt
                label="Hvor mye koster ett månedskort / 30-dagersbillett?"
                value={`${offentligTransport.månedskortPris} kr`}
            />
        )}
    </>
);
