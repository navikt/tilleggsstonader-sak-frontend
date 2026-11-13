import React, { useState } from 'react';

import { HGrid, HStack, LocalAlert, TextField, VStack } from '@navikt/ds-react';

import {
    DokumenterteUtgifter,
    ekstrakostnaderFlytting,
    FaktaFlytting,
    TypeVilkårFaktaFlytting,
} from './typer/faktaFlytting';
import {
    begrunnelseHjelpeteksterForFlytteforbindelse,
    begrunnelseHjelpeteksterForFlytterIfbmArbeid,
    begrunnelseHjelpeteksterForMåFlytteForGjennomføreAktivitet,
    begrunnelseHjelpeteksterForMåFlytteForStarteArbeid,
    delvilkårHjelpetekster,
    RegelIdFlytting,
} from './typer/regelstrukturFlytting';
import {
    LagreVilkårFlytting,
    SvarOgBegrunnelseFlytting,
    VilkårFlytting,
} from './typer/vilkårFlytting';
import { tilEkstrakostnad, tilVilkårBase } from './utils';
import { FeilmeldingerFlytting, validerFlytting } from './validering';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useVilkårFlytting } from '../../../../context/VilkårFlyttingContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import {
    Feil,
    feiletRessursTilFeilmelding,
    lagFeilmelding,
} from '../../../../komponenter/Feil/feilmeldingUtils';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { ResultatOgStatusKort } from '../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Skillelinje } from '../../../../komponenter/Skillelinje';
import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { erSvarJaNei, NødvendigUtgift } from '../../../../typer/nødvendigUtgift';
import { BegrunnelseRegel, SvarId } from '../../../../typer/regel';
import { erFeilressurs, Ressurs, RessursStatus } from '../../../../typer/ressurs';
import { Målgruppe, MålgruppeType } from '../../Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { PeriodeStatus, SvarJaNei } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import SlettVilkårModal from '../../Vilkårvurdering/EndreVilkår/SlettVilkårModal';
import { FellesDelvilkår } from '../../Vilkårvurdering/FellesDelvilkår';
import { initierAktiveDelvilkår } from '../../Vilkårvurdering/regeltre';
import { regelIdTilSpørsmål } from '../../Vilkårvurdering/tekster';
import { NødvendigUtgiftFelt } from '../Felles/EndreFakta/NødvendigUtgiftFelt';

interface FaktaSkjema {
    type: TypeVilkårFaktaFlytting;
    adresse: string;
    tilbud: { navn: string; pris: string }[];
    erUtgifterDokumentert: DokumenterteUtgifter['erUtgifterDokumentert'] | undefined;
    begrunnelseDokumenterteUtgifter: string;
    nødvendigUtgift: NødvendigUtgift | undefined;
    beløpSomKanDekkes: string;
    avstandEnVei: string;
    bompenger: string;
    ferge: string;
    parkering: string;
    henger: string;
    leiebil: string;
    annet: string;
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
    erUtgifterDokumentert: undefined,
    begrunnelseDokumenterteUtgifter: '',
    nødvendigUtgift: undefined,
    beløpSomKanDekkes: '',
    avstandEnVei: '',
    henger: '',
    leiebil: '',
    bompenger: '',
    ferge: '',
    parkering: '',
    annet: '',
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
    if (regelId == RegelIdFlytting.MÅ_FLYTTE_FOR_Å_GJENNOMFØRE_AKTIVITET && svar) {
        return begrunnelseHjelpeteksterForMåFlytteForGjennomføreAktivitet[svar];
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
            erUtgifterDokumentert: fakta.dokumenterteUtgifter.erUtgifterDokumentert,
            begrunnelseDokumenterteUtgifter: fakta.dokumenterteUtgifter.begrunnelse ?? '',
            nødvendigUtgift: fakta.nødvendigUtgift,
            beløpSomKanDekkes: fakta.beløpSomKanDekkes?.toString() ?? '',
        };
    }
    if (fakta?.type === 'FLYTTING_FLYTTE_SELV') {
        return {
            ...skjema,
            avstandEnVei: fakta.avstandEnVei?.toString() ?? '',
            henger: fakta.henger?.toString() ?? '',
            leiebil: fakta.leiebil?.toString() ?? '',
            bompenger: fakta.bompenger?.toString() ?? '',
            ferge: fakta.ferge?.toString() ?? '',
            parkering: fakta.parkering?.toString() ?? '',
            annet: fakta.annet?.toString() ?? '',
            erUtgifterDokumentert: fakta.dokumenterteUtgifter.erUtgifterDokumentert,
            begrunnelseDokumenterteUtgifter: fakta.dokumenterteUtgifter.begrunnelse ?? '',
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
    const [feilmeldinger, settFeilmeldinger] = useState<FeilmeldingerFlytting>({});
    const [feilmeldingVedLagring, settFeilmeldingVedLagring] = useState<Feil>();
    const [laster, settLaster] = useState(false);

    const oppdaterSvar = (regelId: RegelIdFlytting, verdi: string) => {
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
        settFeilmeldinger((forrige) => {
            const begrunnelseFeil = { ...forrige.begrunnelse };
            delete begrunnelseFeil[regelId];
            regel.reglerSomMåNullstilles.forEach((regelSomNullstilles) => {
                delete begrunnelseFeil[regelSomNullstilles];
            });
            return {
                ...forrige,
                begrunnelse: Object.keys(begrunnelseFeil).length ? begrunnelseFeil : undefined,
                nødvendigUtgift: undefined,
                begrunnelseNødvendigUtgift: undefined,
                erUtgifterDokumentert: undefined,
                begrunnelseDokumenterteUtgifter: undefined,
            };
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
        nullstillRegelfeilmelding(regelId);
    };

    const oppdaterNødvendigUtgift = (nødvendigUtgift: NødvendigUtgift) => {
        settFakta((forrige) => ({
            ...forrige,
            nødvendigUtgift,
            beløpSomKanDekkes:
                nødvendigUtgift.erUtgiftenNødvendig === 'NEI' ? forrige.beløpSomKanDekkes : '',
        }));
        settFeilmeldinger((forrige) => ({
            ...forrige,
            nødvendigUtgift: undefined,
            begrunnelseNødvendigUtgift: undefined,
            beløpSomKanDekkes: undefined,
        }));
    };

    const nullstillRegelfeilmelding = (regelId: RegelIdFlytting) => {
        settFeilmeldinger((forrige) => {
            const feilForRegler = { ...forrige.begrunnelse };
            delete feilForRegler[regelId];
            return {
                ...forrige,
                begrunnelse: Object.keys(feilForRegler).length ? feilForRegler : undefined,
            };
        });
    };

    function skjemaTilFaktaPayload(skjema: FaktaSkjema): FaktaFlytting | undefined {
        const adresse = skjema.adresse.trim() || null;
        const tallEllerNull = (verdi: string) => (verdi.trim() ? Number(verdi) : null);
        const nødvendigUtgift = skjema.nødvendigUtgift;
        if (skjema.type === 'FLYTTING_UBESTEMT') {
            return { type: skjema.type, adresse };
        }

        if (!nødvendigUtgift) {
            return;
        }

        if (skjema.erUtgifterDokumentert === undefined) {
            return;
        }
        const dokumenterteUtgifter = {
            erUtgifterDokumentert: skjema.erUtgifterDokumentert,
            begrunnelse: skjema.begrunnelseDokumenterteUtgifter.trim() || null,
        };

        if (skjema.type === 'FLYTTING_FLYTTEBYRÅ') {
            return {
                type: skjema.type,
                adresse,
                tilbud: skjema.tilbud.map((tilbud) => ({
                    navn: tilbud.navn.trim() || null,
                    pris: tallEllerNull(tilbud.pris),
                })),
                dokumenterteUtgifter,
                nødvendigUtgift,
                beløpSomKanDekkes:
                    nødvendigUtgift.erUtgiftenNødvendig === 'NEI'
                        ? tallEllerNull(skjema.beløpSomKanDekkes)
                        : null,
            };
        }
        return {
            type: skjema.type,
            adresse,
            avstandEnVei: tallEllerNull(skjema.avstandEnVei),
            henger: tilEkstrakostnad(skjema.henger),
            leiebil: tilEkstrakostnad(skjema.leiebil),
            bompenger: tilEkstrakostnad(skjema.bompenger),
            ferge: tilEkstrakostnad(skjema.ferge),
            parkering: tilEkstrakostnad(skjema.parkering),
            annet: tilEkstrakostnad(skjema.annet),
            dokumenterteUtgifter,
            nødvendigUtgift,
        };
    }

    const lagreSkjema = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        settFeilmeldingVedLagring(undefined);
        const aktiveRegler = initierAktiveDelvilkår(svar, regelstruktur);
        const valideringsfeil = validerFlytting(
            fakta.adresse,
            flyttedato,
            svar,
            aktiveRegler,
            regelstruktur,
            fakta
        );
        settFeilmeldinger(valideringsfeil);
        if (Object.keys(valideringsfeil).length > 0) return;

        const faktaPayload = skjemaTilFaktaPayload(fakta);
        if (!faktaPayload) {
            return;
        }

        settLaster(true);
        const respons = await lagre({ flyttedato, svar, fakta: faktaPayload });
        if (respons.status === RessursStatus.SUKSESS) {
            avbryt();
        } else if (erFeilressurs(respons)) {
            settFeilmeldingVedLagring(feiletRessursTilFeilmelding(respons));
        } else {
            settFeilmeldingVedLagring(
                lagFeilmelding('Kunne ikke lagre flyttevilkåret. Prøv igjen.')
            );
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
        <form autoComplete="off" onSubmit={lagreSkjema}>
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
                                settFeilmeldinger((forrige) => ({
                                    ...forrige,
                                    flyttedato: undefined,
                                }));
                            }}
                            size="small"
                            feil={feilmeldinger.flyttedato}
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
                                settFeilmeldinger((forrige) => ({
                                    ...forrige,
                                    adresse: undefined,
                                }));
                            }}
                            size="small"
                            error={feilmeldinger.adresse}
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
                            feilmeldingBegrunnelse={feilmeldinger.begrunnelse?.[regelId]}
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
                    feilmeldinger={feilmeldinger}
                    settFeilmeldinger={settFeilmeldinger}
                    oppdaterNødvendigUtgift={oppdaterNødvendigUtgift}
                />
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
                <Feilmelding feil={feilmeldingVedLagring} />
            </ResultatOgStatusKort>
        </form>
    );
};

const Faktafelter: React.FC<{
    fakta: FaktaSkjema;
    settFakta: React.Dispatch<React.SetStateAction<FaktaSkjema>>;
    feilmeldinger: FeilmeldingerFlytting;
    settFeilmeldinger: React.Dispatch<React.SetStateAction<FeilmeldingerFlytting>>;
    oppdaterNødvendigUtgift: (nødvendigUtgift: NødvendigUtgift) => void;
}> = ({ fakta, settFakta, feilmeldinger, settFeilmeldinger, oppdaterNødvendigUtgift }) => {
    if (fakta.type === 'FLYTTING_FLYTTEBYRÅ') {
        return (
            <EndreFaktaFlyttebyrå
                settFakta={settFakta}
                fakta={fakta}
                feilmeldinger={feilmeldinger}
                settFeilmeldinger={settFeilmeldinger}
                oppdaterNødvendigUtgift={oppdaterNødvendigUtgift}
            />
        );
    }

    if (fakta.type === 'FLYTTING_FLYTTE_SELV') {
        return (
            <EndreFaktaFlytteSelv
                settFakta={settFakta}
                fakta={fakta}
                feilmeldinger={feilmeldinger}
                settFeilmeldinger={settFeilmeldinger}
                oppdaterNødvendigUtgift={oppdaterNødvendigUtgift}
            />
        );
    }
};

const EndreFaktaFlyttebyrå: React.FC<{
    settFakta: React.Dispatch<React.SetStateAction<FaktaSkjema>>;
    fakta: FaktaSkjema;
    feilmeldinger: FeilmeldingerFlytting;
    settFeilmeldinger: React.Dispatch<React.SetStateAction<FeilmeldingerFlytting>>;
    oppdaterNødvendigUtgift: (nødvendigUtgift: NødvendigUtgift) => void;
}> = ({ settFakta, fakta, feilmeldinger, settFeilmeldinger, oppdaterNødvendigUtgift }) => {
    const oppdaterTilbud = (indeks: number, felt: 'navn' | 'pris', verdi: string) => {
        settFakta((forrige) => ({
            ...forrige,
            tilbud: forrige.tilbud.map((tilbud, tilbudsindeks) =>
                tilbudsindeks === indeks ? { ...tilbud, [felt]: verdi } : tilbud
            ),
        }));
        settFeilmeldinger((forrige) => {
            const tilbudFeil = [...(forrige.tilbud ?? [])];
            const feilForTilbud = { ...tilbudFeil[indeks] };
            delete feilForTilbud[felt];
            tilbudFeil[indeks] = Object.keys(feilForTilbud).length > 0 ? feilForTilbud : undefined;
            return {
                ...forrige,
                tilbud: tilbudFeil.some(Boolean) ? tilbudFeil : undefined,
            };
        });
    };
    return (
        <VStack gap="space-12">
            <Skillelinje />
            <FeilmeldingMaksBredde $maxWidth={500}>
                <NødvendigUtgiftFelt
                    nødvendigUtgift={fakta.nødvendigUtgift}
                    feilNødvendigUtgift={feilmeldinger.nødvendigUtgift}
                    feilBegrunnelse={feilmeldinger.begrunnelseNødvendigUtgift}
                    beskrivelse="Vurder om den oppgitte flytteutgiften er på et rimelig nivå."
                    begrunnelseBeskrivelse="Begrunn hvorfor flytteutgiften ikke vurderes som nødvendig."
                    oppdaterFakta={oppdaterNødvendigUtgift}
                />
            </FeilmeldingMaksBredde>
            {fakta.tilbud.map((tilbud, indeks) => {
                return (
                    <HGrid key={`tilbud-${indeks}`} gap="space-16" columns={{ xs: 1, sm: 2 }}>
                        <FeilmeldingMaksBredde $maxWidth={300}>
                            <TextField
                                autoComplete="off"
                                label={`Navn på flyttebyrå ${indeks + 1}`}
                                value={tilbud.navn}
                                error={feilmeldinger.tilbud?.[indeks]?.navn}
                                onChange={(event) => {
                                    oppdaterTilbud(indeks, 'navn', event.target.value);
                                }}
                                size="small"
                            />
                        </FeilmeldingMaksBredde>
                        <FeilmeldingMaksBredde $maxWidth={300}>
                            <TextField
                                autoComplete="off"
                                label={`Pris på tilbud ${indeks + 1} i kroner`}
                                value={tilbud.pris}
                                error={feilmeldinger.tilbud?.[indeks]?.pris}
                                inputMode="numeric"
                                onChange={(event) => {
                                    oppdaterTilbud(indeks, 'pris', event.target.value);
                                }}
                                size="small"
                            />
                        </FeilmeldingMaksBredde>
                    </HGrid>
                );
            })}
            {fakta.nødvendigUtgift?.erUtgiftenNødvendig === 'NEI' && (
                <FeilmeldingMaksBredde $maxWidth={240}>
                    <HStack maxWidth={'240px'}>
                        <TextField
                            label="Beløp som kan dekkes"
                            description="Siden hele utgiften ikke anses som nødvendig må du legge inn hvilken sum av tilbudet som kan dekkes"
                            value={fakta.beløpSomKanDekkes}
                            error={feilmeldinger.beløpSomKanDekkes}
                            inputMode="numeric"
                            onChange={(event) => {
                                settFakta((forrige) => ({
                                    ...forrige,
                                    beløpSomKanDekkes: event.target.value,
                                }));
                                settFeilmeldinger((forrige) => ({
                                    ...forrige,
                                    beløpSomKanDekkes: undefined,
                                }));
                            }}
                            size="small"
                        />
                    </HStack>
                </FeilmeldingMaksBredde>
            )}
            <Skillelinje />
            <DokumenterteUtgifterFelt
                beskrivelse="Det kan bare utbetales stønad for dokumenterte utgifter, for eksempel faktura eller kvittering som viser at utgifter er pådratt eller betalt. Pristilbud, anbud og anslag over framtidige utgifter er ikke tilstrekkelig dokumentasjon."
                fakta={fakta}
                settFakta={settFakta}
                feilmeldinger={feilmeldinger}
                settFeilmeldinger={settFeilmeldinger}
            />
        </VStack>
    );
};

const EndreFaktaFlytteSelv: React.FC<{
    settFakta: React.Dispatch<React.SetStateAction<FaktaSkjema>>;
    fakta: FaktaSkjema;
    feilmeldinger: FeilmeldingerFlytting;
    settFeilmeldinger: React.Dispatch<React.SetStateAction<FeilmeldingerFlytting>>;
    oppdaterNødvendigUtgift: (nødvendigUtgift: NødvendigUtgift) => void;
}> = ({ settFakta, fakta, feilmeldinger, settFeilmeldinger, oppdaterNødvendigUtgift }) => {
    return (
        <VStack gap="space-16">
            <Skillelinje />
            <FeilmeldingMaksBredde $maxWidth={500}>
                <NødvendigUtgiftFelt
                    nødvendigUtgift={fakta.nødvendigUtgift}
                    feilNødvendigUtgift={feilmeldinger.nødvendigUtgift}
                    feilBegrunnelse={feilmeldinger.begrunnelseNødvendigUtgift}
                    beskrivelse="Vurder om den oppgitte flytteutgiften er på et rimelig nivå."
                    begrunnelseBeskrivelse="Begrunn hvorfor flytteutgiften ikke vurderes som nødvendig."
                    oppdaterFakta={oppdaterNødvendigUtgift}
                />
            </FeilmeldingMaksBredde>
            <HStack gap="space-16">
                <FeilmeldingMaksBredde $maxWidth={180}>
                    <TextField
                        autoComplete="off"
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
                {ekstrakostnaderFlytting.map(({ felt, label }) => (
                    <FeilmeldingMaksBredde $maxWidth={180} key={felt}>
                        <TextField
                            autoComplete="off"
                            label={label}
                            value={fakta[felt]}
                            inputMode="decimal"
                            error={feilmeldinger.ekstrakostnader?.[felt]}
                            onChange={(event) => {
                                settFakta((forrige) => ({
                                    ...forrige,
                                    [felt]: event.target.value,
                                }));
                                settFeilmeldinger((forrige) => ({
                                    ...forrige,
                                    ekstrakostnader: {
                                        ...forrige.ekstrakostnader,
                                        [felt]: undefined,
                                    },
                                }));
                            }}
                            size="small"
                        />
                    </FeilmeldingMaksBredde>
                ))}
            </HStack>
            <Skillelinje />
            <DokumenterteUtgifterFelt
                beskrivelse="Det kan bare utbetales stønad for dokumenterte utgifter, for eksempel faktura eller kvittering som viser at utgifter er pådratt eller betalt. Beregninger og anslag over framtidige utgifter er ikke tilstrekkelig dokumentasjon."
                fakta={fakta}
                settFakta={settFakta}
                feilmeldinger={feilmeldinger}
                settFeilmeldinger={settFeilmeldinger}
            />
        </VStack>
    );
};

const DokumenterteUtgifterFelt: React.FC<{
    beskrivelse: string;
    fakta: FaktaSkjema;
    settFakta: React.Dispatch<React.SetStateAction<FaktaSkjema>>;
    feilmeldinger: FeilmeldingerFlytting;
    settFeilmeldinger: React.Dispatch<React.SetStateAction<FeilmeldingerFlytting>>;
}> = ({ beskrivelse, fakta, settFakta, feilmeldinger, settFeilmeldinger }) => {
    return (
        <FellesDelvilkår
            regelId="ER_UTGIFTER_DOKUMENTERT"
            label="Er utgiften dokumentert og skal utbetales i dette vedtaket?"
            beskrivelse={beskrivelse}
            svaralternativer={[
                { svarId: SvarJaNei.JA, begrunnelseType: BegrunnelseRegel.PÅKREVD },
                { svarId: SvarJaNei.NEI, begrunnelseType: BegrunnelseRegel.VALGFRI },
            ]}
            svar={fakta.erUtgifterDokumentert}
            begrunnelse={fakta.begrunnelseDokumenterteUtgifter}
            begrunnelseHjelpetekst={
                fakta.erUtgifterDokumentert === SvarJaNei.JA
                    ? 'Vurder om flyttingen faktisk er betalt for og hvilke dokumenter som dokumenterer dette'
                    : undefined
            }
            feilmeldingSvar={feilmeldinger.erUtgifterDokumentert}
            feilmeldingBegrunnelse={feilmeldinger.begrunnelseDokumenterteUtgifter}
            oppdaterSvar={(nyttSvar) => {
                if (!erSvarJaNei(nyttSvar)) {
                    return;
                }
                settFakta((forrige) => ({
                    ...forrige,
                    erUtgifterDokumentert: nyttSvar,
                }));
                settFeilmeldinger((forrige) => ({
                    ...forrige,
                    erUtgifterDokumentert: undefined,
                    begrunnelseDokumenterteUtgifter: undefined,
                }));
            }}
            oppdaterBegrunnelse={(begrunnelse) => {
                settFakta((forrige) => ({
                    ...forrige,
                    begrunnelseDokumenterteUtgifter: begrunnelse,
                }));
                settFeilmeldinger((forrige) => ({
                    ...forrige,
                    begrunnelseDokumenterteUtgifter: undefined,
                }));
            }}
        />
    );
};
