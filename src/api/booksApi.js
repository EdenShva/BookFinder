const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY;

export const searchBooks = async (query) => {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=20&key=${API_KEY}`
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.log("STATUS:", response.status);
      console.log("GOOGLE ERROR:", errorText);

      throw new Error(`Failed to fetch books: ${response.status}`);
    }

    const data = await response.json();

    return data.items || [];
  } catch (error) {
    console.error("Books API error:", error);
    return [];
  }
};