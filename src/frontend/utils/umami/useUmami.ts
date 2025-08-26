import { useEffect } from 'react';

import { erProd } from '../miljø';

export const useUmami = () => {
    useEffect(() => {
        if (erProd()) {
            return;
        }
        const umamiId = erProd()
            ? '4faef03-4e3b-4783-b1de-1df31f8695a1'
            : '4700b5e8-da50-4dfe-9884-219c02374cb0';

        const script = document.createElement('script');
        script.src = 'https://cdn.nav.no/team-researchops/sporing/sporing.js';
        script.defer = true;
        script.setAttribute('data-host-url', 'https://umami.nav.no');
        script.setAttribute('data-website-id', umamiId);

        document.body.appendChild(script);

        return () => {
            try {
                document.body.removeChild(script);
            } catch {
                /* empty */
            }
        };
    }, []);
};
