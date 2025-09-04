import React, { useEffect, useState } from 'react';

import { Heading, HStack, TextField } from '@navikt/ds-react';

import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import { fjernSpaces } from '../../../../utils/utils';
import { OffentligTransport, RedigerbareVilkårfelter } from '../../vilkår';
import { Feilmeldinger } from '../../Vilkårvurdering/validering';

type Props = {
    redigerbareVilkårfelter: RedigerbareVilkårfelter;
    settDetFinnesUlagredeEndringer: (harUlagredeEndringer: boolean) => void;
    settFeilmeldinger: (
        value: ((prevState: Feilmeldinger) => Feilmeldinger) | Feilmeldinger
    ) => void;
    feilmeldinger: Feilmeldinger;
    settOffentligTransport: (offentligTransport: OffentligTransport) => void;
};

export const OffentligTransportSeksjon = ({
    redigerbareVilkårfelter,
    settDetFinnesUlagredeEndringer,
    settFeilmeldinger,
    settOffentligTransport,
}: Props) => {
    const [antallReisedager, settAntallReisedager] = useState<number | undefined>(
        redigerbareVilkårfelter.offentligTransport?.reisedagerPerUke
    );
    const [enkeltbillett, settEnkeltbillett] = useState<number | undefined>(
        redigerbareVilkårfelter.offentligTransport?.prisEnkelbillett
    );
    const [syvdagersbilett, settSyvdagersbillett] = useState<number | undefined>(
        redigerbareVilkårfelter.offentligTransport?.prisSyvdagersbillett
    );
    const [trettidagersbillett, setttrettidagersbillett] = useState<number | undefined>(
        redigerbareVilkårfelter.offentligTransport?.prisTrettidagersbillett
    );

    useEffect(() => {
        if (
            antallReisedager !== undefined &&
            enkeltbillett !== undefined &&
            trettidagersbillett !== undefined
        ) {
            settOffentligTransport({
                reisedagerPerUke: antallReisedager,
                prisEnkelbillett: enkeltbillett,
                prisSyvdagersbillett: syvdagersbilett,
                prisTrettidagersbillett: trettidagersbillett,
            });
        }
    }, [
        antallReisedager,
        enkeltbillett,
        syvdagersbilett,
        trettidagersbillett,
        settOffentligTransport,
    ]);

    const oppdaterAntallReisedager = (verdi: number | undefined) => {
        settAntallReisedager(verdi);
        settFeilmeldinger((prevState) => ({ ...prevState, utgift: undefined }));
        settDetFinnesUlagredeEndringer(true);
    };

    const oppdaterEnkeltbilett = (verdi: number | undefined) => {
        settEnkeltbillett(verdi);
        settFeilmeldinger((prevState) => ({ ...prevState, utgift: undefined }));
        settDetFinnesUlagredeEndringer(true);
    };

    const oppdaterSyvdagersBilett = (verdi: number | undefined) => {
        settSyvdagersbillett(verdi);
        settFeilmeldinger((prevState) => ({ ...prevState, utgift: undefined }));
        settDetFinnesUlagredeEndringer(true);
    };

    const oppdaterTrettidagersbilett = (verdi: number | undefined) => {
        setttrettidagersbillett(verdi);
        settFeilmeldinger((prevState) => ({ ...prevState, utgift: undefined }));
        settDetFinnesUlagredeEndringer(true);
    };

    return (
        <>
            <Heading size={'xsmall'}>Daglig reise med offentlig transport</Heading>
            <HStack gap="4" align="start">
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Reisedager pr uke'}
                        size="small"
                        value={harTallverdi(antallReisedager) ? antallReisedager : ''}
                        onChange={(e) => {
                            oppdaterAntallReisedager(tilHeltall(fjernSpaces(e.target.value)));
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Pris enkeltbillett'}
                        size="small"
                        value={harTallverdi(enkeltbillett) ? enkeltbillett : ''}
                        onChange={(e) => {
                            oppdaterEnkeltbilett(tilHeltall(fjernSpaces(e.target.value)));
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Pris 7-dagersbillett'}
                        size="small"
                        value={harTallverdi(syvdagersbilett) ? syvdagersbilett : ''}
                        onChange={(e) => {
                            oppdaterSyvdagersBilett(tilHeltall(fjernSpaces(e.target.value)));
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Pris 30-dagersbillett'}
                        size="small"
                        value={harTallverdi(trettidagersbillett) ? trettidagersbillett : ''}
                        onChange={(e) => {
                            oppdaterTrettidagersbilett(tilHeltall(fjernSpaces(e.target.value)));
                        }}
                    />
                </FeilmeldingMaksBredde>
            </HStack>
        </>
    );
};
