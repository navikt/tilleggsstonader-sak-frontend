import React, { useState } from 'react';

import { Button, HStack, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react';

import {
    Oppfølging,
    OppfølgingKontrollRequest,
    OppfølgingUtfall,
    oppfølgingUtfallTilTekst,
} from './oppfølgingTyper';
import { useApp } from '../../../context/AppContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { RessursStatus } from '../../../typer/ressurs';

export const KontrollerOppfølging = ({
    oppfølging,
    avbryt,
    oppdaterOppfølging,
}: {
    oppfølging: Oppfølging;
    avbryt: () => void;
    oppdaterOppfølging: (oppfølging: Oppfølging) => void;
}) => {
    const { request } = useApp();
    const [kommentar, settKommentar] = useState<string>();
    const [utfall, settUtfall] = useState<OppfølgingUtfall>();
    const [feilmelding, settFeilmelding] = useState<string>();

    const [lagrer, settLagrer] = useState<boolean>(false);

    const lagre = () => {
        if (lagrer) {
            return;
        }
        if (!utfall) {
            settFeilmelding('Mangler utfall');
            return;
        }
        settLagrer(true);

        request<Oppfølging, OppfølgingKontrollRequest>(`/api/sak/oppfolging/kontroller`, 'POST', {
            id: oppfølging.id,
            version: oppfølging.version,
            utfall: utfall,
            kommentar: kommentar,
        })
            .then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    oppdaterOppfølging(response.data);
                    avbryt();
                } else {
                    settFeilmelding(response.frontendFeilmelding);
                }
            })
            .finally(() => settLagrer(false));
    };

    return (
        <VStack gap={'2'}>
            <RadioGroup legend="Ufall" size={'small'} onChange={settUtfall}>
                {Object.keys(OppfølgingUtfall).map((utfall) => (
                    <Radio key={utfall} value={utfall}>
                        {oppfølgingUtfallTilTekst[utfall as OppfølgingUtfall]}
                    </Radio>
                ))}
            </RadioGroup>
            <Textarea
                label={'Kommentar'}
                size={'small'}
                style={{ width: '15rem' }}
                onChange={(e) => settKommentar(e.target.value)}
            />
            <Feilmelding>{feilmelding}</Feilmelding>
            <HStack gap={'4'}>
                <Button variant="tertiary" onClick={avbryt} loading={lagrer} size="small">
                    Avbryt
                </Button>
                <Button variant="primary" onClick={lagre} loading={lagrer} size="small">
                    Lagre
                </Button>
            </HStack>
        </VStack>
    );
};
