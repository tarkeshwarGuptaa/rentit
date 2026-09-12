import { Helmet } from 'react-helmet-async';
import RegisterForm from '../components/auth/RegisterForm';
import { FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>Create Account — RoomNear</title>
      </Helmet>

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-surface-50">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-[var(--radius-input)] flex items-center justify-center">
                <FiHome className="w-5 h-5 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-surface-900 font-[var(--font-display)]">
              let us start with us
            </h1>
            <p className="text-surface-700/60 text-sm mt-1">
              Join RoomNear as a student or landlord
            </p>
          </div>

          <div className="bg-white border border-surface-200 rounded-[var(--radius-card)] p-6 sm:p-8 shadow-[var(--shadow-card)]">
            <RegisterForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
