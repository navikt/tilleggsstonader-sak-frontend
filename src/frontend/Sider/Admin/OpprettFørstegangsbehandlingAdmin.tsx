import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
    BodyShort,
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    HelpText,
    HStack,
    List,
    Radio,
    RadioGroup,
    TextField,
    VStack,
} from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';
import DataViewer from '../../komponenter/DataViewer';
import { IdentRequest } from '../../typer/identrequest';
import {
    byggFeiletRessurs,
    byggHenterRessurs,
    byggTomRessurs,
    Ressurs,
    RessursStatus,
} from '../../typer/ressurs';
import { erGyldigFnr } from '../../utils/utils';

const Container = styled.div`
    margin: 2rem;
    width: 40rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

interface Personinfo {
    barn: {
        ident: string;
        navn: string;
    }[];
}

interface OpprettFørstegansbehandlingRequest {
    ident: string;
    valgteBarn: string[];
    medBrev: boolean;
}

const OpprettFørstegangsbehandlingAdmin: React.FC = () => {
    const { request } = useApp();
    const navigate = useNavigate();
    const [ident, settIdent] = useState<string>('');
    const [medBrev, settMedBrev] = useState<boolean>(true);
    const [valgteBarn, settValgteBarn] = useState<string[]>([]);

    const [personinfo, settPersoninfo] = useState<Ressurs<Personinfo>>(byggTomRessurs());

    const [opprettBehandlingResponse, settOpprettBehandlingResponse] =
        useState<Ressurs<null>>(byggTomRessurs());

    const hentPersoninfo = () => {
        settOpprettBehandlingResponse(byggTomRessurs());
        settValgteBarn([]);
        if (!erGyldigFnr(ident)) {
            settPersoninfo(byggFeiletRessurs('Ikke gyldig ident.'));
            return;
        }
        settPersoninfo(byggHenterRessurs());
        request<Personinfo, IdentRequest>(`/api/sak/behandling/admin/hent-person`, 'POST', {
            ident,
        }).then(settPersoninfo);
    };

    const opprettBehandling = () => {
        settOpprettBehandlingResponse(byggHenterRessurs());
        request<Personinfo, OpprettFørstegansbehandlingRequest>(
            `/api/sak/behandling/admin/opprett-foerstegangsbehandling`,
            'POST',
            { ident, valgteBarn, medBrev }
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                navigate(`/behandling/${res.data}`);
            } else {
                settOpprettBehandlingResponse(res);
            }
        });
    };

    return (
        <Container>
            <div>
                <Heading size={'medium'}>[Admin] Opprett førstegangsbehandling Tilsyn barn</Heading>
                <VStack gap={'2'}>
                    <BodyShort>
                        Enkelte ganger vil det være behov for å opprette en førstegangsbehandling
                        manuelt. Du søker da først opp brukers fødselsnummer og velger deretter
                        hvilke barn det er søkt stønad for slik at disse blir med i behandlingen.
                    </BodyShort>
                    <BodyShort size={'small'}>
                        Det er primært for å opprette førstegangsbehandling for allerede
                        journalførte søknader.
                    </BodyShort>
                    <List size={'small'}>
                        <List.Item>Papirsøknad</List.Item>
                        <List.Item>Søknad om barnetilsyn fra enslig forsørger</List.Item>
                        <List.Item>Søknad som blitt sendt inn til Arena</List.Item>
                    </List>
                    <BodyShort>Hvis du er usikker, spør på teams.</BodyShort>
                </VStack>
            </div>
            <VStack gap={'1'}>
                <TextField
                    label={'Søkers fødselsnummer'}
                    onChange={(e) => {
                        settIdent(e.target.value);
                        settValgteBarn([]);
                        settPersoninfo(byggTomRessurs());
                        settOpprettBehandlingResponse(byggTomRessurs());
                    }}
                    autoComplete="off"
                />
                <Button variant={'secondary'} size={'small'} onClick={hentPersoninfo}>
                    Hent søkers barn fra folkeregisteret
                </Button>
            </VStack>

            <DataViewer response={{ personinfo }}>
                {({ personinfo }) => (
                    <>
                        <Heading size={'small'}>Informasjon om søker</Heading>
                        <RadioGroup
                            legend={
                                <HStack gap={'2'}>
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
                        <Button variant={'primary'} size={'small'} onClick={opprettBehandling}>
                            Opprett førstegangsbehandling
                        </Button>
                    </>
                )}
            </DataViewer>
            <DataViewer response={{ opprettBehandlingResponse }}>{() => <>Ok</>}</DataViewer>
        </Container>
    );
};

export default OpprettFørstegangsbehandlingAdmin;
