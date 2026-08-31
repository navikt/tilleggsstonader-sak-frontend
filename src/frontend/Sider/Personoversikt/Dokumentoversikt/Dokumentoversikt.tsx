import React, { useEffect, useState } from 'react';

import { Detail, Heading, UNSAFE_Combobox } from '@navikt/ds-react';

import styles from './Dokumentoversikt.module.css';
import { DokumentTabell } from './DokumentTabell';
import { useHentDokumenter } from '../../../hooks/useHentDokumenter';
import DataViewer from '../../../komponenter/DataViewer';
import { Arkivtema, arkivtemaerTilTekst, relevanteArkivtemaer } from '../../../typer/arkivtema';
import { VedleggRequest } from '../../../typer/dokument';
import { RessursStatus } from '../../../typer/ressurs';
import { formaterDatoMedTidspunkt } from '../../../utils/dato';

const Dokumentoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const [vedleggRequest, settVedleggRequest] = useState<VedleggRequest>({
        tema: [Arkivtema.TSO, Arkivtema.TSR],
    });

    const [hentetTidspunkt, settHentetTidspunkt] = useState<Date | undefined>();

    const dokumenter = useHentDokumenter(fagsakPersonId, {
        ...vedleggRequest,
        tema: vedleggRequest.tema?.length ? vedleggRequest.tema : relevanteArkivtemaer,
    });

    useEffect(() => {
        if (dokumenter.status === RessursStatus.SUKSESS) {
            settHentetTidspunkt(new Date());
        }
    }, [dokumenter.status]);

    const arkivtemaTilOption = (t: Arkivtema) => ({
        value: t,
        label: arkivtemaerTilTekst[t],
    });
    const onToggleSelected = (option: string, isSelected: boolean) =>
        settVedleggRequest((prevState) => ({
            ...prevState,
            tema: isSelected
                ? [...(prevState.tema ?? []), option as Arkivtema]
                : (prevState.tema ?? []).filter((t) => t !== option),
        }));

    return (
        <>
            <Heading size="small">Relevante dokumenter for behandling av tilleggsstønader</Heading>
            <Detail weight="semibold" spacing>
                Bruk filtrering for å se dokumenter av tema arbeidsavklaringspenger, enslig
                forsørger, omstillingsstønad, oppfølging, uføretrygd, yrkesskade eller
                kontantstøtte.
            </Detail>
            <UNSAFE_Combobox
                className={styles.comboBox}
                label={'Filtrer tema(er)'}
                options={relevanteArkivtemaer.map(arkivtemaTilOption)}
                isMultiSelect
                onToggleSelected={onToggleSelected}
                selectedOptions={vedleggRequest.tema?.map(arkivtemaTilOption) ?? []}
            />
            <DataViewer type={'dokumenter'} response={{ dokumenter }}>
                {({ dokumenter }) => (
                    <>
                        <DokumentTabell dokumenter={dokumenter} />
                        <Detail>Oppdatert: {formaterDatoMedTidspunkt(hentetTidspunkt)}</Detail>
                    </>
                )}
            </DataViewer>
        </>
    );
};

export default Dokumentoversikt;
