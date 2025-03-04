import React, { useState } from 'react';

interface Email {
  email: string;
  name?: string;
}

interface EmailListManagerProps {
  onSave: (name: string, emails: Email[]) => void;
  initialName?: string;
  initialEmails?: Email[];
}

const EmailListManager: React.FC<EmailListManagerProps> = ({
  onSave,
  initialName = '',
  initialEmails = [],
}) => {
  const [name, setName] = useState(initialName);
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const addEmail = () => {
    if (!currentEmail.trim()) {
      setError('Email is required');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setEmails([...emails, { email: currentEmail, name: currentName || undefined }]);
    setCurrentEmail('');
    setCurrentName('');
    setError('');
  };

  const removeEmail = (index: number) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const processCsv = () => {
    if (!csvFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      
      const newEmails: Email[] = [];
      let hasErrors = false;
      
      // Skip header row if it exists
      const startIndex = lines[0].toLowerCase().includes('email') ? 1 : 0;
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const parts = line.split(',');
        const email = parts[0]?.trim();
        const name = parts[1]?.trim();
        
        if (email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(email)) {
            newEmails.push({ email, name });
          } else {
            hasErrors = true;
          }
        }
      }
      
      if (hasErrors) {
        setError('Some emails in the CSV were invalid and were skipped');
      } else {
        setError('');
      }
      
      setEmails([...emails, ...newEmails]);
      setCsvFile(null);
      // Reset the file input
      const fileInput = document.getElementById('csvFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    };
    
    reader.readAsText(csvFile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('List name is required');
      return;
    }
    
    if (emails.length === 0) {
      setError('At least one email is required');
      return;
    }
    
    onSave(name, emails);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Email List Manager</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="listName">
            List Name
          </label>
          <input
            id="listName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="My Contact List"
            required
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Emails</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name (Optional)
              </label>
              <input
                id="name"
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={addEmail}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Email
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Import from CSV</h3>
          <div className="flex items-center space-x-4">
            <input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <button
              type="button"
              onClick={processCsv}
              disabled={!csvFile}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Import
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            CSV should have email in the first column and name (optional) in the second column.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Email List ({emails.length})</h3>
          {emails.length === 0 ? (
            <p className="text-gray-500">No emails added yet.</p>
          ) : (
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emails.map((email, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {email.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {email.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => removeEmail(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Email List
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailListManager;