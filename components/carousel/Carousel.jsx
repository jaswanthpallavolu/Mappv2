import React from 'react'
import Slider from 'react-slick'
import Card from '../card/Card'
import styles from './carousel.module.css'
import { v4 } from 'uuid'
import styled from 'styled-components'

const Div = styled.div.attrs(props => ({
    className: `carousel ${props.size}`
}))`
`

export default function Carousel({ list, size }) {
    const settings = {
        lazyLoad: true,
        dots: false,
        speed: 500,
        infinite: false,
        slidesToShow: 6,
        slidesToScroll: 6,
        initialSlide: 0,
        centerMode: false,
        responsive: [
            {
                breakpoint: 1920,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                }
            },
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                }
            },

            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            }

        ]
    }
    return (

        <Div className={styles.m_carousel} size={size}>
            <Slider {...settings} >
                {list?.map(i => (
                    <div className={styles.wrapper} key={v4()}><Card id={i} style={{ margin: 'auto' }} size={size ? size : 'large'} /></div>
                ))}
            </Slider>
        </Div>
    )
}
