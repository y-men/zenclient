"use client";
import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import classes from "./page.module.css";
import StyledImage from "@/app/home/styled-image";


interface Item {
    id: number;
    title: string;
}

const Home: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);

    const fetchMoreData = () => {
        // Simulating an API call to fetch more data
        setTimeout(() => {
            const newItems: Item[] = [...Array(10)].map((_, index) => ({
                id: items.length + index + 1,
                title: `Item ${items.length + index + 1}`
            }));

            setItems(prevItems => [...prevItems, ...newItems]);
            setPage(prevPage => prevPage + 1);

            if (page > 5) {
                setHasMore(false);
            }
        }, 1000);
    };

    useEffect(() => {
        fetchMoreData();
    }, []); // Empty dependency array to run only once on mount

    function getHomePageGreeting() {
        let greeting = "Welcome";
        const username = "[user]";
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) {
            greeting = "Good Morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            greeting = "Good Afternoon";
        } else if (currentHour >= 18 || currentHour < 5) {
            greeting = "Good Evening";
        }
        return <>{greeting} {username}!</>;
    }

    return (
        <Container className="mt-4">
            {/*//TODO  Align the div to current container*/}
            <div style={{
                position: "absolute",
                top: 80,
                right: 20,
                width: "300px",
                height: "500px",
                border: "1px solid lightgrey",
                color: "lightgrey",
            }}>
                <StyledImage />
            </div>
            <div className="mb-4 text-center">
                <span className={classes.jotiOneWelcome}>{getHomePageGreeting()}</span>
            </div>
            <InfiniteScroll
                dataLength={items.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                    <div className="text-center my-3">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                }
                endMessage={
                    <p className="text-center my-3">
                        <b>You have seen all items</b>
                    </p>
                }
            >
                {items.map((item) => (
                    <Card key={item.id} className="my-3">
                        <Card.Body>
                            <Card.Title>{item.title}</Card.Title>
                            <Card.Text>This is some example content for {item.title}.</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </InfiniteScroll>
        </Container>
    );
};

export default Home;