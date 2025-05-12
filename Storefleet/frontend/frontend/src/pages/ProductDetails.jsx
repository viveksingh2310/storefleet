import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewsError, setReviewsError] = useState(null);
  const [showReviews, setShowReviews] = useState(false);

  // Fetch product details
  useEffect(() => {
    fetch(`http://localhost:3000/api/storefleet/product/details/${id}`)// here we are using the product id to fetch the details of the product  
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch product details');
        return res.json();
      })
      .then((data) => {
        setProduct(data.productDetails);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Fetch reviews only when user clicks the button
  const handleToggleReviews = () => {
    const shouldShow = !showReviews;
    setShowReviews(shouldShow);

    if (shouldShow && reviews.length === 0) {
      setReviewsLoading(true);
      fetch(`http://localhost:3000/api/storefleet/product/reviews/${id}`)// here we are using the product id to fetch the reviews of the product
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch reviews');
          return res.json();
        })
        .then((data) => {
          setReviews(data.reviews || []);
          setReviewsLoading(false);
        })
        .catch((err) => {
          setReviewsError(err.message);
          setReviewsLoading(false);
        });
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product found.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{color:'#001572'}}>{product.name}</h1>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Rating:</strong> {product.rating?.toFixed(1)} / 5</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Stock:</strong> {product.stock}</p>

      <h3>Images:</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {product.images?.map((img) => (
          <img
            key={img._id}
            src={img.url}
            alt={product.name}
            style={{ width: '200px', height: 'auto', borderRadius: '8px' }}
          />
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={handleToggleReviews}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showReviews ? 'Hide Reviews' : 'Show Reviews'}
        </button>

        {showReviews && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3>Customer Reviews:</h3>
            {reviewsLoading ? (
              <p>Loading reviews...</p>
            ) : reviewsError ? (
              <p>Error: {reviewsError}</p>
            ) : reviews.length ? (
              <ul>
                {reviews.map((review) => (
                  <li key={review._id} style={{ marginBottom: '1rem' }}>
                    <p><strong>{review.name}</strong> rated it {review.rating}/5</p>
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
