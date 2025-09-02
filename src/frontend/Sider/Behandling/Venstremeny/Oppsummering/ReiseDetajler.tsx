import React from 'react';

import { GlobeIcon } from '@navikt/aksel-icons';
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
                    <InfoSeksjon key={index} label={'Reiser'} ikon={<GlobeIcon />}>
                        {reise.reiseAdresse && (
                            <BodyShort size="small">
                                <VStack>
                                    <Label size={'small'}>
                                        Hva er addresen til aktivitetet din?
                                    </Label>
                                    {reise.reiseAdresse.gateadresse}
                                    {reise.reiseAdresse.postnummer} {reise.reiseAdresse.poststed}
                                </VStack>
                            </BodyShort>
                        )}
                        {reise.dagerPerUke && (
                            <BodyShort size="small">
                                <VStack>
                                    <Label size={'small'}>
                                        Hvor mange dager i uken skal du reise hit?
                                    </Label>
                                    {reise.dagerPerUke.id}
                                </VStack>
                            </BodyShort>
                        )}
                        {reise.harBehovForTransportUavhengigAvReisensLengde && (
                            <BodyShort size="small">
                                <VStack>
                                    <Label size={'small'}>
                                        Er reiseavstanden mellom der du bor og aktivitetstedet 6 km
                                        mellom mer en vei?
                                    </Label>
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
                        {reise.offentligTransport &&
                            reise.kanReiseMedOffentligTransport === 'JA' && (
                                <BodyShort size="small">
                                    <VStack>
                                        <Label size="small">
                                            Hva slags type billett må du kjøpe for å reise til
                                            aktiviteten din?
                                        </Label>

                                        {Object.entries({
                                            [BillettType.ENKELTBILLETT]:
                                                reise.offentligTransport.enkeltbillettPris,
                                            [BillettType.SYVDAGERSBILLETT]:
                                                reise.offentligTransport.syvdagersbillettPris,
                                            [BillettType.MÅNEDSKORT]:
                                                reise.offentligTransport.månedskortPris,
                                        }).map(([type, pris]) =>
                                            pris != null &&
                                            reise.offentligTransport!.billettTyperValgt?.includes(
                                                type as BillettType
                                            ) ? (
                                                <div key={type}>
                                                    {BillettTypeTilTekst[type as BillettType]}:{' '}
                                                    {pris} kroner
                                                </div>
                                            ) : null
                                        )}
                                    </VStack>
                                </BodyShort>
                            )}
                    </InfoSeksjon>
                );
            })}
        </div>
    );
};

export default ReiseDetajler;
