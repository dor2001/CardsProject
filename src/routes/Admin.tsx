import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { Dialog } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  phone: string;
  email: string;
  image: {
    url: string;
    alt: string;
  };
  address: {
    state?: string;
    country: string;
    city: string;
    street: string;
    houseNumber: number;
    zip: number;
  };
  isAdmin: boolean;
  isBusiness: boolean;
  createdAt: string;
}

interface Card {
  _id: string;
  title: string;
  user_id: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [selectedUserCards, setSelectedUserCards] = useState<Card[]>([]);
  const [viewingCardsUserId, setViewingCardsUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<User>();
  const token = localStorage.getItem('token') || '';
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const parsedToken = JSON.parse(atob(token.split('.')[1]));
      if (!parsedToken.isAdmin) {
        navigate('/');
        return;
      }
    } else {
      navigate('/');
      return;
    }

    fetchUsers();
    fetchAllCards();
  }, [navigate, token]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users', {
        headers: {
          'x-auth-token': token,
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAllCards = async () => {
    try {
      const response = await axios.get('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards');
      setAllCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const fetchUserCards = (userId: string) => {
    const userCards = allCards.filter(card => card.user_id === userId);
    setSelectedUserCards(userCards);
    setViewingCardsUserId(userId);
  };

  const openUpdateDialog = (user: User) => {
    setSelectedUser(user);
    setValue("name.first", user.name.first);
    setValue("name.middle", user.name.middle);
    setValue("name.last", user.name.last);
    setValue("phone", user.phone);
    setValue("image.url", user.image.url);
    setValue("image.alt", user.image.alt);
    setValue("address.state", user.address.state);
    setValue("address.country", user.address.country);
    setValue("address.city", user.address.city);
    setValue("address.street", user.address.street);
    setValue("address.houseNumber", user.address.houseNumber);
    setValue("address.zip", user.address.zip);
    setIsOpen(true);
  };

  const closeUpdateDialog = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setSelectedUser(null);
  };

  const handleUpdate = async (data: Partial<User>) => {
    if (!selectedUser) return;
    const updateUser = {
      name: data.name,
      phone: data.phone,
      image: data.image,
      address: data.address,
    };
    try {
      await axios.put(`https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${selectedUser._id}`, updateUser, {
        headers: {
          'x-auth-token': token,
        },
      });
      fetchUsers();
      closeUpdateDialog();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(`https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${selectedUser._id}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      fetchUsers();
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleBusinessStatus = async (user: User) => {
    try {
      await axios.patch(`https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${user._id}`, 
      { isBusiness: !user.isBusiness }, {
        headers: {
          'x-auth-token': token,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling business status:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.name.first} ${user.name.last}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 text-left ltr">
      <h1 className="text-2xl font-bold mb-4 dark:text-white text-center">Admin Panel</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-md w-full"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cards</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => {
              const userCards = allCards.filter(card => card.user_id === user._id);
              return (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => openUpdateDialog(user)} className="text-blue-600 hover:text-blue-900 ml-4">Edit</button>
                    <button onClick={() => openDeleteDialog(user)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => toggleBusinessStatus(user)} className="text-indigo-600 hover:text-indigo-900">
                      {user.isBusiness ? 'Remove Business' : 'Set Business'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {userCards.length > 0 ? (
  viewingCardsUserId === user._id && selectedUserCards.length > 0 ? (
    <div>
      {selectedUserCards.map((card) => (
        <div key={card._id}>
          <Link to={`/cards/${card._id}`} className="text-blue-600 hover:underline">{card.title}</Link>
        </div>
      ))}
    </div>
  ) : (
    <button onClick={() => fetchUserCards(user._id)} className="text-blue-600 hover:underline">View Cards</button>
  )
) : (
  <div>No cards</div>
)}

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.name.first} {user.name.middle} {user.name.last}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={isOpen} onClose={closeUpdateDialog} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <Dialog.Title className="text-lg font-medium">Update User</Dialog.Title>
            <form onSubmit={handleSubmit(handleUpdate)} className="mt-4 space-y-4">
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  {...register("name.first", { required: "First name is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.name?.first && <p className="text-red-500">{errors.name.first.message}</p>}
              </div>
              <div>
                <label>Middle Name</label>
                <input
                  type="text"
                  {...register("name.middle")}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  {...register("name.last", { required: "Last name is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.name?.last && <p className="text-red-500">{errors.name.last.message}</p>}
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="text"
                  {...register("phone", { required: "Phone number is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
              </div>
              <div>
                <label>Image URL</label>
                <input
                  type="url"
                  {...register("image.url", { required: "Image URL is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.image?.url && <p className="text-red-500">{errors.image.url.message}</p>}
              </div>
              <div>
                <label>Image Alt</label>
                <input
                  type="text"
                  {...register("image.alt", { required: "Image description is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.image?.alt && <p className="text-red-500">{errors.image.alt.message}</p>}
              </div>
              <div>
                <label>State</label>
                <input
                  type="text"
                  {...register("address.state")}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label>Country</label>
                <input
                  type="text"
                  {...register("address.country", { required: "Country is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.address?.country && <p className="text-red-500">{errors.address.country.message}</p>}
              </div>
              <div>
                <label>City</label>
                <input
                  type="text"
                  {...register("address.city", { required: "City is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.address?.city && <p className="text-red-500">{errors.address.city.message}</p>}
              </div>
              <div>
                <label>Street</label>
                <input
                  type="text"
                  {...register("address.street", { required: "Street is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.address?.street && <p className="text-red-500">{errors.address.street.message}</p>}
              </div>
              <div>
                <label>House Number</label>
                <input
                  type="number"
                  {...register("address.houseNumber", { required: "House number is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.address?.houseNumber && <p className="text-red-500">{errors.address.houseNumber.message}</p>}
              </div>
              <div>
                <label>Zip</label>
                <input
                  type="number"
                  {...register("address.zip", { required: "Zip code is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.address?.zip && <p className="text-red-500">{errors.address.zip.message}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeUpdateDialog} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Update</button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      <Dialog open={isDeleteOpen} onClose={closeDeleteDialog} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <Dialog.Title className="text-lg font-medium">Delete User</Dialog.Title>
            <div className="mt-4">
              <p>Are you sure you want to delete this user?</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={closeDeleteDialog} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
