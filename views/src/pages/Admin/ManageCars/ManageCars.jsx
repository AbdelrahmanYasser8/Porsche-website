import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from "../../../components/Loader/Loader";
import Pagination from "../../../components/Pagination/Pagination";
import { carsApi } from "../../../api/cars";
import { useToast } from "../../../components/Toast/ToastProvider";
import { getCarFallbackImage } from "../../../utils/carAssets";
import styles from './ManageCars.module.css';

const wheelOptions = ['Wheel Type 1', 'Wheel Type 2', 'Wheel Type 3', 'Wheel Type 4'];
const categories = ['SUV', 'Sports', 'Electric', 'Sedan', 'Coupe', 'Truck'];
const fuelTypes = ['Gasoline', 'Electric'];

const emptyCarForm = {
  name: '',
  make: 'Porsche',
  category: 'SUV',
  manufactureYear: '2026',
  price: '',
  thumbnailFileName: '',
  thumbnailPreview: '',
  description: '',
  colors: '',
  wheels: [],
  horsepower: '',
  topSpeed: '',
  fuelType: 'Gasoline',
  seating: '',
  modelFileName: '',
  modelFileId: '',
  modelFile: null,
  status: 'In Stock',
};

const initialFormErrors = {
  name: '',
  price: '',
  thumbnailFileName: '',
  category: '',
  manufactureYear: '',
  description: '',
  colors: '',
  wheels: '',
  horsepower: '',
  topSpeed: '',
  fuelType: '',
  seating: '',
  modelFileName: '',
  modelFileId: '',
  modelFile: null,
};

const initialFormTouched = {
  name: false,
  price: false,
  thumbnailFileName: false,
  category: false,
  manufactureYear: false,
  description: false,
  colors: false,
  wheels: false,
  horsepower: false,
  topSpeed: false,
  fuelType: false,
  seating: false,
  modelFileName: false,
};

function formatCurrency(value) {
  return `$${value.toLocaleString()}`;
}

function toFormState(car) {
  return {
    name: car.name || '',
    make: car.make || 'Porsche',
    category: car.category || 'SUV',
    manufactureYear: String(car.year || car.manufactureYear || '2026'),
    price: String(car.price || ''),
    thumbnailFileName: car.thumbnailFileName || 'Current thumbnail',
    thumbnailPreview: car.image || '',
    description: car.description || '',
    colors: car.colors || '',
    wheels: car.wheels || [],
    horsepower: String(car.horsepower || ''),
    topSpeed: String(car.topSpeed || ''),
    fuelType: car.fuelType || 'Gasoline',
    seating: String(car.seating || ''),
    modelFileName: car.modelFileName || '',
    modelFileId: car.modelFileId || '',
    modelFile: null,
    status: car.status || 'In Stock',
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

function isBlank(value) {
  return !String(value || '').trim();
}

function validatePositiveNumber(value, label) {
  if (isBlank(value)) {
    return `${label} is required.`;
  }

  if (Number(value) <= 0) {
    return `${label} must be greater than 0.`;
  }

  return '';
}

function validateCarForm(values) {
  const nextErrors = { ...initialFormErrors };

  if (isBlank(values.name)) {
    nextErrors.name = 'Car name is required.';
  }

  nextErrors.price = validatePositiveNumber(values.price, 'Price');
  nextErrors.horsepower = validatePositiveNumber(values.horsepower, 'Horse power');
  nextErrors.topSpeed = validatePositiveNumber(values.topSpeed, 'Top speed');
  nextErrors.seating = validatePositiveNumber(values.seating, 'Seating');

  if (isBlank(values.manufactureYear)) {
    nextErrors.manufactureYear = 'Manufacture year is required.';
  } else if (Number(values.manufactureYear) < 1948) {
    nextErrors.manufactureYear = 'Manufacture year must be 1948 or later.';
  }

  if (isBlank(values.thumbnailFileName)) {
    nextErrors.thumbnailFileName = 'Thumbnail image is required.';
  }

  if (isBlank(values.description)) {
    nextErrors.description = 'Description is required.';
  }

  if (isBlank(values.colors)) {
    nextErrors.colors = 'Available colors are required.';
  }

  if (!values.wheels.length) {
    nextErrors.wheels = 'Choose at least one wheel type.';
  }

  if (isBlank(values.modelFileId) && !values.modelFile) {
    nextErrors.modelFileName = '3D model file is required.';
  }

  return nextErrors;
}

function getVisibleError(submitted, touched, field, error) {
  return submitted || touched[field] ? error : '';
}

export default function ManageCars() {
  const { showToast } = useToast();
  const [cars, setCars] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    totalItems: 0,
    totalPages: 0,
  });
  const [summary, setSummary] = useState({
    totalCars: 0,
    inStock: 0,
    outStock: 0,
  });
  const [search, setSearch] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [formData, setFormData] = useState(emptyCarForm);
  const [formErrors, setFormErrors] = useState(validateCarForm(emptyCarForm));
  const [formTouched, setFormTouched] = useState(initialFormTouched);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let active = true;

    const loadCars = async () => {
      try {
        setLoading(true);
        const response = await carsApi.list({
          search: search.trim() || undefined,
          page: currentPage,
          limit: pageSize,
        });

        if (active) {
          const nextCars = Array.isArray(response) ? response : response.items || [];
          setCars(nextCars);
          if (response && typeof response === 'object' && 'pagination' in response) {
            setPagination(response.pagination);
            setSummary({
              totalCars: response.summary?.totalCars ?? response.pagination.totalItems ?? nextCars.length,
              inStock: response.summary?.inStock ?? nextCars.filter((car) => car.status === 'In Stock').length,
              outStock: response.summary?.outStock ?? nextCars.filter((car) => car.status !== 'In Stock').length,
            });
            setCurrentPage(response.pagination.page || currentPage);
          } else {
            const inStockCount = nextCars.filter((car) => car.status === 'In Stock').length;
            setPagination({
              page: currentPage,
              limit: pageSize,
              totalItems: nextCars.length,
              totalPages: nextCars.length ? 1 : 0,
            });
            setSummary({
              totalCars: nextCars.length,
              inStock: inStockCount,
              outStock: nextCars.length - inStockCount,
            });
          }
        }
      } catch (error) {
        if (active) {
          showToast({
            variant: 'danger',
            message: error.message || 'Failed to load cars',
          });
          setCars([]);
          setPagination({
            page: 1,
            limit: pageSize,
            totalItems: 0,
            totalPages: 0,
          });
          setSummary({
            totalCars: 0,
            inStock: 0,
            outStock: 0,
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCars();

    return () => {
      active = false;
    };
  }, [currentPage, pageSize, reloadToken, search, showToast]);

  const totalCars = summary.totalCars;
  const inStock = useMemo(() => summary.inStock, [summary.inStock]);
  const totalPages = pagination.totalPages;
  const dialogTitle = editingCarId ? 'Edit Car' : 'Add New Car';
  const handlePageChange = (page) => {
    setCurrentPage(Math.max(page, 1));
  };

  const openAddDialog = () => {
    setEditingCarId(null);
    setFormData(emptyCarForm);
    setFormErrors(validateCarForm(emptyCarForm));
    setFormTouched(initialFormTouched);
    setFormSubmitted(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (car) => {
    const nextFormData = toFormState(car);

    setEditingCarId(car.id);
    setFormData(nextFormData);
    setFormErrors(validateCarForm(nextFormData));
    setFormTouched(initialFormTouched);
    setFormSubmitted(false);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCarId(null);
    setFormData(emptyCarForm);
    setFormErrors(validateCarForm(emptyCarForm));
    setFormTouched(initialFormTouched);
    setFormSubmitted(false);
  };

  const handleFieldChange = async (event) => {
    const { name, value, checked, type, files } = event.target;

    if (type === 'checkbox' && name === 'status') {
      const nextFormData = {
        ...formData,
        status: checked ? 'In Stock' : 'Out of Stock',
      };

      setFormData(nextFormData);
      setFormErrors(validateCarForm(nextFormData));
      return;
    }

    if (type === 'file') {
      try {
        if (name === 'thumbnailImage') {
          const file = files?.[0];
          const thumbnailPreview = file ? await readFileAsDataUrl(file) : formData.thumbnailPreview;
          const nextFormData = {
            ...formData,
            thumbnailFileName: file?.name || formData.thumbnailFileName,
            thumbnailPreview,
          };

          setFormData(nextFormData);
          setFormTouched((current) => ({ ...current, thumbnailFileName: true }));
          setFormErrors(validateCarForm(nextFormData));
          return;
        }

        const file = files?.[0];
        const nextFormData = {
          ...formData,
          modelFileName: file?.name || formData.modelFileName,
          modelFileId: file ? '' : formData.modelFileId,
          modelFile: file || null,
        };

        setFormData(nextFormData);
        setFormTouched((current) => ({ ...current, modelFileName: true }));
        setFormErrors(validateCarForm(nextFormData));
      } catch (error) {
        showToast({
          variant: 'danger',
          message: error.message || 'Unable to read selected file',
        });
      }

      return;
    }

    const nextFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(nextFormData);
    setFormErrors(validateCarForm(nextFormData));
  };

  const handleFieldBlur = (event) => {
    const { name } = event.target;

    if (name === 'modelFile') {
      setFormTouched((current) => ({ ...current, modelFileName: true }));
      setFormErrors(validateCarForm(formData));
      return;
    }

    if (name === 'thumbnailImage') {
      setFormTouched((current) => ({ ...current, thumbnailFileName: true }));
      setFormErrors(validateCarForm(formData));
      return;
    }

    setFormTouched((current) => ({ ...current, [name]: true }));
    setFormErrors(validateCarForm(formData));
  };

  const handleWheelToggle = (wheel) => {
    setFormData((current) => {
      const isSelected = current.wheels.includes(wheel);
      const nextFormData = {
        ...current,
        wheels: isSelected
          ? current.wheels.filter((selectedWheel) => selectedWheel !== wheel)
          : [...current.wheels, wheel],
      };

      setFormErrors(validateCarForm(nextFormData));
      return nextFormData;
    });

    setFormTouched((current) => ({ ...current, wheels: true }));
  };

  const getError = (field) => getVisibleError(formSubmitted, formTouched, field, formErrors[field]);
  const getErrorId = (field) => {
    const error = getError(field);

    return error ? `car-${field}-error` : undefined;
  };

  const fieldErrorClass = (field) => (getError(field) ? styles.fieldError : '');

  const renderError = (field) => {
    const error = getError(field);

    if (!error) {
      return null;
    }

    return (
      <p className={styles.errorText} id={`car-${field}-error`} role="alert">
        {error}
      </p>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateCarForm(formData);
    setFormSubmitted(true);
    setFormTouched({
      name: true,
      price: true,
      thumbnailFileName: true,
      category: true,
      manufactureYear: true,
      description: true,
      colors: true,
      wheels: true,
      horsepower: true,
      topSpeed: true,
      fuelType: true,
      seating: true,
      modelFileName: true,
    });
    setFormErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const normalizedCar = {
      name: formData.name.trim(),
      make: formData.make.trim() || 'Porsche',
      category: formData.category,
      year: Number(formData.manufactureYear) || 2026,
      price: Number(formData.price) || 0,
      thumbnailFileName: formData.thumbnailFileName,
      description: formData.description.trim(),
      colors: formData.colors.trim(),
      wheels: formData.wheels,
      horsepower: Number(formData.horsepower) || 0,
      topSpeed: Number(formData.topSpeed) || 0,
      fuelType: formData.fuelType,
      seating: Number(formData.seating) || 0,
      modelFileName: formData.modelFileName,
      modelFileId: formData.modelFileId,
      status: formData.status,
      image: formData.thumbnailPreview || '',
    };

    try {
      setIsSaving(true);

      if (formData.modelFile) {
        const uploadedModel = await carsApi.uploadModel(formData.modelFile);
        normalizedCar.modelFileId = uploadedModel.modelFileId;
        normalizedCar.modelFileName = uploadedModel.modelFileName || normalizedCar.modelFileName;
      }

      if (editingCarId) {
        await carsApi.update(editingCarId, normalizedCar);
      } else {
        await carsApi.create(normalizedCar);
      }

      setReloadToken((current) => current + 1);
      closeDialog();
    } catch (error) {
      showToast({
        variant: 'danger',
        message: error.message || 'Unable to save car',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    try {
      await carsApi.remove(carId);
      setReloadToken((current) => current + 1);
    } catch (error) {
      showToast({
        variant: 'danger',
        message: error.message || 'Unable to delete car',
      });
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <Link className={styles.backLink} to="/admin/dashboard">
              <i className="fa-solid fa-arrow-left"></i>
              Back to Dashboard
            </Link>
            <h1>Manage Cars</h1>
          </div>

          <button className={styles.primaryButton} type="button" onClick={openAddDialog}>
            <i className="fa-solid fa-plus"></i>
            Add New Car
          </button>
        </header>

        {loading ? (
          <Loader label="Loading cars..." />
        ) : null}

        <section className={styles.controls} aria-label="Car filters">
          <label className={styles.searchBox} htmlFor="admin-car-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              id="admin-car-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by car name, category, year, or status..."
            />
          </label>
        </section>

        {!loading ? (
          <>
            <section className={styles.summaryGrid} aria-label="Inventory summary">
              <article className={styles.summaryCard}>
                <span>Total Cars</span>
                <strong>{totalCars}</strong>
              </article>
              <article className={styles.summaryCard}>
                <span>In Stock</span>
                <strong>{inStock}</strong>
              </article>
              <article className={styles.summaryCard}>
                <span>Out of Stock</span>
                <strong>{totalCars - inStock}</strong>
              </article>
            </section>

            <section className={styles.tablePanel}>
              <div className={styles.tableWrap}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Year</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <tr key={car.id}>
                        <td>
                          <img className={styles.carImage} src={getCarFallbackImage(car)} alt={car.name} />
                        </td>
                        <td>
                          <div className={styles.primaryText}>{car.name}</div>
                          <div className={styles.secondaryText}>{car.make}</div>
                        </td>
                        <td>{car.category}</td>
                        <td>{car.year ?? car.manufactureYear}</td>
                        <td>{formatCurrency(car.price)}</td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${
                              car.status === 'In Stock' ? styles.inStock : styles.outStock
                            }`}
                          >
                            {car.status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.iconButton}
                              type="button"
                              onClick={() => openEditDialog(car)}
                              aria-label={`Edit ${car.name}`}
                              title="Edit car"
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button
                              className={`${styles.iconButton} ${styles.dangerButton}`}
                              type="button"
                              onClick={() => handleDeleteCar(car.id)}
                              aria-label={`Delete ${car.name}`}
                              title="Delete car"
                            >
                              <i className="fa-regular fa-trash-can"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {cars.length === 0 ? (
                <div className={styles.emptyState}>No cars match your search.</div>
              ) : null}
            </section>

            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              totalItems={pagination.totalItems}
              onPageChange={handlePageChange}
              itemLabel="cars"
              itemLabelSingular="car"
            />
          </>
        ) : null}
      </div>

      {isDialogOpen ? (
        <div className={styles.modalOverlay} role="presentation" onMouseDown={closeDialog}>
          <section
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="car-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className={styles.dialogHeader}>
              <h2 id="car-dialog-title">{dialogTitle}</h2>
              <button
                className={styles.closeButton}
                type="button"
                onClick={closeDialog}
                aria-label="Close car dialog"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </header>

            <form className={styles.carForm} onSubmit={handleSubmit} noValidate>
              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Car Name</span>
                  <input
                    name="name"
                    type="text"
                    className={fieldErrorClass('name')}
                    value={formData.name}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    aria-invalid={Boolean(getError('name'))}
                    aria-describedby={getErrorId('name')}
                  />
                  {renderError('name')}
                </label>

                <label className={styles.field}>
                  <span>Price</span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="1000"
                    className={fieldErrorClass('price')}
                    value={formData.price}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    aria-invalid={Boolean(getError('price'))}
                    aria-describedby={getErrorId('price')}
                  />
                  {renderError('price')}
                </label>

                <label className={styles.field}>
                  <span>Category</span>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.field}>
                  <span>Manufacture Year</span>
                  <input
                    name="manufactureYear"
                    type="number"
                    min="1948"
                    className={fieldErrorClass('manufactureYear')}
                    value={formData.manufactureYear}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    aria-invalid={Boolean(getError('manufactureYear'))}
                    aria-describedby={getErrorId('manufactureYear')}
                  />
                  {renderError('manufactureYear')}
                </label>

                <label className={`${styles.field} ${styles.fullWidth}`}>
                  <span>Thumbnail Image</span>
                  <input
                    name="thumbnailImage"
                    type="file"
                    accept="image/*"
                    className={fieldErrorClass('thumbnailFileName')}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    aria-invalid={Boolean(getError('thumbnailFileName'))}
                    aria-describedby={getErrorId('thumbnailFileName')}
                  />
                  {formData.thumbnailPreview ? (
                    <div className={styles.thumbnailPreview}>
                      <img src={formData.thumbnailPreview} alt="Selected car thumbnail preview" />
                      <span>{formData.thumbnailFileName}</span>
                    </div>
                  ) : null}
                  {renderError('thumbnailFileName')}
                </label>

                <label className={styles.field}>
                  <span>Horse Power</span>
                  <input
                    name="horsepower"
                    type="number"
                    min="0"
                    className={fieldErrorClass('horsepower')}
                    value={formData.horsepower}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    aria-invalid={Boolean(getError('horsepower'))}
                    aria-describedby={getErrorId('horsepower')}
                  />
                  {renderError('horsepower')}
                </label>

                <label className={styles.field}>
                  <span>Top Speed</span>
                  <input
                    name="topSpeed"
                    type="number"
                    min="0"
                    className={fieldErrorClass('topSpeed')}
                    value={formData.topSpeed}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    aria-invalid={Boolean(getError('topSpeed'))}
                    aria-describedby={getErrorId('topSpeed')}
                  />
                  {renderError('topSpeed')}
                </label>

                <label className={styles.field}>
                  <span>Fuel Type</span>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                  >
                    {fuelTypes.map((fuelType) => (
                      <option key={fuelType} value={fuelType}>
                        {fuelType}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.field}>
                  <span>Seating</span>
                  <input
                    name="seating"
                    type="number"
                    min="1"
                    className={fieldErrorClass('seating')}
                    value={formData.seating}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    aria-invalid={Boolean(getError('seating'))}
                    aria-describedby={getErrorId('seating')}
                  />
                  {renderError('seating')}
                </label>

                <label className={`${styles.field} ${styles.fullWidth}`}>
                  <span>Description</span>
                  <textarea
                    name="description"
                    className={fieldErrorClass('description')}
                    value={formData.description}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    rows="4"
                    aria-invalid={Boolean(getError('description'))}
                    aria-describedby={getErrorId('description')}
                  />
                  {renderError('description')}
                </label>

                <label className={`${styles.field} ${styles.fullWidth}`}>
                  <span>Available Colors</span>
                  <input
                    name="colors"
                    type="text"
                    className={fieldErrorClass('colors')}
                    value={formData.colors}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    placeholder="Black, White, Guards Red"
                    aria-invalid={Boolean(getError('colors'))}
                    aria-describedby={getErrorId('colors')}
                  />
                  {renderError('colors')}
                </label>

                <fieldset
                  className={`${styles.fieldset} ${styles.fullWidth} ${
                    getError('wheels') ? styles.fieldsetError : ''
                  }`}
                  aria-invalid={Boolean(getError('wheels'))}
                  aria-describedby={getErrorId('wheels')}
                >
                  <legend>Available Wheels</legend>
                  <div className={styles.checkGrid}>
                    {wheelOptions.map((wheel) => (
                      <label className={styles.checkItem} key={wheel}>
                        <input
                          type="checkbox"
                          checked={formData.wheels.includes(wheel)}
                          onChange={() => handleWheelToggle(wheel)}
                        />
                        <span>{wheel}</span>
                      </label>
                    ))}
                  </div>
                  {renderError('wheels')}
                </fieldset>

                <label className={`${styles.field} ${styles.fullWidth}`}>
                  <span>3D Model File</span>
                  <input
                    name="modelFile"
                    type="file"
                    accept=".glb,.gltf,.obj,.fbx"
                    className={fieldErrorClass('modelFileName')}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    aria-invalid={Boolean(getError('modelFileName'))}
                    aria-describedby={getErrorId('modelFileName')}
                  />
                  {formData.modelFileName ? (
                    <small className={styles.fileHint}>Selected: {formData.modelFileName}</small>
                  ) : null}
                  {renderError('modelFileName')}
                </label>

                <label className={`${styles.stockCheck} ${styles.fullWidth}`}>
                  <input
                    name="status"
                    type="checkbox"
                    checked={formData.status === 'In Stock'}
                    onChange={handleFieldChange}
                  />
                  <span>In Stock</span>
                </label>
              </div>

              <div className={styles.dialogActions}>
                <button className={styles.saveButton} type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <Loader label="Saving..." variant="compact" />
                  ) : (
                    <>
                      <i className="fa-regular fa-floppy-disk"></i>
                      Save
                    </>
                  )}
                </button>
                <button className={styles.cancelButton} type="button" onClick={closeDialog}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}
