import { lazy, Suspense } from "react";
import { render } from "react-dom";

import Options from "./Options";

const LedgerIframe = lazy(() => import("../components/LedgerIframe"));

// Render the UI.
// TOOD(react) createRoot is required: https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis
const container = document.getElementById("options");
render(
  <>
    <Options />
    <Suspense fallback={null}>
      <LedgerIframe />
    </Suspense>
  </>,
  container
);
