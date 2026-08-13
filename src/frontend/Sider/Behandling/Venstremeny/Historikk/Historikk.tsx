import React from 'react';

import { FileTextIcon } from '@navikt/aksel-icons';
import { BodyShort, Label, VStack } from '@navikt/ds-react';

import styles from './Historikk.module.css';
import HistorikkElement from './HistorikkElement';
import { useBehandling } from '../../../../context/BehandlingContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { årsakMetadataKildeeTilTekst } from '../../../../typer/behandling/nyeOpplysningerMetadata';

const Historikk: React.FC = () => {
    const { behandlingshistorikk, behandling } = useBehandling();

    return (
        <>
            <DataViewer type={'behandlingshistorikk'} response={{ behandlingshistorikk }}>
                {({ behandlingshistorikk }) => (
                    <ul className={styles.container}>
                        {behandlingshistorikk.map((historikkElement, index) => {
                            const erSisteElementIListe = index === behandlingshistorikk.length - 1;

                            return (
                                <HistorikkElement
                                    erSisteElementIListe={erSisteElementIListe}
                                    historikkHendelse={historikkElement}
                                    key={index}
                                />
                            );
                        })}
                    </ul>
                )}
            </DataViewer>
            {behandling.årsakMetadata?.kilde && (
                <div className={styles.manuellOpprettelse}>
                    <FileTextIcon fontSize="1.5rem" />
                    <VStack gap="space-2" className={styles.innholdContainer}>
                        <Label size="small">Hvorfor behandlingen er opprettet</Label>
                        <BodyShort size="small">
                            <Label size="small">Kilde:</Label>{' '}
                            {årsakMetadataKildeeTilTekst[behandling.årsakMetadata.kilde]}
                        </BodyShort>
                        {behandling.årsakMetadata.beskrivelse && (
                            <BodyShort size="small">
                                <Label size="small">Beskrivelse:</Label>{' '}
                                {behandling.årsakMetadata.beskrivelse}
                            </BodyShort>
                        )}
                    </VStack>
                </div>
            )}
        </>
    );
};

export default Historikk;
