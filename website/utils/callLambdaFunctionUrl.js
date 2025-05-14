// Install these packages:
// npm install @aws-sdk/signature-v4 @aws-sdk/credential-provider-cognito-identity @aws-sdk/protocol-http @aws-crypto/sha256-js

import axios from 'axios';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { fetchAuthSession } from 'aws-amplify/auth';

// Create a function to sign and send requests to Lambda Function URL with IAM auth
export async function callLambdaFunctionUrl(method, path, data = null) {
    // Get Cognito credentials from current session
    const session = await fetchAuthSession();

    // Extract credentials from the session
    const credentials = {
        accessKeyId: session.credentials.accessKeyId,
        secretAccessKey: session.credentials.secretAccessKey,
        sessionToken: session.credentials.sessionToken
    };

    // Lambda function URL configuration
    const region = 'YOUR_AWS_REGION'; // e.g., 'us-east-1'
    const lambdaUrlDomain = 'YOUR_LAMBDA_URL_DOMAIN'; // e.g., 'xyz123.lambda-url.us-east-1.on.aws'
    const url = new URL(`https://${lambdaUrlDomain}${path}`);

    // Prepare request for signing
    const request = new HttpRequest({
        hostname: url.hostname,
        path: url.pathname + url.search,
        method,
        headers: {
            'Content-Type': data ? 'application/json' : undefined,
            host: url.hostname,
        },
        body: data ? JSON.stringify(data) : undefined,
    });

    // Create SigV4 signer
    const signer = new SignatureV4({
        credentials,
        region,
        service: 'lambda',
        sha256: Sha256,
    });

    // Sign the request
    const signedRequest = await signer.sign(request);

    // Convert signed request to axios format and send
    const axiosConfig = {
        method,
        url: url.toString(),
        headers: signedRequest.headers,
        data: data || undefined,
    };

    try {
        const response = await axios(axiosConfig);
        return response.data;
    } catch (error) {
        console.error('Error calling Lambda function URL:', error);
        throw error;
    }
}

// Example usage:
// GET request
// await callLambdaFunctionUrl('GET', '/users');

// POST request with data
// await callLambdaFunctionUrl('POST', '/users', { name: 'John', email: 'john@example.com' });