import Image from 'next/image';
import styles from './styled-image.module.css';

const StyledImage = () => {
    return (
        <div className={styles.imageContainer}>
            <Image
                src="https://source.unsplash.com/random"
                alt="Styled image"
                layout="fill"
                objectFit="cover"
                className={styles.styledImage}
            />
        </div>
    );
};

export default StyledImage;
