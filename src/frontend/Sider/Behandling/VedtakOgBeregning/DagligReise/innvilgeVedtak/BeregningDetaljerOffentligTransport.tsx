import React, { FC } from 'react';

import {
    BillettType,
    BillettTypeTilTekst,
} from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { Billettdetaljer } from '../../../../../typer/vedtak/vedtakDagligReise';

export const BeregningDetaljerOffentligTransport: FC<{
    billettdetaljer: Billettdetaljer;
    grunnlag: {
        prisEnkeltbillett: number;
        prisSyvdagersbillett: number;
        pris30dagersbillett: number;
    };
}> = ({ billettdetaljer, grunnlag }) => {
    let totalt = 0;

    const prisPerBillettType: Record<BillettType, number> = {
        [BillettType.ENKELTBILLETT]: grunnlag.prisEnkeltbillett,
        [BillettType.SYVDAGERSBILLETT]: grunnlag.prisSyvdagersbillett,
        [BillettType.TRETTIDAGERSBILLETT]: grunnlag.pris30dagersbillett,
    };

    const lines = (Object.entries(billettdetaljer) as Array<[BillettType, number]>).map(
        ([billettype, antall]) => {
            const pris = prisPerBillettType[billettype];
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
