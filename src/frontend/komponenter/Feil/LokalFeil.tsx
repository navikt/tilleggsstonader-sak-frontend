import React, { Component, ErrorInfo, FC, ReactNode } from 'react';

import { BodyShort, LocalAlert } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';

interface Props {
    children: ReactNode;
}

interface State {
    feil: Error | null;
}

const LokalFeilInnhold: FC<{ feil: Error }> = ({ feil }) => {
    const { appEnv } = useApp();
    const erUtvikling = appEnv.unleashEnv !== 'production';

    return (
        <LocalAlert status="error">
            <LocalAlert.Header>
                <LocalAlert.Title>Det har oppstått en feil</LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>
                {erUtvikling ? (
                    <BodyShort>{feil.message}</BodyShort>
                ) : (
                    <BodyShort>
                        En uventet feil oppstod. Vennligst ta kontakt med utviklerteamet på Teams.
                    </BodyShort>
                )}
            </LocalAlert.Content>
        </LocalAlert>
    );
};

export class LokalFeil extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { feil: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { feil: error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // eslint-disable-next-line no-console
        console.error('LokalFeil fanget en feil:', error, info.componentStack);
    }

    render() {
        if (this.state.feil) {
            return <LokalFeilInnhold feil={this.state.feil} />;
        }

        return this.props.children;
    }
}
