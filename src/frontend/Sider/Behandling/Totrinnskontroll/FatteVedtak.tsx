import * as React from 'react';
import { FormEvent, useState } from 'react';

import { useNavigate } from 'react-router-dom';
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

import { ÅrsakUnderkjent, årsakUnderkjentTilTekst } from './typer';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { RessursStatus } from '../../../typer/ressurs';

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
}> = ({ settVisGodkjentModal }) => {
    const { request } = useApp();
    const navigate = useNavigate();
    const { behandling } = useBehandling();

    const [godkjent, settGodkjent] = useState<Totrinnsresultat>(Totrinnsresultat.IKKE_VALGT);
    const [årsakerUnderkjent, settÅrsakerUnderkjent] = useState<ÅrsakUnderkjent[]>([]);
    const [begrunnelse, settBegrunnelse] = useState<string>();
    const [feil, settFeil] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);

    const erUtfylt =
        godkjent === Totrinnsresultat.GODKJENT ||
        (godkjent === Totrinnsresultat.UNDERKJENT &&
            (begrunnelse || '').length > 0 &&
            årsakerUnderkjent.length > 0);

    const beslutteVedtak = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        settLaster(true);
        if (!erUtfylt) {
            return;
        }
        settFeil(undefined);
        request<never, TotrinnskontrollForm>(
            `/api/sak/vedtak/${behandling.id}/beslutte-vedtak`,
            'POST',
            {
                godkjent: godkjent === Totrinnsresultat.GODKJENT,
                begrunnelse,
                årsakerUnderkjent,
            }
        )
            .then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    if (godkjent === Totrinnsresultat.GODKJENT) {
                        //hentBehandlingshistorikk.rerun();
                        //hentTotrinnskontroll.rerun();
                        settVisGodkjentModal(true);
                    } else {
                        //settToast(EToast.VEDTAK_UNDERKJENT);
                        navigate('/oppgavebenk');
                    }
                } else {
                    settFeil(response.frontendFeilmeldingUtenFeilkode);
                }
            })
            .finally(() => settLaster(false));
    };

    const oppdaterResultat = (resultat: Totrinnsresultat) => {
        settGodkjent(resultat);
        settBegrunnelse(undefined);
        if (resultat === Totrinnsresultat.GODKJENT) {
            settÅrsakerUnderkjent([]);
        }
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
                    value={godkjent}
                    hideLegend
                    onChange={oppdaterResultat}
                >
                    <Radio value={Totrinnsresultat.GODKJENT}>Godkjenn</Radio>
                    <Radio value={Totrinnsresultat.UNDERKJENT}>Underkjenn</Radio>
                </RadioGroup>
            </WrapperMedMargin>
            {godkjent === Totrinnsresultat.UNDERKJENT && (
                <>
                    <WrapperMedMargin>
                        <CheckboxGroup
                            legend={'Årsak til underkjennelse'}
                            description={'Manglende eller feil opplysninger om:'}
                            value={årsakerUnderkjent}
                            onChange={settÅrsakerUnderkjent}
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
            {/* TODO AlertStripeFeilPreWrap */}
            {feil && <Alert variant={'error'}>{feil}</Alert>}
        </form>
    );
};

export default FatteVedtak;
