declare module 'react-router-prompt' {
    import React from 'react';

    import { BlockerFunction, Location } from 'react-router-dom';

    interface ReactRouterPromptProps {
        when: boolean | BlockerFunction;
        children: (data: {
            isActive: boolean;
            onCancel: () => void;
            onConfirm: () => void;
            nextLocation?: Location;
        }) => React.ReactNode;
        beforeCancel?: () => Promise<unknown>;
        beforeConfirm?: (nextLocation?: Location) => Promise<unknown>;
    }

    function ReactRouterPrompt(props: ReactRouterPromptProps): React.JSX.Element | null;

    export default ReactRouterPrompt;
}
