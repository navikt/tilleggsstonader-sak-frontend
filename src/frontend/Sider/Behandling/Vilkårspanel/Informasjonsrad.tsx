import * as React from 'react';
import { FC, ReactNode } from 'react';

import styled from 'styled-components';

import { BodyShort, Label } from '@navikt/ds-react';

import { mapIkon, VilkårInfoIkon } from './VilkårInformasjonKomponenter';

interface Props {
    ikon?: VilkårInfoIkon;
    label: string;
    verdi?: ReactNode;
    verdiSomString?: boolean;
    boldLabel?: boolean;
}

const InformasjonsradContainer = styled.div<{ harVerdi: boolean }>`
    display: grid;
    grid-template-columns: 21px min(200px, 250px) auto;
    grid-gap: 0.5rem;

    .label {
        grid-column: 2 ${(props) => !props.harVerdi && '/ 4'};
    }
`;

const Informasjonsrad: FC<Props> = ({
    ikon,
    label,
    verdi,
    verdiSomString = true,
    boldLabel = true,
}) => {
    return (
        <InformasjonsradContainer harVerdi={!!verdi}>
            {ikon && mapIkon(ikon)}
            {boldLabel ? (
                <Label size="small" as="h3" className="label">
                    {label}
                </Label>
            ) : (
                <BodyShort size="small" className="label">
                    {label}
                </BodyShort>
            )}
            {verdiSomString ? <BodyShort size="small">{verdi}</BodyShort> : verdi}
        </InformasjonsradContainer>
    );
};

export default Informasjonsrad;
