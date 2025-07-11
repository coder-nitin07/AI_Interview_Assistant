import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssistantPage from "./pages/AssistantPage";
import PreviewPage from "./pages/PreviewPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AssistantPage />} />
        <Route path="/preview-ui/:id" element={<PreviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
