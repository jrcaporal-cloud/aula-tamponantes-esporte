import { Environment, Lightformer } from '@react-three/drei';
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

/*
 * Luz de estúdio e acabamento da imagem. O ambiente de reflexo é gerado na hora com painéis de luz
 * (Lightformer), sem arquivo HDR: a aula roda offline. Luz principal de cima e da frente, preenchimento
 * frio da esquerda, luz de recorte por trás (contorno da fibra e do capilar) e um brilho quente dentro
 * do corte. Pós-processamento leve: bloom só no que já brilha, tom neutro (não lava as cores da aula) e
 * vinheta suave.
 */

export const StudioLights = () => (
    <>
        <Environment resolution={128} frames={1}>
            <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 9, 9]} rotation-x={-Math.PI / 4} scale={[16, 5, 1]} />
            <Lightformer form="rect" intensity={1.1} color="#A5B4FC" position={[-12, 2, 4]} rotation-y={Math.PI / 2} scale={[10, 6, 1]} />
            <Lightformer form="rect" intensity={1.6} color="#E0F2FE" position={[6, 5, -12]} rotation-y={Math.PI} scale={[18, 3, 1]} />
            <Lightformer form="ring" intensity={1.2} color="#FDE2E4" position={[10, 0, 6]} rotation-y={-Math.PI / 2} scale={3} />
        </Environment>
        <ambientLight intensity={0.22} color="#c7d2fe" />
        <hemisphereLight args={['#e0e7ff', '#0b1020', 0.45]} />
        {/* principal */}
        <directionalLight position={[5, 14, 16]} intensity={2.1} color="#ffffff" />
        {/* preenchimento frio */}
        <directionalLight position={[-14, 3, 7]} intensity={0.75} color="#a5b4fc" />
        {/* recorte por trás: desenha o contorno */}
        <directionalLight position={[2, 9, -14]} intensity={2.4} color="#dbeafe" />
        <directionalLight position={[-6, -6, -10]} intensity={0.9} color="#f5d0fe" />
        {/* brilho quente dentro da fatia aberta */}
        <pointLight position={[0, 0.8, 2.4]} intensity={7} distance={9} decay={1.6} color="#fde2e4" />
    </>
);

export const Finish = ({ reduced }: { reduced: boolean }) => (
    <EffectComposer multisampling={2}>
        <Bloom mipmapBlur intensity={reduced ? 0.45 : 0.75} luminanceThreshold={0.62} luminanceSmoothing={0.22} radius={0.72} />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
        <Vignette offset={0.28} darkness={0.55} />
    </EffectComposer>
);
