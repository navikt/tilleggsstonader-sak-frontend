import React, { useState } from 'react';

import { FolderFileFillIcon, FolderFileIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    Checkbox,
    ExpansionCard,
    Heading,
    HStack,
    Select,
    VStack,
} from '@navikt/ds-react';

import styles from './JournalpostPanel.module.css';
import { Journalføringsaksjon, JournalføringState } from '../../../hooks/useJournalføringState';
import { Arkivtema, utledArkivtema } from '../../../typer/arkivtema';
import { Stønadstype, stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
import { Journalpost } from '../../../typer/journalpost';
import { formaterIsoDato } from '../../../utils/dato';
import {
    journalføringGjelderKlage,
    utledNesteJournalføringsårsak,
    valgbareJournalføringsårsaker,
} from '../Felles/utils';
import { Journalføringsårsak, journalføringsårsakTilTekst } from '../typer/journalføringsårsak';

interface Props {
    journalpost: Journalpost;
    journalpostState: JournalføringState;
}

const JournalpostPanel: React.FC<Props> = ({ journalpost, journalpostState }) => {
    const {
        journalføringsårsak,
        settJournalføringsårsak,
        stønadstype,
        settStønadstype,
        settJournalføringsaksjon,
        valgbareStønadstyper,
    } = journalpostState;
    const [erPanelEkspandert, settErPanelEkspandert] = useState<boolean>(
        journalføringsårsak === Journalføringsårsak.IKKE_VALGT || stønadstype === undefined
    );

    const tema = utledArkivtema(journalpost.tema as Arkivtema);
    const datoMottatt = journalpostState.mottattDato
        ? formaterIsoDato(journalpostState.mottattDato)
        : 'Ikke satt';
    const kanRedigere = valgbareStønadstyper.length > 1;
    const klageGjelderTilbakekreving =
        journalføringsårsak === Journalføringsårsak.KLAGE_TILBAKEKREVING;

    return (
        <ExpansionCard
            id={journalpost.journalpostId}
            size="small"
            aria-label="journalpost"
            open={erPanelEkspandert}
            onToggle={() => settErPanelEkspandert((prevState) => !prevState)}
        >
            <ExpansionCard.Header className={styles.expansionCardHeader}>
                <HStack gap="space-16">
                    <div className={styles.ikonContainer}>
                        {erPanelEkspandert ? (
                            <FolderFileFillIcon fontSize={'3.5rem'} />
                        ) : (
                            <FolderFileIcon fontSize={'3.5rem'} />
                        )}
                    </div>
                    <div className={styles.grid}>
                        <Heading size={'small'} level={'2'}>
                            Tema:
                        </Heading>
                        <Heading size={'small'} level={'2'}>
                            Stønadstype:
                        </Heading>
                        <Heading size={'small'} level={'2'}>
                            Type:
                        </Heading>
                        <Heading size={'small'} level={'2'}>
                            Mottatt:
                        </Heading>
                        <BodyShort>{tema}</BodyShort>
                        <BodyShort>
                            {stønadstype ? stønadstypeTilTekst[stønadstype] : 'Ikke valgt'}
                        </BodyShort>
                        <BodyShort>{journalføringsårsakTilTekst[journalføringsårsak]}</BodyShort>
                        <BodyShort>{datoMottatt}</BodyShort>
                    </div>
                </HStack>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <VStack className={styles.expansionCardContent} gap="space-16">
                    <Select
                        className={styles.maxWidth}
                        label="Stønadstype"
                        size="small"
                        value={stønadstype}
                        onChange={(event) => {
                            settJournalføringsaksjon(Journalføringsaksjon.JOURNALFØR_PÅ_FAGSAK);
                            settStønadstype(event.target.value as Stønadstype);
                        }}
                        disabled={!kanRedigere}
                    >
                        <option key={'Ikke valgt'} value={''}>
                            Ikke valgt
                        </option>
                        {valgbareStønadstyper.map((stønadstype) => {
                            return (
                                <option key={stønadstype} value={stønadstype}>
                                    {stønadstypeTilTekst[stønadstype]}
                                </option>
                            );
                        })}
                    </Select>
                    <Select
                        className={styles.maxWidth}
                        label="Type"
                        size="small"
                        value={journalføringsårsak}
                        onChange={(event) => {
                            settJournalføringsaksjon(Journalføringsaksjon.JOURNALFØR_PÅ_FAGSAK);
                            settJournalføringsårsak(event.target.value as Journalføringsårsak);
                        }}
                        disabled={!kanRedigere}
                    >
                        {valgbareJournalføringsårsaker(journalføringsårsak).map((type) => (
                            <option key={type} value={type}>
                                {journalføringsårsakTilTekst[type]}
                            </option>
                        ))}
                        {!kanRedigere && (
                            <option
                                key={'digitalsøknad'}
                                value={Journalføringsårsak.DIGITAL_SØKNAD}
                            >
                                {journalføringsårsakTilTekst[Journalføringsårsak.DIGITAL_SØKNAD]}
                            </option>
                        )}
                    </Select>
                    {journalføringGjelderKlage(journalføringsårsak) && (
                        <Checkbox
                            className={styles.marginLeft}
                            size="small"
                            checked={klageGjelderTilbakekreving}
                            onChange={() => {
                                settJournalføringsårsak((prevState) =>
                                    utledNesteJournalføringsårsak(prevState)
                                );
                            }}
                        >
                            Klagen gjelder tilbakekreving
                        </Checkbox>
                    )}
                </VStack>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};

export default JournalpostPanel;
