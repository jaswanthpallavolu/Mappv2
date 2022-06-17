import React from "react";
import styles from "./feature.module.css";
import FeatureItem from "./FeatureItem";

function Features() {
    const featurelist = [
        {
            id: "1",
            name: "",
            description: "",
        },
        {
            id: "2",
            name: "",
            description: "",
        },
        {
            id: "3",
            name: "",
            description: "",
        },
        {
            id: "4",
            name: "",
            description: "",
        }
    ];

    return (
        <div className={styles.features}>
            {featurelist.map((f, index) => (
                <featureItem key={index} info={f} />
            ))}
        </div>
    );

}

export default Features;