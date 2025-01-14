# README

Web app to upload and download files

![repository image](https://github.com/user-attachments/assets/bb68828d-a7b3-4758-9a47-45869db28e25)

The number of downloads for each file I uploaded. (I distribute tools for my hobby XD)

![The number of downloads for each file I uploaded](https://github.com/user-attachments/assets/88b490dd-16b0-4a3b-8a73-1e11903e0419)

## Tech

- [React Router](https://reactrouter.com/home) (ex. React SPA -> Remix -> now)
  - validate with [Conform](https://conform.guide/) and [Zod](https://zod.dev/)
  - style with [Tailwind CSS](https://tailwindcss.com/) and [daisyUI](https://daisyui.com/)
  - lint with [Biome](https://biomejs.dev/)
  - deploy on [GCP Cloud Run](https://cloud.google.com/run?hl=ja)

## Env

```env
# admin
ADMIN_ID=
ADMIN_EMAIL=

# Firebase Config
FIREBASE_PROJECT_ID=
FIREBASE_API_KEY=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_STORAGEBUCKET=
FIREBASE_DATABASE_URL=

GA_TRACKING_ID=
```

## user account For demonstration purposes only

> [!NOTE]
> This user account and files are for demonstration purposes only, but are masked versions of real users' files. For security reasons, demo user account cannot upload, download or edit files.

```plaintext
email: test@example.com
password: password
```

## Sceenshots

top page
![top page screenshot](https://github.com/user-attachments/assets/62bf3a2a-4546-41ac-9ab8-ae073ca32c9b)

join page
![join page screenshot](https://github.com/user-attachments/assets/ef4ee968-3f69-4827-be95-13deae31916f)

login page
![login page screenshot](https://github.com/user-attachments/assets/d2defbfe-1263-40a2-ab84-cb768cd9e4e6)

a user file list page that can be viewed by anyone who knows your user ID.
![user file list page screenshot](https://github.com/user-attachments/assets/16fad5ef-71aa-4ebf-a6bd-86b94dbe6746)

file detail page and download button
![file detail page screenshot](https://github.com/user-attachments/assets/3996f715-ca92-432f-a2fc-67232f7cfc83)

file management page for logged in user
![file management page screenshot](https://github.com/user-attachments/assets/482b7534-4826-47ae-b8d0-6434352a4419)

file upload page.
![file upload page screenshot](https://github.com/user-attachments/assets/e8bfd150-643d-49f6-a3f1-963dea5ca97b)

file edit page
![file edit page screenshot](https://github.com/user-attachments/assets/66d9c491-2843-4ff6-89c6-e3ce28473da0)

logical file deletion page
![file delete page screenshot](https://github.com/user-attachments/assets/a3bcdd15-ac98-4187-b801-ce914a937f02)

user profile edit page
![user profile edit page screenshot](https://github.com/user-attachments/assets/737f549d-9e93-4bc8-b185-709ab3e6666f)
