import React, { useEffect, useId, useState } from 'react';

import { BriefcaseIcon, PencilIcon, PlusIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    HGrid,
    HStack,
    Label,
    LocalAlert,
    Radio,
    RadioGroup,
    Tag,
    TextField,
    VStack,
} from '@navikt/ds-react';

import {
    FaktaFlytting,
    LagreVilkårFlytting,
    RegelIdFlytting,
    SvarOgBegrunnelseFlytting,
    VilkårFlytting,
} from './typer/vilkårFlytting';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useSteg } from '../../../../context/StegContext';
import {
    useVilkårFlytting,
    VilkårFlyttingProvider,
} from '../../../../context/VilkårFlyttingContext';
import { useHentVilkårFlytting } from '../../../../hooks/useHentVilkårsvurdering';
import DataViewer from '../../../../komponenter/DataViewer';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { ResultatOgStatusKort } from '../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Skillelinje } from '../../../../komponenter/Skillelinje';
import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { Steg } from '../../../../typer/behandling/steg';
import { feilmeldingVedFeil, Ressurs, RessursStatus } from '../../../../typer/ressurs';
import { formaterNullablePeriode } from '../../../../utils/dato';
import { PeriodeStatus } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { StønadsvilkårType, VilkårBase, Vilkårsresultat } from '../../vilkår';
import SlettVilkårModal from '../../Vilkårvurdering/EndreVilkår/SlettVilkårModal';
import { LesevisningDelvilkår } from '../ReiseTilSamling/Lesevisning/Felles/LesevisningDelvilkår';

type FaktaUtkast = { adresse: string } & (
    | {
          type: 'FLYTTING_FLYTTEBYRÅ';
          tilbud1: { navn: string; pris: string };
          tilbud2: { navn: string; pris: string };
      }
    | {
          type: 'FLYTTING_KJØRE_SELV';
          avstandEnVei: string;
          henger: string;
          bompenger: string;
          ferge: string;
          parkering: string;
      }
    | { type: 'FLYTTING_UBESTEMT' }
);

const heltall = (verdi: string, minsteVerdi: number): { tall: number | null; feil?: string } => {
    if (verdi === '') return { tall: null };
    if (!/^\d+$/.test(verdi)) return { tall: null, feil: 'Skriv et helt tall uten desimaler.' };
    const tall = Number(verdi);
    if (!Number.isSafeInteger(tall) || tall > 2147483647) {
        return { tall: null, feil: 'Tallet er for stort.' };
    }
    if (tall < minsteVerdi) return { tall: null, feil: `Tallet må være minst ${minsteVerdi}.` };
    return { tall };
};

const faktaTilUtkast = (fakta?: FaktaFlytting): FaktaUtkast => {
    if (fakta?.type === 'FLYTTING_FLYTTEBYRÅ') {
        return {
            type: fakta.type,
            adresse: fakta.adresse ?? '',
            tilbud1: { navn: fakta.tilbud1.navn ?? '', pris: fakta.tilbud1.pris?.toString() ?? '' },
            tilbud2: { navn: fakta.tilbud2.navn ?? '', pris: fakta.tilbud2.pris?.toString() ?? '' },
        };
    }
    if (fakta?.type === 'FLYTTING_KJØRE_SELV') {
        return {
            type: fakta.type,
            adresse: fakta.adresse ?? '',
            avstandEnVei: fakta.avstandEnVei?.toString() ?? '',
            henger: fakta.henger?.toString() ?? '',
            bompenger: fakta.bompenger?.toString() ?? '',
            ferge: fakta.ferge?.toString() ?? '',
            parkering: fakta.parkering?.toString() ?? '',
        };
    }
    return { type: 'FLYTTING_UBESTEMT', adresse: fakta?.adresse ?? '' };
};

export const StønadsvilkårFlytting: React.FC = () => {
    const { eksisterendeVilkår } = useHentVilkårFlytting();

    return (
        <VStack gap="space-16">
            <DataViewer type="vilkår" response={{ eksisterendeVilkår }}>
                {({ eksisterendeVilkår }) => (
                    <VilkårFlyttingProvider eksisterendeVilkår={eksisterendeVilkår}>
                        <Innhold />
                    </VilkårFlyttingProvider>
                )}
            </DataViewer>
            <StegKnapp steg={Steg.VILKÅR}>Fullfør vilkårsvurdering og gå videre</StegKnapp>
        </VStack>
    );
};

const Innhold: React.FC = () => {
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const { vilkårsett, lagreNyttVilkår, oppdaterVilkår } = useVilkårFlytting();
    const [redigererId, settRedigererId] = useState<string>();

    return (
        <VilkårPanel tittel="Flytting" ikon={<BriefcaseIcon />}>
            <VStack gap="space-16">
                {vilkårsett.map((vilkår) => (
                    <section
                        key={vilkår.id}
                        aria-label={`Flyttevilkår ${formaterNullablePeriode(vilkår.fom, vilkår.tom)}`}
                    >
                        {redigererId === vilkår.id ? (
                            <FlyttingSkjema
                                vilkår={vilkår}
                                avbryt={() => settRedigererId(undefined)}
                                lagre={(payload) => oppdaterVilkår(vilkår.id, payload)}
                            />
                        ) : (
                            <FlyttingLesevisning
                                vilkår={vilkår}
                                behandlingId={behandling.id}
                                kanRedigere={erStegRedigerbart && redigererId === undefined}
                                startRedigering={() => settRedigererId(vilkår.id)}
                            />
                        )}
                    </section>
                ))}
                {redigererId === 'ny' && (
                    <FlyttingSkjema
                        avbryt={() => settRedigererId(undefined)}
                        lagre={lagreNyttVilkår}
                    />
                )}
                {erStegRedigerbart && redigererId === undefined && (
                    <SmallButton
                        variant="secondary"
                        icon={<PlusIcon aria-hidden />}
                        onClick={() => settRedigererId('ny')}
                    >
                        Legg til flyttevilkår
                    </SmallButton>
                )}
                {vilkårsett.length === 0 && !erStegRedigerbart && (
                    <LocalAlert status="announcement">
                        <LocalAlert.Header>
                            <LocalAlert.Title>Ingen flyttevilkår registrert</LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>
                            Det er ikke registrert flyttevilkår.
                        </LocalAlert.Content>
                    </LocalAlert>
                )}
            </VStack>
        </VilkårPanel>
    );
};

const FlyttingLesevisning: React.FC<{
    vilkår: VilkårFlytting;
    behandlingId: string;
    kanRedigere: boolean;
    startRedigering: () => void;
}> = ({ vilkår, behandlingId, kanRedigere, startRedigering }) => (
    <ResultatOgStatusKort
        periode={tilVilkårBase(vilkår, behandlingId)}
        footer={
            <HStack align="center" gap="space-8" padding="space-12">
                <Tag variant="moderate" data-color={resultatFarge[vilkår.resultat]}>
                    {resultatTekst[vilkår.resultat]}
                </Tag>
                {kanRedigere && (
                    <SmallButton
                        variant="tertiary"
                        icon={<PencilIcon aria-hidden />}
                        onClick={startRedigering}
                    >
                        Rediger
                    </SmallButton>
                )}
            </HStack>
        }
    >
        <VStack gap="space-12">
            <HStack gap="space-32" paddingBlock="space-0 space-12">
                <div>
                    <BodyShort size="small">Periode</BodyShort>
                    <Label size="small">{formaterNullablePeriode(vilkår.fom, vilkår.tom)}</Label>
                </div>
            </HStack>
            <Skillelinje utenMargin />
            <LesevisningDelvilkår delvilkårsett={tilDelvilkår(vilkår)} />
            <VilkårFaktaLesevisning vilkår={vilkår} />
        </VStack>
    </ResultatOgStatusKort>
);

const tilVilkårBase = (vilkår: VilkårFlytting, behandlingId: string): VilkårBase => ({
    id: vilkår.id,
    behandlingId,
    fom: vilkår.fom,
    tom: vilkår.tom,
    resultat: vilkår.resultat,
    status: vilkår.status ?? PeriodeStatus.UENDRET,
    vilkårType: StønadsvilkårType.FLYTTING,
    delvilkårsett: tilDelvilkår(vilkår),
});

const tilDelvilkår = (vilkår: VilkårFlytting) =>
    vilkår.delvilkårsett.map((delvilkår) => ({
        resultat: delvilkår.resultat,
        vurderinger: delvilkår.vurderinger.map((vurdering) => ({
            regelId: vurdering.regelId,
            svar: vurdering.svar ?? undefined,
            begrunnelse: vurdering.begrunnelse ?? undefined,
        })),
    }));

const resultatTekst: Record<Vilkårsresultat, string> = {
    [Vilkårsresultat.OPPFYLT]: 'Vilkåret er oppfylt',
    [Vilkårsresultat.AUTOMATISK_OPPFYLT]: 'Vilkåret er automatisk oppfylt',
    [Vilkårsresultat.IKKE_OPPFYLT]: 'Vilkåret er ikke oppfylt',
    [Vilkårsresultat.IKKE_AKTUELL]: 'Ikke aktuelt',
    [Vilkårsresultat.IKKE_TATT_STILLING_TIL]: 'Ikke ferdig vurdert',
    [Vilkårsresultat.SKAL_IKKE_VURDERES]: 'Skal ikke vurderes',
    [Vilkårsresultat.SLETTET]: 'Slettet',
};

const resultatFarge: Record<Vilkårsresultat, 'success' | 'danger' | 'warning' | 'neutral'> = {
    [Vilkårsresultat.OPPFYLT]: 'success',
    [Vilkårsresultat.AUTOMATISK_OPPFYLT]: 'success',
    [Vilkårsresultat.IKKE_OPPFYLT]: 'danger',
    [Vilkårsresultat.IKKE_AKTUELL]: 'neutral',
    [Vilkårsresultat.IKKE_TATT_STILLING_TIL]: 'warning',
    [Vilkårsresultat.SKAL_IKKE_VURDERES]: 'neutral',
    [Vilkårsresultat.SLETTET]: 'neutral',
};

const VilkårFaktaLesevisning: React.FC<{ vilkår: VilkårFlytting }> = ({ vilkår }) => {
    const vurderinger = vilkår.delvilkårsett.flatMap((delvilkår) => delvilkår.vurderinger);
    const flyttebyråvurdering = vurderinger.find(
        (vurdering) => vurdering.regelId === RegelIdFlytting.SKAL_BRUKE_FLYTTEBYRÅ
    );
    const kjøreSelvvurdering = vurderinger.find(
        (vurdering) => vurdering.regelId === RegelIdFlytting.SKAL_KJØRE_SELV
    );
    const visSvar = (svar?: string | null) =>
        svar === 'JA' ? 'Ja' : svar === 'NEI' ? 'Nei' : 'Ikke vurdert';
    const fakta = vilkår.fakta;

    return (
        <VStack gap="space-12">
            <VStack gap="space-4">
                <BodyShort size="small">Adresse brukeren skal flytte til</BodyShort>
                <Label size="small">{fakta.adresse || 'Adresse ikke fylt ut'}</Label>
            </VStack>
            {flyttebyråvurdering?.svar === 'JA' && fakta.type === 'FLYTTING_FLYTTEBYRÅ' && (
                <>
                    <Skillelinje utenMargin />
                    <HGrid gap="space-16" columns={{ xs: 1, sm: 2 }}>
                        {[fakta.tilbud1, fakta.tilbud2].map((tilbud, index) => (
                            <VStack key={index} gap="space-4">
                                <BodyShort weight="semibold" size="small">
                                    Tilbud fra flyttebyrå {index + 1}
                                </BodyShort>
                                <BodyShort size="small">
                                    {tilbud.navn ?? 'Navn ikke fylt ut'}
                                </BodyShort>
                                <BodyShort size="small">
                                    {tilbud.pris === null
                                        ? 'Pris ikke fylt ut'
                                        : `${tilbud.pris} kr`}
                                </BodyShort>
                            </VStack>
                        ))}
                    </HGrid>
                </>
            )}
            {flyttebyråvurdering?.svar === 'NEI' &&
                kjøreSelvvurdering?.svar === 'JA' &&
                fakta.type === 'FLYTTING_KJØRE_SELV' && (
                    <>
                        <Skillelinje utenMargin />
                        <VStack gap="space-8">
                            <BodyShort weight="semibold" size="small">
                                Egen kjøring
                            </BodyShort>
                            <BodyShort size="small">
                                Avstand én vei:{' '}
                                {fakta.avstandEnVei === null
                                    ? 'Ikke fylt ut'
                                    : `${fakta.avstandEnVei} km`}
                            </BodyShort>
                            <HGrid gap="space-16" columns={{ xs: 1, sm: 2 }}>
                                {(['henger', 'bompenger', 'ferge', 'parkering'] as const).map(
                                    (felt) => (
                                        <div key={felt}>
                                            <BodyShort size="small">
                                                {kostnadstekst[felt]}
                                            </BodyShort>
                                            <Label size="small">
                                                {fakta[felt] === null
                                                    ? 'Ingen kostnad'
                                                    : `${fakta[felt]} kr`}
                                            </Label>
                                        </div>
                                    )
                                )}
                            </HGrid>
                        </VStack>
                    </>
                )}
            {flyttebyråvurdering?.svar === 'NEI' && kjøreSelvvurdering?.svar === 'NEI' && (
                <BodyShort size="small">Ingen flyttekostnader er registrert.</BodyShort>
            )}
            {!flyttebyråvurdering?.svar && (
                <BodyShort size="small">{visSvar(flyttebyråvurdering?.svar)}</BodyShort>
            )}
        </VStack>
    );
};

const FlyttingSkjema: React.FC<{
    vilkår?: VilkårFlytting;
    avbryt: () => void;
    lagre: (payload: LagreVilkårFlytting) => Promise<Ressurs<VilkårFlytting>>;
}> = ({ vilkår, avbryt, lagre }) => {
    const { behandling } = useBehandling();
    const { slettVilkår } = useVilkårFlytting();
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const komponentId = useId();
    const [fom, settFom] = useState(vilkår?.fom ?? '');
    const [tom, settTom] = useState(vilkår?.tom ?? '');
    const [svar, settSvar] = useState<Partial<Record<RegelIdFlytting, SvarOgBegrunnelseFlytting>>>(
        () => {
            const vurderinger = vilkår?.delvilkårsett.flatMap((del) => del.vurderinger) ?? [];
            return Object.fromEntries(
                vurderinger
                    .filter((vurdering) => vurdering.svar)
                    .map((vurdering) => [
                        vurdering.regelId,
                        { svar: vurdering.svar!, begrunnelse: vurdering.begrunnelse },
                    ])
            );
        }
    );
    const [fakta, settFakta] = useState<FaktaUtkast>(() => faktaTilUtkast(vilkår?.fakta));
    const [feil, settFeil] = useState<string>();
    const [laster, settLaster] = useState(false);

    useEffect(() => {
        settUlagretKomponent(komponentId);
        return () => nullstillUlagretKomponent(komponentId);
    }, [komponentId, nullstillUlagretKomponent, settUlagretKomponent]);

    const oppdaterSvar = (regelId: RegelIdFlytting, verdi: string) => {
        const valgtSvar = verdi as 'JA' | 'NEI';
        settSvar((forrige) => {
            const neste = { ...forrige, [regelId]: { ...forrige[regelId], svar: valgtSvar } };
            if (regelId === RegelIdFlytting.SKAL_BRUKE_FLYTTEBYRÅ) {
                if (valgtSvar === 'JA') delete neste[RegelIdFlytting.SKAL_KJØRE_SELV];
                else delete neste[RegelIdFlytting.SKAL_KJØRE_SELV];
            }
            return neste;
        });
        settFakta(
            regelId === RegelIdFlytting.SKAL_BRUKE_FLYTTEBYRÅ && valgtSvar === 'JA'
                ? {
                      type: 'FLYTTING_FLYTTEBYRÅ',
                      adresse: fakta.adresse,
                      tilbud1: { navn: '', pris: '' },
                      tilbud2: { navn: '', pris: '' },
                  }
                : { type: 'FLYTTING_UBESTEMT', adresse: fakta.adresse }
        );
    };

    const oppdaterBegrunnelse = (regelId: RegelIdFlytting, begrunnelse: string) => {
        settSvar((forrige) => ({
            ...forrige,
            [regelId]: { svar: forrige[regelId]?.svar ?? 'JA', begrunnelse },
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

        let faktaPayload: FaktaFlytting;
        if (fakta.type === 'FLYTTING_FLYTTEBYRÅ') {
            const pris1 = heltall(fakta.tilbud1.pris, 1);
            const pris2 = heltall(fakta.tilbud2.pris, 1);
            if (pris1.feil || pris2.feil) {
                settFeil(pris1.feil ?? pris2.feil);
                return;
            }
            faktaPayload = {
                type: fakta.type,
                adresse: fakta.adresse.trim() || null,
                tilbud1: { navn: fakta.tilbud1.navn.trim() || null, pris: pris1.tall },
                tilbud2: { navn: fakta.tilbud2.navn.trim() || null, pris: pris2.tall },
            };
        } else if (fakta.type === 'FLYTTING_KJØRE_SELV') {
            const avstand = heltall(fakta.avstandEnVei, 1);
            const henger = heltall(fakta.henger, 0);
            const bompenger = heltall(fakta.bompenger, 0);
            const ferge = heltall(fakta.ferge, 0);
            const parkering = heltall(fakta.parkering, 0);
            const feltfeil = [avstand, henger, bompenger, ferge, parkering].find(
                (felt) => felt.feil
            );
            if (feltfeil?.feil) {
                settFeil(feltfeil.feil);
                return;
            }
            faktaPayload = {
                type: fakta.type,
                adresse: fakta.adresse.trim() || null,
                avstandEnVei: avstand.tall,
                henger: henger.tall,
                bompenger: bompenger.tall,
                ferge: ferge.tall,
                parkering: parkering.tall,
            };
        } else {
            faktaPayload = { ...fakta, adresse: fakta.adresse.trim() || null };
        }

        settLaster(true);
        const respons = await lagre({ fom, tom, svar, fakta: faktaPayload });
        if (respons.status === RessursStatus.SUKSESS) {
            nullstillUlagretKomponent(komponentId);
            avbryt();
        } else {
            settFeil(feilmeldingVedFeil(respons) ?? 'Kunne ikke lagre flyttevilkåret. Prøv igjen.');
        }
        settLaster(false);
    };

    const oppdaterSvarOgFakta = (verdi: string) => {
        const valgtSvar = verdi as 'JA' | 'NEI';
        settSvar((forrige) => ({
            ...forrige,
            [RegelIdFlytting.SKAL_KJØRE_SELV]: {
                ...forrige[RegelIdFlytting.SKAL_KJØRE_SELV],
                svar: valgtSvar,
            },
        }));
        settFakta(
            valgtSvar === 'JA'
                ? {
                      type: 'FLYTTING_KJØRE_SELV',
                      adresse: fakta.adresse,
                      avstandEnVei: '',
                      henger: '',
                      bompenger: '',
                      ferge: '',
                      parkering: '',
                  }
                : { type: 'FLYTTING_UBESTEMT', adresse: fakta.adresse }
        );
    };

    return (
        <form onSubmit={lagreSkjema}>
            <ResultatOgStatusKort
                periode={vilkår ? tilVilkårBase(vilkår, behandling.id) : undefined}
                redigeres
            >
                <VStack gap="space-16">
                    <HStack gap="space-16" align="start">
                        <DateInputMedLeservisning
                            label="Fra"
                            value={fom}
                            onChange={(dato) => settFom(dato ?? '')}
                            size="small"
                        />
                        <DateInputMedLeservisning
                            label="Til"
                            value={tom}
                            onChange={(dato) => settTom(dato ?? '')}
                            size="small"
                        />
                    </HStack>
                    <Skillelinje />
                    <TextField
                        label="Adresse brukeren skal flytte til"
                        value={fakta.adresse}
                        onChange={(event) =>
                            settFakta((forrige) => ({
                                ...forrige,
                                adresse: event.target.value,
                            }))
                        }
                        size="small"
                    />
                    <Skillelinje />
                    <RadioGroup
                        legend="Skal brukeren bruke flyttebyrå?"
                        value={svar[RegelIdFlytting.SKAL_BRUKE_FLYTTEBYRÅ]?.svar ?? ''}
                        onChange={(value) =>
                            oppdaterSvar(RegelIdFlytting.SKAL_BRUKE_FLYTTEBYRÅ, value)
                        }
                    >
                        <Radio value="JA">Ja</Radio>
                        <Radio value="NEI">Nei</Radio>
                    </RadioGroup>
                    {svar[RegelIdFlytting.SKAL_BRUKE_FLYTTEBYRÅ]?.svar && (
                        <TextField
                            label="Begrunnelse"
                            value={svar[RegelIdFlytting.SKAL_BRUKE_FLYTTEBYRÅ]?.begrunnelse ?? ''}
                            onChange={(event) =>
                                oppdaterBegrunnelse(
                                    RegelIdFlytting.SKAL_BRUKE_FLYTTEBYRÅ,
                                    event.target.value
                                )
                            }
                            size="small"
                        />
                    )}
                    {svar[RegelIdFlytting.SKAL_BRUKE_FLYTTEBYRÅ]?.svar === 'JA' &&
                        fakta.type === 'FLYTTING_FLYTTEBYRÅ' && (
                            <>
                                <Skillelinje />
                                <VStack gap="space-12">
                                    {[1, 2].map((nummer) => {
                                        const nøkkel = nummer === 1 ? 'tilbud1' : 'tilbud2';
                                        const tilbud = fakta[nøkkel];
                                        return (
                                            <HGrid
                                                key={nøkkel}
                                                gap="space-16"
                                                columns={{ xs: 1, sm: 2 }}
                                            >
                                                <TextField
                                                    label={`Navn på flyttebyrå ${nummer}`}
                                                    value={tilbud.navn}
                                                    onChange={(event) =>
                                                        settFakta((forrige) =>
                                                            forrige.type === 'FLYTTING_FLYTTEBYRÅ'
                                                                ? {
                                                                      ...forrige,
                                                                      [nøkkel]: {
                                                                          ...forrige[nøkkel],
                                                                          navn: event.target.value,
                                                                      },
                                                                  }
                                                                : forrige
                                                        )
                                                    }
                                                    size="small"
                                                />
                                                <TextField
                                                    label={`Pris på tilbud ${nummer} i kroner`}
                                                    value={tilbud.pris}
                                                    inputMode="numeric"
                                                    onChange={(event) =>
                                                        settFakta((forrige) =>
                                                            forrige.type === 'FLYTTING_FLYTTEBYRÅ'
                                                                ? {
                                                                      ...forrige,
                                                                      [nøkkel]: {
                                                                          ...forrige[nøkkel],
                                                                          pris: event.target.value,
                                                                      },
                                                                  }
                                                                : forrige
                                                        )
                                                    }
                                                    size="small"
                                                />
                                            </HGrid>
                                        );
                                    })}
                                </VStack>
                            </>
                        )}
                    {svar[RegelIdFlytting.SKAL_BRUKE_FLYTTEBYRÅ]?.svar === 'NEI' && (
                        <>
                            <Skillelinje />
                            <RadioGroup
                                legend="Skal brukeren kjøre selv?"
                                value={svar[RegelIdFlytting.SKAL_KJØRE_SELV]?.svar ?? ''}
                                onChange={oppdaterSvarOgFakta}
                            >
                                <Radio value="JA">Ja</Radio>
                                <Radio value="NEI">Nei</Radio>
                            </RadioGroup>
                            {svar[RegelIdFlytting.SKAL_KJØRE_SELV]?.svar && (
                                <TextField
                                    label="Begrunnelse"
                                    value={svar[RegelIdFlytting.SKAL_KJØRE_SELV]?.begrunnelse ?? ''}
                                    onChange={(event) =>
                                        oppdaterBegrunnelse(
                                            RegelIdFlytting.SKAL_KJØRE_SELV,
                                            event.target.value
                                        )
                                    }
                                    size="small"
                                />
                            )}
                            {svar[RegelIdFlytting.SKAL_KJØRE_SELV]?.svar === 'JA' &&
                                fakta.type === 'FLYTTING_KJØRE_SELV' && (
                                    <>
                                        <Skillelinje />
                                        <VStack gap="space-12">
                                            <TextField
                                                label="Avstand én vei i kilometer"
                                                value={fakta.avstandEnVei}
                                                inputMode="numeric"
                                                onChange={(event) =>
                                                    settFakta((forrige) =>
                                                        forrige.type === 'FLYTTING_KJØRE_SELV'
                                                            ? {
                                                                  ...forrige,
                                                                  avstandEnVei: event.target.value,
                                                              }
                                                            : forrige
                                                    )
                                                }
                                                size="small"
                                            />
                                            {(
                                                [
                                                    'henger',
                                                    'bompenger',
                                                    'ferge',
                                                    'parkering',
                                                ] as const
                                            ).map((felt) => (
                                                <TextField
                                                    key={felt}
                                                    label={`${kostnadstekst[felt]} i kroner`}
                                                    description="Oppgi samlet kostnad. La feltet stå tomt hvis det ikke finnes en kostnad."
                                                    value={fakta[felt]}
                                                    inputMode="numeric"
                                                    onChange={(event) =>
                                                        settFakta((forrige) =>
                                                            forrige.type === 'FLYTTING_KJØRE_SELV'
                                                                ? {
                                                                      ...forrige,
                                                                      [felt]: event.target.value,
                                                                  }
                                                                : forrige
                                                        )
                                                    }
                                                    size="small"
                                                />
                                            ))}
                                        </VStack>
                                    </>
                                )}
                        </>
                    )}
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
                        <SmallButton type="button" variant="secondary" onClick={avbryt}>
                            Avbryt
                        </SmallButton>
                        {vilkår && (
                            <SlettVilkårModal
                                vilkår={{
                                    ...vilkår,
                                    behandlingId: behandling.id,
                                    vilkårType: StønadsvilkårType.FLYTTING,
                                    status: vilkår.status ?? PeriodeStatus.UENDRET,
                                    slettetKommentar: vilkår.slettetKommentar ?? undefined,
                                    delvilkårsett: vilkår.delvilkårsett.map((delvilkår) => ({
                                        ...delvilkår,
                                        vurderinger: delvilkår.vurderinger.map((vurdering) => ({
                                            ...vurdering,
                                            svar: vurdering.svar ?? undefined,
                                            begrunnelse: vurdering.begrunnelse ?? undefined,
                                        })),
                                    })),
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
                </VStack>
            </ResultatOgStatusKort>
        </form>
    );
};

const kostnadstekst: Record<'henger' | 'bompenger' | 'ferge' | 'parkering', string> = {
    henger: 'Henger',
    bompenger: 'Bompenger',
    ferge: 'Ferge',
    parkering: 'Parkering',
};
