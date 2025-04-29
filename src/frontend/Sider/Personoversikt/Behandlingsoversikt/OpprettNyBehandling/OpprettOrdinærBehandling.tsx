import React, { useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import {
    Button,
    Checkbox,
    CheckboxGroup,
    HStack,
    Select,
    Textarea,
    VStack,
} from '@navikt/ds-react';

import BarnTilRevurdering, { BarnTilRevurderingResponse } from './BarnTilRevurdering';
import { useApp } from '../../../../context/AppContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import {
    Feil,
    feiletRessursTilFeilmelding,
    lagFeilmelding,
} from '../../../../komponenter/Feil/feilmeldingUtils';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { BehandlingÅrsak } from '../../../../typer/behandling/behandlingÅrsak';
import {
    NyeOpplysningerEndring,
    nyeOpplysningerEndringTilTekst,
    NyeOpplysningerKilde,
    nyeOpplysningerKildeTilTekst,
    NyeOpplysningerMetadata,
} from '../../../../typer/behandling/nyeOpplysningerMetadata';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../typer/ressurs';
import { Toggle } from '../../../../utils/toggles';
import { harVerdi } from '../../../../utils/utils';

interface Props {
    fagsakId: string;
    stønadstype: Stønadstype;
    lukkModal: () => void;
    hentBehandlinger: () => void;
}

interface OpprettBehandlingRequest {
    fagsakId: string;
    årsak: BehandlingÅrsak;
    kravMottatt?: string;
    valgteBarn: string[];
    nyeOpplysningerMetadata?: NyeOpplysningerMetadata;
}

const utledSkalViseBarnTilRevurdering = (
    stønadstype: Stønadstype,
    årsak: BehandlingÅrsak | undefined
): boolean =>
    stønadstype === Stønadstype.BARNETILSYN &&
    !!årsak &&
    [
        BehandlingÅrsak.SØKNAD,
        BehandlingÅrsak.PAPIRSØKNAD,
        BehandlingÅrsak.KORRIGERING_UTEN_BREV,
    ].indexOf(årsak) > -1;
// TODO skal ikke kunne velge nye barn etter opprydding av de 2 sakene som trenger det

const OpprettOrdinærBehandling: React.FC<Props> = ({
    fagsakId,
    stønadstype,
    lukkModal,
    hentBehandlinger,
}) => {
    const { request } = useApp();

    const [årsak, settÅrsak] = useState<BehandlingÅrsak>();
    const [kilde, settKilde] = useState<NyeOpplysningerKilde>();
    const [endringer, settEndringer] = useState<NyeOpplysningerEndring[]>();
    const [beskrivelse, settBeskrivelse] = useState<string>();
    const [barnTilRevurdering, setBarnTilRevurdering] =
        useState<Ressurs<BarnTilRevurderingResponse>>(byggTomRessurs());
    const [valgteBarn, settValgteBarn] = useState<string[]>([]);

    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();

    const kanVelgeÅrsakUtenBrev = useFlag(Toggle.BEHANDLING_ÅRSAK_UTEN_BREV);
    const [kravMottatt, settKravMottatt] = useState<string | undefined>(undefined);

    const opprett = () => {
        if (laster) {
            return;
        }
        settLaster(true);
        if (!årsak) {
            settFeilmelding(lagFeilmelding('Mangler årsak'));
            settLaster(false);
            return;
        }
        if (!kravMottatt && årsak === BehandlingÅrsak.PAPIRSØKNAD) {
            settFeilmelding(lagFeilmelding('Søknadsdato må settes'));
            settLaster(false);
            return;
        }

        let nyeOpplysninger: NyeOpplysningerMetadata | undefined = undefined;
        if (årsak === BehandlingÅrsak.NYE_OPPLYSNINGER) {
            if (!kilde) {
                settFeilmelding(lagFeilmelding('Kilde for nye opplysninger må settes'));
                settLaster(false);
                return;
            }
            if (!endringer) {
                settFeilmelding(lagFeilmelding('Endringer ved nye opplysninger må settes'));
                settLaster(false);
                return;
            }
            nyeOpplysninger = {
                kilde: kilde,
                endringer: endringer,
                beskrivelse: beskrivelse,
            };
        }
        request<string, OpprettBehandlingRequest>(`/api/sak/behandling`, 'POST', {
            fagsakId: fagsakId,
            årsak: årsak,
            kravMottatt: kravMottatt,
            valgteBarn: valgteBarn,
            nyeOpplysningerMetadata: nyeOpplysninger,
        }).then((response) => {
            if (response.status === RessursStatus.SUKSESS) {
                hentBehandlinger();
                lukkModal();
            } else {
                settFeilmelding(feiletRessursTilFeilmelding(response));
                settLaster(false);
            }
        });
    };

    const endreÅrsak = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (harVerdi(value)) {
            settÅrsak(value as BehandlingÅrsak);
            settFeilmelding(undefined);
            settKilde(undefined);
            settEndringer(undefined);
            settBeskrivelse(undefined);
        } else {
            settÅrsak(undefined);
        }
    };

    const endreKilde = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (harVerdi(value)) {
            settKilde(value as NyeOpplysningerKilde);
            settFeilmelding(undefined);
        } else {
            settKilde(undefined);
        }
    };
    const skalViseBarnTilRevurdering = utledSkalViseBarnTilRevurdering(stønadstype, årsak);
    const skalVentePåOkHentingAvBarn =
        skalViseBarnTilRevurdering && barnTilRevurdering.status !== RessursStatus.SUKSESS;
    return (
        <VStack gap="4">
            <Select label={'Årsak'} onChange={endreÅrsak}>
                <option value="">- Velg årsak -</option>
                <option value={BehandlingÅrsak.NYE_OPPLYSNINGER}>Nye opplysninger</option>
                <option value={BehandlingÅrsak.SØKNAD}>Søknad</option>
                <option value={BehandlingÅrsak.PAPIRSØKNAD}>Papirsøknad</option>
                {kanVelgeÅrsakUtenBrev && (
                    <option value={BehandlingÅrsak.KORRIGERING_UTEN_BREV}>
                        Korrigering uten brev
                    </option>
                )}
            </Select>
            {årsak === BehandlingÅrsak.PAPIRSØKNAD && (
                <DateInput
                    label={`Søknadsdato`}
                    onChange={(dato: string | undefined) => settKravMottatt(dato)}
                    value={kravMottatt}
                    toDate={new Date()}
                />
            )}
            {årsak === BehandlingÅrsak.NYE_OPPLYSNINGER && (
                <>
                    <Select label={'Kilde til opplysninger'} onChange={endreKilde}>
                        <option value={''}>-Velg kilde-</option>
                        {Object.keys(NyeOpplysningerKilde).map((kilde) => (
                            <option key={kilde} value={kilde}>
                                {nyeOpplysningerKildeTilTekst[kilde]}
                            </option>
                        ))}
                    </Select>

                    <CheckboxGroup
                        legend={'Hva er endret?'}
                        onChange={(values) => settEndringer(values)}
                    >
                        {Object.values(NyeOpplysningerEndring).map((endring) => (
                            <Checkbox key={endring} value={endring}>
                                {nyeOpplysningerEndringTilTekst[endring]}
                            </Checkbox>
                        ))}
                    </CheckboxGroup>
                    <Textarea
                        label={'Beskrivelse (valgfri)'}
                        value={beskrivelse}
                        onChange={(e) => settBeskrivelse(e.target.value)}
                    />
                </>
            )}
            {skalViseBarnTilRevurdering && (
                <BarnTilRevurdering
                    fagsakId={fagsakId}
                    barnTilRevurdering={barnTilRevurdering}
                    settBarnTilRevurdering={setBarnTilRevurdering}
                    settValgteBarn={settValgteBarn}
                />
            )}

            <HStack gap="4" justify={'end'}>
                <Button variant="tertiary" onClick={lukkModal} size="small">
                    Avbryt
                </Button>
                <Button
                    variant="primary"
                    onClick={opprett}
                    size="small"
                    disabled={skalVentePåOkHentingAvBarn}
                >
                    Lagre
                </Button>
            </HStack>
            <Feilmelding feil={feilmelding} />
        </VStack>
    );
};

export default OpprettOrdinærBehandling;
