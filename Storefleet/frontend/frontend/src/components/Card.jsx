import { Link } from 'react-router-dom';
import './Card.css'; // Import external CSS

function Card({ _id, name, description, price, rating, category, image }) {
  return (
    <Link to={`/product/${_id}`} className="card-link">
      <div className="card">
        {image && <img src={image} alt={name} className="card-image" />}
        <h2 style={{color:'#001572'}}>{name}</h2>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Rating:</strong> {rating}/100</p>
        <p><strong>Category:</strong> {category}</p>
      </div>
    </Link>
  );
}

export default Card;
