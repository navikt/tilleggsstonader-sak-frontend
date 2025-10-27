import React from 'react';

import { EarthIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, Label, VStack } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import {
    BillettType,
    BillettTypeTilTekst,
    FaktaReise,
    UtgifterBil,
    Taxi,
    ÅrsakIkkeKjøreBil,
    ÅrsakIkkeKjøreBilTilTekst,
    ÅrsakIkkeOffentligTransport,
    ÅrsakIkkeOffentligTransportTilTekst,
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

                            {reise.reiseAdresse && (
                                <VStack>
                                    <Label size={'small'}>Adressen til aktiviteten</Label>
                                    <BodyShort size="small">
                                        {reise.reiseAdresse.gateadresse}
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
                                    <Label size={'small'}>Antall reisedager i uken</Label>
                                    <BodyShort size="small">{reise.dagerPerUke}</BodyShort>
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
                                    <Label size={'small'}>
                                        Kan du reise med offentlig transport?
                                    </Label>
                                    <BodyShort size="small">
                                        {jaNeiTilTekst[reise.kanReiseMedOffentligTransport]}
                                    </BodyShort>
                                </VStack>
                            )}

                            {reise.offentligTransport && (
                                <VStack>
                                    <Label size="small">Billettyper</Label>
                                    {mapBilletttyper(reise)}
                                </VStack>
                            )}

                            {mapPrivatTransport(reise)}
                        </VStack>
                    ))}
                </VStack>
            </InfoSeksjon>
        </div>
    );
};

export default ReiseDetajler;

function mapBilletttyper(reise: FaktaReise) {
    return reise.offentligTransport?.billettTyperValgt?.map((type: BillettType) => {
        const prisMap: Record<BillettType, number | undefined> = {
            [BillettType.ENKELTBILLETT]: reise.offentligTransport?.enkeltbillettPris,
            [BillettType.SYVDAGERSBILLETT]: reise.offentligTransport?.syvdagersbillettPris,
            [BillettType.TRETTIDAGERSBILLETT]: reise.offentligTransport?.månedskortPris,
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
