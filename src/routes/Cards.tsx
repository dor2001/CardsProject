import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Cards = () => {
    const [response, setResponse] = useState<any>(null);
    const token = localStorage.getItem('token');
const [searchQuery, setSearchQuery] = useState<string>("");
    const fetchData = async () => {
        try {
            const response = await axios.get('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/my-cards', {
                headers: {
                    'x-auth-token': token,
                }
            });
            setResponse(response.data);
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching cards information:', error.response?.data.message);
            } else {
                console.error('Unknown error:', error);
            }
        }
    };
// console.log(response)
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="grid grid-cols-3 gap-4 w-2/3 !text-left">
                        <div className=" bg-red-200 m-2 dark:bg-slate-500 border rounded-md search-place pl-6">
                <input
                    type="text"
                    placeholder="Search cards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 my-2 md:ml-6 w-80 border rounded-md"
                />
            </div>
            {response ? (
                response.map((card: any) => (
                    <div className="bg-white p-4 shadow-md rounded-md relative">
                        <div className="w-full h-40">
                            <img src={card.image.url} alt="Card Image" className="w-full h-full object-cover rounded " />
                        </div>
                        <h2 className="text-xl font-bold">{card.title}</h2>
                        <p className="text-gray-500 mb-5">{card.description}</p>
                        
                        <p className="text-gray-500">
                            <span className='font-semibold'>Card Number: </span>
                            {card.bizNumber}</p>
                        <p className="text-gray-500">
                            <span className='font-semibold'>Address: </span>
                            {card.address.country}, {card.address.city} {card.address.street} {card.address.houseNumber}</p>
                        <p className="text-gray-500">
                            <span className='font-semibold'>Phone Number: </span>
                            {card.phone}</p>
                            <div className='absolute bottom-0 right-0 p-2'>
                                <a href={`tel:${card.phone}`}><i className="fas fa-phone"></i></a>
                            </div>
                    </div>
                ))
            ) : (
                <div>Cards is loading...</div>
            )}
        </div>
    );
};

export default Cards;