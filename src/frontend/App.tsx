import React from "react";
import { InternalHeader, Spacer } from "@navikt/ds-react";

const App: React.FC = () => {
  return (
    <InternalHeader>
      <InternalHeader.Title as="h1">Tilleggsstønader</InternalHeader.Title>
      <Spacer />
      <InternalHeader.User name="Ola Normann" />
    </InternalHeader>
  );
};

export default App;
