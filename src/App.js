import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import { DefaultLayout } from './layouts';

import { publicRoutes } from './routes';
import { Fragment } from 'react';

import ContextProvider from './contexts/ContextProvider.js';


function App() {
  return (
    <Router>
      <div className="App">
        <ContextProvider>
          <Routes>
            {publicRoutes.map((route, index) => {
              let Layout = DefaultLayout;
              
              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }
              const Page = route.component;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </ContextProvider>
      </div>
    </Router>
  );
}

export default App;