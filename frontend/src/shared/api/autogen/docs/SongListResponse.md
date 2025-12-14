# SongListResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**message** | **string** |  | [optional] [default to 'Song API Response']
**data** | [**Array&lt;SongShortOutData&gt;**](SongShortOutData.md) |  | [default to undefined]
**detail** | **{ [key: string]: any; }** |  | [optional] [default to undefined]

## Example

```typescript
import { SongListResponse } from './api';

const instance: SongListResponse = {
    message,
    data,
    detail,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
