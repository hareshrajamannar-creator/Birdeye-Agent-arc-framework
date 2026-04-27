import { ReactFlowProvider } from '@xyflow/react';
import AgentBuilder from './components/AgentBuilder/AgentBuilder';
import '@xyflow/react/dist/style.css';

function App() {
  return (
    <ReactFlowProvider>
      <AgentBuilder />
    </ReactFlowProvider>
  );
}

export default App;
