import React from 'react';

import { EarthIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, Label, VStack } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import {
    BillettType,
    BillettTypeTilTekst,
    FaktaReise,
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

                            {/*PRIVAT BIL*/}

                            {/*TAXI*/}
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
