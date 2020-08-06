import React from 'react';
import './App.css';
import { Route, withRouter } from 'react-router-dom'
import CoverPage from './pages/CoverPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import AddSubs from './pages/AddSubs'
import EditSubs from './pages/EditSubs'
import Settings from './pages/Settings'
import { ToastContainer } from 'react-toastify'
import AnimatedSwitch from './AnimatedSwitch'

const routes = [
  {
      component: CoverPage,
      path: "/"
  },

  {
      component: LoginPage,
      path: '/login'
  },

  {
    component: SignUpPage,
    path: '/signup'
  },
  
  {
    component: HomePage,
    path: '/home'
  },

  {
    component: AddSubs,
    path: '/add'
  },

  {
    component: EditSubs,
    path: '/edit'
  },

  {
    component: Settings,
    path: '/settings'
  },

]

const App = withRouter(({location}) =>  {
  return (
      <div>
        <ToastContainer closeButton={false} autoClose={5000} style={{marginTop: '54px'}} />
        <AnimatedSwitch location={location}>
            {routes.map(route => {
              return (
                <Route exact 
                  key={route.path}
                  path={route.path}
                  component={route.component}
                  />
              )
            })}
        </AnimatedSwitch>
      </div>
  );
})

export default App;
