import React, { useEffect } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, HStack, Select, TextField, VStack } from '@navikt/ds-react';

import SmallButton from '../../../../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../../../../komponenter/Skillelinje';
import DateInputMedLeservisning from '../../../../../../komponenter/Skjema/DateInputMedLeservisning';
import { FeilmeldingMaksBredde } from '../../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { formaterIsoPeriode } from '../../../../../../utils/dato';
import { harTallverdi, tilHeltall } from '../../../../../../utils/tall';
import { Toggle } from '../../../../../../utils/toggles';
import { fjernSpaces } from '../../../../../../utils/utils';
import {
    Aktivitet,
    AktivitetTypeTilTekst,
} from '../../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import {
    FaktaDagligReise,
    FaktaDelperiodePrivatBil,
    FaktaPrivatBil,
} from '../../typer/faktaDagligReise';
import { LeggTilNyPeriodeKnapp } from '../LeggTilNyPeriodeKnapp';
import { defaultPrivatBilPeriode, tomtPrivatBil } from '../utils';
import { FeilmeldingerFaktaPrivatBil } from '../validering';

interface Props {
    fakta: FaktaPrivatBil;
    feilmeldinger: FeilmeldingerFaktaPrivatBil | undefined;
    settFakta: React.Dispatch<React.SetStateAction<FaktaDagligReise>>;
    nullstillFeilOgUlagretkomponent: () => void;
    oppfylteAktiviteter: Aktivitet[];
}

export const EndreFaktaPrivatBil: React.FC<Props> = ({
    fakta,
    settFakta,
    feilmeldinger,
    nullstillFeilOgUlagretkomponent,
    oppfylteAktiviteter,
}) => {
    const kanBehandlePrivatBil = useFlag(Toggle.KAN_BEHANDLE_PRIVAT_BIL);

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

    const oppdaterPeriode = (
        index: number,
        key: keyof FaktaDelperiodePrivatBil,
        verdi: number | string | undefined
    ) => {
        settFakta((prevState) => {
            const privatBilState = prevState as FaktaPrivatBil;
            const nyePerioder = privatBilState.faktaDelperioder.map((p, i) =>
                i === index ? { ...p, [key]: verdi } : p
            );
            return { ...privatBilState, faktaDelperioder: nyePerioder };
        });
        nullstillFeilOgUlagretkomponent();
    };

    const leggTilPeriode = () => {
        settFakta((prevState) => {
            const privatBilState = prevState as FaktaPrivatBil;
            const nyPeriode: FaktaDelperiodePrivatBil = { ...defaultPrivatBilPeriode };
            return {
                ...privatBilState,
                faktaDelperioder: [...privatBilState.faktaDelperioder, nyPeriode],
            };
        });
        nullstillFeilOgUlagretkomponent();
    };

    const slettPeriode = (index: number) => {
        settFakta((prevState) => {
            const privatBilState = prevState as FaktaPrivatBil;
            const nyePerioder =
                privatBilState.faktaDelperioder.length > 1
                    ? privatBilState.faktaDelperioder.filter((_, i) => i !== index)
                    : privatBilState.faktaDelperioder;
            return { ...privatBilState, faktaDelperioder: nyePerioder };
        });
        nullstillFeilOgUlagretkomponent();
    };

    const oppdaterFelles = (key: keyof FaktaPrivatBil, verdi: number | string | undefined) => {
        settFakta((prevState) => {
            if (prevState.type !== 'PRIVAT_BIL') return { ...tomtPrivatBil };
            return { ...prevState, [key]: verdi };
        });
        nullstillFeilOgUlagretkomponent();
    };

    const oppdaterAktivitet = (aktivitetId: string) => {
        const valgtAktivitet = oppfylteAktiviteter.find((a) => a.id === aktivitetId);
        settFakta((prevState) => {
            if (prevState.type !== 'PRIVAT_BIL') return { ...tomtPrivatBil };
            return {
                ...prevState,
                aktivitetId: aktivitetId || undefined,
                aktivitetType: valgtAktivitet?.type,
            };
        });
        nullstillFeilOgUlagretkomponent();
    };

    return (
        <VStack>
            <Heading size="xsmall" level="4" style={{ marginBottom: '1rem' }}>
                Daglig reise med privat bil
            </Heading>
            {fakta.faktaDelperioder &&
                fakta.faktaDelperioder.length > 0 &&
                fakta.faktaDelperioder.map((periode, index) => {
                    return (
                        <HStack gap={'space-16'} key={index}>
                            <FeilmeldingMaksBredde>
                                <DateInputMedLeservisning
                                    label={index === 0 ? 'Fra' : ''}
                                    value={periode.fom}
                                    feil={feilmeldinger?.[index]?.fom}
                                    onChange={(dato) => {
                                        oppdaterPeriode(index, 'fom', dato);
                                    }}
                                    size="small"
                                />
                            </FeilmeldingMaksBredde>
                            <FeilmeldingMaksBredde>
                                <DateInputMedLeservisning
                                    label={index === 0 ? 'Til' : ''}
                                    value={periode?.tom}
                                    feil={feilmeldinger?.[index]?.tom}
                                    onChange={(dato) => {
                                        oppdaterPeriode(index, 'tom', dato);
                                    }}
                                    size="small"
                                />
                            </FeilmeldingMaksBredde>
                            <FeilmeldingMaksBredde $maxWidth={170}>
                                <TextField
                                    label={index === 0 ? 'Reisedager pr uke' : ''}
                                    size="small"
                                    error={feilmeldinger?.[index]?.reisedagerPerUke}
                                    value={
                                        harTallverdi(periode.reisedagerPerUke)
                                            ? periode.reisedagerPerUke
                                            : ''
                                    }
                                    onChange={(e) => {
                                        oppdaterPeriode(
                                            index,
                                            'reisedagerPerUke',
                                            tilHeltall(fjernSpaces(e.target.value))
                                        );
                                    }}
                                />
                            </FeilmeldingMaksBredde>
                            <FeilmeldingMaksBredde $maxWidth={170}>
                                <TextField
                                    label={index === 0 ? 'Bompenger per dag' : ''}
                                    size="small"
                                    error={feilmeldinger?.[index]?.bompengerPerDag}
                                    value={
                                        harTallverdi(periode.bompengerPerDag)
                                            ? periode.bompengerPerDag
                                            : ''
                                    }
                                    onChange={(e) => {
                                        oppdaterPeriode(
                                            index,
                                            'bompengerPerDag',
                                            tilHeltall(fjernSpaces(e.target.value))
                                        );
                                    }}
                                />
                            </FeilmeldingMaksBredde>
                            <FeilmeldingMaksBredde $maxWidth={170}>
                                <TextField
                                    label={index === 0 ? 'Fergekostnad per dag' : ''}
                                    size="small"
                                    error={feilmeldinger?.[index]?.fergePerDag}
                                    value={
                                        harTallverdi(periode.fergekostnadPerDag)
                                            ? periode.fergekostnadPerDag
                                            : ''
                                    }
                                    onChange={(e) => {
                                        oppdaterPeriode(
                                            index,
                                            'fergekostnadPerDag',
                                            tilHeltall(fjernSpaces(e.target.value))
                                        );
                                    }}
                                />
                            </FeilmeldingMaksBredde>
                            <HStack
                                align={'start'}
                                style={{
                                    marginTop: `${index === 0 ? '28px' : '8px'}`,
                                    maxWidth: `${feilmeldinger && '170px'}`,
                                }}
                            >
                                {fakta.faktaDelperioder.length > 1 && (
                                    <SmallButton
                                        variant={'tertiary'}
                                        iconPosition={'left'}
                                        icon={<TrashIcon title="Slett periode" />}
                                        onClick={() => slettPeriode(index)}
                                    />
                                )}
                            </HStack>
                        </HStack>
                    );
                })}
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
            <HStack gap="space-16">
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        label={'Reiseavstand en vei (km)'}
                        size="small"
                        error={feilmeldinger?.[0]?.reiseavstandEnVei}
                        value={harTallverdi(fakta.reiseavstandEnVei) ? fakta.reiseavstandEnVei : ''}
                        onChange={(e) => {
                            oppdaterFelles(
                                'reiseavstandEnVei',
                                tilHeltall(fjernSpaces(e.target.value))
                            );
                        }}
                    />
                </FeilmeldingMaksBredde>
                <FeilmeldingMaksBredde $maxWidth={300}>
                    <Select
                        label={'Aktivitet'}
                        size="small"
                        error={feilmeldinger?.[0]?.aktivitet}
                        value={fakta.aktivitetId || ''}
                        onChange={(e) => {
                            oppdaterAktivitet(e.target.value);
                        }}
                    >
                        <option value="">Velg aktivitet</option>
                        {oppfylteAktiviteter.map((aktivitet) => (
                            <option key={aktivitet.id} value={aktivitet.id}>
                                {AktivitetTypeTilTekst[aktivitet.type]} (
                                {formaterIsoPeriode(aktivitet.fom, aktivitet.tom)})
                            </option>
                        ))}
                    </Select>
                </FeilmeldingMaksBredde>
            </HStack>
        </VStack>
    );
};
