import React, { FormEvent, useState,useCallback } from 'react';
import { SearchResults } from './components/SearchResults';


type Results = {
  totalPrice: number;
  data: any[];
}

interface ProductType {
  id: number
  title: string
  price: string
  priceFormatted: string
}
function App() {

  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Results>({
    totalPrice: 0,
    data: []
  });

  async function handleSearch(event: FormEvent) {
    event.preventDefault();

    if (!search.trim()) { return; }

    const response = await fetch(`http://localhost:3333/products?q=${search}`)
    const data = await response.json();

    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    const products = data.map(product => {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        priceFormatted: formatter.format(product.price)
      }
    })
    const totalPrice = data.reduce((total: number, product: ProductType) => {
      return total + product.price;
    }, 0)
    setResults({ totalPrice, data: products });

  }

  const addToWishlist = useCallback(async (id: number) => {
    console.log(id);
  }, [])

  return (
    <div className="App">
      <h1>Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
        >
        </input>

        <button type="submit">Buscar</button>
      </form>

      <SearchResults
        results={results.data}
        totalPrice={results.totalPrice}
        onAddToWishList={addToWishlist}
      />
    </div>
  );
}

export default App;
