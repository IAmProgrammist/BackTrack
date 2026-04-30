# PlaylistsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createPlaylistApiV1PlaylistsPost**](#createplaylistapiv1playlistspost) | **POST** /api/v1/playlists | Create Playlist|
|[**deletePlaylistApiV1PlaylistsPlaylistIdDelete**](#deleteplaylistapiv1playlistsplaylistiddelete) | **DELETE** /api/v1/playlists/{playlist_id} | Delete Playlist|
|[**getPlaylistApiV1PlaylistsPlaylistIdGet**](#getplaylistapiv1playlistsplaylistidget) | **GET** /api/v1/playlists/{playlist_id} | Get Playlist|
|[**getPlaylistsApiV1PlaylistsGet**](#getplaylistsapiv1playlistsget) | **GET** /api/v1/playlists | Get Playlists|
|[**updatePlaylistApiV1PlaylistsPlaylistIdPut**](#updateplaylistapiv1playlistsplaylistidput) | **PUT** /api/v1/playlists/{playlist_id} | Update Playlist|

# **createPlaylistApiV1PlaylistsPost**
> PlaylistResponse createPlaylistApiV1PlaylistsPost()


### Example

```typescript
import {
    PlaylistsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PlaylistsApi(configuration);

let name: string; // (default to undefined)
let description: string; // (default to undefined)
let songsIds: Array<string>; // (default to undefined)
let songsFilters: Array<string>; // (default to undefined)
let file: File; // (default to undefined)

const { status, data } = await apiInstance.createPlaylistApiV1PlaylistsPost(
    name,
    description,
    songsIds,
    songsFilters,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] |  | defaults to undefined|
| **description** | [**string**] |  | defaults to undefined|
| **songsIds** | **Array&lt;string&gt;** |  | defaults to undefined|
| **songsFilters** | **Array&lt;string&gt;** |  | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|


### Return type

**PlaylistResponse**

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

# **deletePlaylistApiV1PlaylistsPlaylistIdDelete**
> PlaylistEmptyResponse deletePlaylistApiV1PlaylistsPlaylistIdDelete()


### Example

```typescript
import {
    PlaylistsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PlaylistsApi(configuration);

let playlistId: string; // (default to undefined)

const { status, data } = await apiInstance.deletePlaylistApiV1PlaylistsPlaylistIdDelete(
    playlistId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **playlistId** | [**string**] |  | defaults to undefined|


### Return type

**PlaylistEmptyResponse**

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

# **getPlaylistApiV1PlaylistsPlaylistIdGet**
> PlaylistDetailedResponse getPlaylistApiV1PlaylistsPlaylistIdGet()


### Example

```typescript
import {
    PlaylistsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PlaylistsApi(configuration);

let playlistId: string; // (default to undefined)

const { status, data } = await apiInstance.getPlaylistApiV1PlaylistsPlaylistIdGet(
    playlistId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **playlistId** | [**string**] |  | defaults to undefined|


### Return type

**PlaylistDetailedResponse**

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

# **getPlaylistsApiV1PlaylistsGet**
> PlaylistListResponse getPlaylistsApiV1PlaylistsGet()


### Example

```typescript
import {
    PlaylistsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PlaylistsApi(configuration);

let idIn: Array<string>; // (optional) (default to undefined)
let q: string; // (optional) (default to undefined)
let page: number; // (optional) (default to 1)
let perPage: number; // (optional) (default to 100)
let sortBy: 'id' | 'name'; // (optional) (default to undefined)
let sortByOrder: SortByOrder; // (optional) (default to undefined)

const { status, data } = await apiInstance.getPlaylistsApiV1PlaylistsGet(
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

**PlaylistListResponse**

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

# **updatePlaylistApiV1PlaylistsPlaylistIdPut**
> PlaylistResponse updatePlaylistApiV1PlaylistsPlaylistIdPut()


### Example

```typescript
import {
    PlaylistsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PlaylistsApi(configuration);

let playlistId: string; // (default to undefined)
let name: string; // (default to undefined)
let description: string; // (default to undefined)
let songsIds: Array<string>; // (default to undefined)
let songsFilters: Array<string>; // (default to undefined)
let file: File; // (default to undefined)

const { status, data } = await apiInstance.updatePlaylistApiV1PlaylistsPlaylistIdPut(
    playlistId,
    name,
    description,
    songsIds,
    songsFilters,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **playlistId** | [**string**] |  | defaults to undefined|
| **name** | [**string**] |  | defaults to undefined|
| **description** | [**string**] |  | defaults to undefined|
| **songsIds** | **Array&lt;string&gt;** |  | defaults to undefined|
| **songsFilters** | **Array&lt;string&gt;** |  | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|


### Return type

**PlaylistResponse**

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

