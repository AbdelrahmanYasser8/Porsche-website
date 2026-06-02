import styles from "./CarDetails.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/Loader/Loader";
import React, { useRef, useEffect, Suspense, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { carsApi } from "../../api/cars";
import { ordersApi } from "../../api/orders";
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

export const ColorSelector = ({ setColor }) => {
  const [selected, setSelected] = useState("Black");

  const colors = [
    "Black",
    "Green",
    "Blue",
    "Red",
    "Yellow",
    "Purple",
    "Cayan",
    "Orange",
  ];

  return (
    <div className="d-flex flex-wrap">
      {colors.map((color) => (
        <div className="me-3 mb-3" key={color}>
          <input
            type="radio"
            className="btn-check"
            name="color"
            id={color}
            checked={selected === color}
            onChange={() => {
              setSelected(color);
              setColor(color);
            }}
          />

          <label
            className="btn btn-outline-secondary rounded-3 px-4"
            htmlFor={color}
          >
            {color}
          </label>
        </div>
      ))}
    </div>
  );
};

const wheels = [
  { id: "wheel_type1", img: wheel1, name: "Wheel 1" },
  { id: "wheel_type2", img: wheel2, name: "Wheel 2" },
  { id: "wheel_type3", img: wheel3, name: "Wheel 3" },
  { id: "wheel_type4", img: wheel4, name: "Wheel 4" },
];

export const WheelSelector = ({ setWheel }) => {
  const [selected, setSelected] = useState("wheel_type1");

  return (
    <div className="d-flex gap-3 flex-wrap mb-4">
      {wheels.map((wheel) => (
        <div key={wheel.id}>
          <input
            type="radio"
            className="btn-check"
            name="wheel"
            id={wheel.id}
            checked={selected === wheel.id}
            onChange={() => {
              setSelected(wheel.id);
              setWheel(wheel.id);
            }}
          />

          <label
            htmlFor={wheel.id}
            className={`btn d-flex align-items-center justify-content-center border rounded p-2  ${selected === wheel.id ? "border-black bg-secondary" : "border-secondary"}`}
            style={{
              width: 90,
              height: 90,
              transition: "0.2s",
            }}
          >
            <img
              src={wheel.img}
              alt={wheel.name}
              style={{ width: "100%", objectFit: "contain" }}
            />
          </label>
        </div>
      ))}
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

function PorscheModel({ color, wheel }) {
  const gltf = useGLTF("/porsche model.glb");
  const modelRef = useRef();

  useEffect(() => {
    if (!gltf.nodes) return;

    const bodies = [
      "body_red",
      "body_yellow",
      "body_black",
      "body_purple",
      "body_green",
      "body_blue",
      "body_cayan",
      "body_orange",
    ];

    bodies.forEach((name) => {
      if (gltf.nodes[name]) {
        gltf.nodes[name].visible = false;
      }
    });

    const wheels = ["wheel_type1", "wheel_type2", "wheel_type3", "wheel_type4"];

    wheels.forEach((name) => {
      if (gltf.nodes[name]) {
        gltf.nodes[name].visible = false;
      }
    });

    if (gltf.nodes[wheel]) {
      gltf.nodes[wheel].visible = true;
    }

    const selectedBody = `body_${color.toLowerCase()}`;
    if (gltf.nodes[selectedBody]) {
      gltf.nodes[selectedBody].visible = true;
    }
  }, [color, gltf, wheel]);

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

export default function CarDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const orbitRef = useRef();
  const [cameraTarget, setCameraTarget] = useState({
    position: [1.95, 0.51, 4.37],
    lookAt: [0, 0, 0],
  });
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedWheel, setSelectedWheel] = useState("wheel_type1");
  const [orderMessage, setOrderMessage] = useState("");
  const [orderError, setOrderError] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  const activeCar = car || {
    name: "911 Carrera",
    manufactureYear: 2026,
    price: 200000,
    description:
      "The Porsche 911 Carrera is a high-performance sports car with iconic design, strong turbocharged power, and precise handling.",
    horsepower: 640,
    topSpeed: 205,
    fuelType: "Gasoline",
    seating: 4,
    colors: "Black, White, Guards Red",
    wheels: ["Wheel Type 1", "Wheel Type 2"],
    status: "In Stock",
  };

  useEffect(() => {
    let active = true;

    const loadCar = async () => {
      try {
        setLoading(true);
        setError("");

        let response;
        if (id) {
          response = await carsApi.get(id);
        } else {
          const cars = await carsApi.list();
          response = cars.find((item) => item.name === "911 Carrera") || cars[0] || null;
        }

        if (active) {
          setCar(response || null);
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError.message || "Failed to load car details");
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
  }, [id]);

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: id ? `/CarDetails/${id}` : "/CarDetails" } } });
      return;
    }

    try {
      setIsOrdering(true);
      setOrderError("");
      setOrderMessage("");

      await ordersApi.create({
        product: activeCar.name,
        color: selectedColor,
        wheelType: selectedWheel,
        amount: activeCar.price,
      });

      setOrderMessage("Order created successfully.");
      navigate("/orders");
    } catch (placeOrderError) {
      setOrderError(placeOrderError.message || "Unable to place order");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.pageShell}>
        <section className={styles.previewPanel}>
          <div className={styles.previewSticky}>
            <div className={styles.modelContainer}>
              <Canvas
                className={styles.modelCanvas}
                camera={{ position: [1.95, 0.51, 4.37], fov: 50 }}
              >
                <Suspense fallback={<Loader />}>
                  <Environment
                    files="/qwantani_puresky_4k.hdr"
                    background={true}
                    environmentRotation={[7, 8, 0]}
                  />
                  <PorscheModel color={selectedColor} wheel={selectedWheel} />
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
            </div>
          </div>

          <SceneButtons scenes={scenes} setCameraTarget={setCameraTarget} />
        </section>

        <section className={styles.detailsColumn}>
          <div className={styles.detailsCard}>
            <h1>{activeCar.name}</h1>
            <p className="text-secondary">{activeCar.manufactureYear || activeCar.year} model</p>
            <h5>Price</h5>
            <p className="fs-2">${Number(activeCar.price || 0).toLocaleString()}</p>
            <h5 className="my-4">Description</h5>
            <p className="text-secondary">{activeCar.description}</p>
            <h5 className="my-4">Colours</h5>
            <ColorSelector setColor={setSelectedColor} />
            <h5 className="my-4">Wheels</h5>
            <WheelSelector setWheel={setSelectedWheel} />

            {error ? (
              <div className="alert alert-danger mt-3 mb-0" role="alert">
                {error}
              </div>
            ) : null}

            {orderError ? (
              <div className="alert alert-danger mt-3 mb-0" role="alert">
                {orderError}
              </div>
            ) : null}

            {orderMessage ? (
              <div className="alert alert-success mt-3 mb-0" role="alert">
                {orderMessage}
              </div>
            ) : null}

            <button
              className={`w-100 fs-5 rounded-3 mt-4 ${styles["place-order"] || ""}`}
              onClick={handlePlaceOrder}
              disabled={loading || isOrdering}
            >
              {isOrdering ? "Placing Order..." : "Place Order"}
            </button>
          </div>

          <div className={styles.detailsCard}>
            <h5 className="mb-4">Full Specifications</h5>
            <div className="d-flex">
              <span className="text-secondary">Horsepower</span>
              <span className="ms-auto ">{activeCar.horsepower} hp</span>
            </div>
            <hr className="border-secondary" />
            <div className="d-flex">
              <span className="text-secondary">Top Speed</span>
              <span className="ms-auto">{activeCar.topSpeed} mph</span>
            </div>
            <hr className="border-secondary" />
            <div className="d-flex">
              <span className="text-secondary">Fuel Type</span>
              <span className="ms-auto">{activeCar.fuelType}</span>
            </div>
            <hr className="border-secondary" />
            <div className="d-flex">
              <span className="text-secondary">Seating</span>
              <span className="ms-auto">{activeCar.seating}</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
