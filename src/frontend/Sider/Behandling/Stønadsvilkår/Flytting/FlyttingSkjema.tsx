import React, { useState } from 'react';

import { HGrid, HStack, LocalAlert, Radio, RadioGroup, TextField, VStack } from '@navikt/ds-react';

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
import { BegrunnelseRegel, SvarId } from '../../../../typer/regel';
import { feilmeldingVedFeil, Ressurs, RessursStatus } from '../../../../typer/ressurs';
import { PeriodeStatus } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import SlettVilkårModal from '../../Vilkårvurdering/EndreVilkår/SlettVilkårModal';
import { regelIdTilSpørsmål, svarIdTilTekst } from '../../Vilkårvurdering/tekster';

interface FaktaSkjema {
    type: TypeVilkårFaktaFlytting;
    adresse: string;
    tilbud1: { navn: string; pris: string };
    tilbud2: { navn: string; pris: string };
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
        };
    }
    if (fakta?.type === 'FLYTTING_KJØRE_SELV') {
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
        (vurdering) => vurdering.regelId === 'SKAL_KJØRE_SELV'
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
                    : vurderinger.find((v) => v.regelId === 'SKAL_KJØRE_SELV')?.begrunnelse,
        },
    };
}

function aktiveRegler(
    svar: Partial<Record<RegelIdFlytting, SvarOgBegrunnelseFlytting>>,
    regelstruktur: ReturnType<typeof useVilkårFlytting>['regelstruktur']
): RegelIdFlytting[] {
    const aktive = Object.entries(regelstruktur)
        .filter(([, regel]) => regel.erHovedregel)
        .map(([regelId]) => regelId as RegelIdFlytting);
    const sett = new Set<RegelIdFlytting>();

    while (aktive.length > 0) {
        const regelId = aktive.shift();
        if (!regelId || sett.has(regelId)) continue;
        sett.add(regelId);

        const valgtSvar = svar[regelId]?.svar;
        const svaralternativ = regelstruktur[regelId].svaralternativer.find(
            (alternativ) => alternativ.svarId === valgtSvar
        );
        if (svaralternativ?.nesteRegelId) aktive.push(svaralternativ.nesteRegelId);
    }

    return [...sett];
}

function tilFaktaPayload(fakta: FaktaSkjema): FaktaFlytting {
    const adresse = fakta.adresse.trim() || null;
    const tallEllerNull = (verdi: string) => (verdi.trim() ? Number(verdi) : null);
    if (fakta.type === 'FLYTTING_FLYTTEBYRÅ') {
        return {
            type: fakta.type,
            adresse,
            tilbud1: {
                navn: fakta.tilbud1.navn.trim() || null,
                pris: tallEllerNull(fakta.tilbud1.pris),
            },
            tilbud2: {
                navn: fakta.tilbud2.navn.trim() || null,
                pris: tallEllerNull(fakta.tilbud2.pris),
            },
        };
    }
    if (fakta.type === 'FLYTTING_KJØRE_SELV') {
        return {
            type: fakta.type,
            adresse,
            avstandEnVei: tallEllerNull(fakta.avstandEnVei),
            henger: tallEllerNull(fakta.henger),
            bompenger: tallEllerNull(fakta.bompenger),
            ferge: tallEllerNull(fakta.ferge),
            parkering: tallEllerNull(fakta.parkering),
        };
    }
    return { type: fakta.type, adresse };
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

        settLaster(true);
        const respons = await lagre({ fom, tom, svar, fakta: tilFaktaPayload(fakta) });
        if (respons.status === RessursStatus.SUKSESS) {
            avbryt();
        } else {
            settFeil(feilmeldingVedFeil(respons) ?? 'Kunne ikke lagre flyttevilkåret. Prøv igjen.');
        }
        settLaster(false);
    };

    const aktive = aktiveRegler(svar, regelstruktur);

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
                    const valgtAlternativ = regel.svaralternativer.find(
                        (alternativ) => alternativ.svarId === vurdering?.svar
                    );
                    return (
                        <React.Fragment key={regelId}>
                            <RadioGroup
                                legend={regelIdTilSpørsmål[regelId] || regelId}
                                value={vurdering?.svar ?? ''}
                                onChange={(value) => oppdaterSvar(regelId, value)}
                                size="small"
                            >
                                {regel.svaralternativer.map((alternativ) => (
                                    <Radio key={alternativ.svarId} value={alternativ.svarId}>
                                        {svarIdTilTekst[alternativ.svarId] ?? alternativ.svarId}
                                    </Radio>
                                ))}
                            </RadioGroup>
                            {valgtAlternativ &&
                                valgtAlternativ.begrunnelseType !== BegrunnelseRegel.UTEN && (
                                    <TextField
                                        label="Begrunnelse"
                                        value={vurdering?.begrunnelse ?? ''}
                                        onChange={(event) =>
                                            oppdaterBegrunnelse(regelId, event.target.value)
                                        }
                                        size="small"
                                    />
                                    // TODO Funker ikke textare av enn eller annen grunn??
                                    // <Textarea
                                    //     label={lagBegrunnelsestekst(
                                    //         valgtAlternativ.begrunnelseType
                                    //     )}
                                    //     resize
                                    //     size="small"
                                    //     // error={feilmeldinger.begrunnelse?.[regelId]}
                                    //     minRows={3}
                                    //     value={vurdering?.begrunnelse || ''}
                                    //     onChange={(event) =>
                                    //         oppdaterBegrunnelse(regelId, event.target.value)
                                    //     }
                                    //     description={begrunnelseHjelpetekst}
                                    // />
                                )}
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

    if (fakta.type === 'FLYTTING_KJØRE_SELV') {
        return <EndreFaktaFlytteSelv settFakta={settFakta} fakta={fakta} />;
    }
};

const EndreFaktaFlyttebyrå: React.FC<{
    settFakta: React.Dispatch<React.SetStateAction<FaktaSkjema>>;
    fakta: FaktaSkjema;
}> = ({ settFakta, fakta }) => {
    return (
        <VStack gap="space-12">
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
        </VStack>
    );
};

const EndreFaktaFlytteSelv: React.FC<{
    settFakta: React.Dispatch<React.SetStateAction<FaktaSkjema>>;
    fakta: FaktaSkjema;
}> = ({ settFakta, fakta }) => {
    return (
        <VStack gap="space-12">
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
            {(['henger', 'bompenger', 'ferge', 'parkering'] as const).map((felt) => (
                <FeilmeldingMaksBredde $maxWidth={180} key={felt}>
                    <TextField
                        label={`${flyttingFaktaFeltTilTekst[felt]} i kroner`}
                        description="Oppgi samlet kostnad. La feltet stå tomt hvis det ikke finnes en kostnad."
                        value={fakta[felt]}
                        inputMode="numeric"
                        onChange={(event) => {
                            settFakta((forrige) => ({ ...forrige, [felt]: event.target.value }));
                        }}
                        size="small"
                    />
                </FeilmeldingMaksBredde>
            ))}
        </VStack>
    );
};
