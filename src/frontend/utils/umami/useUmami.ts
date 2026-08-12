import { useEffect } from 'react';

import { erProd } from '../miljø';

export const useUmami = () => {
    useEffect(() => {
        const innblikkId = erProd()
            ? '74faef03-4e3b-4783-b1de-1df31f8695a1'
            : '4700b5e8-da50-4dfe-9884-219c02374cb0';

        const innblikkScript = erProd()
            ? 'https://cdn.nav.no/team-researchops/sporing/sporing.js'
            : 'https://cdn.nav.no/team-researchops/sporing/sporing-dev.js';

        const script = document.createElement('script');
        script.src = innblikkScript;
        script.defer = true;
        script.setAttribute('data-website-id', innblikkId);

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
