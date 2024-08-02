// src/pages/home.tsx
import { useRouter } from 'next/router';
import { useState } from 'react';
const HomePage = () => {
  const router = useRouter();
  const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    if (id === 'login') {
      router.push('auth/login');
    } else if (id === 'signup') {
      router.push('auth/signup');
    }
  };

  return (
    <div>
      <div
        className='LoginBox'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div className='inblock min-w-[350px] bg-blue-100 text-center items-center rounded-lg p-4'>
          <div className='w-full p-4 flex items-center justify-center'>
            <img src='/images/incento_logo.png' />
          </div>
          <div className='w-full p-4 flex items-center justify-center'>
            <button
              id='login'
              className='p-2 rounded-lg border-white bg-blue-300 text-white text-sm m-1'
              onClick={handleButton}
            >
              로그인
            </button>
            <button
              id='signup'
              className='p-2 rounded-lg border-white bg-green-300 text-white text-sm m-1'
              onClick={handleButton}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
