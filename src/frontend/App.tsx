import React from "react";
import { InternalHeader, Spacer } from "@navikt/ds-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <>
      <InternalHeader>
        <InternalHeader.Title as="h1">Tilleggsstønader</InternalHeader.Title>
        <Spacer />
        <InternalHeader.User name="Ola Normann" />
      </InternalHeader>
      <BrowserRouter>
        <Routes>
          <Route
            path={"/person/:fagsakPersonId/*"}
            element={<p>Personside</p>}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
