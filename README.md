# README

## Set cors with gsutil

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
# Firebase configs
FIREBASE_PROJECT_ID=
FIREBASE_API_KEY=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_STORAGEBUCKET=
FIREBASE_DATABASE_URL=
```
