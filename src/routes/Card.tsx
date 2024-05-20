import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

interface Card {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  web: string;
  image: {
    url: string;
    alt: string;
    _id: string;
  };
  address: {
    state: string;
    country: string;
    city: string;
    street: string;
    houseNumber: number;
    zip: number;
    _id: string;
  };
  bizNumber: number;
  likes: string[];
  user_id: string;
  createdAt: string;
  __v: number;
}

interface DecodedToken {
  isAdmin: boolean;
  _id: string;
}

const CardPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const defaultImage = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: DecodedToken = JSON.parse(atob(token.split('.')[1]));
      setIsAdmin(decodedToken.isAdmin);
      setUserId(decodedToken._id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get<Card>(`https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`);
        setCard(response.data);
      } catch (error) {
        setError('Error fetching card data');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [cardId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='max-w-2xl mx-auto my-10 p-5 border border-gray-300 rounded-md text-left dark:border-gray-950 dark:bg-gray-900 '>
      <div className="relative bg-white dark:bg-gray-900 dark:text-white shadow-md rounded-md overflow-hidden">
        <img
          src={card?.image?.url || defaultImage}
          alt={card?.image?.alt || 'Default image'}
          className="w-full h-64 object-cover"
          onError={(e) => (e.currentTarget.src = defaultImage)}
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{card?.title}</h1>
          <h2 className="text-xl mb-2">{card?.subtitle}</h2>
          <p className="text-gray-700 dark:text-white mb-4">{card?.description}</p>
          <div className='bg-gray-200 dark:bg-gray-900 rounded-md p-2 border border-gray-300 mb-5'>
            <h3 className='text-xl mb-2'>Links</h3>
            <a href={`tel:${card?.phone}`} className="text-blue-500 hover:underline">{card?.phone}</a>
            <br />
            <a href={`mailto:${card?.email}`} className="text-blue-500 hover:underline">{card?.email}</a>
            <br />
            <a href={card?.web} className="text-blue-500 hover:underline mb-4">{card?.web}</a>
          </div>
          <div className='bg-gray-200 rounded-md dark:bg-gray-900 p-2 border border-gray-300'>
            <h3 className='text-xl'>Address</h3>
            <p className="text-gray-600 dark:text-white">{`${card?.address?.street || ''}, ${card?.address?.city || ''}, ${card?.address?.country || ''}`}</p>
          </div>
        </div>
      </div>
      {(isAdmin || userId === card?.user_id) && (
        <Link to={`/cardedit/${cardId}`}>
          <div className='p-3 hover:bg-gray-500 transition-all duration-150 text-center text-lg bg-gray-400 rounded-lg dark:bg-gray-900 dark:hover:bg-gray-950 border-gray-300 border text-white font-semibold mt-5'>
            Edit Card
          </div>
        </Link>
      )}
    </div>
  );
};

export default CardPage;
