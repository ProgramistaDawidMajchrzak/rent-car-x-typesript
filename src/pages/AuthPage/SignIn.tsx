import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { register as registerUser } from '../../services/auth.service';
import { Image } from '../../components/Image';
import { getRoleFromToken } from '../../utils/jwt.utils';
import { useNavigate } from 'react-router-dom';
import { CustomModal } from '../../components/modal';


const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

type FormData = yup.InferType<typeof schema>;

export const SignInPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmUrl, setConfirmUrl] = useState('');

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
        const { username, email, password } = data;
        const response = await registerUser({ username, email, password });
        const token = response.jwtToken;
        const confirmLink = response.confirmationLink;
        localStorage.setItem("token", token);
        
        const role = getRoleFromToken(token);
        
        if(role){
          localStorage.setItem("role", role);
        }

        setConfirmUrl(confirmLink);
        setIsModalOpen(true);

        alert('Registration successful!');
    } catch (err) {
        alert('Registration failed. Check console for details.');
        console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex h-screen min-w-[screen]">
        <div className="flex flex-col justify-center p-10 w-1/2 max-md:w-full">
          <div className="mx-auto w-full max-w-[320px]">
            <div className="mb-4 text-2xl font-bold">Sign In</div>

            <div className="flex flex-col gap-4 mb-6">
              {/* Username */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Username</label>
                <input
                  {...register('username')}
                  placeholder="Enter your username"
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">{errors.username?.message}</p>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Email</label>
                <input
                  {...register('email')}
                  placeholder="Enter your email"
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">{errors.email?.message}</p>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Password</label>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="Enter your password"
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">{errors.password?.message}</p>
              </div>

              {/* Confirm Password (tylko lokalna walidacja) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold">Confirm Password</label>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="Confirm your password"
                  className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                />
                <p className="text-red-500 text-xs">{errors.confirmPassword?.message}</p>

                <div className="mt-1.5 text-xs font-bold cursor-pointer">
                  I forgot my password
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <a href="/login">
                <div className="flex items-center justify-center px-4 text-xs font-bold rounded border cursor-pointer border-slate-900 h-[30px] w-[160px] text-slate-900">
                  Log In
                </div>
              </a>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex justify-center items-center px-4 rounded cursor-pointer bg-slate-900 w-[160px] h-[30px] text-xs font-bold text-white disabled:opacity-50"
              >
                {isSubmitting ? 'Loading...' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center bg-[linear-gradient(155deg,#02193D_-0.86%,#02193D_98.91%)] w-1/2 max-md:hidden">
          <div className="flex flex-col items-center">
            <Image name="LogoAuth" className="w-[320px]" alt="Logo" />
          </div>
        </div>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        confirmUrl={confirmUrl}
      />
    </form>
  );
};
