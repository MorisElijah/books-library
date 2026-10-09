import { Book, TrendingResponse } from "@/types/type";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import BookSearch from "./bookSearch";
 
export const DotCircleWithLabelDemo = () => {
    return <LoadingIndicator type="dot-circle" size="md" label="Loading..." />;
};


async function getTrendingBooks(): Promise<Book[]> {
  const res = await fetch("https://openlibrary.org/trending/daily.json", {
    next: { revalidate: 30 }, // re-fetch at most once an hour
  });

  if (!res.ok) {
    throw new Error("Failed to fetch trending books");
  }

  const data: TrendingResponse = await res.json();
  return data.works;
}

export default async function BooksPage() {
    
  const books = await getTrendingBooks();

  return (
    <div>
      <div>
        <BookSearch />
    </div>
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Trending Today</h1>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {books.slice(0, 200).map((book) => (
          <li key={book.key}>
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                className="w-full h-64 object-cover rounded"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center text-sm">
                No cover
              </div>
            )}
            <h2 className="mt-2 font-semibold">{book.title}</h2>
            <p className="text-sm text-gray-600">
              {book.author_name?.join(", ") ?? "Unknown author"}
            </p>
            {book.first_publish_year && (
              <p className="text-xs text-gray-500">{book.first_publish_year}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
    </div>
    
  );
}