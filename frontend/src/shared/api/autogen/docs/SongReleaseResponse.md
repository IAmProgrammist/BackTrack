# SongReleaseResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**message** | **string** |  | [optional] [default to 'Song API Response']
**data** | [**Array&lt;SongReleaseOutData&gt;**](SongReleaseOutData.md) |  | [default to undefined]
**detail** | **{ [key: string]: any; }** |  | [optional] [default to undefined]

## Example

```typescript
import { SongReleaseResponse } from './api';

const instance: SongReleaseResponse = {
    message,
    data,
    detail,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
