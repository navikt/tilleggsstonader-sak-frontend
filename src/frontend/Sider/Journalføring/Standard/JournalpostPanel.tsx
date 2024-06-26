import React, { useState } from 'react';

import styled from 'styled-components';

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
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';

import { Journalføringsaksjon, JournalføringState } from '../../../hooks/useJournalføringState';
import { Arkivtema, utledArkivtema } from '../../../typer/arkivtema';
import { Stønadstype, stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
import { Journalpost } from '../../../typer/journalpost';
import { formaterIsoDato } from '../../../utils/dato';
import {
    journalføringGjelderKlage,
    utledNesteJournalføringsårsak,
    valgbareJournalføringsårsaker,
    valgbareStønadstyper,
} from '../Felles/utils';
import { Journalføringsårsak, journalføringsårsakTilTekst } from '../typer/journalføringsårsak';

const IkonContainer = styled.div`
    color: ${ABlue500};
`;

const ExpansionCardHeader = styled(ExpansionCard.Header)`
    padding-bottom: 0.25rem;
`;

const ExpansionCardContent = styled(VStack)`
    padding-bottom: 1rem;
`;

const StyledSelect = styled(Select)`
    max-width: 13rem;
`;

const StyledCheckbox = styled(Checkbox)`
    margin-left: 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, max-content);
    column-gap: 1.5rem;
`;

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
    } = journalpostState;
    const [erPanelEkspandert, settErPanelEkspandert] = useState<boolean>(
        journalføringsårsak === Journalføringsårsak.IKKE_VALGT || stønadstype === undefined
    );

    const tema = utledArkivtema(journalpost.tema as Arkivtema);
    const datoMottatt = journalpostState.mottattDato
        ? formaterIsoDato(journalpostState.mottattDato)
        : 'Ikke satt';
    const kanRedigere = journalføringsårsak !== Journalføringsårsak.DIGITAL_SØKNAD;
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
            <ExpansionCardHeader>
                <HStack gap="4">
                    <IkonContainer>
                        {erPanelEkspandert ? (
                            <FolderFileFillIcon fontSize={'3.5rem'} />
                        ) : (
                            <FolderFileIcon fontSize={'3.5rem'} />
                        )}
                    </IkonContainer>
                    <Grid>
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
                    </Grid>
                </HStack>
            </ExpansionCardHeader>
            <ExpansionCard.Content>
                <ExpansionCardContent gap="4">
                    <StyledSelect
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
                    </StyledSelect>
                    <StyledSelect
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
                    </StyledSelect>
                    {journalføringGjelderKlage(journalføringsårsak) && (
                        <StyledCheckbox
                            size="small"
                            checked={klageGjelderTilbakekreving}
                            onChange={() => {
                                settJournalføringsårsak((prevState) =>
                                    utledNesteJournalføringsårsak(prevState)
                                );
                            }}
                        >
                            Klagen gjelder tilbakekreving
                        </StyledCheckbox>
                    )}
                </ExpansionCardContent>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};

export default JournalpostPanel;
