import React, { useEffect } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { v7 } from 'uuid';

import { TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, HStack, TextField, VStack } from '@navikt/ds-react';

import SmallButton from '../../../../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../../../../komponenter/Skillelinje';
import DateInputMedLeservisning from '../../../../../../komponenter/Skjema/DateInputMedLeservisning';
import { FeilmeldingMaksBredde } from '../../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { harTallverdi, tilHeltall } from '../../../../../../utils/tall';
import { Toggle } from '../../../../../../utils/toggles';
import { fjernSpaces } from '../../../../../../utils/utils';
import {
    FaktaDagligReise,
    FaktaPrivatBil,
    FaktaReiseperiodePrivatBil,
} from '../../typer/faktaDagligReise';
import { LeggTilNyPeriodeKnapp } from '../LeggTilNyPeriodeKnapp';
import { defaultPrivatBilPeriode, tomtPrivatBil } from '../utils';
import { FeilmeldingerFaktaPrivatBil } from '../validering';

interface Props {
    fakta: FaktaPrivatBil;
    feilmeldinger: FeilmeldingerFaktaPrivatBil | undefined;
    settFakta: React.Dispatch<React.SetStateAction<FaktaDagligReise>>;
    nullstillFeilOgUlagretkomponent: () => void;
}

export const EndreFaktaPrivatBil: React.FC<Props> = ({
    fakta,
    settFakta,
    feilmeldinger,
    nullstillFeilOgUlagretkomponent,
}) => {
    const kanBehandlePrivatBil = useFlag(Toggle.KAN_BEHANDLE_PRIVAT_BIL);

    // Sett default fakta med én periode hvis det mangler ved mount
    useEffect(() => {
        if (fakta.type !== 'PRIVAT_BIL') {
            settFakta({ ...tomtPrivatBil });
        }
    }, [fakta, settFakta]);

    if (!kanBehandlePrivatBil) {
        return (
            <BodyShort size="small">
                Vi jobber med å gjøre det mulig å behandle kjøring med privat bil 🚗.
            </BodyShort>
        );
    }

    // Oppdater et felt i en gitt periode
    const oppdaterPeriode = (
        periodeId: string,
        key: keyof FaktaReiseperiodePrivatBil,
        verdi: number | string | undefined
    ) => {
        settFakta((prevState) => {
            const privatBilState = prevState as FaktaPrivatBil;
            const nyePerioder = privatBilState.reiseperioder.map((p: FaktaReiseperiodePrivatBil) =>
                p.periodeId === periodeId ? { ...p, [key]: verdi } : p
            );
            return { ...privatBilState, reiseperioder: nyePerioder };
        });
        nullstillFeilOgUlagretkomponent();
    };

    // Legg til ny periode
    const leggTilPeriode = () => {
        settFakta((prevState) => {
            const privatBilState = prevState as FaktaPrivatBil;
            const nyPeriode: FaktaReiseperiodePrivatBil = {
                ...defaultPrivatBilPeriode,
                periodeId: v7(),
            };
            return {
                ...privatBilState,
                reiseperioder: [...privatBilState.reiseperioder, nyPeriode],
            };
        });
        nullstillFeilOgUlagretkomponent();
    };

    const slettPeriode = (periodeId: string) => {
        settFakta((prevState) => {
            const privatBilState = prevState as FaktaPrivatBil;
            const nyePerioder =
                privatBilState.reiseperioder.length > 1
                    ? privatBilState.reiseperioder.filter(
                          (p: FaktaReiseperiodePrivatBil) => p.periodeId !== periodeId
                      )
                    : privatBilState.reiseperioder;
            return { ...privatBilState, reiseperioder: nyePerioder };
        });
        nullstillFeilOgUlagretkomponent();
    };

    const oppdaterFelles = (key: keyof FaktaPrivatBil, verdi: number | undefined) => {
        settFakta((prevState) => {
            if (prevState.type !== 'PRIVAT_BIL') return { ...tomtPrivatBil };
            return { ...prevState, [key]: verdi };
        });
        nullstillFeilOgUlagretkomponent();
    };

    return (
        <VStack>
            <Heading size="xsmall" level="4" style={{ marginBottom: '1rem' }}>
                Daglig reise med privat bil
            </Heading>
            {fakta.reiseperioder &&
                fakta.reiseperioder.length > 0 &&
                fakta.reiseperioder.map((periode, reiseperiodeIndex) => (
                    <HStack gap={'space-16'} align="start" key={periode.periodeId}>
                        <FeilmeldingMaksBredde $maxWidth={152}>
                            <DateInputMedLeservisning
                                label={reiseperiodeIndex === 0 ? 'Fra' : ''}
                                value={periode.fom}
                                feil={feilmeldinger?.fom}
                                onChange={(dato) => {
                                    oppdaterPeriode(periode.periodeId, 'fom', dato);
                                }}
                                size="small"
                            />
                        </FeilmeldingMaksBredde>
                        <FeilmeldingMaksBredde $maxWidth={152}>
                            <DateInputMedLeservisning
                                label={reiseperiodeIndex === 0 ? 'Til' : ''}
                                value={periode?.tom}
                                feil={feilmeldinger?.tom}
                                onChange={(dato) => {
                                    oppdaterPeriode(periode.periodeId, 'tom', dato);
                                }}
                                size="small"
                            />
                        </FeilmeldingMaksBredde>
                        <FeilmeldingMaksBredde $maxWidth={180}>
                            <TextField
                                label={reiseperiodeIndex === 0 ? 'Reisedager pr uke' : ''}
                                size="small"
                                error={feilmeldinger?.reisedagerPerUke}
                                value={
                                    harTallverdi(periode.reisedagerPerUke)
                                        ? periode.reisedagerPerUke
                                        : ''
                                }
                                onChange={(e) => {
                                    oppdaterPeriode(
                                        periode.periodeId,
                                        'reisedagerPerUke',
                                        tilHeltall(fjernSpaces(e.target.value))
                                    );
                                }}
                            />
                        </FeilmeldingMaksBredde>
                        <FeilmeldingMaksBredde $maxWidth={180}>
                            <TextField
                                label={reiseperiodeIndex === 0 ? 'Bompenger en vei' : ''}
                                size="small"
                                error={feilmeldinger?.bompengerEnVei}
                                value={
                                    harTallverdi(periode.bompengerEnVei)
                                        ? periode.bompengerEnVei
                                        : ''
                                }
                                onChange={(e) => {
                                    oppdaterPeriode(
                                        periode.periodeId,
                                        'bompengerEnVei',
                                        tilHeltall(fjernSpaces(e.target.value))
                                    );
                                }}
                            />
                        </FeilmeldingMaksBredde>
                        <FeilmeldingMaksBredde $maxWidth={180}>
                            <TextField
                                label={reiseperiodeIndex === 0 ? 'Fergekostnad en vei' : ''}
                                size="small"
                                error={feilmeldinger?.fergeEnVei}
                                value={
                                    harTallverdi(periode.fergekostandEnVei)
                                        ? periode.fergekostandEnVei
                                        : ''
                                }
                                onChange={(e) => {
                                    oppdaterPeriode(
                                        periode.periodeId,
                                        'fergekostandEnVei',
                                        tilHeltall(fjernSpaces(e.target.value))
                                    );
                                }}
                            />
                        </FeilmeldingMaksBredde>
                        {fakta.reiseperioder.length > 1 && (
                            <SmallButton
                                style={{ alignSelf: 'self-end' }}
                                variant={'tertiary'}
                                icon={<TrashIcon title="Slett periode" />}
                                iconPosition={'right'}
                                onClick={() => slettPeriode(periode.periodeId)}
                            />
                        )}
                    </HStack>
                ))}
            <div style={{ marginTop: '1rem' }}>
                <LeggTilNyPeriodeKnapp
                    onKlikk={leggTilPeriode}
                    feilmelding={undefined}
                    onLukkFeilmelding={() => {}}
                />
            </div>
            <Skillelinje />
            <Heading size="xsmall" level="4">
                Felles for hele perioden
            </Heading>
            <HStack>
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Reiseavstand en vei (km)'}
                        size="small"
                        error={feilmeldinger?.reiseavstandEnVei}
                        value={harTallverdi(fakta.reiseavstandEnVei) ? fakta.reiseavstandEnVei : ''}
                        onChange={(e) => {
                            oppdaterFelles(
                                'reiseavstandEnVei',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
            </HStack>
        </VStack>
    );
};
