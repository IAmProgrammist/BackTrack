# GroupsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createGroupApiV1GroupsPost**](#creategroupapiv1groupspost) | **POST** /api/v1/groups | Create Group|
|[**deleteGroupApiV1GroupsGroupIdDelete**](#deletegroupapiv1groupsgroupiddelete) | **DELETE** /api/v1/groups/{group_id} | Delete Group|
|[**getGroupApiV1GroupsGroupIdGet**](#getgroupapiv1groupsgroupidget) | **GET** /api/v1/groups/{group_id} | Get Group|
|[**getGroupsApiV1GroupsGet**](#getgroupsapiv1groupsget) | **GET** /api/v1/groups | Get Groups|
|[**updateGroupApiV1GroupsGroupIdPut**](#updategroupapiv1groupsgroupidput) | **PUT** /api/v1/groups/{group_id} | Update Group|

# **createGroupApiV1GroupsPost**
> GroupResponse createGroupApiV1GroupsPost()


### Example

```typescript
import {
    GroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let name: string; // (default to undefined)
let description: string; // (default to undefined)
let authors: Array<string>; // (default to undefined)
let file: File; // (default to undefined)

const { status, data } = await apiInstance.createGroupApiV1GroupsPost(
    name,
    description,
    authors,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] |  | defaults to undefined|
| **description** | [**string**] |  | defaults to undefined|
| **authors** | **Array&lt;string&gt;** |  | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|


### Return type

**GroupResponse**

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

# **deleteGroupApiV1GroupsGroupIdDelete**
> GroupEmptyResponse deleteGroupApiV1GroupsGroupIdDelete()


### Example

```typescript
import {
    GroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let groupId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteGroupApiV1GroupsGroupIdDelete(
    groupId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] |  | defaults to undefined|


### Return type

**GroupEmptyResponse**

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

# **getGroupApiV1GroupsGroupIdGet**
> GroupDetailedResponse getGroupApiV1GroupsGroupIdGet()


### Example

```typescript
import {
    GroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let groupId: string; // (default to undefined)

const { status, data } = await apiInstance.getGroupApiV1GroupsGroupIdGet(
    groupId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] |  | defaults to undefined|


### Return type

**GroupDetailedResponse**

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

# **getGroupsApiV1GroupsGet**
> GroupListResponse getGroupsApiV1GroupsGet()


### Example

```typescript
import {
    GroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let idIn: Array<string>; // (optional) (default to undefined)
let q: string; // (optional) (default to undefined)
let page: number; // (optional) (default to 1)
let perPage: number; // (optional) (default to 100)
let sortBy: 'id' | 'name'; // (optional) (default to undefined)
let sortByOrder: SortByOrder; // (optional) (default to undefined)

const { status, data } = await apiInstance.getGroupsApiV1GroupsGet(
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

**GroupListResponse**

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

# **updateGroupApiV1GroupsGroupIdPut**
> GroupResponse updateGroupApiV1GroupsGroupIdPut()


### Example

```typescript
import {
    GroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let groupId: string; // (default to undefined)
let name: string; // (default to undefined)
let description: string; // (default to undefined)
let authors: Array<string>; // (default to undefined)
let file: File; // (default to undefined)

const { status, data } = await apiInstance.updateGroupApiV1GroupsGroupIdPut(
    groupId,
    name,
    description,
    authors,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] |  | defaults to undefined|
| **name** | [**string**] |  | defaults to undefined|
| **description** | [**string**] |  | defaults to undefined|
| **authors** | **Array&lt;string&gt;** |  | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|


### Return type

**GroupResponse**

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

