import { useForm } from 'react-hook-form';
import { LockClosedIcon } from '@heroicons/react/solid';
import StellarLogo from './StellarLogo';
import { useMutation } from 'react-query';
import { loginUser } from './state/api';
import { parseAndToast } from './state/utils';
import { useRecoilState } from 'recoil';
import { userAtom } from './state/atoms';
import { useNavigate } from 'react-router';

function Login() {
  const { register, handleSubmit } = useForm();
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();

  const onSubmit = ({ publicKey }: any) => {
    LoginMutation.mutate({ publicKey: publicKey });
  };

  const LoginMutation = useMutation(
    ({ publicKey }: { publicKey: string }) => loginUser(publicKey),
    {
      mutationKey: 'login',
      onSuccess: (res) => {
        setUser(res);
        navigate('/mint');
      },
      onError: (e) => {
        parseAndToast(e);
      },
    }
  );

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-auto">
            <StellarLogo />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your Stellar account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                Stellar Public Key
              </label>
              <input
                {...register('publicKey', { required: true })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Public Key"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

/* <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Secret Key:
        <input {...register('secret')} />
      </label>
      <input type="submit" value="submit" />
    </form> */
