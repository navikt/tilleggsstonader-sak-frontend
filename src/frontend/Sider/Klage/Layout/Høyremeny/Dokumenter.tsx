import * as React from 'react';

import { Heading } from '@navikt/ds-react';

import styles from './Dokumenter.module.css';
import { lastNedDokument, sorterDokumentlisten } from './utils';
import DataViewer from '../../../../komponenter/DataViewer';
import { Dokumentliste } from '../../familie-felles-frontend/familie-dokumentliste';
import { useHentDokumenter } from '../../hooks/useHentDokumenter';

export const Dokumenter: React.FC<{ hidden: boolean }> = ({ hidden }) => {
    const dokumenter = useHentDokumenter();

    if (hidden) {
        return <></>;
    }

    return (
        <DataViewer type={'dokumenter'} response={{ dokumenter }}>
            {({ dokumenter }) => {
                const sortertDokumentliste = sorterDokumentlisten(dokumenter);
                return (
                    <>
                        <Heading size={'small'} className={styles.overskrift}>
                            Dokumentoversikt
                        </Heading>
                        <Dokumentliste
                            dokumenter={sortertDokumentliste}
                            onClick={lastNedDokument}
                        />
                    </>
                );
            }}
        </DataViewer>
    );
};
