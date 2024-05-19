import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Content from './components/Content';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import CardForm from './components/NewCard';
import CardsContainer from './components/Cards.tsx';
import CardPage from './routes/Card.tsx';
import CardEdit from './components/EditCard';
import FavoriteCards from './routes/FavCards.tsx';
import MyCards from './routes/myCards.tsx';
import AdminPanel from './routes/Admin.tsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Content />,
    children: [
      { index: true, path: '/', element: <CardsContainer /> },
      { path: 'cards', element: <CardsContainer /> },
      { path: '/cards/:cardId', element: <CardPage /> },
      { path: '/cardedit/:id', element: <CardEdit /> },
      { path: 'favorites', element: <FavoriteCards /> }, // Add this line
      { path: 'mycards', element: <MyCards /> }, // Add this line
      
      { path: 'newcard', element: <CardForm /> },
      
      { path: 'admin', element: <AdminPanel /> }, // Add this line
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
     
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
