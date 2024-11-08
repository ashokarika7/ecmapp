// Write your code here
import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productsList: [],
    productCount: 1,
  }

  componentDidMount() {
    this.getProducts()
  }

  onClickPlus = () => {
    this.setState(prevState => ({
      productCount: prevState.productCount + 1,
    }))
  }

  onClickMinus = () => {
    const {productCount} = this.state
    if (productCount > 1) {
      this.setState(prevState => ({
        productCount: prevState.productCount - 1,
      }))
    }
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  getProducts = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const item = await response.json()

      const updatedData = {
        id: item.id,
        availability: item.availability,
        brand: item.brand,
        description: item.description,
        imageUrl: item.image_url,
        price: item.price,
        rating: item.rating,
        similarProducts: item.similar_products,
        style: item.style,
        title: item.title,
        totalReviews: item.total_reviews,
      }

      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }

    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {productsList} = this.state
    const {productCount} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      similarProducts,

      title,
      totalReviews,
    } = productsList
    return (
      <div className="productItemDetails-container-total-container">
        <div className="productItemDetails-container">
          <img
            className="productItemDetails-img"
            alt="product"
            src={imageUrl}
          />
          <div className="details-container">
            <h1 className="productItemDetails-title">{title}</h1>
            <p className="productItemDetails-price">RS {price}/-</p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="productItemDetails-rating">{rating}</p>
                <img
                  className="start-img"
                  alt="star"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                />
              </div>
              <p className="productItemDetails-reviews">
                {totalReviews} Reviews
              </p>
            </div>
            <p className="productItemDetails-description">{description}</p>
            <p className="productItemDetails-avialable">
              Available:{' '}
              <span className="productItemDetails-span">{availability}</span>
            </p>
            <p className="productItemDetails-avialable">
              Brand: <span className="productItemDetails-span">{brand}</span>
            </p>
            <hr />
            <div className="add-items-container">
              <button
                className="plus-minus-btn"
                aria-label="increase-quantity"
                data-testid="plus"
                type="button"
                onClick={this.onClickMinus}
              >
                <BsDashSquare className="plus-minus-img" />
              </button>
              <p className="products-count">{productCount}</p>
              <button
                className="plus-minus-btn"
                aria-label="decrease-quantity"
                type="button"
                data-testid="minus"
                onClick={this.onClickPlus}
              >
                <BsPlusSquare className="plus-minus-img" />
              </button>
            </div>
            <button type="button" className="add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <ul className="similar-products-ul-container">
          {similarProducts.map(eachItem => (
            <SimilarProductItem details={eachItem} key={eachItem.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="product-item-details-failure-container">
      <img
        alt="error view"
        className="error-view-img"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
      />
      <h1>Product Not Found</h1>
      <button
        onClick={this.onClickContinueShopping}
        type="button"
        className="failure-btn"
      >
        Continue Shopping
      </button>
    </div>
  )

  checkThePage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.checkThePage()}
      </div>
    )
  }
}

export default ProductItemDetails
