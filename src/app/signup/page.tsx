'use client';

import React from 'react';
import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';

export default function Signup() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            log in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignupForm />
        <div className="mt-6 text-center">
          <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}