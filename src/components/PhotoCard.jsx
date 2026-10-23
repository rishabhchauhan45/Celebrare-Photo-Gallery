
export default function PhotoCard({
    photo,
    isFavorite,
    onToggleFavorite,
}) {
    return (
        <article className="overflow-hidden rounded-xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative">
                <img
                    src={photo.download_url}
                    alt={`Photo by ${photo.author}`}
                    className="h-64 w-full object-cover"
                    loading="lazy"
                />

                <button
                    type="button"
                    onClick={() => onToggleFavorite(photo.id)}
                    aria-label={
                        isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                    aria-pressed={isFavorite}
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl shadow transition hover:scale-110"
                >
                    <span className={isFavorite ? "text-red-500" : "text-gray-400"}>
                        {isFavorite ? "♥" : "♡"}
                    </span>
                </button>
            </div>

            <div className="p-4">
                <p className="text-sm text-gray-500">Photographer</p>

                <h2 className="mt-1 truncate font-semibold text-gray-800">
                    {photo.author}
                </h2>

                <a
                    href={photo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                    View original photo
                </a>
            </div>
        </article>
    );
}
