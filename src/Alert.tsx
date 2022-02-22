/** @format */
import { useEffect } from "react";
import AlertObj from "./interface/AlertObj";
import AlertIcon from "./AlertIcon";
import Loading from "./Loading";

export default function Alert({ loading, alert, style }: { loading: boolean; alert: AlertObj; style: object }) {
	useEffect(() => {
		console.log("Alert mounted");

		return () => {
			console.log("Alert unmounted");
		};
	}, []);

	if (loading) {
		return <Loading />;
	} else if (!alert.type) {
		return null;
	} else {
		return (
			<div style={style} className='container'>
				<div className={`Alert ${alert.type}`}>
					<div className='Alert__Header'>
						<div className='Alert__Icon'>
							<AlertIcon type={alert.type} />
						</div>
						<h2 className='Alert__Title'>{alert.title}</h2>
					</div>
					<div className='Alert__Body'>
						<p className='Alert__Description'>{alert.description}</p>
					</div>
				</div>
			</div>
		);
	}
}
