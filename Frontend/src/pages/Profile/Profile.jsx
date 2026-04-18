import './Profile.module.css';
import { useState } from 'react';

import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { OrdersContent } from '../Orders/Orders';

export default function Profile() {
	const [activeTab, setActiveTab] = useState('settings');
	const [fullName, setFullName] = useState('');
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');

	const displayName = fullName.trim() || 'Username';
	const avatarLetter = displayName.charAt(0).toUpperCase();

	const handleSaveChanges = () => {
		setMessage('Profile updated successfully ✅');
		setTimeout(() => setMessage(''), 2000);
	};

	const handleUpdatePassword = () => {
		if (!currentPassword || !newPassword || !confirmPassword) {
			setMessage('Please fill all password fields ❌');
			return;
		}

		if (newPassword !== confirmPassword) {
			setMessage('Passwords do not match ❌');
			return;
		}

		if (newPassword.length < 8) {
			setMessage('Password must be at least 8 characters ❌');
			return;
		}

		setMessage('Password updated successfully ✅');

		setCurrentPassword('');
		setNewPassword('');
		setConfirmPassword('');

		setTimeout(() => setMessage(''), 2000);
	};

	return (
		<div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f0f0f0' }}>
			<Navbar />

			<main className="flex-grow-1 py-5">
				<div className="container" style={{ maxWidth: '900px' }}>

					<h2 className="fw-bold mb-4" style={{ fontSize: '1.6rem' }}>
						My Profile
					</h2>

					{message && (
						<div className="alert alert-info py-2 text-center">
							{message}
						</div>
					)}

					<div className="row g-4 align-items-stretch">

						{/* SIDEBAR */}
						<div className="col-12 col-md-4">
							<div className="card border-0 shadow-sm rounded-4 py-4 px-3 h-100">

								<div className="d-flex flex-column align-items-center mb-4">
									<div
										className="rounded-circle d-flex align-items-center justify-content-center mb-3"
										style={{
											width: '80px',
											height: '80px',
											backgroundColor: '#111',
											color: '#fff',
											fontSize: '2rem',
											fontWeight: '600'
										}}
									>
										{avatarLetter}
									</div>

									<h6 className="fw-bold mb-0">{displayName}</h6>
									<small className="text-muted">you@example.com</small>
								</div>

								<nav className="d-flex flex-column gap-1">

									<button
										onClick={() => setActiveTab('settings')}
										className={`btn text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 ${
											activeTab === 'settings'
												? 'bg-light fw-semibold shadow-sm'
												: 'bg-white text-muted'
										}`}
									>
										<i className="bi bi-person"></i>
										Profile Settings
									</button>

									<button
										onClick={() => setActiveTab('orders')}
										className={`btn text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 ${
											activeTab === 'orders'
												? 'bg-light fw-semibold shadow-sm'
												: 'bg-white text-muted'
										}`}
									>
										<i className="bi bi-bag"></i>
										Order History
									</button>

									<button className="btn bg-white text-muted text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0">
										<i className="bi bi-box-arrow-right"></i>
										Logout
									</button>

								</nav>
							</div>
						</div>

						{/* CONTENT */}
						<div className="col-12 col-md-8">
							{activeTab === 'settings' ? (
								<div className="d-flex flex-column gap-4">

									{/* EDIT PROFILE */}
									<div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: '#f8f9fa' }}>
										<h5 className="fw-bold mb-4">Edit Profile</h5>

										<div className="mb-3">
											<label className="form-label text-muted">Full Name</label>

											<div className="input-group">
												<span className="input-group-text bg-white border-end-0">
													<i className="bi bi-person text-muted"></i>
												</span>

												<input
													type="text"
													className="form-control border-start-0"
													placeholder="Username"
													value={fullName}
													onChange={(e) => setFullName(e.target.value)}
												/>
											</div>
										</div>

										<button
											onClick={handleSaveChanges}
											className="btn text-white d-flex align-items-center gap-2 px-3 py-2  "
											style={{
												backgroundColor: '#111',
												borderRadius: '6px',
												fontSize: '0.85rem',
												width: 'fit-content'
											}}
										>
											<i className="bi bi-floppy"></i>
											Save Changes
										</button>
									</div>

									{/* CHANGE PASSWORD */}
									<div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: '#f8f9fa' }}>
										<h5 className="fw-bold mb-4">Change Password</h5>

										{/* Current Password */}
										<div className="mb-5">
											<label className="form-label text-muted">Current Password</label>
											<div className="input-group">
												<span className="input-group-text bg-white border-end-0">
													<i className="bi bi-lock text-muted"></i>
												</span>
												<input
													type="password"
													className="form-control border-start-0"
													placeholder="••••••••"
													value={currentPassword}
													onChange={(e) => setCurrentPassword(e.target.value)}
												/>
											</div>
										</div>

										{/* New Password */}
										<div className="mb-5">
											<label className="form-label text-muted">Password</label>
											<div className="input-group">
												<span className="input-group-text bg-white border-end-0">
													<i className="bi bi-lock text-muted"></i>
												</span>
												<input
													type="password"
													className="form-control border-start-0"
													placeholder="••••••••"
													value={newPassword}
													onChange={(e) => setNewPassword(e.target.value)}
												/>
											</div>
										</div>

										{/* Confirm Password */}
										<div className="mb-5">
											<label className="form-label text-muted">Confirm Password</label>
											<div className="input-group">
												<span className="input-group-text bg-white border-end-0">
													<i className="bi bi-lock text-muted"></i>
												</span>
												<input
													type="password"
													className="form-control border-start-0"
													placeholder="••••••••"
													value={confirmPassword}
													onChange={(e) => setConfirmPassword(e.target.value)}
												/>
											</div>
										</div>

										<button
											onClick={handleUpdatePassword}
											className="btn text-white d-flex align-items-center gap-2 px-3 py-2"
											style={{
												backgroundColor: '#111',
												borderRadius: '6px',
												fontSize: '0.85rem',
												width: 'fit-content'
											}}
										>
											<i className="bi bi-lock"></i>
											Update Password
										</button>
									</div>

								</div>
							) : (
								<OrdersContent />
							)}
						</div>

					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}