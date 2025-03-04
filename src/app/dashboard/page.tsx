'use client';

import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/layout/Dashboard';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Form {
  _id: string;
  title: string;
  createdAt: string;
  responseCount?: number;
}

interface EmailList {
  _id: string;
  name: string;
  emails: { email: string; name?: string }[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [emailLists, setEmailLists] = useState<EmailList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.log('No user available for API calls');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching dashboard data for user:', user.email);
        const token = await user.getIdToken();
        console.log('Got token for API calls');
        
        // Fetch forms
        try {
          const formsResponse = await fetch('/api/forms', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (formsResponse.ok) {
            const formsData = await formsResponse.json();
            console.log('Forms fetched:', formsData.forms.length);
            setForms(formsData.forms);
          } else {
            console.error('Failed to fetch forms:', await formsResponse.text());
          }
        } catch (formError) {
          console.error('Error fetching forms:', formError);
        }
        
        // Fetch email lists
        try {
          const emailListsResponse = await fetch('/api/email-lists', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (emailListsResponse.ok) {
            const emailListsData = await emailListsResponse.json();
            console.log('Email lists fetched:', emailListsData.emailLists.length);
            setEmailLists(emailListsData.emailLists);
          } else {
            console.error('Failed to fetch email lists:', await emailListsResponse.text());
          }
        } catch (emailError) {
          console.error('Error fetching email lists:', emailError);
        }
      } catch (error) {
        console.error('Error in dashboard data fetching:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <Dashboard>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {forms.length === 0 && emailLists.length === 0 && (
              <div className="bg-white p-8 rounded-lg shadow text-center mb-6">
                <h2 className="text-xl font-semibold mb-4">Welcome to Form Input App!</h2>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first form or email list.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/forms/new"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First Form
                  </Link>
                  <Link
                    href="/email-lists/new"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Create Email List
                  </Link>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Your Forms</h2>
                  <Link
                    href="/forms/new"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Form
                  </Link>
                </div>
                
                {forms.length === 0 ? (
                  <p className="text-gray-500">You haven't created any forms yet.</p>
                ) : (
                  <div className="space-y-3">
                    {forms.map((form) => (
                      <div key={form._id} className="p-4 border border-gray-200 rounded flex justify-between items-center hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{form.title}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span className="mr-3">
                              Created: {new Date(form.createdAt).toLocaleDateString()}
                            </span>
                            {form.responseCount !== undefined && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {form.responseCount} {form.responseCount === 1 ? 'response' : 'responses'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            href={`/forms/${form._id}`}
                            className="text-blue-600 hover:text-blue-800 px-2 py-1"
                          >
                            View
                          </Link>
                          <Link
                            href={`/forms/${form._id}/share`}
                            className="text-green-600 hover:text-green-800 px-2 py-1"
                          >
                            Share
                          </Link>
                          <Link
                            href={`/responses/${form._id}`}
                            className="text-purple-600 hover:text-purple-800 px-2 py-1"
                          >
                            Responses
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Your Email Lists</h2>
                  <Link
                    href="/email-lists/new"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create List
                  </Link>
                </div>
                
                {emailLists.length === 0 ? (
                  <p className="text-gray-500">You haven't created any email lists yet.</p>
                ) : (
                  <div className="space-y-3">
                    {emailLists.map((list) => (
                      <div key={list._id} className="p-4 border border-gray-200 rounded flex justify-between items-center hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{list.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {list.emails.length} {list.emails.length === 1 ? 'contact' : 'contacts'}
                          </p>
                        </div>
                        <Link
                          href={`/email-lists/${list._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Dashboard>
  );
}