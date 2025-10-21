import type { IPlaylistApi, PlaylistCreateDTO, PlaylistUpdateDTO } from "./iplaylistapi";

export class MockPlaylistApi implements IPlaylistApi {
    getPlaylists() {
        return async () => Promise.resolve([ {
            id: "1",
            name: "Chill Vibes",
            tracksAmount: 24,
            imageURL: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop"
        },
        {
            id: "2",
            name: "Workout Energy",
            tracksAmount: 32,
            imageURL: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=400&h=400&fit=crop"
        },
        {
            id: "3",
            name: "Road Trip Mix",
            tracksAmount: 45,
            imageURL: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop"
        },
        {
            id: "4",
            name: "Classic Rock Anthems",
            tracksAmount: 28,
            imageURL: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
        },
        {
            id: "5",
            name: "Focus Study",
            tracksAmount: 18,
            imageURL: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
        },
        {
            id: "6",
            name: "Party Hits 2024",
            tracksAmount: 36,
            imageURL: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&h=400&fit=crop"
        },
        {
            id: "7",
            name: "Acoustic Sessions",
            tracksAmount: 22,
            imageURL: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop"
        },
        {
            id: "8",
            name: "Jazz Classics",
            tracksAmount: 30,
            imageURL: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop"
        }])
    }
    getPlaylist(id: string) {
        return async () => Promise.resolve({
            id,
            name: "Chill Vibes",
            description: "Relaxing tunes for winding down after a long day",
            imageURL: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
            tracks: [
                {id: "1", name: "Blinding Lights", tagSelector: "pop-2019", groups: [{id: "1", name: "The Weeknd"}], authors: [{id: "1", name: "Abel Tesfaye"}], duration: 200000},
                {id: "2", name: "Watermelon Sugar", tagSelector: "pop-2020", groups: [{id: "2", name: "Harry Styles"}], authors: [{id: "2", name: "Harry Styles"}], duration: 174000},
                {id: "3", name: "Circles", tagSelector: "pop-2019", groups: [{id: "3", name: "Post Malone"}], authors: [{id: "3", name: "Post Malone"}], duration: 215000},
                {id: "4", name: "Levitating", tagSelector: "pop-2020", groups: [{id: "4", name: "Dua Lipa"}], authors: [{id: "4", name: "Dua Lipa"}], duration: 203000},
                {id: "5", name: "Good Days", tagSelector: "r&b-2020", groups: [{id: "5", name: "SZA"}], authors: [{id: "5", name: "Solána Rowe"}], duration: 278000}
            ]
        })
    }
    updatePlaylist(id: string, _data: PlaylistUpdateDTO){
        return async () => Promise.resolve({
            id,
            name: "Chill Vibes",
            imageURL: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
            tracksAmount: Math.floor(Math.random() * 50) + 10
        })
    }
    deletePlaylist(_id: string) {
        return async () => Promise.resolve("Ok")
    }
    createPlaylist(_data: PlaylistCreateDTO) {
        return async () => Promise.resolve({
            id: "1",
            name: "Chill Vibes",
            imageURL: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
            tracksAmount: Math.floor(Math.random() * 50) + 10
        })
    }
}