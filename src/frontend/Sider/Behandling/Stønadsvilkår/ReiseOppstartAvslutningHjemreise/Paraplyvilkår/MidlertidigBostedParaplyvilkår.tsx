import React, { useEffect, useId, useState } from 'react';

import { TrashIcon } from '@navikt/aksel-icons';

import { LesevisningMidlertidigBostedPeriode } from './LesevisningMidlertidigBostedPeriode';
import { MidlertidigBostedFakta } from './MidlertidigBostedFakta';
import { Paraplyvilkår } from './Paraplyvilkår';
import { MidlertidigBostedUtkast, tilUtkast, tomtMidlertidigBostedUtkast } from './typer';
import { useApp } from '../../../../../context/AppContext';
import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import {
    Feil,
    feiletRessursTilFeilmelding,
} from '../../../../../komponenter/Feil/feilmeldingUtils';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import { RessursStatus } from '../../../../../typer/ressurs';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { SlettVilkårReiseOppstartAvslutningHjemreise } from '../EndreVilkår/SlettVilkårReiseOppstartAvslutningHjemreise';
import {
    FeilmeldingerMidlertidigBostedPeriode,
    validerMidlertidigBostedPeriode,
} from '../EndreVilkår/validering';
import {
    LagreNyttParaplyvilkårReiseOppstartAvslutningHjemreise,
    ParaplyvilkårReiseOppstartAvslutningHjemreise,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';

interface Props {
    aktivitet: Aktivitet;
    vilkår: ParaplyvilkårReiseOppstartAvslutningHjemreise | undefined;
    fjernUtkast?: () => void;
}

/**
 * Paraplyvilkåret for midlertidig bosted, med periode, adresser og regelspørsmål.
 * Lagres som et vilkår med reiseformål MIDLERTIDIG_BOSTED. Kortet eier utkastet, så flere
 * paraplyvilkår kan redigeres uavhengig av hverandre.
 */
export const MidlertidigBostedParaplyvilkår: React.FC<Props> = ({
    aktivitet,
    vilkår,
    fjernUtkast,
}) => {
    const { regelstruktur, lagreNyttParaplyvilkår, oppdaterParaplyvilkår, slettVilkår } =
        useVilkårReiseOppstartAvslutningHjemreise();
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const komponentId = useId();

    const erUtkast = vilkår === undefined;

    const [utkast, settUtkast] = useState(vilkår ? tilUtkast(vilkår) : tomtMidlertidigBostedUtkast);
    const [redigerer, settRedigerer] = useState(erUtkast);
    const [feil, settFeil] = useState<FeilmeldingerMidlertidigBostedPeriode>({});
    const [feilVedLagring, settFeilVedLagring] = useState<Feil>();
    const [laster, settLaster] = useState(false);

    // Fjerner ulagret-markeringen når kortet fjernes, for eksempel når et utkast slettes
    useEffect(
        () => () => nullstillUlagretKomponent(komponentId),
        [nullstillUlagretKomponent, komponentId]
    );

    const endreUtkast = (endring: Partial<MidlertidigBostedUtkast>) => {
        settUtkast((forrige) => ({ ...forrige, ...endring }));
        settFeil({});
        settUlagretKomponent(komponentId);
    };

    const lagre = async () => {
        if (laster) return;

        const fom = utkast.fom ?? '';
        const tom = utkast.tom ?? '';

        const nyeFeil = validerMidlertidigBostedPeriode(
            { fom, tom },
            utkast.svar,
            regelstruktur.midlertidigBostedPeriode
        );
        settFeil(nyeFeil);
        if (Object.keys(nyeFeil).length > 0) {
            return;
        }

        const nyttVilkår: LagreNyttParaplyvilkårReiseOppstartAvslutningHjemreise = {
            type: 'PARAPLYVILKÅR',
            fom,
            tom,
            aktivitetId: aktivitet.globalId,
            svar: utkast.svar,
            fraAdresse: utkast.fraAdresse,
            tilAdresse: utkast.tilAdresse,
        };

        settLaster(true);
        const respons = vilkår
            ? await oppdaterParaplyvilkår(vilkår.id, nyttVilkår)
            : await lagreNyttParaplyvilkår(nyttVilkår);
        settLaster(false);

        if (respons.status === RessursStatus.SUKSESS) {
            settFeilVedLagring(undefined);
            nullstillUlagretKomponent(komponentId);
            settRedigerer(false);
            // Lagret vilkår vises nå fra konteksten, så utkastet fjernes
            if (erUtkast) fjernUtkast?.();
        } else {
            settFeilVedLagring(feiletRessursTilFeilmelding(respons));
        }
    };

    const avbryt = () => {
        if (!vilkår) return;
        settUtkast(tilUtkast(vilkår));
        settFeil({});
        settFeilVedLagring(undefined);
        nullstillUlagretKomponent(komponentId);
        settRedigerer(false);
    };

    return (
        <Paraplyvilkår
            aktivitet={aktivitet}
            tittel="Periode hvor bruker bor borte"
            vilkår={vilkår}
            redigerer={redigerer}
            startRedigering={() => settRedigerer(true)}
            skjema={
                <MidlertidigBostedFakta
                    utkast={utkast}
                    endreUtkast={endreUtkast}
                    feil={feil}
                    feilVedLagring={feilVedLagring}
                    laster={laster}
                    regelstruktur={regelstruktur.midlertidigBostedPeriode}
                    lagre={lagre}
                    avbryt={vilkår ? avbryt : undefined}
                />
            }
            lesevisning={vilkår && <LesevisningMidlertidigBostedPeriode vilkår={vilkår} />}
            slettknapp={
                vilkår ? (
                    <SlettVilkårReiseOppstartAvslutningHjemreise
                        lagretVilkår={vilkår}
                        avsluttRedigering={() => settRedigerer(false)}
                        slett={slettVilkår}
                    />
                ) : (
                    <SmallButton
                        type="button"
                        variant="tertiary"
                        icon={<TrashIcon aria-hidden />}
                        iconPosition="right"
                        onClick={fjernUtkast}
                    >
                        Slett vilkår
                    </SmallButton>
                )
            }
        />
    );
};
