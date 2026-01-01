import React from 'react';

import { FileTextIcon } from '@navikt/aksel-icons';
import { BodyLong, Heading } from '@navikt/ds-react';

import styles from './KlageInfo.module.css';
import { IFormkravVilkår, Redigeringsmodus } from './typer';
import { alleVilkårOppfylt, påKlagetVedtakValgt } from './validerFormkravUtils';
import IkkeOppfylt from '../../../../komponenter/Ikoner/Vurderingsresultat/IkkeOppfylt';
import Info from '../../../../komponenter/Ikoner/Vurderingsresultat/Info';
import Oppfylt from '../../../../komponenter/Ikoner/Vurderingsresultat/Oppfylt';
import { formaterIsoDato } from '../../../../utils/dato';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import Advarsel from '../../Komponenter/Ikoner/Advarsel';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';

interface IProps {
    behandling: Klagebehandling;
    vurderinger: IFormkravVilkår;
    redigeringsmodus: Redigeringsmodus;
}

export const KlageInfo: React.FC<IProps> = ({ behandling, vurderinger, redigeringsmodus }) => {
    const { formkravOppfylt } = useKlagebehandling();
    const utledetIkon = () => {
        if (redigeringsmodus === Redigeringsmodus.IKKE_PÅSTARTET) {
            return <Advarsel height={26} width={26} className={styles.advarselIkon} />;
        } else if (formkravOppfylt) {
            return <Oppfylt height={23} width={23} className={styles.oppfyltIkon} />;
        } else if (påKlagetVedtakValgt(vurderinger) && alleVilkårOppfylt(vurderinger)) {
            return <Info height={23} width={23} className={styles.infoIkon} />;
        }
        return <IkkeOppfylt height={23} width={23} className={styles.errorIkon} />;
    };

    return (
        <>
            <div className={styles.tabellRad}>
                {utledetIkon()}
                <Heading spacing size="medium" level="5">
                    Formkrav
                </Heading>
            </div>
            <div className={styles.tabellRad}>
                <FileTextIcon fontSize="1.5rem" />
                <BodyLong size="small">Klage mottatt</BodyLong>
                <BodyLong size="small">{formaterIsoDato(behandling.klageMottatt)}</BodyLong>
            </div>
        </>
    );
};
