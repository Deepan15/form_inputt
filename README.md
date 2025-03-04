# Form Builder Application

A dynamic form builder application built with Next.js, MongoDB, and React. This application allows users to create, share, and collect responses from custom forms.

## Features

- Create custom forms with various field types (text, email, number, date, dropdown, checkbox, textarea)
- Share forms via email
- Collect and view form responses
- Manage email lists for form distribution

## Prerequisites

- Node.js (v18 or later)
- MongoDB (v4.4 or later)
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local` (if not already present)
   - Update the MongoDB URI and other configuration values as needed

4. Start MongoDB:
   ```bash
   # Using the provided script
   ./scripts/start-mongodb.sh
   
   # Or manually start MongoDB based on your installation
   ```

5. Run the development server:
   ```bash
   # Start with MongoDB check
   npm run dev:with-db
   
   # Or start without MongoDB check
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser (or the port shown in the console)

## Usage

1. Sign up for an account
2. Create a new form from the dashboard
3. Add fields to your form
4. Save and share your form
5. View responses in the dashboard

## Development Notes

- This application uses a mock Firebase authentication for development purposes
- SendGrid is used for email functionality
- MongoDB is used for data storage

## License

MIT
