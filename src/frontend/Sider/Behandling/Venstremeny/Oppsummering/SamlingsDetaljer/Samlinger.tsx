import React from 'react';

import { EarthIcon } from '@navikt/aksel-icons';
import { BodyShort, CopyButton, VStack } from '@navikt/ds-react';

import { DrosjeDetaljer } from './DrosjeDetaljer';
import { OffentligTransportDetaljer } from './OffentligTransportDetaljer';
import { PrivatBilDetaljer } from './PrivatBilDetaljer';
import styles from './SamlingsDetaljer.module.css';
import { UnntakFraOffentligTransportDetaljer } from './UnntakFraOffentligTransportDetaljer';
import { reiseAdresseTilTekst } from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import {
    FaktaSamling,
    transportmiddelTilTekst,
} from '../../../../../typer/behandling/behandlingFakta/faktaSamlinger';
import { jaNeiTilTekst } from '../../../../../typer/common';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { tekstMedFallback } from '../../../../../utils/tekstformatering';
import { SøknadInfoEkspanderbar, SøknadInfoFelt } from '../Visningskomponenter';

export const Samlinger: React.FC<{ samlinger: FaktaSamling[] }> = ({ samlinger }) => {
    return (
        <VStack gap="space-12">
            {samlinger.map((samling, index) => {
                const adresseTekst = reiseAdresseTilTekst(samling.adresse);
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

                        <SøknadInfoFelt
                            label="Adresse for samlingen"
                            value={
                                <span>
                                    <BodyShort as="span" size="small">
                                        {adresseTekst}
                                    </BodyShort>
                                    <CopyButton
                                        copyText={adresseTekst}
                                        className={styles.kopiknapp}
                                        size="small"
                                    />
                                </span>
                            }
                        />

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

                        {reisemåte?.offentligTransport && (
                            <OffentligTransportDetaljer
                                offentligTransport={reisemåte.offentligTransport}
                            />
                        )}

                        {reisemåte?.privatBil && (
                            <PrivatBilDetaljer
                                privatBil={reisemåte.privatBil}
                                unntakFraPrivatBil={reisemåte.unntakFraPrivatBil}
                            />
                        )}

                        {reisemåte?.drosje && <DrosjeDetaljer drosje={reisemåte.drosje} />}

                        {reisemåte?.unntakFraOffentligTransport && (
                            <UnntakFraOffentligTransportDetaljer
                                unntakFraOffentligTransport={reisemåte.unntakFraOffentligTransport}
                            />
                        )}
                    </SøknadInfoEkspanderbar>
                );
            })}
        </VStack>
    );
};
