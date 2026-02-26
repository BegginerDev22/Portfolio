import React, { useState } from 'react';
import { BootSequence } from './components/BootSequence';
import { Desktop } from './components/Desktop';

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <div className="antialiased text-gray-200">
      {!booted ? (
        <BootSequence onComplete={() => setBooted(true)} />
      ) : (
        <Desktop />
      )}
    </div>
  );
}
