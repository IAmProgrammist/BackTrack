# UsersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**helloApiV1UsersHelloGet**](#helloapiv1usershelloget) | **GET** /api/v1/users/hello | Hello|
|[**userDeleteByIdApiV1UsersDelete**](#userdeletebyidapiv1usersdelete) | **DELETE** /api/v1/users | User:Delete-By-Id|
|[**userInfoByIdApiV1UsersUserIdGet**](#userinfobyidapiv1usersuseridget) | **GET** /api/v1/users/{user_id} | User:Info-By-Id|
|[**userPatchByIdApiV1UsersPatch**](#userpatchbyidapiv1userspatch) | **PATCH** /api/v1/users | User:Patch-By-Id|
|[**usersAllApiV1UsersGet**](#usersallapiv1usersget) | **GET** /api/v1/users | Users:All|

# **helloApiV1UsersHelloGet**
> any helloApiV1UsersHelloGet()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.helloApiV1UsersHelloGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userDeleteByIdApiV1UsersDelete**
> UserResponse userDeleteByIdApiV1UsersDelete()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.userDeleteByIdApiV1UsersDelete();
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

# **userInfoByIdApiV1UsersUserIdGet**
> UserResponse userInfoByIdApiV1UsersUserIdGet()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userId: number; // (default to undefined)

const { status, data } = await apiInstance.userInfoByIdApiV1UsersUserIdGet(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|


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
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userPatchByIdApiV1UsersPatch**
> UserResponse userPatchByIdApiV1UsersPatch(userInUpdate)


### Example

```typescript
import {
    UsersApi,
    Configuration,
    UserInUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userInUpdate: UserInUpdate; //

const { status, data } = await apiInstance.userPatchByIdApiV1UsersPatch(
    userInUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userInUpdate** | **UserInUpdate**|  | |


### Return type

**UserResponse**

### Authorization

[RWAPIKeyHeader](../README.md#RWAPIKeyHeader)

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

# **usersAllApiV1UsersGet**
> UserResponse usersAllApiV1UsersGet()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let skip: number; // (optional) (default to undefined)
let limit: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.usersAllApiV1UsersGet(
    skip,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **skip** | [**number**] |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to undefined|


### Return type

**UserResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

