import React from 'react';

import { EarthIcon } from '@navikt/aksel-icons';
import { BodyShort, CopyButton, VStack } from '@navikt/ds-react';

import { BillettDetaljer } from './BillettDetaljer';
import { PrivatTransportDetaljer } from './PrivatTransportDetaljer';
import {
    FaktaReise,
    ReiseAdresse,
    reiseAdresseTilTekst,
} from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { JaNei, jaNeiTilTekst } from '../../../../../typer/common';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { OppsummeringEkspanderbarEnhet, OppsummeringFelt } from '../Visningskomponenter';

function AdresseFelt({ adresse, label }: { adresse: ReiseAdresse; label: string }) {
    const adresseTekst = reiseAdresseTilTekst(adresse);

    return (
        <OppsummeringFelt
            label={label}
            value={
                <span>
                    <BodyShort as="span" size="small">
                        {adresseTekst}
                    </BodyShort>
                    <CopyButton
                        copyText={adresseTekst}
                        size="small"
                        style={{ verticalAlign: 'middle' }}
                    />
                </span>
            }
        />
    );
}

export const ReiseDetaljer: React.FC<{ reiser: FaktaReise[] }> = ({ reiser }) => {
    return (
        <VStack gap="space-12">
            {reiser.map((reise, index) => (
                <OppsummeringEkspanderbarEnhet
                    ikon={<EarthIcon />}
                    key={index}
                    tittel={`Reise ${index + 1}`}
                    variant="subtle"
                >
                    {reise.skalReiseFraFolkeregistrertAdresse && (
                        <OppsummeringFelt
                            label="Skal du reise fra din folkeregistrerte adresse?"
                            value={jaNeiTilTekst[reise.skalReiseFraFolkeregistrertAdresse]}
                        />
                    )}

                    {reise.adresseDetSkalReisesFra && (
                        <AdresseFelt
                            adresse={reise.adresseDetSkalReisesFra}
                            label={
                                reise.skalReiseFraFolkeregistrertAdresse === JaNei.JA
                                    ? 'Folkeregistrert adresse'
                                    : 'Adresse jeg skal reise fra'
                            }
                        />
                    )}

                    {reise.reiseAdresse && (
                        <AdresseFelt
                            adresse={reise.reiseAdresse}
                            label="Adresse jeg skal reise til"
                        />
                    )}

                    {reise.periode && (
                        <OppsummeringFelt
                            label="I hvilken periode skal du reise til aktivitetsstedet?"
                            value={formaterIsoPeriode(reise.periode.fom, reise.periode.tom)}
                        />
                    )}

                    {reise.dagerPerUke && (
                        <OppsummeringFelt
                            label="Hvor mange dager i uka skal du reise hit?"
                            value={reise.dagerPerUke}
                        />
                    )}

                    {reise.harBehovForTransportUavhengigAvReisensLengde && (
                        <OppsummeringFelt
                            label="Har du funksjonsnedsettelse, midlertidig skade eller sykdom som gjør at du må ha transport til aktivitetsstedet?"
                            value={
                                jaNeiTilTekst[reise.harBehovForTransportUavhengigAvReisensLengde]
                            }
                        />
                    )}

                    {reise.harMerEnn6KmReisevei && (
                        <OppsummeringFelt
                            label="Er reiseavstanden mellom der du bor og aktivitetsstedet 6 km eller mer én vei?"
                            value={jaNeiTilTekst[reise.harMerEnn6KmReisevei]}
                        />
                    )}

                    {reise.lengdeReisevei && (
                        <OppsummeringFelt
                            label="Hvor lang er reiseveien?"
                            value={`${reise.lengdeReisevei} km`}
                        />
                    )}

                    {reise.kanReiseMedOffentligTransport && (
                        <OppsummeringFelt
                            label="Kan du reise med offentlig transport hele veien?"
                            value={jaNeiTilTekst[reise.kanReiseMedOffentligTransport]}
                        />
                    )}

                    {reise.kanReiseMedOffentligTransport === JaNei.JA &&
                        reise.offentligTransport && (
                            <BillettDetaljer offentligTransport={reise.offentligTransport} />
                        )}

                    {reise.kanReiseMedOffentligTransport === JaNei.NEI && reise.privatTransport && (
                        <PrivatTransportDetaljer privatTransport={reise.privatTransport} />
                    )}
                </OppsummeringEkspanderbarEnhet>
            ))}
        </VStack>
    );
};
