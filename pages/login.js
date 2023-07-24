import {useEffect, useState} from 'react'

import styles from '../styles/Login.module.css'
import {useSelector, useDispatch} from 'react-redux'
import {loginWithGoogle} from '../redux/features/authSlice'
import {useRouter} from 'next/router'
// import Image from "next/image";
import {Loader1} from '../utils/loaders/Loading'

export default function Login() {
	const router = useRouter()
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false)
	const status = useSelector((state) => state.userAuth.status)
	const authorized = useSelector((state) => state.userAuth.user.authorized)

	useEffect(() => {
		console.log(`authorized:${authorized}`)
		if (authorized) router.replace('/home', undefined, {shallow: true})
	}, [authorized]) //eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			{loading || status === 'checking' ? (
				<div className={styles.l_loader}>
					{/* {status !== "saving-user-details" && (
            <> */}
					<Loader1 />
					<div className={styles.status}>Loading please wait..</div>
					{/* </>
          )} */}
				</div>
			) : (
				<div className={styles.container}>
					<div className={styles.bg}>
						<img
							className={styles.bgimg1}
							src="/assets/land1.png"
							alt="bgimg"
						/>
						{/* <Image
              priority
              alt="bgimg1"
              layout="fill"
              objectPosition="65%"
              objectFit="cover"
              src="/assets/land1.png"
            /> */}
					</div>
					<div className={styles.content}>
						<div className={styles.desc}>
							<p className={styles.desc1}>stay connected</p>
							<p className={styles.desc2}>
								get movie recommendations
							</p>
						</div>
						<div className={styles.lbtn}>
							<button
								className={styles.signin}
								onClick={() => {
									dispatch(loginWithGoogle())
									setLoading(true)
								}}
							>
								<p>SignIn with Google</p>
								<i className="fa-brands fa-google"></i>
							</button>
							<button
								className={styles.guest}
								onClick={() => router.push('/home')}
							>
								view as a guest
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
