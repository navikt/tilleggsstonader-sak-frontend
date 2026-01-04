import React from 'react';

import { BodyShort, Box, Label } from '@navikt/ds-react';

import styles from './Oppsumering.module.css';
import { ResultatVerdi } from './ResultatVerdi';
import { SimuleringOppsummering } from './simuleringTyper';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/FlexColumn';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../utils/fomatering';

const Oppsumering: React.FC<{ oppsummering: SimuleringOppsummering }> = ({ oppsummering }) => (
    <Box padding="4" borderWidth="1" borderRadius={'medium'} className={styles.box}>
        <FlexColumn>
            <Label>Totalt for perioden</Label>
            <div className={styles.flexRow}>
                <BodyShort>Feilutbetaling</BodyShort>
                <ResultatVerdi verdi={-oppsummering.feilutbetaling}>
                    {formaterTallMedTusenSkilleEllerStrek(-oppsummering.feilutbetaling)} kr
                </ResultatVerdi>
            </div>
            <div className={styles.flexRow}>
                <BodyShort>Etterbetaling</BodyShort>
                <ResultatVerdi verdi={oppsummering.etterbetaling}>
                    {formaterTallMedTusenSkilleEllerStrek(oppsummering.etterbetaling)} kr
                </ResultatVerdi>
            </div>
        </FlexColumn>
    </Box>
);

export default Oppsumering;
