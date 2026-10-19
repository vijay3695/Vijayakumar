import { useState } from "react";
import ResumePortfolio from "./ResumePortfolio";
import FlipbookResume from "./FlipbookResume";
import "./styles/openzine-modal.css";

export default function App() {
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <>
      <ResumePortfolio onOpenBook={() => setBookOpen(true)} />
      {bookOpen && (
        <div className="openzine-modal" role="dialog" aria-modal="true" aria-label="Interactive resume book">
          <FlipbookResume onClose={() => setBookOpen(false)} />
        </div>
      )}
    </>
  );
}
