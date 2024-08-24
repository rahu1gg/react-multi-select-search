import { MultiSelectSearch } from '@/components/pages/multi-select-search';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className='px-5 py-10'>
      <MultiSelectSearch />
    </div>
  );
}
