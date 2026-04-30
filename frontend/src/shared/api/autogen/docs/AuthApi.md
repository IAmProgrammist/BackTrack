# AuthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authInfoApiV1AuthInfoGet**](#authinfoapiv1authinfoget) | **GET** /api/v1/auth/info | Auth:Info|
|[**authSigninApiV1AuthSigninPost**](#authsigninapiv1authsigninpost) | **POST** /api/v1/auth/signin | Auth:Signin|
|[**authSignupApiV1AuthSignupPost**](#authsignupapiv1authsignuppost) | **POST** /api/v1/auth/signup | Auth:Signup|

# **authInfoApiV1AuthInfoGet**
> UserResponse authInfoApiV1AuthInfoGet()

Create new users.

### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.authInfoApiV1AuthInfoGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserResponse**

### Authorization

[RWAPIKeyHeader](../README.md#RWAPIKeyHeader)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authSigninApiV1AuthSigninPost**
> UserResponse authSigninApiV1AuthSigninPost(userInSignIn)

Create new users.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    UserInSignIn
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let userInSignIn: UserInSignIn; //

const { status, data } = await apiInstance.authSigninApiV1AuthSigninPost(
    userInSignIn
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userInSignIn** | **UserInSignIn**|  | |


### Return type

**UserResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authSignupApiV1AuthSignupPost**
> UserResponse authSignupApiV1AuthSignupPost(userInCreate)

Signup new users.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    UserInCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let userInCreate: UserInCreate; //

const { status, data } = await apiInstance.authSignupApiV1AuthSignupPost(
    userInCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userInCreate** | **UserInCreate**|  | |


### Return type

**UserResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

