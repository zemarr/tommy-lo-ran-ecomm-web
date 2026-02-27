import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllCategories } from '@/lib/server/actions/product.actions'
import { SearchIcon } from 'lucide-react';

const Search = async () => {
  const categories = await getAllCategories();

  return (
    <form action="/search" method="GET">
      <div className="flex items-center w-full space-x-2">
        <Select name={'category'}>
          <SelectTrigger className='w-[180px] h-auto! py-3'>
            <SelectValue placeholder='All' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="All" value='all'>
              All
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.category} value={category.category}>
                {category.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="text" placeholder="Search by product name" name="q" className='w-full py-3 h-auto' />
        <Button type="submit" className={"p-4 size-11"}>
          <SearchIcon />
        </Button>
      </div>
    </form>
  )
}

export default Search