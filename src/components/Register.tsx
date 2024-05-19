import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Header from './Header';
import Footer from './Footer';

interface RegisterUser {
    name: {
        first: string;
        middle?: string;
        last: string;
    };
    phone: string;
    email: string;
    password: string;
    image: {
        url?: string;
        alt?: string;
    };
    address: {
        state: string;
        country: string;
        city: string;
        street: string;
        houseNumber: number;
        zip: number;
    };
    isBusiness: boolean;
}

const patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{9,}$/,
    url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w .-]*)*\/?$/,
};

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterUser>();
    const [isBusiness, setIsBusiness] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onRegister = (data: RegisterUser) => {
        fetch('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            navigate('/login');
        })
        .catch((error) => console.error('Error:', error));
    };

    return (
        <>
            <Header />
            <div className='flex justify-center items-center'>
                <div className='w-1/3 bg-gray-300 dark:bg-gray-400 rounded-lg p-5 mt-10 mb-10 text-center'>
                    <h2 className='text-2xl font-semibold'>Register your account</h2>
                    <form onSubmit={handleSubmit(onRegister)} className='flex flex-col gap-4'>
                        <div>
                            <label>First Name:</label>
                            <input
                                type="text"
                                {...register("name.first", {
                                    required: "This field is mandatory",
                                    minLength: { value: 2, message: "Too short" },
                                    maxLength: { value: 255, message: "Too long" },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            {errors.name?.first && <p className="text-red-500">{errors.name.first.message}</p>}
                        </div>
                        <div>
                            <label>Middle Name:</label>
                            <input
                                type="text"
                                {...register("name.middle", {
                                    minLength: { value: 2, message: "Too short" },
                                    maxLength: { value: 255, message: "Too long" },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            {errors.name?.middle && <p className="text-red-500">{errors.name.middle.message}</p>}
                        </div>
                        <div>
                            <label>Last Name:</label>
                            <input
                                type="text"
                                {...register("name.last", {
                                    required: "This field is mandatory",
                                    minLength: { value: 2, message: "Too short" },
                                    maxLength: { value: 255, message: "Too long" },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            {errors.name?.last && <p className="text-red-500">{errors.name.last.message}</p>}
                        </div>
                        <div>
                            <label>Phone:</label>
                            <input
                                type="tel"
                                {...register("phone", {
                                    required: "This field is mandatory",
                                    minLength: { value: 9, message: "Too short" },
                                    maxLength: { value: 10, message: "Too long" },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "This field is mandatory",
                                    pattern: {
                                        value: patterns.email,
                                        message: "Invalid email",
                                    },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="">
                            <label>Password:</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register("password", {
                                    required: "This field is mandatory",
                                    pattern: {
                                        value: patterns.password,
                                        message: "Password must be at least 9 characters long and contain an uppercase letter, a lowercase letter, a number and one of the following characters !@#$%^&*-",
                                    },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="input-button"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                            {errors.password && <p className="text-red-500 w-56">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label>Image URL:</label>
                            <input
                                type="url"
                                {...register("image.url", {
                                    pattern: {
                                        value: patterns.url,
                                        message: "Invalid image URL",
                                    },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            {errors.image?.url && <p className="text-red-500">{errors.image.url.message}</p>}
                        </div>
                        <div>
                            <label>Image Description:</label>
                            <input
                                type="text"
                                {...register("image.alt", {
                                    minLength: { value: 2, message: "Too short" },
                                    maxLength: { value: 255, message: "Too long" },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            {errors.image?.alt && <p className="text-red-500">{errors.image.alt.message}</p>}
                        </div>
                        <div>
                            <label>State:</label>
                            <input
                                type="text"
                                {...register("address.state", {
                                    minLength: { value: 2, message: "Too short" },
                                    maxLength: { value: 255, message: "Too long" },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            {errors.address?.state && <p className="text-red-500">{errors.address.state.message}</p>}
                        </div>
                        <div>
                            <label>Country:</label>
                            <input
                                type="text"
                                {...register("address.country", {
                                    required: "This field is mandatory",
                                    minLength: { value: 2, message: "Too short" },
                                    maxLength: { value: 255, message: "Too long" },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            {errors.address?.country && <p className="text-red-500">{errors.address.country.message}</p>}
                        </div>
                        <div>
                            <label>City:</label>
                            <input
                                type="text"
                                {...register("address.city", {
                                    required: "This field is mandatory",
                                    minLength: { value: 2, message: "Too short" },
                                    maxLength: { value: 255, message: "Too long" },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            {errors.address?.city && <p className="text-red-500">{errors.address.city.message}</p>}
                        </div>
                        <div>
                            <label>Street:</label>
                            <input
                                type="text"
                                {...register("address.street", {
                                    required: "This field is mandatory",
                                    minLength: { value: 2, message: "Too short" },
                                    maxLength: { value: 255, message: "Too long" },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            {errors.address?.street && <p className="text-red-500">{errors.address.street.message}</p>}
                        </div>
                        <div>
                            <label>House Number:</label>
                            <input
                                type="number"
                                {...register("address.houseNumber", {
                                    required: "This field is mandatory",
                                    min: { value: 1, message: "Too small" },
                                    max: { value: 9999, message: "Too big" },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            {errors.address?.houseNumber && <p className="text-red-500">{errors.address.houseNumber.message}</p>}
                        </div>
                        <div>
                            <label>Zip:</label>
                            <input
                                type="number"
                                {...register("address.zip", {
                                    required: "This field is mandatory",
                                    min: { value: 1, message: "Too small" },
                                    max: { value: 99999, message: "Too big" },
                                })}
                                className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-1 w-full'
                            />
                            {errors.address?.zip && <p className="text-red-500">{errors.address.zip.message}</p>}
                        </div>
                        <div className='flex items-center'>
                            <input
                                type="checkbox"
                                checked={isBusiness}
                                {...register("isBusiness")}
                                onChange={(e) => setIsBusiness(e.target.checked)}
                                className='mr-2'
                            />
                            <label>Business:</label>
                        </div>
                        <button type="submit" className='p-2 bg-green-700 rounded-lg border-gray-400 border mt-2 hover:bg-green-800 transition-all duration-200'>
                            Register
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Register;
