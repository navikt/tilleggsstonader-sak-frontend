import React from 'react';

import { EarthIcon } from '@navikt/aksel-icons';
import { VStack } from '@navikt/ds-react';

import { BillettDetaljer } from './BillettDetaljer';
import { PrivatTransportDetaljer } from './PrivatTransportDetaljer';
import { FaktaReise } from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { JaNei, jaNeiTilTekst } from '../../../../../typer/common';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { tekstMedFallback } from '../../../../../utils/tekstformatering';
import { AdresseFelt } from '../AdresseFelt';
import { Avreiseadresse } from '../Avreiseadresse';
import { SøknadInfoEkspanderbar, SøknadInfoFelt } from '../Visningskomponenter';

export const ReiseDetaljer: React.FC<{ reiser: FaktaReise[] }> = ({ reiser }) => {
    return (
        <VStack gap="space-12">
            {reiser.map((reise, index) => (
                <SøknadInfoEkspanderbar
                    ikon={<EarthIcon />}
                    key={index}
                    tittel={`Reise ${index + 1}`}
                    variant="subtle"
                >
                    <Avreiseadresse
                        adresse={reise.adresseDetSkalReisesFra}
                        skalReiseFraFolkeregistrertAdresse={
                            reise.skalReiseFraFolkeregistrertAdresse
                        }
                        spørsmål="Skal du reise fra din folkeregistrerte adresse?"
                        adresseLabel="Adresse jeg skal reise fra"
                        folkeregistrertAdresseLabel="Folkeregistrert adresse"
                    />
                    <AdresseFelt label="Adresse jeg skal reise til" {...reise.reiseAdresse} />

                    {reise.periode && (
                        <SøknadInfoFelt
                            label="I hvilken periode skal du reise til aktivitetsstedet?"
                            value={formaterIsoPeriode(reise.periode.fom, reise.periode.tom)}
                        />
                    )}

                    {reise.dagerPerUke && (
                        <SøknadInfoFelt
                            label="Hvor mange dager i uken skal du reise hit?"
                            value={reise.dagerPerUke}
                        />
                    )}

                    {reise.harBehovForTransportUavhengigAvReisensLengde && (
                        <SøknadInfoFelt
                            label="Har du funksjonsnedsettelse, midlertidig skade eller sykdom som gjør at du må ha transport til aktivitetsstedet?"
                            value={tekstMedFallback(
                                jaNeiTilTekst,
                                reise.harBehovForTransportUavhengigAvReisensLengde
                            )}
                        />
                    )}

                    {reise.leveringOgHentingIBarnehage && (
                        <>
                            <SøknadInfoFelt
                                label="Gateadressen hvor du henter eller leverer barn"
                                value={reise.leveringOgHentingIBarnehage.gateadresse}
                            />
                            <SøknadInfoFelt
                                label="Postnummer hvor du henter eller leverer barn"
                                value={reise.leveringOgHentingIBarnehage.postnummer}
                            />
                        </>
                    )}

                    {reise.harMerEnn6KmReisevei && (
                        <SøknadInfoFelt
                            label="Er reiseavstanden mellom der du bor og aktivitetsstedet 6 km eller mer én vei?"
                            value={tekstMedFallback(jaNeiTilTekst, reise.harMerEnn6KmReisevei)}
                        />
                    )}

                    {reise.lengdeReisevei && (
                        <SøknadInfoFelt
                            label="Hvor lang er reiseveien?"
                            value={`${reise.lengdeReisevei} km`}
                        />
                    )}

                    {reise.kanReiseMedOffentligTransport && (
                        <SøknadInfoFelt
                            label="Kan du reise med offentlig transport hele veien?"
                            value={tekstMedFallback(
                                jaNeiTilTekst,
                                reise.kanReiseMedOffentligTransport
                            )}
                        />
                    )}

                    {reise.kanReiseMedOffentligTransport === JaNei.JA &&
                        reise.offentligTransport && (
                            <BillettDetaljer offentligTransport={reise.offentligTransport} />
                        )}

                    {reise.kanReiseMedOffentligTransport === JaNei.NEI && reise.privatTransport && (
                        <PrivatTransportDetaljer privatTransport={reise.privatTransport} />
                    )}
                </SøknadInfoEkspanderbar>
            ))}
        </VStack>
    );
};
