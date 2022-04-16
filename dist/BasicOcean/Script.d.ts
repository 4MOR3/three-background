import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { Water } from 'three/examples/jsm/objects/Water.js';
declare class OceanFactory {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    composer: EffectComposer;
    reqId: number;
    effectFXAA: ShaderPass;
    sky: Sky;
    water: Water | null;
    camCtrl: THREE.Vector3;
    winWidth: number;
    winHeight: number;
    constructor(dom: HTMLDivElement | null);
    animate(): void;
    resize(): void;
    mouseX: number;
    mouseY: number;
    mousemove(e: MouseEvent): void;
    destructor(): void;
    /**
     * 内存清理, 释放geometry, texture, material的缓冲区
     * @param {THREE.Scene} obj
     */
    freeUp(obj: any): void;
    genSky(): void;
    genWater(): void;
    updateSun(elevation: number, azimuth: number): void;
}
export default OceanFactory;
