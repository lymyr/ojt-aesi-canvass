import s from './Changelog.module.css'

function Changelog() {
    return (
        <div className={s.logContainer}>
        {[1, 2].map((_, idx) => (
            <div className={s.changelog} key={idx}>
            <div className={s.header}>
                <h1>{new Date().toLocaleString()}</h1>
                <h1>Username</h1>
            </div>
            <div className={s.beforeAfter}>
                <div className={s.before}>
                <div className={s.rowContainer}>
                    <p>Item 1</p>
                    <p>Needed Amount: 53</p>
                    <div className={s.vendorContainer}>
                    <div className={s.vendorItem}>
                        <p>Vendor 2</p>
                        <p>Order Amount: 53</p>
                    </div>
                    </div>
                </div>
                </div>
                <div className={s.after}>
                <div className={s.rowContainer}>
                    <p>Item 1</p>
                    <p>Needed Amount: 75</p>
                    <div className={s.vendorContainer}>
                    <div className={s.vendorItem}>
                        <p>Vendor 2</p>
                        <p>Order Amount: 75</p>
                    </div>
                    </div>
                </div>
                <div className={s.rowContainer}>
                    <p>Item 2</p>
                    <p>Needed Amount: 32</p>
                    <div className={s.vendorContainer}>
                    <div className={s.vendorItem}>
                        <p>Vendor 1</p>
                        <p>Order Amount: 30</p>
                    </div>
                    <div className={s.vendorItem}>
                        <p>Vendor 2</p>
                        <p>Order Amount: 2</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        ))}
        </div>
    )
}

export default Changelog