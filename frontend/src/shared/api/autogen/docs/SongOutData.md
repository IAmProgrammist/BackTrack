# SongOutData


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**song_id** | **string** |  | [default to undefined]
**id** | **string** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**tag** | **string** |  | [default to undefined]
**bpm** | **number** |  | [default to undefined]
**key** | **string** |  | [default to undefined]
**duration** | **number** |  | [default to undefined]
**lyrics** | **string** |  | [default to undefined]
**files** | [**Array&lt;FileOutNested&gt;**](FileOutNested.md) |  | [default to undefined]
**authors** | [**Array&lt;AuthorOutNested&gt;**](AuthorOutNested.md) |  | [default to undefined]
**groups** | [**Array&lt;GroupOutNested&gt;**](GroupOutNested.md) |  | [default to undefined]
**playlists** | [**Array&lt;PlaylistOutNested&gt;**](PlaylistOutNested.md) |  | [default to undefined]

## Example

```typescript
import { SongOutData } from './api';

const instance: SongOutData = {
    song_id,
    id,
    name,
    description,
    tag,
    bpm,
    key,
    duration,
    lyrics,
    files,
    authors,
    groups,
    playlists,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
