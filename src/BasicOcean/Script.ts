import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Sky } from 'three/examples/jsm/objects/Sky'
import { Water } from 'three/examples/jsm/objects/Water.js';
class OceanFactory{

  scene: THREE.Scene;         // 场景

  renderer: THREE.WebGLRenderer  

  camera: THREE.PerspectiveCamera

  composer: EffectComposer    // 后处理器
  
  reqId: number = 0;            // requestAnimationFrame的Id
  effectFXAA: ShaderPass
  sky: Sky = new Sky()
  water: Water | null = null;
  camCtrl: THREE.Vector3 = new THREE.Vector3(0 ,0 ,0)
  winWidth: number = window.innerWidth;
  winHeight: number = window.innerHeight
  constructor(dom: HTMLDivElement | null) {
    if (!dom) { throw new Error('container needed in constructor to init three scene')}
   
    const scene = new THREE.Scene(); 								    // new一个场景对象
    scene.background = new THREE.Color(0xffffff);			    // 场景的bgc
    let canvas = document.createElement('canvas');
    canvas.innerText=` Seems your browser doesn't support canvas, try use the latest chrome/edge maybe`
    canvas.style.height = '100%';
    canvas.style.width = '100%';
    canvas.style.position = 'absolute';
    canvas.style.zIndex = '-1';
    
    
    dom.appendChild(canvas);
    dom.style.overflow = 'hidden'
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });//创建渲染器
    renderer.shadowMap.enabled = true    	//阴影设置
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.77

    //光效设置
    const ambient = new THREE.AmbientLight(0xffffff,0.7);//环境光
    scene.add(ambient);

    //相机设置
    const camera = new THREE.PerspectiveCamera(			//透视相机，
      47, 			//fov，视野角度
      1, 				//视窗的高宽比
      1,			  //near,近面，距离相机小于0.1则不会被渲染。
      20000);		//far,远面，距离大于1000则不会被渲染
    camera.position.set(0, 1000, 100);                         //相机位置 
    camera.lookAt(0,1000,0);     

    const composer = new EffectComposer(renderer);
  
    const renderPass = new RenderPass(scene, camera);

    const effectFXAA = new ShaderPass( FXAAShader );
    composer.addPass(effectFXAA)
    composer.addPass(renderPass)
    
    window.addEventListener('resize', () => { this.resize() }, false); //resize也添加到window里
    window.addEventListener('mousemove', (e: MouseEvent) => { this.mousemove(e) })
    this.effectFXAA = effectFXAA
    this.composer = composer
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.genSky();
    this.genWater();
    this.updateSun(1.77,180)
    this.resize()
    return this;
  }

  animate() {
    this.composer.render()
    if (this.water) {
      this.water.material.uniforms['time'].value += 1.0 / 120.0;
    }
    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.00007;
    this.camera.position.y += (-this.mouseY - 77 - this.camera.position.y) * 0.00007;
    this.camera.lookAt(0, 0, 0);
    this.reqId = window.requestAnimationFrame(() => { this.animate() });
  }
  
  resize() {
    let height = this.winHeight
		let width = this.winWidth;
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
    this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / width, 1 / height );
  }
  mouseX: number = 0;
  mouseY: number = 0
  mousemove(e: MouseEvent) { 
    this.mouseX = e.clientX - this.winWidth / 2;
    this.mouseY = e.clientY - this.winWidth / 2
    
  }

  destructor() { 
    this.freeUp(this.scene)
    cancelAnimationFrame(this.reqId);
  }
  /**
   * 内存清理, 释放geometry, texture, material的缓冲区
   * @param {THREE.Scene} obj 
   */
  freeUp(obj: any) { 
    cancelAnimationFrame(this.reqId);
    obj.children.forEach((data: any) => { 

      if (data.children) this.freeUp(data);

      data.geometry?.dispose();

      if(data.material?.type ){
        data.material.dispose();
        data.material.map?.dispose();
        data.material.envMap?.dispose();
      }
    })
  }


  genSky(){
    const sky = new Sky();
    sky.scale.setScalar( 10000000 );
    const skyUniforms = sky.material.uniforms;
    skyUniforms[ 'turbidity' ].value = 3;
		skyUniforms[ 'rayleigh' ].value = 1;
		skyUniforms[ 'mieCoefficient' ].value = 0.005;
		skyUniforms[ 'mieDirectionalG' ].value = 0.8;
    skyUniforms[ 'sunPosition' ].value = new THREE.Vector3(-377, 100, 50)
    this.scene.add(sky);
    this.sky = sky;

  }

  genWater() { 
    const waterGeometry = new THREE.PlaneBufferGeometry( 100000, 100000 );
    const water = new Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('water.jpg', function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        } ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: this.scene.fog !== undefined
      }
    );
    water.material.uniforms['size'].value = 0.1
    water.material.uniforms['distortionScale'].value = 7
    water.position.setY(-1000)
    water.rotation.x = - Math.PI / 2;
    this.water = water;
    this.scene.add( water );
  }
  updateSun(elevation: number, azimuth: number) {

    const phi = THREE.MathUtils.degToRad( 90 - elevation );
    const theta = THREE.MathUtils.degToRad( azimuth );
    const sun = new THREE.Vector3()
    sun.setFromSphericalCoords( 1, phi, theta );

    this.sky.material.uniforms['sunPosition'].value.copy(sun);
    if (this.water) {
      this.water.material.uniforms['sunDirection'].value.copy(sun).normalize();
    }
  }

};
export default OceanFactory