import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import { SealCheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Label, VStack } from '@navikt/ds-react';

import Aksjonsknapper from './Aksjonsknapper';
import { LesMerStønadsperioder } from './LesMerStønadsperioder';
import StønadsperiodeRad from './StønadsperiodeRad';
import { finnStønadsperiodeIListe } from './utils';
import { validerStønadsperioder } from './validering';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import useFormState, { FormErrors, FormState } from '../../../../hooks/felles/useFormState';
import { ListState } from '../../../../hooks/felles/useListState';
import { UlagretKomponent } from '../../../../hooks/useUlagredeKomponenter';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { feiletRessursTilFeilmelding } from '../../../../komponenter/Feil/feilmeldingUtils';
import Panel from '../../../../komponenter/Panel/Panel';
import { RessursStatus } from '../../../../typer/ressurs';
import { Stønadsperiode } from '../typer/stønadsperiode';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, max-content);
    grid-row-gap: 0.5rem;
    grid-column-gap: 1.5rem;
    align-items: start;

    .kolonne1 {
        grid-column: 1;
    }
`;

const AlertMedMaksbredde = styled(Alert)`
    max-width: 50rem;
`;

export type StønadsperiodeForm = {
    stønadsperioder: Stønadsperiode[];
};

const tomStønadsperiodeRad = (): Stønadsperiode => ({
    _ulagretId: uuid(),
    målgruppe: '',
    aktivitet: '',
    fom: '',
    tom: '',
});

const initFormState = (
    eksisterendeStønadsperioder: Stønadsperiode[]
): FormState<StønadsperiodeForm> => ({
    stønadsperioder: eksisterendeStønadsperioder,
});

const Stønadsperioder: React.FC = () => {
    const { request, settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const { stønadsperioder, oppdaterStønadsperioder, stønadsperiodeFeil, settStønadsperiodeFeil } =
        useInngangsvilkår();

    const [laster, settLaster] = useState<boolean>(false);
    const [redigerer, settRedigerer] = useState<boolean>(false);

    const [foreslåPeriodeFeil, settForeslåPeriodeFeil] = useState<string | undefined>();

    const validerForm = (formState: StønadsperiodeForm): FormErrors<StønadsperiodeForm> => {
        return {
            stønadsperioder: validerStønadsperioder(
                formState.stønadsperioder,
                stønadsperioder,
                behandling.revurderFra
            ),
        };
    };

    useEffect(() => {
        if (redigerer) {
            settUlagretKomponent(UlagretKomponent.STØNADSPERIODER);
        } else {
            nullstillUlagretKomponent(UlagretKomponent.STØNADSPERIODER);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redigerer]);

    const formState = useFormState<StønadsperiodeForm>(initFormState(stønadsperioder), validerForm);
    const stønadsperioderState = formState.getProps('stønadsperioder') as ListState<Stønadsperiode>;

    useEffect(() => {
        stønadsperioderState.setValue(stønadsperioder);
        formState.nullstillErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stønadsperioder]);

    const handleSubmit = (form: FormState<StønadsperiodeForm>) => {
        if (laster) return;
        settLaster(true);
        settStønadsperiodeFeil(undefined);
        return request<Stønadsperiode[], Stønadsperiode>(
            `/api/sak/stonadsperiode/${behandling.id}`,
            'POST',
            form.stønadsperioder
        )
            .then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settRedigerer(false);
                    oppdaterStønadsperioder(res.data);
                } else {
                    settStønadsperiodeFeil(
                        feiletRessursTilFeilmelding(res, 'Feilet legg til periode')
                    );
                }
            })
            .finally(() => settLaster(false));
    };

    const leggTilNyPeriode = () => {
        stønadsperioderState.setValue((prevState) => [...prevState, tomStønadsperiodeRad()]);
    };

    const leggTilForeslåttPeriode = () => {
        request<Stønadsperiode[], undefined>(
            `/api/sak/stonadsperiode/${behandling.id}/foresla`,
            'POST'
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                const perioder = res.data.map((periode) => ({
                    ...periode,
                    _ulagretId: uuid(),
                }));
                stønadsperioderState.setValue(perioder);
                resetForeslåPeriodeFeilmelding();
                settRedigerer(true);
            } else {
                settForeslåPeriodeFeil(res.frontendFeilmelding);
            }
        });
    };

    const resetForeslåPeriodeFeilmelding = () => {
        settForeslåPeriodeFeil(undefined);
    };

    const slettPeriode = (indeks: number) => {
        stønadsperioderState.remove(indeks);

        formState.setErrors((prevState: FormErrors<StønadsperiodeForm>) => ({
            ...prevState,
            stønadsperioder: (prevState.stønadsperioder ?? []).filter((_, i) => i !== indeks),
        }));
    };

    const oppdaterStønadsperiode = (
        indeks: number,
        property: keyof Stønadsperiode,
        value: string | undefined
    ) => {
        stønadsperioderState.update(
            {
                ...stønadsperioderState.value[indeks],
                [property]: value,
            },
            indeks
        );
    };

    const avbrytRedigering = () => {
        settRedigerer(false);
        stønadsperioderState.setValue(stønadsperioder);
        formState.nullstillErrors();
    };

    return (
        <Panel
            tittel="Perioder med overlapp mellom aktivitet og målgruppe"
            ikon={<SealCheckmarkIcon />}
        >
            {stønadsperioderState.value.length === 0 && !erStegRedigerbart && (
                <BodyShort>
                    Det ble ikke registrert noen overlappende perioder i denne behandlingen
                </BodyShort>
            )}
            <LesMerStønadsperioder stønadstype={behandling.stønadstype} />
            <form onSubmit={formState.onSubmit(handleSubmit)}>
                <VStack gap="4">
                    {stønadsperioderState.value.length !== 0 && (
                        <Grid>
                            <Label>Aktivitet</Label>
                            <Label>Målgruppe</Label>
                            <Label>Fra</Label>
                            <Label>Til</Label>

                            {stønadsperioderState.value.map((periode, indeks) => (
                                <StønadsperiodeRad
                                    key={periode.id || periode._ulagretId}
                                    stønadsperide={periode}
                                    lagrerStønadsperiode={finnStønadsperiodeIListe(
                                        periode,
                                        stønadsperioder
                                    )}
                                    oppdaterStønadsperiode={(
                                        property: keyof Stønadsperiode,
                                        value: string | undefined
                                    ) => oppdaterStønadsperiode(indeks, property, value)}
                                    slettPeriode={() => slettPeriode(indeks)}
                                    feilmeldinger={
                                        formState.errors.stønadsperioder &&
                                        formState.errors.stønadsperioder[indeks]
                                    }
                                    erLeservisning={!erStegRedigerbart || !redigerer}
                                />
                            ))}
                        </Grid>
                    )}

                    <Feilmelding feil={stønadsperiodeFeil} />

                    {erStegRedigerbart && (
                        <Aksjonsknapper
                            redigerer={redigerer}
                            finnesStønadsperioder={stønadsperioderState.value.length !== 0}
                            laster={laster}
                            avbrytRedigering={avbrytRedigering}
                            initierFormMedTomRad={leggTilNyPeriode}
                            startRedigering={() => settRedigerer(true)}
                            foreslåPerioder={leggTilForeslåttPeriode}
                            resetForeslåPeriodeFeilmelding={resetForeslåPeriodeFeilmelding}
                        />
                    )}
                    {foreslåPeriodeFeil && (
                        <AlertMedMaksbredde
                            variant="error"
                            title="Klarte ikke å preutfylle periode"
                        >
                            {foreslåPeriodeFeil}
                        </AlertMedMaksbredde>
                    )}
                </VStack>
            </form>
        </Panel>
    );
};

export default Stønadsperioder;
