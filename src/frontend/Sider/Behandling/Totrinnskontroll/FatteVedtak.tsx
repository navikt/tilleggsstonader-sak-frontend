import * as React from 'react';
import { FormEvent, useState } from 'react';

import styled from 'styled-components';

import {
    Alert,
    BodyShort,
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    Radio,
    RadioGroup,
    Textarea,
} from '@navikt/ds-react';

import { TotrinnskontrollResponse, ÅrsakUnderkjent, årsakUnderkjentTilTekst } from './typer';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useNavigateUtenSjekkForUlagredeKomponenter } from '../../../hooks/useNavigateUtenSjekkForUlagredeKomponenter';
import { UlagretKomponent } from '../../../hooks/useUlagredeKomponenter';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { Toast } from '../../../typer/toast';

const WrapperMedMargin = styled.div`
    display: block;
    margin: 0.5rem 0;
`;

const SubmitButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;
`;

const TittelContainer = styled.div`
    margin: 0.5rem 0;
`;

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
    settVisGodkjentModal: (vis: boolean) => void;
    settTotrinnskontroll: React.Dispatch<React.SetStateAction<Ressurs<TotrinnskontrollResponse>>>;
}> = ({ settVisGodkjentModal, settTotrinnskontroll }) => {
    const { request, settToast, settUlagretKomponent, nullstillUlagredeKomponenter } = useApp();
    const navigate = useNavigateUtenSjekkForUlagredeKomponenter();
    const { behandling, hentBehandling } = useBehandling();

    const [resultat, settResultat] = useState<Totrinnsresultat>(Totrinnsresultat.IKKE_VALGT);
    const [årsakerUnderkjent, settÅrsakerUnderkjent] = useState<ÅrsakUnderkjent[]>([]);
    const [begrunnelse, settBegrunnelse] = useState<string>();
    const [feil, settFeil] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);

    const erUtfylt =
        resultat === Totrinnsresultat.GODKJENT ||
        (resultat === Totrinnsresultat.UNDERKJENT && begrunnelse && årsakerUnderkjent.length > 0);

    const beslutteVedtak = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        settLaster(true);
        if (!erUtfylt) {
            return;
        }
        settFeil(undefined);
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
                    settFeil(response.frontendFeilmelding);
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
            <TittelContainer>
                <Heading size={'small'} level={'3'}>
                    Totrinnskontroll
                </Heading>
            </TittelContainer>
            <BodyShort size={'small'}>
                Kontroller opplysninger og faglige vurderinger gjort under behandlingen
            </BodyShort>
            <WrapperMedMargin>
                <RadioGroup
                    legend={'Beslutt vedtak'}
                    value={resultat}
                    hideLegend
                    onChange={oppdaterResultat}
                >
                    <Radio value={Totrinnsresultat.GODKJENT}>Godkjenn</Radio>
                    <Radio value={Totrinnsresultat.UNDERKJENT}>Underkjenn</Radio>
                </RadioGroup>
            </WrapperMedMargin>
            {resultat === Totrinnsresultat.UNDERKJENT && (
                <>
                    <WrapperMedMargin>
                        <CheckboxGroup
                            legend={'Årsak til underkjennelse'}
                            description={'Manglende eller feil opplysninger om:'}
                            value={årsakerUnderkjent}
                            onChange={(årsaker) => {
                                settÅrsakerUnderkjent(årsaker);
                                settUlagretKomponent(UlagretKomponent.FATTE_VEDTAK);
                            }}
                        >
                            {Object.values(ÅrsakUnderkjent).map((årsak) => (
                                <Checkbox key={årsak} value={årsak}>
                                    {årsakUnderkjentTilTekst[årsak]}
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
                    </WrapperMedMargin>
                    <Textarea
                        value={begrunnelse || ''}
                        maxLength={0}
                        onChange={(e) => {
                            settBegrunnelse(e.target.value);
                            settUlagretKomponent(UlagretKomponent.FATTE_VEDTAK);
                        }}
                        label={'Begrunnelse'}
                    />
                </>
            )}
            {erUtfylt && (
                <SubmitButtonWrapper>
                    <Button type="submit" disabled={laster}>
                        Fullfør
                    </Button>
                </SubmitButtonWrapper>
            )}
            {feil && <Alert variant={'error'}>{feil}</Alert>}
        </form>
    );
};

export default FatteVedtak;
