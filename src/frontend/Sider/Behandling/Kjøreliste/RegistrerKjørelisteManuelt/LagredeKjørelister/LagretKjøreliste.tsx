import React from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Heading, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { BorderNeutralSubtle } from '@navikt/ds-tokens/js';

import { UkeInnholdLagretKjøreliste } from './UkeInnholdLagretKjøreliste';
import { useRegistrerKjøreliste } from '../../../../../context/RegistrerKjørelisteContext/RegistrerKjørelisteContext';
import { useSteg } from '../../../../../context/StegContext';
import { Feilmelding } from '../../../../../komponenter/Feil/Feilmelding';
import {
    Feil,
    feiletRessursTilFeilmelding,
} from '../../../../../komponenter/Feil/feilmeldingUtils';
import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import { TableHeaderCellSmall } from '../../../../../komponenter/TabellSmall';
import { formaterIsoPeriode } from '../../../../../utils/dato';
import { ManueltInnsendtKjørelisteUke } from '../typer';

export const OppsummertLagretKjøreliste: React.FC<{
    kjøreliste: ManueltInnsendtKjørelisteUke;
}> = ({ kjøreliste }) => {
    const { slettKjøreliste } = useRegistrerKjøreliste();
    const { erStegRedigerbart } = useSteg();

    const [feilmelding, settFeilmelding] = React.useState<Feil | undefined>(undefined);

    const slett = () => {
        slettKjøreliste(kjøreliste.id).then((respons) => {
            if (respons.status === 'FEILET') {
                settFeilmelding(feiletRessursTilFeilmelding(respons));
            }
        });
    };

    return (
        <Box background="default" borderColor="neutral-subtle" borderRadius="12" borderWidth="1">
            <VStack gap="space-8" paddingBlock="space-16 space-8" paddingInline="space-24">
                <HStack gap="space-48" align="center" justify="space-between" minWidth="200px">
                    <Heading size="small">
                        Reise til {kjøreliste.aktivitetsadresse} (
                        {formaterIsoPeriode(kjøreliste.reiseFom, kjøreliste.reiseTom)})
                    </Heading>
                    <BodyShort size="small" color="subtle">
                        Journalpost ID: {kjøreliste.journalpostId}
                    </BodyShort>
                </HStack>
                <HStack justify="space-between" align="end">
                    <div>
                        <Label size="small">Begrunnelse for manuell registrering: </Label>
                        <BodyShort size="small">
                            {kjøreliste.begrunnelse
                                ? kjøreliste.begrunnelse
                                : 'Ingen begrunnselse lagt ved'}
                        </BodyShort>
                    </div>
                    {erStegRedigerbart && (
                        <Button
                            size="small"
                            variant="tertiary"
                            icon={<TrashIcon />}
                            iconPosition="right"
                            data-color="danger"
                            onClick={slett}
                        >
                            Slett
                        </Button>
                    )}
                </HStack>
                <Feilmelding feil={feilmelding} />
            </VStack>

            <Skillelinje borderColor={BorderNeutralSubtle} />

            <Box paddingBlock="space-8 space-16" paddingInline="space-16">
                <Table size="small" width="fit-content">
                    <Table.Body>
                        {kjøreliste.innsendteUker.map((uke) => (
                            <Table.ExpandableRow
                                key={uke.fom}
                                content={<UkeInnholdLagretKjøreliste dager={uke.dager} />}
                                defaultOpen
                            >
                                <TableHeaderCellSmall>
                                    <HStack gap="space-16" align="center">
                                        <Heading size="small">{`Uke ${uke.ukenummer}`}</Heading>
                                        <BodyShort size="small">
                                            {formaterIsoPeriode(uke.fom, uke.tom)}
                                        </BodyShort>
                                    </HStack>
                                </TableHeaderCellSmall>
                            </Table.ExpandableRow>
                        ))}
                    </Table.Body>
                </Table>
            </Box>
        </Box>
    );
};
