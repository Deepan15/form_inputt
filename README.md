# Form Input App

A comprehensive form builder application that allows users to create, share, and collect responses from custom forms.

## Features

### Form Building
- Create dynamic forms with various field types:
  - Text inputs
  - Email fields
  - Number inputs with min/max validation
  - Date pickers
  - Dropdowns
  - Radio buttons
  - Checkboxes
  - Text areas
  - File uploads with size and type restrictions
  - Phone number fields
  - URL fields
  - Rating scales
- Configure field properties:
  - Required fields
  - Placeholders
  - Character limits
  - Min/max values
  - File size limits
  - Allowed file types

### Form Sharing
- Share forms via:
  - Public link
  - Email to individuals or lists
  - Embeddable iframe code
  - QR code
- Set form expiration dates
- Allow anonymous responses
- Receive notifications for new submissions

### Response Collection
- View all form responses in one place
- Filter responses by type (anonymous, with email)
- Sort responses by submission date
- Download responses as CSV
- View file uploads from respondents
- See submission metadata (IP address, browser)

### Email Management
- Create and manage email lists
- Import contacts
- Use email lists to share forms

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/form-input-app.git
cd form-input-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

4. Start the development server with MongoDB:
```bash
npm run dev:with-db
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a Form
1. Log in to your account
2. Click "Create Form" on the dashboard
3. Add a title and description
4. Add fields by selecting the field type and configuring its properties
5. Save your form

### Sharing a Form
1. Navigate to your form
2. Click "Share Form"
3. Choose your sharing method:
   - Copy the public link
   - Send via email
   - Use the embed code
   - Download or share the QR code

### Viewing Responses
1. Navigate to your form
2. Click "View Responses"
3. Browse through all submissions
4. Use filters to find specific responses
5. Export data as needed

## Technologies Used
- Next.js
- React
- TypeScript
- MongoDB
- Firebase Authentication
- Tailwind CSS

## License
This project is licensed under the MIT License - see the LICENSE file for details.
