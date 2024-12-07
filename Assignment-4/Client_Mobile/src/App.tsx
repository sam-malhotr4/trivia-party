import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Login from './pages/login';
import Index from './pages/index';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';


import '@ionic/react/css/palettes/dark.system.css';

import Register from './pages/register';
import Game from './pages/game';
import Room from './pages/room';
import './tailwind.css'
setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/" component={Index}/>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/game" component={Game}/>
          <Route exact path="/room" component={Room}/>
          
         
        </IonRouterOutlet>
        
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
