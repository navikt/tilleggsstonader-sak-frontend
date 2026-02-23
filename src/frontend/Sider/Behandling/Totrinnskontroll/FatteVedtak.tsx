import * as React from 'react';
import { FormEvent, useState } from 'react';

import {
    BodyShort,
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    Radio,
    RadioGroup,
    Textarea,
    VStack,
} from '@navikt/ds-react';

import styles from './FatteVedtak.module.css';
import {
    TotrinnskontrollOpprettet,
    TotrinnskontrollResponse,
    ÅrsakUnderkjent,
    årsakUnderkjentTilTekst,
} from './typer';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useNavigateUtenSjekkForUlagredeKomponenter } from '../../../hooks/useNavigateUtenSjekkForUlagredeKomponenter';
import { UlagretKomponent } from '../../../hooks/useUlagredeKomponenter';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { Feil, feiletRessursTilFeilmelding } from '../../../komponenter/Feil/feilmeldingUtils';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { Toast } from '../../../typer/toast';

interface TotrinnskontrollForm {
    godkjent: boolean;
    begrunnelse?: string;
    årsakerUnderkjent: ÅrsakUnderkjent[];
}

enum Totrinnsresultat {
    IKKE_VALGT = 'IKKE_VALGT',
    GODKJENT = 'GODKJENT',
    UNDERKJENT = 'UNDERKJENT',
}

const FatteVedtak: React.FC<{
    totrinnskontroll: TotrinnskontrollOpprettet;
    settVisGodkjentModal: (vis: boolean) => void;
    settTotrinnskontroll: React.Dispatch<React.SetStateAction<Ressurs<TotrinnskontrollResponse>>>;
}> = ({ totrinnskontroll, settVisGodkjentModal, settTotrinnskontroll }) => {
    const { request, settToast, settUlagretKomponent, nullstillUlagredeKomponenter } = useApp();
    const navigate = useNavigateUtenSjekkForUlagredeKomponenter();
    const { behandling, hentBehandling } = useBehandling();

    const [resultat, settResultat] = useState<Totrinnsresultat>(Totrinnsresultat.IKKE_VALGT);
    const [årsakerUnderkjent, settÅrsakerUnderkjent] = useState<ÅrsakUnderkjent[]>([]);
    const [begrunnelse, settBegrunnelse] = useState<string>();
    const [feil, settFeil] = useState<Feil>();
    const [feilÅrsak, settFeilÅrsak] = useState<string>();
    const [feilBegrunnelse, settFeilBegrunnelse] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);

    const erUtfylt =
        resultat === Totrinnsresultat.GODKJENT || resultat === Totrinnsresultat.UNDERKJENT;

    const validerSkjema = (): boolean => {
        let gyldig = true;

        if (resultat === Totrinnsresultat.UNDERKJENT) {
            if (!begrunnelse?.trim()) {
                settFeilBegrunnelse('Mangler begrunnelse for underkjennelse');
                gyldig = false;
            } else {
                settFeilBegrunnelse(undefined);
            }

            if (årsakerUnderkjent.length === 0) {
                settFeilÅrsak('Mangler årsak for underkjennelse');
                gyldig = false;
            } else {
                settFeilÅrsak(undefined);
            }
        } else {
            settFeilBegrunnelse(undefined);
            settFeilÅrsak(undefined);
        }

        return gyldig;
    };

    const beslutteVedtak = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        settLaster(true);

        if (!validerSkjema()) {
            settLaster(false);
            return;
        }
        request<TotrinnskontrollResponse, TotrinnskontrollForm>(
            `/api/sak/totrinnskontroll/${behandling.id}/beslutte-vedtak`,
            'POST',
            {
                godkjent: resultat === Totrinnsresultat.GODKJENT,
                begrunnelse,
                årsakerUnderkjent,
            }
        )
            .then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    if (resultat === Totrinnsresultat.GODKJENT) {
                        hentBehandling.rerun();
                        settTotrinnskontroll(response);
                        //hentBehandlingshistorikk.rerun();
                        nullstillUlagredeKomponenter();
                        settVisGodkjentModal(true);
                    } else {
                        settToast(Toast.VEDTAK_UNDERKJENT);
                        navigate('/');
                    }
                } else {
                    settFeil(feiletRessursTilFeilmelding(response));
                }
            })
            .finally(() => settLaster(false));
    };

    const oppdaterResultat = (resultat: Totrinnsresultat) => {
        settResultat(resultat);
        settBegrunnelse(undefined);
        if (resultat === Totrinnsresultat.GODKJENT) {
            settÅrsakerUnderkjent([]);
        }
        settUlagretKomponent(UlagretKomponent.FATTE_VEDTAK);
    };

    return (
        <form onSubmit={beslutteVedtak}>
            <VStack gap="space-16">
                <Heading size={'small'} level={'3'}>
                    Totrinnskontroll
                </Heading>
                {totrinnskontroll.begrunnelse && (
                    <BodyShort size={'small'}>
                        <b>Kommentar fra saksbehandler: </b> <br />
                        {totrinnskontroll.begrunnelse}
                    </BodyShort>
                )}
                <RadioGroup
                    legend="Din vurdering"
                    value={resultat}
                    onChange={oppdaterResultat}
                    size="small"
                >
                    <Radio value={Totrinnsresultat.GODKJENT}>Godkjenn</Radio>
                    <Radio value={Totrinnsresultat.UNDERKJENT}>Underkjenn</Radio>
                </RadioGroup>
                {resultat === Totrinnsresultat.UNDERKJENT && (
                    <>
                        <CheckboxGroup
                            legend={'Årsak til underkjennelse'}
                            description={'Manglende eller feil opplysninger om:'}
                            value={årsakerUnderkjent}
                            error={feilÅrsak}
                            onChange={(årsaker) => {
                                settÅrsakerUnderkjent(årsaker);
                                if (resultat === Totrinnsresultat.UNDERKJENT && årsaker.length > 0)
                                    settFeilÅrsak(undefined);
                                settUlagretKomponent(UlagretKomponent.FATTE_VEDTAK);
                            }}
                            size="small"
                        >
                            {Object.values(ÅrsakUnderkjent).map((årsak) => (
                                <Checkbox key={årsak} value={årsak}>
                                    {årsakUnderkjentTilTekst[årsak]}
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
                        <Textarea
                            value={begrunnelse || ''}
                            maxLength={0}
                            error={feilBegrunnelse}
                            onChange={(e) => {
                                settBegrunnelse(e.target.value);
                                if (resultat === Totrinnsresultat.UNDERKJENT && begrunnelse)
                                    settFeilBegrunnelse(undefined);
                                settUlagretKomponent(UlagretKomponent.FATTE_VEDTAK);
                            }}
                            label="Begrunnelse"
                            size="small"
                        />
                    </>
                )}
                {erUtfylt && (
                    <div className={styles.submitButtonWrapper}>
                        <Button type="submit" disabled={laster} size="small">
                            Fullfør
                        </Button>
                    </div>
                )}
                <Feilmelding feil={feil} />
            </VStack>
        </form>
    );
};

export default FatteVedtak;
