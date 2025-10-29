import React from 'react';

import { EarthIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, Label, VStack } from '@navikt/ds-react';

import { BillettDetaljer } from './BillettDetaljer';
import { PrivatTransportDetaljer } from './PrivatTransportDetaljer';
import {
    FaktaReise,
    SvarKanReiseMedOffentligTransportTilTekst,
    reiseAdresseTilTekst,
} from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { jaNeiTilTekst } from '../../../../../typer/common';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { InfoSeksjon } from '../Visningskomponenter';

export const ReiseDetajler: React.FC<{ reiser: FaktaReise[] }> = ({ reiser }) => {
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
                                            {reiseAdresseTilTekst(reise.adresseDetSkalReisesFra)}
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
                                        {reiseAdresseTilTekst(reise.reiseAdresse)}
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

                            {reise.offentligTransport && (
                                <BillettDetaljer offentligTransport={reise.offentligTransport} />
                            )}

                            {reise.privatTransport && (
                                <PrivatTransportDetaljer privatTransport={reise.privatTransport} />
                            )}
                        </VStack>
                    ))}
                </VStack>
            </InfoSeksjon>
        </div>
    );
};
