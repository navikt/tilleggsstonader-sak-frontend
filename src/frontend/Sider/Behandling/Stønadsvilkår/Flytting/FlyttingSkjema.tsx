import React, { useState } from 'react';

import { HGrid, HStack, LocalAlert, TextField, VStack } from '@navikt/ds-react';

import {
    FaktaFlytting,
    flyttingFaktaFeltTilTekst,
    TypeVilkårFaktaFlytting,
} from './typer/faktaFlytting';
import { RegelIdFlytting } from './typer/regelstrukturFlytting';
import {
    LagreVilkårFlytting,
    SvarOgBegrunnelseFlytting,
    VilkårFlytting,
} from './typer/vilkårFlytting';
import { tilVilkårBase } from './utils';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useVilkårFlytting } from '../../../../context/VilkårFlyttingContext';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { ResultatOgStatusKort } from '../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Skillelinje } from '../../../../komponenter/Skillelinje';
import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { SvarId } from '../../../../typer/regel';
import { feilmeldingVedFeil, Ressurs, RessursStatus } from '../../../../typer/ressurs';
import { PeriodeStatus, SvarJaNei } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import SlettVilkårModal from '../../Vilkårvurdering/EndreVilkår/SlettVilkårModal';
import { FellesDelvilkår } from '../../Vilkårvurdering/FellesDelvilkår';
import { JaNeiVurdering } from '../../Vilkårvurdering/JaNeiVurdering';
import { initierAktiveDelvilkår } from '../../Vilkårvurdering/regeltre';
import { regelIdTilSpørsmål } from '../../Vilkårvurdering/tekster';

interface FaktaSkjema {
    type: TypeVilkårFaktaFlytting;
    adresse: string;
    tilbud1: { navn: string; pris: string };
    tilbud2: { navn: string; pris: string };
    erBetalingDokumentert: boolean | undefined;
    avstandEnVei: string;
    henger: string;
    bompenger: string;
    ferge: string;
    parkering: string;
}

interface Props {
    vilkår?: VilkårFlytting;
    avbryt: () => void;
    lagre: (payload: LagreVilkårFlytting) => Promise<Ressurs<VilkårFlytting>>;
}

const tommeFakta: FaktaSkjema = {
    type: 'FLYTTING_UBESTEMT',
    adresse: '',
    tilbud1: { navn: '', pris: '' },
    tilbud2: { navn: '', pris: '' },
    erBetalingDokumentert: undefined,
    avstandEnVei: '',
    henger: '',
    bompenger: '',
    ferge: '',
    parkering: '',
};

function tilFaktaSkjema(fakta?: FaktaFlytting): FaktaSkjema {
    const skjema = {
        ...tommeFakta,
        type: fakta?.type ?? tommeFakta.type,
        adresse: fakta?.adresse ?? '',
    };
    if (fakta?.type === 'FLYTTING_FLYTTEBYRÅ') {
        return {
            ...skjema,
            tilbud1: { navn: fakta.tilbud1.navn ?? '', pris: fakta.tilbud1.pris?.toString() ?? '' },
            tilbud2: { navn: fakta.tilbud2.navn ?? '', pris: fakta.tilbud2.pris?.toString() ?? '' },
            erBetalingDokumentert: fakta.erBetalingDokumentert,
        };
    }
    if (fakta?.type === 'FLYTTING_FLYTTE_SELV') {
        return {
            ...skjema,
            avstandEnVei: fakta.avstandEnVei?.toString() ?? '',
            henger: fakta.henger?.toString() ?? '',
            bompenger: fakta.bompenger?.toString() ?? '',
            ferge: fakta.ferge?.toString() ?? '',
            parkering: fakta.parkering?.toString() ?? '',
        };
    }
    return skjema;
}

function initierSvar(
    vilkår?: VilkårFlytting
): Partial<Record<RegelIdFlytting, SvarOgBegrunnelseFlytting>> {
    const vurderinger = vilkår?.delvilkårsett.flatMap((del) => del.vurderinger) ?? [];
    const lagretNyttSvar = vurderinger.find(
        (vurdering) => vurdering.regelId === RegelIdFlytting.HVORDAN_SKAL_BRUKER_FLYTTE
    );

    if (lagretNyttSvar?.svar) {
        return {
            [RegelIdFlytting.HVORDAN_SKAL_BRUKER_FLYTTE]: {
                svar: lagretNyttSvar.svar,
                begrunnelse: lagretNyttSvar.begrunnelse,
            },
        };
    }

    const tidligereFlyttebyrå = vurderinger.find(
        (vurdering) => vurdering.regelId === 'SKAL_BRUKE_FLYTTEBYRÅ'
    )?.svar;
    const tidligereEgenKjøring = vurderinger.find(
        (vurdering) => vurdering.regelId === 'SKAL_FLYTTE_SELV'
    )?.svar;
    const svar =
        tidligereFlyttebyrå === 'JA'
            ? 'FLYTTEBYRÅ'
            : tidligereFlyttebyrå === 'NEI' && tidligereEgenKjøring === 'JA'
              ? 'FLYTTER_SELV'
              : undefined;

    if (!svar) return {};

    return {
        [RegelIdFlytting.HVORDAN_SKAL_BRUKER_FLYTTE]: {
            svar,
            begrunnelse:
                tidligereFlyttebyrå === 'JA'
                    ? vurderinger.find((v) => v.regelId === 'SKAL_BRUKE_FLYTTEBYRÅ')?.begrunnelse
                    : vurderinger.find((v) => v.regelId === 'SKAL_FLYTTE_SELV')?.begrunnelse,
        },
    };
}

export const FlyttingSkjema: React.FC<Props> = ({ vilkår, avbryt, lagre }) => {
    const { behandling } = useBehandling();
    const { slettVilkår, regelstruktur } = useVilkårFlytting();

    const [fom, settFom] = useState(vilkår?.fom ?? '');
    const [tom, settTom] = useState(vilkår?.tom ?? '');
    const [svar, settSvar] = useState(() => initierSvar(vilkår));
    const [fakta, settFakta] = useState(() => tilFaktaSkjema(vilkår?.fakta));
    const [feil, settFeil] = useState<string>();
    const [laster, settLaster] = useState(false);

    const oppdaterSvar = (regelId: RegelIdFlytting, verdi: string) => {
        const valgtSvar: SvarId = verdi;
        const regel = regelstruktur[regelId];
        const svaralternativ = regel.svaralternativer.find(
            (alternativ) => alternativ.svarId === valgtSvar
        );
        settSvar((forrige) => {
            const neste: Partial<Record<RegelIdFlytting, SvarOgBegrunnelseFlytting>> = {
                ...forrige,
                [regelId]: { ...forrige[regelId], svar: valgtSvar },
            };
            regel.reglerSomMåNullstilles.forEach((regelSomNullstilles) => {
                neste[regelSomNullstilles] = undefined;
            });
            return neste;
        });
        if (
            svaralternativ?.tilhørendeFaktaType &&
            svaralternativ.tilhørendeFaktaType !== fakta.type
        ) {
            settFakta({
                ...tommeFakta,
                type: svaralternativ.tilhørendeFaktaType,
                adresse: fakta.adresse,
            });
        }
    };

    const oppdaterBegrunnelse = (regelId: RegelIdFlytting, begrunnelse: string) => {
        settSvar((forrige) => ({
            ...forrige,
            [regelId]: { svar: forrige[regelId]?.svar ?? '', begrunnelse },
        }));
    };

    function skjemaTilFaktaPayload(skjema: FaktaSkjema): FaktaFlytting | undefined {
        const adresse = skjema.adresse.trim() || null;
        const tallEllerNull = (verdi: string) => (verdi.trim() ? Number(verdi) : null);
        if (skjema.type === 'FLYTTING_FLYTTEBYRÅ') {
            if (skjema.erBetalingDokumentert === undefined) {
                settFeil('Du må si om betaling er dokumentert eller ikke');
                return;
            }
            return {
                type: skjema.type,
                adresse,
                tilbud1: {
                    navn: skjema.tilbud1.navn.trim() || null,
                    pris: tallEllerNull(skjema.tilbud1.pris),
                },
                tilbud2: {
                    navn: skjema.tilbud2.navn.trim() || null,
                    pris: tallEllerNull(skjema.tilbud2.pris),
                },
                erBetalingDokumentert: skjema.erBetalingDokumentert,
            };
        }
        if (skjema.type === 'FLYTTING_FLYTTE_SELV') {
            return {
                type: skjema.type,
                adresse,
                avstandEnVei: tallEllerNull(skjema.avstandEnVei),
                henger: tallEllerNull(skjema.henger),
                bompenger: tallEllerNull(skjema.bompenger),
                ferge: tallEllerNull(skjema.ferge),
                parkering: tallEllerNull(skjema.parkering),
            };
        }
        return { type: skjema.type, adresse };
    }

    const lagreSkjema = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        settFeil(undefined);
        if (!fom || !tom) {
            settFeil('Fyll ut fra- og til-dato før du lagrer.');
            return;
        }
        if (fom > tom) {
            settFeil('Fra-dato må være før eller lik til-dato.');
            return;
        }

        const faktaPayload = skjemaTilFaktaPayload(fakta);
        if (!faktaPayload) {
            return;
        }

        settLaster(true);
        const respons = await lagre({ fom, tom, svar, fakta: faktaPayload });
        if (respons.status === RessursStatus.SUKSESS) {
            avbryt();
        } else {
            settFeil(feilmeldingVedFeil(respons) ?? 'Kunne ikke lagre flyttevilkåret. Prøv igjen.');
        }
        settLaster(false);
    };

    const aktive = initierAktiveDelvilkår(svar, regelstruktur);

    return (
        <form onSubmit={lagreSkjema}>
            <ResultatOgStatusKort
                periode={vilkår ? tilVilkårBase(vilkår, behandling.id) : undefined}
                redigeres
            >
                <HStack gap="space-16" align="start">
                    <FeilmeldingMaksBredde $maxWidth={152}>
                        <DateInputMedLeservisning
                            label="Fra"
                            value={fom}
                            onChange={(dato) => {
                                settFom(dato ?? '');
                            }}
                            size="small"
                        />
                    </FeilmeldingMaksBredde>
                    <FeilmeldingMaksBredde $maxWidth={152}>
                        <DateInputMedLeservisning
                            label="Til"
                            value={tom}
                            onChange={(dato) => {
                                settTom(dato ?? '');
                            }}
                            size="small"
                        />
                    </FeilmeldingMaksBredde>
                    <FeilmeldingMaksBredde $maxWidth={380}>
                        <TextField
                            label="Adresse brukeren skal flytte til"
                            value={fakta.adresse}
                            onChange={(event) => {
                                settFakta((forrige) => ({
                                    ...forrige,
                                    adresse: event.target.value,
                                }));
                            }}
                            size="small"
                        />
                    </FeilmeldingMaksBredde>
                </HStack>

                <Skillelinje />
                {aktive.map((regelId) => {
                    const regel = regelstruktur[regelId];
                    const vurdering = svar[regelId];
                    return (
                        <React.Fragment key={regelId}>
                            <FellesDelvilkår
                                regelId={regelId}
                                label={regelIdTilSpørsmål[regelId] || regelId}
                                svaralternativer={regel.svaralternativer}
                                svar={vurdering?.svar}
                                begrunnelse={vurdering?.begrunnelse}
                                oppdaterSvar={(nyttSvar) => oppdaterSvar(regelId, nyttSvar)}
                                oppdaterBegrunnelse={(begrunnelse) =>
                                    oppdaterBegrunnelse(regelId, begrunnelse)
                                }
                            />
                        </React.Fragment>
                    );
                })}
                <Faktafelter fakta={fakta} settFakta={settFakta} />
                {feil && (
                    <LocalAlert status="error">
                        <LocalAlert.Header>
                            <LocalAlert.Title>Kontroller opplysningene</LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>{feil}</LocalAlert.Content>
                    </LocalAlert>
                )}
                <Skillelinje />
                <HStack gap="space-8" justify={'space-between'}>
                    <HStack gap="space-8">
                        <SmallButton type="submit" loading={laster}>
                            Lagre
                        </SmallButton>
                        <SmallButton
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                avbryt();
                            }}
                        >
                            Avbryt
                        </SmallButton>
                    </HStack>
                    {vilkår && (
                        <SlettVilkårModal
                            vilkår={{
                                ...tilVilkårBase(vilkår, behandling.id),
                                slettetKommentar: vilkår.slettetKommentar ?? undefined,
                            }}
                            avsluttRedigering={avbryt}
                            kanSlettesPermanent={vilkår.status === PeriodeStatus.NY}
                            slettVilkår={async (kommentar) =>
                                (await slettVilkår(vilkår.id, kommentar)).status
                            }
                            metadataLabel="Type flytting"
                            metadata="Flytting"
                        />
                    )}
                </HStack>
            </ResultatOgStatusKort>
        </form>
    );
};

const Faktafelter: React.FC<{
    fakta: FaktaSkjema;
    settFakta: React.Dispatch<React.SetStateAction<FaktaSkjema>>;
}> = ({ fakta, settFakta }) => {
    if (fakta.type === 'FLYTTING_FLYTTEBYRÅ') {
        return <EndreFaktaFlyttebyrå settFakta={settFakta} fakta={fakta} />;
    }

    if (fakta.type === 'FLYTTING_FLYTTE_SELV') {
        return <EndreFaktaFlytteSelv settFakta={settFakta} fakta={fakta} />;
    }
};

const EndreFaktaFlyttebyrå: React.FC<{
    settFakta: React.Dispatch<React.SetStateAction<FaktaSkjema>>;
    fakta: FaktaSkjema;
}> = ({ settFakta, fakta }) => {
    const svarErBetalingDokumentert = () => {
        if (fakta.erBetalingDokumentert === true) {
            return SvarJaNei.JA;
        }
        if (fakta.erBetalingDokumentert === false) {
            return SvarJaNei.NEI;
        }
        return undefined;
    };
    return (
        <VStack gap="space-12">
            <Skillelinje />
            {[1, 2].map((nummer) => {
                const nøkkel = nummer === 1 ? 'tilbud1' : 'tilbud2';
                const tilbud = fakta[nøkkel];
                return (
                    <HGrid key={nøkkel} gap="space-16" columns={{ xs: 1, sm: 2 }}>
                        <TextField
                            label={`Navn på flyttebyrå ${nummer}`}
                            value={tilbud.navn}
                            onChange={(event) => {
                                settFakta((forrige) => ({
                                    ...forrige,
                                    [nøkkel]: {
                                        ...forrige[nøkkel],
                                        navn: event.target.value,
                                    },
                                }));
                            }}
                            size="small"
                        />
                        <TextField
                            label={`Pris på tilbud ${nummer} i kroner`}
                            value={tilbud.pris}
                            inputMode="numeric"
                            onChange={(event) => {
                                settFakta((forrige) => ({
                                    ...forrige,
                                    [nøkkel]: {
                                        ...forrige[nøkkel],
                                        pris: event.target.value,
                                    },
                                }));
                            }}
                            size="small"
                        />
                    </HGrid>
                );
            })}
            <JaNeiVurdering
                label="Er betalingen for flyttebyrå dokumentert?"
                svar={svarErBetalingDokumentert()}
                oppdaterSvar={(svar) => {
                    settFakta((forrige) => ({
                        ...forrige,
                        erBetalingDokumentert: svar === SvarJaNei.JA,
                    }));
                }}
            />
        </VStack>
    );
};

const EndreFaktaFlytteSelv: React.FC<{
    settFakta: React.Dispatch<React.SetStateAction<FaktaSkjema>>;
    fakta: FaktaSkjema;
}> = ({ settFakta, fakta }) => {
    return (
        <HStack gap="space-16">
            <FeilmeldingMaksBredde $maxWidth={180}>
                <TextField
                    label="Avstand én vei i kilometer"
                    value={fakta.avstandEnVei}
                    inputMode="numeric"
                    onChange={(event) => {
                        settFakta((forrige) => ({
                            ...forrige,
                            avstandEnVei: event.target.value,
                        }));
                    }}
                    size="small"
                />
            </FeilmeldingMaksBredde>
            {(['henger', 'bompenger', 'ferge', 'parkering'] as const).map((felt) => (
                <FeilmeldingMaksBredde $maxWidth={180} key={felt}>
                    <TextField
                        label={`${flyttingFaktaFeltTilTekst[felt]}`}
                        value={fakta[felt]}
                        inputMode="numeric"
                        onChange={(event) => {
                            settFakta((forrige) => ({ ...forrige, [felt]: event.target.value }));
                        }}
                        size="small"
                    />
                </FeilmeldingMaksBredde>
            ))}
        </HStack>
    );
};
