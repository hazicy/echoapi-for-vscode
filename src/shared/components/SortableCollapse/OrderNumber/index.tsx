import styles from "./style.module.css";

const OrderNumber = ({ orderNumber }: { orderNumber: number }) => {
  return <div className={styles.container}>{orderNumber}</div>;
};

export default OrderNumber;
