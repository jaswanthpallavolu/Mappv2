import Layout from '../../components/Layout'
import styles from '../../styles/Home.module.css'
import Categories from '../../components/Home_categories/Categories'
import {useEffect} from 'react'
import HomeSection from '../../components/homesection/homesection'
function Home() {
	return (
		<div className={styles.home}>
			<div className={styles.container}>
				<HomeSection />
				<Categories />
			</div>
		</div>
	)
}

export function Notch() {
	const notchState = () => {
		const notch = document.querySelector('#notch')
		if (notch) {
			if (window.scrollY < window.innerHeight / 3.5) {
				notch.style.transform = 'scale(0)'
			} else {
				notch.style.transform = 'scale(1)'
			}
		}
	}
	useEffect(() => {
		window.addEventListener('scroll', notchState)
		return () => {
			window.removeEventListener('scroll', notchState)
		}
	}, [])
	return (
		<div
			className={styles.notch}
			id="notch"
			onClick={() => {
				window.scrollTo({top: 0, behavior: 'smooth'})
			}}
		>
			<i className="fas fa-arrow-circle-up"></i>
		</div>
	)
}
Home.Layout = Layout

export default Home
