# Pickle Pal 🏓

Pickle Pal is a web application designed to help pickleball players connect with local partners based on skill level and shared interests. Think of it as a "Tinder for Pickleball" - where players can swipe through and match with potential partners and build their pickleball community.

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js/Express
- **Database**: MongoDB
- **Authentication**: Clerk
- **Styling**: TailwindCSS with DaisyUI
- **Deployment**: AWS EC2
- **Image Hosting**: AWS S3

## Key Libraries & Packages

### Frontend

- [React](https://react.dev/) - JavaScript library for building user interfaces
- [React Router](https://reactrouter.com/) - Client-side routing for React applications
- [Clerk](https://clerk.com/) - Complete user management and authentication
- [React Hook Form](https://react-hook-form.com/) - Form validation and handling
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [DaisyUI](https://daisyui.com/) - Tailwind CSS component library
- [Lucide React](https://lucide.dev/) - Beautiful & consistent icon set

### Backend

- [Express](https://expressjs.com/) - Web framework for Node.js
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling tool
- [AWS SDK](https://aws.amazon.com/sdk-for-javascript/) - AWS services integration

## Project Structure

pickle-pal/
├── Frontend/ # Frontend React application
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page components - each directory is a route group ('URL/auth', 'URL/onboarding', etc)
│ │ │ ├── auth/
│ │ │ ├── home/
│ │ │ ├── onboarding/
│ │ │ └── LandingPage.tsx - root path
│ │ ├── layouts/ # Layout components
│ │ ├── hooks/ # Custom hooks
│ │ ├── lib/ # Utility functions
│ │ ├── types/ # TypeScript type definitions and zod Schemas
│ ├── public/ # Static assets
│ └── config files (.gitignore, package.json, etc.)
│
├── Backend/ # Backend Express application
│ ├── controllers/ # Route controllers
| |── db/ #DB connection logic
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API routes
| └──indes.js # Entry point for the node server
|
│
└── package.json # Root package.json for scripts

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- .env files provided by me
- npm as your package manager

### Local Development Setup

1. Clone the repository

```bash
git clone git@github.com:kepsteen/pickle-pal.git
cd pickle-pal

```

2. Install dependencies

```bash
npm install
cd Frontend && npm install
cd ../Backend && npm install
```

3. Add .env files

```bash
# /Frontend/.env
VITE_CLERK_PUBLISHABLE_KEY="addMe"

#/Backend/.env
DB_URI="addMe"
CLERK_PUBLISHABLE_KEY="addMe"
CLERK_SECRET_KEY="addMe"

AWS_BUCKET_NAME="addMe"
AWS_ACCESS_KEY_ID="addMe"
AWS_SECRET_ACCESS_KEY="addMe"
AWS_REGION="addMe"
```

4. Whitelist your IP in MongoDB Atlas

5. Run the project locally

```bash
# In root directory (Runs both React App and Node server)
npm run dev
```

## Objectives

1. Add logic to redirect the user to the appropriate routes after signup, login and onboarding after they submitted the forms.

```
				Signup -> Onboarding
				Login -> Home page
				Onboarding -> Home page
```

2. Complete the user model in `/Backend/models/user.model.js`. The data collected in the onboarding form `/Frontend/pages/Onboarding/OnboardingPage.tsx`should be reflected in the model

3. Create the markup for the [Home page](https://www.figma.com/design/eTfZdHbhLsu0nSbBbhJQuv/Pickle-Pal?node-id=5-2&t=NkHUOe3wq25Bh5PB-4).
   - Use daisyui and tailwind for the semantic colors (primary, secondary etc) and components
   - Create a custom component for card
   - Use some hard-coded data to fill in the card like in the figma file
   - Build the markup for mobile first then make it responsive on larger screens with tailwind's built in breakpoints

## Contributing

I use a feature branch workflow for development. Here's how to contribute:

1. My main development branch is `dev`. Always create your feature branches from `dev`.

2. Create a new branch using the following naming convention:

   ```bash
   git checkout -b Name/description-of-feature
   ```

   Example: `John/add-user-profile` or `Sarah/fix-auth-redirect`

3. Make your changes and commit them with clear, descriptive messages.

4. Push your feature branch and create a Pull Request (PR) against the `dev` branch.

5. After review and approval, your PR will be merged into `dev`.

Note: Direct commits to `dev` or `main` branches are not allowed. All changes must go through the PR process.
