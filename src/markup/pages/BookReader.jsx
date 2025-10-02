// src/pages/BookReader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookService from '../../services/book.service';
import ClipLoader from 'react-spinners/ClipLoader';
// ✅ Import PDF.js
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'; // Worker for parsing

function BookReader() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    const { id } = useParams(); // Get book ID from URL
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const canvasRef = useRef(null); // Ref for the canvas element

    // --- 1. Fetch book metadata ---
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await bookService.getBookById(id);
                setBook(response.data);
                // Set the page number to the current page from the book
                setPageNumber(response.data.current_page > 0 ? response.data.current_page : 1);
            } catch (err) {
                console.error('Error fetching book:', err);
                setError('Failed to load book.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBook();
        }
    }, [id]);

    // --- 2. Render PDF using PDF.js (runs when `book` changes) ---
    const renderTaskRef = useRef(null); // 👈 track active render task

    // Add new state
const [pdfDoc, setPdfDoc] = useState(null); // ← Store loaded PDF document

// --- 1. Load PDF document ONCE when book changes ---
useEffect(() => {
  if (book && book.mime_type === "application/pdf") {
    const loadPdf = async () => {
      try {
        const fileUrl = `${import.meta.env.VITE_API_URL}${book.file_path}`;
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        
        const initialPage = book.current_page > 0 ? book.current_page : 1;
        setPageNumber(Math.min(initialPage, pdf.numPages));
      } catch (err) {
        console.error("💥 Failed to load PDF:", err);
        setError("Failed to load PDF file.");
      }
    };

    loadPdf();
  } else {
    setPdfDoc(null);
    setNumPages(null);
  }
}, [book?.id, book?.file_path, book?.mime_type]); // ✅ Stable dependencies // ← Only run when book changes, NOT when pageNumber changes


// --- 2. Render specific page when pageNumber, pdfDoc, or numPages changes ---
useEffect(() => {
  if (!pdfDoc || !canvasRef.current || !numPages) return;

  // ✅ Ensure pageNumber is within valid range [1, numPages]
  const safePageNumber = Math.max(1, Math.min(pageNumber, numPages));

  const renderPage = async () => {
    try {
      // 🛑 Cancel previous render if exists
      if (renderTaskRef.current) {
        // Wait for cancellation to complete
        try {
          await renderTaskRef.current.promise.catch(() => {
            // Expected cancellation error - ignore
          });
        } catch (cancelError) {
          // Handle any unexpected errors during cancellation
          console.log("Cancellation completed or error:", cancelError);
        }
        renderTaskRef.current = null;
      }

      const page = await pdfDoc.getPage(safePageNumber);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // 🚀 Start new render task
      renderTaskRef.current = page.render({
        canvasContext: context,
        viewport,
      });

      await renderTaskRef.current.promise;
      renderTaskRef.current = null; // Clean up after successful render
    } catch (err) {
      // Clean up on error
      renderTaskRef.current = null;
      
      if (err.name !== "RenderingCancelledException") {
        console.error("💥 PDF Render Error:", err);
        
        if (err.name === "InvalidPDFException") {
          setError("Invalid PDF file. The file may be corrupted or not a PDF.");
        } else if (err.name === "MissingPDFException") {
          setError("PDF file not found. Check if the file was uploaded correctly.");
        } else if (err.message?.includes("same canvas")) {
          setError("Rendering conflict. Please refresh the page.");
        } else {
          setError(`Failed to render PDF: ${err.message}`);
        }
      }
    }
  };

  renderPage();
}, [pdfDoc, pageNumber, numPages]); // ← Add numPages as dependency
    // --- Navigation functions ---
const handleNextPage = async () => {
  if (pageNumber < numPages) {
    const nextPage = pageNumber + 1;

    try {
      const updatedBook = await bookService.updateProgress(book.id, nextPage);

      // Merge progress safely even if backend doesn’t return full object
      setBook(prev => ({ ...prev, ...updatedBook, current_page: nextPage }));
      setPageNumber(nextPage);

      // Tell Books.jsx that progress has changed
      window.dispatchEvent(new CustomEvent("bookProgressUpdated", { detail: { ...updatedBook, current_page: nextPage } }));
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  }
};

const goToPrevPage = async () => {
    if (pageNumber > 1) {
        try {
            const prevPage = pageNumber - 1;
            const updatedBook = await bookService.updateProgress(book.id, prevPage);

            setBook(updatedBook);
            setPageNumber(updatedBook.current_page);

            window.dispatchEvent(new Event('focus'));
        } catch (err) {
            console.error("Error updating progress:", err);
        }
    }
};

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <ClipLoader size={32} color="#6B7280" />
                    <p className="mt-2">Loading book...</p>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <p className="text-red-400">{error || 'Book not found.'}</p>
                    <button
                        onClick={() => navigate('/books')}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        Back to Books
                    </button>
                </div>
            </div>
        );
    }

    // --- Render UI based on file type ---
    const renderContent = () => {
        if (book.mime_type === 'application/pdf') {
            return (
                <div className="flex flex-col items-center w-full h-full">
                    {/* PDF Canvas */}
                    <div className="flex-1 overflow-auto w-full flex justify-center items-start p-4">
                        <canvas ref={canvasRef} className="border border-gray-700 rounded shadow-lg" />
                    </div>

                    {/* PDF Navigation */}
                    <div className="bg-gray-800 border-t border-gray-700 p-2 w-full flex justify-between items-center">
                        <button
                            onClick={goToPrevPage}
                            disabled={pageNumber <= 1}
                            className={`px-3 py-1 rounded ${pageNumber <= 1 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            Previous
                        </button>
                        <span className="text-sm">
                            Page {pageNumber} of {numPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            // ✅ Only disable when already finished OR when on a page beyond numPages
                            disabled={book.status === "finished" || (pageNumber > numPages)}
                            className={`px-3 py-1 rounded ${
                                book.status === "finished" || (pageNumber > numPages) 
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                            }`}
                        >
                            {book.status === "finished" ? "Finished" : "Next"}
                        </button>
                    </div>
                </div>
            );
        } else {
            // Fallback for non-PDF files (e.g., EPUB, TXT) - use iframe
            const fileUrl = `${import.meta.env.VITE_API_URL}${book.file_path}`;
            return (
                <iframe
                    src={fileUrl}
                    title={book.title}
                    className="w-full h-full border-0"
                    
                />
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
                <button
                    onClick={() => navigate('/books')}
                    className="text-purple-400 hover:text-purple-300 flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Books
                </button>
                <h1 className="text-lg font-semibold truncate max-w-md">{book.title}</h1>
                <div></div> {/* Spacer */}
            </header>

            {/* Reader Area */}
            <div className="flex-1 overflow-hidden">
                {renderContent()}
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 border-t border-gray-700 p-2 text-center text-sm text-gray-400">
                {book.author && `by ${book.author}`}
            </footer>
        </div>
    );
}

export default BookReader;