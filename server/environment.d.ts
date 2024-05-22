declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        PORT: number;
        JWT_SECRET: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  // reference: https://stackoverflow.com/questions/45194598/using-process-env-in-typescript
  export {}