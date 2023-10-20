import React from 'react';

import styled from 'styled-components';

import { Heading, Label } from '@navikt/ds-react';

import { useBehandling } from '../../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import DateInput from '../../../../../../komponenter/Skjema/DateInput';
import TextField from '../../../../../../komponenter/Skjema/TextField';
import { Utgift, UtgifterProperty } from '../../../../../../typer/vedtak';
import { harTallverdi, tilTallverdi } from '../../../../../../utils/tall';
import { Barn } from '../../../../vilkår';

const Grid = styled.div<{ $lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-gap: 0.5rem 1rem;
    align-items: start;
`;

interface Props {
    // begrunnelseState: FieldState;
    errorState: FormErrors<Utgift[]>;
    utgifter: Utgift[];
    barn: Barn;
    oppdaterUtgift: (utgiftIndeks: number, utgift: Utgift) => void;
    // oppdaterUtgifter: (utgifter: Utgift[]) => void;
    // settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    // barn: IBarnMedSamvær[];
    // låsFraDatoFørsteRad: boolean;
}

const UtgifterValg: React.FC<Props> = ({ utgifter, barn, errorState, oppdaterUtgift }) => {
    // begrunnelseState,
    // errorState,
    // settValideringsFeil,
    // barn,
    // låsFraDatoFørsteRad,
    const { behandlingErRedigerbar } = useBehandling();
    // const { settIkkePersistertKomponent } = useApp();
    // const [sanksjonsmodal, settSanksjonsmodal] = useState<Sanksjonsmodal>({
    //     visModal: false,
    // });

    const oppdaterUtgiftFelt = (
        indeks: number,
        property: UtgifterProperty,
        value: string | number | undefined
    ) => {
        oppdaterUtgift(indeks, {
            ...utgifter[indeks],
            [property]: value,
        });
    };

    // Oppdater for riktig rad
    // Returner hele utgift objekt?

    // const leggTilTomRadUnder = () => {
    //     // const
    //     if (utgifter) oppdaterUtgifter([...utgifter, { fra: '', til: '' }]);
    //     else oppdaterUtgifter([{ fra: '', til: '' }]);
    // };

    // const periodeVariantTilUtgiftsperiodeProperty = (
    //     periodeVariant: PeriodeVariant
    // ): EUtgiftsperiodeProperty => {
    //     switch (periodeVariant) {
    //         case PeriodeVariant.ÅR_MÅNED_FRA:
    //             return EUtgiftsperiodeProperty.årMånedFra;
    //         case PeriodeVariant.ÅR_MÅNED_TIL:
    //             return EUtgiftsperiodeProperty.årMånedTil;
    //     }
    // };

    // const lukkSanksjonsmodal = () => {
    //     settSanksjonsmodal({ visModal: false });
    // };

    // const slettPeriode = (indeks: number) => {
    //     if (sanksjonsmodal.visModal) {
    //         lukkSanksjonsmodal();
    //     }
    //     utgiftsperioderState.remove(indeks);
    //     settValideringsFeil((prevState: FormErrors<InnvilgeVedtakForm>) => {
    //         const utgiftsperioder = (prevState.utgiftsperioder ?? []).filter((_, i) => i !== indeks);
    //         return { ...prevState, utgiftsperioder };
    //     });
    // };

    // const slettPeriodeModalHvisSanksjon = (indeks: number) => {
    //     const periode = utgiftsperioderState.value[indeks];
    //     if (periode.periodetype === EUtgiftsperiodetype.SANKSJON_1_MND) {
    //         settSanksjonsmodal({
    //             visModal: true,
    //             indeks: indeks,
    //             årMånedFra: periode.årMånedFra,
    //         });
    //     } else {
    //         slettPeriode(indeks);
    //     }
    // };
    return (
        <>
            <Heading spacing size="xsmall" level="5">
                {barn.registergrunnlag.navn}
            </Heading>
            {utgifter && utgifter.length > 0 && (
                <Grid $lesevisning={!behandlingErRedigerbar}>
                    <Label>Månedlig utgift</Label>
                    <Label>Fra</Label>
                    <Label>Til</Label>

                    {utgifter.map((utgiftsperiode, indeks) => (
                        // TODO: Skal ikke bruke indeks som key
                        <React.Fragment key={indeks}>
                            <TextField
                                erLesevisning={!behandlingErRedigerbar}
                                label="Utgifter"
                                hideLabel
                                value={
                                    harTallverdi(utgiftsperiode.utgift) ? utgiftsperiode.utgift : ''
                                }
                                onChange={(e) =>
                                    oppdaterUtgiftFelt(
                                        indeks,
                                        UtgifterProperty.utgift,
                                        tilTallverdi(e.target.value)
                                    )
                                }
                                error={errorState && errorState[indeks]?.utgift}
                                size="small"
                            />
                            <DateInput
                                label="Fra"
                                hideLabel
                                erLesevisning={!behandlingErRedigerbar}
                                value={utgiftsperiode.fra}
                                onChange={(dato?: string) =>
                                    oppdaterUtgiftFelt(indeks, UtgifterProperty.fra, dato)
                                }
                                feil={errorState && errorState[indeks]?.fra}
                                size="small"
                            />
                            <DateInput
                                label="Til"
                                hideLabel
                                erLesevisning={!behandlingErRedigerbar}
                                value={utgiftsperiode.til}
                                onChange={(dato?: string) =>
                                    oppdaterUtgiftFelt(indeks, UtgifterProperty.til, dato)
                                }
                                feil={errorState && errorState[indeks]?.til}
                                size="small"
                            />
                        </React.Fragment>
                    ))}
                </Grid>
            )}
        </>
        // {/* <Button onClick={leggTilTomRadUnder}>Legg til utgift</Button> */}
    );
};

export default UtgifterValg;
