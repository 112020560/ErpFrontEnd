// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { HttpHeaders } from '@angular/common/http';

const headers = new HttpHeaders(
  {
    'Content-Type': 'application/json',
    'Application-Source' : 'WebBackOffice'
  });
const options = { headers: headers };

export const environment = {
  tokenUrl: '',
  backendUrl: 'https://localhost:44345/api',
  baseUrl: 'http://localhost:3000/api',
  header: options,
  production: false
};
