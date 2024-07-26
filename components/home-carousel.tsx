
"use client";

import { Container, Carousel } from "react-bootstrap";
import classes from "./home-carousel.module.css";
import {useRouter} from "next/navigation";
export default function HomeCarousel() {
    const router = useRouter();
    // @ts-ignore
    return (
        <div className={classes.container}>
            <Container fluid="md">
                <Carousel variant="dark">
                    <Carousel.Item>
                        <div className={classes.title} onClick={() => { router.push("/grid")}} >
                            Plan!
                        </div>
                        <Carousel.Caption>
                            <h5>Second slide label</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                        <div className={classes.title}>
                            Act!
                        </div>
                        <Carousel.Caption>
                            <h5>Second slide label</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className={classes.title}>
                            Grow!
                        </div>

                        <Carousel.Caption>
                            <h5>Third slide label</h5>
                            <p>
                                Praesent commodo cursus magna, vel scelerisque nisl
                                consectetur.
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </Container>
        </div>
    );
}