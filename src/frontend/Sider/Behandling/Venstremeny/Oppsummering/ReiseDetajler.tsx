import React from 'react';

import { EarthIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, Label, VStack } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import {
    FaktaReise,
    UtgifterBil,
    Taxi,
    ÅrsakIkkeKjøreBil,
    ÅrsakIkkeKjøreBilTilTekst,
    ÅrsakIkkeOffentligTransport,
    ÅrsakIkkeOffentligTransportTilTekst,
    OffentligTransport,
    SvarKanReiseMedOffentligTransportTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaReise';
import { jaNeiTilTekst } from '../../../../typer/common';
import { formaterIsoPeriode } from '../../../../utils/dato';

const ReiseDetajler: React.FC<{ reiser: FaktaReise[] }> = ({ reiser }) => {
    return (
        <div>
            <InfoSeksjon label={'Reiser'} ikon={<EarthIcon />}>
                <VStack gap={'4'}>
                    {reiser.map((reise, index) => (
                        <VStack key={index} gap={'2'}>
                            <Heading level={'4'} size={'xsmall'}>
                                {`Reise ${index + 1}`}
                            </Heading>

                            {reise.skalReiseFraFolkeregistrertAdresse && (
                                <VStack>
                                    <Label size={'small'}>
                                        Skal du reise fra din folkeregisterte adresse?
                                    </Label>
                                    <BodyShort size="small">
                                        {jaNeiTilTekst[reise.skalReiseFraFolkeregistrertAdresse]}
                                    </BodyShort>
                                </VStack>
                            )}

                            {reise.adresseDetSkalReisesFra && (
                                <VStack>
                                    <Label size={'small'}>Adresse jeg skal reise fra:</Label>
                                    <BodyShort size="small">
                                        <BodyShort size="small">
                                            {reise.adresseDetSkalReisesFra.gateadresse}{' '}
                                            {reise.adresseDetSkalReisesFra.postnummer}{' '}
                                            {reise.adresseDetSkalReisesFra.poststed}
                                        </BodyShort>
                                    </BodyShort>
                                </VStack>
                            )}

                            {reise.reiseAdresse && (
                                <VStack>
                                    <Label size={'small'}>
                                        Hvilken adresse reiser du til i aktiviteten din?
                                    </Label>
                                    <BodyShort size="small">
                                        {reise.reiseAdresse.gateadresse}{' '}
                                        {reise.reiseAdresse.postnummer}{' '}
                                        {reise.reiseAdresse.poststed}
                                    </BodyShort>
                                </VStack>
                            )}

                            {reise.periode && (
                                <VStack>
                                    <Label size={'small'}>
                                        I hvilken periode skal du reise til aktivitetsstedet?
                                    </Label>
                                    <BodyShort size="small">
                                        {formaterIsoPeriode(reise.periode.fom, reise.periode.tom)}
                                    </BodyShort>
                                </VStack>
                            )}

                            {reise.dagerPerUke && (
                                <VStack>
                                    <Label size={'small'}>
                                        Hvor mange dager i uken skal du reise hit?
                                    </Label>
                                    <BodyShort size="small">{reise.dagerPerUke}</BodyShort>
                                </VStack>
                            )}

                            {reise.harBehovForTransportUavhengigAvReisensLengde && (
                                <VStack>
                                    <Label size={'small'}>
                                        Har du funksjonsnedsettelse, midlertidig skade eller sykdom
                                        som gjør at du må ha transport til aktivitetsstedet?
                                    </Label>
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
                                    <BodyShort size="small">{`${reise.lengdeReisevei} km`}</BodyShort>
                                </VStack>
                            )}

                            {reise.kanReiseMedOffentligTransport && (
                                <VStack>
                                    <Label size={'small'}>
                                        Kan du reise med offentlig transport?
                                    </Label>
                                    <BodyShort size="small">
                                        {
                                            SvarKanReiseMedOffentligTransportTilTekst[
                                                reise.kanReiseMedOffentligTransport
                                            ]
                                        }
                                    </BodyShort>
                                </VStack>
                            )}

                            {mapBilletttyper(reise.offentligTransport)}

                            {mapPrivatTransport(reise)}
                        </VStack>
                    ))}
                </VStack>
            </InfoSeksjon>
        </div>
    );
};

export default ReiseDetajler;

function mapBilletttyper(offentligTransport?: OffentligTransport) {
    if (!offentligTransport) {
        return null;
    }
    return (
        <>
            {offentligTransport.enkeltbillettPris && (
                <VStack>
                    <Label size="small">Hvor mye koster én enkeltbillett?</Label>
                    <BodyShort size="small">{`${offentligTransport.enkeltbillettPris} kr`}</BodyShort>
                </VStack>
            )}

            {offentligTransport.syvdagersbillettPris && (
                <VStack>
                    <Label size="small">Hvor mye koster ett ukeskort / 7-dagersbillett?</Label>
                    <BodyShort size="small">{`${offentligTransport.syvdagersbillettPris} kr`}</BodyShort>
                </VStack>
            )}

            {offentligTransport.månedskortPris && (
                <VStack>
                    <Label size="small">Hvor mye koster ett månedskort / 30-dagersbillett?</Label>
                    <BodyShort size="small">{`${offentligTransport.månedskortPris} kr`}</BodyShort>
                </VStack>
            )}
        </>
    );
}

function mapPrivatTransport(reise: FaktaReise) {
    if (!reise.privatTransport) {
        return null;
    }

    return (
        <>
            {reise.privatTransport.årsakIkkeOffentligTransport && (
                <VStack>
                    <Label size={'small'}>Hvorfor kan du ikke reise med offentlig transport?</Label>
                    {reise.privatTransport.årsakIkkeOffentligTransport.map(
                        (årsak: ÅrsakIkkeOffentligTransport) => (
                            <BodyShort key={årsak} size="small">
                                {ÅrsakIkkeOffentligTransportTilTekst[årsak]}
                            </BodyShort>
                        )
                    )}
                </VStack>
            )}

            {reise.privatTransport.kanKjøreMedEgenBil && (
                <VStack>
                    <Label size={'small'}>Kan du kjøre bil til aktivitetsstedet?</Label>
                    <BodyShort size="small">
                        {jaNeiTilTekst[reise.privatTransport.kanKjøreMedEgenBil]}
                    </BodyShort>
                </VStack>
            )}

            {mapUtgifterBil(reise.privatTransport.utgifterBil)}

            {mapTaxi(reise.privatTransport.taxi)}
        </>
    );
}

function mapUtgifterBil(utgifterBil?: UtgifterBil) {
    if (!utgifterBil) {
        return null;
    }

    return (
        <>
            {utgifterBil.mottarGrunnstønad && (
                <VStack>
                    <Label size={'small'}>Mottar du grunnstønad fra nav?</Label>
                    <BodyShort size="small">
                        {jaNeiTilTekst[utgifterBil.mottarGrunnstønad]}
                    </BodyShort>
                </VStack>
            )}

            <VStack>
                <Label size={'small'}>Hvor lang er reiseveien din med egen bil?</Label>
                <BodyShort size="small">{`${utgifterBil.reisedistanseEgenBil} km`}</BodyShort>
            </VStack>

            {utgifterBil.parkering && (
                <VStack>
                    <Label size={'small'}>Må du betale for parkering med egen bil?</Label>
                    <BodyShort size="small">{jaNeiTilTekst[utgifterBil.parkering]}</BodyShort>
                </VStack>
            )}

            {utgifterBil.bompenger && (
                <VStack>
                    <Label size={'small'}>Bompenger én vei</Label>
                    <BodyShort size="small">{`${utgifterBil.bompenger} kr`}</BodyShort>
                </VStack>
            )}

            {utgifterBil.ferge && (
                <VStack>
                    <Label size={'small'}>Ferge én vei</Label>
                    <BodyShort size="small">{`${utgifterBil.ferge} kr`}</BodyShort>
                </VStack>
            )}

            {utgifterBil.piggdekkavgift && (
                <VStack>
                    <Label size={'small'}>Piggdekkavgift per dag</Label>
                    <BodyShort size="small">{`${utgifterBil.piggdekkavgift} kr`}</BodyShort>
                </VStack>
            )}
        </>
    );
}

function mapTaxi(taxi?: Taxi) {
    if (!taxi) {
        return null;
    }

    return (
        <>
            <VStack>
                <Label size={'small'}>Hvorfor kan du ikke kjøre bil til aktivitetsstedet?</Label>
                {taxi.årsakIkkeKjøreBil.map((årsak: ÅrsakIkkeKjøreBil) => (
                    <BodyShort key={årsak} size="small">
                        {ÅrsakIkkeKjøreBilTilTekst[årsak]}
                    </BodyShort>
                ))}
            </VStack>

            {taxi.ønskerSøkeOmTaxi && (
                <VStack>
                    <Label size={'small'}>
                        Ønsker du å søke om få dekket utgifter til reise med taxi?
                    </Label>
                    <BodyShort size="small">{jaNeiTilTekst[taxi.ønskerSøkeOmTaxi]}</BodyShort>
                </VStack>
            )}

            {taxi.ttkort && (
                <VStack>
                    <Label size={'small'}>
                        Har du et TT-kort som du kan bruke til aktiviteter i tiltak?
                    </Label>
                    <BodyShort size="small">{jaNeiTilTekst[taxi.ttkort]}</BodyShort>
                </VStack>
            )}
        </>
    );
}
