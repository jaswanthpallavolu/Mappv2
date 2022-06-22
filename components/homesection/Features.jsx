import React from "react";
import styles from "./feature.module.css";
import Feature from "./Feature";

function Features() {
    const featurelist = [
        {
            id: "1",
            icon: "fa-solid fa-film",
            name: "Recommedation System",
            description: "Both content based and collaborative filtering.",
        },
        {
            id: "2",
            icon: "fa-solid fa-clapperboard",
            name: "Personalized",
            description: "Personalized home page based on your activity.",
        },
        {
            id: "3",
            icon: "fa-solid fa-handshake",
            name: "Stay Connected ",
            description: "Connect with your friends and add new friends.",
        },
        {
            id: "4",
            icon: "fa-solid fa-arrow-up-right-from-square",
            name: "Suggestions",
            description: "Suggest movies you like with your friends.",
        }
    ];

    return (
        <div className={styles.features}>
            {featurelist.map((f, index) => (
                <Feature key={index} info={f} />
            ))}
        </div>
    );

}

export default Features;