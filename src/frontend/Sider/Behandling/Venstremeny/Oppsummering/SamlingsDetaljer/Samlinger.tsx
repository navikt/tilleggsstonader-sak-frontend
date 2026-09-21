import React from 'react';

import { EarthIcon } from '@navikt/aksel-icons';
import { BodyShort, CopyButton, VStack } from '@navikt/ds-react';

import styles from './SamlingsDetaljer.module.css';
import {
    FaktaSamling,
    ReiseAdresse,
    reiseAdresseTilTekst,
} from '../../../../../typer/behandling/behandlingFakta/faktaSamlinger';
import { JaNei, jaNeiTilTekst } from '../../../../../typer/common';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { tekstMedFallback } from '../../../../../utils/tekstformatering';
import { SøknadInfoEkspanderbar, SøknadInfoFelt } from '../Visningskomponenter';
import { PrivatTransportDetaljer } from './PrivatTransportDetaljer';

function AdresseFelt({ adresse, label }: { adresse: ReiseAdresse; label: string }) {
    const adresseTekst = reiseAdresseTilTekst(adresse);

    return (
        <SøknadInfoFelt
            label={label}
            value={
                <span>
                    <BodyShort as="span" size="small">
                        {adresseTekst}
                    </BodyShort>
                    <CopyButton copyText={adresseTekst} className={styles.kopiknapp} size="small" />
                </span>
            }
        />
    );
}

function formatKr(value?: number) {
    return value !== undefined && value !== null ? `${value} kr` : '-';
}

export const Samlinger: React.FC<{ samlinger: FaktaSamling[] }> = ({ samlinger }) => {
    return (
        <VStack gap="space-12">
            {samlinger.map((samling, index) => (
                <SøknadInfoEkspanderbar
                    ikon={<EarthIcon />}
                    key={index}
                    tittel={`Samling ${index + 1}`}
                    variant="subtle"
                >
                    {samling.skalReiseFraFolkeregistrertAdresse && (
                        <SøknadInfoFelt
                            label="Skal du reise fra folkeregistrert adresse?"
                            value={tekstMedFallback(
                                jaNeiTilTekst,
                                samling.skalReiseFraFolkeregistrertAdresse
                            )}
                        />
                    )}

                    {samling.adresseDetSkalReisesFra && (
                        <AdresseFelt
                            adresse={samling.adresseDetSkalReisesFra}
                            label={
                                samling.skalReiseFraFolkeregistrertAdresse === JaNei.JA
                                    ? 'Folkeregistrert adresse'
                                    : 'Adresse det skal reises fra'
                            }
                        />
                    )}

                    {samling.reiseAdresse && (
                        <AdresseFelt
                            adresse={samling.reiseAdresse}
                            label="Adresse jeg skal reise til"
                        />
                    )}
                    {samling.periode && (
                        <SøknadInfoFelt
                            label="I hvilken periode skal du reise til samlingen?"
                            value={formaterIsoPeriode(samling.periode.fom, samling.periode.tom)}
                        />
                    )}

                    {samling.harBehovForTransportUavhengigAvReisensLengde !== undefined && (
                        <SøknadInfoFelt
                            label="Har du funksjonsnedsettelse, midlertidig skade eller sykdom som gjør at du må ha transport til aktivitetsstedet?"
                            value={tekstMedFallback(
                                jaNeiTilTekst,
                                samling.harBehovForTransportUavhengigAvReisensLengde
                            )}
                        />
                    )}

                    {samling.leveringOgHentingIBarnehage && (
                        <>
                            <SøknadInfoFelt
                                label="Gateadressen hvor du henter eller leverer barn"
                                value={samling.leveringOgHentingIBarnehage.gateadresse}
                            />
                            <SøknadInfoFelt
                                label="Postnummer hvor du henter eller leverer barn"
                                value={samling.leveringOgHentingIBarnehage.postnummer}
                            />
                        </>
                    )}

                    {samling.harMerEnn30KmReisevei !== undefined && (
                        <SøknadInfoFelt
                            label="Er reiseveien mer enn 30 km?"
                            value={tekstMedFallback(jaNeiTilTekst, samling.harMerEnn30KmReisevei)}
                        />
                    )}

                    {typeof samling.lengdeReisevei === 'number' && (
                        <SøknadInfoFelt
                            label="Lengde reisevei (km)"
                            value={`${samling.lengdeReisevei} km`}
                        />
                    )}

                    {samling.kanReiseMedOffentligTransport !== undefined && (
                        <SøknadInfoFelt
                            label="Kan du reise med offentlig transport?"
                            value={tekstMedFallback(
                                jaNeiTilTekst,
                                samling.kanReiseMedOffentligTransport
                            )}
                        />
                    )}

                    {samling.offentligTransport?.utgifterOffentligTransport !== undefined && (
                        <SøknadInfoFelt
                            label="Utgifter offentlig transport"
                            value={formatKr(samling.offentligTransport!.utgifterOffentligTransport)}
                        />
                    )}

                    {samling.privatTransport && (
                        <PrivatTransportDetaljer privatTransport={samling.privatTransport} />
                    )}
                </SøknadInfoEkspanderbar>
            ))}
        </VStack>
    );
};
