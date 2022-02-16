/**
 * 
 * 
 * Create and export configurations
 * 
 */

//Environment interfaces for different environments
import fs from 'fs';
import path from 'path';

interface Env {
	httpPort: number;
	httpsPort: number;
	envName: string;
}

interface EnvConfig {
	[key: string]: Env;
}

const environments: EnvConfig = {};

//Staging {default} environment
environments.staging = {
	httpPort: 3000,
	httpsPort: 3001,
	envName: 'staging'
};

environments.production = {
	httpPort: 5000,
	httpsPort: 5001,
	envName: 'production'
};

//Determine which environment was passed as a command-line argument
export const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//https dir
const httpsDir = path.join(__dirname, 'https');

console.log(httpsDir);

//Check that the current environment is one of the environments above, if not default to staging
const enviromentToExport =
	typeof environments[currentEnv] === 'object' ? environments[currentEnv] : environments.staging;

//Export the module
export default enviromentToExport;

//Cert pem keys generation
//openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
