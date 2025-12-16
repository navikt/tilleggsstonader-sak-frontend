import React, { FC } from 'react';

import {
    BillettType,
    BillettTypeTilTekst,
} from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { Billettdetaljer } from '../../../../../typer/vedtak/vedtakDagligReise';

export const BeregningDetaljerOffentligTransport: FC<{
    billettdetaljer: Billettdetaljer;
    priser: {
        prisEnkeltbillett?: number;
        prisSyvdagersbillett?: number;
        pris30dagersbillett?: number;
    };
}> = ({ billettdetaljer, priser }) => {
    let totalt = 0;

    const prisPerBillettType: Record<BillettType, number | undefined> = {
        [BillettType.ENKELTBILLETT]: priser.prisEnkeltbillett,
        [BillettType.SYVDAGERSBILLETT]: priser.prisSyvdagersbillett,
        [BillettType.TRETTIDAGERSBILLETT]: priser.pris30dagersbillett,
    };

    const lines = (Object.entries(billettdetaljer) as Array<[BillettType, number]>).map(
        ([billettype, antall]) => {
            const pris = prisPerBillettType[billettype];
            if (!pris) return null;

            const subtotal = pris * antall;
            totalt += subtotal;

            return (
                <div key={billettype}>
                    {antall}x {BillettTypeTilTekst[billettype]}: {pris} kr
                </div>
            );
        }
    );

    return (
        <div>
            {lines}
            <div style={{ fontWeight: 'bold', marginTop: '0.25rem' }}>= {totalt} kr</div>
        </div>
    );
};
