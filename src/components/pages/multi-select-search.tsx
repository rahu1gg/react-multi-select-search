import { useDebounce } from '@/client/hooks/use-debounce.hook';
import { X } from 'lucide-react';
import React from 'react';
import { useQuery } from 'react-query';

export function MultiSelectSearch() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState<string>('');
  const [selectedTag, setSelectedTag] = React.useState<string>('');
  const { debouncedValue: debouncedSearch } = useDebounce(search, 500);
  const [tags, setTags] = React.useState<string[]>(['react', 'tanstack-router']);

  const { isError, data } = useQuery({
    queryKey: ['search-tags', debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch === '') return { users: [] };

      const res = await fetch(`https://dummyjson.com/users/search?q=${debouncedSearch}`);

      const data = await res.json();
      return data as { users: { id: number; firstName: string; lastName: string }[] };
    },
    onSettled: () => setLoading(false),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (selectedTag !== '') {
      setTags((prev) => [...prev, selectedTag]);
      setSelectedTag('');
      setSearch('');
      return;
    }

    setTags((prev) => [...prev, search]);
    setSearch('');
  }

  return (
    <div className='max-w-2xl mx-auto space-y-4'>
      <div className='border-2 rounded-lg py-2.5 px-4'>
        <div>
          {tags.map((tag, index) => {
            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                className='bg-muted p-0.5 pl-3 rounded-full inline-flex items-center justify-center gap-1.5 mr-2 mt-2 text-sm text-muted-foreground relative group'
              >
                {tag}
                <button
                  type='button'
                  className='rounded-full size-5 bg-background inline-flex items-center justify-center duration-300'
                  onClick={() => setTags((prev) => [...prev.filter((t) => t.toLowerCase() !== tag.toLowerCase())])}
                >
                  <X size={10} />
                </button>
              </div>
            );
          })}
        </div>
        <form className='pt-3' onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className='text-sm outline-none inline-block w-full bg-background'
            type='text'
            autoComplete='off'
            value={selectedTag || search}
            onChange={(e) => {
              setSearch(e.target.value);
              setLoading(true);
              setSelectedTag('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && search === '') {
                setTags((prev) => prev.slice(0, -1));
                e.preventDefault();
              }
            }}
            placeholder='Search...'
          />
        </form>
      </div>
      <div className='border-2 rounded-lg py-4 px-4 text-sm max-h-96 overflow-y-auto'>
        <div>
          {loading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Error!</div>
          ) : data?.users.length === 0 && search !== '' ? (
            <div>No users found.</div>
          ) : (
            <div className='space-y-1'>
              {data?.users.map((user) => {
                const name = `${user.firstName} ${user.lastName}`;
                return (
                  <button
                    key={user.id}
                    type='button'
                    className='block bg-muted rounded-md p-2 text-muted-foreground w-full text-left'
                    onClick={() => {
                      setSelectedTag(name);
                      inputRef.current?.focus();
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
