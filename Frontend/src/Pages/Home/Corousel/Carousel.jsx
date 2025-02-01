import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css'; // Import the CSS file for styling
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/category');
                const data = await response.json();
    
                // Validate if the response contains the expected data
                if (data.success === false || !Array.isArray(data)) {
                    setSlides([]); // Set to an empty array if no categories found
                } else {
                    setSlides(data); // Set the data to state
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setSlides([]); // Set to an empty array on error
            }
        };
    
        fetchData();
    }, []); // Empty dependency array ensures fetch only runs once on mount
    

    const nextSlide = () => {
        if (slides.length > 0) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }
    };

    const prevSlide = () => {
        if (slides.length > 0) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
        }
    };

    const goToSlide = (index) => {
        if (slides.length > 0) {
            setCurrentIndex(index);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <div className="carousel" ref={carouselRef}>
            <button className="carousel-button prev" onClick={prevSlide}>
                <FaAngleLeft />
            </button>

            <div className="carousel-slide-container">
                {slides.length > 0 ? (

                    <div className="carousel-slide" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {slides.map((slide, index) => (
                        <div className="carousel-image-container" key={index}>
                            <img
                                src={slide.images[0]}  // Use the first image from the category's images
                                alt={slide.name}
                                className="carousel-image"
                                />
                        </div>
                    ))}
                </div>
                ) : (
                    <p>No categories available</p>
                )}
            </div>

            <button className="carousel-button next" onClick={nextSlide}>
                <FaAngleRight />
            </button>

            <div className="carousel-dots">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${currentIndex === index ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
