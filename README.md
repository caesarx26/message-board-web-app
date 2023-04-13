This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Description of the website

This website allows users to sign in using a google account and leave posts and comment on posts.
The website uses next js, firebase, and tailwind.

## How to run project

- Setup a firebase project:
  Go to https://firebase.google.com/ and log in using a google account.
  Create a new project and hit continue with the default settings.

- In your firebase project go into authentication settings and add a new provider and select google so people can sign in using their google account.

- In your firebase project go to the Cloud Firestore and go into rules and paste the following for the rules:

```
  rules_version = '2';
  service cloud.firestore {
  match /databases/{database}/documents {
  match /{document=\*\*} {
  allow read, write: if request.auth != null;
  }
  }
  }
```

- In your firebase project go into the project settings and look at SDK setup and configuration.
  This is where you will find the values needed for the environment variables used in the firebase config.
  It will look like this:

  ```
  const firebaseConfig = {
  apiKey: "example",
  authDomain: "example",
  projectId: "example,
  storageBucket: "example",
  messagingSenderId: "example,
  appId: "example",
  measurementId: "example"
  };
  ```

- Copy these variables into an env file and fill these variables in with the values in the firebase config:

  ```
  NEXT_PUBLIC_API_KEY = example
  NEXT_PUBLIC_AUTH_DOMAIN = example
  NEXT_PUBLIC_PROJECT_ID = example
  NEXT_PUBLIC_STORAGE_BUCKET = example
  NEXT_PUBLIC_MESSAGING_SENDER_ID = example
  NEXT_PUBLIC_APP_ID = example
  NEXT_PUBLIC_MEASURING_ID = example
  ```

- Add the filled in env file in the root directory of the project.

- install all dependencies for the project in the package.json use the command:

```
 npm install
```

- To get website running use the command:

```
 npm run dev
 # or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the website.

## Getting Started

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
