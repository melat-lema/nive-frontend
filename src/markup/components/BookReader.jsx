// src/components/BookReader.jsx
import React, { useEffect, useRef } from 'react';

function BookReader({ book }) {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (book && iframeRef.current) {
            // Construct the full URL to the book file
            // Assumes your backend serves files from /uploads at the same base as /api
            // e.g., if API is http://localhost:3000/api, files are at http://localhost:3000/uploads
            // Or if using Vite proxy, adjust accordingly.
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Fallback
            const fileUrl = `${apiUrl}${book.file_path}`;

            // Set the iframe src to the file URL
            // Note: For security, browsers might block this if MIME types are wrong or CORS headers are missing on the file server.
            // Ensure your backend sets correct headers when serving files.
            iframeRef.current.src = fileUrl;
        }
    }, [book]);

    if (!book) {
        return <div>Select a book to read.</div>;
    }

    return (
        <div className="h-[calc(100vh-200px)] w-full">
             <iframe
                ref={iframeRef}
                title={`Reading: ${book.title}`}
                className="w-full h-full border"
                sandbox="allow-scripts allow-same-origin" // Restrict iframe for security
                // Iframe might not work for all file types or due to browser security policies.
                // For PDFs, consider using pdfjs-dist. For EPUBs, epub.js.
                // This is a basic placeholder.
            />
            {/* Fallback message if iframe doesn't load or isn't suitable */}
            <p className="text-sm text-gray-500 mt-2">
                If the book doesn't load above, you can <a href={`${import.meta.env.VITE_API_URL}${book.file_path}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">download it</a>.
            </p>
        </div>
    );
}

export default BookReader;