import * as THREE from 'three'
import 'three/examples/js/controls/OrbitControls'
import 'three/examples/js/loaders/OBJLoader'
import 'three/examples/js/loaders/MTLLoader'
import 'three/examples/js/loaders/DDSLoader'
import 'three/examples/js/renderers/CSS3DRenderer'
import { throttle } from 'lodash'
import model from '../model'

class AbstractApplication {
  constructor () {
    this._camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
    this._camera.position.x = 500
    this._camera.position.y = 300
    this._camera.position.z = 500

    this._scene = new THREE.Scene()


    this._cssRenderer = new THREE.CSS3DRenderer()
    this._cssRenderer.setSize(window.innerWidth, window.innerHeight)
    this._cssRenderer.domElement.style.position = 'absolute';
    this._cssRenderer.domElement.style.top	  = 0;
    this._cssRenderer.domElement.style.margin	  = 0;
    this._cssRenderer.domElement.style.padding  = 0;
    document.getElementById('css-canvas').appendChild(this._cssRenderer.domElement)

    this._renderer = new THREE.WebGLRenderer()
    this._renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    this._renderer.setClearColor(0x87CEFA);
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    document.getElementById('canvas').appendChild(this._renderer.domElement)

    this._cssScene = new THREE.Scene();

    this._controls = new THREE.OrbitControls(this._camera, this._renderer.domElement)
    this._controls.addEventListener('change', () => this.animate())
    this._controls.enableDamping = true
    this._controls.dampingFactor = 1.0
    this._controls.minPolarAngle = Math.PI / 20
    this._controls.maxPolarAngle = Math.PI / 2.2
    this._controls.minAzimuthAngle = -Math.PI / 2.5
    this._controls.maxAzimuthAngle = Math.PI / 2.5
    this._controls.enableZoom = false
    this._controls.enablePan = false
    this._controls.enableKeys = true

    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();

    let lastHovered = null;
    const move = throttle((e) => {
      e.preventDefault();
      let pointer = e.touches ? e.touches : [e];
      for (let i = 0, len = pointer.length; i < len; i++){
        let event = pointer[i];
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, this._camera );

        var intersects = raycaster.intersectObjects( this._scene.children );

        const item = intersects.find(i => typeof i.object.label !== 'undefined')

        if (item) {
          if (lastHovered !== item.object.label) {
            lastHovered = item.object.label
            model.setHoveredLabel(lastHovered)
          }
        } else {
          if (lastHovered !== null) {
            lastHovered = null
            model.setHoveredLabel(null)
          }
        }
      }
    }, 50)

    const click = (e) => {
      e.preventDefault();
      let pointer = e.touches ? e.touches : [e];
      for (let i = 0, len = pointer.length; i < len; i++){
        let event = pointer[i];
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, this._camera );

        var intersects = raycaster.intersectObjects( this._scene.children );

        const item = intersects.find(i => typeof i.object.label !== 'undefined')

        if (item) {
          model.clickBall(item.object.label[0], item.object.label[1])
        }
      }
    }

    this._renderer.domElement.addEventListener('mousemove', move);
    this._renderer.domElement.addEventListener('click', click);
    this._renderer.domElement.addEventListener('touchstart', click);
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  get renderer () {
    return this._renderer
  }

  get camera () {
    return this._camera
  }

  get scene () {
    return this._scene
  }

  onWindowResize () {
    this._camera.aspect = window.innerWidth / window.innerHeight
    this._camera.updateProjectionMatrix()
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._cssRenderer.setSize(window.innerWidth, window.innerHeight)
    this.animate()
  }

  animate () {
    this._renderer.render(this._scene, this._camera)
    this._cssRenderer.render(this._cssScene, this._camera)
  }
}

export default AbstractApplication
