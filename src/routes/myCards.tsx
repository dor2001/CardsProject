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

const defaultImage = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';

const MyCards: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
    } else {
      fetchUserCards();
    }
  }, [navigate]);

  const fetchUserCards = async () => {
    try {
      const response = await axios.get<Card[]>('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/my-cards', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      setCards(response.data);
      setError(null);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setError("Error: Please Login");
      } else {
        setError("An error occurred.");
      }
      console.error("Error fetching user cards:", error);
    }
  };

  const filteredCards = cards.filter(card =>
    card.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center w-full text-left mt-5">
      <h2 className="text-3xl text-center mb-4 dark:text-white">My Cards</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
    
       <div className='w-3/4 mt-10 mb-10'>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCards.map((card, index) => (
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
            
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default MyCards;
