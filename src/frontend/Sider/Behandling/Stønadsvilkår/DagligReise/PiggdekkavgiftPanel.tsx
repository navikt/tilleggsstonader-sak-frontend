import React, { useState } from 'react';

import { CurrencyExchangeIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { HStack, Radio, RadioGroup, Select, TextField, Textarea, VStack } from '@navikt/ds-react';

import { useVilkårDagligReise } from '../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { ResultatOgStatusKort } from '../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { formaterIsoPeriode, perioderOverlapper } from '../../../../utils/dato';
import { validerPeriode } from '../../../../utils/periode';
import { AktivitetTypeTilTekst } from '../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { VilkårPeriodeResultat } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

type SkalDekkesSvar = 'JA' | 'NEI' | undefined;

interface PiggdekkavgiftPeriode {
    id: number;
    fom: string;
    tom: string;
    skalDekkes: SkalDekkesSvar;
    beløp: string;
    harVærtInnOmBeløp: boolean;
    begrunnelse: string;
    harVærtInnOmBegrunnelse: boolean;
    aktivitetId: string;
    harVærtInnOmAktivitet: boolean;
}

function tomPiggdekkavgiftPeriode(id: number): PiggdekkavgiftPeriode {
    return {
        id,
        fom: '',
        tom: '',
        skalDekkes: undefined,
        beløp: '',
        harVærtInnOmBeløp: false,
        begrunnelse: '',
        harVærtInnOmBegrunnelse: false,
        aktivitetId: '',
        harVærtInnOmAktivitet: false,
    };
}

function erGyldigBeløp(verdi: string): boolean {
    if (!/^\d+$/.test(verdi)) {
        return false;
    }

    return Number(verdi) >= 0;
}

export const PiggdekkavgiftPanel: React.FC = () => {
    const { aktiviteter } = useVilkårDagligReise();
    const [perioder, settPerioder] = useState<PiggdekkavgiftPeriode[]>([]);

    const opprettNyPeriode = () => {
        settPerioder((prevState) => [...prevState, tomPiggdekkavgiftPeriode(prevState.length + 1)]);
    };

    const oppdaterPeriode = (periodeId: number, oppdatering: Partial<PiggdekkavgiftPeriode>) => {
        settPerioder((prevState) =>
            prevState.map((periode) =>
                periode.id === periodeId ? { ...periode, ...oppdatering } : periode
            )
        );
    };

    return (
        <VilkårPanel tittel={'Piggdekkavgift'} ikon={<CurrencyExchangeIcon />}>
            <VStack gap="space-16">
                {perioder.length > 0 &&
                    perioder.map((periode) => {
                        const periodeFeil = validerPeriode({
                            fom: periode.fom,
                            tom: periode.tom,
                        });
                        const skalVisePeriodefeil = periode.fom !== '' || periode.tom !== '';
                        const oppfylteAktiviteter = aktiviteter.filter(
                            (aktivitet) => aktivitet.resultat === VilkårPeriodeResultat.OPPFYLT
                        );
                        const oppfylteAktiviteterForPeriode =
                            periode.fom && periode.tom
                                ? oppfylteAktiviteter.filter((aktivitet) =>
                                      perioderOverlapper(aktivitet, periode)
                                  )
                                : oppfylteAktiviteter;
                        const harAktivitetFeil =
                            periode.harVærtInnOmAktivitet && !periode.aktivitetId;
                        const skalViseBeløpsfelt = periode.skalDekkes === 'JA';
                        const skalViseBegrunnelsesfelt = periode.skalDekkes === 'NEI';
                        const harBeløpsfeil =
                            skalViseBeløpsfelt &&
                            periode.harVærtInnOmBeløp &&
                            !erGyldigBeløp(periode.beløp);
                        const harBegrunnelseFeil =
                            skalViseBegrunnelsesfelt &&
                            periode.harVærtInnOmBegrunnelse &&
                            !periode.begrunnelse.trim();

                        return (
                            <ResultatOgStatusKort key={periode.id} periode={undefined} redigeres>
                                <VStack gap="space-16">
                                    <HStack gap="space-16" align="start">
                                        <DateInputMedLeservisning
                                            label={'Fra'}
                                            value={periode.fom}
                                            onChange={(dato) =>
                                                oppdaterPeriode(periode.id, { fom: dato || '' })
                                            }
                                            size="small"
                                            feil={
                                                skalVisePeriodefeil ? periodeFeil?.fom : undefined
                                            }
                                        />
                                        <DateInputMedLeservisning
                                            label={'Til'}
                                            value={periode.tom}
                                            onChange={(dato) =>
                                                oppdaterPeriode(periode.id, { tom: dato || '' })
                                            }
                                            size="small"
                                            feil={
                                                skalVisePeriodefeil ? periodeFeil?.tom : undefined
                                            }
                                        />
                                        <Select
                                            label={'Aktivitet/tiltak'}
                                            size="small"
                                            value={periode.aktivitetId}
                                            error={
                                                harAktivitetFeil
                                                    ? 'Du må velge aktivitet/tiltak.'
                                                    : undefined
                                            }
                                            onChange={(event) =>
                                                oppdaterPeriode(periode.id, {
                                                    aktivitetId: event.target.value,
                                                })
                                            }
                                            onBlur={() =>
                                                oppdaterPeriode(periode.id, {
                                                    harVærtInnOmAktivitet: true,
                                                })
                                            }
                                        >
                                            <option value="">Velg aktivitet</option>
                                            {oppfylteAktiviteterForPeriode.map((aktivitet) => (
                                                <option
                                                    key={aktivitet.globalId}
                                                    value={aktivitet.globalId}
                                                >
                                                    {AktivitetTypeTilTekst[aktivitet.type]} (
                                                    {formaterIsoPeriode(
                                                        aktivitet.fom,
                                                        aktivitet.tom
                                                    )}
                                                    )
                                                </option>
                                            ))}
                                        </Select>
                                    </HStack>

                                    <RadioGroup
                                        legend={`Skal bruker få dekt piggdekkavgift for perioden?`}
                                        value={periode.skalDekkes}
                                        size="small"
                                        onChange={(svar: string) => {
                                            const nyttSvar = svar as Exclude<
                                                SkalDekkesSvar,
                                                undefined
                                            >;

                                            oppdaterPeriode(periode.id, {
                                                skalDekkes: nyttSvar,
                                                beløp: nyttSvar === 'NEI' ? '' : periode.beløp,
                                                harVærtInnOmBeløp:
                                                    nyttSvar === 'NEI'
                                                        ? false
                                                        : periode.harVærtInnOmBeløp,
                                                begrunnelse:
                                                    nyttSvar === 'JA' ? '' : periode.begrunnelse,
                                                harVærtInnOmBegrunnelse:
                                                    nyttSvar === 'JA'
                                                        ? false
                                                        : periode.harVærtInnOmBegrunnelse,
                                            });
                                        }}
                                    >
                                        <Radio value={'JA'}>Ja</Radio>
                                        <Radio value={'NEI'}>Nei</Radio>
                                    </RadioGroup>

                                    {skalViseBeløpsfelt && (
                                        <TextField
                                            label={'Beløp som skal utbetales (kr)'}
                                            size="small"
                                            value={periode.beløp}
                                            onChange={(event) =>
                                                oppdaterPeriode(periode.id, {
                                                    beløp: event.target.value,
                                                })
                                            }
                                            onBlur={() =>
                                                oppdaterPeriode(periode.id, {
                                                    harVærtInnOmBeløp: true,
                                                })
                                            }
                                            inputMode="numeric"
                                            error={
                                                harBeløpsfeil
                                                    ? 'Må oppgi beløp i hele kroner.'
                                                    : undefined
                                            }
                                        />
                                    )}

                                    {skalViseBegrunnelsesfelt && (
                                        <Textarea
                                            label={'Begrunnelse'}
                                            size="small"
                                            minRows={3}
                                            value={periode.begrunnelse}
                                            onChange={(event) =>
                                                oppdaterPeriode(periode.id, {
                                                    begrunnelse: event.target.value,
                                                })
                                            }
                                            onBlur={() =>
                                                oppdaterPeriode(periode.id, {
                                                    harVærtInnOmBegrunnelse: true,
                                                })
                                            }
                                            error={
                                                harBegrunnelseFeil
                                                    ? 'Må oppgi begrunnelse når piggdekkavgift ikke dekkes.'
                                                    : undefined
                                            }
                                        />
                                    )}
                                </VStack>
                            </ResultatOgStatusKort>
                        );
                    })}

                <SmallButton
                    type="button"
                    onClick={opprettNyPeriode}
                    variant="secondary"
                    icon={<PlusCircleIcon />}
                >
                    Legg til piggdekkavgift
                </SmallButton>
            </VStack>
        </VilkårPanel>
    );
};
