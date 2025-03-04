'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth() || { user: null };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Form Input App</span>
            </div>
            <div className="flex items-center">
              {user ? (
                <Link
                  href="/dashboard"
                  className="ml-4 px-4 py-2 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded text-sm font-medium text-blue-600 bg-white hover:bg-gray-100"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Create and Share Forms Easily
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Build custom forms, collect responses, and analyze data all in one place.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Create Forms</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Build custom forms with various field types including text, dropdown, date, and more.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Manage Email Lists</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Create and manage email lists to distribute your forms to the right audience.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Analyze Responses</h3>
                <p className="mt-2 text-sm text-gray-500">
                  View and export form responses to gain insights from your collected data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}