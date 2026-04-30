function PersonImage({ currentSlideData, currentSlide }) {
  return (
    <div className="person-image">
      <img 
        src={currentSlideData.image} 
        alt={`${currentSlideData.name} ${currentSlideData.lastName || ''}`} 
        key={currentSlide}
      />
    </div>
  )
}

export default PersonImage
