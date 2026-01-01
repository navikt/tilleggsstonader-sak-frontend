import React, { Dispatch, SetStateAction, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { PencilIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, Label } from '@navikt/ds-react';

import {
    formkravFristUnntakTilTekst,
    IFormalkrav,
    IFormkravVilkår,
    Redigeringsmodus,
    VilkårStatus,
    vilkårStatusTilTekst,
} from './typer';
import {
    harManuellVedtaksdato,
    skalViseKlagefristUnntak,
    utledFagsystemVedtakFraPåklagetVedtak,
    utledRadioKnapper,
    vedtakstidspunktTilVisningstekst,
} from './utils';
import {
    alleVilkårOppfylt,
    begrunnelseUtfylt,
    brevtekstUtfylt,
    klagefristUnntakTattStillingTil,
    påKlagetVedtakValgt,
    utledIkkeUtfylteVilkår,
} from './validerFormkravUtils';
import styles from './VisFormkravVurderinger.module.css';
import { SøppelbøtteKnapp } from '../../../../komponenter/Knapper/SøppelbøtteKnapp';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../../typer/ressurs';
import { formaterIsoDatoTid, formaterNullableIsoDato } from '../../../../utils/dato';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import BrukerMedBlyant from '../../Komponenter/Ikoner/BrukerMedBlyant';
import { FagsystemVedtak } from '../../typer/fagsystemVedtak';
import {
    PåklagetVedtakstype,
    påklagetVedtakstypeTilTekst,
} from '../../typer/klagebehandling/påklagetVedtakstype';

export const RadSentrertVertikalt: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={styles.radSentrertVertikalt}>{children}</div>
);

interface IProps {
    fagsystemVedtak: FagsystemVedtak[];
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    vurderinger: IFormkravVilkår;
}

export const VisFormkravVurderinger: React.FC<IProps> = ({
    fagsystemVedtak,
    lagreVurderinger,
    settOppdaterteVurderinger,
    settRedigeringsmodus,
    vurderinger,
}) => {
    const { behandlingErRedigerbar, hentBehandling } = useKlagebehandling();
    const { påklagetVedtakstype, manuellVedtaksdato } = vurderinger.påklagetVedtak;
    const navigate = useNavigate();
    const [nullstillerVurderinger, settNullstillerVurderinger] = useState<boolean>(false);

    const nullstillVurderinger = () => {
        if (nullstillerVurderinger) {
            return;
        }
        settNullstillerVurderinger(true);

        const nullstilteVurderinger: IFormkravVilkår = {
            ...vurderinger,
            klagePart: VilkårStatus.IKKE_SATT,
            klageKonkret: VilkårStatus.IKKE_SATT,
            klagefristOverholdt: VilkårStatus.IKKE_SATT,
            klageSignert: VilkårStatus.IKKE_SATT,
            saksbehandlerBegrunnelse: undefined,
            brevtekst: undefined,
            påklagetVedtak: {
                påklagetVedtakstype: PåklagetVedtakstype.IKKE_VALGT,
            },
        };

        lagreVurderinger(nullstilteVurderinger).then((res: Ressurs<IFormkravVilkår>) => {
            settNullstillerVurderinger(false);
            if (res.status === RessursStatus.SUKSESS) {
                settOppdaterteVurderinger(nullstilteVurderinger);
                settRedigeringsmodus(Redigeringsmodus.IKKE_PÅSTARTET);
                hentBehandling.rerun();
            }
        });
    };

    const radioKnapper = utledRadioKnapper(vurderinger);
    const alleVilkårErOppfylt = alleVilkårOppfylt(vurderinger);
    const påKlagetVedtakErValgt = påKlagetVedtakValgt(vurderinger);
    const harBegrunnelse = begrunnelseUtfylt(vurderinger);
    const harBrevtekst = brevtekstUtfylt(vurderinger);
    const manglerFritekster = !harBrevtekst || !harBegrunnelse;
    const ikkeUtfylteVilkår = utledIkkeUtfylteVilkår(vurderinger);
    const unntakFormalkravTattStillingTil = klagefristUnntakTattStillingTil(vurderinger);
    const ikkePåklagetVedtak =
        vurderinger.påklagetVedtak.påklagetVedtakstype === PåklagetVedtakstype.UTEN_VEDTAK;

    const utledManglerUtfylling = () => {
        if (ikkePåklagetVedtak) {
            return manglerFritekster;
        }
        return (
            ikkeUtfylteVilkår.length > 0 ||
            !unntakFormalkravTattStillingTil ||
            !påKlagetVedtakErValgt ||
            (!alleVilkårErOppfylt && manglerFritekster)
        );
    };

    const manglerUtfylling = utledManglerUtfylling();

    const utledUrlSuffiks = (): string => {
        if (!behandlingErRedigerbar) {
            return '';
        }
        if (manglerUtfylling) {
            return '';
        }
        return alleVilkårErOppfylt ? 'vurdering' : 'brev';
    };

    const gjeldendeFagsystemVedtak = utledFagsystemVedtakFraPåklagetVedtak(
        fagsystemVedtak,
        vurderinger.påklagetVedtak
    );

    const urlSuffiks = utledUrlSuffiks();

    const skalViseBegrunnelseOgBrevtekst = !alleVilkårErOppfylt || ikkePåklagetVedtak;

    return (
        <div className={styles.visFormkravContainer}>
            <div className={styles.header}>
                <RadSentrertVertikalt>
                    <div className={styles.vilkarIkon}>
                        <BrukerMedBlyant
                            heigth={23}
                            width={23}
                            className={styles.brukerMedBlyantIkon}
                        />
                    </div>
                    <Heading spacing size={'medium'}>
                        {alleVilkårErOppfylt ? 'Vilkår oppfylt' : 'Vilkår ikke oppfylt'}
                    </Heading>
                </RadSentrertVertikalt>
                {behandlingErRedigerbar && (
                    <div>
                        <Button
                            variant={'tertiary'}
                            icon={<PencilIcon fontSize="1.5rem" />}
                            onClick={() => settRedigeringsmodus(Redigeringsmodus.REDIGERING)}
                        >
                            <span>Rediger</span>
                        </Button>
                        <SøppelbøtteKnapp onClick={nullstillVurderinger} size={'medium'}>
                            Slett
                        </SøppelbøtteKnapp>
                    </div>
                )}
            </div>
            <div className={styles.sporsmalContainer}>
                Sist endret - {formaterIsoDatoTid(vurderinger.endretTid)}
                <ul className={styles.svarElement}>
                    <li className={styles.sporsmal}>Vedtak som er påklaget</li>
                    <li className={styles.svar}>
                        {gjeldendeFagsystemVedtak ? (
                            <div>
                                <div>{gjeldendeFagsystemVedtak.behandlingstype}</div>
                                <div>
                                    {gjeldendeFagsystemVedtak.resultat} -{' '}
                                    {vedtakstidspunktTilVisningstekst(gjeldendeFagsystemVedtak)}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div>{påklagetVedtakstypeTilTekst[påklagetVedtakstype]}</div>
                                <div>
                                    {harManuellVedtaksdato(påklagetVedtakstype)
                                        ? formaterNullableIsoDato(manuellVedtaksdato)
                                        : ''}
                                </div>
                            </div>
                        )}
                    </li>
                </ul>
                {!ikkePåklagetVedtak && (
                    <>
                        {radioKnapper.map((knapp: IFormalkrav, index) => (
                            <React.Fragment key={index}>
                                <ul className={styles.svarElement}>
                                    <li className={styles.sporsmal}>{knapp.spørsmål}</li>
                                    <li className={styles.svar}>
                                        {vilkårStatusTilTekst[knapp.svar]}
                                    </li>
                                </ul>
                                {skalViseKlagefristUnntak(knapp) && (
                                    <ul className={styles.svarElement}>
                                        <li className={styles.sporsmal}>
                                            Er unntak for klagefristen oppfylt?
                                        </li>
                                        <li className={styles.svar}>
                                            {
                                                formkravFristUnntakTilTekst[
                                                    vurderinger.klagefristOverholdtUnntak
                                                ]
                                            }
                                        </li>
                                    </ul>
                                )}
                            </React.Fragment>
                        ))}
                    </>
                )}
                {skalViseBegrunnelseOgBrevtekst && (
                    <>
                        <ul className={styles.svarElement}>
                            <li className={styles.sporsmal}>Begrunnelse (intern)</li>
                            <li className={styles.svar}>
                                <div className={styles.fritekstWrapper}>
                                    {vurderinger.saksbehandlerBegrunnelse}
                                </div>
                            </li>
                        </ul>
                        <ul className={styles.svarElement}>
                            <li className={styles.sporsmal}>Fritekst til brev</li>
                            <li className={styles.svar}>
                                <div className={styles.fritekstWrapper}>
                                    {vurderinger.brevtekst}
                                </div>
                            </li>
                        </ul>
                    </>
                )}
                {urlSuffiks && (
                    <Button
                        variant="primary"
                        size="medium"
                        onClick={() =>
                            navigate(`/klagebehandling/${vurderinger.behandlingId}/${urlSuffiks}`)
                        }
                        className={styles.lagreKnapp}
                    >
                        Fortsett
                    </Button>
                )}
            </div>
            {manglerUtfylling && (
                <Alert variant={'error'} className={styles.alert}>
                    <Label>Følgende vilkår er ikke utfylt:</Label>
                    <ul>
                        {!påKlagetVedtakErValgt && <li>Ikke valgt påklaget vedtak</li>}
                        {!ikkePåklagetVedtak && (
                            <>
                                {ikkeUtfylteVilkår.map((vilkår) => {
                                    return (
                                        <li key={vilkår.type}>
                                            <BodyShort>{vilkår.spørsmål}</BodyShort>
                                        </li>
                                    );
                                })}
                                {!unntakFormalkravTattStillingTil && (
                                    <li>
                                        <BodyShort key="unntakFrist">
                                            Unntak for ikke overholdt frist ikke utfylt
                                        </BodyShort>
                                    </li>
                                )}
                            </>
                        )}
                        {!harBegrunnelse && <li>Begrunnelse er ikke utfylt</li>}
                        {!harBrevtekst && <li>Fritekst til brev er ikke utfylt</li>}
                    </ul>
                </Alert>
            )}
        </div>
    );
};
