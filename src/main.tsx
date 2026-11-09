import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import {ContentProvider} from './lib/content';

createRoot(document.getElementById('root')!).render(
  <ContentProvider>
    <App />
  </ContentProvider>,
);
