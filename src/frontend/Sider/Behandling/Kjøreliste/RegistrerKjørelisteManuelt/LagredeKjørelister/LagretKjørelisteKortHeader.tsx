import React, { Dispatch, FC, SetStateAction } from 'react';

import { PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, HStack } from '@navikt/ds-react';

import { formaterIsoPeriode } from '../../../../../utils/dato';
import { ManueltInnsendtKjørelisteUke } from '../typer';
import { LagretKjørelisteBegrunnelse } from './LagretKjørelisteBegrunnelse';

interface Props {
    kjøreliste: ManueltInnsendtKjørelisteUke;
    erStegRedigerbart: boolean | undefined;
    redigerer: boolean;
    startRedigering: () => void;
    åpneSletteModal: () => void;
    begrunnelseInput: string;
    settBegrunnelseInput: Dispatch<SetStateAction<string>>;
}

export const LagretKjørelisteKortHeader: FC<Props> = ({
    kjøreliste,
    erStegRedigerbart,
    redigerer,
    startRedigering,
    åpneSletteModal,
    begrunnelseInput,
    settBegrunnelseInput,
}) => {
    return (
        <>
            <HStack gap="space-48" align="center" justify="space-between" minWidth="200px">
                <Heading size="small">
                    Reise til {kjøreliste.aktivitetsadresse} (
                    {formaterIsoPeriode(kjøreliste.reiseFom, kjøreliste.reiseTom)})
                </Heading>
                <HStack gap="space-8" align="center">
                    <BodyShort size="small" color="subtle">
                        Journalpost ID: {kjøreliste.journalpostId}
                    </BodyShort>
                </HStack>
            </HStack>
            <HStack justify={'space-between'}>
                <LagretKjørelisteBegrunnelse
                    redigerer={redigerer}
                    begrunnelseInput={begrunnelseInput}
                    settBegrunnelseInput={settBegrunnelseInput}
                    begrunnelse={kjøreliste.begrunnelse}
                />

                {erStegRedigerbart && !redigerer && (
                    <Button
                        style={{ width: '110px', alignSelf: 'self-end' }}
                        size="small"
                        variant="tertiary"
                        icon={<PencilIcon />}
                        onClick={startRedigering}
                    >
                        Rediger
                    </Button>
                )}
                {erStegRedigerbart && redigerer && (
                    <Button
                        size="small"
                        style={{ width: '110px', alignSelf: 'self-end' }}
                        variant="tertiary"
                        icon={<TrashIcon />}
                        iconPosition="right"
                        data-color="danger"
                        onClick={åpneSletteModal}
                    >
                        Slett
                    </Button>
                )}
            </HStack>
        </>
    );
};
