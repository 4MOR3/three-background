"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __importStar(require("three"));
var EffectComposer_js_1 = require("three/examples/jsm/postprocessing/EffectComposer.js");
var RenderPass_js_1 = require("three/examples/jsm/postprocessing/RenderPass.js");
var ShaderPass_js_1 = require("three/examples/jsm/postprocessing/ShaderPass.js");
var FXAAShader_js_1 = require("three/examples/jsm/shaders/FXAAShader.js");
var Sky_1 = require("three/examples/jsm/objects/Sky");
var Water_js_1 = require("three/examples/jsm/objects/Water.js");
var OceanFactory = /** @class */ (function () {
    function OceanFactory(dom) {
        var _this = this;
        this.reqId = 0; // requestAnimationFrame的Id
        this.sky = new Sky_1.Sky();
        this.water = null;
        this.camCtrl = new THREE.Vector3(0, 0, 0);
        this.winWidth = window.innerWidth;
        this.winHeight = window.innerHeight;
        this.mouseX = 0;
        this.mouseY = 0;
        if (!dom) {
            throw new Error('container needed in constructor to init three scene');
        }
        var scene = new THREE.Scene(); // new一个场景对象
        scene.background = new THREE.Color(0xffffff); // 场景的bgc
        var canvas = document.createElement('canvas');
        canvas.innerText = " Seems your browser doesn't support canvas, try use the latest chrome/edge maybe";
        canvas.style.height = '100%';
        canvas.style.width = '100%';
        canvas.style.position = 'absolute';
        canvas.style.zIndex = '-1';
        dom.appendChild(canvas);
        dom.style.overflow = 'hidden';
        var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); //创建渲染器
        renderer.shadowMap.enabled = true; //阴影设置
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.77;
        //光效设置
        var ambient = new THREE.AmbientLight(0xffffff, 0.7); //环境光
        scene.add(ambient);
        //相机设置
        var camera = new THREE.PerspectiveCamera(//透视相机，
        47, //fov，视野角度
        1, //视窗的高宽比
        1, //near,近面，距离相机小于0.1则不会被渲染。
        20000); //far,远面，距离大于1000则不会被渲染
        camera.position.set(0, 1000, 100); //相机位置 
        camera.lookAt(0, 1000, 0);
        var composer = new EffectComposer_js_1.EffectComposer(renderer);
        var renderPass = new RenderPass_js_1.RenderPass(scene, camera);
        var effectFXAA = new ShaderPass_js_1.ShaderPass(FXAAShader_js_1.FXAAShader);
        composer.addPass(effectFXAA);
        composer.addPass(renderPass);
        window.addEventListener('resize', function () { _this.resize(); }, false); //resize也添加到window里
        window.addEventListener('mousemove', function (e) { _this.mousemove(e); });
        this.effectFXAA = effectFXAA;
        this.composer = composer;
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.genSky();
        this.genWater();
        this.updateSun(1.77, 180);
        this.resize();
        return this;
    }
    OceanFactory.prototype.animate = function () {
        var _this = this;
        this.composer.render();
        if (this.water) {
            this.water.material.uniforms['time'].value += 1.0 / 120.0;
        }
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.00007;
        this.camera.position.y += (-this.mouseY - 77 - this.camera.position.y) * 0.00007;
        this.camera.lookAt(0, 0, 0);
        this.reqId = window.requestAnimationFrame(function () { _this.animate(); });
    };
    OceanFactory.prototype.resize = function () {
        var height = this.winHeight;
        var width = this.winWidth;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
        this.composer.setSize(width, height);
        this.effectFXAA.uniforms['resolution'].value.set(1 / width, 1 / height);
    };
    OceanFactory.prototype.mousemove = function (e) {
        this.mouseX = e.clientX - this.winWidth / 2;
        this.mouseY = e.clientY - this.winWidth / 2;
    };
    OceanFactory.prototype.destructor = function () {
        this.freeUp(this.scene);
        cancelAnimationFrame(this.reqId);
    };
    /**
     * 内存清理, 释放geometry, texture, material的缓冲区
     * @param {THREE.Scene} obj
     */
    OceanFactory.prototype.freeUp = function (obj) {
        var _this = this;
        cancelAnimationFrame(this.reqId);
        obj.children.forEach(function (data) {
            var _a, _b, _c, _d;
            if (data.children)
                _this.freeUp(data);
            (_a = data.geometry) === null || _a === void 0 ? void 0 : _a.dispose();
            if ((_b = data.material) === null || _b === void 0 ? void 0 : _b.type) {
                data.material.dispose();
                (_c = data.material.map) === null || _c === void 0 ? void 0 : _c.dispose();
                (_d = data.material.envMap) === null || _d === void 0 ? void 0 : _d.dispose();
            }
        });
    };
    OceanFactory.prototype.genSky = function () {
        var sky = new Sky_1.Sky();
        sky.scale.setScalar(10000000);
        var skyUniforms = sky.material.uniforms;
        skyUniforms['turbidity'].value = 3;
        skyUniforms['rayleigh'].value = 1;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.8;
        skyUniforms['sunPosition'].value = new THREE.Vector3(-377, 100, 50);
        this.scene.add(sky);
        this.sky = sky;
    };
    OceanFactory.prototype.genWater = function () {
        var waterGeometry = new THREE.PlaneBufferGeometry(100000, 100000);
        var water = new Water_js_1.Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('water.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: this.scene.fog !== undefined
        });
        water.material.uniforms['size'].value = 0.1;
        water.material.uniforms['distortionScale'].value = 7;
        water.position.setY(-1000);
        water.rotation.x = -Math.PI / 2;
        this.water = water;
        this.scene.add(water);
    };
    OceanFactory.prototype.updateSun = function (elevation, azimuth) {
        var phi = THREE.MathUtils.degToRad(90 - elevation);
        var theta = THREE.MathUtils.degToRad(azimuth);
        var sun = new THREE.Vector3();
        sun.setFromSphericalCoords(1, phi, theta);
        this.sky.material.uniforms['sunPosition'].value.copy(sun);
        if (this.water) {
            this.water.material.uniforms['sunDirection'].value.copy(sun).normalize();
        }
    };
    return OceanFactory;
}());
;
exports.default = OceanFactory;
