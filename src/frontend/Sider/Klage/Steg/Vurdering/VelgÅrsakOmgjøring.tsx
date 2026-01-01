import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

import { Heading, Select } from '@navikt/ds-react';

import styles from './VelgÅrsakOmgjøring.module.css';
import { Vurderingsfelter } from './vurderingsfelter';
import { ÅrsakOmgjøring } from './vurderingValg';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';

interface IÅrsak {
    settÅrsak: Dispatch<SetStateAction<Vurderingsfelter>>;
    årsakValgt?: ÅrsakOmgjøring;
    årsakValgmuligheter: Record<string, string>;
    endring: (komponentId: string) => void;
}

export const VelgÅrsakOmgjøring: React.FC<IÅrsak> = ({
    settÅrsak,
    årsakValgt,
    årsakValgmuligheter,
    endring,
}) => {
    const { settVurderingEndret } = useKlagebehandling();
    return (
        <div className={styles.arsak}>
            <Heading spacing size="medium" level="5">
                Årsak
            </Heading>
            <div className={styles.arsakInnhold}>
                <Select
                    value={årsakValgt}
                    label=""
                    size="medium"
                    onChange={(e) => {
                        endring(e.target.value);
                        settÅrsak(
                            (tidligereTilstand: Vurderingsfelter) =>
                                ({
                                    ...tidligereTilstand,
                                    årsak: e.target.value,
                                }) as Vurderingsfelter
                        );
                        settVurderingEndret(true);
                    }}
                    hideLabel
                >
                    <option value={''}>Velg</option>
                    {Object.keys(årsakValgmuligheter).map((valg, index) => (
                        <option value={valg} key={index}>
                            {årsakValgmuligheter[valg]}
                        </option>
                    ))}
                </Select>
            </div>
        </div>
    );
};
