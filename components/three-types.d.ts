import { ThreeElements } from '@react-three/fiber'

declare global {
  namespace React {
    namespace JSX {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      interface IntrinsicElements extends ThreeElements {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mesh: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        meshStandardMaterial: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ambientLight: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pointLight: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spotLight: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        group: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        color: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fog: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        primitive: any
      }
    }
  }
}
