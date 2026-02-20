import React from 'react';

import { ExpansionCard, VStack } from '@navikt/ds-react';

import styles from './BehandlingOppsummering.module.css';
import { OppsummeringVilkår } from './OppsummeringVilkår';
import { VedtakOppsummering } from './VedtakOppsummering';
import { OppsummeringAktiviteter, OppsummeringMålgrupper } from './VilkårOppsummeringRad';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useBehandlingOppsummering } from '../../../../hooks/useBehandlingOppsummering';
import DataViewer from '../../../../komponenter/DataViewer';
import { RessursStatus } from '../../../../typer/ressurs';

export const BehandlingOppsummering = () => {
    const { behandling } = useBehandling();
    const { behandlingOppsummering } = useBehandlingOppsummering();
    if (
        behandlingOppsummering.status === RessursStatus.SUKSESS &&
        !behandlingOppsummering.data.finnesDataÅOppsummere
    ) {
        return null;
    }

    return (
        <DataViewer type={'behandlingsoppsummering'} response={{ behandlingOppsummering }}>
            {({ behandlingOppsummering }) => (
                <ExpansionCard
                    className={styles.expansionCard}
                    aria-label="Oppsummering av vurderinger"
                    defaultOpen
                    size="small"
                >
                    <ExpansionCard.Header>Oppsummering av vurderinger</ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <VStack gap="space-24">
                            <OppsummeringAktiviteter
                                aktiviteter={behandlingOppsummering.aktiviteter}
                            />
                            <OppsummeringMålgrupper
                                målgrupper={behandlingOppsummering.målgrupper}
                            />
                            <OppsummeringVilkår
                                vilkår={behandlingOppsummering.vilkår}
                                stønadstype={behandling.stønadstype}
                            />
                            <VedtakOppsummering vedtak={behandlingOppsummering.vedtak} />
                        </VStack>
                    </ExpansionCard.Content>
                </ExpansionCard>
            )}
        </DataViewer>
    );
};
