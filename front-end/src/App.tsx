import { BrowserRouter, Routes, Route } from 'react-router';
import Header from './component/header/header';
import Login from './routes/login/login';
import Characters from './routes/characters/characters';
import EditCharacter from './routes/characters/edit-characters';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Login />} />
          <Route path="characters" element={<Characters />} />
          <Route path="characters/:id/edit" element={<EditCharacter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
