import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogin } from 'react-icons/ai';

interface CreateType {
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  web: string;
  image: {
    url: string;
    alt: string;
  };
  address: {
    state: string;
    country: string;
    city: string;
    street: string;
    houseNumber: number;
    zip: number;
  };
}

const patterns = {
  email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w .-]*)*\/?$/,
};

const CreateCard: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateType>();
  const navigate = useNavigate();

  const onCreate = (data: CreateType) => {
    axios.post('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards', data, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    })
      .then((res) => {
        localStorage.setItem('card_id', res.data._id);
        alert('Created successfully');
        navigate('/cards');
      })
      .catch((e) => {
        alert(`Error: ${e.response.data}`);
      });
  };

  return (
    <div className='w-1/3'>
      <div className="flex mt-10 flex-col shadow-md mb-10 bg-gray-100 dark:bg-gray-900 rounded-lg">
        <div>
          <h2 className="mt-8 text-center text-2xl leading-9 tracking-tight text-gray-900 dark:text-white">
            Create your Card
          </h2>
          <form noValidate onSubmit={handleSubmit(onCreate)} className="flex flex-col justify-end items-center px-6 py-12 lg:px-8 gap-4">
            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Title"
              type="text"
              {...register('title', {
                required: 'This field is mandatory',
                minLength: { value: 2, message: 'Too short' },
                maxLength: { value: 255, message: 'Too long' },
              })}
            />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Subtitle"
              type="text"
              {...register('subtitle', {
                required: 'This field is mandatory',
                minLength: { value: 2, message: 'Too short' },
                maxLength: { value: 255, message: 'Too long' },
              })}
            />
            {errors.subtitle && <p className="text-red-500">{errors.subtitle.message}</p>}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Description"
              type="text"
              {...register('description', {
                required: 'This field is mandatory',
                minLength: { value: 2, message: 'Too short' },
                maxLength: { value: 1024, message: 'Too long' },
              })}
            />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Phone"
              type="tel"
              {...register('phone', {
                required: 'This field is mandatory',
                minLength: { value: 9, message: 'Too short' },
                maxLength: { value: 14, message: 'Too long' },
              })}
            />
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Email"
              type="email"
              autoComplete="current-email"
              {...register('email', {
                required: 'This field is mandatory',
                pattern: {
                  value: patterns.email,
                  message: 'Invalid email',
                },
              })}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Website"
              type="url"
              {...register('web', {
                required: 'This field is mandatory',
                pattern: {
                  value: patterns.url,
                  message: 'Invalid URL',
                },
              })}
            />
            {errors.web && <p className="text-red-500">{errors.web.message}</p>}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Image URL"
              type="url"
              {...register('image.url', {
                pattern: {
                  value: patterns.url,
                  message: 'Invalid image URL',
                },
              })}
            />
            {errors.image?.url && <p className="text-red-500">{errors.image?.url.message}</p>}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Image Alt Text"
              type="text"
              {...register('image.alt', {
                minLength: { value: 2, message: 'Too short' },
                maxLength: { value: 255, message: 'Too long' },
              })}
            />
            {errors.image?.alt && <p className="text-red-500">{errors.image?.alt.message}</p>}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="State"
              type="text"
              {...register('address.state', {
                minLength: { value: 2, message: 'Too short' },
                maxLength: { value: 255, message: 'Too long' },
              })}
            />
            {errors.address?.state && <p className="text-red-500">{errors.address?.state.message}</p>}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Country"
              type="text"
              {...register('address.country', {
                required: 'This field is mandatory',
                minLength: { value: 2, message: 'Too short' },
                maxLength: { value: 255, message: 'Too long' },
              })}
            />
            {errors.address?.country && <p className="text-red-500">{errors.address?.country.message}</p>}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="City"
              type="text"
              {...register('address.city', {
                required: 'This field is mandatory',
                minLength: { value: 2, message: 'Too short' },
                maxLength: { value: 255, message: 'Too long' },
              })}
            />
            {errors.address?.city && <p className="text-red-500">{errors.address?.city.message}</p>}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Street"
              type="text"
              {...register('address.street', {
                required: 'This field is mandatory',
                minLength: { value: 2, message: 'Too short' },
                maxLength: { value: 255, message: 'Too long' },
              })}
            />
            {errors.address?.street && <p className="text-red-500">{errors.address?.street.message}</p>}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="House Number"
              type="number"
              {...register('address.houseNumber', {
                required: 'This field is mandatory',
                min: { value: 1, message: 'Too small' },
                max: { value: 9999, message: 'Too big' },
              })}
            />
            {errors.address?.houseNumber && <p className="text-red-500">{errors.address?.houseNumber.message}</p>}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Zip"
              type="number"
              {...register('address.zip', {
                required: 'This field is mandatory',
                min: { value: 0, message: 'Too small' },
              })}
            />
            {errors.address?.zip && <p className="text-red-500">{errors.address?.zip.message}</p>}

            <button type="submit" className="bg-gray-400 px-5 py-3 rounded-lg text-xl dark:bg-gray-800 text-white">Create</button>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default CreateCard;
