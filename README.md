# README

## Directory

- root
  - packages
    - hosting
    - functions

## Hosting

- references
  - [7 Form Components For React Hook Form I Always Use](https://theodorusclarence.com/blog/rhf)
    - this was good for react-hook-form
  - [React Router dom v6 | Auth Example](https://reactrouter.com/docs/en/v6/examples/auth)
    - this was good for `RequiredAuth` Component

### Set cors with gsutil

- references
  - [クロスオリジン リソース シェアリング（CORS）の構成](https://cloud.google.com/storage/docs/configuring-cors?hl=ja)

```json:cors.json
[
  {
    "origin": ["http://origin1.example.com"],
    "responseHeader": ["Content-Type"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

```sh
gsutil cors set path-to-cors-json-file gs://<bucket_name>...
gsutil cors get gs://<bucket_name>
```

### Env

```env
VITE_SITE_PATH=https://.+

# cloudinary
VITE_CLOUDINARY_NAME=CLOUDINARY CLOUD NAME

# Google AdSense
VITE_PUBLISHER_ID=pub-\d+

# admin
VITE_VALID_EMAIL_ADRESS=example@gmail.com

# Fill in with Firebase Config
VITE_FIREBASE_APP_KEY=※apikey
VITE_FIREBASE_AUTH_DOMAIN=※authDomain
VITE_FIREBASE_DATABASE_URL=※databaseURL
VITE_FIREBASE_PROJECT_ID=※projectId
VITE_FIREBASE_STORAGEBUCKET=※storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=※messagingSenderId
VITE_FIREBASE_APP_ID=※appId
VITE_FIREBASE_MEASUREMENT_ID=

VITE_FIREBASE_AUTH_PERSISIT=boolean

# for firebase-admin
# FIREBASE_CLIENT_EMAIL=
# FIREBASE_PRIVATE_KEY=

VITE_FIREBASE_VALID_MAIL_ADDRESS
VITE_FIREBASE_AUTH_PERSIST
```

### firebase.json

for hosting and functions under root/packages

```json:firebase.json
{
  "hosting": {
    "public": "./packages/hosting/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "./packages/functions",
    "predeploy": ["npm --prefix \"$RESOURCE_DIR\" run build"]
  }
}
```

## Functions

nothing but just `hello world`
