import groq from 'groq';

export const hentMalerQuery = (hentUPubliserte: boolean = false) =>
    hentUPubliserte
        ? groq`*[ytelse == $ytelse && resultat in $resultat] | order(visningsnavn asc)`
        : groq`*[ytelse == $ytelse && resultat in $resultat && publisert == true] | order(visningsnavn asc)`;

export const malQuery = (id: string, målform: 'bokmål' = 'bokmål') => groq`*[_id == "${id}"][0]{
...,
    "brevtittel": brevtittel.${målform === 'bokmål' ? 'tittelNB' : ''},
    "delmaler": delmaler[]{
        ...,
        ...delmalReferanse->{
            ..., 
            "blocks": nb[]{
                ...,
                _type == "block" => {
                     "markDefs": markDefs[]{
                        ...,
                        _type=="variabel" => variabelreferanse -> {...}    
                     }
                },
                _type == "fritekst" => { "parentId": ^._id },
                _type == "valgfeltReferanse" => valgfelt-> {
                    ...,
                    valg[] {
                        ...,
                        _type == "reference" => @->{
                            ...,
                            "innhold": nb[]{
                                ...,
                                "markDefs": markDefs[]{
                                    ...,
                                    _type=="variabel" => variabelreferanse -> {...}
                                 }
                            },
                            "variabler": nb[].markDefs[]{
                                ...,
                                _type=="variabel" => variabelreferanse -> {...}        
                            },
                        },
                        _type == "fritekst" => { "parentId": ^._id }
                    }
                }
            }   
        }
    }    
}`;
