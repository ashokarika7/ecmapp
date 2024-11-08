// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  return (
    <li className="similar-products-li-container">
      <img
        alt={`similar product ${details.title}`}
        className="similar-products-img"
        src={details.image_url}
      />
      <h1 className="similar-products-title">{details.title}</h1>
      <p className="similar-products-para">
        by <span className="similar-products-span">{details.brand}</span>
      </p>
      <div className="price-rating-container">
        <p className="similar-products-price">Rs {details.price}/-</p>
        <div className="similar-products-rating-star-container">
          <p className="similar-products-rating">{details.rating}</p>
          <img
            alt="start"
            className="similar-products-star"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
