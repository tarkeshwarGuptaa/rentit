import { Helmet } from 'react-helmet-async';
import RegisterForm from '../components/auth/RegisterForm';
import { MdOutlineExplore } from 'react-icons/md';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>Create Account — RoomNear</title>
      </Helmet>

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-zinc-50">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <MdOutlineExplore size={40} className="text-indigo-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                rentIt
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900 font-display">
              let us start with us
            </h1>
            <p className="text-zinc-700/60 text-sm mt-1">
              Join rentIt as a student or landlord
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <RegisterForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
