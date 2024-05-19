import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface Card {
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

const CardEdit: React.FC = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Card>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // console.log("Card ID from URL:", id);
    if (id) {
      const fetchCard = async () => {
        try {
          const response = await axios.get(`https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`);
          const card = response.data;
          setValue("title", card.title);
          setValue("subtitle", card.subtitle);
          setValue("description", card.description);
          setValue("phone", card.phone);
          setValue("email", card.email);
          setValue("web", card.web);
          setValue("image.url", card.image.url);
          setValue("image.alt", card.image.alt);
          setValue("address.state", card.address.state);
          setValue("address.country", card.address.country);
          setValue("address.city", card.address.city);
          setValue("address.street", card.address.street);
          setValue("address.houseNumber", card.address.houseNumber);
          setValue("address.zip", card.address.zip);
        } catch (error) {
          console.log(error);
        }
      };
      fetchCard();
    }
  }, [id, setValue]);

  const onEdit = async (data: Card) => {
    try {
      const response = await axios.put(`https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`, data, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });
      localStorage.setItem("card_id", response.data._id);
      alert("Card edited successfully");
      navigate("/cards");
    } catch (e: any) {
      alert("Error editing card: " + e.response?.data);
    }
  };
  return (
    <div className='w-1/3'>
      <div className="flex mt-10 flex-col shadow-md mb-10 bg-gray-100 dark:bg-gray-900 rounded-lg">
        <div>
          <h2 className="mt-8 text-center text-2xl text-gray-900 dark:text-white">
            Edit Card
          </h2>

          <form noValidate onSubmit={handleSubmit(onEdit)} className="flex flex-col justify-end items-center px-6 py-12 lg:px-8 gap-4">
            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Title"
              type="text"
              {...register("title", {
                required: "This field is mandatory",
                minLength: { value: 2, message: "Too short" },
                maxLength: { value: 255, message: "Too long" },
              })}
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Subtitle"
              type="text"
              {...register("subtitle", {
                required: "This field is mandatory",
                minLength: { value: 2, message: "Too short" },
                maxLength: { value: 255, message: "Too long" },
              })}
            />
            {errors.subtitle && (
              <p className="text-red-500">{errors.subtitle.message}</p>
            )}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Description"
              type="text"
              {...register("description", {
                required: "This field is mandatory",
                minLength: { value: 2, message: "Too short" },
                maxLength: { value: 1024, message: "Too long" },
              })}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Phone"
              type="tel"
              {...register("phone", {
                required: "This field is mandatory",
                minLength: { value: 9, message: "Too short" },
                maxLength: { value: 14, message: "Too long" },
              })}
            />
            {errors.phone && (
              <p className="text-red-500">{errors.phone.message}</p>
            )}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Email"
              type="email"
              {...register("email", {
                required: "This field is mandatory",
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Website"
              type="url"
              {...register("web", {
                required: "This field is mandatory",
                pattern: {
                  value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w .-]*)*\/?$/,
                  message: "Invalid URL",
                },
              })}
            />
            {errors.web && (
              <p className="text-red-500">{errors.web.message}</p>
            )}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Image URL"
              type="url"
              {...register("image.url", {
                pattern: {
                  value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w .-]*)*\/?$/,
                  message: "Invalid image URL",
                },
              })}
            />
            {errors.image?.url && (
              <p className="text-red-500">{errors.image?.url.message}</p>
            )}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Image Alt Text"
              type="text"
              {...register("image.alt", {
                minLength: { value: 2, message: "Too short" },
                maxLength: { value: 255, message: "Too long" },
              })}
            />
            {errors.image?.alt && (
              <p className="text-red-500">{errors.image?.alt.message}</p>
            )}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="State"
              type="text"
              {...register("address.state", {
                minLength: { value: 2, message: "Too short" },
                maxLength: { value: 255, message: "Too long" },
              })}
            />
            {errors.address?.state && (
              <p className="text-red-500">{errors.address?.state.message}</p>
            )}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Country"
              type="text"
              {...register("address.country", {
                required: "This field is mandatory",
                minLength: { value: 2, message: "Too short" },
                maxLength: { value: 255, message: "Too long" },
              })}
            />
            {errors.address?.country && (
              <p className="text-red-500">{errors.address?.country.message}</p>
            )}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="City"
              type="text"
              {...register("address.city", {
                required: "This field is mandatory",
                minLength: { value: 2, message: "Too short" },
                maxLength: { value: 255, message: "Too long" },
              })}
            />
            {errors.address?.city && (
              <p className="text-red-500">{errors.address?.city.message}</p>
            )}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Street"
              type="text"
              {...register("address.street", {
                required: "This field is mandatory",
                minLength: { value: 2, message: "Too short" },
                maxLength: { value: 255, message: "Too long" },
              })}
            />
            {errors.address?.street && (
              <p className="text-red-500">{errors.address?.street.message}</p>
            )}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="House Number"
              type="number"
              {...register("address.houseNumber", {
                required: "This field is mandatory",
                min: { value: 1, message: "Too small" },
                max: { value: 256, message: "Too big" },
              })}
            />
            {errors.address?.houseNumber && (
              <p className="text-red-500">{errors.address?.houseNumber.message}</p>
            )}

            <input
              className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-600  dark:text-white text-left w-full"
              placeholder="Zip"
              type="number"
              {...register("address.zip", {
                required: "This field is mandatory",
                min: { value: 0, message: "Too small" },
              })}
            />
            {errors.address?.zip && (
              <p className="text-red-500">{errors.address?.zip.message}</p>
            )}

            <button type="submit" className="bg-gray-400 px-5 py-3 rounded-lg text-xl dark:bg-gray-800 text-white">Edit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CardEdit;
