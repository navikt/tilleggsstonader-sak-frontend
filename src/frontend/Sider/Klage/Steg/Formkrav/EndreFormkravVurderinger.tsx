import React, { Dispatch, SetStateAction, useState } from 'react';

import styled from 'styled-components';

import {
    Alert,
    BodyLong,
    Button,
    HelpText,
    Label,
    Radio,
    RadioGroup,
    Textarea,
} from '@navikt/ds-react';

import KlagefristUnntak from './KlagefristUnntak';
import {
    EFormalKravType,
    IFormalkrav,
    IFormkravVilkår,
    Redigeringsmodus,
    VilkårStatus,
} from './typer';
import {
    evaluerOmFelterSkalTilbakestilles,
    skalViseKlagefristUnntak,
    utledRadioKnapper,
} from './utils';
import {
    alleVilkårOppfylt,
    alleVilkårTattStillingTil,
    påKlagetVedtakValgt,
} from './validerFormkravUtils';
import { VedtakSelect } from './VedtakSelect';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../../typer/ressurs';
import { useKlageApp } from '../../context/KlageAppContext';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import { FagsystemVedtak } from '../../typer/fagsystemVedtak';
import { PåklagetVedtakstype } from '../../typer/klagebehandling/påklagetVedtakstype';

const RadioGrupperContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const RadioGruppe = styled(RadioGroup)`
    margin-bottom: 1rem;
`;

const RadioButton = styled(Radio)`
    margin: -0.6rem -0.6rem -0.6rem 0rem;
`;

const LagreKnapp = styled(Button)`
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
`;

const AlertStripe = styled(Alert)`
    margin-top: 0.5rem;
`;

const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
`;

const HjelpeTekst = styled(HelpText)`
    margin-left: 0.5rem;
`;

const HelpTextContainer = styled.div`
    max-width: 35rem;
`;

const VedtakSelectContainer = styled.div`
    margin-bottom: 1rem;
`;

const FritekstFelt = styled(Textarea)`
    margin-top: 1rem;
`;

interface IProps {
    fagsystemVedtak: FagsystemVedtak[];
    feilmelding: string;
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    vurderinger: IFormkravVilkår;
}

export const EndreFormkravVurderinger: React.FC<IProps> = ({
    fagsystemVedtak,
    feilmelding,
    lagreVurderinger,
    settOppdaterteVurderinger,
    settRedigeringsmodus,
    vurderinger,
}) => {
    const { hentBehandling, hentBehandlingshistorikk } = useKlagebehandling();
    const { settIkkePersistertKomponent, nullstillIkkePersistertKomponent } = useKlageApp();

    const [oppdatererVurderinger, settOppdatererVurderinger] = useState<boolean>(false);

    const alleVilkårErOppfylt = alleVilkårOppfylt(vurderinger);
    const alleVilkårUtfylt = alleVilkårTattStillingTil(vurderinger);

    const submitOppdaterteVurderinger = () => {
        if (oppdatererVurderinger) {
            return;
        }
        settOppdatererVurderinger(true);

        const vurderingerSomSkalLagres = evaluerOmFelterSkalTilbakestilles(vurderinger);

        lagreVurderinger(vurderingerSomSkalLagres).then((res: Ressurs<IFormkravVilkår>) => {
            settOppdatererVurderinger(false);
            if (res.status === RessursStatus.SUKSESS) {
                settOppdaterteVurderinger(vurderingerSomSkalLagres);
                nullstillIkkePersistertKomponent('formkravVilkår');
                settRedigeringsmodus(Redigeringsmodus.VISNING);
                hentBehandling.rerun();
                hentBehandlingshistorikk.rerun();
            }
        });
    };

    const radioKnapper = utledRadioKnapper(vurderinger);

    const skalViseHjelpetekst = (type: EFormalKravType) => {
        return type != EFormalKravType.KLAGEFRIST_OVERHOLDT;
    };

    const skalViseBegrunnelseOgBrevtekst =
        (!alleVilkårErOppfylt && alleVilkårUtfylt) ||
        vurderinger.påklagetVedtak.påklagetVedtakstype === PåklagetVedtakstype.UTEN_VEDTAK;

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                submitOppdaterteVurderinger();
            }}
        >
            <VedtakSelectContainer>
                <VedtakSelect
                    settOppdaterteVurderinger={settOppdaterteVurderinger}
                    vedtak={fagsystemVedtak}
                    vurderinger={vurderinger}
                />
            </VedtakSelectContainer>
            {påKlagetVedtakValgt(vurderinger) && (
                <>
                    {vurderinger.påklagetVedtak.påklagetVedtakstype !==
                        PåklagetVedtakstype.UTEN_VEDTAK && (
                        <RadioGrupperContainer>
                            {radioKnapper.map((item: IFormalkrav, index) => (
                                <React.Fragment key={index}>
                                    <FlexRow>
                                        <RadioGruppe
                                            legend={item.spørsmål}
                                            size="medium"
                                            onChange={(val: VilkårStatus) => {
                                                settOppdaterteVurderinger(
                                                    (prevState: IFormkravVilkår) => {
                                                        return {
                                                            ...prevState,
                                                            [item.navn]: val,
                                                        } as IFormkravVilkår;
                                                    }
                                                );
                                                settIkkePersistertKomponent('formkravVilkår');
                                            }}
                                            value={item.svar}
                                            key={index}
                                        >
                                            <RadioButton value={VilkårStatus.OPPFYLT}>
                                                Ja
                                            </RadioButton>
                                            <RadioButton value={VilkårStatus.IKKE_OPPFYLT}>
                                                Nei
                                            </RadioButton>
                                        </RadioGruppe>

                                        {skalViseHjelpetekst(item.type) && (
                                            <HelpTextContainer>
                                                <HjelpeTekst>
                                                    <HelpTextInnhold formkrav={item.type} />
                                                </HjelpeTekst>
                                            </HelpTextContainer>
                                        )}
                                    </FlexRow>
                                    {skalViseKlagefristUnntak(item) && (
                                        <KlagefristUnntak
                                            settOppdaterteVurderinger={settOppdaterteVurderinger}
                                            unntakVurdering={vurderinger.klagefristOverholdtUnntak}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </RadioGrupperContainer>
                    )}
                    {skalViseBegrunnelseOgBrevtekst && (
                        <>
                            <Textarea
                                label={'Begrunnelse (intern)'}
                                value={vurderinger.saksbehandlerBegrunnelse}
                                onChange={(e) => {
                                    settIkkePersistertKomponent('formkravVilkår');
                                    settOppdaterteVurderinger((prevState: IFormkravVilkår) => {
                                        return {
                                            ...prevState,
                                            saksbehandlerBegrunnelse: e.target.value,
                                        };
                                    });
                                }}
                            />
                            <FritekstFelt
                                label={
                                    <FlexRow>
                                        <Label>Fritekst til brev</Label>
                                        <HjelpeTekst>
                                            Ut ifra hvilke(t) formkrav som ikke er oppfylt, vil det
                                            automatisk vises en generell tekst i brevet med årsak
                                            til avvisning. I dette fritekstfeltet skrives en mer
                                            detaljert begrunnelse. Hvis klagen skal avvises fordi
                                            det er klaget for sent, så kan teksten for eksempel
                                            inneholde datoen for når vedtaket ble gjort og datoen
                                            for når bruker fremsatte klage.
                                        </HjelpeTekst>
                                    </FlexRow>
                                }
                                value={vurderinger.brevtekst}
                                onChange={(e) => {
                                    settIkkePersistertKomponent('formkravVilkår');
                                    settOppdaterteVurderinger((prevState: IFormkravVilkår) => {
                                        return {
                                            ...prevState,
                                            brevtekst: e.target.value,
                                        };
                                    });
                                }}
                            />
                        </>
                    )}
                </>
            )}
            {feilmelding && (
                <AlertStripe variant={'error'} size={'medium'}>
                    {feilmelding}
                </AlertStripe>
            )}
            <LagreKnapp htmltype="submit" variant="primary" size="medium">
                Lagre
            </LagreKnapp>
        </form>
    );
};

const HelpTextInnhold: React.FC<{ formkrav: EFormalKravType }> = ({ formkrav }) => {
    switch (formkrav) {
        case EFormalKravType.KLAGE_SIGNERT:
            return (
                <>
                    <BodyLong spacing>
                        Klagen skal som hovedregel være skriftlig og underskrevet av klageren, eller
                        av klagers fullmektig.
                    </BodyLong>
                    <BodyLong>
                        Klager som er sendt inn via tjenester som krever personlig innlogging, for
                        eksempel gjennom digitalt klageskjema eller Ditt NAV, har godkjent digital
                        signatur. Hvis klagen er sendt inn per post, må den være signert av klager
                        eller dens fullmektig. Hvis klagen mangler signatur, må vi innhente dette
                        før klagen kan behandles.
                    </BodyLong>
                </>
            );
        case EFormalKravType.KLAGEFRIST_OVERHOLDT:
            return (
                <>
                    <BodyLong spacing>
                        Selv om fristen for innsendelse av klage har blitt overskredet, kan klagen
                        tas til behandling dersom et av følgende kriterier er oppfylt:
                    </BodyLong>
                    <BodyLong spacing>
                        <strong>a)</strong> Parten eller hans fullmektig ikke kan lastes for å ha
                        oversittet fristen eller for å ha drøyd med å klage etterpå
                    </BodyLong>
                    <BodyLong spacing>
                        <strong>b)</strong> Det av særlige grunner er rimelig at klagen blir prøvd
                    </BodyLong>
                    <BodyLong>
                        Dersom klagen tas til behandling som følge av et slikt unntak, vennligst
                        beskriv dette i fritekstfeltet.
                    </BodyLong>
                </>
            );
        case EFormalKravType.KLAGER_ER_PART:
            return (
                <>
                    <BodyLong spacing>
                        Parten er den som vedtaket retter seg mot, eller den som saken gjelder.
                    </BodyLong>
                    <BodyLong spacing>
                        Parten har rett til å få bistand fra en advokat, verge eller annen
                        fullmektig. Fullmektig som ikke er advokat, må som hovedregel legge frem en
                        skriftlig fullmakt.
                    </BodyLong>
                    <BodyLong>
                        Hvis det ikke foreligger fullmakt, må fullmakt innhentes før klagen kan
                        behandles.
                    </BodyLong>
                </>
            );
        case EFormalKravType.KLAGES_PÅ_KONKRET_ELEMENT_I_VEDTAK:
            return (
                <>
                    <BodyLong spacing>
                        I klagen må det stå hvilket vedtak det klages på, og hvorfor klager er uenig
                        i vedtaket.
                    </BodyLong>
                    <BodyLong>
                        Hvis klagen ikke inneholder konkrete opplysninger, som for eksempel «Jeg er
                        uenig i vedtaket» eller «Jeg klager på vedtaket», må vi gå i dialog med
                        klager for å få vite hva klagen gjelder før saken kan behandles.
                    </BodyLong>
                </>
            );
    }
};
