import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

interface Card {
  _id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  phone?: string;
  email?: string;
  web?: string;
  image: {
    url?: string;
    alt?: string;
    _id?: string;
  };
  address: {
    state?: string;
    country?: string;
    city?: string;
    street?: string;
    houseNumber?: number;
    zip?: number;
    _id?: string;
  };
  bizNumber?: number;
  likes?: string[];
  user_id?: string;
  createdAt?: string;
  __v?: number;
}

interface AppProps {
  searchQuery: string;
}

const App: React.FC<AppProps> = ({ searchQuery }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [favoriteCards, setFavoriteCards] = useState<string[]>([]);
  const navigate = useNavigate();
  const defaultImage = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
    } else {
      const parsedToken = JSON.parse(atob(token.split('.')[1]));
      setUserId(parsedToken._id);
      setIsAdmin(parsedToken.isAdmin);
      fetchCards();
      loadFavoriteCards();
    }
  }, [navigate]);

  const fetchCards = async () => {
    try {
      const response = await axios.get<Card[]>('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards');
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const loadFavoriteCards = () => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteCards') || '[]');
    setFavoriteCards(storedFavorites);
  };

  const handleFavorite = (cardId: string) => {
    let updatedFavorites;
    if (favoriteCards.includes(cardId)) {
      updatedFavorites = favoriteCards.filter(id => id !== cardId);
    } else {
      updatedFavorites = [...favoriteCards, cardId];
    }
    setFavoriteCards(updatedFavorites);
    localStorage.setItem('favoriteCards', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (cardId: string) => {
    return favoriteCards.includes(cardId);
  };

  const handleLike = async (cardId: string) => {
    try {
      const response = await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`,
        { like: userId },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );
      const updatedCard = response.data;
      setCards((prevCards) =>
        prevCards.map((card) => (card._id === updatedCard._id ? updatedCard : card))
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const deleteCardHandler = async (id: string) => {
    try {
      await axios.delete(`https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      setCards((prevCards) => prevCards.filter((card) => card._id !== id));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const filteredCards = cards.filter((card) =>
    card.title && card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='w-3/4 mt-10 mb-10'>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCards.map((card) => (
          <div key={card._id} className="relative bg-white dark:bg-gray-300 text-left shadow-md rounded-md overflow-hidden">
            <Link to={`/cards/${card._id}`}>
              <img
                src={card.image?.url || defaultImage}
                alt={card.image?.alt || 'Default image'}
                className="w-full h-48 object-cover"
                onError={(e) => (e.currentTarget.src = defaultImage)}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                <p className="text-gray-600 mb-2">{card.subtitle}</p>
                <p className="text-gray-700 mb-4">{card.description}</p>
                
                  <a href={`tel:${card.phone}`} className="text-blue-500 hover:underline">{card.phone}</a>
                  <br />
                  <a href={`mailto:${card.email}`} className="text-blue-500 hover:underline">{card.email}</a>
                  <br />
                
                <a href={card.web} className="text-blue-500 hover:underline">{card.web}</a>
              </div>
            </Link>
            <div className='mt-10 flex justify-end items-end'>
              <div className={`absolute w-full bottom-0 dark:bg-gray-300 ${card.likes?.includes(userId as string) ? 'text-gray-800' : 'text-gray-800'}`}>
                <div className="flex justify-between px-1">
                  {isAdmin && (
                    <button onClick={() => deleteCardHandler(card._id)} className="text-red-800 hover:underline bg-red-300 rounded-lg px-2 m-2 hover:bg-red-400 hover:text-white transition-all duration-100">
                      Delete
                    </button>
                  )}
                  <div className='w-1/2 flex justify-between bg-gray-400 rounded-md px-2 m-2 items-center'>
                    <span>Likes: {card.likes?.length}</span>
                    <span className='bg-gray-500 w-px h-full'></span>
                    <button
                      className={`text-${card.likes?.includes(userId as string) ? 'red' : 'gray'}-600 text-md font-semibold`}
                      onClick={() => handleLike(card._id)}
                    >
                      {card.likes?.includes(userId as string) ? 'Liked' : 'Like'}
                    </button>
                  </div>
                  <div
                    className={`px-2 m-2 text-${isFavorite(card._id) ? 'yellow' : 'gray'}-600 text-xl font-semibold ml-2 cursor-pointer`}
                    onClick={() => handleFavorite(card._id)}
                  >
                    {isFavorite(card._id) ? '⛔' : '💚'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
