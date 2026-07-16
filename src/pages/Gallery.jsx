import { useEffect, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { GalleryImages } from "../firebase/db";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    GalleryImages.getAll()
      .then(setImages)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery</h1>
        <p className="text-gray-500">Photos from our events and chapter activities.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="font-medium">No photos yet.</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="break-inside-avoid rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-smooth"
              onClick={() => setSelected(img)}
            >
              <img
                src={img.image_url}
                alt={img.caption || "Gallery image"}
                className="w-full object-cover"
              />
              {img.caption && (
                <div className="bg-white px-3 py-2">
                  <p className="text-xs text-gray-500">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setSelected(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selected.image_url}
            alt={selected.caption || ""}
            className="max-w-full max-h-[85vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {selected.caption && (
            <p className="absolute bottom-6 text-white/80 text-sm">{selected.caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
