import React, { FC, useState } from 'react';

import { Heading, HStack, Label, Switch } from '@navikt/ds-react';

import styles from './Beregningsresultat.module.css';
import { DagligReiseBeregningstabell } from '../../../../../../komponenter/DagligReiseBeregningstabell';
import { BeregningsresultatOffentligTransport } from '../../../../../../typer/vedtak/vedtakDagligReise';

interface Props {
    beregningsresultat: BeregningsresultatOffentligTransport;
}

export const BeregningOffentligTransport: FC<Props> = ({ beregningsresultat }) => {
    const [visTidligerePerioder, setVisTidligerePerioder] = useState(false);

    const harPerioderFraTidligereVedtak = beregningsresultat.reiser.some((reise) =>
        reise.perioder.some((periode) => periode.fraTidligereVedtak)
    );

    return (
        <div>
            <HStack justify="space-between">
                <Heading spacing size="xsmall" level="4">
                    Beregningsresultat
                </Heading>
                {harPerioderFraTidligereVedtak && (
                    <Switch
                        position="left"
                        size="small"
                        checked={visTidligerePerioder}
                        onChange={() => setVisTidligerePerioder((prev) => !prev)}
                    >
                        Vis upåvirkede perioder
                    </Switch>
                )}
            </HStack>
            {beregningsresultat.reiser.map((reise, reiseIndex) => {
                const relevantePerioder = reise.perioder.filter(
                    (periode) => visTidligerePerioder || !periode.fraTidligereVedtak
                );
                if (relevantePerioder.length === 0) {
                    return null;
                }
                const antallReisedagerPerUke = relevantePerioder[0].antallReisedagerPerUke;
                return (
                    <HStack gap="space-8" key={reiseIndex} className={styles.reiseSection}>
                        <Label size="small">
                            {reise.adresse} · offentlig transport · {antallReisedagerPerUke}{' '}
                            dager/uke
                        </Label>
                        <DagligReiseBeregningstabell perioder={relevantePerioder} />
                    </HStack>
                );
            })}
        </div>
    );
};
