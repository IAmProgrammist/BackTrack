# SongsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createSongApiV1SongsPost**](#createsongapiv1songspost) | **POST** /api/v1/songs | Create Song|
|[**deleteSongApiV1SongsSongIdDelete**](#deletesongapiv1songssongiddelete) | **DELETE** /api/v1/songs/{song_id} | Delete Song|
|[**getSongApiV1SongsSongIdGet**](#getsongapiv1songssongidget) | **GET** /api/v1/songs/{song_id} | Get Song|
|[**getSongReleasesApiV1SongsSongIdReleasesGet**](#getsongreleasesapiv1songssongidreleasesget) | **GET** /api/v1/songs/{song_id}/releases | Get Song Releases|
|[**getSongsApiV1SongsGet**](#getsongsapiv1songsget) | **GET** /api/v1/songs | Get Songs|

# **createSongApiV1SongsPost**
> SongShortResponse createSongApiV1SongsPost()


### Example

```typescript
import {
    SongsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SongsApi(configuration);

let name: string; // (default to undefined)
let tag: string; // (default to undefined)
let description: string; // (default to undefined)
let bpm: number; // (default to undefined)
let key: string; // (default to undefined)
let lyrics: string; // (default to undefined)
let filesFile: Array<File>; // (default to undefined)
let filesLeading: Array<boolean>; // (default to undefined)
let authors: Array<string>; // (default to undefined)
let groups: Array<string>; // (default to undefined)
let songId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.createSongApiV1SongsPost(
    name,
    tag,
    description,
    bpm,
    key,
    lyrics,
    filesFile,
    filesLeading,
    authors,
    groups,
    songId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] |  | defaults to undefined|
| **tag** | [**string**] |  | defaults to undefined|
| **description** | [**string**] |  | defaults to undefined|
| **bpm** | [**number**] |  | defaults to undefined|
| **key** | [**string**] |  | defaults to undefined|
| **lyrics** | [**string**] |  | defaults to undefined|
| **filesFile** | **Array&lt;File&gt;** |  | defaults to undefined|
| **filesLeading** | **Array&lt;boolean&gt;** |  | defaults to undefined|
| **authors** | **Array&lt;string&gt;** |  | defaults to undefined|
| **groups** | **Array&lt;string&gt;** |  | defaults to undefined|
| **songId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**SongShortResponse**

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

# **deleteSongApiV1SongsSongIdDelete**
> SongEmptyResponse deleteSongApiV1SongsSongIdDelete()


### Example

```typescript
import {
    SongsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SongsApi(configuration);

let songId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteSongApiV1SongsSongIdDelete(
    songId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **songId** | [**string**] |  | defaults to undefined|


### Return type

**SongEmptyResponse**

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

# **getSongApiV1SongsSongIdGet**
> SongDetailedResponse getSongApiV1SongsSongIdGet()


### Example

```typescript
import {
    SongsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SongsApi(configuration);

let songId: string; // (default to undefined)
let releaseId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getSongApiV1SongsSongIdGet(
    songId,
    releaseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **songId** | [**string**] |  | defaults to undefined|
| **releaseId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**SongDetailedResponse**

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

# **getSongReleasesApiV1SongsSongIdReleasesGet**
> SongReleaseResponse getSongReleasesApiV1SongsSongIdReleasesGet()


### Example

```typescript
import {
    SongsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SongsApi(configuration);

let songId: string; // (default to undefined)
let tagIn: Array<string>; // (optional) (default to undefined)
let page: number; // (optional) (default to 1)
let perPage: number; // (optional) (default to 100)
let sortBy: 'id' | 'created_at'; // (optional) (default to undefined)
let sortByOrder: SortByOrder; // (optional) (default to undefined)

const { status, data } = await apiInstance.getSongReleasesApiV1SongsSongIdReleasesGet(
    songId,
    tagIn,
    page,
    perPage,
    sortBy,
    sortByOrder
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **songId** | [**string**] |  | defaults to undefined|
| **tagIn** | **Array&lt;string&gt;** |  | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 1|
| **perPage** | [**number**] |  | (optional) defaults to 100|
| **sortBy** | [**&#39;id&#39; | &#39;created_at&#39;**]**Array<&#39;id&#39; &#124; &#39;created_at&#39;>** |  | (optional) defaults to undefined|
| **sortByOrder** | **SortByOrder** |  | (optional) defaults to undefined|


### Return type

**SongReleaseResponse**

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

# **getSongsApiV1SongsGet**
> SongListResponse getSongsApiV1SongsGet()


### Example

```typescript
import {
    SongsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SongsApi(configuration);

let idIn: Array<string>; // (optional) (default to undefined)
let tagIn: Array<string>; // (optional) (default to undefined)
let bpmIn: Array<number>; // (optional) (default to undefined)
let keyIn: Array<string>; // (optional) (default to undefined)
let authorsIdIn: Array<string>; // (optional) (default to undefined)
let groupsIdIn: Array<string>; // (optional) (default to undefined)
let q: string; // (optional) (default to undefined)
let page: number; // (optional) (default to 1)
let perPage: number; // (optional) (default to 100)
let sortBy: 'id' | 'name' | 'tag' | 'key' | 'bpm'; // (optional) (default to undefined)
let sortByOrder: SortByOrder; // (optional) (default to undefined)

const { status, data } = await apiInstance.getSongsApiV1SongsGet(
    idIn,
    tagIn,
    bpmIn,
    keyIn,
    authorsIdIn,
    groupsIdIn,
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
| **tagIn** | **Array&lt;string&gt;** |  | (optional) defaults to undefined|
| **bpmIn** | **Array&lt;number&gt;** |  | (optional) defaults to undefined|
| **keyIn** | **Array&lt;string&gt;** |  | (optional) defaults to undefined|
| **authorsIdIn** | **Array&lt;string&gt;** |  | (optional) defaults to undefined|
| **groupsIdIn** | **Array&lt;string&gt;** |  | (optional) defaults to undefined|
| **q** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 1|
| **perPage** | [**number**] |  | (optional) defaults to 100|
| **sortBy** | [**&#39;id&#39; | &#39;name&#39; | &#39;tag&#39; | &#39;key&#39; | &#39;bpm&#39;**]**Array<&#39;id&#39; &#124; &#39;name&#39; &#124; &#39;tag&#39; &#124; &#39;key&#39; &#124; &#39;bpm&#39;>** |  | (optional) defaults to undefined|
| **sortByOrder** | **SortByOrder** |  | (optional) defaults to undefined|


### Return type

**SongListResponse**

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

