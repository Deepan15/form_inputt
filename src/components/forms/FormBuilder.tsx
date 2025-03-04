'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormBuilderProps {
  initialFields?: FormField[];
  onSave: (fields: FormField[]) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

export default function FormBuilder({
  initialFields = [],
  onSave,
  title,
  setTitle,
  description,
  setDescription,
}: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [currentField, setCurrentField] = useState<FormField>({
    id: '',
    type: 'text',
    label: '',
    placeholder: '',
    required: false,
    options: [''],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    if (initialFields.length > 0) {
      setFields(initialFields);
    }
  }, [initialFields]);

  const handleAddField = () => {
    if (!currentField.label.trim()) {
      return;
    }

    const newField = {
      ...currentField,
      id: uuidv4(),
      options: currentField.type === 'dropdown' ? currentField.options?.filter(Boolean) : undefined,
    };

    if (isEditing && editIndex !== -1) {
      const updatedFields = [...fields];
      updatedFields[editIndex] = newField;
      setFields(updatedFields);
      setIsEditing(false);
      setEditIndex(-1);
    } else {
      setFields([...fields, newField]);
    }

    setCurrentField({
      id: '',
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      options: [''],
    });
  };

  const handleEditField = (index: number) => {
    const field = fields[index];
    setCurrentField({
      ...field,
      options: field.options || [''],
    });
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...(currentField.options || [''])];
    updatedOptions[index] = value;
    setCurrentField({ ...currentField, options: updatedOptions });
  };

  const handleAddOption = () => {
    setCurrentField({
      ...currentField,
      options: [...(currentField.options || ['']), ''],
    });
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...(currentField.options || [''])];
    updatedOptions.splice(index, 1);
    setCurrentField({ ...currentField, options: updatedOptions });
  };

  const handleSaveForm = () => {
    if (!title.trim()) {
      alert('Please enter a form title');
      return;
    }

    if (fields.length === 0) {
      alert('Please add at least one field to your form');
      return;
    }

    onSave(fields);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Form Details</h2>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Form Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter form title"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter form description"
          />
        </div>
      </div>

      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {isEditing ? 'Edit Field' : 'Add Field'}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="fieldType" className="block text-sm font-medium text-gray-700 mb-1">
              Field Type
            </label>
            <select
              id="fieldType"
              value={currentField.type}
              onChange={(e) => setCurrentField({ ...currentField, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="dropdown">Dropdown</option>
              <option value="checkbox">Checkbox</option>
              <option value="textarea">Text Area</option>
            </select>
          </div>
          <div>
            <label htmlFor="fieldLabel" className="block text-sm font-medium text-gray-700 mb-1">
              Field Label *
            </label>
            <input
              type="text"
              id="fieldLabel"
              value={currentField.label}
              onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter field label"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="fieldPlaceholder" className="block text-sm font-medium text-gray-700 mb-1">
            Placeholder (Optional)
          </label>
          <input
            type="text"
            id="fieldPlaceholder"
            value={currentField.placeholder || ''}
            onChange={(e) => setCurrentField({ ...currentField, placeholder: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter placeholder text"
          />
        </div>

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="fieldRequired"
            checked={currentField.required}
            onChange={(e) => setCurrentField({ ...currentField, required: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="fieldRequired" className="ml-2 block text-sm text-gray-700">
            Required field
          </label>
        </div>

        {currentField.type === 'dropdown' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dropdown Options *
            </label>
            {currentField.options?.map((option, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="ml-2 p-2 text-red-600 hover:text-red-800"
                  disabled={currentField.options?.length === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Option
            </button>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditIndex(-1);
                setCurrentField({
                  id: '',
                  type: 'text',
                  label: '',
                  placeholder: '',
                  required: false,
                  options: [''],
                });
              }}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleAddField}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditing ? 'Update Field' : 'Add Field'}
          </button>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Form Fields</h2>
        {fields.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No fields added yet. Add fields to your form above.
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-medium">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </h3>
                    <p className="text-sm text-gray-500">Type: {field.type}</p>
                    {field.placeholder && (
                      <p className="text-sm text-gray-500">Placeholder: {field.placeholder}</p>
                    )}
                    {field.type === 'dropdown' && field.options && (
                      <p className="text-sm text-gray-500">
                        Options: {field.options.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditField(index)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <button
            type="button"
            onClick={handleSaveForm}
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Form
          </button>
        </div>
      </div>
    </div>
  );
}