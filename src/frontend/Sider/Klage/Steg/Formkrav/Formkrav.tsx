import React, { useEffect, useState } from 'react';

import { KlageInfo } from './KlageInfo';
import { ToKolonnerLayout } from './ToKolonnerLayout';
import { IFormkravVilkår } from './typer';
import { utledRedigeringsmodus } from './validerFormkravUtils';
import { VisEllerEndreFormkravVurderinger } from './VisEllerEndreFormkravVurderinger';
import DataViewer from '../../../../komponenter/DataViewer';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../typer/ressurs';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import { useHentFagsystemVedtak } from '../../hooks/useHentFagsystemVedtak';
import { useHentFormkravVilkår } from '../../hooks/useHentFormkravVilkår';
import { FagsystemVedtak } from '../../typer/fagsystemVedtak';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';

export const Formkrav: React.FC<{ behandling: Klagebehandling }> = ({ behandling }) => {
    const { vilkårsvurderinger, hentVilkårsvurderinger, lagreVilkårsvurderinger, feilVedLagring } =
        useHentFormkravVilkår();
    const { fagsystemVedtak, hentFagsystemVedtak } = useHentFagsystemVedtak();
    const behandlingId = behandling.id;

    useEffect(() => {
        if (vilkårsvurderinger.status === RessursStatus.IKKE_HENTET) {
            hentVilkårsvurderinger(behandlingId);
        }
    }, [behandlingId, vilkårsvurderinger, hentVilkårsvurderinger]);

    useEffect(() => {
        if (fagsystemVedtak.status === RessursStatus.IKKE_HENTET) {
            hentFagsystemVedtak(behandling);
        }
    }, [behandling, fagsystemVedtak, hentFagsystemVedtak]);

    return (
        <DataViewer type={'vilkårsvurderinger'} response={{ vilkårsvurderinger, fagsystemVedtak }}>
            {({ vilkårsvurderinger, fagsystemVedtak }) => {
                return (
                    <FormkravKomponent
                        vilkårsvurderinger={vilkårsvurderinger}
                        lagreVurderinger={lagreVilkårsvurderinger}
                        behandling={behandling}
                        feilmelding={feilVedLagring}
                        fagsystemVedtak={fagsystemVedtak}
                    />
                );
            }}
        </DataViewer>
    );
};

const FormkravKomponent: React.FC<{
    vilkårsvurderinger: IFormkravVilkår;
    lagreVurderinger: (
        vurderinger: IFormkravVilkår
    ) => Promise<RessursSuksess<IFormkravVilkår> | RessursFeilet>;
    behandling: Klagebehandling;
    feilmelding: string;
    fagsystemVedtak: FagsystemVedtak[];
}> = ({ vilkårsvurderinger, lagreVurderinger, behandling, feilmelding, fagsystemVedtak }) => {
    const { behandlingErRedigerbar } = useKlagebehandling();
    const [oppdaterteVurderinger, settOppdaterteVurderinger] =
        useState<IFormkravVilkår>(vilkårsvurderinger);
    const [redigeringsmodus, settRedigeringsmodus] = useState(
        utledRedigeringsmodus(behandlingErRedigerbar, vilkårsvurderinger)
    );

    useEffect(() => {
        settRedigeringsmodus(utledRedigeringsmodus(behandlingErRedigerbar, vilkårsvurderinger));
    }, [behandlingErRedigerbar, vilkårsvurderinger]);

    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <KlageInfo
                        behandling={behandling}
                        vurderinger={oppdaterteVurderinger}
                        redigeringsmodus={redigeringsmodus}
                    />
                ),
                høyre: (
                    <VisEllerEndreFormkravVurderinger
                        vurderinger={oppdaterteVurderinger}
                        settOppdaterteVurderinger={settOppdaterteVurderinger}
                        lagreVurderinger={lagreVurderinger}
                        redigeringsmodus={redigeringsmodus}
                        settRedigeringsmodus={settRedigeringsmodus}
                        feilmelding={feilmelding}
                        fagsystemVedtak={fagsystemVedtak}
                    />
                ),
            }}
        </ToKolonnerLayout>
    );
};
