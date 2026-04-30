# SongDetailedResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**message** | **string** |  | [optional] [default to 'Song API Response']
**data** | [**SongOutData**](SongOutData.md) |  | [default to undefined]
**detail** | **{ [key: string]: any; }** |  | [optional] [default to undefined]

## Example

```typescript
import { SongDetailedResponse } from './api';

const instance: SongDetailedResponse = {
    message,
    data,
    detail,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
