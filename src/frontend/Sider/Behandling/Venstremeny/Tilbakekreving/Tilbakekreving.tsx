import React from 'react';

import { BodyShort, Detail, Label, Link, VStack } from '@navikt/ds-react';

import styles from './Tilbakekreving.module.css';
import { tilbakekrevingstatusTilTekst } from './typer';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useTilbakekrevingHendelser } from '../../../../hooks/useTilbakekrevingHendelser';
import DataViewer from '../../../../komponenter/DataViewer';
import {
    formaterIsoDato,
    formaterIsoDatoTidKort,
    formaterIsoPeriode,
} from '../../../../utils/dato';
import {
    kronerMedTusenSkilleEllerStrek,
    tekstMedFallback,
} from '../../../../utils/tekstformatering';

const Tilbakekreving: React.FC = () => {
    const { behandling } = useBehandling();
    const { tilbakekrevingHendelser } = useTilbakekrevingHendelser(behandling.id);

    return (
        <DataViewer type={'tilbakekrevingshendelser'} response={{ tilbakekrevingHendelser }}>
            {({ tilbakekrevingHendelser }) => {
                if (tilbakekrevingHendelser.length === 0) {
                    return <BodyShort>Ingen tilbakekrevingshendelser</BodyShort>;
                }

                const saksbehandlingURL = tilbakekrevingHendelser.find(
                    (hendelse) => hendelse.saksbehandlingURL
                )?.saksbehandlingURL;

                return (
                    <VStack gap="space-16">
                        {saksbehandlingURL && (
                            <Link href={saksbehandlingURL} target="_blank">
                                Gå til tilbakekrevingsbehandling
                            </Link>
                        )}
                        {tilbakekrevingHendelser.map((hendelse, index) => (
                            <div className={styles.hendelse} key={index}>
                                <Label size="small">
                                    {tekstMedFallback(
                                        tilbakekrevingstatusTilTekst,
                                        hendelse.behandlingstatus
                                    )}
                                </Label>
                                <Detail>
                                    {formaterIsoDatoTidKort(hendelse.hendelseOpprettet)}
                                </Detail>
                                <BodyShort size="small">
                                    Feilutbetalt:{' '}
                                    {kronerMedTusenSkilleEllerStrek(
                                        hendelse.totaltFeilutbetaltBeløp
                                    )}
                                </BodyShort>
                                <BodyShort size="small">
                                    Periode:{' '}
                                    {formaterIsoPeriode(
                                        hendelse.tilbakekrevingFom,
                                        hendelse.tilbakekrevingTom
                                    )}
                                </BodyShort>
                                {hendelse.varselSendtTidspunkt && (
                                    <BodyShort size="small">
                                        Varsel sendt:{' '}
                                        {formaterIsoDato(hendelse.varselSendtTidspunkt)}
                                    </BodyShort>
                                )}
                            </div>
                        ))}
                    </VStack>
                );
            }}
        </DataViewer>
    );
};

export default Tilbakekreving;
