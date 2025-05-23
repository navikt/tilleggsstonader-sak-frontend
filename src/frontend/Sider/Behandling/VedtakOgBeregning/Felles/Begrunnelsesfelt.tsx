import React from 'react';

import { Textarea } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { useSteg } from '../../../../context/StegContext';
import { UlagretKomponent } from '../../../../hooks/useUlagredeKomponenter';

export const Begrunnelsesfelt: React.FC<{
    begrunnelse?: string | undefined;
    oppdaterBegrunnelse: (nyBegrunnelse: string) => void;
}> = ({ begrunnelse, oppdaterBegrunnelse }) => {
    const { erStegRedigerbart } = useSteg();
    const { settUlagretKomponent } = useApp();
    return (
        <>
            <Textarea
                label="Begrunnelse for vedtaksperiode (valgfri)"
                style={{ width: '600px' }}
                resize
                size="small"
                minRows={2}
                value={begrunnelse || ''}
                readOnly={!erStegRedigerbart}
                onChange={(e) => {
                    oppdaterBegrunnelse(e.target.value);
                    settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
                }}
                description="For eksempel bør du begrunne hvis vedtaksperioden ikke samsvarer med perioden alle vilkår er oppfylt."
            />
        </>
    );
};
