import React from 'react';

import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { useHentTypeAktivitetValg } from '../../../../../hooks/useHentTypeAktivitetValg';
import DataViewer from '../../../../../komponenter/DataViewer';
import SelectMedOptions from '../../../../../komponenter/Skjema/SelectMedOptions';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Kodeverk, kodeverkTilOptions, optionTilKodeverk } from '../../../../../typer/kodeverk';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';

interface Props {
    vedtaksperiode: Vedtaksperiode;
    erLesevisning: boolean;
    vedtaksperiodeFeil: FormErrors<Vedtaksperiode> | undefined;
    oppdaterPeriode: (property: 'typeAktivitet', value: Kodeverk | undefined) => void;
}

export const VelgTiltaksvariant: React.FC<Props> = ({
    vedtaksperiode,
    erLesevisning,
    vedtaksperiodeFeil,
    oppdaterPeriode,
}) => {
    const { typeAktivitetValg } = useHentTypeAktivitetValg();

    return (
        <DataViewer response={{ typeAktivitetValg }} type={'typeAktivitetValg'}>
            {({ typeAktivitetValg }) => (
                <FeilmeldingMaksBredde>
                    <SelectMedOptions
                        label={'Tiltaksvariant'}
                        hideLabel
                        erLesevisning={erLesevisning}
                        value={
                            erLesevisning
                                ? vedtaksperiode?.typeAktivitet?.beskrivelse
                                : vedtaksperiode?.typeAktivitet?.kode
                        }
                        onChange={(e) =>
                            oppdaterPeriode(
                                'typeAktivitet',
                                optionTilKodeverk(typeAktivitetValg, e.target.value)
                            )
                        }
                        valg={kodeverkTilOptions(typeAktivitetValg)}
                        size={'small'}
                        error={vedtaksperiodeFeil?.typeAktivitet?.beskrivelse}
                    />
                </FeilmeldingMaksBredde>
            )}
        </DataViewer>
    );
};
