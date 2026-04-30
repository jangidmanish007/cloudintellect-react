const REVIEWS_BASE = '/images/Reviews'
const GOOGLE_ICON = `${REVIEWS_BASE}/SVG (5).svg`

const REVIEWS = [
  {
    name: 'Ganesh More',
    time: '1 year ago',
    profileImage: `${REVIEWS_BASE}/Profile Image.webp`,
    rating: 5,
    text: 'For those aspiring to kickstart their careers in the IT field, I highly recommend joining Cloud Intellect. The trainers adapt their teaching to your learning pace, addressing every doubt.',
    readMoreUrl: '#',
  },
  {
    name: 'Saurabh Ganvir',
    time: '1 year ago',
    profileImage: `${REVIEWS_BASE}/Profile Image-1.webp`,
    rating: 5,
    text: 'The teaching was excellent. Training session was outstanding! The knowledge of the subject matter was evident, and you delivered the material in a way that was easy to understand.',
    readMoreUrl: '#',
  },
  {
    name: 'Ashutosh Ganvir',
    time: '1 year ago',
    profileImage: `${REVIEWS_BASE}/Profile Image-2.webp`,
    rating: 5,
    text: 'Our trainer has explained and cleared all doubts. I had a great time and learning experience from cloud intellect.',
    readMoreUrl: '#',
  },
]

function StarRating({ count = 5 }) {
  return (
    <span className="reviews-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="reviews-star" aria-hidden>★</span>
      ))}
    </span>
  )
}

function StudentReviewsSection() {
  return (
    <section className="student-reviews-section">
      <div className="student-reviews-container">
        <header className="student-reviews-header">
          <h2 className="student-reviews-title">
            What Say <strong>Our Students</strong>
          </h2>
          <div className="student-reviews-summary">
            <span className="student-reviews-excellent">EXCELLENT</span>
            <StarRating count={5} />
            <span className="student-reviews-based">Based on <strong className="student-reviews-based-strong">93 reviews</strong></span>
            <span className="student-reviews-google">
              <img src={encodeURI(GOOGLE_ICON)} alt="" width={24} height={24} aria-hidden />
              <span>Google</span>
            </span>
          </div>
        </header>
        <div className="student-reviews-cards">
          {REVIEWS.map((review, index) => (
            <article key={index} className="student-review-card">
              <div className="student-review-card-header">
                <div className="student-review-card-user">
                  <img
                    src={encodeURI(review.profileImage)}
                    alt=""
                    className="student-review-card-avatar"
                    width={48}
                    height={48}
                    decoding="async"
                  />
                  <div>
                    <h3 className="student-review-card-name">{review.name}</h3>
                    <span className="student-review-card-time">{review.time}</span>
                  </div>
                </div>
                <img
                  src={encodeURI(GOOGLE_ICON)}
                  alt=""
                  className="student-review-card-google"
                  width={20}
                  height={20}
                  aria-hidden
                />
              </div>
              <StarRating count={review.rating} />
              <p className="student-review-card-text">{review.text}</p>
              <a href={review.readMoreUrl} className="student-review-card-readmore">
                Read more
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StudentReviewsSection
