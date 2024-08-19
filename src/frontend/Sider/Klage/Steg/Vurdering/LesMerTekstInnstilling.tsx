import * as React from 'react';

import styled from 'styled-components';

import { ReadMore } from '@navikt/ds-react';

const LesMerTekst = styled(ReadMore)`
    margin-top: 0.25rem;
    max-width: 40rem;
`;

export const LesMerTekstInnstilling: React.FC = () => {
    return (
        <LesMerTekst size="small" header="Dette skal innstillingen inneholde">
            <ol>
                <li>
                    Hva klagesaken gjelder
                    <ol type="a">
                        <li>
                            Skriv kort om resultatet i vedtaket. Eksempel: Klagers søknad om
                            overgangsstønad ble avslått fordi hun har fått nytt barn med samme
                            partner.
                        </li>
                    </ol>
                </li>
                <li>
                    Vurdering av klagen
                    <ol type="a">
                        <li>Begrunn hvorfor vi opprettholder vedtaket</li>
                        <li>Klagers argumenter skal vurderes/kommenteres</li>
                        <li>Avslutt med konklusjon og vis til hjemmel</li>
                    </ol>
                </li>
            </ol>
        </LesMerTekst>
    );
};
