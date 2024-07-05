import React, { useEffect, useState } from 'react';
import { KlageInfo } from './KlageInfo';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../../../typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IFormkravVilkår } from './typer';
import ToKolonnerLayout from '../../../Felles/Visningskomponenter/ToKolonnerLayout';
import { VisEllerEndreFormkravVurderinger } from './VisEllerEndreFormkravVurderinger';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Klagebehandling } from '../../../App/typer/klagebehandling/klagebehandling';
import { useHentFormkravVilkår } from '../../../App/hooks/useHentFormkravVilkår';
import { utledRedigeringsmodus } from './validerFormkravUtils';
import { useHentFagsystemVedtak } from '../../../App/hooks/useHentFagsystemVedtak';
import { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';

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
        <DataViewer response={{ vilkårsvurderinger, fagsystemVedtak }}>
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
    const { behandlingErRedigerbar } = useBehandling();
    const [oppdaterteVurderinger, settOppdaterteVurderinger] =
        useState<IFormkravVilkår>(vilkårsvurderinger);
    const [redigeringsmodus, settRedigeringsmodus] = useState(
        utledRedigeringsmodus(behandlingErRedigerbar, vilkårsvurderinger)
    );

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
