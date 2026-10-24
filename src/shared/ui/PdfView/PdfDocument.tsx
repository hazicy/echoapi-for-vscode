import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import styles from "./PdfDocument.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type Props = {
  file: any;
};

const PdfDocument: React.FC<Props> = ({ file }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(700);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {return;}

    const observer = new ResizeObserver(([entry]) => {
      setPageWidth(Math.max(1, Math.floor(entry.contentRect.width)));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={styles.pdfViewer}>
      <Document
        file={file}
        onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}
        loading={<span role="status">Loading PDF…</span>}
        error={<span role="alert">Failed to load PDF.</span>}
      >
        {Array.from({ length: numPages }, (_, index) => (
          <Page
            key={`page-${index + 1}`}
            pageNumber={index + 1}
            width={pageWidth}
            className={styles.pdfPage}
          />
        ))}
      </Document>
    </div>
  );
};

export default PdfDocument;
