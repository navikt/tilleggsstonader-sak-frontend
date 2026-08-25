import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
    BodyShort,
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    HelpText,
    HStack,
    Label,
    List,
    Radio,
    RadioGroup,
    Select,
    TextField,
    VStack,
} from '@navikt/ds-react';

import styles from './OpprettFørstegangsbehandlingAdmin.module.css';
import { useApp } from '../../context/AppContext';
import DataViewer from '../../komponenter/DataViewer';
import { Feilmelding } from '../../komponenter/Feil/Feilmelding';
import DateInput from '../../komponenter/Skjema/DateInput';
import {
    hentStønadstyperSaksbehandlerKanBehandle,
    Stønadstype,
    stønadstypeTilTekst,
} from '../../typer/behandling/behandlingTema';
import {
    ÅrsakMetadataKilde,
    årsakMetadataKildeTilTekst,
} from '../../typer/behandling/nyeOpplysningerMetadata';
import {
    byggHenterRessurs,
    byggRessursFeilet,
    byggTomRessurs,
    Ressurs,
    RessursStatus,
} from '../../typer/ressurs';
import { erGyldigFnr, harVerdi } from '../../utils/utils';

interface Personinfo {
    navn: string;
    barn: {
        ident: string;
        navn: string;
    }[];
}

interface OpprettFørstegansbehandlingHentPersonRequest {
    stønadstype: Stønadstype;
    ident: string;
}
interface OpprettFørstegansbehandlingRequest {
    stønadstype: Stønadstype;
    ident: string;
    valgteBarn: string[];
    medBrev: boolean;
    kravMottatt: string;
    årsakKilde: string;
    årsakBeskrivelse: string | undefined;
}

const skalVelgeBarn = (stønadstype: Stønadstype | undefined): boolean =>
    !!stønadstype && [Stønadstype.BARNETILSYN].indexOf(stønadstype) > -1;

function OpprettFørstegangsbehandlingAdmin() {
    const { saksbehandler, appEnv } = useApp();
    const stønadstyperSaksbehandlerKanBehandle = hentStønadstyperSaksbehandlerKanBehandle(
        saksbehandler,
        appEnv
    ).filter(
        (type) =>
            type !== Stønadstype.REISE_TIL_SAMLING_TSO &&
            type !== Stønadstype.REISE_TIL_SAMLING_TSR &&
            type !== Stønadstype.FLYTTING_TSO &&
            type !== Stønadstype.FLYTTING_TSR
    );
    const [stønadstype, settStønadstype] = useState<Stønadstype>();

    const endreStønadstype = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nyStønadstype = event.target.value;
        settStønadstype(harVerdi(nyStønadstype) ? (nyStønadstype as Stønadstype) : undefined);
    };

    return (
        <div className={styles.container}>
            <div>
                <Heading size={'medium'}>[Admin] Opprett førstegangsbehandling</Heading>
                <VStack gap={'space-8'}>
                    <BodyShort>
                        Enkelte ganger vil det være behov for å opprette en førstegangsbehandling
                        manuelt. Du søker da først opp brukers fødselsnummer og velger deretter
                        hvilke barn det er søkt stønad for slik at disse blir med i behandlingen.
                    </BodyShort>
                    <BodyShort size={'small'}>
                        Det er primært for å opprette førstegangsbehandling for allerede
                        journalførte søknader.
                    </BodyShort>
                    <Box marginBlock="space-16" asChild>
                        <List size={'small'}>
                            <List.Item>Papirsøknad</List.Item>
                            <List.Item>Søknad om barnetilsyn fra enslig forsørger</List.Item>
                            <List.Item>Søknad som blitt sendt inn til Arena</List.Item>
                        </List>
                    </Box>
                    <BodyShort>Hvis du er usikker, spør på teams.</BodyShort>
                </VStack>
            </div>
            <Select label="Stønadstype" onChange={endreStønadstype}>
                <option value="">- Velg stønadstype -</option>
                {stønadstyperSaksbehandlerKanBehandle.map((type) => (
                    <option key={type} value={type}>
                        {stønadstypeTilTekst[type]}
                    </option>
                ))}
            </Select>
            {stønadstype && (
                <OpprettFørstegangsbehandling
                    key={stønadstype} // nullstiller komponent hvis man endrer stønadstype
                    stønadstype={stønadstype}
                />
            )}
        </div>
    );
}

function OpprettFørstegangsbehandling({ stønadstype }: { stønadstype: Stønadstype }) {
    const { request } = useApp();
    const navigate = useNavigate();
    const [ident, settIdent] = useState<string>('');
    const [medBrev, settMedBrev] = useState<boolean>(true);
    const [kravMottatt, settKravMottatt] = useState<string>('');
    const [valgteBarn, settValgteBarn] = useState<string[]>([]);
    const [personinfo, settPersoninfo] = useState<Ressurs<Personinfo>>(byggTomRessurs());
    const [feilmelding, settFeilmelding] = useState<string>();
    const [årsakKilde, settÅrsakKilde] = useState<ÅrsakMetadataKilde | undefined>(undefined);
    const [årsakBeskrivelse, settÅrsakBeskrivelse] = useState<string | undefined>(undefined);

    const [opprettBehandlingResponse, settOpprettBehandlingResponse] =
        useState<Ressurs<null>>(byggTomRessurs());

    const hentPersoninfo = () => {
        settOpprettBehandlingResponse(byggTomRessurs());
        settValgteBarn([]);
        if (!erGyldigFnr(ident)) {
            settPersoninfo(byggRessursFeilet('Ikke gyldig ident.'));
            return;
        }
        settPersoninfo(byggHenterRessurs());
        request<Personinfo, OpprettFørstegansbehandlingHentPersonRequest>(
            `/api/sak/behandling/admin/hent-person`,
            'POST',
            {
                stønadstype,
                ident,
            }
        ).then(settPersoninfo);
    };

    const opprettBehandling = () => {
        if (!kravMottatt) {
            settFeilmelding('Krav mottatt må fylles ut');
            return;
        }
        if (!årsakKilde) {
            settFeilmelding('Kilde til opplysning må velges');
            return;
        }

        settOpprettBehandlingResponse(byggHenterRessurs());
        request<Personinfo, OpprettFørstegansbehandlingRequest>(
            `/api/sak/behandling/admin/opprett-foerstegangsbehandling`,
            'POST',
            { stønadstype, ident, valgteBarn, medBrev, kravMottatt, årsakKilde, årsakBeskrivelse }
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                navigate(`/behandling/${res.data}`);
            } else {
                settOpprettBehandlingResponse(res);
            }
        });
    };

    return (
        <>
            <VStack gap={'space-4'}>
                <TextField
                    label={'Søkers fødselsnummer'}
                    onChange={(e) => {
                        settIdent(e.target.value);
                        settValgteBarn([]);
                        settPersoninfo(byggTomRessurs());
                        settOpprettBehandlingResponse(byggTomRessurs());
                        settÅrsakKilde(undefined);
                        settÅrsakBeskrivelse('');
                    }}
                    autoComplete="off"
                />

                <Button variant={'secondary'} size={'small'} onClick={hentPersoninfo}>
                    Hent personinfo fra folkeregisteret
                </Button>
            </VStack>
            <DataViewer type={'personinformasjon'} response={{ personinfo }}>
                {({ personinfo }) => (
                    <>
                        <Heading size={'small'}>Informasjon om søker</Heading>
                        <BodyShort>
                            <b>Navn: </b> {personinfo.navn}
                        </BodyShort>
                        <DateInput
                            label={
                                <HStack gap={'space-8'}>
                                    <Label>Krav mottatt</Label>
                                    <HelpText title={'Krav mottatt'}>
                                        Krav mottatt kan være når man fikk beskjed om endring eller
                                        søknadsdato i tilfelle årsak er søknad
                                    </HelpText>
                                </HStack>
                            }
                            onChange={(dato) => settKravMottatt(dato || '')}
                            toDate={new Date()}
                        />
                        <Select
                            label="Kilde til opplysninger"
                            value={årsakKilde ?? ''}
                            onChange={(event) => {
                                const kilde = event.target.value as ÅrsakMetadataKilde;
                                settÅrsakKilde(kilde);
                                settFeilmelding(undefined);
                            }}
                        >
                            <option value="">- Velg kilde -</option>
                            {Object.keys(ÅrsakMetadataKilde).map((kilde) => (
                                <option key={kilde} value={kilde}>
                                    {årsakMetadataKildeTilTekst[kilde]}
                                </option>
                            ))}
                        </Select>

                        <TextField
                            label="Årsak til manual behandling"
                            description="Beskriv gjerne kort hvorfor førstegangsbehandlingen opprettes."
                            value={årsakBeskrivelse ?? ''}
                            onChange={(event) => {
                                settÅrsakBeskrivelse(event.target.value);
                            }}
                        />
                        <RadioGroup
                            legend={
                                <HStack gap={'space-8'}>
                                    Skal det sendes vedtaksbrev?
                                    <HelpText>
                                        <BodyShort>
                                            I tilfelle det er ønskelig å ikke sende vedtaksbrev så
                                            skal verdiet settes til &quot;Nei&quot;. Det kan
                                            eksempelvis være når noe skal flyttes over til ny
                                            løsning fra Arena og då stanses i Arena. Husk å stanse
                                            stønaden i Arena.
                                        </BodyShort>
                                    </HelpText>
                                </HStack>
                            }
                            value={medBrev}
                            onChange={(value) => settMedBrev(value as boolean)}
                        >
                            <Radio value={true}>Ja</Radio>
                            <Radio value={false}>Nei</Radio>
                        </RadioGroup>
                        {skalVelgeBarn(stønadstype) && (
                            <CheckboxGroup
                                legend={'Velg barn fra søknad'}
                                onChange={(values) => settValgteBarn(values)}
                            >
                                {personinfo.barn.map(({ ident, navn }) => (
                                    <Checkbox key={ident} value={ident}>
                                        {ident} - {navn}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        )}
                        <Feilmelding feil={feilmelding} />
                        <Button variant={'primary'} size={'small'} onClick={opprettBehandling}>
                            Opprett førstegangsbehandling
                        </Button>
                    </>
                )}
            </DataViewer>
            <DataViewer type={'opprett behandling'} response={{ opprettBehandlingResponse }}>
                {() => <>Ok</>}
            </DataViewer>
        </>
    );
}

export default OpprettFørstegangsbehandlingAdmin;
