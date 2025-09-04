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

const ReiseDetajler: React.FC<{ reiser: FaktaReise[] }> = ({ reiser }) => {
    return (
        <div>
            {reiser.map((reise, index) => {
                return (
                    <InfoSeksjon key={index} label={'Reiser'} ikon={<EarthIcon />}>
                        {reise.reiseAdresse && (
                            <BodyShort size="small">
                                <VStack>
                                    <Label size={'small'}>Adressen til aktiviteten</Label>
                                    {reise.reiseAdresse.gateadresse}
                                    {reise.reiseAdresse.postnummer} {reise.reiseAdresse.poststed}
                                </VStack>
                            </BodyShort>
                        )}
                        {reise.dagerPerUke && (
                            <BodyShort size="small">
                                <VStack>
                                    <Label size={'small'}>Antall reisedager i uken</Label>
                                    {reise.dagerPerUke.id}
                                </VStack>
                            </BodyShort>
                        )}
                        {reise.harBehovForTransportUavhengigAvReisensLengde && (
                            <BodyShort size="small">
                                <VStack>
                                    <Label size={'small'}>Avstand over 6 km?</Label>
                                    {
                                        jaNeiTilTekst[
                                            reise.harBehovForTransportUavhengigAvReisensLengde
                                        ]
                                    }
                                </VStack>
                            </BodyShort>
                        )}
                        {reise.lengdeReisevei && (
                            <BodyShort size="small">
                                <VStack>
                                    <Label size={'small'}>Hvor lang er reiseveien din?</Label>
                                    {reise.lengdeReisevei}
                                </VStack>
                            </BodyShort>
                        )}
                        {reise.kanReiseMedOffentligTransport && (
                            <BodyShort size="small">
                                <VStack>
                                    <Label size={'small'}>
                                        Kan du reise med offentlig transport?
                                    </Label>
                                    {jaNeiTilTekst[reise.kanReiseMedOffentligTransport]}
                                </VStack>
                            </BodyShort>
                        )}

                        <VStack>
                            <Label size="small">Billettyper</Label>

                            {reise.offentligTransport?.billettTyperValgt?.map(
                                (type: BillettType) => {
                                    const prisMap: Record<BillettType, number | undefined> = {
                                        [BillettType.ENKELTBILLETT]:
                                            reise.offentligTransport!.enkeltbillettPris,
                                        [BillettType.SYVDAGERSBILLETT]:
                                            reise.offentligTransport!.syvdagersbillettPris,
                                        [BillettType.MÅNEDSKORT]:
                                            reise.offentligTransport!.månedskortPris,
                                    };

                                    const pris = prisMap[type];

                                    if (pris == null) return null;

                                    return (
                                        <BodyShort size="small" key={type}>
                                            {BillettTypeTilTekst[type]}: {pris} kroner
                                        </BodyShort>
                                    );
                                }
                            )}
                        </VStack>
                    </InfoSeksjon>
                );
            })}
        </div>
    );
};

export default ReiseDetajler;
