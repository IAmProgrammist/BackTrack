# AuthorsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAuthorApiV1AuthorsPost**](#createauthorapiv1authorspost) | **POST** /api/v1/authors | Create Author|
|[**deleteAuthorApiV1AuthorsAuthorIdDelete**](#deleteauthorapiv1authorsauthoriddelete) | **DELETE** /api/v1/authors/{author_id} | Delete Author|
|[**getAuthorApiV1AuthorsAuthorIdGet**](#getauthorapiv1authorsauthoridget) | **GET** /api/v1/authors/{author_id} | Get Author|
|[**getAuthorsApiV1AuthorsGet**](#getauthorsapiv1authorsget) | **GET** /api/v1/authors | Get Authors|
|[**updateAuthorApiV1AuthorsAuthorIdPut**](#updateauthorapiv1authorsauthoridput) | **PUT** /api/v1/authors/{author_id} | Update Author|

# **createAuthorApiV1AuthorsPost**
> AuthorResponse createAuthorApiV1AuthorsPost()


### Example

```typescript
import {
    AuthorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthorsApi(configuration);

let name: string; // (default to undefined)
let description: string; // (default to undefined)
let file: File; // (default to undefined)

const { status, data } = await apiInstance.createAuthorApiV1AuthorsPost(
    name,
    description,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] |  | defaults to undefined|
| **description** | [**string**] |  | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|


### Return type

**AuthorResponse**

### Authorization

[RWAPIKeyHeader](../README.md#RWAPIKeyHeader)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteAuthorApiV1AuthorsAuthorIdDelete**
> AuthorResponse deleteAuthorApiV1AuthorsAuthorIdDelete()


### Example

```typescript
import {
    AuthorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthorsApi(configuration);

let authorId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteAuthorApiV1AuthorsAuthorIdDelete(
    authorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authorId** | [**string**] |  | defaults to undefined|


### Return type

**AuthorResponse**

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

# **getAuthorApiV1AuthorsAuthorIdGet**
> AuthorResponse getAuthorApiV1AuthorsAuthorIdGet()


### Example

```typescript
import {
    AuthorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthorsApi(configuration);

let authorId: string; // (default to undefined)

const { status, data } = await apiInstance.getAuthorApiV1AuthorsAuthorIdGet(
    authorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authorId** | [**string**] |  | defaults to undefined|


### Return type

**AuthorResponse**

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

# **getAuthorsApiV1AuthorsGet**
> AuthorResponse getAuthorsApiV1AuthorsGet()


### Example

```typescript
import {
    AuthorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthorsApi(configuration);

let idIn: Array<string>; // (optional) (default to undefined)
let q: string; // (optional) (default to undefined)
let page: number; // (optional) (default to 1)
let perPage: number; // (optional) (default to 100)
let sortBy: 'id' | 'name'; // (optional) (default to undefined)
let sortByOrder: SortByOrder; // (optional) (default to undefined)

const { status, data } = await apiInstance.getAuthorsApiV1AuthorsGet(
    idIn,
    q,
    page,
    perPage,
    sortBy,
    sortByOrder
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **idIn** | **Array&lt;string&gt;** |  | (optional) defaults to undefined|
| **q** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 1|
| **perPage** | [**number**] |  | (optional) defaults to 100|
| **sortBy** | [**&#39;id&#39; | &#39;name&#39;**]**Array<&#39;id&#39; &#124; &#39;name&#39;>** |  | (optional) defaults to undefined|
| **sortByOrder** | **SortByOrder** |  | (optional) defaults to undefined|


### Return type

**AuthorResponse**

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

# **updateAuthorApiV1AuthorsAuthorIdPut**
> AuthorResponse updateAuthorApiV1AuthorsAuthorIdPut()


### Example

```typescript
import {
    AuthorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthorsApi(configuration);

let authorId: string; // (default to undefined)
let name: string; // (default to undefined)
let description: string; // (default to undefined)
let file: File; // (default to undefined)

const { status, data } = await apiInstance.updateAuthorApiV1AuthorsAuthorIdPut(
    authorId,
    name,
    description,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authorId** | [**string**] |  | defaults to undefined|
| **name** | [**string**] |  | defaults to undefined|
| **description** | [**string**] |  | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|


### Return type

**AuthorResponse**

### Authorization

[RWAPIKeyHeader](../README.md#RWAPIKeyHeader)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

