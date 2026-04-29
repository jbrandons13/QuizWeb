import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinGame from './pages/joingame';
import WaitingRoom from './pages/waitingroom';

const Login = lazy(() => import('./pages/login')) ;
const SignUp = lazy(() => import('./pages/signup'));
const Home = lazy(() => import('./pages/home'));
const GameDetail = lazy(() => import('./pages/gamedetail'));
const PlayPage = lazy(() => import('./pages/play'));
const RecordPage = lazy(()=> import('./pages/record'));

// import Login from './pages/login';
// import SignUp from './pages/signup';
// import Home from './pages/home';
// import GameDetail from './pages/gamedetail';
// import PlayPage from './pages/play';

function App() {  
  // console.log('App renders');
  return (
    <Router>
      <Routes>
        <Route path='/' element={<JoinGame/>} />
        <Route path='/:gamecode' element={<JoinGame/>} />
        <Route path='/room/:gamecode' element={<WaitingRoom/>} />
        <Route path='/signin' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/gamedetail/:uuid/:action' element={<GameDetail/>}/>
        <Route path='/play' element={<PlayPage/>}/>
        <Route path='/record/:gameid' element={<RecordPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
