khawin_web/
├── public                              -> Stores assets like images, accessible by the web server
├── src
│   ├── @core                           -> Template's core files
│   ├── @layouts                        -> Template's layout files
│   ├── @menu                           -> Template's menu files
│   ├── app                             -> App router to handle the template's routings
│   ├── assets                          -> Static assets, like Svg
│   ├── components                      -> Reusable components for the users
│   ├── configs                         -> Configuration files
│   │   ├── i18n.ts                     -> i18n configurations
│   │   ├── primaryColorConfig          -> Primary color configurations
│   │   └── themeConfig.ts              -> Template configurations
│   ├── contexts                        -> Your context files go here
│   ├── data                            -> Data files (navigation structure, search data, etc.)
│   │   ├── dictionaries                -> Translation data for localization
│   │   ├── navigation                  -> Vertical & Horizontal static navigation menu data
│   │   └── searchData.ts               -> Data related to search
│   ├── fake-db                         -> A mock database setup, usually for testing or development purposes
│   ├── hocs                            -> Higher Order Components
│   ├── hooks                           -> Custom hooks
│   |   └── useIntersection             -> Hook to detect when an element enters the viewport - used only for the front pages
│   ├── libs                            -> External libraries Third party libraries
│   │   ├── styles                      -> Styles for third party libraries
│   │   ├── ApexCharts                  -> Renders charts in client side
│   │   ├── Recharts                    -> Renders charts in client side
│   │   ├── ReactPlayer                 -> Renders video player in client side
│   │   └── auth.ts                     -> Authentication using NextAuth.js
│   ├── prisma                          -> Prisma ORM files, including database schema
│   │   ├── migrations                  -> Database schema change history
│   │   ├── dev.db                      -> SQLite database
│   │   └── schema.prisma               -> Model and schema definitions for Prisma
|   ├── redux-store                     -> Redux Store setup
|   |   └── ReduxProvider.tsx           -> Redux provider
|   |   └── index.ts                    -> Central Redux store configuration, combines all reducers and configures middleware
|   |   └── slices                      -> Redux slices (individual pieces of state)
│   ├── remove-translation-scripts      -> Script for removing translations from the template
│   ├── types                           -> Type definitions
│   ├── utils                           -> Utility functions
│   └── views                           -> Files that are included in app folder
├── .editorconfig                       -> Configuration file for the editor
├── .env.example                        -> Example environment variables file
├── .eslintrc.js                        -> ESLint configurations (Linting code)
├── .gitignore                          -> Specifies intentionally untracked files to ignore
├── .npmrc                              -> Configuration for npm
├── .prettierrc.json                    -> Prettier configuration for code formatting
├── .stylelintrc.json                   -> Stylelint configuration for style files
├── next.config.mjs                     -> Configuration file for Next.js
├── package.json                        -> Lists dependencies and project metadata
├── pnpm-lock.yaml                      -> Lock file for pnpm, ensuring consistent installations
├── postcss.config.mjs                   -> Configuration for PostCSS.
├── tailwind.config.ts                  -> Configuration for Tailwind CSS
└── tsconfig.json                       -> TypeScript configuration file
