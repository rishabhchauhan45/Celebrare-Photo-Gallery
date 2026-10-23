
import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from "react";

import PhotoCard from "./PhotoCard";
import useFetchPhotos from "../hooks/useFetchPhotos";
import { favoritesReducer } from "../reducers/favoritesReducer";

const STORAGE_KEY = "celebrare-favorites";

function getInitialFavorites() {
    try {
        const savedFavorites = localStorage.getItem(STORAGE_KEY);
        const parsedFavorites = savedFavorites
            ? JSON.parse(savedFavorites)
            : [];

        return Array.isArray(parsedFavorites) ? parsedFavorites : [];
    } catch {
        return [];
    }
}

export default function Gallery() {
    const { photos, loading, error } = useFetchPhotos();

    const [search, setSearch] = useState("");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const [favorites, dispatch] = useReducer(
        favoritesReducer,
        undefined,
        getInitialFavorites
    );

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        } catch (err) {
            console.error("Unable to save favorites:", err);
        }
    }, [favorites]);

    const handleSearch = useCallback((event) => {
        setSearch(event.target.value);
    }, []);

    const handleToggleFavorite = useCallback((photoId) => {
        dispatch({
            type: "TOGGLE_FAVORITE",
            payload: photoId,
        });
    }, []);

    const filteredPhotos = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return photos.filter((photo) => {
            const matchesAuthor = photo.author
                .toLowerCase()
                .includes(normalizedSearch);

            const matchesFavorites =
                !showFavoritesOnly || favorites.includes(photo.id);

            return matchesAuthor && matchesFavorites;
        });
    }, [photos, search, showFavoritesOnly, favorites]);

    if (loading) {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4">
                <div
                    className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
                    role="status"
                    aria-label="Loading photos"
                />
                <p className="text-gray-600">Loading photos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-xl rounded-xl bg-red-50 p-6 text-center">
                <p className="font-semibold text-red-700">
                    Unable to load photos
                </p>

                <p className="mt-2 text-sm text-red-600">{error}</p>

                <p className="mt-3 text-sm text-gray-600">
                    Please refresh the page to try again.
                </p>
            </div>
        );
    }

    return (
        <section>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Explore Photos
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Discover photos from talented photographers.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="search"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search photographer..."
                        aria-label="Search by photographer name"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                    />

                    <button
                        type="button"
                        onClick={() => setShowFavoritesOnly((current) => !current)}
                        aria-pressed={showFavoritesOnly}
                        className={`rounded-lg px-4 py-3 font-medium transition ${showFavoritesOnly
                                ? "bg-red-500 text-white"
                                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        {showFavoritesOnly ? "♥ Favorites" : "♡ Favorites"}
                        {" "}({favorites.length})
                    </button>
                </div>
            </div>

            <p className="mb-5 text-sm text-gray-500" aria-live="polite">
                Showing {filteredPhotos.length} of {photos.length} photos
            </p>

            {filteredPhotos.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
                    <p className="text-lg font-semibold text-gray-700">
                        No photos found
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        Try another photographer name or change your favorites filter.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredPhotos.map((photo) => (
                        <PhotoCard
                            key={photo.id}
                            photo={photo}
                            isFavorite={favorites.includes(photo.id)}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

