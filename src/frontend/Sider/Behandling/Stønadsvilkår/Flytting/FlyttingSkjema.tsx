import React, { useState } from 'react';

import { HGrid, HStack, LocalAlert, TextField, VStack } from '@navikt/ds-react';

import {
    FaktaFlytting,
    flyttingFaktaFeltTilTekst,
    TypeVilkårFaktaFlytting,
} from './typer/faktaFlytting';
import {
    begrunnelseHjelpeteksterForFlytteforbindelse,
    begrunnelseHjelpeteksterForFlytterIfbmArbeid,
    begrunnelseHjelpeteksterForMåFlytteForStarteArbeid,
    delvilkårHjelpetekster,
    RegelIdFlytting,
} from './typer/regelstrukturFlytting';
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
import { NødvendigUtgift } from '../../../../typer/nødvendigUtgift';
import { SvarId } from '../../../../typer/regel';
import { feilmeldingVedFeil, Ressurs, RessursStatus } from '../../../../typer/ressurs';
import { Målgruppe, MålgruppeType } from '../../Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { PeriodeStatus, SvarJaNei } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import SlettVilkårModal from '../../Vilkårvurdering/EndreVilkår/SlettVilkårModal';
import { FellesDelvilkår } from '../../Vilkårvurdering/FellesDelvilkår';
import { JaNeiVurdering } from '../../Vilkårvurdering/JaNeiVurdering';
import { initierAktiveDelvilkår } from '../../Vilkårvurdering/regeltre';
import { regelIdTilSpørsmål } from '../../Vilkårvurdering/tekster';
import { NødvendigUtgiftFelt } from '../Felles/EndreFakta/NødvendigUtgiftFelt';

interface FaktaSkjema {
    type: TypeVilkårFaktaFlytting;
    adresse: string;
    tilbud: { navn: string; pris: string }[];
    erBetalingDokumentert: boolean | undefined;
    nødvendigUtgift: NødvendigUtgift | undefined;
    avstandEnVei: string;
    henger: string;
    bompenger: string;
    ferge: string;
    parkering: string;
}

interface Props {
    vilkår?: VilkårFlytting;
    målgrupper: Målgruppe[];
    avbryt: () => void;
    lagre: (payload: LagreVilkårFlytting) => Promise<Ressurs<VilkårFlytting>>;
}

const tommeFakta: FaktaSkjema = {
    type: 'FLYTTING_UBESTEMT',
    adresse: '',
    tilbud: [
        { navn: '', pris: '' },
        { navn: '', pris: '' },
    ],
    erBetalingDokumentert: undefined,
    nødvendigUtgift: undefined,
    avstandEnVei: '',
    henger: '',
    bompenger: '',
    ferge: '',
    parkering: '',
};

function hentBegrunnelseHjelpetekst(
    regelId: RegelIdFlytting,
    svar: SvarId | undefined
): string | undefined {
    if (regelId == RegelIdFlytting.HVILKEN_FORBINDELSE_FLYTTER_BRUKER && svar) {
        return begrunnelseHjelpeteksterForFlytteforbindelse[svar];
    }
    if (regelId == RegelIdFlytting.FLYTTER_IFBM_ARBEID_ETTER_AKTIVITET && svar) {
        return begrunnelseHjelpeteksterForFlytterIfbmArbeid[svar];
    }
    if (regelId == RegelIdFlytting.MÅ_FLYTTE_FOR_Å_STARTE_I_ARBEID && svar) {
        return begrunnelseHjelpeteksterForMåFlytteForStarteArbeid[svar];
    }

    return undefined;
}

function tilFaktaSkjema(fakta?: FaktaFlytting): FaktaSkjema {
    const skjema = {
        ...tommeFakta,
        type: fakta?.type ?? tommeFakta.type,
        adresse: fakta?.adresse ?? '',
    };
    if (fakta?.type === 'FLYTTING_FLYTTEBYRÅ') {
        return {
            ...skjema,
            tilbud: fakta.tilbud.map((tilbud) => ({
                navn: tilbud.navn ?? '',
                pris: tilbud.pris?.toString() ?? '',
            })),
            erBetalingDokumentert: fakta.erBetalingDokumentert,
            nødvendigUtgift: fakta.nødvendigUtgift,
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
            nødvendigUtgift: fakta.nødvendigUtgift,
        };
    }
    return skjema;
}

function initierSvar(
    vilkår?: VilkårFlytting
): Partial<Record<RegelIdFlytting, SvarOgBegrunnelseFlytting>> {
    const vurderinger = vilkår?.delvilkårsett.flatMap((del) => del.vurderinger) ?? [];

    const lagredeSvar: Partial<Record<RegelIdFlytting, SvarOgBegrunnelseFlytting>> = {};
    Object.values(RegelIdFlytting).forEach((regelId) => {
        const vurdering = vurderinger.find((v) => v.regelId === regelId);
        if (vurdering?.svar) {
            lagredeSvar[regelId] = { svar: vurdering.svar, begrunnelse: vurdering.begrunnelse };
        }
    });

    return lagredeSvar;
}

export const FlyttingSkjema: React.FC<Props> = ({ vilkår, målgrupper, avbryt, lagre }) => {
    const { behandling } = useBehandling();
    const { slettVilkår, regelstruktur } = useVilkårFlytting();

    const [flyttedato, settFlytteDato] = useState(vilkår?.flyttedato ?? '');
    const [svar, settSvar] = useState(() => initierSvar(vilkår));
    const [fakta, settFakta] = useState(() => tilFaktaSkjema(vilkår?.fakta));
    const [feil, settFeil] = useState<string>();
    const [feilNødvendigUtgift, settFeilNødvendigUtgift] = useState<string>();
    const [feilBegrunnelseNødvendigUtgift, settFeilBegrunnelseNødvendigUtgift] = useState<string>();
    const [laster, settLaster] = useState(false);

    const oppdaterSvar = (regelId: RegelIdFlytting, verdi: string) => {
        settFeilNødvendigUtgift(undefined);
        settFeilBegrunnelseNødvendigUtgift(undefined);
        const valgtSvar: SvarId = verdi;
        const regel = regelstruktur[regelId];
        const svaralternativ = regel.svaralternativer.find(
            (alternativ) => alternativ.svarId === valgtSvar
        );
        const tilhørendeFaktaType = svaralternativ?.tilhørendeFaktaType;
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
        const skalNullstilleFlyttefakta =
            tilhørendeFaktaType === 'FLYTTING_UBESTEMT' ||
            (regelId !== RegelIdFlytting.HVORDAN_SKAL_BRUKER_FLYTTE &&
                regel.reglerSomMåNullstilles.length > 0);
        if (tilhørendeFaktaType && tilhørendeFaktaType !== fakta.type) {
            settFakta({
                ...tommeFakta,
                type: tilhørendeFaktaType,
                adresse: fakta.adresse,
            });
        } else if (skalNullstilleFlyttefakta && fakta.type !== 'FLYTTING_UBESTEMT') {
            settFakta({ ...tommeFakta, adresse: fakta.adresse });
        }
    };

    const oppdaterBegrunnelse = (regelId: RegelIdFlytting, begrunnelse: string) => {
        settSvar((forrige) => ({
            ...forrige,
            [regelId]: { svar: forrige[regelId]?.svar ?? '', begrunnelse },
        }));
    };

    const oppdaterNødvendigUtgift = (nødvendigUtgift: NødvendigUtgift) => {
        settFakta((forrige) => ({ ...forrige, nødvendigUtgift }));
        settFeilNødvendigUtgift(undefined);
        settFeilBegrunnelseNødvendigUtgift(undefined);
    };

    function skjemaTilFaktaPayload(skjema: FaktaSkjema): FaktaFlytting | undefined {
        const adresse = skjema.adresse.trim() || null;
        const tallEllerNull = (verdi: string) => (verdi.trim() ? Number(verdi) : null);
        const nødvendigUtgift = skjema.nødvendigUtgift;
        if (skjema.type === 'FLYTTING_UBESTEMT') {
            return { type: skjema.type, adresse };
        }

        if (!nødvendigUtgift) {
            settFeilNødvendigUtgift('Du må velge om hele utgiften er nødvendig');
            return;
        }
        if (nødvendigUtgift.erUtgiftenNødvendig === 'NEI' && !nødvendigUtgift.begrunnelse?.trim()) {
            settFeilBegrunnelseNødvendigUtgift(
                'Du må begrunne hvorfor utgiften ikke vurderes som nødvendig'
            );
            return;
        }

        if (skjema.type === 'FLYTTING_FLYTTEBYRÅ') {
            if (skjema.erBetalingDokumentert === undefined) {
                settFeil('Du må si om betaling er dokumentert eller ikke');
                return;
            }
            return {
                type: skjema.type,
                adresse,
                tilbud: skjema.tilbud.map((tilbud) => ({
                    navn: tilbud.navn.trim() || null,
                    pris: tallEllerNull(tilbud.pris),
                })),
                erBetalingDokumentert: skjema.erBetalingDokumentert,
                nødvendigUtgift,
            };
        }
        return {
            type: skjema.type,
            adresse,
            avstandEnVei: tallEllerNull(skjema.avstandEnVei),
            henger: tallEllerNull(skjema.henger),
            bompenger: tallEllerNull(skjema.bompenger),
            ferge: tallEllerNull(skjema.ferge),
            parkering: tallEllerNull(skjema.parkering),
            nødvendigUtgift,
        };
    }

    const lagreSkjema = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        settFeil(undefined);
        if (!flyttedato) {
            settFeil('Fyll ut en gyldig flyttedato før du lagrer.');
            return;
        }

        const faktaPayload = skjemaTilFaktaPayload(fakta);
        if (!faktaPayload) {
            return;
        }

        settLaster(true);
        const respons = await lagre({ flyttedato, svar, fakta: faktaPayload });
        if (respons.status === RessursStatus.SUKSESS) {
            avbryt();
        } else {
            settFeil(feilmeldingVedFeil(respons) ?? 'Kunne ikke lagre flyttevilkåret. Prøv igjen.');
        }
        settLaster(false);
    };

    const aktive = initierAktiveDelvilkår(svar, regelstruktur);
    const manglerMålgruppeForEnsligForsørgerEllerGjenlevende =
        svar[RegelIdFlytting.HVILKEN_FORBINDELSE_FLYTTER_BRUKER]?.svar ===
            'ENSLIG_FORSØRGER_ELLER_GJENLEVENDE_STARTER_I_ARBEID' &&
        !målgrupper.some(
            (målgruppe) =>
                målgruppe.status !== PeriodeStatus.SLETTET &&
                [
                    MålgruppeType.OVERGANGSSTØNAD,
                    MålgruppeType.OMSTILLINGSSTØNAD,
                    MålgruppeType.OPPHØRT_OVERGANGSSTØNAD,
                    MålgruppeType.OPPHØRT_OMSTILLINGSSTØNAD,
                ].includes(målgruppe.type)
        );

    return (
        <form onSubmit={lagreSkjema}>
            <ResultatOgStatusKort
                periode={vilkår ? tilVilkårBase(vilkår, behandling.id) : undefined}
                redigeres
            >
                <HStack gap="space-16" align="start">
                    <FeilmeldingMaksBredde $maxWidth={152}>
                        <DateInputMedLeservisning
                            label="Flyttedato"
                            value={flyttedato}
                            onChange={(dato) => {
                                settFlytteDato(dato ?? '');
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
                {manglerMålgruppeForEnsligForsørgerEllerGjenlevende && (
                    <LocalAlert status="warning" size="small">
                        <LocalAlert.Header>
                            <LocalAlert.Title>Kontroller flytteforbindelsen</LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>
                            For å velge denne flytteforbindelsen må brukeren ha målgruppen
                            overgangsstønad, omstillingsstønad eller en opphørt variant av disse.
                        </LocalAlert.Content>
                    </LocalAlert>
                )}
                {aktive.map((regelId) => {
                    const regel = regelstruktur[regelId];
                    const vurdering = svar[regelId];
                    return (
                        <FellesDelvilkår
                            key={regelId}
                            regelId={regelId}
                            label={regelIdTilSpørsmål[regelId] || regelId}
                            svaralternativer={regel.svaralternativer}
                            svar={vurdering?.svar}
                            begrunnelse={vurdering?.begrunnelse}
                            begrunnelseHjelpetekst={hentBegrunnelseHjelpetekst(
                                regelId,
                                vurdering?.svar
                            )}
                            hjelpetekstKort={delvilkårHjelpetekster[regelId]}
                            oppdaterSvar={(nyttSvar) => oppdaterSvar(regelId, nyttSvar)}
                            oppdaterBegrunnelse={(begrunnelse) =>
                                oppdaterBegrunnelse(regelId, begrunnelse)
                            }
                        />
                    );
                })}
                <Faktafelter
                    fakta={fakta}
                    settFakta={settFakta}
                    feilNødvendigUtgift={feilNødvendigUtgift}
                    feilBegrunnelseNødvendigUtgift={feilBegrunnelseNødvendigUtgift}
                    oppdaterNødvendigUtgift={oppdaterNødvendigUtgift}
                />
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
    feilNødvendigUtgift: string | undefined;
    feilBegrunnelseNødvendigUtgift: string | undefined;
    oppdaterNødvendigUtgift: (nødvendigUtgift: NødvendigUtgift) => void;
}> = ({
    fakta,
    settFakta,
    feilNødvendigUtgift,
    feilBegrunnelseNødvendigUtgift,
    oppdaterNødvendigUtgift,
}) => {
    if (fakta.type === 'FLYTTING_FLYTTEBYRÅ') {
        return (
            <EndreFaktaFlyttebyrå
                settFakta={settFakta}
                fakta={fakta}
                feilNødvendigUtgift={feilNødvendigUtgift}
                feilBegrunnelseNødvendigUtgift={feilBegrunnelseNødvendigUtgift}
                oppdaterNødvendigUtgift={oppdaterNødvendigUtgift}
            />
        );
    }

    if (fakta.type === 'FLYTTING_FLYTTE_SELV') {
        return (
            <EndreFaktaFlytteSelv
                settFakta={settFakta}
                fakta={fakta}
                feilNødvendigUtgift={feilNødvendigUtgift}
                feilBegrunnelseNødvendigUtgift={feilBegrunnelseNødvendigUtgift}
                oppdaterNødvendigUtgift={oppdaterNødvendigUtgift}
            />
        );
    }
};

const EndreFaktaFlyttebyrå: React.FC<{
    settFakta: React.Dispatch<React.SetStateAction<FaktaSkjema>>;
    fakta: FaktaSkjema;
    feilNødvendigUtgift: string | undefined;
    feilBegrunnelseNødvendigUtgift: string | undefined;
    oppdaterNødvendigUtgift: (nødvendigUtgift: NødvendigUtgift) => void;
}> = ({
    settFakta,
    fakta,
    feilNødvendigUtgift,
    feilBegrunnelseNødvendigUtgift,
    oppdaterNødvendigUtgift,
}) => {
    const svarErBetalingDokumentert = () => {
        if (fakta.erBetalingDokumentert === true) {
            return SvarJaNei.JA;
        }
        if (fakta.erBetalingDokumentert === false) {
            return SvarJaNei.NEI;
        }
        return undefined;
    };
    const oppdaterTilbud = (indeks: number, felt: 'navn' | 'pris', verdi: string) => {
        settFakta((forrige) => ({
            ...forrige,
            tilbud: forrige.tilbud.map((tilbud, tilbudsindeks) =>
                tilbudsindeks === indeks ? { ...tilbud, [felt]: verdi } : tilbud
            ),
        }));
    };
    return (
        <VStack gap="space-12">
            <Skillelinje />
            <NødvendigUtgiftFelt
                nødvendigUtgift={fakta.nødvendigUtgift}
                feilNødvendigUtgift={feilNødvendigUtgift}
                feilBegrunnelse={feilBegrunnelseNødvendigUtgift}
                beskrivelse="Vurder om den oppgitte flytteutgiften er på et rimelig nivå."
                begrunnelseBeskrivelse="Begrunn hvorfor flytteutgiften ikke vurderes som nødvendig."
                oppdaterFakta={oppdaterNødvendigUtgift}
            />
            {fakta.tilbud.map((tilbud, indeks) => {
                return (
                    <HGrid key={`tilbud-${indeks}`} gap="space-16" columns={{ xs: 1, sm: 2 }}>
                        <TextField
                            label={`Navn på flyttebyrå ${indeks + 1}`}
                            value={tilbud.navn}
                            onChange={(event) => {
                                oppdaterTilbud(indeks, 'navn', event.target.value);
                            }}
                            size="small"
                        />
                        <TextField
                            label={`Pris på tilbud ${indeks + 1} i kroner`}
                            value={tilbud.pris}
                            inputMode="numeric"
                            onChange={(event) => {
                                oppdaterTilbud(indeks, 'pris', event.target.value);
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
    feilNødvendigUtgift: string | undefined;
    feilBegrunnelseNødvendigUtgift: string | undefined;
    oppdaterNødvendigUtgift: (nødvendigUtgift: NødvendigUtgift) => void;
}> = ({
    settFakta,
    fakta,
    feilNødvendigUtgift,
    feilBegrunnelseNødvendigUtgift,
    oppdaterNødvendigUtgift,
}) => {
    return (
        <VStack gap="space-16">
            <NødvendigUtgiftFelt
                nødvendigUtgift={fakta.nødvendigUtgift}
                feilNødvendigUtgift={feilNødvendigUtgift}
                feilBegrunnelse={feilBegrunnelseNødvendigUtgift}
                beskrivelse="Vurder om den oppgitte flytteutgiften er på et rimelig nivå."
                begrunnelseBeskrivelse="Begrunn hvorfor flytteutgiften ikke vurderes som nødvendig."
                oppdaterFakta={oppdaterNødvendigUtgift}
            />
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
                                settFakta((forrige) => ({
                                    ...forrige,
                                    [felt]: event.target.value,
                                }));
                            }}
                            size="small"
                        />
                    </FeilmeldingMaksBredde>
                ))}
            </HStack>
        </VStack>
    );
};
