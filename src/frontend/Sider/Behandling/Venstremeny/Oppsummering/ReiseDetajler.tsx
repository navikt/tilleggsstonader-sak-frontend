import React from 'react';

import { EarthIcon } from '@navikt/aksel-icons';
import { BodyShort, Label, VStack } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import {
    BillettType,
    BillettTypeTilTekst,
    FaktaReise,
} from '../../../../typer/behandling/behandlingFakta/faktaReise';
import { jaNeiTilTekst } from '../../../../typer/common';

function mapReise(reise: FaktaReise) {
    return reise.offentligTransport?.billettTyperValgt?.map((type: BillettType) => {
        const prisMap: Record<BillettType, number | undefined> = {
            [BillettType.ENKELTBILLETT]: reise.offentligTransport?.enkeltbillettPris,
            [BillettType.SYVDAGERSBILLETT]: reise.offentligTransport?.syvdagersbillettPris,
            [BillettType.MÅNEDSKORT]: reise.offentligTransport?.månedskortPris,
        };

        const pris = prisMap[type];

        if (pris == null) return null;

        return (
            <BodyShort size="small" key={type}>
                {BillettTypeTilTekst[type]}: {pris} kroner
            </BodyShort>
        );
    });
}

const ReiseDetajler: React.FC<{ reiser: FaktaReise[] }> = ({ reiser }) => {
    return (
        <div>
            {reiser.map((reise, index) => {
                return (
                    <InfoSeksjon key={index} label={'Reiser'} ikon={<EarthIcon />}>
                        {reise.reiseAdresse && (
                            <VStack>
                                <Label size={'small'}>Adressen til aktiviteten</Label>
                                <BodyShort size="small">
                                    {reise.reiseAdresse.gateadresse}
                                    {reise.reiseAdresse.postnummer} {reise.reiseAdresse.poststed}
                                </BodyShort>
                            </VStack>
                        )}
                        {reise.dagerPerUke && (
                            <VStack>
                                <Label size={'small'}>Antall reisedager i uken</Label>
                                <BodyShort size="small">{reise.dagerPerUke.id}</BodyShort>
                            </VStack>
                        )}
                        {reise.harBehovForTransportUavhengigAvReisensLengde && (
                            <VStack>
                                <Label size={'small'}>Avstand over 6 km?</Label>
                                <BodyShort size="small">
                                    {
                                        jaNeiTilTekst[
                                            reise.harBehovForTransportUavhengigAvReisensLengde
                                        ]
                                    }
                                </BodyShort>
                            </VStack>
                        )}
                        {reise.lengdeReisevei && (
                            <VStack>
                                <Label size={'small'}>Hvor lang er reiseveien din?</Label>
                                <BodyShort size="small">{reise.lengdeReisevei}</BodyShort>
                            </VStack>
                        )}
                        {reise.kanReiseMedOffentligTransport && (
                            <VStack>
                                <Label size={'small'}>Kan du reise med offentlig transport?</Label>
                                <BodyShort size="small">
                                    {jaNeiTilTekst[reise.kanReiseMedOffentligTransport]}
                                </BodyShort>
                            </VStack>
                        )}

                        <VStack>
                            <Label size="small">Billettyper</Label>
                            {mapReise(reise)}
                        </VStack>
                    </InfoSeksjon>
                );
            })}
        </div>
    );
};

export default ReiseDetajler;
