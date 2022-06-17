import styles from "./feature.module.css";

export default function FeatureItem(props) {
    const { info } = props;


    return (
        <div className={styles.item}>
            <i className={info.icon}></i>
            <h3>{info.name}</h3>
            <p>{info.description}</p>
        </div>
    );
}