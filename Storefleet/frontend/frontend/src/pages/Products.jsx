import { useEffect, useState } from 'react';
import Card from '../components/Card';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [lowPrice, setLowPrice] = useState('');
  const [highPrice, setHighPrice] = useState('');
  const [rating, setRating] = useState('');
  const [page, setPage] = useState(1);

  // Debounced search state
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // delay before API call
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const query = new URLSearchParams();

    if (debouncedSearch) query.append('name', debouncedSearch);
    if (category) query.append('category', category);
    if (lowPrice) query.append('low', lowPrice);
    if (highPrice) query.append('high', highPrice);
    if (rating) query.append('rating', rating);
    if (page) query.append('page', page);
    query.append('limit', 10);

    setLoading(true);

    fetch(`http://localhost:3000/api/storefleet/product/products?${query.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [debouncedSearch, category, lowPrice, highPrice, rating, page]);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Products</h1>

      {/* Filters Section */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        alignItems: 'flex-end'
      }}>
        <div>
          <label>Search: </label>
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <label>Category: </label>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label>Min Price: </label>
          <input
            type="number"
            placeholder="0"
            value={lowPrice}
            onChange={(e) => setLowPrice(e.target.value)}
          />
        </div>

        <div>
          <label>Max Price: </label>
          <input
            type="number"
            placeholder="1000"
            value={highPrice}
            onChange={(e) => setHighPrice(e.target.value)}
          />
        </div>

        <div>
          <label>Rating ≥</label>
          <input
            type="double"
            placeholder="1 to 5"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>

        <div>
          <button onClick={() => {
            setSearch('');
            setCategory('');
            setLowPrice('');
            setHighPrice('');
            setRating('');
            setPage(1);
          }}>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Product Cards */}
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {products.length > 0 ? (
              products.map((product) => (
                <Card
                  key={product._id}
                  _id={product._id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  rating={product.rating}
                  category={product.category}
                  image={product.images?.[0]?.url}
                />
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>

          {/* Pagination */}
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span style={{ margin: '0 1rem' }}>Page {page}</span>
            <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;
