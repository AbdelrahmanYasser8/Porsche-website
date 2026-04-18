import styles from './Orders.module.css';
import { useState } from 'react';

import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const ORDERS = [
	{
		id: '300001001',
		date: 'January 4, 2023',
		total: '$$71,300',
		status: 'Completed',
		items: [
			{ name: '718 Boxster', qty: 1, price: '$71,300' }
			
		],
	},
	{
		id: '503051001',
		date: 'July 18, 2025',
		total: '$444,700',
		status: 'Completed',
		items: [
			{ name: '911 GT3', qty: 1, price: '$230,500' },
			{ name: '911 Turbo', qty: 1, price: '214,200' },
		],
	},
	{
		id: '633002000',
		date: 'March 2026',
		total: '$156,300',
		status: 'Cancelled',
		items: [
			{ name: 'Macan', qty: 1, price: '$64,100' },
			{ name: 'Taycan', qty: 1, price: '$92,200' },
		],
	},

	// Page 2
	{
		id: '100000004',
		date: 'April 2024',
		total: '$85,400',
		status: 'Processing',
		items: [{ name: 'Cayenne', qty: 1, price: '$85,400' }],
	},
	{
		id: '100000005',
		date: 'May 2024',
		total: '$106,700',
		status: 'Completed',
		items: [{ name: 'Panamera', qty: 1, price: '$106,700' }],
	},
	{
		id: '100000006',
		date: 'June 2024',
		total: '$73,500',
		status: 'Cancelled',
		items: [{ name: '718 Cayman', qty: 1, price: '$73,500' }],
	},

	// Page 3
	{
		id: '100000007',
		date: 'July 2024',
		total: '$103,400',
		status: 'Completed',
		items: [{ name: 'Taycan Cross Turismo', qty: 1, price: '$103,400' }],
	},
	{
		id: '100000008',
		date: 'August 2024',
		total: '$89,800',
		status: 'Processing',
		items: [{ name: 'Macan Electric', qty: 1, price: '$89,800' }],
	},
	{
		id: '100000009',
		date: 'September 2024',
		total: '$118,900',
		status: 'Completed',
		items: [{ name: '911 Carrera', qty: 1, price: '$118,900' }],
	},
];

function StatusBadge({ status }) {
	if (status === 'Completed') {
		return <span className="fw-semibold" style={{ color: '#28a745', fontSize: '0.88rem' }}>{status}</span>;
	}
	if (status === 'Processing') {
		return <span className="px-3 py-1 rounded-2 fw-semibold" style={{ backgroundColor: '#ffc107', color: '#333', fontSize: '0.88rem' }}>{status}</span>;
	}
	if (status === 'Cancelled') {
		return <span className="px-3 py-1 rounded-2 fw-semibold" style={{ backgroundColor: '#f8d7da', color: '#c0392b', fontSize: '0.88rem' }}>{status}</span>;
	}
	return <span>{status}</span>;
}

export function OrdersContent() {
	const [currentPage, setCurrentPage] = useState(1);

	// ✅ Pagination setup
	const ORDERS_PER_PAGE = 3;
	const TOTAL_PAGES = Math.ceil(ORDERS.length / ORDERS_PER_PAGE);

	const start = (currentPage - 1) * ORDERS_PER_PAGE;
	const paginatedOrders = ORDERS.slice(start, start + ORDERS_PER_PAGE);

	return (
		<div className="d-flex flex-column gap-4">

			{paginatedOrders.map((order) => (
				<div key={order.id} className="card border-0 shadow-sm rounded-4 p-4">
					<div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
						<div className="d-flex align-items-center gap-4 flex-wrap">
							<div>
								<div className="text-muted" style={{ fontSize: '0.75rem' }}>Order ID</div>
								<div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{order.id}</div>
							</div>
							<div className="d-flex align-items-center gap-1">
							<i className="fas fa-calendar text-muted"></i>
								<div>
									<div className="text-muted" style={{ fontSize: '0.75rem' }}>Order date</div>
									<div className="fw-semibold">{order.date}</div>
								</div>
							</div>
							<div className="d-flex align-items-center gap-1">
							<i className="fas fa-dollar-sign text-muted"></i>
								<div>
									<div className="text-muted" style={{ fontSize: '0.75rem' }}>Total</div>
									<div className="fw-semibold">{order.total}</div>
								</div>
							</div>
						</div>
						<StatusBadge status={order.status} />
					</div>

					<div className="mt-1">
						<div className="fw-semibold mb-2">Items</div>
						{order.items.map((item, i) => (
							<div key={i}>
								<div className="d-flex justify-content-between py-2">
									<div>
										<div>{item.name}</div>
										<div className="text-muted">Quantity: {item.qty}</div>
									</div>
									<div className="fw-semibold">{item.price}</div>
								</div>
								{i < order.items.length - 1 && <hr />}
							</div>
						))}
					</div>
				</div>
			))}

			<div className="d-flex justify-content-center gap-2 mt-2">
				<button
					className="border-0 bg-transparent btn-sm"
					onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
					disabled={currentPage === 1}
				>
					<i className={`fa-solid fa-angle-left fs-5 ${styles.arrowIcon}`}></i>
				</button>

				{Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
					<button
						key={page}
						onClick={() => setCurrentPage(page)}
						className={`btn btn-sm ${currentPage === page ? 'fw-bold' : ''}`}
					>
						{page}
					</button>
				))}

				<button
					className="border-0 bg-transparent btn-sm"
					onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
					disabled={currentPage === TOTAL_PAGES}
				>
					<i className={`fa-solid fa-angle-right fs-5 ${styles.arrowIcon}`}></i>
				</button>
			</div>
		</div>
	);
}