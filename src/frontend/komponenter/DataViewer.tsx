import React, { ReactElement, ReactNode } from 'react';

import SystemetLaster from './SystemetLaster/SystemetLaster';
import {
    erFeilressurs,
    harNoenRessursMedStatus,
    Ressurs,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';
import { Feilmelding } from './Feil/Feilmelding';
import { feiletRessursTilFeilmelding } from './Feil/feilmeldingUtils';

/**
 * Input: { behandling: Ressurss<Behandling>, personopslyninger: Ressurss<IPersonopplysninger> }
 * T = {behandling: Behandling, personopslyninger: IPersonoppslysninger}
 * P = behandling, personoppslyninger
 * keyof T = alle nøkkler i T, i dette tilfelle behandling og personoppslyninger
 * T[P] = Behandling og IPersonoppslyninger
 */
interface DataViewerProps<T extends Record<string, unknown>> {
    children: ((data: T) => React.ReactElement | null) | ReactNode;
    response: { [P in keyof T]: Ressurs<T[P]> };
}

// eslint-disable-next-line
const renderChildren = (children: any, response: any): ReactElement => {
    if (typeof children === 'function') {
        const data = Object.keys(response).reduce((acc: Record<string, unknown>, key) => {
            // eslint-disable-next-line
            acc[key] = (response[key] as RessursSuksess<any>).data;
            return acc;
        }, {});
        return children(data);
    }
    return children;
};

function DataViewer<T extends Record<string, unknown>>(
    props: DataViewerProps<T>
): JSX.Element | null {
    const { response, children } = props;
    const responses = Object.values(response);

    if (responses.some(erFeilressurs)) {
        return (
            <>
                {responses.filter(erFeilressurs).map((feilet, index) => (
                    <Feilmelding key={index} feil={feiletRessursTilFeilmelding(feilet)} />
                ))}
            </>
        );
    }
    if (harNoenRessursMedStatus(responses, RessursStatus.HENTER)) {
        return <SystemetLaster />;
    } else if (responses.every((response) => response.status === RessursStatus.SUKSESS)) {
        return renderChildren(children, response);
    } else {
        return null;
    }
}

export default DataViewer;
