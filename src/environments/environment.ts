// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: {
  production: boolean;
  apiBaseUrl: string | null;
  endpoints: {
    produtos: string;
    simulacoes: string;
  };
} = {
  production: false,
  apiBaseUrl: null, // Exemplo: 'https://api.seuservidor.com'
  endpoints: {
    produtos: '/produtos',
    simulacoes: '/simulacoes',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
