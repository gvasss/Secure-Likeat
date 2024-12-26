import './StarRating.css';
import PropTypes from 'prop-types';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, index) => (
        <i key={`full-${index}`} className="fas fa-star"></i>
      ))}
      {halfStar && <i className="fas fa-star-half-alt"></i>}
      {[...Array(emptyStars)].map((_, index) => (
        <i key={`empty-${index}`} className="far fa-star"></i>
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;