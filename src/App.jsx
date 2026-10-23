
import Gallery from "./components/Gallery";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-4 text-4xl font-bold text-blue-600">
        Celebrare Photo Gallery
      </h1>

      <p className="mb-8 text-gray-600">
        Explore photos and save your favorites.
      </p>

      <Gallery />
    </div>
  );
}
