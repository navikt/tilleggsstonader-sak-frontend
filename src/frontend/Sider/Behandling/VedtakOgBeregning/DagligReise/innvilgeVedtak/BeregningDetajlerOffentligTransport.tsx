import React, { FC } from 'react';

import { BillettTypeTilTekst } from '../../../../../typer/behandling/behandlingFakta/faktaReise';

const BeregningDetajlerOffentligTransport: FC<{
    billettdetaljer: Record<string, number>;
    grunnlag: {
        prisEnkeltbillett: number;
        prisSyvdagersbillett: number;
        pris30dagersbillett: number;
    };
}> = ({ billettdetaljer, grunnlag }) => {
    let totalt = 0;

    const lines = Object.entries(billettdetaljer).map(([key, count]) => {
        let pris = 0;
        let visningsnavn = '';

        switch (key) {
            case 'ENKELTBILLETT':
                pris = grunnlag.prisEnkeltbillett;
                visningsnavn = BillettTypeTilTekst[key];
                break;
            case 'SYVDAGERSBILLETT':
                pris = grunnlag.prisSyvdagersbillett;
                visningsnavn = BillettTypeTilTekst[key];
                break;
            case 'MÅNEDSKORT':
                pris = grunnlag.pris30dagersbillett;
                visningsnavn = BillettTypeTilTekst[key];
                break;
        }

        const subtotal = pris * count;
        totalt += subtotal;

        return (
            <div key={key}>
                {count}x {visningsnavn}: {pris} kr
            </div>
        );
    });

    return (
        <div>
            {lines}
            <div style={{ fontWeight: 'bold', marginTop: '0.25rem' }}>= {totalt} kr</div>
        </div>
    );
};

export default BeregningDetajlerOffentligTransport;
