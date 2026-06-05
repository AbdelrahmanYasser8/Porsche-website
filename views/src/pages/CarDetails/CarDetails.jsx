import styles from "./CarDetails.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/Loader/Loader";
import React, { useEffect, useMemo, useRef, Suspense, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { carsApi } from "../../api/cars";
import { ordersApi } from "../../api/orders";
import { useToast } from "../../components/Toast/ToastProvider";
import { useAuth } from "../../context/AuthContext";
import wheel1 from "../../assets/images/wheel_type1.png";
import wheel2 from "../../assets/images/wheel_type2.png";
import wheel3 from "../../assets/images/wheel_type3.png";
import wheel4 from "../../assets/images/wheel_type4.png";
import scene1 from "../../assets/images/scene1.jpg";
import scene2 from "../../assets/images/scene2.jpg";
import scene3 from "../../assets/images/scene3.jpg";
import scene4 from "../../assets/images/scene4.jpg";
import scene5 from "../../assets/images/scene5.jpg";
import scene6 from "../../assets/images/scene6.jpg";
import scene7 from "../../assets/images/scene7.jpg";
import scene8 from "../../assets/images/scene8.jpg";

function parseOptionList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeNodeKey(value) {
  return normalizeText(value)
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getColorSwatch(color) {
  const value = normalizeText(color);

  if (value.includes("black")) return "#111111";
  if (value.includes("white")) return "#f5f5f2";
  if (value.includes("red")) return "#a81f2f";
  if (value.includes("blue")) return "#1f4f9b";
  if (value.includes("green")) return "#2e7d32";
  if (value.includes("yellow")) return "#d8b100";
  if (value.includes("purple")) return "#6a3fa0";
  if (value.includes("orange")) return "#d06a1b";
  if (value.includes("cyan") || value.includes("cayan")) return "#2aa8a1";

  return "#8d8d8d";
}

function getColorNodeCandidates(color) {
  const normalized = normalizeNodeKey(color);
  const aliasMap = {
    black: ["body_black"],
    white: ["body_white"],
    red: ["body_red", "body_guards_red"],
    guards_red: ["body_red", "body_guards_red"],
    blue: ["body_blue"],
    green: ["body_green"],
    yellow: ["body_yellow"],
    purple: ["body_purple"],
    orange: ["body_orange"],
    cyan: ["body_cayan", "body_cyan"],
    cayan: ["body_cayan", "body_cyan"],
    gray: ["body_gray", "body_grey"],
    grey: ["body_gray", "body_grey"],
    silver: ["body_silver"],
  };

  return [
    ...(aliasMap[normalized] || []),
    normalized ? `body_${normalized}` : "",
    normalized ? `body_${normalized.replace(/_/g, "")}` : "",
  ].filter(Boolean);
}

function getAvailableBodyNodeNames(nodes = {}) {
  return Object.keys(nodes).filter((name) => /^body_/i.test(name));
}

function getColorNodeName(nodes, color) {
  const availableBodyNodes = getAvailableBodyNodeNames(nodes);
  const candidates = getColorNodeCandidates(color);

  return (
    candidates.find((candidate) => Boolean(nodes?.[candidate])) ||
    availableBodyNodes.find((nodeName) => normalizeNodeKey(nodeName) === normalizeNodeKey(color)) ||
    availableBodyNodes[0] ||
    "body_black"
  );
}

function getWheelNodeName(wheel) {
  const value = normalizeText(wheel).replace(/\s+/g, "");
  const match = value.match(/wheel(?:type)?(?:_)?(\d+)/);

  if (match) {
    return `wheel_type${match[1]}`;
  }

  if (value.includes("1")) return "wheel_type1";
  if (value.includes("2")) return "wheel_type2";
  if (value.includes("3")) return "wheel_type3";
  if (value.includes("4")) return "wheel_type4";

  return "wheel_type1";
}

export const ColorSelector = ({ options, value, setColor }) => {
  return (
    <div className="d-flex flex-wrap">
      {options.length ? (
        options.map((color, index) => {
          const safeId = `color-${index}-${normalizeText(color).replace(/[^a-z0-9]+/g, "-") || "option"}`;

          return (
          <div className="me-3 mb-3" key={safeId}>
            <input
              type="radio"
              className="btn-check"
              name="color"
              id={safeId}
              checked={value === color}
              onChange={() => setColor(color)}
            />

            <label
              className="btn btn-outline-secondary rounded-3 px-4"
              htmlFor={safeId}
            >
              {color}
            </label>
          </div>
          );
        })
      ) : (
        <p className="text-secondary mb-0">No colors are available for this car.</p>
      )}
    </div>
  );
};

const wheelImages = {
  wheel_type1: wheel1,
  wheel_type2: wheel2,
  wheel_type3: wheel3,
  wheel_type4: wheel4,
};

function getWheelImage(wheel, index = 0) {
  const nodeName = getWheelNodeName(wheel);
  return wheelImages[nodeName] || [wheel1, wheel2, wheel3, wheel4][index % 4];
}

export const WheelSelector = ({ options, value, setWheel }) => {
  if (!options.length) {
    return <p className="text-secondary mb-4">No wheel types are available for this car.</p>;
  }

  return (
    <div className="d-flex gap-3 flex-wrap mb-4">
      {options.map((wheel, index) => {
        const wheelId = getWheelNodeName(wheel);
        const safeId = `wheel-${index}-${normalizeText(wheel).replace(/[^a-z0-9]+/g, "-") || wheelId}`;

        return (
        <div key={safeId}>
          <input
            type="radio"
            className="btn-check"
            name="wheel"
            id={safeId}
            checked={value === wheel}
            onChange={() => setWheel(wheel)}
          />

          <label
            htmlFor={safeId}
            className={`btn d-flex align-items-center justify-content-center border rounded p-2  ${value === wheel ? "border-black bg-secondary" : "border-secondary"}`}
            style={{
              width: 90,
              height: 90,
              transition: "0.2s",
            }}
          >
            <img
              src={getWheelImage(wheel, index)}
              alt={wheel}
              style={{ width: "100%", objectFit: "contain" }}
            />
          </label>
        </div>
        );
      })}
    </div>
  );
};

function SceneButtons({ scenes, setCameraTarget }) {
  const carouselRef = useRef(null);

  const scrollScenes = (direction) => {
    carouselRef.current?.scrollBy({
      left: direction * 260,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.sceneCarousel}>
      <button
        type="button"
        className={`${styles.sceneNav} ${styles.sceneNavLeft}`}
        aria-label="Previous preview angle"
        onClick={() => scrollScenes(-1)}
      >
        <i className="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>

      <div className={styles.sceneTrack} ref={carouselRef}>
        {scenes.map((scene, i) => (
          <button
            key={i}
            type="button"
            className={styles.sceneButton}
            onClick={() =>
              setCameraTarget({
                position: [...scene.position],
                lookAt: [...scene.target],
              })
            }
            aria-label={`Preview angle ${i + 1}`}
          >
            <img
              className={styles.sceneImage}
              src={scene.img}
              alt={`Scene ${i + 1}`}
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        className={`${styles.sceneNav} ${styles.sceneNavRight}`}
        aria-label="Next preview angle"
        onClick={() => scrollScenes(1)}
      >
        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>
    </div>
  );
}

function PorscheModel({ color, wheel, modelUrl }) {
  const gltf = useGLTF(modelUrl);
  const modelRef = useRef();
  const selectedWheelNode = getWheelNodeName(wheel);

  useEffect(() => {
    if (!gltf.nodes) return;

    const bodyNodes = getAvailableBodyNodeNames(gltf.nodes);

    bodyNodes.forEach((name) => {
      gltf.nodes[name].visible = false;
    });

    const wheels = ["wheel_type1", "wheel_type2", "wheel_type3", "wheel_type4"];

    wheels.forEach((name) => {
      if (gltf.nodes[name]) {
        gltf.nodes[name].visible = false;
      }
    });

    if (gltf.nodes[selectedWheelNode]) {
      gltf.nodes[selectedWheelNode].visible = true;
    }

    const selectedBody = getColorNodeName(gltf.nodes, color);
    if (gltf.nodes[selectedBody]) {
      gltf.nodes[selectedBody].visible = true;
    }
  }, [color, gltf, selectedWheelNode]);

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={0.5}
      position={[0, -1, 0]}
    />
  );
}

const scenes = [
  { img: scene1, position: [1.95, 0.51, 4.37], target: [0, 0, 0] },
  { img: scene2, position: [4.8, 0.04, -0.102], target: [0, 0, 0] },
  { img: scene3, position: [3.17, 0.05, 0.04], target: [0, 0, 1] },
  { img: scene4, position: [2.04, 0.1, -4.56], target: [0, 0, 0] },
  { img: scene5, position: [3.74, 2.69, -1.9], target: [0, 0, 0] },
  { img: scene6, position: [-0.01, 0.32, 4.73], target: [0, 0, 0] },
  { img: scene7, position: [0.04, 0.17, -0.77], target: [0, 0, 0] },
  { img: scene8, position: [-0.15, 0.1, 0.5], target: [0, 0, 0] },
];

function CameraAnimator({ targetPosition, targetLookAt, orbitRef }) {
  const { camera } = useThree();
  const posVec = useRef(new THREE.Vector3(...targetPosition));
  const lookVec = useRef(new THREE.Vector3(...targetLookAt));
  const isAnimating = useRef(false);

  useEffect(() => {
    posVec.current.set(...targetPosition);
    lookVec.current.set(...targetLookAt);
    isAnimating.current = true;
    if (orbitRef.current) orbitRef.current.enabled = false;
  }, [targetPosition, targetLookAt, orbitRef]);

  useFrame(() => {
    if (!isAnimating.current) return;

    camera.position.lerp(posVec.current, 0.03);

    if (orbitRef.current) {
      orbitRef.current.target.lerp(lookVec.current, 0.03);
      orbitRef.current.update();
    }

    const distance = camera.position.distanceTo(posVec.current);
    if (distance < 0.01) {
      isAnimating.current = false;
      if (orbitRef.current) {
        orbitRef.current.target.copy(lookVec.current);
        orbitRef.current.update();
        orbitRef.current.enabled = true;
      }
    }
  });

  return null;
}

function formatCarField(value, fallback = "N/A") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
}

export default function CarDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const orbitRef = useRef();
  const [cameraTarget, setCameraTarget] = useState({
    position: [1.95, 0.51, 4.37],
    lookAt: [0, 0, 0],
  });
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedWheel, setSelectedWheel] = useState("wheel_type1");
  const [isOrdering, setIsOrdering] = useState(false);
  const colorOptions = useMemo(() => parseOptionList(car?.colorOptions || car?.colors), [car]);
  const wheelOptions = useMemo(() => parseOptionList(car?.wheelOptions || car?.wheels), [car]);
  const isOutOfStock = car?.status === "Out of Stock";

  useEffect(() => {
    if (!colorOptions.length) {
      setSelectedColor("");
      return;
    }

    setSelectedColor((current) => (colorOptions.includes(current) ? current : colorOptions[0]));
  }, [colorOptions]);

  useEffect(() => {
    if (!wheelOptions.length) {
      setSelectedWheel("");
      return;
    }

    setSelectedWheel((current) => (wheelOptions.includes(current) ? current : wheelOptions[0]));
  }, [wheelOptions]);

  useEffect(() => {
    let active = true;

    const loadCar = async () => {
      try {
        setLoading(true);

        let response;
        if (id) {
          response = await carsApi.get(id);
        } else {
          const cars = await carsApi.list();
          response = cars[0] || null;
        }

        if (active) {
          setCar(response || null);
        }
      } catch (fetchError) {
        if (active) {
          showToast({
            variant: "danger",
            message: fetchError.message || "Failed to load car details",
          });
          setCar(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCar();

    return () => {
      active = false;
    };
  }, [id, showToast]);

  const handlePlaceOrder = async () => {
    if (isOutOfStock) {
      showToast({
        variant: "warning",
        message: "This car is out of stock.",
      });
      return;
    }

    if (!user) {
      navigate("/login", { state: { from: { pathname: id ? `/CarDetails/${id}` : "/CarDetails" } } });
      return;
    }

    if (!car) {
      showToast({
        variant: "danger",
        message: "Car details are not ready yet.",
      });
      return;
    }

    try {
      setIsOrdering(true);

      await ordersApi.create({
        product: car.name,
        color: selectedColor,
        wheelType: selectedWheel,
        amount: car.price,
      });

      showToast({ variant: "success", message: "Order created successfully." });
      navigate("/orders");
    } catch (placeOrderError) {
      showToast({
        variant: "danger",
        message: placeOrderError.message || "Unable to place order",
      });
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main>
          <Loader label="Loading car details..." variant="page" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.pageShell}>
        <section className={styles.previewPanel}>
          <div className={styles.previewSticky}>
            <div className={styles.modelContainer}>
              {car?.modelUrl ? (
                <Canvas
                  className={styles.modelCanvas}
                  camera={{ position: [1.95, 0.51, 4.37], fov: 50 }}
                >
                  <Suspense fallback={<Loader canvas label="Loading 3D model..." />}>
                    <Environment
                      files="/qwantani_puresky_4k.hdr"
                      background={true}
                      environmentRotation={[7, 8, 0]}
                    />
                    <PorscheModel color={selectedColor} wheel={selectedWheel} modelUrl={car.modelUrl} />
                  </Suspense>
                  <CameraAnimator
                    targetPosition={cameraTarget.position}
                    targetLookAt={cameraTarget.lookAt}
                    orbitRef={orbitRef}
                  />
                  <OrbitControls
                    ref={orbitRef}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2}
                    minDistance={0}
                    maxDistance={5}
                  />
                </Canvas>
              ) : (
                <div className={styles.modelUnavailable} role="status">
                  <i className="fa-solid fa-cube" aria-hidden="true" />
                  <strong>3D model unavailable</strong>
                  <span>This vehicle does not have a model uploaded yet.</span>
                </div>
              )}
            </div>
          </div>

          {car?.modelUrl ? (
            <SceneButtons scenes={scenes} setCameraTarget={setCameraTarget} />
          ) : null}
        </section>

        <section className={styles.detailsColumn}>
          <div className={styles.detailsCard}>
            {car ? (
              <>
                <h1>{car.name}</h1>
                <p className="text-secondary">{car.manufactureYear || car.year} model</p>
              </>
            ) : (
              <>
                <h1>Car unavailable</h1>
                <p className="text-secondary">Vehicle details could not be loaded.</p>
              </>
            )}
            <h5>Price</h5>
            <p className="fs-2">{car ? `$${Number(car.price || 0).toLocaleString()}` : "N/A"}</p>
            <h5 className="my-4">Description</h5>
            <p className="text-secondary">{car?.description || "No description available."}</p>
            <h5 className="my-4">Colours</h5>
            <ColorSelector options={colorOptions} value={selectedColor} setColor={setSelectedColor} />
            <h5 className="my-4">Wheels</h5>
            <WheelSelector options={wheelOptions} value={selectedWheel} setWheel={setSelectedWheel} />

            <button
              className={`w-100 fs-5 rounded-3 mt-4 ${styles["place-order"] || ""}`}
              onClick={handlePlaceOrder}
              disabled={!car || isOrdering || isOutOfStock}
            >
              {isOutOfStock ? (
                "Out of Stock"
              ) : isOrdering ? (
                <Loader label="Placing order..." variant="compact" />
              ) : (
                "Place Order"
              )}
            </button>
          </div>

          <div className={styles.detailsCard}>
            <h5 className="mb-4">Full Specifications</h5>
            <div className="d-flex">
              <span className="text-secondary">Horsepower</span>
              <span className="ms-auto ">{formatCarField(car?.horsepower)} hp</span>
            </div>
            <hr className="border-secondary" />
            <div className="d-flex">
              <span className="text-secondary">Top Speed</span>
              <span className="ms-auto">{formatCarField(car?.topSpeed)} mph</span>
            </div>
            <hr className="border-secondary" />
            <div className="d-flex">
              <span className="text-secondary">Fuel Type</span>
              <span className="ms-auto">{formatCarField(car?.fuelType)}</span>
            </div>
            <hr className="border-secondary" />
            <div className="d-flex">
              <span className="text-secondary">Seating</span>
              <span className="ms-auto">{formatCarField(car?.seating)}</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
