import React, { FC, useState } from 'react';

import { Button, ExpansionCard, HStack, Textarea } from '@navikt/ds-react';

import styles from './FullførKjørelisteFane.module.css';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import {
    erFeil,
    Feil,
    feiletRessursTilFeilmelding,
    lagFeilmelding,
} from '../../../komponenter/Feil/feilmeldingUtils';
import { Ressurs, RessursFeilet, RessursStatus } from '../../../typer/ressurs';

interface Props {
    initialBegrunnelse: string | null;
    settHarUlagredeEndringer: (har: boolean) => void;
    settBrevPdf: (pdf: Ressurs<string>) => void;
}

export const KjørelisteBrevmeny: FC<Props> = ({
    initialBegrunnelse,
    settHarUlagredeEndringer,
    settBrevPdf,
}) => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [begrunnelse, settBegrunnelse] = useState<string>(initialBegrunnelse ?? '');
    const [lasterBegrunnelse, settLasterBegrunnelse] = useState<boolean>(false);
    const [begrunnelseFeil, settBegrunnelseFeil] = useState<Feil>();

    const lagreBegrunnelse = () => {
        if (lasterBegrunnelse) return;
        settLasterBegrunnelse(true);
        request<string, { begrunnelse: string | null }>(
            `/api/sak/kjorelistebrev/${behandling.id}`,
            'POST',
            { begrunnelse: begrunnelse || null }
        )
            .then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settBrevPdf(res);
                    settHarUlagredeEndringer(false);
                    settBegrunnelseFeil(undefined);
                } else {
                    settBegrunnelseFeil(feiletRessursTilFeilmelding(res as RessursFeilet));
                }
            })
            .catch((error) =>
                erFeil(error)
                    ? settBegrunnelseFeil(error)
                    : settBegrunnelseFeil(lagFeilmelding('Ukjent feil oppstod'))
            )
            .finally(() => settLasterBegrunnelse(false));
    };

    return (
        <div className={styles.background}>
            <ExpansionCard aria-label="Begrunnelse" size="small" defaultOpen>
                <ExpansionCard.Header>
                    <HStack wrap={false} align="center" gap="space-8">
                        <ExpansionCard.Title size="small">Begrunnelse</ExpansionCard.Title>
                    </HStack>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    <div className={styles.container}>
                        <Textarea
                            label="Begrunnelse for vedtaket"
                            hideLabel
                            value={begrunnelse}
                            onChange={(e) => {
                                settBegrunnelse(e.target.value);
                                settHarUlagredeEndringer(true);
                            }}
                            minRows={3}
                        />
                        <Feilmelding feil={begrunnelseFeil} />
                        <Button
                            variant="secondary"
                            loading={lasterBegrunnelse}
                            onClick={lagreBegrunnelse}
                            size="small"
                        >
                            Lagre begrunnelse
                        </Button>
                    </div>
                </ExpansionCard.Content>
            </ExpansionCard>
        </div>
    );
};
