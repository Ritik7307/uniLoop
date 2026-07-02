# UniLoop 🚀

> **Built by students, for students.** UniLoop is the exclusive ecosystem designed to make campus life at RGIPT simpler, safer, and more connected.

UniLoop is a modern, full-stack campus marketplace platform built specifically for students. It allows students to safely buy, sell, and trade essentials, report lost and found items, and connect with peers without the hassle of outside platforms or shipping fees. 

## ✨ Features

- **Exclusive Campus Marketplace**: Buy and sell textbooks, electronics, cycles, and more. Also includes sections for 'Lost & Found' and 'Services'.
- **Real-time Messaging**: Built-in chat system allowing buyers and sellers to communicate seamlessly. Includes features like deleting chats and blocking users.
- **Secure Authentication**: Uses NextAuth with Google provider alongside custom JWT authentication to ensure only verified college students can access the platform.
- **Dashboard & Profile Management**: Track your listings, manage your chats, and update your profile (including hostel and year details).
- **Responsive & Modern UI**: Built with Tailwind CSS and Framer Motion for a beautiful, dynamic, and responsive user experience across all devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Frontend**: React 19, Tailwind CSS v4, Framer Motion, Lucide React
- **Backend**: Next.js API Routes (Node.js)
- **Database**: MongoDB with [Mongoose](https://mongoosejs.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Authentication**: NextAuth.js & JSON Web Tokens (JWT)
- **Styling**: Tailwind CSS with custom branding

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and npm installed on your machine. You will also need a MongoDB URI.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ritik7307/uniLoop.git
   cd uniLoop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root of the project and add the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application running.

## 📁 Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable React components (UI elements, layout, etc.)
- `/src/models` - Mongoose database schemas (User, Product, Chat, Message)
- `/src/lib` - Utility functions, MongoDB connection setup, and auth helpers
- `/src/store` - Zustand state management files

## 📜 Available Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the application for production.
- `npm run start` - Starts the production server.
- `npm run lint` - Runs ESLint to check for linting errors.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for new features, bug fixes, or improvements.
