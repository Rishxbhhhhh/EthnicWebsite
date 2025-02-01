import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css'; // Import the CSS file for styling
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slides, setSlides] = useState([]);  // State to hold the slides data
    const carouselRef = useRef(null); // Ref to enable drag functionality

    // Fetch data from MongoDB (Backend API)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/category/carousel'); // Adjust the URL as needed
                const data = await response.json();
                setSlides(data);
                console.log("Fetched Data:", slides);  // Log fetched data for debugging
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };
    
    useEffect(() => {
        // Set interval to change slide every 5 seconds
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    if (slides.length === 0) {
        return <div>Loading...</div>;  // Loading state until data is fetched
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };


    return (
        <div className="carousel" ref={carouselRef} style={{ cursor: 'grab' }}>
            <button className="carousel-button prev" onClick={prevSlide}>
                <FaAngleLeft />
            </button>

            <div className="carousel-slide-container">
                <div className="carousel-slide" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {slides.map((slide) => (
                        <div className="carousel-image-container" key={slide.id}>
                            <h1>image</h1>
                            <img 
                                src={slide.image} 
                                alt={slide.content} 
                                className="carousel-image" 
                            />
                        </div>
                    ))}
                </div>
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