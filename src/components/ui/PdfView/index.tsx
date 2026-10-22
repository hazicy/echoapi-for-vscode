import { lazy, Suspense } from 'react';

const PdfDocument = lazy(() => import('./PdfDocument'));

export default function PdfView(props: { file: any }) {
  return (
    <Suspense fallback={<span role="status">Loading PDF…</span>}>
      <PdfDocument {...props} />
    </Suspense>
  );
}
