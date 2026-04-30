import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 32,
          fontFamily: 'monospace',
          fontSize: 14,
          color: '#c62828',
          background: '#fff8f8',
          border: '1px solid #ffcdd2',
          margin: 24,
          borderRadius: 6,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}>
          <strong>Runtime error — check the browser console for the full stack trace.</strong>
          {'\n\n'}
          {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
