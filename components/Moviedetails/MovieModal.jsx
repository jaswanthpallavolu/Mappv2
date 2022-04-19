import { Backdrop, Modal, Fade, Box } from '@mui/material';
import Movie from './Movie';
import styles from './movieModal.module.css'

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setOpen } from '../../redux/features/movieSlice';

export default function MovieModal() {
    const dispatch = useDispatch()
    const open = useSelector(state => state.movie.open)
    const handleClose = () => dispatch(setOpen(false));

    //facing renddering issues with this custom
    const customBackdrop = () => {
        return (
            <Backdrop
                sx={{ color: 'rgba(0,0,0,.7) !important' }}
                open={open}
                onClick={handleClose}
            ></Backdrop>
        )
    }

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box className={styles.box}>
                        <Movie />
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}
