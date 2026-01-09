import * as L from 'leaflet';

declare module 'leaflet' {
    namespace Proj {
        interface ProjCRSOptions {
            origin?: [number, number];
            resolutions?: number[];
        }

        class CRS extends L.CRS {
            constructor(code: string, proj4def: string, options?: ProjCRSOptions);
        }
    }
}
