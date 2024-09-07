import {getRandomImage} from "@/actions";

export default async function StyledImage() {
    const image = await getRandomImage();

    return (
        <div className={styles.imageContainer}>
            <Image
                src={image.urls.regular}
                alt={image.description || "Random Unsplash Image"}
                fill
                className={styles.styledImage}
            />
        </div>
    );
}