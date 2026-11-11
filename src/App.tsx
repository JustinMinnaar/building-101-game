import React from 'react';
import { QFactory3DView } from './components/QFactory3DView';

export const App: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <QFactory3DView />
    </div>
  );
};

export default App;
