import axios from "axios";

const API_BASE_URL = "https://www.googleapis.com/books/v1/volumes";

// Note: You can add your API key here if you have one
// const API_KEY = 'YOUR_API_KEY';
// Or you can use the API without a key for development with reduced quota

/**
 * Search for books by query
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query
 * @param {string} params.category - Category filter
 * @param {number} params.startIndex - Starting index for pagination
 * @param {number} params.maxResults - Maximum number of results to return
 * @param {string} params.orderBy - Order by parameter (relevance or newest)
 * @param {string} params.filter - Filter parameter (partial, full, free-ebooks, paid-ebooks, ebooks)
 * @returns {Promise<Object>} - Promise with the search results
 */
export const searchBooks = async ({
  query,
  category = "",
  startIndex = 0,
  maxResults = 10,
  orderBy = "relevance",
  filter = "all",
}) => {
  try {

    let queryString = query || "subject:all";
    
    if (category && category !== "all") {
      queryString += `+subject:${category}`;
    }

    const params = {
      q: queryString,
      startIndex,
      maxResults,
      orderBy,
    };

    if (filter !== "all") {
      params.filter = filter;
    }

    // Add API key if available
    // if (API_KEY) params.key = API_KEY;

    const response = await axios.get(API_BASE_URL, { params });

    return {
      items: response.data.items || [],
      totalItems: response.data.totalItems || 0,
    };
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
};

/**
 * Get a book by ID
 * @param {string} bookId - The Google Books Volume ID
 * @returns {Promise<Object>} - Promise with the book details
 */
export const getBookById = async (bookId) => {
  try {
    const params = {};
    // if (API_KEY) params.key = API_KEY;

    const response = await axios.get(`${API_BASE_URL}/${bookId}`, { params });
    return formatBookData(response.data);
  } catch (error) {
    console.error(`Error fetching book with ID ${bookId}:`, error);
    throw error;
  }
};

/**
 * Get books by category
 * @param {string} category - Category to search for
 * @param {Object} options - Additional options
 * @param {number} options.startIndex - Starting index for pagination
 * @param {number} options.maxResults - Maximum number of results to return
 * @returns {Promise<Object>} - Promise with the search results
 */
export const getBooksByCategory = async (
  category,
  { startIndex = 0, maxResults = 10 }
) => {
  try {
    const params = {
      q: `subject:${category}`,
      startIndex,
      maxResults,
    };

    // if (API_KEY) params.key = API_KEY;

    const response = await axios.get(API_BASE_URL, { params });

    return {
      items: response.data.items?.map((item) => formatBookData(item)) || [],
      totalItems: response.data.totalItems || 0,
    };
  } catch (error) {
    console.error(`Error fetching books in category ${category}:`, error);
    throw error;
  }
};

/**
 * Get related books based on a title or category
 * @param {string} term - Search term (title word or category)
 * @param {string} excludeId - Book ID to exclude from results
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise<Array>} - Promise with the related books
 */
export const getRelatedBooks = async (term, excludeId, maxResults = 6) => {
  if (!term) return [];

  try {
    const params = {
      q: term,
      maxResults: maxResults + 5,
    };

    // if (API_KEY) params.key = API_KEY;

    const response = await axios.get(API_BASE_URL, { params });

    if (!response.data.items) return [];

    // Filter out the excluded book and format the remaining books
    return response.data.items
      .filter((item) => item.id !== excludeId)
      .slice(0, maxResults)
      .map((item) => formatBookData(item));
  } catch (error) {
    console.error(`Error fetching related books for ${term}:`, error);
    return [];
  }
};

/**
 * Format book data from Google Books API response
 * @param {Object} book - Book data from Google Books API
 * @returns {Object} - Formatted book data
 */
export const formatBookData = (book) => {
  if (!book || !book.volumeInfo) {
    return null;
  }

  return {
    id: book.id,
    title: book.volumeInfo.title || "Unknown Title",
    subtitle: book.volumeInfo.subtitle || "",
    authors: book.volumeInfo.authors || ["Unknown Author"],
    publisher: book.volumeInfo.publisher || "Unknown Publisher",
    publishedDate: book.volumeInfo.publishedDate || "Unknown Date",
    description: book.volumeInfo.description || "No description available",
    pageCount: book.volumeInfo.pageCount || 0,
    categories: book.volumeInfo.categories || [],
    averageRating: book.volumeInfo.averageRating || 0,
    ratingsCount: book.volumeInfo.ratingsCount || 0,
    imageLinks: book.volumeInfo.imageLinks || {
      thumbnail: null,
      smallThumbnail: null,
    },
    language: book.volumeInfo.language || "en",
    previewLink: book.volumeInfo.previewLink || "",
    infoLink: book.volumeInfo.infoLink || "",
    canonicalVolumeLink: book.volumeInfo.canonicalVolumeLink || "",

    saleInfo: book.saleInfo
      ? {
          isEbook: book.saleInfo.isEbook || false,
          saleability: book.saleInfo.saleability || "NOT_FOR_SALE",
          retailPrice: book.saleInfo.retailPrice || null,
          buyLink: book.saleInfo.buyLink || "",
        }
      : {
          isEbook: false,
          saleability: "NOT_FOR_SALE",
          retailPrice: null,
          buyLink: "",
        },
  };
};

export default {
  searchBooks,
  getBookById,
  getBooksByCategory,
  getRelatedBooks,
  formatBookData,
};
