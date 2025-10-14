export interface APIGatewayRequestParams {
  body?: any;
  method?: string;
  path?: string;
  queryStringObject?: Record<string, any>;
  pathParametersObject?: Record<string, any>;
  stageVariables?: any;
}

export function apiGatewayGenerator({
  body,
  method,
  path = '',
  queryStringObject,
  pathParametersObject,
  stageVariables = null,
}: APIGatewayRequestParams) {
  return {
    body: body ? JSON.stringify(body) : null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: method,
    isBase64Encoded: false,
    path,
    pathParameters: pathParametersObject || null,
    queryStringParameters: queryStringObject || null,
    multiValueQueryStringParameters: null,
    stageVariables,
    requestContext: {
      accountId: '',
      apiId: '',
      httpMethod: method,
      identity: {
        accessKey: '',
        accountId: '',
        apiKey: '',
        apiKeyId: '',
        caller: '',
        cognitoAuthenticationProvider: '',
        cognitoAuthenticationType: '',
        cognitoIdentityId: '',
        cognitoIdentityPoolId: '',
        principalOrgId: '',
        sourceIp: '',
        user: '',
        userAgent: '',
        userArn: '',
      },
      path,
      stage: '',
      requestId: '',
      requestTimeEpoch: 3,
      resourceId: '',
      resourcePath: '',
    },
    resource: '',
  };
}