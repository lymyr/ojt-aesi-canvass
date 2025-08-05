import s from './Changelog.module.css'

function Changelog() {
    return (
        <div className={s.logContainer}>
     
            <div className={s.changelog}>
                <div className={s.header}>
                    <h1>{new Date().toLocaleString()}</h1>
                    <h1>Username</h1>
                </div>
                <div className={s.log}>
                    <div className={`${s.dataWrapper} ${s.before}`}>
                        <p className={s.description}>Item 1</p>
                        <p>Needed Amount: 53</p>
                        <div className={s.vendorContainer}>
                            <div className={s.vendorItem}>
                                <p className={s.vendorName}>Vendor 2</p>
                                <p>Order Amount: 53</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${s.dataWrapper} ${s.after}`}>
                        <p className={s.description}>Item 1</p>
                        <p>Needed Amount: 53</p>
                        <div className={s.vendorContainer}>
                            <div className={s.vendorItem}>
                                <p className={s.vendorName}>Vendor 2</p>
                                <p>Order Amount: 53</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Changelog