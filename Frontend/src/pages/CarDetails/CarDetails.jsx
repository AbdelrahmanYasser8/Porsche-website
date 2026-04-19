import styles from './CarDetails.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import { useState } from 'react';
import wheel1 from '../../assets/images/wheel_type1.png';
import wheel2 from '../../assets/images/wheel_type2.png';
import wheel3 from '../../assets/images/wheel_type3.png';
import wheel4 from '../../assets/images/wheel_type4.png';

export const ColorSelector = ({ setColor }) => {
    const [selected, setSelected] = useState("Black");

    const colors = ["Black", "Green", "Blue", "Red", "Yellow" , "Purple", "Cayan", "Orange"];

    return (
        <div className='d-flex flex-wrap'>
            {colors.map((color) => (
                <div className="me-3 mb-3" key={color}>
                    <input
                        type="radio"
                        className="btn-check"
                        name="color"
                        id={color}
                        checked={selected === color}
                        onChange={() => 
                            {
                                setSelected(color)
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

                    {/* clickable card */}
                    <label
                        htmlFor={wheel.id}
                        className={`btn d-flex align-items-center justify-content-center border rounded p-2  ${selected === wheel.id ? "border-black bg-light" : "border-secondary"}`}
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
}

function PorscheModel({ color , wheel}) {
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
            "body_orange"
        ];

        bodies.forEach((name) => {
            if (gltf.nodes[name]) {
                gltf.nodes[name].visible = false;
            }
        });

        const wheels = [
            "wheel_type1",
            "wheel_type2",
            "wheel_type3",
            "wheel_type4"
        ];

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

export default function CarDetails() {

    const [selectedColor, setSelectedColor] = useState("Black");
    const [selectedWheel, setSelectedWheel] = useState("wheel_type1");

    return (
        <>
            <Navbar />
            <main className='d-flex justify-content-center w-100 my-5 gap-4'>
                <div className='col-7'>
                    <div className={`rounded- ${styles['model-container'] || ''}`}>
                        <Canvas className='rounded-3' camera={{ position: [-2.69, 0.5, 3.98], fov: 50 }}>
                            <Environment
                                files="/qwantani_puresky_4k.hdr"
                                background={true}
                                environmentRotation={[7, 8, 0]}
                            />
                            <PorscheModel color={selectedColor} wheel={selectedWheel} />
                            <OrbitControls 
                            minPolarAngle={Math.PI / 6}   // minimum vertical angle
                            maxPolarAngle={Math.PI / 2}   // maximum vertical angle
                            minDistance={0}   // closest zoom
                            maxDistance={5}   // farthest zoom
                            />

                        </Canvas>
                    </div>
                    <div>
                    </div>
                </div>
                <div className='col-4 d-flex flex-column gap-4'>
                    <div className='bg-white p-4 rounded-4'>
                        <h1>911 Carrera</h1>
                        <p className='text-light'>2026 model</p>
                        <h5 className='my-4'>Description</h5>
                        <p className='text-light'>The Porsche 911 Carrera is a high-performance sports car with iconic design, strong turbocharged power, and precise handling.</p>
                        <h5 className='my-4'>Colours</h5>
                        <ColorSelector setColor={setSelectedColor}/>
                        <h5 className='my-4'>Wheels</h5>
                        <WheelSelector setWheel={setSelectedWheel} />
                        <button className={`w-100 fs-5 rounded-3 mt-4 ${styles['place-order'] || ''}`}>Place Order</button>
                    </div>
                    <div className='bg-white p-4 rounded-4'>
                        <h5 className='mb-4'>Full Specifications</h5>
                        <div className='d-flex'>
                            <span className='text-light'>Horsepower</span>
                            <span className='ms-auto '>640 hp</span>
                        </div>
                        <hr className='border-light' />
                        <div className='d-flex'>
                            <span className='text-light'>Top Speed</span>
                            <span className='ms-auto'>205 mph</span>
                        </div>
                        <hr className='border-light' />
                        <div className='d-flex'>
                            <span className='text-light'>Fuel Type</span>
                            <span className='ms-auto'>Gasoline</span>
                        </div>
                        <hr className='border-light' />
                        <div className='d-flex'>
                            <span className='text-light'>Seating</span>
                            <span className='ms-auto'>4</span>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
