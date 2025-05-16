import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Sign from './Pages/Sign';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Create from './Pages/Create';
import View from './Pages/View';
import List from './Pages/List';
import Update from './Pages/Update';
import Delete from './Pages/Delete';
import Pro from './Components/Pro';
const App=()=>{
  return(
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Sign />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/home' element={<Pro><Home /></Pro>}/>
          <Route path='/create' element={<Pro><Create /></Pro>}/>
          <Route path='/view' element={<Pro><View /></Pro>}/>
          <Route path='edit' element={<Pro><List /></Pro>}/>
          <Route path='/update/:id' element={<Pro><Update /></Pro>} />
          <Route path='/delete' element={<Pro><Delete /></Pro>}/>

        </Routes>
      </Router>
    </>
  )
}
export default App;