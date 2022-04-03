import logo from './logo.svg';
import './App.css';
import { HashRouter as Router, Routes, Route, NavLink} from 'react-router-dom'
import Main from './Components/Main'
import TheTest from './Components/Test'

function App() {
  return (
	<Router>
	  <div>
		<ul>
			<li><NavLink to='/'>Lobby</NavLink></li>
			<li><NavLink to='/test'>Test</NavLink></li>
		</ul>
		<Routes>
		  <Route exact path="/" element={<Main />} />
		  {/* <Route path='/test' element={<TheTest />} /> */}
		</Routes>
	  </div>
	</Router>
  );
}

export default App;
