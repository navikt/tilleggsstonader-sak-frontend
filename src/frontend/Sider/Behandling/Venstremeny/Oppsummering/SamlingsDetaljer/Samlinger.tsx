import React from 'react';

import { EarthIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';

import { DrosjeDetaljer } from './DrosjeDetaljer';
import { OffentligTransportDetaljer } from './OffentligTransportDetaljer';
import { PrivatBilDetaljer } from './PrivatBilDetaljer';
import {
    FaktaSamling,
    transportmiddelTilTekst,
    årsakKanIkkeBenytteEgenBilTilTekst,
    ÅrsakKanIkkeBenyttePrivatBil,
} from '../../../../../typer/behandling/behandlingFakta/faktaSamlinger';
import { jaNeiTilTekst } from '../../../../../typer/common';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { tekstMedFallback } from '../../../../../utils/tekstformatering';
import { AdresseFelt } from '../AdresseFelt';
import { SøknadInfoEkspanderbar, SøknadInfoFelt } from '../Visningskomponenter';
import { UnntakFraOffentligTransportDetaljer } from './UnntakFraOffentligTransportDetaljer';

export const Samlinger: React.FC<{ samlinger: FaktaSamling[] }> = ({ samlinger }) => {
    return (
        <VStack gap="space-12">
            {samlinger.map((samling, index) => {
                const reisemåte = samling.reisemåte;

                return (
                    <SøknadInfoEkspanderbar
                        ikon={<EarthIcon />}
                        key={index}
                        tittel={`Samling ${index + 1}`}
                        variant="subtle"
                    >
                        <SøknadInfoFelt
                            label="I hvilken periode skal du reise til samlingen?"
                            value={formaterIsoPeriode(samling.fom, samling.tom)}
                        />

                        <SøknadInfoFelt
                            label="Er samlingen obligatorisk?"
                            value={tekstMedFallback(jaNeiTilTekst, samling.erObligatorisk)}
                        />

                        <AdresseFelt label="Adresse for samlingen" {...samling.adresse} />

                        <SøknadInfoFelt
                            label="Antall kilometer én vei"
                            value={`${samling.antallKilometerEnVei} km`}
                        />

                        {reisemåte?.hvilkeTransportmidlerBleBenyttet &&
                            reisemåte.hvilkeTransportmidlerBleBenyttet.length > 0 && (
                                <SøknadInfoFelt
                                    label="Hvilke transportmidler ble benyttet?"
                                    value={reisemåte.hvilkeTransportmidlerBleBenyttet
                                        .map((transportmiddel) =>
                                            tekstMedFallback(
                                                transportmiddelTilTekst,
                                                transportmiddel
                                            )
                                        )
                                        .join(', ')}
                                />
                            )}

                        {reisemåte?.unntakFraOffentligTransport && (
                            <UnntakFraOffentligTransportDetaljer
                                unntakFraOffentligTransport={reisemåte.unntakFraOffentligTransport}
                            />
                        )}

                        {reisemåte?.unntakFraPrivatBil &&
                            reisemåte.unntakFraPrivatBil.length > 0 && (
                                <SøknadInfoFelt
                                    label="Hvorfor kan du ikke kjøre egen bil hele veien?"
                                    value={
                                        <VStack gap="space-4">
                                            {reisemåte.unntakFraPrivatBil.map(
                                                (årsak: ÅrsakKanIkkeBenyttePrivatBil) => (
                                                    <BodyShort key={årsak} size="small">
                                                        {tekstMedFallback(
                                                            årsakKanIkkeBenytteEgenBilTilTekst,
                                                            årsak
                                                        )}
                                                    </BodyShort>
                                                )
                                            )}
                                        </VStack>
                                    }
                                />
                            )}

                        {reisemåte?.offentligTransport && (
                            <OffentligTransportDetaljer
                                offentligTransport={reisemåte.offentligTransport}
                            />
                        )}

                        {reisemåte?.privatBil && (
                            <PrivatBilDetaljer privatBil={reisemåte.privatBil} />
                        )}

                        {reisemåte?.drosje && <DrosjeDetaljer drosje={reisemåte.drosje} />}
                    </SøknadInfoEkspanderbar>
                );
            })}
        </VStack>
    );
};
