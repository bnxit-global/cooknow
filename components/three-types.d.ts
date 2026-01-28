import { ThreeElements } from '@react-three/fiber'

declare global {
  namespace React {
    namespace JSX {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      interface IntrinsicElements extends ThreeElements {
        mesh: ThreeElements['mesh']
        meshStandardMaterial: ThreeElements['meshStandardMaterial']
        ambientLight: ThreeElements['ambientLight']
        pointLight: ThreeElements['pointLight']
        spotLight: ThreeElements['spotLight']
        group: ThreeElements['group']
        primitive: any
      }
    }
  }
}
