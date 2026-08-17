import React, { FC } from 'react';

import { ArrowDownIcon } from '@navikt/aksel-icons';
import { Button, HStack, VStack } from '@navikt/ds-react';

import styles from './KjørelisteFane.module.css';
import { ReiseKort } from './ReiseKort';
import { KjørelisteProvider } from '../../../context/KjørelisteContext';
import { useReisevurderingPrivatBil } from '../../../hooks/useReisevurderingPrivatBil';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { ReisevurderingPrivatBil } from '../../../typer/kjøreliste';
import {
    RammeForReiseMedPrivatBil,
    VedtakDagligReise,
} from '../../../typer/vedtak/vedtakDagligReise';

export const KjørelisteFane: FC = () => {
    const { vedtak } = useVedtak<VedtakDagligReise>();
    const { reisevurderingerResponse } = useReisevurderingPrivatBil();

    return (
        <DataViewer response={{ vedtak, reisevurderingerResponse }} type={'reisedata'}>
            {({ vedtak, reisevurderingerResponse }) => (
                <KjørelisteProvider vedtak={vedtak}>
                    <FaneInnhold reisevurderingerResponse={reisevurderingerResponse} />
                </KjørelisteProvider>
            )}
        </DataViewer>
    );
};

type Sorteringsretning = 'nyest' | 'eldst';

function hentRammeForSortering(
    reisevurdering: ReisevurderingPrivatBil
): RammeForReiseMedPrivatBil | undefined {
    return reisevurdering.rammevedtak ?? reisevurdering.forrigeRammevedtak;
}

function sorterReisevurderinger(
    reisevurderinger: ReisevurderingPrivatBil[],
    sortering: Sorteringsretning
): ReisevurderingPrivatBil[] {
    return [...reisevurderinger].sort((a, b) => {
        const rammeA = hentRammeForSortering(a);
        const rammeB = hentRammeForSortering(b);

        if (!rammeA || !rammeB) {
            if (!rammeA && !rammeB) {
                return a.reiseId.localeCompare(b.reiseId);
            }
            return sortering === 'nyest' ? (rammeA ? -1 : 1) : rammeA ? 1 : -1;
        }

        const tomSammenligning = rammeA.tom.localeCompare(rammeB.tom);
        if (tomSammenligning !== 0) {
            return sortering === 'nyest' ? -tomSammenligning : tomSammenligning;
        }

        const fomSammenligning = rammeA.fom.localeCompare(rammeB.fom);
        if (fomSammenligning !== 0) {
            return sortering === 'nyest' ? -fomSammenligning : fomSammenligning;
        }

        return a.reiseId.localeCompare(b.reiseId);
    });
}

const FaneInnhold: React.FC<{ reisevurderingerResponse: ReisevurderingPrivatBil[] }> = ({
    reisevurderingerResponse,
}) => {
    const [reisevurderinger, settReisevurderinger] = React.useState(reisevurderingerResponse);
    const [sortering, settSortering] = React.useState<Sorteringsretning>('nyest');

    const sorterteReisevurderinger = React.useMemo(
        () => sorterReisevurderinger(reisevurderinger, sortering),
        [reisevurderinger, sortering]
    );

    const oppdaterReisevurderinger = (
        reiseId: string,
        oppdatertReisevurdering: ReisevurderingPrivatBil
    ) => {
        settReisevurderinger((prev) =>
            prev.map((reise) => (reise.reiseId === reiseId ? oppdatertReisevurdering : reise))
        );
    };

    return (
        <VStack gap="space-24">
            <HStack>
                <Button
                    icon={
                        <ArrowDownIcon
                            aria-hidden
                            className={`${styles.pil}${sortering === 'eldst' ? ` ${styles.pilSnudd}` : ''}`}
                        />
                    }
                    iconPosition="left"
                    onClick={() => settSortering((prev) => (prev === 'nyest' ? 'eldst' : 'nyest'))}
                    size="small"
                    variant="secondary"
                >
                    {sortering === 'nyest' ? 'Nyest først' : 'Eldst først'}
                </Button>
            </HStack>

            {sorterteReisevurderinger.map((reise) => (
                <ReiseKort
                    key={reise.reiseId}
                    reisevurdering={reise}
                    oppdaterReisevurdering={(oppdatertReisevurdering: ReisevurderingPrivatBil) =>
                        oppdaterReisevurderinger(reise.reiseId, oppdatertReisevurdering)
                    }
                />
            ))}
            <StegKnapp steg={Steg.KJØRELISTE}>Ferdigstill steg</StegKnapp>
        </VStack>
    );
};
