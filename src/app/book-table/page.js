import BookTable from '@/components/BookTable/BookTable';

export default function BookTablePage() {
  return (
    <div suppressHydrationWarning={true}>
      <BookTable />
    </div>
  );
}
