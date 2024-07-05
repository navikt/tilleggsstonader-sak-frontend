import React, { Dispatch, SetStateAction } from 'react';
import { Radio, RadioGroup } from '@navikt/ds-react';
import { FormkravFristUnntak, formkravFristUnntakTilTekst, IFormkravVilkår } from './typer';
import { useKlageApp } from '../../../App/context/KlageAppContext';

interface IProps {
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    unntakVurdering?: FormkravFristUnntak;
}

const EndreFormkravVurderinger: React.FC<IProps> = ({
    settOppdaterteVurderinger,
    unntakVurdering,
}) => {
    const { settIkkePersistertKomponent } = useKlageApp();

    const håndterEndring = (val: FormkravFristUnntak) => {
        settIkkePersistertKomponent('formkravVilkår');
        settOppdaterteVurderinger((prevState: IFormkravVilkår) => {
            return { ...prevState, klagefristOverholdtUnntak: val };
        });
    };

    return (
        <RadioGroup
            legend={'Er unntak for klagefristen oppfylt?'}
            size="medium"
            onChange={(val: FormkravFristUnntak) => håndterEndring(val)}
            value={unntakVurdering}
        >
            <Radio value={FormkravFristUnntak.UNNTAK_KAN_IKKE_LASTES}>
                {formkravFristUnntakTilTekst[FormkravFristUnntak.UNNTAK_KAN_IKKE_LASTES]}
            </Radio>
            <Radio value={FormkravFristUnntak.UNNTAK_SÆRLIG_GRUNN}>
                {formkravFristUnntakTilTekst[FormkravFristUnntak.UNNTAK_SÆRLIG_GRUNN]}
            </Radio>
            <Radio value={FormkravFristUnntak.IKKE_UNNTAK}>
                {formkravFristUnntakTilTekst[FormkravFristUnntak.IKKE_UNNTAK]}
            </Radio>
        </RadioGroup>
    );
};

export default EndreFormkravVurderinger;
