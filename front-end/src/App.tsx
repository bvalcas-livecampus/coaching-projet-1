import { BrowserRouter, Routes, Route } from 'react-router';
import Header from './component/header/header';
import Login from './routes/login/login';
import Characters from './routes/characters/characters';
import EditCharacter from './routes/characters/edit-character';
import SignIn from './routes/sign-in/sign-in';
import ForgotPassword from './routes/forgot-password/forgot-password';
import CreateCharacter from './routes/characters/create-character';
import Dashboard from './routes/dashboard/dashboard';
import TournamentList from './routes/tournament/tournament';
import TournamentDetails from './routes/tournament/tournament-details';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Login />} />
          <Route index path="/login" element={<Login />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="characters" element={<Characters />} />
          <Route path="characters/:id/edit" element={<EditCharacter />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="characters/create" element={<CreateCharacter />} />
          <Route path="tournament" element={<TournamentList />} />
          <Route path="tournament/:id" element={<TournamentDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
