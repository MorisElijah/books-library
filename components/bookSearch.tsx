// app/components/BookSearch.tsx
"use client";

import { useEffect, useState } from "react";

type Book = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
};

export default function BookSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't search for empty or very short input
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    // Wait 500ms after the user stops typing (debounce)
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Search failed");
        const data: { docs: Book[] } = await res.json();
        setResults(data.docs);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Something went wrong. Try again.");
        }
      } finally {
        setLoading(false);
      }
    }, 500);

    // Cancel the timer and any in-flight request if the user keeps typing
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books by title or author..."
        className="w-full border rounded px-4 py-2 mb-4"
      />

      {loading && <p>Searching...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && query.length >= 2 && results.length === 0 && !error && (
        <p>No books found.</p>
      )}

      <ul className="space-y-4">
        {results.map((book) => (
          <li key={book.key} className="flex gap-4 items-center">
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                alt={book.title}
                className="w-12 h-16 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-16 bg-gray-200 rounded" />
            )}
            <div>
              <a
                href={`https://openlibrary.org${book.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
              >
                {book.title}
              </a>
              <p className="text-sm text-gray-600">
                {book.author_name?.join(", ") ?? "Unknown author"}
                {book.first_publish_year && ` · ${book.first_publish_year}`}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}